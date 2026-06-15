import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bike, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck, 
  Key,
  Clock
} from 'lucide-react';

const makeMockJwt = (payloadObj) => {
  try {
    const header = window.btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = window.btoa(JSON.stringify(payloadObj));
    const signature = "mocksignature";
    return `${header}.${payload}.${signature}`;
  } catch (e) {
    return 'mock.token.sig';
  }
};

export default function DeliveryLogin() {
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'rememberMe') setRememberMe(checked);
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Partner email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Seed mock delivery partner session
      const mockToken = makeMockJwt({
        id: "mock-del-1",
        name: "Rahul Kumar",
        email: email || "rahul.delivery@tiffintrack.com",
        role: "delivery",
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day expiry
      });

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify({
        id: "mock-del-1",
        name: "Rahul Kumar",
        email: email || "rahul.delivery@tiffintrack.com",
        role: "delivery"
      }));

      setMessage({
        type: 'success',
        text: 'Access granted! Opening Delivery Partner dashboard...'
      });

      setTimeout(() => {
        navigate('/delivery-dashboard');
      }, 800);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F9F6] flex flex-col justify-between font-sans relative">
      
      {/* Centered Content Container */}
      <div className="max-w-md mx-auto w-full px-4 py-8 flex-grow flex flex-col justify-center relative z-10">
        
        {/* Navigation Link Back to Home */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors duration-200 group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Role Selection</span>
          </Link>
        </div>

        {/* Delivery Partner Login Card */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-card text-center">
          
          {/* Top Logo and Header */}
          <div className="inline-flex p-3 bg-mint-light rounded-2xl text-mint mb-5">
            <Bike size={32} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-xl font-extrabold text-primary-text tracking-tight mb-1">
            TiffinTrack Delivery Partner
          </h1>
          <p className="text-xs text-secondary-text mb-6">
            Enter credentials to view your assigned delivery runs.
          </p>
          
          {/* Status Message Alerts */}
          {message && (
            <div className={`p-4 rounded-xl mb-5 flex items-start space-x-3 border text-left ${
              message.type === 'success' 
                ? 'bg-mint-light border-mint/20 text-mint' 
                : 'bg-red-50 border-red-250 text-red-600'
            }`}>
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-xs font-medium">{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                Partner Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="rahul.delivery@tiffintrack.com"
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

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                  Password
                </label>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setMessage({ type: 'success', text: 'Password reset request logged with kitchen manager.' });
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
                  value={password}
                  onChange={handleInputChange}
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

            {/* Remember Session Toggle */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={handleInputChange}
                className="h-3.5 w-3.5 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-[11px] font-semibold text-secondary-text cursor-pointer select-none">
                Remember partner session
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover disabled:bg-mint/70 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          {/* Guidelines Divider */}
          <div className="border-t border-slate-200/60 pt-5 mt-6 text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Delivery Partner Quick Reference
            </span>
            
            <div className="space-y-2.5">
              <div className="flex items-center space-x-3 p-2 bg-snow border border-slate-200/30 rounded-xl">
                <div className="p-1.5 bg-mint-light rounded-lg text-mint">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-primary-text">Safety First</h4>
                  <p className="text-[9px] text-secondary-text">Wear your helmet and follow speed regulations always.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2 bg-snow border border-slate-200/30 rounded-xl">
                <div className="p-1.5 bg-mint-light rounded-lg text-mint">
                  <Clock size={14} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-primary-text">Timely Runs</h4>
                  <p className="text-[9px] text-secondary-text">Delivering warm thalis ensures community satisfaction.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-secondary-text text-xs relative z-10">
        <p>© {new Date().getFullYear()} TiffinTrack. Delivery Agent Workspace.</p>
      </footer>
    </div>
  );
}
