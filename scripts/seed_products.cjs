const { Client } = require('pg');

async function seedData() {
  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.zocvgaubtabpgknzpzyx',
    password: 'YJTUYFkiQTq6mviP',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to PostgreSQL database for seeding...');

  // Read products from products.js (convert ESM export to JSON)
  const fs = require('fs');
  const productsJs = fs.readFileSync('c:/Users/varad/Downloads/TY BBA/Skybags/src/data/products.js', 'utf8');

  // Extract PRODUCTS array via regex/eval
  const productsMatch = productsJs.match(/export const PRODUCTS = (\[[\s\S]*?\]);\s*\n\s*\/\/ Available Coupon/);
  if (!productsMatch) {
    throw new Error('Could not parse PRODUCTS from src/data/products.js');
  }

  // Parse products
  const productsCode = 'const PRODUCTS = ' + productsMatch[1] + '; return PRODUCTS;';
  const products = new Function(productsCode)();
  console.log(`Parsed ${products.length} products to seed.`);

  // Upsert products into database
  for (const p of products) {
    await client.query(`
      INSERT INTO public.products (
        id, name, category, category_name, price, original_price, discount, rating, reviews_count,
        badge, is_new, is_featured, is_bestseller, is_offer, image, images, colors,
        capacity, capacity_value, laptop_compartment, laptop_size_value, waterproof, is_waterproof,
        warranty, dimensions, weight, material, ideal_for, description, features, tags, is_active, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23,
        $24, $25, $26, $27, $28, $29, $30, $31, $32, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        category_name = EXCLUDED.category_name,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        discount = EXCLUDED.discount,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        badge = EXCLUDED.badge,
        is_new = EXCLUDED.is_new,
        is_featured = EXCLUDED.is_featured,
        is_bestseller = EXCLUDED.is_bestseller,
        is_offer = EXCLUDED.is_offer,
        image = EXCLUDED.image,
        images = EXCLUDED.images,
        colors = EXCLUDED.colors,
        capacity = EXCLUDED.capacity,
        capacity_value = EXCLUDED.capacity_value,
        laptop_compartment = EXCLUDED.laptop_compartment,
        laptop_size_value = EXCLUDED.laptop_size_value,
        waterproof = EXCLUDED.waterproof,
        is_waterproof = EXCLUDED.is_waterproof,
        warranty = EXCLUDED.warranty,
        dimensions = EXCLUDED.dimensions,
        weight = EXCLUDED.weight,
        material = EXCLUDED.material,
        ideal_for = EXCLUDED.ideal_for,
        description = EXCLUDED.description,
        features = EXCLUDED.features,
        tags = EXCLUDED.tags,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    `, [
      p.id,
      p.name,
      p.category,
      p.categoryName || (p.category === 'backpacks' ? 'Backpacks' : p.category === 'suitcases' ? 'Suitcases' : 'Duffel Bags'),
      p.price,
      p.originalPrice,
      p.discount || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
      p.rating || 4.8,
      p.reviewsCount || 150,
      p.badge || null,
      Boolean(p.isNew),
      Boolean(p.isFeatured),
      Boolean(p.isBestseller),
      Boolean(p.isOffer),
      p.image,
      JSON.stringify(p.images || [p.image]),
      JSON.stringify(p.colors || []),
      p.capacity || '30 L',
      p.capacityValue || 30,
      p.laptopCompartment || '15.6" Sleeve',
      p.laptopSizeValue || 15.6,
      p.waterproof || 'Water Resistant',
      Boolean(p.isWaterproof),
      p.warranty || '1 Year International Warranty',
      p.dimensions || '48 x 33 x 20 cm',
      p.weight || '600g',
      p.material || 'Tough Polyester',
      p.idealFor || 'College & Commute',
      p.description || '',
      JSON.stringify(p.features || []),
      JSON.stringify(p.tags || []),
      true
    ]);
  }
  console.log('All 30 products seeded successfully!');

  // Seed sample student user logins
  const initialLogins = [
    {
      name: 'Varad Jadhav',
      email: 'varad.jadhav@mumbaiuniv.edu.in',
      phone: '9876543210',
      college: 'Mumbai University (BBA Dept)',
      student_id: 'MUM-2024-BBA-089',
      is_student_verified: true,
      auth_provider: 'Campus SSO / Demo Login',
      logged_in_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@iitb.ac.in',
      phone: '9823415678',
      college: 'IIT Bombay',
      student_id: 'IITB-2024-ME-102',
      is_student_verified: true,
      auth_provider: 'Google OAuth',
      logged_in_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      name: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@nmims.edu',
      phone: '9765432109',
      college: 'NMIMS Mumbai',
      student_id: 'NM-BBA-2025-44',
      is_student_verified: true,
      auth_provider: 'Email & Password',
      logged_in_at: new Date(Date.now() - 18000000).toISOString()
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@coep.ac.in',
      phone: '9123456780',
      college: 'COEP Technological University',
      student_id: 'COEP-CS-2024-032',
      is_student_verified: true,
      auth_provider: 'Mobile OTP',
      logged_in_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  for (const u of initialLogins) {
    await client.query(`
      INSERT INTO public.user_logins (
        name, email, phone, college, student_id, is_student_verified, auth_provider, logged_in_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING;
    `, [
      u.name,
      u.email,
      u.phone,
      u.college,
      u.student_id,
      u.is_student_verified,
      u.auth_provider,
      u.logged_in_at
    ]);
  }
  console.log('Sample user logins seeded!');

  // Seed sample initial orders
  const initialOrders = [
    {
      id: 'SKY-2026-9842',
      contact_name: 'Varad Jadhav',
      contact_phone: '+91 9876543210',
      contact_email: 'varad.jadhav@mumbaiuniv.edu.in',
      shipping_address: 'Room 304, Boys Hostel B, Mumbai University Kalina Campus, Santacruz East, Mumbai, Maharashtra - 400098',
      payment_method: 'UPI (GPay / Paytm)',
      items: JSON.stringify([
        {
          id: 'bp-2',
          name: 'Skybags Stealth Neon Street 30L Tech Pack',
          price: 1899,
          quantity: 1,
          image: '/images/backpacks/backpack_2.jpg',
          selectedColor: { name: 'Stealth Black & Lime', hex: '#161616' }
        }
      ]),
      total_amount: 1899,
      status: 'In Transit',
      status_step: 3,
      courier: 'Delhivery Air Express (Tracking #DL-94827510)',
      expected_delivery: 'Aug 19, 2026'
    },
    {
      id: 'SKY-2026-8910',
      contact_name: 'Varad Jadhav',
      contact_phone: '+91 9876543210',
      contact_email: 'varad.jadhav@mumbaiuniv.edu.in',
      shipping_address: 'B-402, Greenfield Residency, Kothrud, Pune, Maharashtra - 411038',
      payment_method: 'Credit Card (HDFC)',
      items: JSON.stringify([
        {
          id: 'sc-1',
          name: 'Skybags Boarding Pass Aero Soft Trolley (68cm)',
          price: 5999,
          quantity: 1,
          image: '/images/suitcases/suitcase_1.jpg',
          selectedColor: { name: 'Navy & Boarding Pass Orange', hex: '#1a365d' }
        }
      ]),
      total_amount: 5999,
      status: 'Delivered',
      status_step: 5,
      courier: 'Blue Dart Express (Tracking #BD-88401923)',
      expected_delivery: 'Aug 12, 2026'
    }
  ];

  for (const o of initialOrders) {
    await client.query(`
      INSERT INTO public.orders (
        id, contact_name, contact_phone, contact_email, shipping_address, payment_method,
        items, total_amount, status, status_step, courier, expected_delivery
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO NOTHING;
    `, [
      o.id,
      o.contact_name,
      o.contact_phone,
      o.contact_email,
      o.shipping_address,
      o.payment_method,
      o.items,
      o.total_amount,
      o.status,
      o.status_step,
      o.courier,
      o.expected_delivery
    ]);
  }
  console.log('Sample orders seeded!');

  // Verify counts
  const prodRes = await client.query('SELECT count(*) FROM public.products');
  const userRes = await client.query('SELECT count(*) FROM public.user_logins');
  const orderRes = await client.query('SELECT count(*) FROM public.orders');

  console.log(`Database counts -> Products: ${prodRes.rows[0].count}, Users: ${userRes.rows[0].count}, Orders: ${orderRes.rows[0].count}`);

  await client.end();
  console.log('Seeding completed successfully!');
}

seedData().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
