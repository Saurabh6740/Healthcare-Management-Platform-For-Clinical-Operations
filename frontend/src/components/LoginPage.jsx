import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Shield, 
  Stethoscope, 
  UserCheck, 
  Sparkles, 
  RefreshCw, 
  KeyRound, 
  ShieldCheck,
  Check
} from 'lucide-react';
import MediSphereLogo from './MediSphereLogo';
import { 
  loginUser, 
  registerUser, 
  resetPassword, 
  getPasswordValidationDetails, 
  getLoginLockoutStatus,
  loginWithGoogleOAuth
} from '../Backend/authService';

const GOOGLE_ACCOUNTS = [
  {
    name: 'Dr. Ramesh Gupta',
    email: 'ramesh.gupta@medisphere.org',
    role: 'Doctor',
    avatarBg: 'bg-blue-600',
    initials: 'RG',
    description: 'Senior Cardiologist • Clinical Operations'
  },
  {
    name: 'Saurabh Kumar',
    email: 'saurabh@medisphere.org',
    role: 'Patient',
    avatarBg: 'bg-emerald-600',
    initials: 'SK',
    description: 'Patient Portal Account • Digital Twin'
  },
  {
    name: 'System Administrator',
    email: 'admin@medisphere.org',
    role: 'Admin',
    avatarBg: 'bg-purple-600',
    initials: 'AD',
    description: 'Security & Enterprise Core'
  }
];

export default function LoginPage({ onLogin }) {
  // Mode state: 'login', 'signup', 'forgot'
  const [authMode, setAuthMode] = useState('login');

  // Input states - strictly empty by default; no automatic prefill
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cloudflare Turnstile state
  const [turnstileVerified, setTurnstileVerified] = useState(true);
  const [isVerifyingTurnstile, setIsVerifyingTurnstile] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Registration Modal States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Patient'); // 'Doctor' or 'Patient'
  const [regSpecialty, setRegSpecialty] = useState('Cardiologist');
  const [regGender, setRegGender] = useState('Male');
  const [regAge, setRegAge] = useState(28);

  // Forgot Password States
  const [resetTarget, setResetTarget] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Terms Modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Google OAuth 2.0 Flow States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState('CHOOSER'); // 'CHOOSER' | 'CONSENT' | 'VERIFYING'
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleRole, setCustomGoogleRole] = useState('Doctor');

  // Check lockout on mount and periodically
  useEffect(() => {
    const checkLockout = () => {
      const status = getLoginLockoutStatus();
      if (status.isLocked) {
        setLockoutRemaining(status.remainingSeconds);
      } else {
        setLockoutRemaining(0);
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTurnstileClick = () => {
    if (turnstileVerified) return;
    setIsVerifyingTurnstile(true);
    setTimeout(() => {
      setIsVerifyingTurnstile(false);
      setTurnstileVerified(true);
    }, 800);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!turnstileVerified) {
      setErrorMessage('Please complete the Cloudflare security verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser({ usernameOrEmail, password });
      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(`Authenticated successfully! Opening ${result.user.role} Portal...`);
      onLogin(result.user);
    } catch {
      setErrorMessage('Authentication request failed. Please check connection.');
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await registerUser({
        name: regName,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        role: regRole,
        specialty: regSpecialty,
        gender: regGender,
        age: regAge
      });

      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(result.message);
      setTimeout(() => {
        setUsernameOrEmail(regUsername || regEmail);
        setPassword(regPassword);
        setAuthMode('login');
        setSuccessMessage('Account created! You may now sign in.');
      }, 1500);
    } catch {
      setErrorMessage('Failed to register account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await resetPassword({ usernameOrEmail: resetTarget, newPassword });
      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        return;
      }
      setSuccessMessage(result.message);
      setTimeout(() => {
        setUsernameOrEmail(resetTarget);
        setPassword(newPassword);
        setAuthMode('login');
      }, 1500);
    } catch {
      setErrorMessage('Password reset failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const regPwdValidation = getPasswordValidationDetails(regPassword);

  return (
    <div className="min-h-screen bg-[#181818] text-[#eff1f6] flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="w-full bg-[#282828] border-b border-[#3e3e3e]/60 px-6 py-2.5 flex items-center justify-between text-xs text-[#a0a0a0] z-20">
        <div className="flex items-center space-x-6">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <MediSphereLogo className="w-8 h-8" withGlow={false} />
            <span className="font-extrabold text-white text-base tracking-tight flex items-center">
              MediSphere
            </span>
          </div>
        </div>

        {/* Right Search & Premium Pill */}
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-[#777]" />
            <input 
              type="text" 
              placeholder="Search portal..." 
              readOnly
              className="bg-[#3e3e3e]/60 border border-transparent rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder-[#777] w-36 focus:outline-none"
            />
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 mr-1" />
            <span>Enterprise Core</span>
          </span>
          <div className="w-7 h-7 rounded-full bg-[#3e3e3e] border border-[#555] flex items-center justify-center text-white font-bold text-xs">
            <User className="w-3.5 h-3.5 text-zinc-400" />
          </div>
        </div>
      </header>

      {/* 2. MAIN CENTER CONTENT WITH MODAL CARD */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 relative">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Blueprint Dark Card Modal */}
        <div className="w-full max-w-[420px] bg-[#282828] border border-[#3c3c3c] rounded-2xl p-8 shadow-2xl shadow-black/80 relative z-10">
          
          {/* Brand Logo & Title */}
          <div className="flex flex-col items-center justify-center mb-6 text-center">
            <div className="mb-2.5 transform transition-transform hover:scale-105">
              <MediSphereLogo className="w-14 h-14" withGlow={true} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center">
              MediSphere
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Clinical Operations & RBAC Gateway</p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="leading-tight font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="leading-tight font-medium">{successMessage}</div>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="mb-4 p-2.5 bg-amber-950/70 border border-amber-500/40 rounded-xl text-amber-300 text-xs text-center font-semibold animate-pulse">
              Security Cooldown: Please wait {lockoutRemaining}s
            </div>
          )}

          {/* MODE: SIGN IN (Blueprint View) */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Input 1: Username or E-mail */}
              <div>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => {
                    setUsernameOrEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Username or E-mail"
                  className="w-full px-4 py-3 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116] transition-colors"
                  required
                />
              </div>

              {/* Input 2: Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Password"
                  className="w-full px-4 pr-11 py-3 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116] focus:ring-1 focus:ring-[#ffa116] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Cloudflare Turnstile Box (Faithfully replicated from blueprint) */}
              <div 
                onClick={handleTurnstileClick}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  turnstileVerified 
                    ? 'bg-[#313131] border-[#444] shadow-inner' 
                    : 'bg-[#292929] border-dashed border-[#555] hover:border-[#ffa116]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {turnstileVerified ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/50">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                  ) : isVerifyingTurnstile ? (
                    <RefreshCw className="w-4 h-4 text-[#ffa116] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded border-2 border-zinc-400"></div>
                  )}
                  <span className="text-[13px] font-semibold text-zinc-200">
                    {turnstileVerified ? 'Success!' : isVerifyingTurnstile ? 'Verifying...' : 'Verify you are human'}
                  </span>
                </div>

                {/* Cloudflare Badge */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1">
                    {/* Cloudflare Orange Cloud Icon */}
                    <svg className="w-5 h-5 text-[#f6821f]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.6.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/>
                    </svg>
                    <span className="text-[11px] font-black text-white tracking-widest">CLOUDFLARE</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 hover:underline">
                    Privacy • Terms
                  </span>
                </div>
              </div>

              {/* Sign In Button (Crisp White High-Contrast Button) */}
              <button
                type="submit"
                disabled={isSubmitting || lockoutRemaining > 0}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-900" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Legal Terms Subtext */}
              <p className="text-[11px] text-zinc-400 text-center">
                By continuing, you agree to{' '}
                <button 
                  type="button" 
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#3b82f6] hover:underline"
                >
                  Terms
                </button>
                {' '}&{' '}
                <button 
                  type="button" 
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#3b82f6] hover:underline"
                >
                  Privacy Policy
                </button>
                .
              </p>

              {/* Forgot Password? and Sign Up Links */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setResetTarget(usernameOrEmail);
                    setErrorMessage('');
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-zinc-400 hover:text-white font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>

              {/* Divider: or continue with */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3e3e3e]"></div>
                </div>
                <span className="relative px-3 bg-[#282828] text-[11px] text-zinc-500">
                  or continue with
                </span>
              </div>

              {/* Dedicated Google OAuth 2.0 Button */}
              <div>
                <button
                  type="button"
                  id="google-oauth-btn"
                  onClick={() => {
                    setErrorMessage('');
                    setSelectedGoogleAccount(null);
                    setShowCustomGoogleInput(false);
                    setGoogleStep('CHOOSER');
                    setShowGoogleModal(true);
                  }}
                  className="w-full py-2.5 px-4 bg-[#202020] hover:bg-[#2b2b2b] border border-[#3e3e3e] hover:border-zinc-500 rounded-xl text-xs font-semibold text-white flex items-center justify-center space-x-3 transition-all shadow-sm group"
                >
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.54 0 2.94.55 4.04 1.46l3.03-3.03C17.24 1.74 14.8 1 12 1 7.42 1 3.51 3.58 1.57 7.34l3.71 2.88C6.18 7.35 8.85 5 12 5z"/>
                    <path fill="#4285F4" d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.92 3.41-8.69z"/>
                    <path fill="#FBBC05" d="M5.28 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.57 7.34C.57 9.38 0 11.63 0 14s.57 4.62 1.57 6.66l3.71-2.88z"/>
                    <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.15 0-5.82-2.35-6.72-5.22L1.57 20.66C3.51 24.42 7.42 27 12 27z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

            </form>
          )}

          {/* MODE: SIGN UP (Registration Modal) */}
          {authMode === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#3e3e3e]">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <UserCheck className="w-4 h-4 mr-1.5 text-[#ffa116]" /> Create Portal Account
                </h3>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Back to Sign In
                </button>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#202020] rounded-xl border border-[#383838]">
                <button
                  type="button"
                  onClick={() => setRegRole('Doctor')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    regRole === 'Doctor'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Doctor / Provider
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('Patient')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    regRole === 'Patient'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Patient
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={regRole === 'Doctor' ? 'Dr. Sarah Jenkins' : 'Jane Doe'}
                  className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Username</label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="user.id"
                    className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@medisphere.org"
                    className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116]"
                    required
                  />
                </div>
              </div>

              {regRole === 'Doctor' ? (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Clinical Specialty</label>
                  <input
                    type="text"
                    value={regSpecialty}
                    onChange={(e) => setRegSpecialty(e.target.value)}
                    placeholder="Cardiologist, Pulmonologist..."
                    className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Gender</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full px-3 py-2 bg-[#3e3e3e] border border-[#48484e] rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Age</label>
                    <input
                      type="number"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      min="1"
                      max="120"
                      className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 8 chars, Upper, Lower, Num, Sym"
                  className="w-full px-3 py-2 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa116]"
                  required
                />
                {/* Password Criteria Pills */}
                <div className="grid grid-cols-4 gap-1 mt-1 text-[9px]">
                  <span className={`px-1 py-0.5 rounded text-center font-bold ${regPwdValidation.minLength ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-[#333] text-zinc-500'}`}>
                    8+ Chars
                  </span>
                  <span className={`px-1 py-0.5 rounded text-center font-bold ${regPwdValidation.hasUpper && regPwdValidation.hasLower ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-[#333] text-zinc-500'}`}>
                    Case (A/a)
                  </span>
                  <span className={`px-1 py-0.5 rounded text-center font-bold ${regPwdValidation.hasNumber ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-[#333] text-zinc-500'}`}>
                    Number (0-9)
                  </span>
                  <span className={`px-1 py-0.5 rounded text-center font-bold ${regPwdValidation.hasSpecial ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' : 'bg-[#333] text-zinc-500'}`}>
                    Symbol (@#$)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 mt-2 bg-[#ffa116] hover:bg-[#ff9300] text-black font-extrabold text-xs rounded-xl shadow transition-all"
              >
                {isSubmitting ? 'Registering...' : `Register as New ${regRole}`}
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {authMode === 'forgot' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#3e3e3e]">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <KeyRound className="w-4 h-4 mr-1.5 text-[#ffa116]" /> Reset Account Password
                </h3>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Back to Sign In
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                Enter your registered username or email address and specify your new secure password.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Username or Email</label>
                <input
                  type="text"
                  value={resetTarget}
                  onChange={(e) => setResetTarget(e.target.value)}
                  placeholder="admin, provider, or user@medisphere.org"
                  className="w-full px-4 py-2.5 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white focus:outline-none focus:border-[#ffa116]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">New Security Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Passkey@2026"
                  className="w-full px-4 py-2.5 bg-[#3e3e3e]/50 border border-[#48484e] rounded-xl text-xs text-white focus:outline-none focus:border-[#ffa116]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl shadow transition-all"
              >
                {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Google OAuth 2.0 Interactive Account Chooser & Consent Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#242424] border border-[#3e3e3e] max-w-md w-full rounded-2xl p-6 text-zinc-300 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#383838] pb-3">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.54 0 2.94.55 4.04 1.46l3.03-3.03C17.24 1.74 14.8 1 12 1 7.42 1 3.51 3.58 1.57 7.34l3.71 2.88C6.18 7.35 8.85 5 12 5z"/>
                  <path fill="#4285F4" d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.92 3.41-8.69z"/>
                  <path fill="#FBBC05" d="M5.28 14.78c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.57 7.34C.57 9.38 0 11.63 0 14s.57 4.62 1.57 6.66l3.71-2.88z"/>
                  <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.15 0-5.82-2.35-6.72-5.22L1.57 20.66C3.51 24.42 7.42 27 12 27z"/>
                </svg>
                <span className="text-sm font-semibold text-white">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGoogleModal(false);
                  setGoogleStep('CHOOSER');
                  setSelectedGoogleAccount(null);
                }}
                className="text-zinc-400 hover:text-white text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: ACCOUNT CHOOSER */}
            {googleStep === 'CHOOSER' && (
              <div className="space-y-3.5">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Choose an account</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    to continue to <strong className="text-zinc-200">MediSphere Healthcare</strong>
                  </p>
                </div>

                <div className="space-y-1.5 divide-y divide-[#333]">
                  {GOOGLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setSelectedGoogleAccount(acc);
                        setGoogleStep('CONSENT');
                      }}
                      className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-[#2d2d2d] transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${acc.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                          {acc.initials}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[11px] text-zinc-400">{acc.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#363636] text-zinc-300 border border-[#444]">
                        {acc.role}
                      </span>
                    </button>
                  ))}

                  {/* Option: Use another account */}
                  <div className="pt-2">
                    {!showCustomGoogleInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleInput(true)}
                        className="w-full text-left py-2 px-3 rounded-xl hover:bg-[#2d2d2d] transition-colors flex items-center space-x-3 text-xs text-zinc-300 hover:text-white"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#363636] border border-[#48484e] flex items-center justify-center text-zinc-400">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Use another account</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-[#1d1d1d] rounded-xl border border-[#3a3a3a] space-y-2.5">
                        <p className="text-xs font-semibold text-white">Enter Google Account details:</p>
                        <input
                          type="email"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          placeholder="name@gmail.com or name@medisphere.org"
                          className="w-full px-3 py-2 bg-[#2d2d2d] border border-[#444] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          value={customGoogleName}
                          onChange={(e) => setCustomGoogleName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full px-3 py-2 bg-[#2d2d2d] border border-[#444] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <label className="text-zinc-400 font-medium">Select Portal Role:</label>
                          <select
                            value={customGoogleRole}
                            onChange={(e) => setCustomGoogleRole(e.target.value)}
                            className="bg-[#2d2d2d] border border-[#444] rounded-lg px-2 py-1 text-xs text-white"
                          >
                            <option value="Doctor">Doctor / Provider</option>
                            <option value="Patient">Patient</option>
                            <option value="Admin">Administrator</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          disabled={!customGoogleEmail.trim()}
                          onClick={() => {
                            if (!customGoogleEmail.trim()) return;
                            setSelectedGoogleAccount({
                              name: customGoogleName || customGoogleEmail.split('@')[0],
                              email: customGoogleEmail.trim(),
                              role: customGoogleRole,
                              avatarBg: 'bg-indigo-600',
                              initials: (customGoogleName || customGoogleEmail).slice(0, 2).toUpperCase()
                            });
                            setGoogleStep('CONSENT');
                          }}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: OAUTH CONSENT */}
            {googleStep === 'CONSENT' && selectedGoogleAccount && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-[#1d1d1d] rounded-xl border border-[#383838]">
                  <div className={`w-9 h-9 rounded-full ${selectedGoogleAccount.avatarBg || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {selectedGoogleAccount.initials || 'G'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{selectedGoogleAccount.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{selectedGoogleAccount.email}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">MediSphere wants to access your Google Account</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    This will allow MediSphere Clinical Operations to:
                  </p>
                  <ul className="mt-2.5 space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Verify your primary email address and identity token</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Authenticate securely into your {selectedGoogleAccount.role} Portal workspace</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Protect clinical telemetry data under HIPAA / OAuth 2.0 standards</span>
                    </li>
                  </ul>
                </div>

                <div className="text-[11px] text-zinc-500 bg-[#1e1e1e] p-2.5 rounded-lg border border-[#333]">
                  Make sure you trust MediSphere Healthcare. You can review or revoke access at any time in your Google Account Settings.
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleStep('CHOOSER');
                      setSelectedGoogleAccount(null);
                    }}
                    className="flex-1 py-2.5 bg-[#333] hover:bg-[#3d3d3d] text-zinc-300 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setGoogleStep('VERIFYING');
                      try {
                        const result = await loginWithGoogleOAuth({
                          email: selectedGoogleAccount.email,
                          name: selectedGoogleAccount.name,
                          role: selectedGoogleAccount.role
                        });
                        setTimeout(() => {
                          if (result.success) {
                            setShowGoogleModal(false);
                            setSuccessMessage(`Google OAuth 2.0 verified! Opening ${result.user.role} Portal...`);
                            onLogin(result.user);
                          } else {
                            setGoogleStep('CHOOSER');
                            setErrorMessage(result.error || 'Google authentication failed.');
                            setShowGoogleModal(false);
                          }
                        }, 700);
                      } catch {
                        setGoogleStep('CHOOSER');
                        setErrorMessage('Google OAuth connection error.');
                        setShowGoogleModal(false);
                      }
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Allow & Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VERIFYING */}
            {googleStep === 'VERIFYING' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <h4 className="text-sm font-bold text-white">Completing Google OAuth 2.0 Handshake</h4>
                <p className="text-xs text-zinc-400">Exchanging secure identity tokens with MediSphere Keycloak Gateway...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms & Privacy Policy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#282828] border border-[#3e3e3e] max-w-lg w-full rounded-2xl p-6 text-zinc-300 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3e3e3e] pb-3">
              <h3 className="text-base font-bold text-white flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-cyan-400" /> MediSphere Terms & Privacy Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2.5 max-h-72 overflow-y-auto pr-2 text-zinc-400 leading-relaxed">
              <p>
                <strong className="text-white">HIPAA & GDPR Compliance:</strong> All clinical data, patient telemetry, AI care plans, and FHIR resource transmissions are end-to-end encrypted using AES-256 and TLS 1.3 standards.
              </p>
              <p>
                <strong className="text-white">Role-Based Access Control (RBAC):</strong> Access to each clinical portal (Doctor, Patient, Administrator) is strictly segregated. Unauthorized attempts to access adjacent portal views are logged in real-time.
              </p>
              <p>
                <strong className="text-white">AI Explainability:</strong> Machine learning anomaly detectors and risk scoring systems serve as clinical decision support. Final diagnostic and prescription authority rests with the authenticated Doctor.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              I Understand & Acknowledge
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
