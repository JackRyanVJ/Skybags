import React, { useEffect } from 'react';
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
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { activeTab, setActiveTab, showLoginGate, setShowLoginGate } = useShop();

  // Listen to path changes or URL navigation to /admin-skybags
  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname === '/admin-skybags' || hash === '#admin-skybags' || hash === '#/admin-skybags') {
        setActiveTab('admin');
        setShowLoginGate(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [setActiveTab, setShowLoginGate]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminPage />;
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

  // If in Admin portal, render dedicated Admin view
  if (activeTab === 'admin') {
    return (
      <div className="app-container">
        <AdminPage />
        <Toast />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 
        Prompt Requirement: "Create a login page when the website is opened"
        Shows the interactive Skybags Login Screen with Google login, Email login & Student SSO
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
