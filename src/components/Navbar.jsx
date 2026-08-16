import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  Percent, 
  Compass,
  ArrowRight,
  LogIn
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsSearchOpen, 
    setIsAuthModalOpen, 
    user,
    navigateToCategory,
    setShowLoginGate
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header-nav">
      {/* Top Announcement Ticker (Blue & Yellow) */}
      <div className="top-ticker">
        <span>⚡ FLAT 20% OFF FOR STUDENTS • USE CODE:</span>
        <span className="coupon-tag" onClick={() => handleNavClick('offers')}>
          COLLEGE20
        </span>
        <span>• FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹999</span>
      </div>

      {/* Main Navbar */}
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <div 
            className="nav-logo-link" 
            onClick={() => handleNavClick('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-badge">
              <img 
                src="https://zocvgaubtabpgknzpzyx.supabase.co/storage/v1/object/public/product-images/brand/skybags_logo.png" 
                alt="Skybags Logo" 
                className="logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="brand-font" style={{ color: '#0066cc', fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
                Skybags
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'backpacks' ? 'active' : ''}`}
                onClick={() => navigateToCategory('backpacks')}
              >
                Backpacks
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'suitcases' ? 'active' : ''}`}
                onClick={() => navigateToCategory('suitcases')}
              >
                Suitcases
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'duffels' ? 'active' : ''}`}
                onClick={() => navigateToCategory('duffels')}
              >
                Duffels
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => navigateToCategory('all')}
              >
                Shop All
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'recommended' ? 'active' : ''}`}
                onClick={() => handleNavClick('recommended')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#facc15' }}
              >
                <Sparkles size={14} /> Bag Finder
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'stores' ? 'active' : ''}`}
                onClick={() => handleNavClick('stores')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <MapPin size={14} /> Stores
              </button>
            </li>
            <li>
              <button 
                className={`nav-link-btn ${activeTab === 'offers' ? 'active' : ''}`}
                onClick={() => handleNavClick('offers')}
                style={{ color: '#facc15' }}
              >
                Offers %
              </button>
            </li>
          </ul>

          {/* Nav Actions (Search, Wishlist, Account, Cart) */}
          <div className="nav-actions">
            {/* Search Trigger */}
            <button 
              className="nav-icon-btn" 
              onClick={() => setIsSearchOpen(true)}
              title="Search products"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            {/* Wishlist Trigger */}
            <button 
              className="nav-icon-btn" 
              onClick={() => handleNavClick('account')}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="counter-badge">{wishlist.length}</span>
              )}
            </button>

            {/* User Account or Login Screen Trigger */}
            <button 
              className="nav-icon-btn" 
              onClick={() => {
                if (user) {
                  handleNavClick('account');
                } else {
                  setShowLoginGate(true);
                }
              }}
              title={user ? `Account (${user.name})` : 'Login / Register'}
              aria-label="Account"
            >
              <User size={19} />
            </button>

            {/* Cart Drawer Trigger */}
            <button 
              className="nav-icon-btn" 
              onClick={() => setIsCartOpen(true)}
              title="Shopping Cart"
              aria-label="Cart"
              style={{ background: '#0066cc' }}
            >
              <ShoppingBag size={19} />
              {totalCartCount > 0 && (
                <span className="counter-badge">{totalCartCount}</span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="nav-icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: '#061527',
            padding: '1.25rem',
            borderRadius: '0 0 12px 12px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => navigateToCategory('backpacks')}
            >
              Backpacks (College & Tech)
            </button>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => navigateToCategory('suitcases')}
            >
              Suitcases & Trolleys
            </button>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => navigateToCategory('duffels')}
            >
              Duffel Bags (Gym & Sports)
            </button>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => navigateToCategory('all')}
            >
              Shop All Products
            </button>
            <button 
              style={{ color: '#facc15', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => handleNavClick('recommended')}
            >
              ✨ Bag Finder Quiz
            </button>
            <button 
              style={{ color: '#fff', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => handleNavClick('stores')}
            >
              📍 Nearby Store Locator
            </button>
            <button 
              style={{ color: '#facc15', textAlign: 'left', fontWeight: 600, padding: '8px 0' }}
              onClick={() => handleNavClick('offers')}
            >
              ⚡ Student Discounts & Offers
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
