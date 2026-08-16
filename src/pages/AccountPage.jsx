import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { INDIAN_STATES } from '../data/indianLocations';
import { ProductCard } from '../components/ProductCard';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  GraduationCap, 
  LogOut, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download, 
  AlertCircle, 
  Ban, 
  RotateCcw, 
  X 
} from 'lucide-react';

export const AccountPage = () => {
  const { 
    products,
    user, 
    setUser, 
    orders, 
    cancelOrder, 
    wishlist, 
    savedAddresses, 
    setSavedAddresses, 
    moveWishlistToCart, 
    toggleWishlist,
    setActiveTab, 
    showToast 
  } = useShop();

  const [accountSubTab, setAccountSubTab] = useState('orders'); // orders, wishlist, addresses, student-perks
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Cancellation Modal State
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed mind / Placed order by mistake');

  const [newAddr, setNewAddr] = useState({
    type: 'College Hostel',
    fullName: user?.name || 'Varad Jadhav',
    phone: '9876543210',
    flatNo: '',
    street: '',
    landmark: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411007'
  });

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleConfirmCancel = () => {
    if (cancellingOrderId) {
      cancelOrder(cancellingOrderId, cancelReason);
      setCancellingOrderId(null);
    }
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.flatNo || !newAddr.street || !newAddr.pincode) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const created = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: false
    };
    setSavedAddresses(prev => [...prev, created]);
    setShowAddAddressModal(false);
    showToast('New Indian Delivery Address Saved!');
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address removed', 'info');
  };

  const handleSetDefaultAddress = (id) => {
    setSavedAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    showToast('Default address updated');
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
    setActiveTab('home');
  };

  return (
    <div className="container">
      <div className="account-layout">
        {/* Left Sidebar */}
        <aside className="account-sidebar-card">
          <div className="account-user-badge">
            <div className="user-avatar-circle">
              {user?.avatar || 'VJ'}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
              {user?.name || 'Varad Jadhav'}
            </h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', marginBottom: '8px' }}>
              <GraduationCap size={13} /> Student Verified ID
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {user?.college || 'Mumbai University (BBA Dept)'}
            </p>
          </div>

          <nav className="account-menu-nav">
            <button 
              className={`account-nav-item ${accountSubTab === 'orders' ? 'active' : ''}`}
              onClick={() => setAccountSubTab('orders')}
            >
              <Package size={17} /> Order History ({orders.length})
            </button>
            <button 
              className={`account-nav-item ${accountSubTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setAccountSubTab('wishlist')}
            >
              <Heart size={17} /> My Wishlist ({wishlist.length})
            </button>
            <button 
              className={`account-nav-item ${accountSubTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setAccountSubTab('addresses')}
            >
              <MapPin size={17} /> Saved Addresses ({savedAddresses.length})
            </button>
            <button 
              className={`account-nav-item ${accountSubTab === 'student-perks' ? 'active' : ''}`}
              onClick={() => setAccountSubTab('student-perks')}
            >
              <ShieldCheck size={17} /> Warranty & Student Perks
            </button>
            <button 
              className="account-nav-item" 
              style={{ color: '#ef4444', marginTop: '1rem' }}
              onClick={handleLogout}
            >
              <LogOut size={17} /> Log Out
            </button>
          </nav>
        </aside>

        {/* Right Main Content */}
        <main>
          {/* ORDERS TAB */}
          {accountSubTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Order History & Live Tracking</h2>
                <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Showing {orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Package size={48} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontWeight: 700 }}>No orders placed yet</p>
                </div>
              ) : (
                orders.map((order, idx) => (
                  <div key={order.id || idx} className="order-tracking-card">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase' }}>
                          Order ID: {order.id}
                        </span>
                        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                          Placed on: {order.date} • {order.paymentMethod}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          background: order.status === 'Delivered' ? '#dcfce7' : (order.status === 'Cancelled' ? '#fee2e2' : '#eff6ff'), 
                          color: order.status === 'Delivered' ? '#15803d' : (order.status === 'Cancelled' ? '#b91c1c' : '#0066cc'), 
                          fontSize: '0.75rem', 
                          fontWeight: 800, 
                          padding: '3px 10px', 
                          borderRadius: '999px' 
                        }}>
                          {order.status}
                        </span>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    </div>

                    {/* If Cancelled: Show Cancel Details & Refund Status */}
                    {order.status === 'Cancelled' ? (
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px' }}>
                          <Ban size={16} /> Order Cancelled on {order.cancelledOn || 'Recent Date'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#7f1d1d', marginBottom: '6px' }}>
                          <strong>Reason:</strong> {order.cancelReason || 'Customer requested cancellation'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                          ✓ {order.refundStatus || `Full refund of ${formatPrice(order.totalAmount)} initiated.`}
                        </div>
                      </div>
                    ) : (
                      /* Visual Tracking Progress Timeline for Active / Delivered Orders */
                      <div style={{ margin: '1.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                          {/* Connecting Line */}
                          <div style={{ position: 'absolute', top: '14px', left: '20px', right: '20px', height: '3px', background: '#e2e8f0', zIndex: 1 }}>
                            <div style={{ height: '100%', background: '#16a34a', width: `${((order.statusStep || 3) - 1) * 25}%` }} />
                          </div>

                          {[
                            { step: 1, title: 'Order Confirmed', sub: 'Verified' },
                            { step: 2, title: 'Packed at Hub', sub: 'Quality Checked' },
                            { step: 3, title: 'Dispatched', sub: 'Delhivery Air' },
                            { step: 4, title: 'Out for Delivery', sub: 'Local Hub' },
                            { step: 5, title: 'Delivered', sub: 'Signature Done' }
                          ].map((s) => (
                            <div key={s.step} className="tracking-step">
                              <div className={`step-bullet ${(order.statusStep || 3) >= s.step ? 'completed' : ''}`}>
                                {(order.statusStep || 3) >= s.step ? <CheckCircle2 size={16} /> : s.step}
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (order.statusStep || 3) >= s.step ? '#0f172a' : '#94a3b8', textAlign: 'center' }}>
                                {s.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order Details & Items */}
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                        <strong>Courier:</strong> {order.courier} • <strong>Delivery Address:</strong> {order.shippingAddress}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items.map((item, iIdx) => (
                          <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={item.product?.image || item.image} alt="Product" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            <div style={{ flex: 1, fontSize: '0.85rem' }}>
                              <strong>{item.product?.name || item.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Color: {item.selectedColor?.name || 'Default'} | Qty: {item.quantity}
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                              {formatPrice((item.product?.price || item.price) * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar (Cancel Order & Download Invoice) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      {/* Cancel Order Button: Available for active orders not delivered yet */}
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' ? (
                        <button 
                          onClick={() => setCancellingOrderId(order.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Ban size={14} /> Cancel This Order
                        </button>
                      ) : (
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {order.status === 'Delivered' ? '✓ Order Delivered & Verified' : 'Order Closed'}
                        </div>
                      )}

                      <button 
                        style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0066cc', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => showToast(`Downloaded Tax Invoice for #${order.id}! 📄`)}
                      >
                        <Download size={14} /> Download GST Tax Invoice (PDF)
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {accountSubTab === 'wishlist' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Wishlist</h2>
                <span style={{ fontSize: '0.88rem', color: '#64748b' }}>{wishlistedProducts.length} Items Saved</span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <Heart size={48} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ fontWeight: 800 }}>Your wishlist is empty</h4>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Save your favorite backpacks, travel trolleys, and gym duffels.
                  </p>
                  <button className="btn-primary" onClick={() => setActiveTab('shop')}>
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {wishlistedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {accountSubTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Saved Delivery Addresses</h2>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={() => setShowAddAddressModal(true)}
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {savedAddresses.map(addr => (
                  <div 
                    key={addr.id}
                    style={{
                      background: '#ffffff',
                      border: addr.isDefault ? '2px solid #0066cc' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {addr.type}
                      </span>
                      {addr.isDefault ? (
                        <span style={{ color: '#0066cc', fontWeight: 800, fontSize: '0.75rem' }}>✓ DEFAULT</span>
                      ) : (
                        <button 
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{addr.fullName}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
                      {addr.flatNo}, {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      📞 Phone: +91 {addr.phone}
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '12px', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddressModal && (
                <div className="drawer-backdrop" onClick={() => setShowAddAddressModal(false)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ background: '#fff', width: '100%', maxWidth: '520px', borderRadius: '16px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Add New Address (India)</h3>
                    <form onSubmit={handleSaveNewAddress}>
                      <div className="form-field">
                        <label className="form-label">Address Tag</label>
                        <select 
                          className="form-select"
                          value={newAddr.type}
                          onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                        >
                          <option value="College Campus / Hostel">College Campus / Hostel</option>
                          <option value="Home Residence">Home Residence</option>
                          <option value="Office / Internship">Office / Internship</option>
                        </select>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label className="form-label">Recipient Name</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={newAddr.fullName}
                            onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                            required 
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Mobile (+91)</label>
                          <input 
                            type="tel" 
                            className="form-input" 
                            value={newAddr.phone}
                            onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                            required 
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label">Flat / Room / Building</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={newAddr.flatNo}
                          onChange={(e) => setNewAddr({ ...newAddr, flatNo: e.target.value })}
                          required 
                        />
                      </div>

                      <div className="form-field">
                        <label className="form-label">Street / Area</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          required 
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label className="form-label">PIN Code</label>
                          <input 
                            type="text" 
                            maxLength={6}
                            className="form-input" 
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                            required 
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">City</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            required 
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label className="form-label">State</label>
                        <select 
                          className="form-select"
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        >
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                          Save Address
                        </button>
                        <button type="button" className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }} onClick={() => setShowAddAddressModal(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STUDENT PERKS & WARRANTY TAB */}
          {accountSubTab === 'student-perks' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Perks & Skybags Warranty Club</h2>
              </div>

              {/* Student Verified Card */}
              <div style={{ background: 'linear-gradient(135deg, #0a1f38 0%, #003366 100%)', color: '#fff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={24} color="#facc15" />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Skybags Campus Pass (Active)</h3>
                  </div>
                  <span style={{ background: '#facc15', color: '#0a1f38', fontSize: '0.75rem', fontWeight: 900, padding: '3px 10px', borderRadius: '999px' }}>
                    VERIFIED STUDENT
                  </span>
                </div>
                <p style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Your student pass is linked to <strong>{user?.college || 'Mumbai University'}</strong>. You get unlimited 20% discount with promo code <code>COLLEGE20</code> on all backpacks and duffels.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', fontSize: '0.82rem' }}>
                  <div><strong>Student ID:</strong> {user?.studentId || 'MUM-2024-BBA-089'}</div>
                  <div><strong>Valid Until:</strong> June 2027</div>
                </div>
              </div>

              {/* Warranty Registration */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Register Product Warranty (VIP Industries)</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  All authentic Skybags products purchased online or in-store include 1 to 5 Year International Replacement Warranty.
                </p>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="form-label">Product Serial / Barcode No.</label>
                    <input type="text" className="form-input" placeholder="e.g. SKY-904-B32-2026" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Purchase Date</label>
                    <input type="date" className="form-input" defaultValue="2026-08-16" />
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                  onClick={() => showToast('Warranty certificate registered successfully! 🛡️')}
                >
                  <ShieldCheck size={16} /> Register Warranty
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cancellation Reason Modal */}
      {cancellingOrderId && (
        <div className="drawer-backdrop" onClick={() => setCancellingOrderId(null)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div 
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
                <Ban size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Cancel Order #{cancellingOrderId}?</h3>
              </div>
              <button onClick={() => setCancellingOrderId(null)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Please select the reason for cancelling this order. A 100% full refund will be automatically credited to your original payment mode (UPI/Card).
            </p>

            <div className="form-field">
              <label className="form-label">Reason for Cancellation</label>
              <select 
                className="form-select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Changed mind / Placed order by mistake">Changed mind / Placed order by mistake</option>
                <option value="Want to change delivery address">Want to change delivery address</option>
                <option value="Found another Skybag model / color variant">Found another Skybag model / color variant</option>
                <option value="Delivery time is too long">Delivery time is too long</option>
                <option value="Forgot to apply student discount coupon (COLLEGE20)">Forgot to apply student discount coupon (COLLEGE20)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                onClick={handleConfirmCancel}
                style={{
                  flex: 1,
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 800,
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.88rem'
                }}
              >
                Confirm Cancellation
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '10px 16px' }}
                onClick={() => setCancellingOrderId(null)}
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
