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
  PackageCheck
} from 'lucide-react';

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
    user, 
    savedAddresses,
    setActiveTab,
    showToast 
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Varad Jadhav',
    phone: user?.phone?.replace('+91 ', '') || '9876543210',
    email: user?.email || 'varad.jadhav@college.edu.in',
    flatNo: savedAddresses[0]?.flatNo || 'Room 304, Boys Hostel B',
    street: savedAddresses[0]?.street || 'University Road, Ganeshkhind',
    landmark: savedAddresses[0]?.landmark || 'Opposite Main Library',
    city: savedAddresses[0]?.city || 'Pune',
    state: savedAddresses[0]?.state || 'Maharashtra',
    pincode: savedAddresses[0]?.pincode || '411007',
    addressType: 'College Campus / Hostel'
  });

  const [shippingMethod, setShippingMethod] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('varad@okaxis');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4082');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [bankName, setBankName] = useState('HDFC Bank');

  // Completed Order State
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePincodeChange = (e) => {
    const pin = e.target.value;
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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your bag is empty! Add products first.', 'error');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.pincode || !formData.street) {
      showToast('Please fill all required Indian delivery address fields', 'error');
      return;
    }

    let paymentMethodLabel = 'UPI (Instant)';
    if (paymentMethod === 'upi') paymentMethodLabel = `UPI (${upiId})`;
    else if (paymentMethod === 'card') paymentMethodLabel = `Card (Ending in ${cardNumber.slice(-4)})`;
    else if (paymentMethod === 'netbanking') paymentMethodLabel = `Net Banking (${bankName})`;
    else if (paymentMethod === 'cod') paymentMethodLabel = 'Cash on Delivery (COD)';

    const newOrder = placeOrder({
      ...formData,
      paymentMethod: paymentMethodLabel
    });

    setPlacedOrderInfo(newOrder);

    // Confetti celebration!
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}

    showToast(`Order #${newOrder.id} Placed Successfully! 🎉`);
  };

  if (placedOrderInfo) {
    return (
      <div className="container" style={{ padding: '4rem 1rem 6rem', maxWidth: '780px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #bbf7d0', padding: '3rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={40} />
          </div>

          <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
            Order Confirmed & Paid
          </span>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '10px', marginBottom: '6px' }}>
            Thank You, {placedOrderInfo.contactName}!
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Order ID: <strong>{placedOrderInfo.id}</strong> • A confirmation SMS & email has been sent to +91 {placedOrderInfo.contactPhone}.
          </p>

          {/* Delivery Timeline Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Courier Service</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>{placedOrderInfo.courier}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Expected Delivery</span>
                <div style={{ fontWeight: 800, color: '#16a34a' }}>{placedOrderInfo.expectedDelivery}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#334155' }}>
              <strong>Delivering To:</strong> {placedOrderInfo.shippingAddress}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: '4px' }}>
              <strong>Payment Mode:</strong> {placedOrderInfo.paymentMethod}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn-primary"
              onClick={() => {
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <PackageCheck size={18} /> View in Order Tracker
            </button>
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

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <ShoppingBag size={64} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Your Bag is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Add some stylish Skybags backpacks or luggage to proceed to checkout.</p>
        <button className="btn-primary" onClick={() => setActiveTab('shop')}>
          Browse Skybags Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        {/* Left Column: Form Steps */}
        <div>
          {/* Step 1: Indian Delivery Address */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">1</span>
              Delivery Address (Pan-India)
            </h3>

            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required 
                />
              </div>

              <div className="form-field">
                <label className="form-label">10-Digit Mobile (+91) *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  required 
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Email Address (For Invoice & Tracking)</label>
              <input 
                type="email" 
                className="form-input" 
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
                placeholder="e.g. Room 304, Boys Hostel B / Flat 402"
                value={formData.flatNo} 
                onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                required 
              />
            </div>

            <div className="form-field">
              <label className="form-label">Street / Area / Campus Road *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. University Road, Ganeshkhind"
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
                  placeholder="e.g. 411007"
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
                <label className="form-label">Landmark</label>
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

          {/* Step 2: Delivery Option */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">2</span>
              Shipping & Courier Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label 
                className={`payment-method-card ${shippingMethod === 'express' ? 'active' : ''}`}
                onClick={() => setShippingMethod('express')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => {}} />
                  <div>
                    <strong>Delhivery & BlueDart Express (2-3 Days)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Fastest courier air dispatch with live SMS tracking</div>
                  </div>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>
                  {isFreeShipping ? 'FREE' : '₹99'}
                </span>
              </label>

              <label 
                className={`payment-method-card ${shippingMethod === 'campus' ? 'active' : ''}`}
                onClick={() => setShippingMethod('campus')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="shipping" checked={shippingMethod === 'campus'} onChange={() => {}} />
                  <div>
                    <strong>Campus Hostel Direct Drop</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Special student hostel delivery window (5 PM - 8 PM)</div>
                  </div>
                </div>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.85rem' }}>FREE</span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="checkout-card">
            <h3 className="checkout-step-title">
              <span className="step-num-circle">3</span>
              Payment Mode (Secure Indian Gateways)
            </h3>

            <div className="payment-option-grid">
              {/* UPI */}
              <div 
                className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Smartphone size={22} color="#0066cc" />
                  <div>
                    <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Instant payment with 0% transaction fee</div>
                  </div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  FASTEST
                </span>
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '4px 0 10px 34px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Enter your Virtual Payment Address (VPA) / UPI ID:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okaxis / 9876543210@paytm"
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '8px 12px', fontSize: '0.8rem' }}>
                      <QrCode size={16} /> Scan QR
                    </button>
                  </div>
                </div>
              )}

              {/* Credit / Debit Cards */}
              <div 
                className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CreditCard size={22} color="#0066cc" />
                  <div>
                    <strong>Credit / Debit Card (Visa, MasterCard, RuPay)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>128-bit Encrypted SSL Security</div>
                  </div>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '4px 0 10px 34px' }}>
                  <div className="form-field" style={{ marginBottom: '8px' }}>
                    <label className="form-label">Card Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="form-grid-2" style={{ marginBottom: 0 }}>
                    <div className="form-field" style={{ marginBottom: 0 }}>
                      <label className="form-label">Valid Thru</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-field" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVV</label>
                      <input 
                        type="password" 
                        maxLength={4}
                        className="form-input" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              <div 
                className={`payment-method-card ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={22} color="#0066cc" />
                  <div>
                    <strong>Net Banking (All Indian Banks)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>SBI, HDFC, ICICI, Axis, Kotak, PNB</div>
                  </div>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div 
                className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Banknote size={22} color="#16a34a" />
                  <div>
                    <strong>Cash on Delivery (Pay at Doorstep)</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>UPI & Cash accepted by Delhivery agent at delivery</div>
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
                  <img src={item.product.image} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '2px' }} />
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
                <span>{formatPrice(cartFinalTotal)}</span>
              </div>
            </div>

            <button type="submit" className="btn-checkout" style={{ marginTop: '1.25rem' }}>
              Place Order & Pay {formatPrice(cartFinalTotal)} <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
              <ShieldCheck size={14} color="#16a34a" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Safe & Encrypted 256-bit Indian Payment
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
