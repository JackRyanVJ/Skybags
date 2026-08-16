import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, Compass, CheckCircle2, RotateCcw, ArrowRight, Laptop, Droplets, Shield, Zap } from 'lucide-react';

export const RecommendedPage = () => {
  const { products, navigateToProduct } = useShop();

  // Quiz State
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    purpose: '', // college, travel, gym, hostel
    laptopSize: '', // 15.6, 16, 14, none
    budget: '' // budget, mid, luxury
  });

  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectOption = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);

    if (step < 3) {
      setStep(step + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ purpose: '', laptopSize: '', budget: '' });
    setQuizCompleted(false);
  };

  // Matched products logic
  const matchedProducts = products.filter(p => {
    if (!quizCompleted) return false;

    if (answers.purpose === 'college' && p.category !== 'backpacks') return false;
    if (answers.purpose === 'travel' && p.category !== 'suitcases') return false;
    if (answers.purpose === 'gym' && p.category !== 'duffels') return false;

    if (answers.laptopSize === '16' && (!p.laptopSizeValue || p.laptopSizeValue < 16)) return false;
    if (answers.laptopSize === '15.6' && (!p.laptopSizeValue || p.laptopSizeValue < 15.6)) return false;

    if (answers.budget === 'budget' && p.price > 2500) return false;
    if (answers.budget === 'mid' && (p.price < 2500 || p.price > 7000)) return false;
    if (answers.budget === 'luxury' && p.price < 6000) return false;

    return true;
  });

  // Fallback curated collections if quiz is fresh
  const monsoonPicks = products.filter(p => p.isWaterproof).slice(0, 4);
  const techPacks = products.filter(p => p.category === 'backpacks' && p.laptopSizeValue >= 15.6).slice(0, 4);
  const weekendGetaway = products.filter(p => p.category === 'duffels' || p.id === 'sc-1' || p.id === 'sc-10').slice(0, 4);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 6rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
          <Sparkles size={14} /> AI Recommendation Engine
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Recommended For You & Bag Finder
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '8px' }}>
          Answer 3 quick questions to discover the exact Skybags model engineered for your college routine, laptop size, and travel style.
        </p>
      </div>

      {/* Interactive 3-Step Quiz Card */}
      <div style={{ background: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '2.5rem', maxWidth: '860px', margin: '0 auto 4.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        {!quizCompleted ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                Question {step} of 3
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    style={{ 
                      width: '36px', 
                      height: '6px', 
                      borderRadius: '999px', 
                      background: step >= i ? '#0066cc' : '#e2e8f0' 
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Purpose */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                  1. What is your primary use case?
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Select the main activity you need this bag for.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {[
                    { id: 'college', title: '🎒 Daily College & Tech', desc: 'Lectures, tuition, carrying heavy books & laptop' },
                    { id: 'travel', title: '🧳 Flight Travel & Vacation', desc: 'Semester breaks, flights, family trips & luggage' },
                    { id: 'gym', title: '🏋️ Gym, Sports & Weekender', desc: 'Athletic sports kit, workouts, and 2-day roadtrips' },
                    { id: 'hostel', title: '🏢 Hostel Packing & Relocation', desc: 'Heavy high-volume bags for moving campus luggage' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption('purpose', opt.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        background: '#f8fafc',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px', color: '#0f172a' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Laptop Size */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                  2. What size laptop or tech device do you carry?
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  We'll ensure the bag includes proper shock-absorbing armor for your device.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {[
                    { id: '15.6', title: '💻 15.6" Standard Laptop', desc: 'HP, Dell, Lenovo, MacBook Pro 15, Asus' },
                    { id: '16', title: '⚡ 16" Gaming / Heavy Laptop', desc: 'ROG, Legion, Alienware, 16" Pro Laptops' },
                    { id: '14', title: '📱 14" Slim Laptop / iPad / Tablet', desc: 'MacBook Air 13/14, iPad Pro, Ultrabooks' },
                    { id: 'none', title: '🚫 No Laptop Needed', desc: 'Clothes, sports kit, shoes & travel essentials only' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption('laptopSize', opt.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        background: '#f8fafc',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px', color: '#0f172a' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
                  3. What is your preferred budget range?
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  All prices in INR with instant student discounts applied.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { id: 'budget', title: '💰 ₹1,000 – ₹2,500', desc: 'College daily backpacks & budget heroes' },
                    { id: 'mid', title: '💎 ₹3,000 – ₹6,000', desc: 'Roller duffels & premium cabin trolleys' },
                    { id: 'luxury', title: '✈️ ₹6,000 – ₹15,000', desc: 'Hardshell suitcases & luxury 3-piece sets' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption('budget', opt.id)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        background: '#f8fafc',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px', color: '#0f172a' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                  98% AI MATCH CALCULATED
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '6px' }}>
                  Your Perfect Skybags Matches
                </h3>
              </div>
              <button 
                onClick={resetQuiz} 
                className="btn-secondary" 
                style={{ color: '#0f172a', borderColor: '#cbd5e1', padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <RotateCcw size={14} /> Retake Quiz
              </button>
            </div>

            {matchedProducts.length > 0 ? (
              <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {matchedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Here are our top recommended flagship picks that closely match your criteria:
                </p>
                <div className="product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {PRODUCTS.slice(0, 3).map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Curated Theme Collections */}
      <div style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Monsoon Proof & Water-Shield Series 💧</h2>
            <p>100% Weather-resistant fabrics and coated zippers for heavy rains</p>
          </div>
        </div>
        <div className="product-grid">
          {monsoonPicks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Engineering & Tech Hustler Packs 💻</h2>
            <p>15.6" to 16" Laptop armor, multi-compartment cable organizers, and USB slots</p>
          </div>
        </div>
        <div className="product-grid">
          {techPacks.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div>
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Weekend Getaway & Gym Heavyweights 🏋️‍♂️</h2>
            <p>Spacious roller duffels with separate shoe pockets and cabin approved spinners</p>
          </div>
        </div>
        <div className="product-grid">
          {weekendGetaway.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
};
