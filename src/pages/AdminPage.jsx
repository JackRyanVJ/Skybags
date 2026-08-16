import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  updateProductInSupabase, 
  addProductToSupabase, 
  deleteProductInSupabase, 
  fetchUserLoginsFromSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase
} from '../lib/supabase';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Package, 
  Users, 
  Layers, 
  Search, 
  Edit2, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  TrendingUp,
  Database,
  Eye,
  LogOut
} from 'lucide-react';

export const AdminPage = () => {
  const { products, setProducts, showToast, setActiveTab } = useShop();

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('skybags_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs: 'products', 'users', 'orders', 'overview'
  const [activeAdminTab, setActiveAdminTab] = useState('products');

  // Products Tab State
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [savingProductId, setSavingProductId] = useState(null);

  // Inline Quick Price Edits Map: { [productId]: { price, originalPrice } }
  const [quickPrices, setQuickPrices] = useState({});

  // Users Tab State (Supabase Live Logins)
  const [userLogins, setUserLogins] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Orders Tab State (Supabase Orders)
  const [adminOrders, setAdminOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    id: `bp-${Date.now().toString().slice(-4)}`,
    name: '',
    category: 'backpacks',
    categoryName: 'Backpacks',
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    badge: 'NEW ARRIVAL',
    capacity: '32 L',
    capacityValue: 32,
    laptopCompartment: '15.6" Padded Sleeve',
    laptopSizeValue: 15.6,
    waterproof: 'Water Resistant Coated Ripstop',
    isWaterproof: true,
    warranty: '1 Year International Warranty',
    image: 'https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/backpacks/backpack_1.jpg',
    description: 'Latest high-performance Skybags design.',
    features: ['Dedicated Padded Laptop Sleeve', 'Ergonomic Air Mesh Backing', 'Water-Resistant Shell']
  });

  // Load User Logins from Supabase
  const loadUserLogins = async () => {
    setIsLoadingUsers(true);
    const data = await fetchUserLoginsFromSupabase();
    setUserLogins(data);
    setIsLoadingUsers(false);
  };

  // Load Orders from Supabase
  const loadAdminOrders = async () => {
    setIsLoadingOrders(true);
    const data = await fetchOrdersFromSupabase();
    setAdminOrders(data);
    setIsLoadingOrders(false);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadUserLogins();
      loadAdminOrders();
    }
  }, [isAdminAuthenticated]);

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'Admin' && password === 'Sky123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('skybags_admin_auth', 'true');
      setLoginError('');
      showToast('Welcome to Skybags Admin Portal! 🛡️');
    } else {
      setLoginError('Invalid credentials. Username is "Admin" and password is "Sky123".');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('skybags_admin_auth');
    showToast('Logged out of Admin Portal', 'info');
  };

  // Quick Inline Price Change
  const handleQuickPriceChange = (productId, field, value) => {
    setQuickPrices(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: Number(value) || 0
      }
    }));
  };

  // Save Quick Price to Supabase
  const handleSaveQuickPrice = async (prod) => {
    const editValues = quickPrices[prod.id];
    if (!editValues) return;

    const newPrice = editValues.price !== undefined ? editValues.price : prod.price;
    const newOriginalPrice = editValues.originalPrice !== undefined ? editValues.originalPrice : prod.originalPrice;

    if (newPrice <= 0 || newOriginalPrice <= 0) {
      showToast('Price must be greater than 0', 'error');
      return;
    }

    setSavingProductId(prod.id);
    const newDiscount = Math.max(0, Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100));

    const res = await updateProductInSupabase(prod.id, {
      price: newPrice,
      originalPrice: newOriginalPrice,
      discount: newDiscount
    });

    setSavingProductId(null);

    if (res.success) {
      setProducts(prev => prev.map(p => {
        if (p.id === prod.id) {
          return {
            ...p,
            price: newPrice,
            originalPrice: newOriginalPrice,
            discount: newDiscount
          };
        }
        return p;
      }));

      setQuickPrices(prev => {
        const next = { ...prev };
        delete next[prod.id];
        return next;
      });

      showToast(`Updated pricing for ${prod.name} in Supabase! ⚡`);
    } else {
      showToast(`Failed to update price: ${res.error}`, 'error');
    }
  };

  // Save Full Product Edits (Modal)
  const handleSaveFullProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingProductId(editingProduct.id);
    const discountVal = Math.max(0, Math.round(((Number(editingProduct.originalPrice) - Number(editingProduct.price)) / Number(editingProduct.originalPrice)) * 100));

    const res = await updateProductInSupabase(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      originalPrice: Number(editingProduct.originalPrice),
      discount: discountVal,
      badge: editingProduct.badge || null,
      capacity: editingProduct.capacity,
      laptopCompartment: editingProduct.laptopCompartment,
      waterproof: editingProduct.waterproof,
      description: editingProduct.description,
      isActive: editingProduct.isActive !== false
    });

    setSavingProductId(null);

    if (res.success) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, discount: discountVal } : p));
      setEditingProduct(null);
      showToast('Product updated successfully in Supabase! 🚀');
    } else {
      showToast(`Error updating product: ${res.error}`, 'error');
    }
  };

  // Add New Product to Supabase
  const handleCreateNewProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const discountVal = Math.max(0, Math.round(((Number(newProductForm.originalPrice) - Number(newProductForm.price)) / Number(newProductForm.originalPrice)) * 100));
    const payload = {
      ...newProductForm,
      price: Number(newProductForm.price),
      originalPrice: Number(newProductForm.originalPrice),
      discount: discountVal
    };

    const res = await addProductToSupabase(payload);
    if (res.success && res.data) {
      setProducts(prev => [res.data, ...prev]);
      setIsAddingNewProduct(false);
      showToast(`Added "${newProductForm.name}" to Supabase Catalog! ✨`);
    } else {
      showToast(`Failed to add product: ${res.error}`, 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from Supabase database?`)) {
      return;
    }
    const res = await deleteProductInSupabase(productId);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast(`Deleted ${name} from Supabase`, 'info');
    } else {
      showToast(`Delete failed: ${res.error}`, 'error');
    }
  };

  // Update Order Status in Supabase
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await updateOrderStatusInSupabase(orderId, newStatus);
    if (res.success) {
      setAdminOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order #${orderId} marked as ${newStatus}`);
    } else {
      showToast('Could not update order status in Supabase', 'error');
    }
  };

  // Export User Logins to CSV
  const exportUsersToCSV = () => {
    if (userLogins.length === 0) {
      showToast('No user logins to export', 'error');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'College / University', 'Student ID', 'Auth Provider', 'Login Timestamp'];
    const rows = userLogins.map(u => [
      `"${u.name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      `"${u.college || ''}"`,
      `"${u.student_id || ''}"`,
      `"${u.auth_provider || ''}"`,
      `"${new Date(u.logged_in_at).toLocaleString('en-IN')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skybags_users_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported customer leads CSV! 📊');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchesQuery = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                         p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
                         (p.badge && p.badge.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Filtered Users
  const filteredUsers = userLogins.filter(u => {
    const q = userSearch.toLowerCase();
    return (u.name && u.name.toLowerCase().includes(q)) ||
           (u.email && u.email.toLowerCase().includes(q)) ||
           (u.college && u.college.toLowerCase().includes(q)) ||
           (u.phone && u.phone.includes(q));
  });

  // Filtered Orders
  const filteredOrders = adminOrders.filter(o => {
    const q = orderSearch.toLowerCase();
    return (o.id && o.id.toLowerCase().includes(q)) ||
           (o.customerName && o.customerName.toLowerCase().includes(q)) ||
           (o.contactEmail && o.contactEmail.toLowerCase().includes(q));
  });

  // ================= 1. ADMIN LOGIN GATEWAY =================
  if (!isAdminAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: '#0a1f38' }}>
        <div style={{ 
          background: '#ffffff', 
          width: '100%', 
          maxWidth: '440px', 
          borderRadius: '20px', 
          padding: '2.5rem', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '1px solid rgba(250, 204, 21, 0.3)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #0a1f38 0%, #0066cc 100%)', 
              color: '#facc15', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(0, 102, 204, 0.3)'
            }}>
              <ShieldCheck size={32} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0a1f38', letterSpacing: '-0.5px' }}>
              Skybags Admin Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Secure Database & Realtime Product Pricing Control
            </p>
          </div>

          {loginError && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#b91c1c', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.82rem', 
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="form-field" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700, color: '#0f172a' }}>Admin Username</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter username (Admin)" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required 
                />
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: 700, color: '#0f172a' }}>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter password (Sky123)" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  required 
                />
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 800, justifyContent: 'center', background: '#0a1f38', color: '#facc15' }}
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div style={{ marginTop: '1.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '10px 14px', fontSize: '0.78rem', color: '#475569' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>🔑 Required Credentials:</div>
            <div>Username: <code style={{ fontWeight: 700, color: '#0066cc' }}>Admin</code></div>
            <div>Password: <code style={{ fontWeight: 700, color: '#0066cc' }}>Sky123</code></div>
            <button 
              type="button" 
              style={{ marginTop: '6px', color: '#0066cc', fontWeight: 800, fontSize: '0.75rem', textDecoration: 'underline' }}
              onClick={() => { setUsername('Admin'); setPassword('Sky123'); }}
            >
              Autofill Credentials
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('home')}
              style={{ fontSize: '0.82rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              ← Back to Skybags Home Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. AUTHENTICATED ADMIN DASHBOARD =================
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Top Admin Navigation Header */}
      <div style={{ background: '#0a1f38', color: '#fff', borderBottom: '2px solid #facc15' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#facc15', color: '#0a1f38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Skybags Admin Control Portal
                <span style={{ fontSize: '0.68rem', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '2px 8px', borderRadius: '999px', border: '1px solid rgba(250, 204, 21, 0.4)' }}>
                  v2.0 SUPABASE LIVE
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={12} color="#4ade80" /> Connected to Supabase (ap-south-1) • Logged in as <strong>Admin</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('home')}
              className="btn-secondary"
              style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <Eye size={14} /> View Store
            </button>
            <button 
              onClick={handleAdminLogout}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="container" style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '0 1rem' }}>
          {[
            { id: 'products', label: `🎒 Products & Pricing (${products.length})`, icon: Layers },
            { id: 'users', label: `👥 Logged-in Users & Leads (${userLogins.length})`, icon: Users },
            { id: 'orders', label: `📦 Orders & Tracking (${adminOrders.length})`, icon: Package },
            { id: 'overview', label: '📊 System Analytics', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: isActive ? '#0a1f38' : '#cbd5e1',
                  background: isActive ? '#f8fafc' : 'transparent',
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #facc15' : '3px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? '#0066cc' : 'currentColor'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <div className="container" style={{ marginTop: '2rem' }}>
        
        {/* ================= TAB 1: PRODUCTS & PRICING MANAGEMENT ================= */}
        {activeAdminTab === 'products' && (
          <div>
            {/* Action Bar */}
            <div style={{ 
              background: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'backpacks', label: 'Backpacks (₹1k - ₹2.5k)' },
                  { id: 'suitcases', label: 'Suitcases (₹5k - ₹15k)' },
                  { id: 'duffels', label: 'Duffel Bags (₹3k - ₹5k)' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: selectedCategoryFilter === cat.id ? '#0066cc' : '#f1f5f9',
                      color: selectedCategoryFilter === cat.id ? '#ffffff' : '#475569',
                      border: 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search & Add Product */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search product name, ID, badge..." 
                    className="form-input"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ paddingLeft: '32px', fontSize: '0.82rem', width: '240px' }}
                  />
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#16a34a' }}
                  onClick={() => setIsAddingNewProduct(true)}
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                      <th style={{ padding: '12px 16px' }}>Product</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Selling Price (₹)</th>
                      <th style={{ padding: '12px 16px' }}>MRP / Original (₹)</th>
                      <th style={{ padding: '12px 16px' }}>Discount</th>
                      <th style={{ padding: '12px 16px' }}>Specs (Capacity / Tech)</th>
                      <th style={{ padding: '12px 16px' }}>Badge</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => {
                        const hasQuickEdit = quickPrices[prod.id] !== undefined;
                        const currentPrice = hasQuickEdit && quickPrices[prod.id].price !== undefined ? quickPrices[prod.id].price : prod.price;
                        const currentOrigPrice = hasQuickEdit && quickPrices[prod.id].originalPrice !== undefined ? quickPrices[prod.id].originalPrice : prod.originalPrice;
                        const computedDiscount = Math.max(0, Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100));

                        return (
                          <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            {/* Product Info */}
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={prod.image} alt={prod.name} style={{ width: '42px', height: '42px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                                <div>
                                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{prod.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {prod.id}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ 
                                background: prod.category === 'backpacks' ? '#eff6ff' : prod.category === 'suitcases' ? '#fdf2f8' : '#f0fdf4',
                                color: prod.category === 'backpacks' ? '#1d4ed8' : prod.category === 'suitcases' ? '#be185d' : '#15803d',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                {prod.category}
                              </span>
                            </td>

                            {/* Inline Selling Price */}
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 700, color: '#64748b' }}>₹</span>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={currentPrice}
                                  onChange={(e) => handleQuickPriceChange(prod.id, 'price', e.target.value)}
                                  style={{ width: '90px', padding: '4px 8px', fontWeight: 800, fontSize: '0.85rem' }}
                                />
                              </div>
                            </td>

                            {/* Inline Original Price */}
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 700, color: '#64748b' }}>₹</span>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  value={currentOrigPrice}
                                  onChange={(e) => handleQuickPriceChange(prod.id, 'originalPrice', e.target.value)}
                                  style={{ width: '90px', padding: '4px 8px', fontSize: '0.85rem' }}
                                />
                              </div>
                            </td>

                            {/* Discount */}
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                {computedDiscount}% OFF
                              </span>
                            </td>

                            {/* Specs */}
                            <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#475569' }}>
                              <div><strong>Cap:</strong> {prod.capacity || '30L'}</div>
                              <div><strong>Fit:</strong> {prod.laptopCompartment || 'Standard'}</div>
                            </td>

                            {/* Badge */}
                            <td style={{ padding: '12px 16px' }}>
                              {prod.badge ? (
                                <span style={{ background: '#facc15', color: '#0a1f38', fontSize: '0.7rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                                  {prod.badge}
                                </span>
                              ) : (
                                <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>None</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
                                {hasQuickEdit && (
                                  <button 
                                    onClick={() => handleSaveQuickPrice(prod)}
                                    disabled={savingProductId === prod.id}
                                    style={{
                                      background: '#16a34a',
                                      color: '#ffffff',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '6px 10px',
                                      fontSize: '0.75rem',
                                      fontWeight: 800,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <Check size={13} /> {savingProductId === prod.id ? 'Saving...' : 'Save Price'}
                                  </button>
                                )}
                                <button 
                                  onClick={() => setEditingProduct(prod)}
                                  style={{
                                    background: '#f1f5f9',
                                    color: '#0f172a',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Edit2 size={13} /> Full Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  style={{ color: '#ef4444', background: 'transparent', border: 'none', padding: '6px' }}
                                  title="Delete Product"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LOGGED-IN USERS & LEADS DIRECTORY ================= */}
        {activeAdminTab === 'users' && (
          <div>
            <div style={{ 
              background: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Customer Logins & Student Leads Directory
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Live synchronized from Supabase <code>user_logins</code> table. Captures every login from Home Page, Google Auth, Email, and Mobile OTP.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search name, email, college..." 
                    className="form-input"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ paddingLeft: '32px', fontSize: '0.82rem', width: '240px' }}
                  />
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={loadUserLogins}
                  disabled={isLoadingUsers}
                >
                  <RefreshCw size={14} className={isLoadingUsers ? 'animate-spin' : ''} /> Refresh
                </button>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#0a1f38', color: '#facc15' }}
                  onClick={exportUsersToCSV}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                      <th style={{ padding: '12px 16px' }}>User Name</th>
                      <th style={{ padding: '12px 16px' }}>Email ID</th>
                      <th style={{ padding: '12px 16px' }}>Mobile No.</th>
                      <th style={{ padding: '12px 16px' }}>College / University</th>
                      <th style={{ padding: '12px 16px' }}>Student ID</th>
                      <th style={{ padding: '12px 16px' }}>Login Method</th>
                      <th style={{ padding: '12px 16px' }}>Logged-in At (Supabase)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                          {isLoadingUsers ? 'Loading user logins from Supabase...' : 'No user logins recorded yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', color: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                {u.name ? u.name.slice(0, 2).toUpperCase() : 'US'}
                              </div>
                              {u.name || 'Anonymous User'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#0066cc', fontWeight: 600 }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#475569' }}>
                            {u.phone ? `+91 ${u.phone}` : '—'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>
                            {u.college || 'Mumbai University (BBA Dept)'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                            <code>{u.student_id || 'MUM-2024-BBA-089'}</code>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ 
                              background: u.auth_provider?.includes('Google') ? '#fef3c7' : '#eff6ff',
                              color: u.auth_provider?.includes('Google') ? '#92400e' : '#1d4ed8',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {u.auth_provider || 'Email / Password'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                            {new Date(u.logged_in_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS & TRACKING ================= */}
        {activeAdminTab === 'orders' && (
          <div>
            <div style={{ 
              background: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Orders & Live Fulfillment
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Realtime orders placed across India with status tracking & cancellations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search Order ID, customer..." 
                    className="form-input"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    style={{ paddingLeft: '32px', fontSize: '0.82rem', width: '240px' }}
                  />
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={loadAdminOrders}
                >
                  <RefreshCw size={14} /> Refresh Orders
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                      <th style={{ padding: '12px 16px' }}>Order ID</th>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Customer</th>
                      <th style={{ padding: '12px 16px' }}>Items</th>
                      <th style={{ padding: '12px 16px' }}>Amount</th>
                      <th style={{ padding: '12px 16px' }}>Payment Mode</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                          No customer orders recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0066cc' }}>
                            {order.id}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.78rem' }}>
                            {order.date}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0f172a' }}>{order.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{order.contactPhone}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                              {order.items?.length || 1} Item(s)
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                            {formatPrice(order.totalAmount)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.78rem' }}>
                            {order.paymentMethod}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ 
                              background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#eff6ff',
                              color: order.status === 'Delivered' ? '#15803d' : order.status === 'Cancelled' ? '#b91c1c' : '#1d4ed8',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <select 
                              className="form-select"
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{ width: '130px', padding: '4px 6px', fontSize: '0.75rem' }}
                            >
                              <option value="Order Confirmed">Order Confirmed</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SYSTEM ANALYTICS ================= */}
        {activeAdminTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Catalog Products</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0a1f38', marginTop: '4px' }}>{products.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>✓ 100% Synced with Supabase</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Logged-in Customer Leads</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0066cc', marginTop: '4px' }}>{userLogins.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Google / Email / Mobile OTP</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Orders Tracked</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', marginTop: '4px' }}>{adminOrders.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Pan-India delivery network</div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Database Status</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803d', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                  Supabase Live
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Region: AWS ap-south-1</div>
              </div>
            </div>

            {/* Quick Pricing Category Guide */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Skybags Target Price Range Rules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <h4 style={{ fontWeight: 800, color: '#1e40af' }}>🎒 Backpacks</h4>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>₹1,000 – ₹2,500</div>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>15.6" & 16" laptop compartments, waterproof coating, 25L–35L volume.</p>
                </div>
                <div style={{ background: '#fdf2f8', padding: '1rem', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
                  <h4 style={{ fontWeight: 800, color: '#9d174d' }}>🧳 Suitcases & Trolleys</h4>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#be185d', margin: '4px 0' }}>₹5,000 – ₹15,000</div>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>TSA combination locks, 360° spinner wheels, virgin polycarbonate.</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontWeight: 800, color: '#166534' }}>🏋️ Duffel Bags</h4>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803d', margin: '4px 0' }}>₹3,000 – ₹5,000</div>
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>Inline skate wheels, aluminium trolley, shoe garage, 45L–64L space.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: EDIT PRODUCT FULL DETAILS ================= */}
      {editingProduct && (
        <div className="drawer-backdrop" onClick={() => setEditingProduct(null)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={20} color="#0066cc" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Edit Product: {editingProduct.name}</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} style={{ color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFullProduct}>
              <div className="form-field">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Selling Price (₹ INR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Original / MRP (₹ INR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    required 
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Badge (e.g. BESTSELLER, TRENDING)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Capacity (e.g. 32 L / 65 L)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.capacity || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Laptop Fit Spec</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.laptopCompartment || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, laptopCompartment: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Waterproof Spec</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingProduct.waterproof || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, waterproof: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={savingProductId === editingProduct.id}
                >
                  {savingProductId === editingProduct.id ? 'Saving to Supabase...' : 'Save Changes to Supabase 🚀'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW PRODUCT ================= */}
      {isAddingNewProduct && (
        <div className="drawer-backdrop" onClick={() => setIsAddingNewProduct(false)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#16a34a" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Add New Skybags Product</h3>
              </div>
              <button onClick={() => setIsAddingNewProduct(false)} style={{ color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct}>
              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ 
                      ...newProductForm, 
                      category: e.target.value,
                      categoryName: e.target.value === 'backpacks' ? 'Backpacks' : e.target.value === 'suitcases' ? 'Suitcases' : 'Duffel Bags',
                      image: e.target.value === 'backpacks' ? 'https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/backpacks/backpack_1.jpg' : e.target.value === 'suitcases' ? 'https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/suitcases/suitcase_1.jpg' : 'https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/duffels/duffel_1.jpg'
                    })}
                  >
                    <option value="backpacks">Backpacks (College & Tech)</option>
                    <option value="suitcases">Suitcases & Trolleys (Travel)</option>
                    <option value="duffels">Duffel Bags (Gym & Weekender)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">Product ID</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newProductForm.id}
                    onChange={(e) => setNewProductForm({ ...newProductForm, id: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Product Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Skybags Street Glide 32L Backpack" 
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Selling Price (₹ INR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    required 
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Original / MRP (₹ INR)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                    required 
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">Capacity (e.g. 30 L / 65 L)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newProductForm.capacity}
                    onChange={(e) => setNewProductForm({ ...newProductForm, capacity: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Badge (e.g. NEW LOOK / BESTSELLER)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newProductForm.badge}
                    onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Laptop Fit Sleeve</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={newProductForm.laptopCompartment}
                  onChange={(e) => setNewProductForm({ ...newProductForm, laptopCompartment: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center', background: '#16a34a' }}>
                  Create & Save to Supabase 🚀
                </button>
                <button type="button" className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }} onClick={() => setIsAddingNewProduct(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
