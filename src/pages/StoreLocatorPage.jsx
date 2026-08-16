import React, { useState } from 'react';
import { STORES, CITIES } from '../data/stores';
import { useShop } from '../context/ShopContext';
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const StoreLocatorPage = () => {
  const { showToast } = useShop();
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);

  const filteredStores = STORES.filter(store => {
    if (selectedCity !== 'All Cities' && store.city !== selectedCity) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        store.name.toLowerCase().includes(q) ||
        store.city.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q) ||
        store.pincode.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <MapPin size={14} /> VIP & Skybags Official Store Network
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.15 }}>
          Nearby Skybags Store Locator
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
          Visit our flagship experience outlets across India to try backpacks on in-person, claim instant warranty services, and explore student deals.
        </p>
      </div>

      {/* Search & City Filter Bar */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by Mall name, City, or 6-digit PIN (e.g. Phoenix Pune, 411014)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
            {filteredStores.length} Stores Found
          </span>
        </div>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                background: selectedCity === city ? '#0f2231' : '#f1f5f9',
                color: selectedCity === city ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: selectedCity === city ? '#0f2231' : '#e2e8f0'
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Store Layout (List + Interactive Map Simulator) */}
      <div className="store-locator-layout">
        {/* Left: Scrollable Store List */}
        <div className="store-list-scroll">
          {filteredStores.map(store => (
            <div 
              key={store.id} 
              className={`store-card ${selectedStore.id === store.id ? 'active' : ''}`}
              onClick={() => setSelectedStore(store)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 className="store-name">{store.name}</h4>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                  {store.distanceKm} km
                </span>
              </div>

              <div className="store-status-pill">
                <Clock size={12} /> {store.hours}
              </div>

              <p className="store-address">
                {store.address}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0' }}>
                {store.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', fontWeight: 700, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="store-contact-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={13} /> {store.phone}
                </span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>
                  ✓ {store.stockStatus}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Map Interactive Simulator */}
        <div className="store-map-canvas">
          <div className="map-mock-header">
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Selected Outlet</div>
              <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{selectedStore.name}</strong>
            </div>
            <button 
              className="btn-primary" 
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.mapQuery)}`;
                window.open(url, '_blank');
              }}
            >
              <Navigation size={14} /> Open in Google Maps
            </button>
          </div>

          <div className="map-interactive-view">
            <div className="map-store-pin">
              <MapPin size={16} /> {selectedStore.name} ({selectedStore.distanceKm} km away)
            </div>

            {/* Bottom floating details in map */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.25rem', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{selectedStore.name}</h5>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{selectedStore.landmark} • {selectedStore.city}, {selectedStore.pincode}</div>
                </div>
                <div style={{ background: '#15803d', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                  OPEN NOW
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                <div>📞 {selectedStore.phone}</div>
                <div>🕒 {selectedStore.hours}</div>
                <div style={{ color: '#34d399', fontWeight: 700 }}>🎒 In-Store Tryouts Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
