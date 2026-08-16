const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    host: 'aws-0-ap-south-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.zocvgaubtabpgknzpzyx',
    password: 'YJTUYFkiQTq6mviP',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to PostgreSQL database in Supabase ap-south-1!');

  // 1. Create products table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      category_name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      original_price NUMERIC NOT NULL,
      discount INTEGER DEFAULT 0,
      rating NUMERIC DEFAULT 4.8,
      reviews_count INTEGER DEFAULT 150,
      badge TEXT,
      is_new BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      is_bestseller BOOLEAN DEFAULT false,
      is_offer BOOLEAN DEFAULT false,
      image TEXT NOT NULL,
      images JSONB DEFAULT '[]'::jsonb,
      colors JSONB DEFAULT '[]'::jsonb,
      capacity TEXT,
      capacity_value INTEGER DEFAULT 30,
      laptop_compartment TEXT,
      laptop_size_value NUMERIC DEFAULT 15.6,
      waterproof TEXT,
      is_waterproof BOOLEAN DEFAULT true,
      warranty TEXT,
      dimensions TEXT,
      weight TEXT,
      material TEXT,
      ideal_for TEXT,
      description TEXT,
      features JSONB DEFAULT '[]'::jsonb,
      tags JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('products table created / verified');

  // 2. Create user_logins table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.user_logins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      college TEXT,
      student_id TEXT,
      is_student_verified BOOLEAN DEFAULT true,
      auth_provider TEXT DEFAULT 'Email',
      logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('user_logins table created / verified');

  // 3. Create orders table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.orders (
      id TEXT PRIMARY KEY,
      contact_name TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      contact_email TEXT,
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      total_amount NUMERIC NOT NULL,
      status TEXT DEFAULT 'Order Confirmed',
      status_step INTEGER DEFAULT 1,
      courier TEXT DEFAULT 'Delhivery Air Express',
      expected_delivery TEXT,
      cancel_reason TEXT,
      cancelled_on TIMESTAMP WITH TIME ZONE,
      refund_status TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  console.log('orders table created / verified');

  // 4. Enable Row Level Security (RLS) and create public policies
  await client.query(`
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Allow public read products" ON public.products;
    DROP POLICY IF EXISTS "Allow all updates products" ON public.products;
    DROP POLICY IF EXISTS "Allow all inserts products" ON public.products;
    DROP POLICY IF EXISTS "Allow all deletes products" ON public.products;
    
    DROP POLICY IF EXISTS "Allow public read user_logins" ON public.user_logins;
    DROP POLICY IF EXISTS "Allow all insert user_logins" ON public.user_logins;
    
    DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
    DROP POLICY IF EXISTS "Allow all insert orders" ON public.orders;
    DROP POLICY IF EXISTS "Allow all update orders" ON public.orders;

    -- Create open policies for seamless client-side interaction
    CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
    CREATE POLICY "Allow all updates products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
    CREATE POLICY "Allow all inserts products" ON public.products FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow all deletes products" ON public.products FOR DELETE USING (true);

    CREATE POLICY "Allow public read user_logins" ON public.user_logins FOR SELECT USING (true);
    CREATE POLICY "Allow all insert user_logins" ON public.user_logins FOR INSERT WITH CHECK (true);

    CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT USING (true);
    CREATE POLICY "Allow all insert orders" ON public.orders FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow all update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
  `);
  console.log('RLS and access policies configured');

  await client.end();
  console.log('Database setup completed successfully!');
}

setupDatabase().catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});
