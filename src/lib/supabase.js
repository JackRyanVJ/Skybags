import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://zocvgaubtabpgknzpzyx.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3ZnYXVidGFicGdrbnpwenl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTY4NTgsImV4cCI6MjEwMjQ3Mjg1OH0.C1ofDO0Y5J4wRU4tkT885wwuU9bWr8nj_44PLdMSwA0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Convert database snake_case row to React camelCase product object
export const mapDbProductToApp = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryName: row.category_name || (row.category === 'backpacks' ? 'Backpacks' : row.category === 'suitcases' ? 'Suitcases' : 'Duffel Bags'),
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discount: Number(row.discount || 0),
    rating: Number(row.rating || 4.8),
    reviewsCount: Number(row.reviews_count || 150),
    badge: row.badge,
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    isBestseller: Boolean(row.is_bestseller),
    isOffer: Boolean(row.is_offer),
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [row.image],
    colors: Array.isArray(row.colors) ? row.colors : [],
    capacity: row.capacity || '30 L',
    capacityValue: Number(row.capacity_value || 30),
    laptopCompartment: row.laptop_compartment || '15.6" Sleeve',
    laptopSizeValue: Number(row.laptop_size_value || 15.6),
    waterproof: row.waterproof || 'Water Resistant',
    isWaterproof: Boolean(row.is_waterproof),
    warranty: row.warranty || '1 Year International Warranty',
    dimensions: row.dimensions || '48 x 33 x 20 cm',
    weight: row.weight || '600g',
    material: row.material || 'Tough Polyester',
    idealFor: row.ideal_for || 'College & Commute',
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    isActive: row.is_active !== false,
    updatedAt: row.updated_at
  };
};

// Convert React camelCase product object to database snake_case row
export const mapAppProductToDb = (appProd) => {
  return {
    id: appProd.id,
    name: appProd.name,
    category: appProd.category,
    category_name: appProd.categoryName || (appProd.category === 'backpacks' ? 'Backpacks' : appProd.category === 'suitcases' ? 'Suitcases' : 'Duffel Bags'),
    price: Number(appProd.price),
    original_price: Number(appProd.originalPrice),
    discount: Number(appProd.discount || Math.round(((appProd.originalPrice - appProd.price) / appProd.originalPrice) * 100)),
    rating: Number(appProd.rating || 4.8),
    reviews_count: Number(appProd.reviewsCount || 150),
    badge: appProd.badge || null,
    is_new: Boolean(appProd.isNew),
    is_featured: Boolean(appProd.isFeatured),
    is_bestseller: Boolean(appProd.isBestseller),
    is_offer: Boolean(appProd.isOffer),
    image: appProd.image,
    images: appProd.images || [appProd.image],
    colors: appProd.colors || [],
    capacity: appProd.capacity || '30 L',
    capacity_value: Number(appProd.capacityValue || 30),
    laptop_compartment: appProd.laptopCompartment || '15.6" Sleeve',
    laptop_size_value: Number(appProd.laptopSizeValue || 15.6),
    waterproof: appProd.waterproof || 'Water Resistant',
    is_waterproof: Boolean(appProd.isWaterproof),
    warranty: appProd.warranty || '1 Year International Warranty',
    dimensions: appProd.dimensions || '48 x 33 x 20 cm',
    weight: appProd.weight || '600g',
    material: appProd.material || 'Tough Polyester',
    ideal_for: appProd.idealFor || 'College & Commute',
    description: appProd.description || '',
    features: appProd.features || [],
    tags: appProd.tags || [],
    is_active: appProd.isActive !== false,
    updated_at: new Date().toISOString()
  };
};

// 1. Fetch all products from Supabase
export const fetchProductsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase product fetch failed, using fallback:', error.message);
      return null;
    }
    if (!data || data.length === 0) return null;
    return data.map(mapDbProductToApp);
  } catch (err) {
    console.warn('Supabase product fetch exception:', err);
    return null;
  }
};

// 2. Update product in Supabase (price, discount, details)
export const updateProductInSupabase = async (productId, updates) => {
  try {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
    if (updates.originalPrice !== undefined) dbUpdates.original_price = Number(updates.originalPrice);
    if (updates.discount !== undefined) dbUpdates.discount = Number(updates.discount);
    if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
    if (updates.isNew !== undefined) dbUpdates.is_new = Boolean(updates.isNew);
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = Boolean(updates.isFeatured);
    if (updates.isBestseller !== undefined) dbUpdates.is_bestseller = Boolean(updates.isBestseller);
    if (updates.isOffer !== undefined) dbUpdates.is_offer = Boolean(updates.isOffer);
    if (updates.capacity !== undefined) dbUpdates.capacity = updates.capacity;
    if (updates.laptopCompartment !== undefined) dbUpdates.laptop_compartment = updates.laptopCompartment;
    if (updates.waterproof !== undefined) dbUpdates.waterproof = updates.waterproof;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.isActive !== undefined) dbUpdates.is_active = Boolean(updates.isActive);
    
    // Always auto-compute discount if price & originalPrice exist
    if (updates.price && updates.originalPrice) {
      dbUpdates.discount = Math.max(0, Math.round(((Number(updates.originalPrice) - Number(updates.price)) / Number(updates.originalPrice)) * 100));
    }
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', productId)
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] ? mapDbProductToApp(data[0]) : null };
  } catch (err) {
    console.error('Failed to update product in Supabase:', err);
    return { success: false, error: err.message };
  }
};

// 3. Add new product to Supabase
export const addProductToSupabase = async (productData) => {
  try {
    const dbPayload = mapAppProductToDb(productData);
    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] ? mapDbProductToApp(data[0]) : null };
  } catch (err) {
    console.error('Failed to add product to Supabase:', err);
    return { success: false, error: err.message };
  }
};

// 4. Delete product from Supabase
export const deleteProductInSupabase = async (productId) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Failed to delete product in Supabase:', err);
    return { success: false, error: err.message };
  }
};

// 5. Record user login into Supabase user_logins table
export const recordUserLoginToSupabase = async (user) => {
  if (!user || !user.email) return;
  try {
    const payload = {
      name: user.name || 'Student User',
      email: user.email,
      phone: user.phone || '9876543210',
      college: user.college || 'Mumbai University (BBA Dept)',
      student_id: user.studentId || 'MUM-2024-BBA-089',
      is_student_verified: user.isStudentVerified !== false,
      auth_provider: user.authProvider || (user.isGoogle ? 'Google OAuth' : 'Email / Password'),
      logged_in_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_logins')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Could not record user login in Supabase:', error.message);
    } else {
      console.log('User login captured in Supabase:', payload.name, payload.email);
    }
  } catch (err) {
    console.warn('recordUserLoginToSupabase error:', err);
  }
};

// 6. Fetch all user logins from Supabase for Admin Portal
export const fetchUserLoginsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('user_logins')
      .select('*')
      .order('logged_in_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to fetch user logins:', err);
    return [];
  }
};

// 7. Record order into Supabase orders table
export const recordOrderToSupabase = async (order) => {
  try {
    const payload = {
      id: order.id,
      contact_name: order.shippingDetails?.fullName || order.contactName || 'Customer',
      contact_phone: order.shippingDetails?.phone || order.contactPhone || '+91 9876543210',
      contact_email: order.shippingDetails?.email || order.contactEmail || 'user@example.com',
      shipping_address: order.shippingAddress || (order.shippingDetails ? `${order.shippingDetails.flatNo}, ${order.shippingDetails.street}, ${order.shippingDetails.city}, ${order.shippingDetails.state} - ${order.shippingDetails.pincode}` : 'Standard Delivery Address'),
      payment_method: order.paymentMethod || 'Razorpay Online',
      razorpay_payment_id: order.razorpayPaymentId || order.razorpay_payment_id || null,
      items: order.items || [],
      total_amount: Number(order.totalAmount || 0),
      status: order.status || 'Order Confirmed',
      status_step: Number(order.statusStep || 1),
      courier: order.courier || 'Delhivery Air Express',
      expected_delivery: order.expectedDelivery || 'Within 3-4 days',
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('orders')
      .insert([payload]);

    if (error) console.warn('Could not record order in Supabase:', error.message);
  } catch (err) {
    console.warn('recordOrderToSupabase error:', err);
  }
};

// 8. Fetch all orders for Admin Portal
export const fetchOrdersFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      date: new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: row.contact_name,
      contactPhone: row.contact_phone,
      contactEmail: row.contact_email,
      shippingAddress: row.shipping_address,
      paymentMethod: row.payment_method,
      items: Array.isArray(row.items) ? row.items : [],
      totalAmount: Number(row.total_amount),
      status: row.status,
      statusStep: Number(row.status_step || 1),
      courier: row.courier,
      expectedDelivery: row.expected_delivery,
      cancelReason: row.cancel_reason,
      cancelledOn: row.cancelled_on ? new Date(row.cancelled_on).toLocaleDateString('en-IN') : null,
      refundStatus: row.refund_status
    }));
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    return [];
  }
};

// 9. Update order status / cancel order in Supabase
export const updateOrderStatusInSupabase = async (orderId, status, cancelReason = null) => {
  try {
    const updates = {
      status,
      status_step: status === 'Delivered' ? 5 : (status === 'Cancelled' ? 0 : 3)
    };
    if (cancelReason) {
      updates.cancel_reason = cancelReason;
      updates.cancelled_on = new Date().toISOString();
      updates.refund_status = 'Full 100% refund initiated to original payment source.';
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Failed to update order status in Supabase:', err);
    return { success: false, error: err.message };
  }
};
