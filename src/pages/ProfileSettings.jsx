import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Lock, 
  Clock, 
  Compass, 
  Bell, 
  AlertTriangle, 
  LogOut, 
  Save, 
  Check, 
  Shield, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

// Import Sidebar component
import Sidebar from '../components/Sidebar';

// Loading Skeleton component for Settings fields
const SkeletonSettings = () => (
  <div className="space-y-6 animate-pulse">
    {/* Profile Card Skeleton */}
    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-slate-200"></div>
        <div className="space-y-2 flex-grow">
          <div className="h-5 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3.5 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="h-10 bg-slate-200 rounded-xl"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
    
    {/* Section Skeleton */}
    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
      <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-12 bg-slate-200 rounded-xl"></div>
        <div className="h-12 bg-slate-200 rounded-xl"></div>
      </div>
    </div>

    {/* Section Skeleton */}
    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
      <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div className="h-20 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

export default function ProfileSettings() {
  const navigate = useNavigate();

  // Mobile sidebar layout drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Profile data states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Addresses manager state
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", text: "Flat 402, Green Meadows, Shastri Marg, Anand", area: "Vallabh Vidyanagar", type: "Home" },
    { id: 2, label: "Work", text: "TiffinTrack HQ, Mota Bazar, Anand", area: "Anand", type: "Work" }
  ]);

  // Food preferences checkboxes
  const [foodPrefs, setFoodPrefs] = useState({
    veg: true,
    nonVeg: false,
    jain: false,
    lowOil: true,
    highProtein: false,
    noOnionGarlic: false
  });

  // Security accordion states
  const [isPasswordCollapsed, setIsPasswordCollapsed] = useState(true);
  const [isEmailCollapsed, setIsEmailCollapsed] = useState(true);
  const [isPhoneCollapsed, setIsPhoneCollapsed] = useState(true);

  // Change Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update Email fields
  const [newEmailVal, setNewEmailVal] = useState("");
  const [emailPasswordVal, setEmailPasswordVal] = useState("");

  // Update Phone fields
  const [newPhoneVal, setNewPhoneVal] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Subscription Preferences
  const [lunchTime, setLunchTime] = useState("12:00 PM - 1:30 PM");
  const [dinnerTime, setDinnerTime] = useState("8:00 PM - 9:30 PM");
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [ricePreference, setRicePreference] = useState("Brown Rice");

  // Notification switches
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false
  });

  // Modal open states
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  // New Address form states
  const [newAddrType, setNewAddrType] = useState("Home");
  const [newAddrText, setNewAddrText] = useState("");
  const [newAddrArea, setNewAddrArea] = useState("Anand");

  // Delete Account confirmation field
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteConfirmError, setDeleteConfirmError] = useState("");

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Loading, saving, sandbox states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sandbox modifiers
  const [sandboxForceSkeleton, setSandboxForceSkeleton] = useState(false);
  const [sandboxForceEmptyAddresses, setSandboxForceEmptyAddresses] = useState(false);
  const [sandboxLatency, setSandboxLatency] = useState(1200); // ms

  // Initial loading simulation and session restoration
  useEffect(() => {
    const userStr = localStorage.getItem('customer_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) setFullName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone);
      } catch (e) {
        console.error('Failed to parse customer_user:', e);
      }
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Sync route navigations from sidebar tabs click
  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      navigate('/my-subscriptions');
    } else if (tabId === 'track_orders') {
      navigate('/track-orders');
    } else if (tabId === 'history') {
      navigate('/order-history');
    } else if (tabId === 'settings') {
      // already here
    } else if (tabId === 'notifications') {
      navigate('/notifications');
    } else {
      navigate('/customer-dashboard');
    }
  };

  // Helper trigger to show custom toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Mark changes as unsaved when user touches controls
  const markUnsaved = () => {
    setHasUnsavedChanges(true);
  };

  // Save changes handler (with latency simulation)
  const handleSaveChanges = (e) => {
    if (e) e.preventDefault();
    if (!fullName.trim()) {
      showToast("error", "Name cannot be empty");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showToast("error", "Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      showToast("error", "Please enter a valid 10-digit phone number");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      showToast("success", "Profile preferences saved successfully!");
    }, sandboxLatency);
  };

  // Address Handlers
  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddrText.trim()) {
      showToast("error", "Please enter the address details");
      return;
    }
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    const newAddressObj = {
      id: newId,
      label: newAddrType,
      text: newAddrText,
      area: newAddrArea,
      type: newAddrType
    };
    
    setAddresses([...addresses, newAddressObj]);
    setIsAddAddressOpen(false);
    setNewAddrText("");
    showToast("success", `New ${newAddrType} address added!`);
    markUnsaved();
  };

  const handleDeleteAddress = (id) => {
    const deletedLabel = addresses.find(a => a.id === id)?.label || "Address";
    setAddresses(addresses.filter(a => a.id !== id));
    showToast("success", `${deletedLabel} address removed successfully.`);
    markUnsaved();
  };

  // Security Update Handlers
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("error", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters.");
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordCollapsed(true);
      showToast("success", "Password updated successfully!");
    }, sandboxLatency);
  };

  const handleUpdateEmailSubmit = (e) => {
    e.preventDefault();
    if (!newEmailVal || !newEmailVal.includes("@")) {
      showToast("error", "Please enter a valid new email address.");
      return;
    }
    if (!emailPasswordVal) {
      showToast("error", "Please enter your password to confirm email change.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEmail(newEmailVal);
      setNewEmailVal("");
      setEmailPasswordVal("");
      setIsEmailCollapsed(true);
      showToast("success", `Primary email updated to ${newEmailVal}!`);
    }, sandboxLatency);
  };

  const handleSendOTP = () => {
    if (!newPhoneVal || newPhoneVal.length < 10) {
      showToast("error", "Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    showToast("info", "Simulated OTP code sent to " + newPhoneVal + " (Code: 1234)");
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpCode === "1234") {
      setOtpVerified(true);
      setPhone(newPhoneVal);
      setTimeout(() => {
        setNewPhoneVal("");
        setOtpSent(false);
        setOtpCode("");
        setOtpVerified(false);
        setIsPhoneCollapsed(true);
        showToast("success", "Mobile number updated and verified successfully!");
      }, 1000);
    } else {
      showToast("error", "Incorrect OTP. Please enter '1234' for this demo.");
    }
  };

  // Danger Zone - Account Deletion
  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    if (deleteConfirmText === "DELETE") {
      setIsSaving(true);
      setDeleteConfirmError("");
      setTimeout(() => {
        setIsSaving(false);
        setIsDeleteAccountOpen(false);
        showToast("success", "Account scheduled for deletion. Logging you out...");
        setTimeout(() => navigate('/'), 2000);
      }, sandboxLatency);
    } else {
      setDeleteConfirmError("Please type 'DELETE' exactly to confirm.");
    }
  };

  // Sandbox profile data reset helper
  const [dummyState, setDummyState] = useState(false); // To handle standard braces
  const handleResetSandbox = () => {
    const userStr = localStorage.getItem('customer_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setFullName(u.name || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        showToast("info", "Reset profile state to active session details.");
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setFullName("");
    setEmail("");
    setPhone("");
    showToast("info", "Cleared profile sandbox details.");
    setAddresses([
      { id: 1, label: "Home", text: "Flat 402, Green Meadows, Shastri Marg, Anand", area: "Vallabh Vidyanagar", type: "Home" },
      { id: 2, label: "Work", text: "TiffinTrack HQ, Mota Bazar, Anand", area: "Anand", type: "Work" }
    ]);
    setFoodPrefs({
      veg: true,
      nonVeg: false,
      jain: false,
      lowOil: true,
      highProtein: false,
      noOnionGarlic: false
    });
    setLunchTime("12:00 PM - 1:30 PM");
    setDinnerTime("8:00 PM - 9:30 PM");
    setSpiceLevel("Medium");
    setRicePreference("Brown Rice");
    setNotifications({
      email: true,
      sms: true,
      push: false
    });
    setHasUnsavedChanges(false);
    showToast("success", "Sandbox reset! Form details restored to original defaults.");
  };

  const showSkeleton = isLoading || sandboxForceSkeleton;
  const showEmptyAddresses = sandboxForceEmptyAddresses || addresses.length === 0;

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="settings" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto relative pb-24">
        
        {/* Toast Alert Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3.5 rounded-2xl shadow-card transition-all duration-300 border animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : toast.type === "error" 
                ? "bg-red-50 border-red-100 text-red-800" 
                : "bg-blue-50 border-blue-100 text-blue-800"
          }`}>
            <CheckCircle2 size={16} className={toast.type === "success" ? "text-emerald-500" : toast.type === "error" ? "text-red-500" : "text-blue-500"} />
            <span className="text-xs font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Floating Unsaved changes banner */}
        {hasUnsavedChanges && !showSkeleton && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-lg border border-slate-800 flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-xs font-medium text-slate-300">You have unsaved changes.</span>
            <div className="flex space-x-2">
              <button 
                onClick={handleResetSandbox}
                className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-mint hover:bg-mint-hover disabled:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1"
              >
                {isSaving ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                <span>Save Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200/60 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary-text cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-400">Customer Portal</span>
              <span className="text-slate-300 font-light">/</span>
              <span className="text-sm font-bold text-primary-text">Profile Settings</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Save indicator in Header */}
            {!showSkeleton && (
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`hidden sm:flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                  hasUnsavedChanges 
                    ? "bg-mint text-white hover:bg-mint-hover" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
                )}
                <span>Save Changes</span>
              </button>
            )}

            <div className="w-8 h-8 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-sm">
              {fullName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Header Title Intro */}
          <div>
            <h1 className="text-2xl font-black text-primary-text tracking-tight flex items-center space-x-2">
              <span>Complete Your Profile Settings</span>
              <Sparkles size={20} className="text-lemon" />
            </h1>
            <p className="text-xs md:text-sm text-secondary-text mt-1">
              Review your plan details, delivery addresses, diet choices, and notifications before proceeding.
            </p>
          </div>

          {showSkeleton ? (
            <SkeletonSettings />
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary-text">Personal Information</h2>
                    <p className="text-[10px] text-secondary-text">Edit your profile name and contact coordinates</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); markUnsaved(); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:border-mint focus:outline-none transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); markUnsaved(); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:border-mint focus:outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); markUnsaved(); }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:border-mint focus:outline-none transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERY ADDRESSES */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-primary-text">Delivery Addresses</h2>
                      <p className="text-[10px] text-secondary-text">Manage addresses where your daily meals are dropped off</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsAddAddressOpen(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-mint/10 hover:bg-mint/20 text-mint text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Address</span>
                  </button>
                </div>

                {showEmptyAddresses ? (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <MapPin size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-primary-text">No Delivery Addresses Added</h3>
                      <p className="text-[10px] text-secondary-text max-w-xs mx-auto">
                        Please add at least one address to receive tiffin package drops.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsAddAddressOpen(true)}
                      className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        className="p-4 border border-slate-200/80 rounded-2xl hover:border-mint transition-all flex justify-between items-start group hover:bg-slate-50/50"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-md tracking-wide uppercase ${
                              addr.type === "Home" 
                                ? "bg-mint/10 text-mint" 
                                : addr.type === "Work" 
                                  ? "bg-blue-50 text-blue-600" 
                                  : "bg-slate-100 text-slate-600"
                            }`}>
                              {addr.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">({addr.area})</span>
                          </div>
                          <p className="text-xs text-primary-text font-semibold leading-relaxed">
                            {addr.text}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: FOOD PREFERENCES */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary-text">Food Preferences & Dietary Filters</h2>
                    <p className="text-[10px] text-secondary-text">Select dietary choices (vendors will prepare tiffins matching these criteria)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { key: "veg", label: "Pure Veg 🥦", desc: "No meat/eggs" },
                    { key: "nonVeg", label: "Non-Veg 🍗", desc: "Halal chicken/fish" },
                    { key: "jain", label: "Jain Food 📿", desc: "No root vegetables" },
                    { key: "lowOil", label: "Low Oil & Spices 🩺", desc: "Heart healthy daily" },
                    { key: "highProtein", label: "High Protein 💪", desc: "Sprouts, paneer focus" },
                    { key: "noOnionGarlic", label: "No Onion Garlic 🧅", desc: "Satvik preparation" }
                  ].map((pref) => {
                    const isSelected = foodPrefs[pref.key];
                    return (
                      <button
                        key={pref.key}
                        type="button"
                        onClick={() => {
                          setFoodPrefs({ ...foodPrefs, [pref.key]: !isSelected });
                          markUnsaved();
                        }}
                        className={`p-3.5 text-left border rounded-2xl transition-all cursor-pointer flex flex-col justify-between h-20 ${
                          isSelected 
                            ? "border-mint bg-mint-light/40 shadow-sm" 
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold text-primary-text flex items-center justify-between w-full">
                          <span>{pref.label}</span>
                          {isSelected && <CheckCircle2 size={13} className="text-mint ml-1" />}
                        </span>
                        <span className="text-[9px] text-secondary-text leading-tight mt-1">{pref.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 4: ACCOUNT SECURITY COLLAPSIBLES */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                    <Lock size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary-text">Account Security Settings</h2>
                    <p className="text-[10px] text-secondary-text">Update security details and log credentials</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Collapsible 1: Change Password */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsPasswordCollapsed(!isPasswordCollapsed)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-bold text-primary-text cursor-pointer transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <Lock size={14} className="text-slate-400" />
                        <span>Change Account Password</span>
                      </span>
                      {isPasswordCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                    
                    {!isPasswordCollapsed && (
                      <form onSubmit={handleChangePasswordSubmit} className="p-4 border-t border-slate-100 bg-white space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Current Password</label>
                            <input 
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">New Password</label>
                            <input 
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                              placeholder="Min 6 characters"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Confirm New Password</label>
                            <input 
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                              placeholder="Confirm password"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button 
                            type="submit"
                            className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Collapsible 2: Update Email Address */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsEmailCollapsed(!isEmailCollapsed)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-bold text-primary-text cursor-pointer transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <Mail size={14} className="text-slate-400" />
                        <span>Update Primary Email Address</span>
                      </span>
                      {isEmailCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                    
                    {!isEmailCollapsed && (
                      <form onSubmit={handleUpdateEmailSubmit} className="p-4 border-t border-slate-100 bg-white space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Current verified email: <span className="font-semibold text-primary-text">{email}</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">New Email Address</label>
                            <input 
                              type="email"
                              value={newEmailVal}
                              onChange={(e) => setNewEmailVal(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                              placeholder="newname@tiffin.com"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Confirm Account Password</label>
                            <input 
                              type="password"
                              value={emailPasswordVal}
                              onChange={(e) => setEmailPasswordVal(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                              placeholder="Enter current password"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button 
                            type="submit"
                            className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Save Primary Email
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Collapsible 3: Update Phone (OTP) */}
                  <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsPhoneCollapsed(!isPhoneCollapsed)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-bold text-primary-text cursor-pointer transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <Phone size={14} className="text-slate-400" />
                        <span>Update Contact Phone & Mobile Verification</span>
                      </span>
                      {isPhoneCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                    
                    {!isPhoneCollapsed && (
                      <div className="p-4 border-t border-slate-100 bg-white space-y-3.5 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Current verified phone: <span className="font-semibold text-primary-text">{phone}</span>
                        </p>
                        
                        {!otpSent ? (
                          <div className="space-y-3">
                            <div className="max-w-xs">
                              <label className="block text-[10px] font-bold text-slate-500 mb-1">New Mobile Number</label>
                              <input 
                                type="tel"
                                value={newPhoneVal}
                                onChange={(e) => setNewPhoneVal(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                                placeholder="9876500000"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={handleSendOTP}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Send Verification OTP
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleVerifyOTP} className="space-y-3">
                            <div className="p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl max-w-sm">
                              <p className="text-[10px] font-medium leading-relaxed">
                                Enter the simulated 4-digit code <span className="font-black">1234</span> sent to your new device.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">OTP Code</label>
                                <input 
                                  type="text"
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-center font-bold tracking-widest"
                                  placeholder="0000"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                type="button"
                                onClick={() => setOtpSent(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Back
                              </button>
                              <button 
                                type="submit"
                                className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1"
                              >
                                {otpVerified && <Check size={12} className="animate-pulse" />}
                                <span>{otpVerified ? "Verifying..." : "Verify OTP Code"}</span>
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: SUBSCRIPTION PREFERENCES */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary-text">Subscription Schedules & Customizations</h2>
                    <p className="text-[10px] text-secondary-text">Configure default drop timings and meal compositions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lunch Timings</label>
                    <select 
                      value={lunchTime}
                      onChange={(e) => { setLunchTime(e.target.value); markUnsaved(); }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:outline-none"
                    >
                      <option>11:30 AM - 1:00 PM</option>
                      <option>12:00 PM - 1:30 PM</option>
                      <option>1:00 PM - 2:30 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Dinner Timings</label>
                    <select 
                      value={dinnerTime}
                      onChange={(e) => { setDinnerTime(e.target.value); markUnsaved(); }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-primary-text focus:bg-white focus:outline-none"
                    >
                      <option>7:00 PM - 8:30 PM</option>
                      <option>8:00 PM - 9:30 PM</option>
                      <option>8:30 PM - 10:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Spice Level Preference</label>
                    <div className="flex space-x-2 pt-1">
                      {["Mild", "Medium", "Spicy"].map((spice) => (
                        <button
                          key={spice}
                          type="button"
                          onClick={() => { setSpiceLevel(spice); markUnsaved(); }}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            spiceLevel === spice 
                              ? "border-mint bg-mint-light text-mint shadow-sm" 
                              : "border-slate-200 bg-white text-secondary-text hover:border-slate-300"
                          }`}
                        >
                          {spice}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rice Component Preference</label>
                    <div className="flex space-x-2 pt-1">
                      {["White Rice", "Brown Rice", "No Rice (Extra Roti)"].map((rice) => (
                        <button
                          key={rice}
                          type="button"
                          onClick={() => { setRicePreference(rice); markUnsaved(); }}
                          className={`flex-1 py-2 px-1 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                            ricePreference === rice 
                              ? "border-mint bg-mint-light text-mint shadow-sm" 
                              : "border-slate-200 bg-white text-secondary-text hover:border-slate-300"
                          }`}
                        >
                          {rice}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: NOTIFICATION PREFERENCES */}
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-mint-light text-mint flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-primary-text">Notification Channels</h2>
                    <p className="text-[10px] text-secondary-text">Control which channels TiffinTrack alerts you through</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive monthly audit reports, invoices, and delivery skipped alerts." },
                    { key: "sms", label: "SMS Alerts", desc: "Receive critical messages (rider out for delivery, OTP verifications, and route skips)." },
                    { key: "push", label: "Mobile Push Notifications", desc: "Receive immediate real-time maps updates and rider ETA updates." }
                  ].map((chan) => (
                    <div key={chan.key} className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                      <div className="max-w-md pr-4">
                        <label className="block text-xs font-bold text-primary-text mb-0.5">{chan.label}</label>
                        <p className="text-[10px] text-secondary-text leading-relaxed">{chan.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifications({ ...notifications, [chan.key]: !notifications[chan.key] });
                          markUnsaved();
                        }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifications[chan.key] ? "bg-mint" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications[chan.key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 7: DANGER ZONE */}
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl shadow-card space-y-4">
                <div className="flex items-center space-x-2.5 pb-2 border-b border-red-100/60">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-red-800">Danger & Security Zone</h2>
                    <p className="text-[10px] text-red-600/80">Destructive actions for profile administration</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-primary-text">Log Out of TiffinTrack</h3>
                    <p className="text-[10px] text-secondary-text max-w-sm">
                      Clears current customer login credentials and redirects back to the portal role selection index.
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-4.5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <LogOut size={13} />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="h-px bg-red-100/60 my-2"></div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-red-800">Delete Customer Account</h3>
                    <p className="text-[10px] text-red-700/80 max-w-sm font-medium">
                      Permanently terminates your subscription logs, wallet balance, and home-cooked vendor plans. This cannot be undone.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setDeleteConfirmText("");
                      setDeleteConfirmError("");
                      setIsDeleteAccountOpen(true);
                    }}
                    className="px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* DEVELOPER SANDBOX PANEL */}
        <div className="m-6 p-5 bg-white border border-slate-200/50 rounded-3xl shadow-card space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Shield size={16} className="text-lemon" />
            <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Developer Sandbox Panel</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <input 
                id="force-skel" 
                type="checkbox"
                checked={sandboxForceSkeleton}
                onChange={(e) => setSandboxForceSkeleton(e.target.checked)}
                className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
              />
              <label htmlFor="force-skel" className="cursor-pointer text-[11px]">Force Skeleton Loader</label>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <input 
                id="force-empty" 
                type="checkbox"
                checked={sandboxForceEmptyAddresses}
                onChange={(e) => setSandboxForceEmptyAddresses(e.target.checked)}
                className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
              />
              <label htmlFor="force-empty" className="cursor-pointer text-[11px]">Force Empty Addresses</label>
            </div>

            <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <label className="block text-[10px] text-slate-500 uppercase font-black">Mock Save Delay</label>
              <select
                value={sandboxLatency}
                onChange={(e) => setSandboxLatency(Number(e.target.value))}
                className="w-full text-xs font-bold bg-white border border-slate-200 rounded p-1"
              >
                <option value={500}>0.5s Latency</option>
                <option value={1500}>1.5s Latency (Default)</option>
                <option value={3000}>3.0s Latency</option>
              </select>
            </div>

            <div className="flex items-center justify-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <button 
                type="button" 
                onClick={handleResetSandbox}
                className="w-full py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer flex items-center justify-center space-x-1"
              >
                <RefreshCw size={12} />
                <span className="text-[11px]">Reset Forms</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL 1: ADD ADDRESS */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddAddressOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-sm font-bold text-primary-text mb-1.5 flex items-center space-x-2">
              <MapPin size={16} className="text-mint" />
              <span>Add New Delivery Route</span>
            </h3>
            <p className="text-[10px] text-secondary-text mb-4 leading-normal">
              Enter your tiffin packet destination details. Make sure your residential area matches local vendor routes.
            </p>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address Label/Type</label>
                <div className="flex space-x-2">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddrType(type)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        newAddrType === type 
                          ? "border-mint bg-mint-light text-mint shadow-sm" 
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Local Area / Landmark</label>
                <select 
                  value={newAddrArea}
                  onChange={(e) => setNewAddrArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                >
                  <option>Vallabh Vidyanagar</option>
                  <option>Mota Bazar</option>
                  <option>Amul Dairy Road</option>
                  <option>Anand</option>
                  <option>Vastrapur</option>
                  <option>Alkapuri</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address Details</label>
                <textarea
                  value={newAddrText}
                  onChange={(e) => setNewAddrText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                  placeholder="Flat No, Wing, Apartment Name, Street Name..."
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE ACCOUNT DOUBLE-CONFIRMATION */}
      {isDeleteAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsDeleteAccountOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-sm font-bold text-red-800 mb-1.5">Are you absolutely sure?</h3>
            <p className="text-[10px] text-slate-500 mb-4 leading-normal">
              This will permanently delete your customer account, subscription services, payment history, and credits. You will lose access to TiffinTrack services instantly.
            </p>

            <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 leading-normal">
                  To confirm, type <span className="font-extrabold text-red-600">DELETE</span> below:
                </label>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => {
                    setDeleteConfirmText(e.target.value);
                    if (deleteConfirmError) setDeleteConfirmError("");
                  }}
                  className="w-full px-3 py-2.5 border border-slate-200 focus:border-red-500 rounded-xl text-xs text-center font-bold tracking-widest uppercase focus:outline-none"
                  placeholder="DELETE"
                  required
                />
                {deleteConfirmError && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1.5">{deleteConfirmError}</p>
                )}
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Delete Permanently
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
