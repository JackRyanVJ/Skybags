import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, COUPONS } from '../data/products';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('home'); // home, backpacks, suitcases, duffels, shop, offers, recommended, stores, account, checkout
  const [selectedProduct, setSelectedProduct] = useState(null); // For Full PDP View
  const [quickViewProduct, setQuickViewProduct] = useState(null); // Quick View Modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Login Gate State (Shown on opening)
  const [showLoginGate, setShowLoginGate] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Cart State (Persisted)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('skybags_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1, selectedColor: PRODUCTS[0].colors[0] },
        { product: PRODUCTS[10], quantity: 1, selectedColor: PRODUCTS[10].colors[0] }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('skybags_wishlist');
      return saved ? JSON.parse(saved) : ['bp-1', 'bp-4', 'sc-1', 'df-2'];
    } catch {
      return ['bp-1', 'sc-1'];
    }
  });

  // Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(COUPONS[0]); // Default to student COLLEGE20

  // User State (Persisted with Demo student Varad Jadhav)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skybags_user');
      return saved ? JSON.parse(saved) : {
        isLoggedIn: true,
        name: 'Varad Jadhav',
        email: 'varad.jadhav@mumbaiuniv.edu.in',
        phone: '+91 98765 43210',
        college: 'Mumbai University (BBA Dept)',
        studentId: 'MUM-2024-BBA-089',
        isStudentVerified: true,
        avatar: 'VJ'
      };
    } catch {
      return null;
    }
  });

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('skybags_addresses');
      return saved ? JSON.parse(saved) : [
        {
          id: 'addr-1',
          type: 'College Campus / Hostel',
          isDefault: true,
          fullName: 'Varad Jadhav',
          phone: '9876543210',
          flatNo: 'Room 304, Boys Hostel B',
          street: 'University Road, Ganeshkhind',
          landmark: 'Opposite Main Library',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411007'
        },
        {
          id: 'addr-2',
          type: 'Home Residence',
          isDefault: false,
          fullName: 'Varad Jadhav',
          phone: '9876543210',
          flatNo: 'A-402, Green Meadows',
          street: 'Baner Road',
          landmark: 'Near Balewadi High Street',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411045'
        }
      ];
    } catch {
      return [];
    }
  });

  // Order History State (Persisted)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('skybags_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'SKY-IND-2026-89421',
          date: '14 August 2026',
          status: 'In Transit',
          statusStep: 3,
          courier: 'Delhivery Express (Tracking #DL98421098IN)',
          expectedDelivery: '17 August 2026',
          items: [
            { product: PRODUCTS[3], quantity: 1, selectedColor: PRODUCTS[3].colors[0], price: PRODUCTS[3].price }
          ],
          totalAmount: 1759,
          paymentMethod: 'UPI (GPay - varad@okaxis)',
          shippingAddress: 'Room 304, Boys Hostel B, University Road, Pune, Maharashtra - 411007',
          canCancel: true
        },
        {
          id: 'SKY-IND-2026-77102',
          date: '28 July 2026',
          status: 'Delivered',
          statusStep: 5,
          courier: 'BlueDart Express',
          expectedDelivery: '31 July 2026 (Delivered)',
          items: [
            { product: PRODUCTS[0], quantity: 1, selectedColor: PRODUCTS[0].colors[0], price: PRODUCTS[0].price }
          ],
          totalAmount: 1199,
          paymentMethod: 'Credit Card (Visa ending in 4082)',
          shippingAddress: 'A-402, Green Meadows, Baner Road, Pune, Maharashtra - 411045',
          canCancel: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Catalog Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 16000,
    minCapacity: 0,
    maxCapacity: 160,
    laptopFit: 'all',
    waterproofOnly: false,
    color: 'all',
    sortBy: 'featured',
    inStockOnly: true
  });

  // Synchronize with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skybags_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('skybags_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('skybags_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('skybags_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart Operations
  const addToCart = (product, selectedColor = null, quantity = 1) => {
    const color = selectedColor || product.colors[0];
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor.name === color.name
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedColor: color, quantity }];
      }
    });
    showToast(`Added "${product.name}" to cart! 🎒`);
  };

  const removeFromCart = (productId, colorName) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor.name === colorName)
    ));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId, colorName, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, colorName);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor.name === colorName) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        const prod = PRODUCTS.find(p => p.id === productId);
        showToast(`Added ${prod?.name || 'product'} to Wishlist! ❤️`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const moveWishlistToCart = (productId) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      addToCart(product, product.colors[0], 1);
      toggleWishlist(productId);
    }
  };

  // Pricing & Totals Calculation
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartOriginalTotal = cart.reduce((acc, item) => acc + (item.product.originalPrice * item.quantity), 0);
  const totalSavings = cartOriginalTotal - cartSubtotal;

  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal > (appliedCoupon.minOrder || 0)) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      couponDiscount = appliedCoupon.flatDiscount;
    }
  }

  const isFreeShipping = cartSubtotal >= 999 || appliedCoupon?.freeShipping || cart.length === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const cartFinalTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // Apply Coupon Helper
  const applyCouponCode = (codeStr) => {
    const found = COUPONS.find(c => c.code.toUpperCase() === codeStr.trim().toUpperCase());
    if (!found) {
      showToast('Invalid Coupon Code. Try COLLEGE20 or SKYBAGS10', 'error');
      return false;
    }
    if (cartSubtotal < (found.minOrder || 0)) {
      showToast(`Coupon valid on orders above ₹${found.minOrder}`, 'error');
      return false;
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully! 🎉`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Place Order Simulation
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `SKY-IND-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Order Confirmed',
      statusStep: 1,
      canCancel: true,
      courier: 'Delhivery Express Air Priority',
      expectedDelivery: new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      shippingFee: shippingFee,
      totalAmount: cartFinalTotal,
      paymentMethod: orderData.paymentMethod || 'UPI Payment',
      shippingAddress: orderData.addressString || `${orderData.flatNo}, ${orderData.street}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
      contactPhone: orderData.phone || user?.phone,
      contactName: orderData.fullName || user?.name
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Prompt Requirement: Option to Cancel Orders which are not delivered yet
  const cancelOrder = (orderId, reason = 'Customer request') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Cancelled',
          statusStep: 0,
          canCancel: false,
          cancelReason: reason,
          cancelledOn: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          refundStatus: `Refund of ₹${order.totalAmount} initiated to original payment source (UPI/Card). Credited within 24-48 hours.`
        };
      }
      return order;
    }));
    showToast(`Order #${orderId} has been successfully cancelled. Refund initiated! 💳`, 'info');
  };

  // Open Full PDP View
  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (catId) => {
    setFilters(prev => ({ ...prev, category: catId }));
    setActiveTab(catId === 'all' ? 'shop' : catId);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 16000,
      minCapacity: 0,
      maxCapacity: 160,
      laptopFit: 'all',
      waterproofOnly: false,
      color: 'all',
      sortBy: 'featured',
      inStockOnly: true
    });
    setSearchQuery('');
  };

  return (
    <ShopContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        showLoginGate,
        setShowLoginGate,
        toastMessage,
        showToast,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        cartSubtotal,
        cartOriginalTotal,
        totalSavings,
        couponDiscount,
        shippingFee,
        isFreeShipping,
        cartFinalTotal,
        user,
        setUser,
        savedAddresses,
        setSavedAddresses,
        orders,
        placeOrder,
        cancelOrder,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        resetFilters,
        navigateToProduct,
        navigateToCategory
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
