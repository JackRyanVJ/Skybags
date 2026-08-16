import React from 'react';
import { useShop, ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { LoginPage } from './components/LoginPage';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { RecommendedPage } from './pages/RecommendedPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { OffersPage } from './pages/OffersPage';

function AppContent() {
  const { activeTab, showLoginGate, setShowLoginGate } = useShop();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'shop':
      case 'backpacks':
      case 'suitcases':
      case 'duffels':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
        return <AccountPage />;
      case 'recommended':
        return <RecommendedPage />;
      case 'stores':
        return <StoreLocatorPage />;
      case 'offers':
        return <OffersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      {/* 
        Prompt Requirement: "Create a login page when the website is opened"
        Shows the interactive Skybags Login Screen with Google login & Student SSO
      */}
      {showLoginGate && (
        <LoginPage onClose={() => setShowLoginGate(false)} />
      )}

      <Navbar />
      <main className="main-content">
        {renderActiveView()}
      </main>
      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <SearchModal />
      <AuthModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
