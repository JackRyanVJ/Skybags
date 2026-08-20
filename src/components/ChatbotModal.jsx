import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Percent,
  ChevronRight,
  Minimize2,
  Maximize2
} from 'lucide-react';

export const ChatbotModal = () => {
  const { 
    products, 
    navigateToProduct, 
    navigateToCategory, 
    setActiveTab,
    applyCouponCode,
    showToast 
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hey there! 👋 I am Skybot, your Skybags AI Assistant. Ask me anything like "Which bag should I buy for my college?" or "Show waterproof travel suitcases"!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendations: []
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Suggested Quick Chips
  const quickQuestions = [
    '🎒 Which bag should I buy for my college?',
    '💻 Show 15.6" laptop backpacks',
    '💧 Waterproof monsoon backpacks',
    '✈️ Best suitcases for 5-day trips',
    '🏋️ Duffel bags for gym & weekend',
    '💰 Bags under ₹2,000',
    '🎓 Student discount & coupons'
  ];

  // AI Recommendation Engine
  const generateAIResponse = (userQuery) => {
    const queryLower = userQuery.toLowerCase();

    // 1. College / Campus query
    if (queryLower.includes('college') || queryLower.includes('university') || queryLower.includes('school') || queryLower.includes('campus') || queryLower.includes('student')) {
      const collegeBackpacks = products.filter(p => p.category === 'backpacks' && (p.isBestseller || p.isFeatured || p.laptopSizeValue >= 15.6)).slice(0, 3);
      
      return {
        text: `For college hustlers & students, I highly recommend our 32L-35L backpacks with dedicated 15.6" laptop armor, ergonomic air-mesh shoulder straps, and anti-theft tech! Here are the top rated college picks:`,
        recommendations: collegeBackpacks,
        actionHint: 'Pro Tip: Use promo code COLLEGE20 for flat 20% OFF at checkout!'
      };
    }

    // 2. Laptop query
    if (queryLower.includes('laptop') || queryLower.includes('macbook') || queryLower.includes('tech') || queryLower.includes('15.6') || queryLower.includes('16')) {
      const techPacks = products.filter(p => p.category === 'backpacks' && p.laptopSizeValue >= 15.6).slice(0, 3);
      return {
        text: `Here are our top Skybags tech backpacks with triple-padded 15.6" to 16" laptop armor and organizer sleeves:`,
        recommendations: techPacks
      };
    }

    // 3. Waterproof / Monsoon query
    if (queryLower.includes('waterproof') || queryLower.includes('rain') || queryLower.includes('monsoon') || queryLower.includes('water resistant') || queryLower.includes('hydro')) {
      const waterproofBags = products.filter(p => p.isWaterproof || (p.waterproof && p.waterproof.toLowerCase().includes('water'))).slice(0, 3);
      return {
        text: `Our Hydro-Shield 100% waterproof coated collection features sealed zippers & weatherproof fabric to keep your laptop and books dry during heavy rains:`,
        recommendations: waterproofBags
      };
    }

    // 4. Travel / Suitcase / Trolley query
    if (queryLower.includes('suitcase') || queryLower.includes('trolley') || queryLower.includes('flight') || queryLower.includes('trip') || queryLower.includes('travel') || queryLower.includes('vacation') || queryLower.includes('luggage')) {
      const suitcases = products.filter(p => p.category === 'suitcases').slice(0, 3);
      return {
        text: `Planning a trip or vacation flight? Check out our top 360° spinner trolleys with TSA-approved locks & scratch-resistant polycarbonate armor:`,
        recommendations: suitcases
      };
    }

    // 5. Gym / Duffel query
    if (queryLower.includes('duffel') || queryLower.includes('gym') || queryLower.includes('weekend') || queryLower.includes('sports')) {
      const duffels = products.filter(p => p.category === 'duffels').slice(0, 3);
      return {
        text: `Here are our bestselling gym roller & weekend duffel bags with shoe compartments & wet pockets:`,
        recommendations: duffels
      };
    }

    // 6. Budget / Price query
    if (queryLower.includes('under') || queryLower.includes('cheap') || queryLower.includes('budget') || queryLower.includes('2000') || queryLower.includes('1500') || queryLower.includes('price')) {
      const budgetBags = products.filter(p => p.price <= 2000).slice(0, 3);
      return {
        text: `Looking for maximum value? Here are our top-rated Skybags under ₹2,000 with up to 50% discount:`,
        recommendations: budgetBags
      };
    }

    // 7. Student discount / Coupon query
    if (queryLower.includes('discount') || queryLower.includes('coupon') || queryLower.includes('code') || queryLower.includes('offer') || queryLower.includes('promo')) {
      return {
        text: `🎉 Exclusive Offer! Use coupon code "COLLEGE20" at checkout for FLAT 20% OFF on all backpacks, suitcases & duffels! You can also use "SKYBAGS10" for instant 10% savings.`,
        recommendations: products.filter(p => p.isOffer || p.isBestseller).slice(0, 2)
      };
    }

    // 8. Order / Cancellation query
    if (queryLower.includes('cancel') || queryLower.includes('track') || queryLower.includes('status') || queryLower.includes('return') || queryLower.includes('refund')) {
      return {
        text: `You can track or cancel any undelivered order in 1-click from your "My Account" page. Full 100% refund is initiated instantly to your original payment method (UPI / Razorpay / Card).`,
        recommendations: []
      };
    }

    // Default Fallback: Smart semantic matching
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
    let matched = products.filter(p => {
      const pStr = `${p.name} ${p.category} ${p.description} ${p.idealFor}`.toLowerCase();
      return keywords.some(k => pStr.includes(k));
    }).slice(0, 3);

    if (matched.length === 0) {
      matched = products.filter(p => p.isBestseller).slice(0, 3);
    }

    return {
      text: `Based on your request, here are the top recommended Skybags tailored for style, durability, and daily hustle:`,
      recommendations: matched
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const responseData = generateAIResponse(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseData.text,
        recommendations: responseData.recommendations || [],
        actionHint: responseData.actionHint,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleProductClick = (product) => {
    navigateToProduct(product);
    setIsMinimized(true);
    showToast(`Opened ${product.name}`, 'info');
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          className="chatbot-floating-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open Skybot AI Assistant"
        >
          <div className="chatbot-floating-icon">
            <Bot size={24} />
          </div>
          <div className="chatbot-floating-text">
            <strong style={{ fontSize: '0.85rem', display: 'block' }}>Ask Skybot AI 🤖</strong>
            <span style={{ fontSize: '0.72rem', color: '#facc15' }}>Bag Recommendations & FAQs</span>
          </div>
          <span className="chatbot-badge-ping" />
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className={`chatbot-window-container ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chatbot-avatar-circle">
                <Bot size={20} color="#051424" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Skybot AI Assistant</h4>
                  <span className="online-dot" />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#facc15' }}>Powered by Skybags Recommendation Engine</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="chatbot-head-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button 
                className="chatbot-head-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body Content when active */}
          {!isMinimized && (
            <>
              {/* Message Stream */}
              <div className="chatbot-messages-scroll">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="bot-icon-small">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className="chat-bubble-wrap">
                      <div className={`chat-bubble ${msg.sender}`}>
                        <p style={{ margin: 0, lineHeight: 1.45, fontSize: '0.88rem' }}>{msg.text}</p>
                      </div>

                      {/* Render Product Recommendation Cards if returned */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="chatbot-rec-cards-list">
                          {msg.recommendations.map((prod) => (
                            <div 
                              key={prod.id} 
                              className="chatbot-rec-card"
                              onClick={() => handleProductClick(prod)}
                            >
                              <img src={prod.image} alt={prod.name} className="chatbot-rec-img" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase' }}>
                                  {prod.categoryName || prod.category}
                                </div>
                                <h5 className="chatbot-rec-title">{prod.name}</h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>₹{prod.price.toLocaleString('en-IN')}</strong>
                                  <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8' }}>₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                                  <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.68rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                                    {prod.discount}% OFF
                                  </span>
                                </div>
                              </div>
                              <button className="chatbot-rec-view-btn">
                                View <ArrowRight size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.actionHint && (
                        <div className="chatbot-action-hint">
                          <Sparkles size={13} color="#ca8a04" /> {msg.actionHint}
                        </div>
                      )}

                      <span className="chat-timestamp">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-message-row bot">
                    <div className="bot-icon-small"><Bot size={14} /></div>
                    <div className="chat-bubble bot typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chips Carousel */}
              <div className="chatbot-quick-chips">
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Frequently Asked Questions:
                </span>
                <div className="chips-scroll-wrap">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="chatbot-chip"
                      onClick={() => handleSendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="chatbot-input-bar">
                <input
                  type="text"
                  className="chatbot-input-field"
                  placeholder="Ask Skybot... e.g. Which bag for college?"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="chatbot-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
