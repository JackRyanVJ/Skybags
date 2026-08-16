import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Search, X, ArrowRight, Laptop, Droplets, Shield } from 'lucide-react';

export const SearchModal = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    navigateToProduct, 
    navigateToCategory 
  } = useShop();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim() === '' ? [] : PRODUCTS.filter(p => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.capacity.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q)
    );
  }).slice(0, 6);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const quickPicks = ['Laptop Backpacks', '32L College Bags', 'Cabin Suitcases 55cm', 'Gym Duffel with Wheels', 'Waterproof Bags'];

  return (
    <div className="drawer-backdrop" onClick={() => setIsSearchOpen(false)} style={{ alignItems: 'flex-start', paddingTop: '80px', justifyContent: 'center' }}>
      <div 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '720px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', gap: '12px' }}>
          <Search size={22} color="#0066cc" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search Skybags (e.g. 15.6 inch laptop backpack, 65L suitcase, duffel bag...)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#0f172a'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: '#94a3b8' }}>
              <X size={18} />
            </button>
          )}
          <button onClick={() => setIsSearchOpen(false)} style={{ color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>
            Esc
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '8px' }}>
            Trending Searches for College & Travel
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickPicks.map((pick, i) => (\n              <button\n                key={i}\n                onClick={() => setQuery(pick)}\n                style={{\n                  background: '#ffffff',\n                  border: '1px solid #cbd5e1',\n                  padding: '4px 12px',\n                  borderRadius: '999px',\n                  fontSize: '0.8rem',\n                  fontWeight: 600,\n                  color: '#334155'\n                }}\n              >\n                {pick}\n              </button>\n            ))}\n          </div>\n        </div>\n\n        {/* Live Search Results */}\n        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1rem 1.5rem' }}>\n          {query && filtered.length === 0 ? (\n            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>\n              <p style={{ fontWeight: 600 }}>No Skybag products found for \"{query}\"</p>\n              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try searching \"backpack\", \"suitcases\", \"waterproof\", or \"duffel\"</p>\n            </div>\n          ) : filtered.length > 0 ? (\n            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>\n              {filtered.map(p => (\n                <div \n                  key={p.id}\n                  onClick={() => {\n                    setIsSearchOpen(false);\n                    navigateToProduct(p);\n                  }}\n                  style={{\n                    display: 'flex',\n                    alignItems: 'center',\n                    gap: '14px',\n                    padding: '10px',\n                    borderRadius: '8px',\n                    border: '1px solid #f1f5f9',\n                    cursor: 'pointer',\n                    transition: 'background 0.2s'\n                  }}\n                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}\n                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}\n                >\n                  <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />\n                  <div style={{ flex: 1 }}>\n                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>\n                      {p.name}\n                    </h5>\n                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>\n                      {p.categoryName} • {p.capacity} • {p.isWaterproof ? 'Water Resistant' : ''}\n                    </div>\n                  </div>\n                  <div style={{ textAlign: 'right' }}>\n                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{formatPrice(p.price)}</div>\n                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>{p.discount}% OFF</span>\n                  </div>\n                </div>\n              ))}\n            </div>\n          ) : (\n            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1rem 0' }}>\n              <div \n                onClick={() => { setIsSearchOpen(false); navigateToCategory('backpacks'); }}\n                style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}\n              >\n                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🎒</div>\n                <strong style={{ fontSize: '0.85rem' }}>Backpacks</strong>\n                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>₹1,000 - ₹2,500</p>\n              </div>\n              <div \n                onClick={() => { setIsSearchOpen(false); navigateToCategory('suitcases'); }}\n                style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}\n              >\n                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🧳</div>\n                <strong style={{ fontSize: '0.85rem' }}>Suitcases</strong>\n                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>₹5,000 - ₹15,000</p>\n              </div>\n              <div \n                onClick={() => { setIsSearchOpen(false); navigateToCategory('duffels'); }}\n                style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}\n              >\n                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏋️‍♂️</div>\n                <strong style={{ fontSize: '0.85rem' }}>Duffel Bags</strong>\n                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>₹3,000 - ₹5,000</p>\n              </div>\n            </div>\n          )}\n        </div>\n      </div>\n    </div>\n  );\n};\n