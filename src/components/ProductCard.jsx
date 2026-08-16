import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Shield, Laptop, Droplets } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateToProduct, 
    setQuickViewProduct 
  } = useShop();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const isWishlisted = isInWishlist(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      {/* Product Image Wrap */}
      <div 
        className="product-card-img-wrap"
        onClick={() => navigateToProduct(product)}
      >
        {/* Discount Badge (Arctic Fox red pill) */}
        {product.discount > 0 && (
          <span className="product-badge-discount">
            -{product.discount}%
          </span>
        )}

        {/* Secondary Badge */}
        {product.badge && (
          <span className="product-badge-secondary">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} />
        </button>

        {/* Product Extracted Image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-card-img" 
          loading="lazy"
        />

        {/* Quick View Button */}
        <button 
          className="card-quickview-btn"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
        >
          <Eye size={13} style={{ display: 'inline', marginRight: '4px' }} /> Quick View
        </button>
      </div>

      {/* Card Content Body */}
      <div className="product-card-body">
        <div className="product-card-category">
          {product.categoryName} • {product.capacity}
        </div>

        <h4 
          className="product-card-title"
          onClick={() => navigateToProduct(product)}
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Feature Specs Badges */}
        <div className="product-card-spec-row">
          {product.laptopCompartment && product.category === 'backpacks' && (\n            <span className="spec-pill" title={product.laptopCompartment}>
              <Laptop size={11} /> {product.laptopSizeValue ? `${product.laptopSizeValue}" Laptop` : 'Laptop Ready'}
            </span>
          )}
          {product.isWaterproof && (
            <span className="spec-pill" title="Water Resistant">
              <Droplets size={11} /> Water-Shield
            </span>
          )}
          {product.warranty && (
            <span className="spec-pill" title={product.warranty}>
              <Shield size={11} /> Warranty
            </span>
          )}
        </div>

        {/* Color Swatches (Arctic Fox style clickable dots) */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-swatches-row">
            {product.colors.map((c, idx) => (
              <span
                key={idx}
                className={`swatch-dot ${selectedColor.name === c.name ? 'active' : ''}`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="swatch-count-more">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
          <span className="discount-text">{product.discount}% OFF</span>
        </div>

        {/* Add to Cart CTA */}
        <button 
          className="btn-card-add"
          onClick={() => addToCart(product, selectedColor, 1)}
        >
          <ShoppingBag size={15} /> Add To Cart
        </button>
      </div>
    </div>
  );
};
