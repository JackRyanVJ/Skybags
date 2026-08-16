import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail, MapPin, Lock } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, navigateToCategory } = useShop();

  return (
    <footer className="footer-main">
      <div className="container">
        {/* Trust Badges Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          paddingBottom: '3rem',
          marginBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>Free Express Shipping</h5>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Pan-India delivery over ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>1 to 5 Year Warranty</h5>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>100% Genuine VIP Industries</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>7 Days Easy Returns</h5>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>Special Student Discounts</h5>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Flat 20% off for verified IDs</p>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '4px 10px', borderRadius: '6px', marginBottom: '14px' }}>
              <img src="https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/brand/skybags_logo.png" alt="Skybags Logo" style={{ height: '32px' }} />
              <span style={{ color: '#0066cc', fontWeight: 900, fontSize: '1.2rem' }}>Skybags</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              Move in Style. India's favorite youthful luggage & backpack brand, engineered for the daily college hustle, wanderlust weekend getaways, and epic flights.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              <div>📍 VIP Industries Ltd, Mumbai, Maharashtra, India</div>
              <div>📞 Helpline: 1800 102 2256 (Toll Free)</div>
            </div>
          </div>

          <div>
            <h5 className="footer-heading">Collections</h5>
            <ul className="footer-links-list">
              <li><a href="#backpacks" onClick={(e) => { e.preventDefault(); navigateToCategory('backpacks'); }}>College Backpacks (₹1000 - ₹2500)</a></li>
              <li><a href="#suitcases" onClick={(e) => { e.preventDefault(); navigateToCategory('suitcases'); }}>Hard & Soft Trolleys (₹5000 - ₹15000)</a></li>
              <li><a href="#duffels" onClick={(e) => { e.preventDefault(); navigateToCategory('duffels'); }}>Roller Duffel Bags (₹3000 - ₹5000)</a></li>
              <li><a href="#laptop" onClick={(e) => { e.preventDefault(); navigateToCategory('backpacks'); }}>15.6" - 16" Laptop Packs</a></li>
              <li><a href="#offers" onClick={(e) => { e.preventDefault(); setActiveTab('offers'); }}>Student Flash Deals</a></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Customer Care</h5>
            <ul className="footer-links-list">
              <li><a href="#track" onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}>Track Your Order</a></li>
              <li><a href="#stores" onClick={(e) => { e.preventDefault(); setActiveTab('stores'); }}>Locate Nearby Store</a></li>
              <li><a href="#finder" onClick={(e) => { e.preventDefault(); setActiveTab('recommended'); }}>Bag Finder Quiz</a></li>
              <li><a href="#warranty" onClick={(e) => { e.preventDefault(); setActiveTab('account'); }}>Warranty Registration</a></li>
              <li><a href="#admin-skybags" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }} style={{ color: '#facc15', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Lock size={12} /> Admin Portal (/admin-skybags)</a></li>
            </ul>
          </div>

          <div>
            <h5 className="footer-heading">Student Club Newsletter</h5>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '12px' }}>
              Subscribe to get ₹500 coupon code + early access to college launch drops.
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="email" 
                placeholder="Your college email" 
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.82rem' }} 
              />
              <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>Join</button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 Skybags (VIP Industries Ltd). All rights reserved. Designed for youth & college students.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>GST Invoice Compliant (IN)</span>
            <a 
              href="/admin-skybags" 
              onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
              style={{ color: '#facc15', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none' }}
            >
              🔒 Admin Login (/admin-skybags)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
