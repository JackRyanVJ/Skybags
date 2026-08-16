const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://zocvgaubtabpgknzpzyx.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3ZnYXVidGFicGdrbnpwenl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5Njg1OCwiZXhwIjoyMTAyNDcyODU4fQ.woRdBxDMI-qWEPEWM1OoRPSVQEAF379oB7Ayr_dSEPA';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function uploadAllImages() {
  console.log('--- Starting Image Upload to Supabase Storage ---');

  // 1. Ensure bucket exists and is public
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets || !buckets.some(b => b.name === 'product-images')) {
    await supabaseAdmin.storage.createBucket('product-images', { public: true });
    console.log('Created product-images bucket.');
  } else {
    await supabaseAdmin.storage.updateBucket('product-images', { public: true });
    console.log('product-images bucket is public.');
  }

  // 2. Scan public/images directory
  const baseDir = path.join(__dirname, '..', 'public', 'images');
  const uploadedUrls = {};

  function scanFolder(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        scanFolder(fullPath, rel);
      } else if (entry.isFile() && (entry.name.endsWith('.jpg') || entry.name.endsWith('.png') || entry.name.endsWith('.jpeg') || entry.name.endsWith('.webp'))) {
        const fileBuffer = fs.readFileSync(fullPath);
        const contentType = entry.name.endsWith('.png') ? 'image/png' : 'image/jpeg';
        uploadedUrls[rel] = { fullPath, rel, fileBuffer, contentType };
      }
    }
  }

  scanFolder(baseDir);
  console.log(`Found ${Object.keys(uploadedUrls).length} image files to upload.`);

  // 3. Upload all files
  for (const [rel, info] of Object.entries(uploadedUrls)) {
    const storagePath = rel; // e.g. "backpacks/backpack_1.jpg"
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(storagePath, info.fileBuffer, {
        contentType: info.contentType,
        upsert: true
      });

    if (error) {
      console.error(`Failed to upload ${rel}:`, error.message);
    } else {
      const { data: urlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(storagePath);
      info.publicUrl = urlData.publicUrl;
      console.log(`✓ Uploaded ${rel} -> ${urlData.publicUrl}`);
    }
  }

  // 4. Update Supabase PostgreSQL database products with new CDN URLs
  console.log('\n--- Updating Database with CDN image URLs ---');
  const pgClient = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.zocvgaubtabpgknzpzyx',
    password: 'YJTUYFkiQTq6mviP',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await pgClient.connect();

  const prodRes = await pgClient.query('SELECT id, category, image, images FROM public.products');
  for (const p of prodRes.rows) {
    let newMainUrl = p.image;
    // Map /images/backpacks/backpack_1.jpg -> https://.../backpacks/backpack_1.jpg
    const match = p.image.replace(/^\/images\//, '');
    if (uploadedUrls[match] && uploadedUrls[match].publicUrl) {
      newMainUrl = uploadedUrls[match].publicUrl;
    }

    let newImages = [];
    if (Array.isArray(p.images)) {
      newImages = p.images.map(img => {
        const clean = img.replace(/^\/images\//, '');
        return (uploadedUrls[clean] && uploadedUrls[clean].publicUrl) ? uploadedUrls[clean].publicUrl : img;
      });
    } else {
      newImages = [newMainUrl];
    }

    await pgClient.query(
      'UPDATE public.products SET image = $1, images = $2, updated_at = NOW() WHERE id = $3',
      [newMainUrl, JSON.stringify(newImages), p.id]
    );
    console.log(`Updated ${p.id} -> ${newMainUrl}`);
  }

  await pgClient.end();
  console.log('--- All images uploaded and database updated successfully! ---');
}

uploadAllImages().catch(err => {
  console.error('Error during image upload:', err);
  process.exit(1);
});
