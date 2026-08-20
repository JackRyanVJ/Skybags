import React, { useState } from 'react';
import { 
  ChevronDown, 
  Search, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Laptop, 
  Luggage,
  Bot,
  MessageSquare
} from 'lucide-react';

export const FAQ_DATA = [
  {
    id: 'faq-1',
    category: 'college',
    question: 'Which Skybags backpack is best for college students carrying a 15.6" or 16" laptop?',
    answer: 'Our Transit Series Pro 35L (bp-4), Stealth Neon 30L Tech Pack (bp-2), and Move in Style Bolt 32L (bp-1) are top picks for college. They feature triple-padded 15.6" to 16" laptop armor sleeves, ergonomic air-mesh shoulder straps, multi-pocket organizers, and anti-theft tech.'
  },
  {
    id: 'faq-2',
    category: 'discounts',
    question: 'How do I get the Flat 20% OFF Student Discount?',
    answer: 'Use the official student promo code "COLLEGE20" at checkout for an instant flat 20% discount across all backpacks, suitcases, and duffels. You can also use code "SKYBAGS10" for 10% off.'
  },
  {
    id: 'faq-3',
    category: 'orders',
    question: 'Can I cancel my order before delivery? How does the refund work?',
    answer: 'Yes! You can cancel any undelivered order in 1-click directly from your Account page or Order Tracker screen. Full 100% refund is initiated instantly to your original payment method (UPI / Razorpay / Credit Card) and credited within 24-48 hours.'
  },
  {
    id: 'faq-4',
    category: 'college',
    question: 'Are Skybags backpacks waterproof for the monsoon season?',
    answer: 'Yes, our backpacks feature Hydro-Shield 100% weather-proof coating, water-resistant ripstop polyester fabric, and coated zippers to keep your laptop, notebooks, and gear safe during heavy rains.'
  },
  {
    id: 'faq-5',
    category: 'travel',
    question: 'What features are included in Skybags Suitcases and Trolley Luggage?',
    answer: 'Skybags suitcases feature 360° silent dual spinner wheels, TSA-approved combination security locks, lightweight scratch-proof polycarbonate shells, and expandable packing compartments.'
  },
  {
    id: 'faq-6',
    category: 'payments',
    question: 'What payment options are supported at checkout?',
    answer: 'We support Razorpay Secure Payment Gateway (UPI - Google Pay, PhonePe, Paytm, BHIM, Credit/Debit Cards, NetBanking) and Cash on Delivery (COD) with doorstep courier payment.'
  },
  {
    id: 'faq-7',
    category: 'warranty',
    question: 'What warranty is provided on Skybags products?',
    answer: 'All Skybags products come with 1 to 5 Years International Warranty backed by VIP Industries pan-India service network. Warranty covers manufacturing defects, zipper failures, and structural hardware.'
  },
  {
    id: 'faq-8',
    category: 'orders',
    question: 'What is the shipping time and delivery threshold across India?',
    answer: 'We offer Free Express Pan-India Delivery on all orders above ₹999. Express dispatches via BlueDart Air Priority and Delhivery arrive within 2-3 business days across metro cities like Mumbai, Pune, Delhi, Bengaluru, and Kolkata.'
  }
];

export const FaqSection = ({ onOpenChatbot }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState(['faq-1', 'faq-2']);

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'college', label: '🎒 College & Laptops' },
    { id: 'travel', label: '✈️ Suitcases & Travel' },
    { id: 'discounts', label: '💰 Student Offers' },
    { id: 'orders', label: '🚚 Orders & Returns' },
    { id: 'payments', label: '💳 Payments & Warranty' }
  ];

  const toggleFaq = (id) => {
    setOpenFaqIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="faq-section" id="faq-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          <span style={{ 
            background: 'rgba(0, 102, 204, 0.1)', 
            color: '#0066cc', 
            fontSize: '0.78rem', 
            fontWeight: 800, 
            padding: '4px 14px', 
            borderRadius: '999px', 
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Help Center & Guidelines
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '8px', color: '#0f172a' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px', lineHeight: 1.5 }}>
            Everything you need to know about Skybags college backpacks, travel trolleys, student discounts, and 1-click order cancellations.
          </p>

          {/* Search Box */}
          <div style={{ position: 'relative', marginTop: '1.5rem', maxWidth: '520px', margin: '1.5rem auto 0' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              className="faq-search-input"
              placeholder="Search questions (e.g. laptop, warranty, cancellation, coupon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="faq-tabs-row">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`faq-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions List */}
        <div className="faq-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '12px' }}>
              <HelpCircle size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>No matching questions found</h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>Try searching another keyword or ask Skybot AI assistant!</p>
            </div>
          ) : (
            filteredFaqs.map(faq => {
              const isOpen = openFaqIds.includes(faq.id);
              return (
                <div key={faq.id} className={`faq-card ${isOpen ? 'open' : ''}`}>
                  <button 
                    className="faq-question-btn"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className={`faq-chevron-icon ${isOpen ? 'rotate' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-content">
                      <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.92rem', color: '#475569' }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions? Banner */}
        <div className="faq-ai-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0066cc', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              <Bot size={26} />
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block' }}>Still have specific questions or need personalized bag advice?</strong>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Chat with Skybot AI Assistant right now for instant product recommendations!</span>
            </div>
          </div>
          {onOpenChatbot && (
            <button className="btn-primary" onClick={onOpenChatbot} style={{ whiteSpace: 'nowrap' }}>
              Ask Skybot AI 🤖
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
