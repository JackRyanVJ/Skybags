import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, COUPONS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Tag, Sparkles, Copy, Check, GraduationCap, Percent, Zap } from 'lucide-react';

export const OffersPage = () => {
  const { applyCouponCode, showToast, navigateToCategory } = useShop();
  const [copiedCode, setCopiedCode] = useState(null);

  const offerProducts = PRODUCTS.filter(p => p.discount >= 44);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCouponCode(code);
    showToast(`Coupon ${code} applied to your cart! 🎉`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#b91c1c', padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
          <Percent size={14} /> Flash Sales & Student Vouchers
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.15 }}>
          Exclusive Offers & Coupons
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '8px' }}>
          Stack discounts on your favorite Skybags backpacks, trolleys, and sports duffels. Click any coupon code below to copy and apply instantly.
        </p>
      </div>

      {/* Coupon Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        {COUPONS.map(c => (
          <div
            key={c.code}
            style={{
              background: '#ffffff',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 4px 6px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ background: '#f1f5f9', color: '#0f172a', fontWeight: 800, fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px' }}>
                PROMO
              </span>
              <Tag size={18} color="#0066cc" />
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0066cc', letterSpacing: '0.05em', marginBottom: '6px' }}>
              {c.code}
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.4, marginBottom: '1.25rem', flex: 1 }}>
              {c.description}
            </p>

            <button
              onClick={() => handleCopy(c.code)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '0.82rem',
                justifyContent: 'center',
                background: copiedCode === c.code ? '#16a34a' : '#0f2231'
              }}
            >
              {copiedCode === c.code ? (
                <>
                  <Check size={14} /> Applied!
                </>
              ) : (
                <>
                  <Copy size={14} /> Apply Code
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Top Discounted Items Grid */}
      <div>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Up to 50% Off Top Deals 🔥</h2>
            <p>Biggest discounts on backpacks, suitcases, and gym duffels</p>
          </div>
        </div>

        <div className="product-grid">
          {offerProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
