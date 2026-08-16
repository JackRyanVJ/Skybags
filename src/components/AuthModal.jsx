import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Lock, Mail, Phone, GraduationCap, Sparkles, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, showToast, setActiveTab } = useShop();
  
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'mobile'
  const [isRegister, setIsRegister] = useState(false);
  
  // Email fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Mobile fields
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(''); // Empty OTP input
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  if (!isAuthModalOpen) return null;

  const googleAccounts = [
    {
      name: 'Varad Jadhav',
      email: 'varad.jadhav@gmail.com',
      college: 'Mumbai University (BBA)'
    },
    {
      name: 'Varad Jadhav (College ID)',
      email: 'varad.bba2024@mu.ac.in',
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
    setIsAuthModalOpen(false);
    showToast(`Signed in with Google as ${acc.name}! 🎓`);
    setActiveTab('account');
  };

  const handleDemoStudentLogin = () => {
    setUser({
      isLoggedIn: true,
      name: 'Varad Jadhav',
      email: 'varad.jadhav@mumbaiuniv.edu.in',
      phone: '+91 98765 43210',
      college: 'Mumbai University (BBA Dept)',
      studentId: 'MUM-2024-BBA-089',
      isStudentVerified: true,
      avatar: 'VJ'
    });
    setIsAuthModalOpen(false);
    showToast('Logged in as Varad Jadhav (Student Verified ID)! 🎓');
    setActiveTab('account');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      showToast('Please enter email and password', 'error');
      return;
    }
    const userName = emailInput.split('@')[0];
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    setUser({
      isLoggedIn: true,
      name: isRegister && name ? name : (formattedName || 'Varad Jadhav'),
      email: emailInput,
      phone: '+91 98765 43210',
      college: college || 'Mumbai University (BBA Dept)',
      studentId: 'MUM-2024-BBA-089',
      isStudentVerified: true,
      avatar: (name || formattedName || 'VJ').substring(0, 2).toUpperCase(),
      authProvider: 'Email & Password'
    });
    setIsAuthModalOpen(false);
    showToast(`Signed in as ${emailInput}!`);
    setActiveTab('account');
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!phone || phone.length < 10) {
        showToast('Please enter valid 10-digit mobile', 'error');
        return;
      }
      setOtpSent(true);
      setOtp('');
      showToast('OTP sent to your mobile (+91)! (Enter 1234 to verify)', 'info');
    } else {
      if (!otp || otp.trim().length !== 4) {
        showToast('Please enter the 4-digit verification code', 'error');
        return;
      }
      setUser({
        isLoggedIn: true,
        name: name || 'Varad Jadhav',
        email: 'student@mumbaiuniv.edu.in',
        phone: `+91 ${phone}`,
        college: college || 'Mumbai University',
        studentId: 'MUM-2024-BBA-089',
        isStudentVerified: true,
        avatar: (name || 'VJ').substring(0, 2).toUpperCase()
      });
      setIsAuthModalOpen(false);
      showToast('Login verified! Welcome to Skybags.');
      setActiveTab('account');
    }
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsAuthModalOpen(false)} style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '460px',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '4px' }}
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#0066cc', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <GraduationCap size={14} /> Student & Youth Portal
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0a1f38' }}>
            {isRegister ? 'Join Skybags Club' : 'Sign In to Skybags'}
          </h3>
        </div>

        {/* Continue with Google */}
        <button 
          type="button" 
          className="google-auth-btn"
          onClick={() => setShowGoogleModal(true)}
          style={{ marginBottom: '10px' }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* 1-Click Demo Login Banner */}
        <div style={{ background: '#f8fafc', border: '1px dashed #0066cc', borderRadius: '10px', padding: '10px', marginBottom: '1rem', textAlign: 'center' }}>
          <button 
            type="button" 
            className="btn-primary" 
            style={{ width: '100%', padding: '7px 0', fontSize: '0.82rem', justifyContent: 'center' }}
            onClick={handleDemoStudentLogin}
          >
            <Sparkles size={14} /> 1-Click Login (Varad Jadhav - Mumbai Univ)
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '3px', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: '6px',
              fontSize: '0.8rem',
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
            <Mail size={13} /> Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('mobile'); setOtpSent(false); setOtp(''); }}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: '6px',
              fontSize: '0.8rem',
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
            <Smartphone size={13} /> Mobile OTP
          </button>
        </div>

        {/* Email Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isRegister && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Varad Jadhav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-checkout" 
              style={{ width: '100%', marginTop: '6px', padding: '10px', justifyContent: 'center' }}
            >
              {isRegister ? 'Register & Sign In' : 'Sign In with Email'}
            </button>
          </form>
        )}

        {/* Mobile Form */}
        {loginMethod === 'mobile' && (
          <form onSubmit={handleMobileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isRegister && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Varad Jadhav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-field" style={{ marginBottom: 0 }}>
              <label className="form-label">10-Digit Mobile Number (India +91)</label>
              <input 
                type="tel" 
                maxLength={10}
                className="form-input" 
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {otpSent && (
              <div className="form-field" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#0066cc' }}>Enter 4-Digit OTP</label>
                <input 
                  type="text" 
                  maxLength={4}
                  className="form-input" 
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.2rem', fontWeight: 800 }}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn-checkout" 
              style={{ width: '100%', marginTop: '6px', padding: '10px', justifyContent: 'center' }}
            >
              {otpSent ? 'Verify OTP & Log In' : (isRegister ? 'Send OTP for Registration' : 'Send Login OTP')}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#64748b' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setOtpSent(false); setOtp(''); }}
            style={{ color: '#0066cc', fontWeight: 700 }}
          >
            {isRegister ? 'Sign In' : 'Sign Up for Student Perks'}
          </button>
        </div>
      </div>

      {/* Google Selector Modal */}
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
              <strong style={{ fontSize: '1rem', color: '#1e293b' }}>Sign in with Google</strong>
              <button onClick={() => setShowGoogleModal(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

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
                    cursor: 'pointer'
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
          </div>
        </div>
      )}
    </div>
  );
};
