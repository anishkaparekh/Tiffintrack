import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  Utensils, 
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone
} from 'lucide-react';
import mealImg from '../assets/healthy_tiffin_meals.png';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }
  const [passwordStrength, setPasswordStrength] = useState(''); // 'Weak', 'Medium', 'Strong'
  const [strengthColor, setStrengthColor] = useState('bg-slate-200');

  // Password strength checker logic
  useEffect(() => {
    const pass = signUpData.password;
    if (!pass) {
      setPasswordStrength('');
      setStrengthColor('bg-slate-200');
      return;
    }

    if (pass.length < 6) {
      setPasswordStrength('Weak');
      setStrengthColor('bg-red-500 w-1/3');
    } else if (pass.length >= 6 && pass.length < 10) {
      const hasLetters = /[a-zA-Z]/.test(pass);
      const hasNumbersOrSymbols = /[\d\W]/.test(pass);
      if (hasLetters && hasNumbersOrSymbols) {
        setPasswordStrength('Medium');
        setStrengthColor('bg-amber-400 w-2/3');
      } else {
        setPasswordStrength('Weak');
        setStrengthColor('bg-red-500 w-1/3');
      }
    } else {
      const hasUppercase = /[A-Z]/.test(pass);
      const hasNumbers = /\d/.test(pass);
      const hasSymbols = /[\W_]/.test(pass);
      if (hasUppercase && hasNumbers && hasSymbols) {
        setPasswordStrength('Strong');
        setStrengthColor('bg-mint w-full');
      } else {
        setPasswordStrength('Medium');
        setStrengthColor('bg-amber-400 w-2/3');
      }
    }
  }, [signUpData.password]);

  // Form input handlers
  const handleSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignInData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Sign In Validation
  const validateSignIn = () => {
    const newErrors = {};
    if (!signInData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signInData.password) {
      newErrors.password = 'Password is required';
    } else if (signInData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sign Up Validation
  const validateSignUp = () => {
    const newErrors = {};
    if (!signUpData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!signUpData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!signUpData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,14}$/.test(signUpData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!signUpData.password) {
      newErrors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signUpData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms and Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Sign In Form
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: 'success',
        text: 'Login successful! Redirecting to dashboard...'
      });
      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 1000);
    }, 1500);
  };

  // Submit Sign Up Form
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        type: 'success',
        text: 'Account created successfully! You can now Sign In.'
      });
      setTimeout(() => {
        setActiveTab('signin');
        setMessage(null);
        setSignUpData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false
        });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-snow flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 py-6 flex-grow flex flex-col justify-center">
        
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors duration-200 group"
          >
            <ArrowLeft size={16} />
            <span>Back to Role Selection</span>
          </Link>
        </div>

        {/* Split screen content wrapper */}
        <div className="bg-white rounded-3xl border border-slate-200/50 shadow-card overflow-hidden grid lg:grid-cols-12 min-h-[560px]">
          
          {/* Left Column: Food Welcome Section */}
          <div className="hidden lg:flex lg:col-span-5 bg-mint-light/40 p-10 flex-col justify-between border-r border-slate-200/50">
            <div>
              {/* App logo */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
                  <Utensils className="text-white" size={16} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold text-primary-text">
                  Tiffin<span className="text-mint">Track</span>
                </span>
              </div>
              
              <h2 className="text-2xl font-extrabold text-primary-text leading-tight mb-3">
                Welcome Back to TiffinTrack
              </h2>
              
              <p className="text-xs text-secondary-text leading-relaxed mb-6">
                Join thousands of customers enjoying fresh, home-cooked meals through flexible tiffin subscriptions.
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-text">
                  <CheckCircle2 size={15} className="text-mint" />
                  <span>Fresh Meals</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-text">
                  <CheckCircle2 size={15} className="text-mint" />
                  <span>Daily Delivery</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-text">
                  <CheckCircle2 size={15} className="text-mint" />
                  <span>Flexible Plans</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary-text">
                  <CheckCircle2 size={15} className="text-mint" />
                  <span>Healthy Choices</span>
                </div>
              </div>
            </div>

            {/* Generated Food Image */}
            <div className="my-1 relative flex justify-center">
              <div className="relative w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 bg-white p-2">
                <img 
                  src={mealImg} 
                  alt="Healthy home-cooked meal prep box with green salad" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* App Food Quote */}
            <blockquote className="border-l-4 border-mint pl-4 mt-4">
              <p className="text-xs italic text-secondary-text leading-relaxed">
                "Good food is not just fuel — it's comfort, care, and a little piece of home delivered every day."
              </p>
            </blockquote>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="col-span-12 lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              
              {/* Authentication Tabs */}
              <div className="flex bg-snow p-1 rounded-2xl mb-6 border border-slate-200/40">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrors({});
                    setMessage(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === 'signin' 
                      ? 'bg-white text-mint shadow-sm border border-slate-200/30' 
                      : 'text-secondary-text hover:text-primary-text'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrors({});
                    setMessage(null);
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                    activeTab === 'signup' 
                      ? 'bg-white text-mint shadow-sm border border-slate-200/30' 
                      : 'text-secondary-text hover:text-primary-text'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Status Message Banners */}
              {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 border ${
                  message.type === 'success' 
                    ? 'bg-mint-light border-mint/20 text-mint' 
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium">{message.text}</span>
                </div>
              )}

              {/* SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={signInData.email}
                        onChange={handleSignInChange}
                        placeholder="you@example.com"
                        className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                        } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Password
                      </label>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setMessage({ type: 'success', text: 'Password reset instructions sent to your email!' });
                        }}
                        className="text-[10px] font-bold text-mint hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock size={14} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={signInData.password}
                        onChange={handleSignInChange}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-9 py-2.5 bg-snow border ${
                          errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                        } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                        <AlertCircle size={12} />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={signInData.rememberMe}
                      onChange={handleSignInChange}
                      className="h-3.5 w-3.5 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-[11px] font-semibold text-secondary-text cursor-pointer select-none">
                      Remember me on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover disabled:bg-mint/60 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>
              )}

              {/* SIGN UP FORM */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User size={14} />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={signUpData.fullName}
                        onChange={handleSignUpChange}
                        placeholder="John Doe"
                        className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                          errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                        } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                        <AlertCircle size={12} />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail size={14} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={signUpData.email}
                        onChange={handleSignUpChange}
                        placeholder="you@example.com"
                        className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                        } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone size={14} />
                      </span>
                      <input
                        type="text"
                        name="phone"
                        value={signUpData.phone}
                        onChange={handleSignUpChange}
                        placeholder="9876543210"
                        className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                        } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                        <AlertCircle size={12} />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Lock size={14} />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={signUpData.password}
                          onChange={handleSignUpChange}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-9 py-2.5 bg-snow border ${
                            errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                          } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                          <AlertCircle size={12} />
                          <span>{errors.password}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Lock size={14} />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={signUpData.confirmPassword}
                          onChange={handleSignUpChange}
                          placeholder="••••••••"
                          className={`w-full pl-9 pr-9 py-2.5 bg-snow border ${
                            errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                          } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                          <AlertCircle size={12} />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {signUpData.password && (
                    <div className="space-y-1 pt-0.5">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-secondary-text">
                        <span>Password Strength</span>
                        <span className={`${
                          passwordStrength === 'Strong' ? 'text-mint' : 
                          passwordStrength === 'Medium' ? 'text-amber-500' : 'text-red-500'
                        }`}>{passwordStrength}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-200 ${strengthColor}`}></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <input
                      id="termsAccepted"
                      name="termsAccepted"
                      type="checkbox"
                      checked={signUpData.termsAccepted}
                      onChange={handleSignUpChange}
                      className="h-3.5 w-3.5 text-mint border-slate-300 rounded focus:ring-mint mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="termsAccepted" className="ml-2 block text-xs font-semibold text-secondary-text cursor-pointer select-none">
                      I agree to the TiffinTrack <a href="#" className="text-mint hover:underline">Terms of Service</a> & <a href="#" className="text-mint hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-0.5">
                      <AlertCircle size={12} />
                      <span>{errors.termsAccepted}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover disabled:bg-mint/60 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TiffinTrack. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
