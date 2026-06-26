import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bike, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  Truck
} from 'lucide-react';

export default function DeliverySignup() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'Motorcycle',
    vehicleNumber: '',
    vendorId: '',
    termsAccepted: false
  });

  // Approved vendors state
  const [vendors, setVendors] = useState([]);

  // Fetch approved vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendors`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success && Array.isArray(resData.data)) {
            setVendors(resData.data);
            if (resData.data.length > 0) {
              setFormData(prev => ({ ...prev, vendorId: resData.data[0]._id }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
      }
    };
    fetchVendors();
  }, []);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,14}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type selection is required';
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle registration number is required';
    }

    if (!formData.vendorId) {
      newErrors.vendorId = 'Please select a vendor you belong to';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Delivery Partner Agreement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/delivery/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vendorId: formData.vendorId
        }),
      });

      const resData = await response.json();
      setIsLoading(false);

      if (!response.ok || !resData.success) {
        setMessage({
          type: 'error',
          text: resData.message || 'Registration failed. Please try again.'
        });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Account created successfully! Redirecting to sign in...'
      });

      setTimeout(() => {
        navigate('/delivery-login');
      }, 1500);

    } catch (err) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        text: 'Connection error. Please ensure the backend is running.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col justify-between font-sans relative">
      
      {/* Centered Content Container */}
      <div className="max-w-md mx-auto w-full px-4 py-8 flex-grow flex flex-col justify-center relative z-10">
        
        {/* Navigation Link Back to Home */}
        <div className="mb-4">
          <Link
            to="/delivery-login"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors duration-200 group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Delivery Partner Signup Card */}
        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-card text-center">
          
          {/* Top Logo and Header */}
          <div className="inline-flex p-3 bg-mint-light rounded-2xl text-mint mb-5">
            <Bike size={32} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-xl font-extrabold text-primary-text tracking-tight mb-1">
            Register as Delivery Partner
          </h1>
          <p className="text-xs text-secondary-text mb-6">
            Join the TiffinTrack delivery network to start earning.
          </p>
          
          {/* Status Message Alerts */}
          {message && (
            <div className={`p-4 rounded-xl mb-5 flex items-start space-x-3 border text-left ${
              message.type === 'success' 
                ? 'bg-mint-light border-mint/20 text-mint' 
                : 'bg-red-50 border-red-200 text-red-650'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              )}
              <span className="text-xs font-medium">{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Full Name Field */}
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
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Rahul Kumar"
                  className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                  } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="rahul@example.com"
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

            {/* Phone Field */}
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
                  value={formData.phone}
                  onChange={handleInputChange}
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

            {/* Vehicle Type and Number Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Vehicle Type Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                  Vehicle Type
                </label>
                <div className="relative">
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-snow border border-slate-200 focus:border-mint focus:bg-white rounded-xl text-xs text-primary-text focus:outline-none transition-all font-semibold"
                  >
                    <option value="Bicycle">Bicycle</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Number Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                  Vehicle Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Truck size={14} />
                  </span>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    placeholder="GJ-23-AB-1234"
                    className={`w-full pl-9 pr-4 py-2.5 bg-snow border ${
                      errors.vehicleNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                    } rounded-xl text-xs text-primary-text placeholder-slate-400 focus:outline-none transition-colors duration-200`}
                  />
                </div>
                {errors.vehicleNumber && (
                  <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                    <AlertCircle size={12} />
                    <span>{errors.vehicleNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Vendor Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                Assign to Vendor
              </label>
              <div className="relative">
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 bg-snow border ${
                    errors.vendorId ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-mint'
                  } rounded-xl text-xs text-primary-text focus:outline-none transition-all font-semibold`}
                >
                  <option value="">-- Select Vendor --</option>
                  {vendors.map(vendor => (
                    <option key={vendor._id || vendor.id} value={vendor._id || vendor.id}>
                      {vendor.businessName || vendor.name} ({vendor.city})
                    </option>
                  ))}
                </select>
              </div>
              {errors.vendorId && (
                <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.vendorId}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
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
                  value={formData.password}
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

            {/* Confirm Password Field */}
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="h-3.5 w-3.5 text-mint border-slate-300 rounded focus:ring-mint mt-0.5 cursor-pointer"
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-xs font-semibold text-secondary-text cursor-pointer select-none">
                I agree to the TiffinTrack <a href="#" className="text-mint hover:underline">Delivery Partner Terms</a> & <a href="#" className="text-mint hover:underline">Code of Conduct</a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-[10px] text-red-500 font-semibold flex items-center space-x-1 mt-0.5">
                <AlertCircle size={12} />
                <span>{errors.termsAccepted}</span>
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover disabled:bg-mint/70 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register Partner</span>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <p className="mt-5 text-xs text-secondary-text">
            Already registered?{' '}
            <Link to="/delivery-login" className="font-bold text-mint hover:underline">
              Sign In Here
            </Link>
          </p>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center text-secondary-text text-xs relative z-10">
        <p>© {new Date().getFullYear()} TiffinTrack. Delivery Agent Network.</p>
      </footer>
    </div>
  );
}
