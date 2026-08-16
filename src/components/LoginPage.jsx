import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Mail,
  User,
  X,
  KeyRound
} from 'lucide-react';

export const LoginPage = ({ onClose }) => {
  const { setUser, showToast } = useShop();

  // Login Mode: 'email' | 'mobile'
  const [loginMethod, setLoginMethod] = useState('email');
  const [isSignUp, setIsSignUp] = useState(false);

  // Email login fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Mobile login fields
  const [mobileInput, setMobileInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Prompt requirement: "do not automatically add 1234 as OTP" -> empty string
  const [otp, setOtp] = useState('');

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Google Accounts simulation
  const googleAccounts = [
    {
      name: 'Varad Jadhav',
      email: 'varad.jadhav@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      college: 'Mumbai University (BBA)'
    },
    {
      name: 'Varad Jadhav (College ID)',
      email: 'varad.bba2024@mu.ac.in',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      college: 'University of Mumbai'
    }
  ];

  const handleGoogleSelect = (acc) => {
    setUser({
      isLoggedIn: true,
      name: acc.name,
      email: acc.email,
      phone: '+91 98765 43210',
      college: acc.college,
      studentId: 'MUM-2024-BBA-089',
      isStudentVerified: true,
      avatar: 'VJ',
      authProvider: 'Google'
    });
    setShowGoogleModal(false);
    showToast(`Signed in with Google as ${acc.name}! 🎓`);
    if (onClose) onClose();
  };

  const handle1ClickDemo = () => {
    setUser({
      isLoggedIn: true,
      name: 'Varad Jadhav',
      email: 'varad.jadhav@mumbaiuniv.edu.in',
      phone: '+91 98765 43210',
      college: 'Mumbai University (BBA Dept)',
      studentId: 'MUM-2024-BBA-089',
      isStudentVerified: true,
      avatar: 'VJ',
      authProvider: 'Campus SSO'
    });
    showToast('Logged in as Varad Jadhav (Student Verified ID)! 🎓');
    if (onClose) onClose();
  };

  // Email Login Submit Handler
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      showToast('Please enter both your email address and password', 'error');
      return;
    }
    const userName = emailInput.split('@')[0];
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    setUser({
      isLoggedIn: true,
      name: isSignUp && fullName ? fullName : (formattedName || 'Varad Jadhav'),
      email: emailInput,
      phone: '+91 98765 43210',
      college: collegeName || 'Mumbai University (BBA Dept)',
      studentId: 'MUM-2024-BBA-089',
      isStudentVerified: true,
      avatar: (fullName || formattedName || 'VJ').substring(0, 2).toUpperCase(),
      authProvider: 'Email & Password'
    });
    showToast(`Signed in successfully with ${emailInput}! Welcome to Skybags.`);
    if (onClose) onClose();
  };

  // Mobile OTP Submit Handler
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!mobileInput || mobileInput.length < 10) {
        showToast('Please enter a valid 10-digit Indian mobile number', 'error');
        return;
      }
      setOtpSent(true);
      setOtp(''); // Empty OTP input so user types it in
      showToast('4-digit OTP sent to +91 ' + mobileInput + '! (Use test code: 1234)', 'info');
    } else {
      if (!otp || otp.trim().length !== 4) {
        showToast('Please enter the 4-digit verification code', 'error');
        return;
      }
      setUser({
        isLoggedIn: true,
        name: fullName || 'Varad Jadhav',
        email: 'student@mumbaiuniv.edu.in',
        phone: `+91 ${mobileInput}`,
        college: collegeName || 'Mumbai University',
        studentId: 'MUM-2024-BBA-089',
        isStudentVerified: true,
        avatar: (fullName || 'VJ').substring(0, 2).toUpperCase(),
        authProvider: 'Mobile OTP'
      });
      showToast('Mobile verified! Welcome to Skybags.');
      if (onClose) onClose();
    }
  };

  const handleSkip = () => {
    if (onClose) onClose();
    showToast('Browsing as Guest. Log in anytime for student discounts!', 'info');
  };

  return (
    <div className="login-gate-overlay">
      <div className="login-gate-card">
        {/* Top Skybags Logo & Banner */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '6px 16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
            <img 
              src="/images/brand/skybags_logo.png" 
              alt="Skybags Logo" 
              style={{ height: '34px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="brand-font" style={{ color: '#0066cc', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
              Skybags
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef08a', color: '#854d0e', padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
            <GraduationCap size={13} /> Official Student & Youth Store
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0a1f38', lineHeight: 1.2 }}>
            {isSignUp ? 'Create Your Skybags Account' : 'Sign in to Skybags'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
            Unlock exclusive college discounts (20% OFF), 15.6" laptop packs & order tracking.
          </p>
        </div>

        {/* 1. Google Login Option */}
        <button 
          type="button" 
          className="google-auth-btn"
          onClick={() => setShowGoogleModal(true)}
          style={{ marginBottom: '10px' }}
        >
          {/* Official Google 'G' Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* 2. 1-Click Fast Student Demo Login */}
        <div style={{ background: '#eff6ff', border: '1px dashed #0066cc', borderRadius: '10px', padding: '10px', marginBottom: '1rem', textAlign: 'center' }}>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ width: '100%', padding: '8px 0', fontSize: '0.82rem', justifyContent: 'center' }}
            onClick={handle1ClickDemo}
          >
            <Sparkles size={14} color="#0a1f38" /> 1-Click Student Login (Varad Jadhav - Mumbai Univ)
          </button>
        </div>

        {/* 3. Method Switcher Tabs: Email vs Mobile */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: loginMethod === 'email' ? '#ffffff' : 'transparent',
              color: loginMethod === 'email' ? '#0066cc' : '#64748b',
              boxShadow: loginMethod === 'email' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Mail size={14} /> Login with Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('mobile'); setOtpSent(false); setOtp(''); }}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: loginMethod === 'mobile' ? '#ffffff' : 'transparent',
              color: loginMethod === 'mobile' ? '#0066cc' : '#64748b',
              boxShadow: loginMethod === 'mobile' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Smartphone size={14} /> Login with Mobile
          </button>
        </div>

        {/* 4A. EMAIL LOGIN FORM */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isSignUp && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Varad Jadhav"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. varad.jadhav@college.edu.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">College / University Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Pune University (BBA)"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-checkout" 
              style={{ width: '100%', marginTop: '4px', padding: '10px', justifyContent: 'center' }}
            >
              {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* 4B. MOBILE OTP LOGIN FORM */}
        {loginMethod === 'mobile' && (
          <form onSubmit={handleMobileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isSignUp && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Varad Jadhav"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">10-Digit Mobile Number (India +91) *</label>
              <input 
                type="tel" 
                maxLength={10}
                className="form-input" 
                placeholder="e.g. 9876543210"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                required
              />
            </div>

            {otpSent && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#0066cc', fontWeight: 800 }}>Enter 4-Digit Verification OTP</label>
                <input 
                  type="text" 
                  maxLength={4}
                  className="form-input" 
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  style={{ textAlign: 'center', letterSpacing: '10px', fontSize: '1.25rem', fontWeight: 900, borderColor: '#0066cc' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px', textAlign: 'center', display: 'block' }}>
                  OTP sent to mobile. Enter 4-digit code to continue.
                </span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-checkout" 
              style={{ width: '100%', marginTop: '4px', padding: '10px', justifyContent: 'center' }}
            >
              {otpSent ? 'Verify OTP & Enter Skybags' : (isSignUp ? 'Send Registration OTP' : 'Send Login OTP')} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Toggle Sign Up / Sign In & Skip Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.82rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setOtpSent(false); setOtp(''); }}
            style={{ color: '#0066cc', fontWeight: 700 }}
          >
            {isSignUp ? 'Already have account? Sign In' : "New student? Sign Up"}
          </button>

          <button 
            type="button" 
            onClick={handleSkip}
            style={{ color: '#64748b', fontWeight: 700, textDecoration: 'underline' }}
          >
            Skip & Explore Store →
          </button>
        </div>
      </div>

      {/* Google Account Selector Modal Simulation */}
      {showGoogleModal && (
        <div className="drawer-backdrop" onClick={() => setShowGoogleModal(false)} style={{ alignItems: 'center', justifyContent: 'center', zIndex: 100000 }}>
          <div 
            style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '420px',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Sign in with Google</strong>
              </div>
              <button onClick={() => setShowGoogleModal(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
              Choose an account to continue to <strong>Skybags Online Store</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
              {googleAccounts.map((acc, i) => (
                <div 
                  key={i}
                  onClick={() => handleGoogleSelect(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#0066cc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0066cc', color: '#facc15', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{acc.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4, textAlign: 'center' }}>
              To continue, Google will share your name, email address, and profile picture with Skybags.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
