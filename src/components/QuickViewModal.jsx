import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, ShoppingBag, Heart, Shield, Laptop, Droplets, ArrowRight } from 'lucide-react';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateToProduct 
  } = useShop();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const isWishlisted = isInWishlist(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setQuickViewProduct(null)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '820px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* Image Display */}
        <div style={{ background: '#f8fafc', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ maxHeight: '340px', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Product Details */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
            {product.categoryName} • {product.capacity}
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px', lineHeight: 1.3 }}>
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
              {formatPrice(product.price)}
            </span>
            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1rem' }}>
              {formatPrice(product.originalPrice)}
            </span>
            <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px' }}>
              {product.discount}% OFF
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {product.description}
          </p>

          {/* Quick Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem' }}>
              <strong>Capacity:</strong> {product.capacity}
            </div>
            <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem' }}>
              <strong>Warranty:</strong> {product.warranty}
            </div>
            {product.laptopCompartment && (
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem', gridColumn: 'span 2' }}>
                <strong>Laptop Sleeve:</strong> {product.laptopCompartment}
              </div>
            )}
          </div>

          {/* Color Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Color: <span style={{ color: '#0284c7' }}>{selectedColor.name}</span>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor.name === c.name ? '3px solid #0066cc' : '1px solid #cbd5e1'
                  }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button 
              className="btn-primary"
              style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
              onClick={() => {
                addToCart(product, selectedColor, qty);
                setQuickViewProduct(null);
              }}
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button 
              className="btn-secondary"
              style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '10px' }}
              onClick={() => {
                setQuickViewProduct(null);
                navigateToProduct(product);
              }}
            >
              Full Details <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
