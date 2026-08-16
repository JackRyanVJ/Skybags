import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { STORES, CITIES } from '../data/stores';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Store
} from 'lucide-react';

export const StoreLocatorPage = () => {
  const { showToast } = useShop();

  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(STORES[0]);

  const filteredStores = STORES.filter(s => {
    const matchesCity = selectedCity === 'All Cities' || s.city.toLowerCase() === selectedCity.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.pincode.includes(q) ||
      s.address.toLowerCase().includes(q);
    return matchesCity && matchesQuery;
  });

  const handleGetDirections = (store) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapQuery || store.address)}`;
    window.open(url, '_blank');
    showToast(`Opening Google Maps directions for ${store.name}! 🗺️`);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#0066cc', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <Store size={14} /> VIP Industries Authorized Network
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0a1f38' }}>
          Find a Skybags Store Near You
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
          Visit 12+ official experience stores across Pune, Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata & Ahmedabad
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        flexWrap: 'wrap'
      }}>
        {/* City Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0a1f38', textTransform: 'uppercase' }}>
            Filter City:
          </span>
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: selectedCity === c ? '#0a1f38' : '#f1f5f9',
                color: selectedCity === c ? '#facc15' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', minWidth: '240px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search mall, area, PIN code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Main Locator Layout: Store List + Visual Map Canvas */}
      <div className="store-locator-layout">
        {/* Stores List Scroll */}
        <div className="store-list-scroll">
          {filteredStores.length === 0 ? (
            <div style={{ background: '#fff', padding: '2rem', textAlign: 'center', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: 700 }}>No stores found for this search</p>
              <button 
                onClick={() => { setSelectedCity('All Cities'); setSearchQuery(''); }}
                style={{ color: '#0066cc', fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredStores.map(store => (
              <div
                key={store.id}
                className={`store-card ${selectedStore?.id === store.id ? 'active' : ''}`}
                onClick={() => setSelectedStore(store)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h4 className="store-name">{store.name}</h4>
                  <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    {store.city}
                  </span>
                </div>

                <div className="store-status-pill">
                  <CheckCircle2 size={13} /> {store.hours}
                </div>

                <p className="store-address">
                  {store.address} (PIN: {store.pincode})
                </p>

                {store.landmark && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    📍 <strong>Landmark:</strong> {store.landmark}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                  {store.tags.map((t, idx) => (
                    <span key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="store-contact-row">
                  <span>📞 {store.phone}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(store);
                    }}
                    style={{ color: '#0066cc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                  >
                    Directions <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visual Map Canvas / Detail Panel */}
        <div className="store-map-canvas">
          <div className="map-mock-header">
            <div>
              <strong style={{ fontSize: '1rem', color: '#facc15' }}>
                {selectedStore ? selectedStore.name : 'Select a Store'}
              </strong>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {selectedStore?.city}, {selectedStore?.state} • Distance: ~{selectedStore?.distanceKm || '2.5'} km
              </div>
            </div>
            {selectedStore && (
              <button
                onClick={() => handleGetDirections(selectedStore)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Navigation size={14} /> Open in Maps
              </button>
            )}
          </div>

          <div className="map-interactive-view">
            {/* Animated Pin */}
            <div className="map-store-pin">
              <MapPin size={16} />
              <span>{selectedStore?.city || 'Skybags Flagship'}</span>
            </div>

            {/* Floating Store Info Badge */}
            {selectedStore && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(6, 21, 39, 0.95)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                    {selectedStore.address}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#facc15', marginTop: '2px' }}>
                    ⚡ Student ID Discount: 20% Instant Off Available Here
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800 }}>
                    ✓ Stock Available
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {selectedStore.hours}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
