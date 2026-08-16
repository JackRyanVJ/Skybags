import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  Sparkles, 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Award
} from 'lucide-react';

export const RecommendedPage = () => {
  const { navigateToCategory } = useShop();

  // Interactive 3-Step Finder Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    userType: '',
    primaryUse: '',
    laptopSize: ''
  });
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (key, val) => {
    const updated = { ...quizAnswers, [key]: val };
    setQuizAnswers(updated);
    if (quizStep < 3) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers({ userType: '', primaryUse: '', laptopSize: '' });
    setQuizCompleted(false);
  };

  // Recommendations logic based on quiz
  let recommendedProducts = [];
  if (quizCompleted) {
    if (quizAnswers.primaryUse === 'flights' || quizAnswers.primaryUse === 'vacations') {
      recommendedProducts = PRODUCTS.filter(p => p.category === 'suitcases');
    } else if (quizAnswers.primaryUse === 'gym' || quizAnswers.primaryUse === 'sports') {
      recommendedProducts = PRODUCTS.filter(p => p.category === 'duffels');
    } else {
      // Backpacks
      if (quizAnswers.laptopSize === '16') {
        recommendedProducts = PRODUCTS.filter(p => p.laptopSizeValue >= 16.0);
      } else {
        recommendedProducts = PRODUCTS.filter(p => p.category === 'backpacks');
      }
    }
  } else {
    // Default top curated picks
    recommendedProducts = PRODUCTS.filter(p => p.isFeatured || p.isBestseller).slice(0, 8);
  }

  const campusFavorites = PRODUCTS.filter(p => p.category === 'backpacks').slice(0, 4);
  const flightReadySets = PRODUCTS.filter(p => p.category === 'suitcases').slice(0, 4);
  const workoutRollers = PRODUCTS.filter(p => p.category === 'duffels').slice(0, 4);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#0066cc', padding: '4px 14px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
          <Sparkles size={14} /> Smart Bag Finder & Curated Edits
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0a1f38', letterSpacing: '-0.03em' }}>
          Recommended For You
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0', lineHeight: 1.5 }}>
          Answer 3 quick questions to discover the perfect Skybag engineered for your college schedule, travel plans, and gear requirements.
        </p>
      </div>

      {/* Interactive 3-Step Finder Card */}
      <div style={{
        background: 'linear-gradient(135deg, #051424 0%, #003366 50%, #004c99 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '4rem',
        boxShadow: '0 20px 40px rgba(0, 102, 204, 0.25)',
        border: '1px solid rgba(250, 204, 21, 0.3)'
      }}>
        {!quizCompleted ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Question {quizStep} of 3
              </span>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Step {quizStep} / 3
              </span>
            </div>

            {/* Step 1 */}
            {quizStep === 1 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  1. Who are you shopping for?
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { id: 'college', title: '🎓 College / University Student', sub: 'Coding, Lectures, Campus Life' },
                    { id: 'professional', title: '💼 Intern / Young Professional', sub: 'Work, Office, Commute' },
                    { id: 'traveler', title: '✈️ Traveler & Wanderlust', sub: 'Vacations, Flights, Weekend Trips' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer('userType', opt.id)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'left',
                        color: '#fff',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.15)'; e.currentTarget.style.borderColor = '#facc15'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    >
                      <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {quizStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  2. What is your primary intended usage?
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { id: 'daily-books', title: '🎒 Daily Books & Laptop', sub: 'Need 15.6" protection & 30L+ space' },
                    { id: 'flights', title: '🧳 Flights & Long Vacations', sub: 'Need TSA spinner suitcases (55-75cm)' },
                    { id: 'gym', title: '🏋️‍♂️ Gym, Sports & Weekend Getaways', sub: 'Need duffel bags with shoe compartment' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer('primaryUse', opt.id)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'left',
                        color: '#fff',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.15)'; e.currentTarget.style.borderColor = '#facc15'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    >
                      <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {quizStep === 3 && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  3. What device / laptop size do you usually carry?
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { id: '15.6', title: '💻 15.6 Inch Standard Laptop', sub: 'Standard Dell, HP, Lenovo, ASUS' },
                    { id: '16', title: '⚡ 16 Inch Pro / Gaming Laptop', sub: 'MacBook Pro 16", Legion, ROG Strix' },
                    { id: 'none', title: '📱 Tablet / iPad / No Laptop', sub: 'Compact lightweight carry' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer('laptopSize', opt.id)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'left',
                        color: '#fff',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(250, 204, 21, 0.15)'; e.currentTarget.style.borderColor = '#facc15'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    >
                      <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>{opt.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ background: '#facc15', color: '#0a1f38', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                Match Found
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '8px', marginBottom: '4px' }}>
                Curated Recommendations Based on Your Needs
              </h3>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
                Showing top matching Skybag models with optimal capacity, laptop sleeve armor, and water resistance.
              </p>
            </div>

            <button
              onClick={resetQuiz}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RotateCcw size={15} /> Retake Quiz
            </button>
          </div>
        )}
      </div>

      {/* Quiz Match Results or Featured Recommendations */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {quizCompleted ? 'Your Top Personalized Matches' : 'Trending Recommendations for Students'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Handcrafted selections backed by 1-5 Year VIP Warranty & Student Deals
            </p>
          </div>
        </div>

        <div className="product-grid">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Collection 1: College & Tech */}
      <section style={{ marginBottom: '4rem', background: '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase' }}>Curated Edit 01</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Top Backpacks for College Commuters</h3>
          </div>
          <button 
            className="btn-secondary" 
            style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
            onClick={() => navigateToCategory('backpacks')}
          >
            Explore All Backpacks <ArrowRight size={15} />
          </button>
        </div>

        <div className="product-grid">
          {campusFavorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Collection 2: Vacations & Flight Trolleys */}
      <section style={{ marginBottom: '4rem', background: '#eff6ff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase' }}>Curated Edit 02</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>TSA Spinner Luggage for Flights & Semester Moves</h3>
          </div>
          <button 
            className="btn-secondary" 
            style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
            onClick={() => navigateToCategory('suitcases')}
          >
            Explore All Trolleys <ArrowRight size={15} />
          </button>
        </div>

        <div className="product-grid">
          {flightReadySets.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Collection 3: Gym & Weekend Outstation Rollers */}
      <section style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0066cc', textTransform: 'uppercase' }}>Curated Edit 03</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Gym Roller Duffels with Separate Shoe Garage</h3>
          </div>
          <button 
            className="btn-secondary" 
            style={{ color: '#0f172a', borderColor: '#cbd5e1' }}
            onClick={() => navigateToCategory('duffels')}
          >
            Explore All Duffels <ArrowRight size={15} />
          </button>
        </div>

        <div className="product-grid">
          {workoutRollers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
