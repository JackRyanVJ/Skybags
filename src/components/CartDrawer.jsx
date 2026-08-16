import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    couponDiscount, 
    shippingFee, 
    isFreeShipping, 
    cartFinalTotal,
    setActiveTab,
    navigateToCategory
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput.trim());
      setCouponInput('');
    }
  };

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#0066cc" />
            <h3 className="drawer-title">Your Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ padding: '6px' }} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-progress">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>
              {isFreeShipping 
                ? '🎉 You unlocked FREE Pan-India Delivery!' 
                : `Add ${formatPrice(amountNeeded)} more for FREE Delivery!`}
            </span>
            <Truck size={16} />
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <ShoppingBag size={64} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Your bag is empty</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem', maxWidth: '240px' }}>
              Explore our college backpacks, travel suitcases, and gym duffels.
            </p>
            <button 
              className="btn-primary" 
              onClick={() => {
                setIsCartOpen(false);
                navigateToCategory('all');
              }}
            >
              Shop Skybags Collection
            </button>
          </div>
        ) : (
          <div className="cart-items-scroll">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedColor.name}-${idx}`} className="cart-item-row">
                <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                <div>
                  <h5 className="cart-item-name">{item.product.name}</h5>
                  <div className="cart-item-color">
                    Color: {item.selectedColor.name} | {item.product.capacity}
                  </div>
                  <div className="cart-item-price">
                    {formatPrice(item.product.price)}
                  </div>
                  <div className="qty-stepper">
                    <button 
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor.name, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateCartQuantity(item.product.id, item.selectedColor.name, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                  style={{ color: '#94a3b8', padding: '6px' }}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer & Order Summary */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Coupon Code Section */}
            <form onSubmit={handleApply} className="coupon-input-group">
              <input 
                type="text" 
                placeholder="Enter Promo Code (e.g. COLLEGE20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="coupon-input"
              />
              <button type="submit" className="btn-apply-coupon">Apply</button>
            </form>

            {appliedCoupon && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#065f46', marginBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <Tag size={13} /> {appliedCoupon.code} Applied ({appliedCoupon.description})
                </span>
                <button onClick={removeCoupon} style={{ color: '#047857', fontWeight: 800 }}>
                  ✕
                </button>
              </div>
            )}

            {/* Bill Breakdown */}
            <div className="bill-row">
              <span>Bag Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="bill-row" style={{ color: '#16a34a', fontWeight: 700 }}>
                <span>Coupon Savings ({appliedCoupon?.code})</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="bill-row">
              <span>Pan-India Delivery</span>
              <span>{isFreeShipping ? <strong style={{ color: '#16a34a' }}>FREE</strong> : formatPrice(shippingFee)}</span>
            </div>

            <div className="bill-row total">
              <span>Grand Total (Incl. GST)</span>
              <span>{formatPrice(cartFinalTotal)}</span>
            </div>

            <button className="btn-checkout" onClick={proceedToCheckout}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b', marginTop: '10px' }}>
              <ShieldCheck size={14} color="#16a34a" /> 100% Genuine Skybags Guarantee • Safe UPI & Card Checkout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
