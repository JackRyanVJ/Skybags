import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { lookupPincode } from '../data/indianLocations';
import { ProductCard } from '../components/ProductCard';
import { 
  ShoppingBag, 
  Heart, 
  Zap, 
  ShieldCheck, 
  Droplets, 
  Laptop, 
  Truck, 
  RotateCcw, 
  Star, 
  Check, 
  MapPin,
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    selectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveTab, 
    navigateToCategory,
    showToast 
  } = useShop();

  // Fallback to first product if none selected
  const product = selectedProduct || PRODUCTS[0];

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('411001'); // Default Pune PIN
  const [pincodeResult, setPincodeResult] = useState({
    city: 'Pune',
    state: 'Maharashtra',
    deliveryDays: '1-2 Days (Express Delivery)'
  });

  const isWishlisted = isInWishlist(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      showToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }
    const res = lookupPincode(pincode);
    if (res) {
      setPincodeResult(res);
      showToast(`Delivery available to ${res.city}, ${res.state}! 🚚`);
    } else {
      showToast('Serviceable pan-India via Delhivery & BlueDart', 'info');
      setPincodeResult({
        city: 'India Hub',
        state: 'Serviceable',
        deliveryDays: '3-4 Business Days'
      });
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, qty);
    setActiveTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Related products from same category
  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container pdp-container">
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
        <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>Home</span>
        <ChevronRight size={14} />
        <span style={{ cursor: 'pointer' }} onClick={() => navigateToCategory(product.category)}>
          {product.categoryName}
        </span>
        <ChevronRight size={14} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="pdp-grid">
        {/* Gallery Column */}
        <div>
          <div className="pdp-gallery-main">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="pdp-main-image"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="pdp-thumbs-row">
              {product.images.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Thumbnail ${i+1}`}
                  className={`pdp-thumb ${activeImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setActiveImage(imgUrl)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="pdp-badge-wrap">
            <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
              {product.categoryName}
            </span>
            {product.badge && (
              <span style={{ background: '#0f172a', color: '#f8fafc', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px' }}>
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-rating-row">
            <div className="rating-stars-badge">
              <Star size={14} fill="#b45309" />
              <span>{product.rating}</span>
            </div>
            <span style={{ color: '#64748b' }}>({product.reviewsCount} Verified Campus Reviews)</span>
          </div>

          {/* Pricing */}
          <div className="pdp-price-wrap">
            <span className="pdp-price-main">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="pdp-price-original">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="pdp-price-save">{product.discount}% Instant Savings</span>
          </div>

          {/* Key Feature Specs Callout */}
          <div className="pdp-spec-highlights">
            <div className="spec-highlight-box">
              <Package size={20} color="#0066cc" />
              <div>
                <strong>Capacity: {product.capacity}</strong>
                <span>Optimized Volume</span>
              </div>
            </div>

            {product.laptopCompartment && (
              <div className="spec-highlight-box">
                <Laptop size={20} color="#0066cc" />
                <div>
                  <strong>{product.laptopCompartment}</strong>
                  <span>Shock-Absorbing Sleeve</span>
                </div>
              </div>
            )}

            <div className="spec-highlight-box">
              <Droplets size={20} color="#0284c7" />
              <div>
                <strong>{product.waterproof}</strong>
                <span>Weather Resistant</span>
              </div>
            </div>

            <div className="spec-highlight-box">
              <ShieldCheck size={20} color="#16a34a" />
              <div>
                <strong>{product.warranty}</strong>
                <span>VIP Industries Assurance</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Select Color Variant: <span style={{ color: '#0066cc' }}>{selectedColor.name}</span>
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: selectedColor.name === c.name ? '3px solid #0066cc' : '1px solid #cbd5e1',
                    outline: selectedColor.name === c.name ? '2px solid rgba(0, 102, 204, 0.3)' : 'none',
                    cursor: 'pointer'
                  }}
                  title={c.name}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Indian PIN Code Delivery Estimator */}
          <div className="pdp-pincode-checker">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
              <MapPin size={16} /> Check Estimated Delivery to Your Indian PIN code:
            </div>
            <form onSubmit={handleCheckPincode} className="pincode-input-row">
              <input 
                type="text" 
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-Digit PIN (e.g. 411001)"
                className="pincode-input"
              />
              <button type="submit" className="btn-check-pin">
                Check PIN
              </button>
            </form>
            {pincodeResult && (
              <div className="delivery-estimate-result">
                ✓ FREE Delivery to {pincodeResult.city}, {pincodeResult.state} • Estimated: <strong>{pincodeResult.deliveryDays}</strong>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="pdp-cta-row">
            <button 
              className="btn-pdp-cart"
              onClick={() => addToCart(product, selectedColor, qty)}
            >
              <ShoppingBag size={18} /> Add To Bag
            </button>
            <button 
              className="btn-pdp-buy"
              onClick={handleBuyNow}
            >
              <Zap size={18} /> Buy Now
            </button>
            <button 
              className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              style={{ position: 'static', width: '52px', height: '52px', border: '1px solid #cbd5e1' }}
              onClick={() => toggleWishlist(product.id)}
              title="Save to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? "#ef4444" : "none"} />
            </button>
          </div>

          {/* Description Paragraph */}
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Bullet Features */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Key Product Highlights:</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                  <Check size={16} color="#16a34a" /> {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specs Breakdown Table */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>Technical Specifications:</h4>
            <table className="pdp-specs-table">
              <tbody>
                <tr>
                  <td>Volume / Capacity</td>
                  <td>{product.capacity}</td>
                </tr>
                {product.laptopCompartment && (
                  <tr>
                    <td>Laptop Compatibility</td>
                    <td>{product.laptopCompartment}</td>
                  </tr>
                )}
                <tr>
                  <td>Water Resistance</td>
                  <td>{product.waterproof}</td>
                </tr>
                <tr>
                  <td>Warranty Term</td>
                  <td>{product.warranty}</td>
                </tr>
                <tr>
                  <td>Material / Shell</td>
                  <td>{product.material}</td>
                </tr>
                <tr>
                  <td>Dimensions (H x W x D)</td>
                  <td>{product.dimensions}</td>
                </tr>
                <tr>
                  <td>Empty Weight</td>
                  <td>{product.weight}</td>
                </tr>
                <tr>
                  <td>Ideal For</td>
                  <td>{product.idealFor}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related / Frequently Bought Together Products */}
      <div style={{ marginTop: '4.5rem' }}>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>You May Also Like ✨</h2>
            <p>Popular picks paired with this Skybag</p>
          </div>
        </div>

        <div className="product-grid">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
