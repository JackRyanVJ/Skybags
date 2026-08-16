const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zocvgaubtabpgknzpzyx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3ZnYXVidGFicGdrbnpwenl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTY4NTgsImV4cCI6MjEwMjQ3Mjg1OH0.C1ofDO0Y5J4wRU4tkT885wwuU9bWr8nj_44PLdMSwA0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase REST Client...');
  
  // 1. Read products
  const { data: products, error: prodErr } = await supabase.from('products').select('*').limit(3);
  if (prodErr) console.error('Prod error:', prodErr);
  else console.log('Successfully read products:', products.length, 'First product:', products[0]?.name, 'Price:', products[0]?.price);

  // 2. Read users
  const { data: users, error: userErr } = await supabase.from('user_logins').select('*').order('logged_in_at', { ascending: false });
  if (userErr) console.error('User error:', userErr);
  else console.log('Successfully read user logins:', users.length, 'Latest user:', users[0]?.name, users[0]?.email);

  // 3. Read orders
  const { data: orders, error: orderErr } = await supabase.from('orders').select('*');
  if (orderErr) console.error('Order error:', orderErr);
  else console.log('Successfully read orders:', orders.length, 'Order #:', orders[0]?.id);
}

testSupabase();
