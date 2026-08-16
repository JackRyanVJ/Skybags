import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, COUPONS } from '../data/products';
import { REVIEWS } from '../data/reviews';
import { ProductCard } from '../components/ProductCard';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Laptop, 
  Truck, 
  Percent, 
  Star, 
  Compass, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';

export const HomePage = () => {
  const { 
    products,
    setActiveTab, 
    navigateToCategory, 
    navigateToProduct, 
    showToast,
    applyCouponCode 
  } = useShop();

  const bestSellers = products.filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const featuredSuitcases = products.filter(p => p.category === 'suitcases').slice(0, 4);

  const [copiedCoupon, setCopiedCoupon] = React.useState(null);

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    applyCouponCode(code);
    showToast(`Copied & applied coupon code "${code}"! 🎉`);
    setTimeout(() => setCopiedCoupon(null), 3000);
  };

  return (
    <div>
      {/* Hero Section (Blue & Yellow Theme) */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag">
                <Sparkles size={14} /> Official 2026 Youth & College Collection
              </div>
              <h1 className="hero-title">
                MOVE IN <span className="gradient-text">STYLE.</span><br />
                ENGINEERED FOR HUSTLE.
              </h1>
              <p className="hero-desc">
                From morning lectures to cross-country flights. Ultra-durable college backpacks with dedicated 15.6" laptop armor, lightweight spinner suitcases, and gym roller duffels.
              </p>
              
              <div className="hero-cta-group">
                <button 
                  className="btn-primary"
                  onClick={() => navigateToCategory('backpacks')}
                >
                  Explore College Backpacks (From ₹1,099) <ArrowRight size={17} />
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => setActiveTab('recommended')}
                >
                  ✨ Bag Finder Quiz
                </button>
              </div>

              {/* Quick stats with yellow & sky blue highlights */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>30+</div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Latest Models</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>15.6"</div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Laptop Armor</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#facc15' }}>50% OFF</div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Student Discounts</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase Card */}
            <div className="hero-visual-card">
              <img 
                src="/images/backpacks/backpack_4.jpg" 
                alt="Skybags Transit Series Pro Backpack" 
                className="hero-img-display"
              />

              <div className="hero-floating-pill">
                <div style={{ background: '#0066cc', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Laptop size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Transit Series Pro 35L</strong>
                  <span style={{ fontSize: '0.72rem', color: '#facc15' }}>16" Laptop Armor • ₹2,199</span>
                </div>
              </div>

              <div className="hero-floating-pill right">
                <div style={{ background: '#eab308', color: '#051424', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={16} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Hydro-Shield 100%</strong>
                  <span style={{ fontSize: '0.72rem', color: '#e2e8f0' }}>Monsoon Proof Coating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="feature-bar">
        <div className="container">
          <div className="feature-bar-grid">
            <div className="feature-item">
              <div className="feature-icon-box">
                <Laptop size={22} />
              </div>
              <div>
                <div className="feature-title">Dedicated Laptop Armor</div>
                <div className="feature-sub">Padded sleeves for 14" to 16" tech</div>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box" style={{ background: '#fef9c3', color: '#ca8a04' }}>
                <Droplets size={22} />
              </div>
              <div>
                <div className="feature-title">Hydro-Shield Waterproof</div>
                <div className="feature-sub">Weatherproof fabrics & coated zippers</div>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box" style={{ background: '#eff6ff', color: '#0066cc' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div className="feature-title">Up to 5 Years Warranty</div>
                <div className="feature-sub">Backed by VIP Industries pan-India</div>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box" style={{ background: '#fef08a', color: '#854d0e' }}>
                <Truck size={22} />
              </div>
              <div>
                <div className="feature-title">Free Express Pan-India</div>
                <div className="feature-sub">Dispatched via BlueDart & Delhivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase (Blue & Yellow Theme) */}
      <section className="category-showcase">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <h2>Shop by Category</h2>
              <p>Tailored specifically for campus days, gym fitness, and vacation travel</p>
            </div>
            <button 
              className="section-view-all-btn"
              onClick={() => navigateToCategory('all')}
            >
              View Full Catalog <ChevronRight size={16} />
            </button>
          </div>

          <div className="category-tiles-grid">
            {/* Backpacks */}
            <div 
              className="category-tile-card backpack-tile"
              onClick={() => navigateToCategory('backpacks')}
            >
              <div className="cat-tile-info">
                <span className="cat-tile-tag">Campus & Coding</span>
                <h3 className="cat-tile-name">Backpacks</h3>
                <div className="cat-tile-price-hint">₹1,000 – ₹2,500</div>
                <span className="cat-tile-link-pill">
                  Shop 10 Models <ArrowRight size={14} />
                </span>
              </div>
              <div className="cat-tile-img-box">
                <img src="/images/backpacks/backpack_1.jpg" alt="Skybags Backpack" />
              </div>
            </div>

            {/* Suitcases */}
            <div 
              className="category-tile-card suitcase-tile"
              onClick={() => navigateToCategory('suitcases')}
            >
              <div className="cat-tile-info">
                <span className="cat-tile-tag">Vacations & Flights</span>
                <h3 className="cat-tile-name">Suitcases & Sets</h3>
                <div className="cat-tile-price-hint">₹5,000 – ₹15,000</div>
                <span className="cat-tile-link-pill">
                  Shop 10 Trolleys <ArrowRight size={14} />
                </span>
              </div>
              <div className="cat-tile-img-box">
                <img src="/images/suitcases/suitcase_1.jpg" alt="Skybags Suitcase" />
              </div>
            </div>

            {/* Duffel Bags */}
            <div 
              className="category-tile-card duffel-tile"
              onClick={() => navigateToCategory('duffels')}
            >
              <div className="cat-tile-info">
                <span className="cat-tile-tag">Gym & Weekenders</span>
                <h3 className="cat-tile-name">Duffel Bags</h3>
                <div className="cat-tile-price-hint">₹3,000 – ₹5,000</div>
                <span className="cat-tile-link-pill">
                  Shop 10 Duffels <ArrowRight size={14} />
                </span>
              </div>
              <div className="cat-tile-img-box">
                <img src="/images/duffels/duffel_2.jpg" alt="Skybags Duffel" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <h2>Best Sellers 🔥</h2>
              <p>The top picks trending across colleges in Mumbai, Pune, Delhi & Bengaluru</p>
            </div>
            <button 
              className="section-view-all-btn"
              onClick={() => navigateToCategory('all')}
            >
              View All Best Sellers <ChevronRight size={16} />
            </button>
          </div>

          <div className="product-grid">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Student Promo Banner / Offers in Deep Blue & Energetic Yellow */}
      <section style={{ background: 'linear-gradient(135deg, #051424 0%, #003366 50%, #004c99 100%)', padding: '3.5rem 0', color: '#fff', margin: '2rem 0', borderTop: '2px solid #facc15', borderBottom: '2px solid #facc15' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#facc15', color: '#051424', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Exclusive Student Discount
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '10px', marginBottom: '10px', lineHeight: 1.15 }}>
                GET FLAT 20% OFF WITH YOUR COLLEGE ID
              </h2>
              <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Use our student promo code during checkout for instant savings across all backpacks, suitcases, and gym duffels.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '2px dashed #facc15', padding: '10px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#facc15', letterSpacing: '0.05em' }}>COLLEGE20</span>
                  <button 
                    onClick={() => copyCoupon('COLLEGE20')}
                    style={{ background: '#facc15', color: '#051424', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedCoupon === 'COLLEGE20' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCoupon === 'COLLEGE20' ? 'Applied!' : 'Copy Code'}
                  </button>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.1)', border: '2px dashed #38bdf8', padding: '10px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.05em' }}>SKYBAGS10</span>
                  <button 
                    onClick={() => copyCoupon('SKYBAGS10')}
                    style={{ background: '#38bdf8', color: '#051424', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedCoupon === 'SKYBAGS10' ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCoupon === 'SKYBAGS10' ? 'Applied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src="/images/suitcases/suitcase_5.jpg" 
                alt="Skybags Marvel Edition" 
                style={{ maxHeight: '300px', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.6))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Launches / Fresh Drops */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <h2>New Launches & Drops ✨</h2>
              <p>Fresh 2026 designs featuring vibrant gradients and anti-theft tech</p>
            </div>
            <button 
              className="section-view-all-btn"
              onClick={() => navigateToCategory('all')}
            >
              Explore All New <ChevronRight size={16} />
            </button>
          </div>

          <div className="product-grid">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Travel & Trolley Luggage Sets Highlight */}
      <section style={{ background: '#f1f5f9', padding: '4rem 0' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrap">
              <h2>Suitcases & Trolley Luggage</h2>
              <p>TSA approved locks, 360° silent spinners & scratch-proof shells (₹5,000 – ₹15,000)</p>
            </div>
            <button 
              className="section-view-all-btn"
              onClick={() => navigateToCategory('suitcases')}
            >
              View All 10 Trolleys <ChevronRight size={16} />
            </button>
          </div>

          <div className="product-grid">
            {featuredSuitcases.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section style={{ padding: '4rem 0 5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Campus Stories
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px' }}>
              Loved by Students & Travelers Across India
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {REVIEWS.map(rev => (
              <div 
                key={rev.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', marginBottom: '10px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                  "{rev.title}"
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {rev.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0066cc', color: '#facc15', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {rev.avatar}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>{rev.author}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{rev.college}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
