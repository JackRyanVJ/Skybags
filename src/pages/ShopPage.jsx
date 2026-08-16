import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Filter, RotateCcw, SlidersHorizontal, Laptop, Droplets, Shield, Sparkles } from 'lucide-react';

export const ShopPage = () => {
  const { filters, setFilters, resetFilters, searchQuery, setSearchQuery } = useShop();

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = (
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.categoryName.toLowerCase().includes(q) ||
          (product.tags && product.tags.some(t => t.toLowerCase().includes(q)))
        );
        if (!matches) return false;
      }

      // Price Range filter
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;

      // Laptop Fit filter
      if (filters.laptopFit !== 'all') {
        const requiredFit = parseFloat(filters.laptopFit);
        if (!product.laptopSizeValue || product.laptopSizeValue < requiredFit) {
          return false;
        }
      }

      // Waterproof filter
      if (filters.waterproofOnly && !product.isWaterproof) {
        return false;
      }

      // Capacity filter
      if (filters.minCapacity && product.capacityValue < filters.minCapacity) return false;
      if (filters.maxCapacity && product.capacityValue > filters.maxCapacity) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'discount') return b.discount - a.discount;
      return 0; // Default featured
    });
  }, [filters, searchQuery]);

  const handleCategoryChange = (catId) => {
    setFilters(prev => ({
      ...prev,
      category: catId,
      // Adjust default price sliders when changing category to match user specifications
      minPrice: catId === 'backpacks' ? 1000 : (catId === 'suitcases' ? 5000 : (catId === 'duffels' ? 3000 : 0)),
      maxPrice: catId === 'backpacks' ? 2500 : (catId === 'suitcases' ? 15000 : (catId === 'duffels' ? 5000 : 16000))
    }));
  };

  return (
    <div className="container">
      <div className="catalog-layout">
        {/* Arctic Fox Inspired Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#0f2231" />
              <h3>Filters</h3>
            </div>
            <button 
              className="reset-filter-btn"
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Collection / Categories (Arctic Fox Screenshot 5 style) */}
          <div className="filter-group">
            <div className="filter-title">Collection</div>
            <div className="category-pill-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-filter-btn ${filters.category === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    ({cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div className="filter-title">
              <span>Price Range</span>
              <span style={{ color: '#0284c7', fontSize: '0.8rem' }}>
                ₹{filters.minPrice || 0} - ₹{filters.maxPrice || 15000}
              </span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="15000" 
              step="500"
              value={filters.maxPrice || 15000}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#0066cc', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              <span>₹1,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          {/* Dedicated Laptop Fit (Crucial for students!) */}
          <div className="filter-group">
            <div className="filter-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Laptop size={15} color="#0066cc" /> Laptop Compatibility
              </span>
            </div>
            <div className="filter-options-list">
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="laptopFit"
                  checked={filters.laptopFit === 'all'}
                  onChange={() => setFilters(prev => ({ ...prev, laptopFit: 'all' }))}
                />
                <span>All Sizes</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="laptopFit"
                  checked={filters.laptopFit === '15.6'}
                  onChange={() => setFilters(prev => ({ ...prev, laptopFit: '15.6' }))}
                />
                <span>Fits 15.6" Laptops & Under</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="radio" 
                  name="laptopFit"
                  checked={filters.laptopFit === '16'}
                  onChange={() => setFilters(prev => ({ ...prev, laptopFit: '16' }))}
                />
                <span>Fits 16" Pro / Gaming Laptops</span>
              </label>
            </div>
          </div>

          {/* Bag Capacity in Litres */}
          <div className="filter-group">
            <div className="filter-title">Bag Volume / Capacity</div>
            <div className="filter-options-list">
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox"
                  checked={filters.minCapacity === 0 && filters.maxCapacity === 35}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minCapacity: e.target.checked ? 0 : 0,
                    maxCapacity: e.target.checked ? 35 : 160
                  }))}
                />
                <span>Compact (25L - 35L)</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox"
                  checked={filters.minCapacity === 36 && filters.maxCapacity === 65}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minCapacity: e.target.checked ? 36 : 0,
                    maxCapacity: e.target.checked ? 65 : 160
                  }))}
                />
                <span>Medium / Weekender (40L - 65L)</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox"
                  checked={filters.minCapacity === 66}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    minCapacity: e.target.checked ? 66 : 0,
                    maxCapacity: 160
                  }))}
                />
                <span>Large / Check-in (68L - 150L)</span>
              </label>
            </div>
          </div>

          {/* Waterproof & Weatherproof Filter */}
          <div className="filter-group">
            <div className="filter-title">Protection & Durability</div>
            <div className="filter-options-list">
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.waterproofOnly}
                  onChange={(e) => setFilters(prev => ({ ...prev, waterproofOnly: e.target.checked }))}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={14} color="#0284c7" /> Water Resistant Only
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Main View */}
        <main>
          {/* Top Sort & Results Bar */}
          <div className="catalog-top-bar">
            <div className="catalog-results-count">
              Showing <strong>{filteredProducts.length}</strong> items
              {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Sort By:</span>
              <select 
                className="catalog-sort-select"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="featured">Featured & Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="discount">Biggest Student Discount %</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎒</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>No products match your selected filters</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try clearing some filters or search keywords to view our 30 Skybags models.
              </p>
              <button className="btn-primary" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
