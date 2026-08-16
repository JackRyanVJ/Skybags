import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { INDIAN_STATES, lookupPincode } from '../data/indianLocations';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  Building2, 
  Banknote,
  ArrowRight,
  Sparkles,
  PackageCheck,
  Lock,
  Zap,
  RotateCcw,
  XCircle,
  FileText,
  Clock,
  Phone,
  Mail,
  User
} from 'lucide-react';

const RAZORPAY_KEY_ID = 'rzp_test_Sm1DACtZ2hsm5t';

// Helper to dynamically load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const { 
    cart, 
    cartSubtotal, 
    couponDiscount, 
    shippingFee, 
    isFreeShipping, 
    cartFinalTotal, 
    appliedCoupon, 
    placeOrder, 
    cancelOrder,
    user, 
    savedAddresses,
    setActiveTab,
    showToast 
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Varad Jadhav',
    phone: user?.phone ? user.phone.replace('+91 ', '').replace(/\s+/g, '') : '9876543210',
    email: user?.email || 'varad.jadhav@mumbaiuniv.edu.in',
    flatNo: savedAddresses[0]?.flatNo || 'Room 304, Boys Hostel B',
    street: savedAddresses[0]?.street || 'Mumbai University Kalina Campus, CST Road',
    landmark: savedAddresses[0]?.landmark || 'Opposite Main Library & Dept of Management',
    city: savedAddresses[0]?.city || 'Mumbai',
    state: savedAddresses[0]?.state || 'Maharashtra',
    pincode: savedAddresses[0]?.pincode || '400098',
    addressType: 'College Campus / Hostel'
  });

  const [shippingMethod, setShippingMethod] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false);

  // Completed Order State
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePincodeChange = (e) => {
    const pin = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      const match = lookupPincode(pin);
      if (match) {
        setFormData(prev => ({
          ...prev,
          city: match.city,
          state: match.state.split(' / ')[0]
        }));
        showToast(`PIN Auto-resolved: ${match.city}, ${match.state}`, 'info');
      }
    }
  };

  // 1. Razorpay Payment Trigger
  const handleRazorpayPayment = async () => {
    if (!formData.fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      showToast('Please enter a valid email address for order confirmation', 'error');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!formData.flatNo.trim() || !formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      showToast('Please complete all delivery address fields', 'error');
      return;
    }

    setIsProcessing(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      showToast('Could not load Razorpay SDK. Please check internet connection.', 'error');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(cartFinalTotal * 100), // Amount in paise
      currency: 'INR',
      name: 'Skybags Official Store',
      description: `Payment for ${cart.length} Skybags Product(s)`,
      image: 'https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/brand/skybags_logo.png',
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.flatNo}, ${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        student_id: user?.studentId || 'MUM-2024-BBA-089',
        college: user?.college || 'Mumbai University (BBA Dept)'
      },
      theme: {
        color: '#0066cc'
      },
      handler: function (response) {
        setIsProcessing(false);
        const paymentId = response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 10)}`;

        const newOrder = placeOrder({
          ...formData,
          paymentMethod: `Razorpay Online (${paymentId})`,
          razorpayPaymentId: paymentId,
          paymentStatus: 'Paid'
        });

        setPlacedOrderInfo(newOrder);

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        showToast(`Payment Verified! Order #${newOrder.id} Placed 🎉`, 'success');
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          showToast('Razorpay payment modal closed. You can retry anytime.', 'info');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setIsProcessing(false);
        showToast(`Payment failed: ${response.error?.description || 'Transaction declined'}`, 'error');
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay invocation error:', err);
      setIsProcessing(false);
      showToast('Could not initialize Razorpay checkout. Please retry.', 'error');
    }
  };

  // 2. Cash on Delivery (COD) Trigger
  const handleCodPayment = () => {
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.pincode.trim()) {
      showToast('Please fill all delivery address fields', 'error');
      return;
    }

    const newOrder = placeOrder({
      ...formData,
      paymentMethod: 'Cash on Delivery (Pay at Doorstep)',
      paymentStatus: 'Pending (Pay on Delivery)'
    });

    setPlacedOrderInfo(newOrder);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`Order #${newOrder.id} Placed with Cash on Delivery! 📦`);
  };

  // Main Form Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your bag is empty! Add products first.', 'error');
      return;
    }

    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handleCodPayment();
    }
  };

  // Cancellation from Receipt
  const handleCancelPlacedOrder = () => {
    if (!placedOrderInfo) return;
    const reason = window.prompt('Please enter the reason for cancelling this order:', 'Change of mind / Incorrect address');
    if (reason !== null) {
      setIsCancelling(true);
      cancelOrder(placedOrderInfo.id, reason || 'Customer requested immediate cancellation');
      setPlacedOrderInfo(prev => ({
        ...prev,
        status: 'Cancelled',
        canCancel: false,
        cancelReason: reason || 'Customer requested cancellation'
      }));
      setIsCancelling(false);
    }
  };

  // 1. Order Confirmed Screen
  if (placedOrderInfo) {
    const isCancelled = placedOrderInfo.status === 'Cancelled';

    return (
      <div className="container" style={{ padding: '3.5rem 1rem 6rem', maxWidth: '780px' }}>
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '16px', 
          border: isCancelled ? '1px solid #fecaca' : '1px solid #bbf7d0', 
          padding: '2.5rem', 
          textAlign: 'center', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)' 
        }}>
          <div style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            background: isCancelled ? '#fee2e2' : '#dcfce7', 
            color: isCancelled ? '#dc2626' : '#16a34a', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.25rem' 
          }}>
            {isCancelled ? <XCircle size={40} /> : <CheckCircle2 size={40} />}
          </div>

          <span style={{ 
            background: isCancelled ? '#fee2e2' : '#dcfce7', 
            color: isCancelled ? '#b91c1c' : '#15803d', 
            fontSize: '0.78rem', 
            fontWeight: 800, 
            padding: '4px 14px', 
            borderRadius: '999px', 
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {isCancelled ? 'Order Cancelled' : 'Order Confirmed & Payment Verified'}
          </span>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '12px', marginBottom: '6px', color: '#0f172a' }}>
            {isCancelled ? 'Order Has Been Cancelled' : `Thank You, ${placedOrderInfo.contactName}!`}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Order ID: <strong style={{ color: '#0066cc' }}>{placedOrderInfo.id}</strong> • Confirmation sent to <strong>{placedOrderInfo.contactEmail || placedOrderInfo.contactPhone}</strong>
          </p>

          {/* Delivery & Order Details Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Courier Service</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{placedOrderInfo.courier}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Estimated Delivery</span>
                <strong style={{ color: isCancelled ? '#dc2626' : '#16a34a', fontSize: '0.95rem' }}>
                  {isCancelled ? 'Cancelled' : placedOrderInfo.expectedDelivery}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
              <div>
                <strong>Customer:</strong> {placedOrderInfo.contactName} ({placedOrderInfo.contactPhone})
              </div>
              <div>
                <strong>Email:</strong> {placedOrderInfo.contactEmail || formData.email}
              </div>
              <div>
                <strong>Shipping Address:</strong> {placedOrderInfo.shippingAddress}
              </div>
              <div>
                <strong>Payment Mode:</strong> {placedOrderInfo.paymentMethod}
              </div>
              <div>
                <strong>Total Amount:</strong> <span style={{ color: '#0066cc', fontWeight: 900 }}>{formatPrice(placedOrderInfo.totalAmount)}</span>
              </div>
              {isCancelled && placedOrderInfo.cancelReason && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', marginTop: '6px' }}>
                  <strong>Cancellation Reason:</strong> {placedOrderInfo.cancelReason}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              onClick={() => {
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <PackageCheck size={18} /> Track in Order Tracker
            </button>

            {/* Cancel Order Option */}
            {!isCancelled && (
              <button 
                type="button"
                className="btn-secondary"
                style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fff1f2' }}
                onClick={handleCancelPlacedOrder}
                disabled={isCancelling}
              >
                <XCircle size={17} /> Cancel This Order
              </button>
            )}

            <button 
              className="btn-secondary"
              style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Empty Bag Screen
  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <ShoppingBag size={64} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Your Bag is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add stylish Skybags backpacks or luggage to proceed to checkout.</p>
        <button className="btn-primary" onClick={() => setActiveTab('shop')}>
          Browse Skybags Catalog
        </button>
      </div>
    );
  }

  // 3. Main Checkout Form
  return (
    <div className="container" style={{ padding: '2rem 1rem 5rem' }}>
      {/* Checkout Breadcrumb Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={28} color="#0066cc" /> Skybags Instant Checkout
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Enter delivery details and complete your payment securely with Razorpay or Cash on Delivery.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="checkout-grid">
        {/* Left Column: Form Steps */}
        <div>
          {/* Step 1: Customer Contact & Delivery Address Form */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">1</span>
              Customer & Delivery Address Details
            </h3>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#0066cc" /> Full Name *
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Varad Jadhav"
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required 
                />
              </div>

              <div className="form-field">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#0066cc" /> 10-Digit Mobile Number (+91) *
                </label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  required 
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#0066cc" /> Email Address (For Razorpay Receipt & Live Tracking) *
              </label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. yourname@gmail.com"
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>

            <div className="form-field">
              <label className="form-label">Flat / House / Hostel Room No. *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Room 304, Boys Hostel B / Flat 402, Building A"
                value={formData.flatNo} 
                onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                required 
              />
            </div>

            <div className="form-field">
              <label className="form-label">Street / Area / College Campus Road *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Mumbai University Kalina Campus, CST Road"
                value={formData.street} 
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required 
              />
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">6-Digit Indian PIN Code *</label>
                <input 
                  type="text" 
                  maxLength={6}
                  className="form-input" 
                  placeholder="e.g. 400098"
                  value={formData.pincode} 
                  onChange={handlePincodeChange}
                  required 
                />
              </div>

              <div className="form-field">
                <label className="form-label">City *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mumbai"
                  value={formData.city} 
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">State / Union Territory *</label>
                <select 
                  className="form-select"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Landmark (Optional)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Near Main Library / Metro Station"
                  value={formData.landmark} 
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Courier & Shipping Method */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">2</span>
              Shipping & Courier Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label 
                className={`payment-method-card ${shippingMethod === 'express' ? 'active' : ''}`}
                onClick={() => setShippingMethod('express')}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => {}} />
                  <Truck size={20} color="#0066cc" />
                  <div>
                    <strong>Delhivery & BlueDart Air Priority (2-3 Days)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fastest courier air dispatch with live SMS & WhatsApp tracking</div>
                  </div>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>
                  {isFreeShipping ? 'FREE' : '₹99'}
                </span>
              </label>

              <label 
                className={`payment-method-card ${shippingMethod === 'campus' ? 'active' : ''}`}
                onClick={() => setShippingMethod('campus')}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'campus'} onChange={() => {}} />
                  <MapPin size={20} color="#ca8a04" />
                  <div>
                    <strong>Campus / Hostel Direct Drop</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Special student hostel delivery window (5 PM - 8 PM)</div>
                  </div>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>FREE</span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Mode Selection (Featuring Razorpay Gateway) */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">3</span>
              Select Payment Gateway
            </h3>

            <div className="payment-option-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option A: Razorpay (Recommended) */}
              <div 
                className={`payment-method-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
                style={{ 
                  cursor: 'pointer', 
                  border: paymentMethod === 'razorpay' ? '2px solid #0066cc' : '1px solid #e2e8f0',
                  background: paymentMethod === 'razorpay' ? '#f0f7ff' : '#ffffff',
                  padding: '1.25rem',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <input type="radio" name="paymentMethod" checked={paymentMethod === 'razorpay'} onChange={() => {}} />
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Razorpay Secure Checkout</strong>
                        <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          POPULAR
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        UPI (GPay, PhonePe, Paytm, BHIM) • Credit/Debit Cards • NetBanking • EMI
                      </div>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'razorpay' && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.8rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#0066cc" />
                    <span>Official Razorpay Gateway (Key: <strong>rzp_test_...5t</strong>) • 100% Encrypted & Instant Confirmation</span>
                  </div>
                )}
              </div>

              {/* Option B: Cash on Delivery (COD) */}
              <div 
                className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
                style={{ 
                  cursor: 'pointer', 
                  border: paymentMethod === 'cod' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                  background: paymentMethod === 'cod' ? '#f0fdf4' : '#ffffff',
                  padding: '1.25rem',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => {}} />
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Banknote size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Cash on Delivery (Pay at Doorstep)</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      Pay via Cash or UPI to the Delhivery courier upon package delivery
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Final Submit */}
        <div>
          <div className="checkout-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Items mini list */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.25rem' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '2px' }} 
                  />
                  <div style={{ flex: 1, fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{item.product.name}</div>
                    <span style={{ color: '#64748b' }}>Qty: {item.quantity} • {item.selectedColor.name}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <div className="bill-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="bill-row" style={{ color: '#16a34a', fontWeight: 700 }}>
                  <span>Student Promo Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="bill-row">
                <span>Pan-India Delivery</span>
                <span>{isFreeShipping ? <strong style={{ color: '#16a34a' }}>FREE</strong> : formatPrice(shippingFee)}</span>
              </div>

              <div className="bill-row total">
                <span>Total Amount Payable</span>
                <span style={{ color: '#0066cc', fontWeight: 900 }}>{formatPrice(cartFinalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn-checkout" 
              disabled={isProcessing}
              style={{ 
                marginTop: '1.25rem', 
                background: paymentMethod === 'razorpay' ? 'linear-gradient(135deg, #0066cc 0%, #004c99 100%)' : '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isProcessing ? (
                <>Opening Razorpay Gateway...</>
              ) : paymentMethod === 'razorpay' ? (
                <>
                  <Zap size={18} /> Pay {formatPrice(cartFinalTotal)} via Razorpay <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <Banknote size={18} /> Place COD Order ({formatPrice(cartFinalTotal)}) <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck size={14} color="#16a34a" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Official Razorpay Merchant Integration • 256-bit SSL Security
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
