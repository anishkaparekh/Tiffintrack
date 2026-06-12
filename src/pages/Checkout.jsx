import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Building,
  Plus,
  Tag,
  AlertCircle,
  Lock,
  ThumbsUp,
  Inbox,
  Utensils,
  Loader2
} from 'lucide-react';

// Unified mock chef database matching other page profiles
const chefProfiles = {
  1: { name: "Priya's Home Kitchen", rating: 4.8, location: "Anand, Gujarat", cuisine: "Gujarati Home-Cooked Meals", deliveryAreas: "Anand, Vidyanagar, Karamsad" },
  2: { name: "Healthy Meals Hub", rating: 4.5, location: "Vidyanagar, Gujarat", cuisine: "Dietitian-curated Veg Meals", deliveryAreas: "Vidyanagar, Bakrol, Anand" },
  3: { name: "Kathiyawadi Swad Kitchen", rating: 4.7, location: "Anand, Gujarat", cuisine: "Kathiyawadi regional thalis", deliveryAreas: "Anand, Karamsad, Mogar" },
  4: { name: "Mom's Punjabi Rasoi", rating: 4.9, location: "Ahmedabad, Gujarat", cuisine: "Punjabi North Indian Thalis", deliveryAreas: "Vastrapur, Satellite, Bodakdev" },
  5: { name: "Jain Satvik Rasoi", rating: 4.6, location: "Vadodara, Gujarat", cuisine: "Pure Satvik Jain Preparations", deliveryAreas: "Alkapuri, Akota, Gotri" },
  6: { name: "South India Express", rating: 4.4, location: "Vidyanagar, Gujarat", cuisine: "Traditional South Indian dinners", deliveryAreas: "Vidyanagar, Anand, Karamsad" },
  7: { name: "Student Budget Tiffins", rating: 4.3, location: "Vidyanagar, Gujarat", cuisine: "Basic Homestyle budget meals", deliveryAreas: "Vidyanagar hostles, Anand" }
};

// Reusable Skeletons
const VendorSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card animate-pulse flex justify-between gap-4">
    <div className="space-y-3 flex-grow">
      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-3.5 bg-slate-200 rounded w-2/3"></div>
    </div>
    <div className="w-16 h-16 bg-slate-200 rounded-2xl flex-shrink-0"></div>
  </div>
);

const PlanSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="h-5 bg-slate-200 rounded w-12"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-200 rounded w-full"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
    <div className="space-y-2">
      <div className="h-3.5 bg-slate-200 rounded w-full"></div>
      <div className="h-3.5 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 pt-2"></div>
    </div>
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();

  // Load selected subscription plan info
  const [selectedPlan] = useState(() => {
    const saved = localStorage.getItem('tiffintrack_checkout_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback default mock plan
    return {
      chefId: 1,
      chefName: "Priya's Home Kitchen",
      planName: "Lunch + Dinner Plan",
      price: 3499,
      duration: "month",
      mealsRemaining: 52
    };
  });

  const chefId = selectedPlan ? selectedPlan.chefId : 1;
  const [currentChef, setCurrentChef] = useState({
    name: "Loading Chef...",
    rating: 4.8,
    location: "Anand, Gujarat",
    cuisine: "Gujarati Home-Cooked Meals",
    deliveryAreas: "Anand, Vidyanagar, Karamsad"
  });

  useEffect(() => {
    const fetchChefProfile = async () => {
      if (typeof chefId === 'string' && chefId.length === 24) {
        try {
          const response = await fetch(`/api/v1/vendors/${chefId}`);
          if (response.ok) {
            const resData = await response.json();
            if (resData.success && resData.data) {
              const v = resData.data;
              setCurrentChef({
                name: v.businessName || v.name || "Vendor Kitchen",
                rating: 4.8,
                location: `${v.city || 'Anand'}, Gujarat`,
                cuisine: "Homestyle Cooked Meals",
                deliveryAreas: v.city || "Anand"
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch chef profile in Checkout:", e);
        }
      } else {
        const mockChef = chefProfiles[chefId] || chefProfiles[1];
        setCurrentChef(mockChef);
      }
    };
    fetchChefProfile();
  }, [chefId]);

  // Address List state
  const [addresses, setAddresses] = useState([
    { id: 1, type: "Home Address", name: "", mobile: "", details: "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar - 388120. Landmark: Near Shastri Statue" },
    { id: 2, type: "Work Address", name: "", mobile: "", details: "Room 102, GCET Engineering College, Mota Bazar, Anand - 388120. Landmark: Main Lab Block" }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);

  useEffect(() => {
    const userStr = localStorage.getItem('customer_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          name: u.name || addr.name,
          mobile: u.phone || addr.mobile
        })));
      } catch (e) {
        console.error("Failed to parse customer_user from localStorage in Checkout:", e);
      }
    }
  }, []);

  // Modal Form states for New Address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newType, setNewType] = useState("Home Address");
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newFlat, setNewFlat] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newCity, setNewCity] = useState("Anand");
  const [newPincode, setNewPincode] = useState("");
  const [newLandmark, setNewLandmark] = useState("");

  // Delivery Timings Preference
  const [lunchTime, setLunchTime] = useState("12:30 PM");
  const [dinnerTime, setDinnerTime] = useState("8:00 PM");

  // Meal Preferences (multi-select)
  const [mealPrefs, setMealPrefs] = useState(["Veg", "Low Oil"]);

  // Subscription Start Date Selection
  const [startDateType, setStartDateType] = useState("tomorrow"); // 'tomorrow' | 'next-monday' | 'custom'
  const [customStartDate, setCustomStartDate] = useState("");

  // Coupon Engine states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: '', discount: 0 }
  const [couponError, setCouponError] = useState("");

  // Payment Option selection
  const [selectedPayment, setSelectedPayment] = useState("upi"); // 'upi' | 'card' | 'nb'

  // Compliance ticks
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [understandPolicies, setUnderstandPolicies] = useState(false);

  // Submission Loader Overlay
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sandbox simulation overrides
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyVendor, setEmptyVendor] = useState(false);
  const [emptyPlan, setEmptyPlan] = useState(false);
  const [emptyAddress, setEmptyAddress] = useState(false);

  const activeLoading = forceLoadingState;

  // Toggle meal preference selector
  const handleTogglePref = (pref) => {
    if (mealPrefs.includes(pref)) {
      setMealPrefs(prev => prev.filter(p => p !== pref));
    } else {
      setMealPrefs(prev => [...prev, pref]);
    }
  };

  // Add Address helper
  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newMobile || !newFlat || !newStreet || !newArea || !newPincode) return;

    const fullDetails = `${newFlat}, ${newStreet}, ${newArea}, ${newCity} - ${newPincode}. Landmark: ${newLandmark || 'None'}`;
    const newAddressObj = {
      id: Date.now(),
      type: newType,
      name: newName,
      mobile: newMobile,
      details: fullDetails
    };

    setAddresses(prev => [...prev, newAddressObj]);
    setSelectedAddressId(newAddressObj.id);
    setShowAddressModal(false);
    
    // Clear inputs
    setNewName("");
    setNewMobile("");
    setNewFlat("");
    setNewStreet("");
    setNewArea("");
    setNewPincode("");
    setNewLandmark("");
  };

  // Coupon Applier logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");

    if (!selectedPlan) return;

    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "WELCOME10") {
      const discount = Math.round(selectedPlan.price * 0.10);
      setAppliedCoupon({ code: "WELCOME10", discount });
      setCouponCode("");
    } else if (cleanCode === "FIRSTORDER" || cleanCode === "SAVE200") {
      setAppliedCoupon({ code: cleanCode, discount: 200 });
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME10, FIRSTORDER, or SAVE200.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Checkout submission
  const handleProceedPayment = async () => {
    if (!selectedPlan || emptyPlan) return;
    if (!agreeTerms || !understandPolicies) return;

    setIsSubmitting(true);

    const userStr = localStorage.getItem('customer_user');
    let customerId = "";
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        customerId = u._id || u.id || "";
      } catch (e) {
        console.error("Failed to parse customer_user", e);
      }
    }

    if (!customerId) {
      // Fallback customer ID if not logged in (e.g. for guest checkout demo)
      customerId = "6a2c2ae16199858551b2db1a"; 
    }

    const payload = {
      customerId,
      vendorId: selectedPlan.chefId,
      planId: selectedPlan.planId || selectedPlan.id,
      startDate: new Date(),
      deliveryAddress: emptyAddress || addresses.length === 0 ? "No Address Specified" : (addresses.find(a => a.id === selectedAddressId)?.details || addresses[0].details),
      preferences: mealPrefs
    };

    try {
      const response = await fetch('/api/v1/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      setIsSubmitting(false);

      if (response.ok && resData.success) {
        localStorage.setItem('tiffintrack_active_subscription', JSON.stringify(resData.data));
        localStorage.removeItem('tiffintrack_checkout_plan');
        navigate('/subscription-success');
      } else {
        alert(resData.message || 'Failed to process subscription checkout.');
      }
    } catch (err) {
      console.error("Checkout submission failed:", err);
      setIsSubmitting(false);
      alert('An error occurred during checkout processing.');
    }
  };

  // Price calculations
  const subtotal = selectedPlan && !emptyPlan ? selectedPlan.price : 0;
  const discountVal = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPayable = subtotal - discountVal;

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(selectedPlan ? `/vendor/${selectedPlan.chefId}/plans` : '/customer-dashboard')}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-primary-text">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Panel */}
            <div className="hidden lg:flex items-center space-x-3 border border-slate-200/50 bg-slate-50 px-3 py-1 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text text-[9px] uppercase tracking-wider">Checkout Sandbox:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyVendor} 
                  onChange={(e) => setEmptyVendor(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Vendor</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyPlan} 
                  onChange={(e) => setEmptyPlan(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Plan</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyAddress} 
                  onChange={(e) => setEmptyAddress(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Address</span>
              </label>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-100 px-3 py-1 rounded-lg">Secured Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-grow space-y-6">
        
        {/* Page Title */}
        <div className="py-2 border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-black text-primary-text tracking-tight">
            Complete Your Subscription
          </h1>
          <p className="text-xs text-secondary-text mt-0.5 font-medium">
            Review your plan details and delivery preferences before proceeding.
          </p>
        </div>

        {/* Double Column Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: VENDOR, PLAN, ADDRESS, PREFERENCES */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. SELECTED VENDOR SUMMARY */}
            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Partner Home Kitchen
              </h2>
              
              {activeLoading ? (
                <VendorSkeleton />
              ) : (
                emptyVendor ? (
                  <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-card text-center flex flex-col items-center justify-center">
                    <Inbox size={32} className="text-slate-350 mb-2" />
                    <p className="text-xs text-secondary-text font-bold">No Vendor Selected</p>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-mint/5 rounded-full pointer-events-none"></div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-primary-text">{currentChef.name}</h3>
                        <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center">
                          <Star size={10} fill="#F59E0B" className="mr-1" />
                          {currentChef.rating}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text leading-relaxed font-semibold">
                        Cuisine: {currentChef.cuisine}
                      </p>
                      <div className="text-[10px] text-slate-400 font-bold flex flex-wrap gap-x-3">
                        <span>📍 {currentChef.location}</span>
                        <span>🚚 Area: {currentChef.deliveryAreas}</span>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => navigate(`/vendor/${chefId}`)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition-colors cursor-pointer"
                    >
                      View Vendor
                    </button>
                  </div>
                )
              )}
            </div>

            {/* 2. SELECTED PLAN CARD */}
            <div className="space-y-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Selected Subscription Plan
              </h2>

              {activeLoading ? (
                <PlanSkeleton />
              ) : (
                emptyPlan || !selectedPlan ? (
                  <div className="bg-white border border-slate-200/50 rounded-3xl p-8 shadow-card text-center flex flex-col items-center justify-center">
                    <Inbox size={32} className="text-slate-350 mb-2" />
                    <p className="text-xs text-secondary-text font-bold">No Plan Selected</p>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-mint rounded-3xl p-6 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden bg-mint-light/10">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-mint/5 rounded-full pointer-events-none"></div>
                    
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-black text-primary-text">{selectedPlan.planName}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold italic mt-0.5">Cycle: 30 Days (Mon - Sat)</p>
                      </div>

                      <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-650 font-medium">
                        <li className="flex items-center"><CheckCircle2 size={13} className="text-mint mr-2" /> Fresh Daily Meals</li>
                        <li className="flex items-center"><CheckCircle2 size={13} className="text-mint mr-2" /> Flexible Pause Option</li>
                        <li className="flex items-center"><CheckCircle2 size={13} className="text-mint mr-2" /> Priority Delivery</li>
                        <li className="flex items-center"><CheckCircle2 size={13} className="text-mint mr-2" /> Weekly Menu Rotation</li>
                      </ul>
                    </div>

                    <div className="text-right flex-shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col items-baseline sm:items-end justify-between">
                      <span className="text-2xl font-black text-mint">₹{selectedPlan.price}</span>
                      <span className="text-[10px] text-secondary-text font-bold sm:block sm:mt-1">/Month start</span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 3. DELIVERY ADDRESS SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Delivery Address
                </h2>
                <button 
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-bold text-mint hover:text-mint-hover flex items-center space-x-1 cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add New Address</span>
                </button>
              </div>

              {emptyAddress || addresses.length === 0 ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-10 shadow-card text-center flex flex-col items-center justify-center">
                  <Inbox size={32} className="text-slate-300 mb-2" />
                  <p className="text-xs text-secondary-text">No delivery addresses added yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`bg-white border-2 rounded-2xl p-5 shadow-card cursor-pointer transition-all duration-150 flex flex-col justify-between h-[155px] ${
                          isSelected 
                            ? 'border-mint bg-mint-light/10 shadow-sm' 
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-primary-text uppercase tracking-wider">
                              {addr.type === "Home Address" ? "🏠 Home" : "🏢 Work"}
                            </span>
                            <input 
                              type="radio" 
                              name="selectedAddress" 
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="text-mint focus:ring-mint w-3.5 h-3.5"
                            />
                          </div>
                          <h4 className="text-xs font-bold text-slate-750">{addr.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal font-semibold line-clamp-3">
                            {addr.details}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-2 flex items-center">
                          📞 {addr.mobile}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. TIMING PREFERENCES & MEAL FILTERS */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-6">
              
              {/* Delivery Slots */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Delivery Timing Preferences
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-xs font-semibold">
                  {/* Lunch Slot */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider block">Lunch Timing slot</label>
                    <div className="flex gap-2">
                      {["12:00 PM", "12:30 PM", "1:00 PM"].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setLunchTime(time)}
                          className={`flex-1 py-2 border rounded-xl text-center cursor-pointer transition-all ${
                            lunchTime === time 
                              ? 'border-mint bg-mint-light/40 text-mint font-bold' 
                              : 'bg-snow border-slate-150 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Dinner Slot */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-secondary-text uppercase tracking-wider block">Dinner Timing slot</label>
                    <div className="flex gap-2">
                      {["7:00 PM", "8:00 PM", "9:00 PM"].map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setDinnerTime(time)}
                          className={`flex-1 py-2 border rounded-xl text-center cursor-pointer transition-all ${
                            dinnerTime === time 
                              ? 'border-mint bg-mint-light/40 text-mint font-bold' 
                              : 'bg-snow border-slate-150 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Preferences */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Meal Preferences (Multi-select)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Veg", "Non-Veg", "Jain", "Low Oil", "High Protein", "No Onion Garlic", "Diabetic Friendly"].map(pref => {
                    const isSelected = mealPrefs.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => handleTogglePref(pref)}
                        className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-mint border-mint text-white' 
                            : 'bg-snow border-slate-150 text-slate-650 hover:bg-slate-100'
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subscription Start Date */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Subscription Start Date
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
                  {[
                    { value: 'tomorrow', label: 'Start Tomorrow', sub: 'Immediate drop-off' },
                    { value: 'next-monday', label: 'Start Next Monday', sub: 'Perfect cycle start' },
                    { value: 'custom', label: 'Custom Date', sub: 'Choose specific day' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStartDateType(opt.value)}
                      className={`p-3 border-2 rounded-2xl text-left flex flex-col justify-between h-[80px] cursor-pointer transition-all ${
                        startDateType === opt.value 
                          ? 'border-mint bg-mint-light/40 ring-2 ring-mint-light' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <span className={`text-[10px] font-black block ${startDateType === opt.value ? 'text-mint' : 'text-primary-text'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-semibold leading-tight">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {startDateType === 'custom' && (
                  <div className="pt-2 animate-fade-in">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Pick Commencement Date</label>
                    <input 
                      type="date" 
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow cursor-pointer"
                    />
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: COUPON, PAYMENT, ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. COUPON SECTION */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-slate-50 pb-2">
                Apply Coupons & Offers
              </h3>
              
              {appliedCoupon ? (
                <div className="p-3 bg-mint-light border border-mint/20 text-mint rounded-xl flex items-center justify-between text-xs font-extrabold">
                  <div className="flex items-center space-x-1.5">
                    <Tag size={14} className="animate-pulse" />
                    <span>Coupon '{appliedCoupon.code}' Applied! (-₹{appliedCoupon.discount})</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-slate-400 hover:text-slate-600 font-bold ml-2 cursor-pointer text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon Code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint uppercase font-semibold bg-snow placeholder-slate-400"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[10px] text-red-500 font-semibold flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {couponError}
                </p>
              )}

              <div className="text-[9px] text-slate-450 leading-relaxed font-bold">
                Available Mock Promo codes: <br />
                - <span className="text-mint uppercase">WELCOME10</span> (10% Off) <br />
                - <span className="text-mint uppercase">FIRSTORDER</span> / <span className="text-mint uppercase">SAVE200</span> (Flat ₹200 Off)
              </div>
            </div>

            {/* 2. ORDER SUMMARY CARD */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
              <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-slate-50 pb-2">
                Order Billing Summary
              </h3>

              {activeLoading ? (
                <SummarySkeleton />
              ) : (
                <div className="space-y-4 text-xs font-semibold text-slate-650">
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <span>Subscription Price</span>
                      <span className="text-primary-text">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-mint font-extrabold">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discountVal.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Courier Delivery Fee</span>
                      <span className="text-mint font-extrabold">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hygienic Packaging Tax</span>
                      <span className="text-mint font-extrabold">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-150 pt-3 flex justify-between items-center text-primary-text font-black">
                    <span className="text-sm">Total Payable Amount</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-mint">₹{totalPayable.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-slate-400 block font-bold">GST inclusive</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. SIMULATED PAYMENT METHODS */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider border-b border-slate-50 pb-2">
                Secure Payment Modes
              </h3>

              <div className="space-y-2">
                {[
                  { value: 'upi', label: 'UPI Gateways', desc: 'Google Pay / PhonePe / Paytm' },
                  { value: 'card', label: 'Credit or Debit Card', desc: 'Simulated VISA / Mastercard / RuPay' },
                  { value: 'nb', label: 'Net Banking', desc: 'Secure redirect options' }
                ].map((pm) => (
                  <label 
                    key={pm.value}
                    className={`flex items-center justify-between p-3 border rounded-2xl cursor-pointer transition-all ${
                      selectedPayment === pm.value 
                        ? 'border-mint bg-mint-light/20 font-bold' 
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs">
                      <input 
                        type="radio" 
                        name="paymentMode" 
                        checked={selectedPayment === pm.value}
                        onChange={() => setSelectedPayment(pm.value)}
                        className="text-mint focus:ring-mint w-3.5 h-3.5"
                      />
                      <div>
                        <span className="font-extrabold text-slate-700">{pm.label}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">{pm.desc}</span>
                      </div>
                    </div>
                    <Lock size={12} className="text-slate-350" />
                  </label>
                ))}
              </div>
            </div>

            {/* 4. TERMS & CONDITIONS AND PROCEED BUTTON */}
            <div className="space-y-4">
              
              <div className="space-y-2 text-[10px] text-secondary-text font-bold leading-normal">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-300 text-mint focus:ring-mint mt-0.5"
                  />
                  <span>I agree to the TiffinTrack subscription terms, conditions, and user agreement guidelines.</span>
                </label>

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={understandPolicies} 
                    onChange={(e) => setUnderstandPolicies(e.target.checked)}
                    className="rounded border-slate-300 text-mint focus:ring-mint mt-0.5"
                  />
                  <span>I understand that subscriptions can be paused, resumed, or cancelled at any time before daily cutoff leaves.</span>
                </label>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                onClick={handleProceedPayment}
                disabled={isSubmitting || !agreeTerms || !understandPolicies || activeLoading || emptyPlan}
                className={`w-full py-3.5 text-xs font-black text-white rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all ${
                  (!agreeTerms || !understandPolicies || activeLoading || emptyPlan)
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-mint hover:bg-mint-hover cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Processing Securing Server...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Proceed to Payment (₹{totalPayable})</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[8px] font-black uppercase text-slate-400 pt-2 tracking-wider">
                <div className="p-2 border border-slate-150 rounded-xl bg-white flex flex-col items-center">
                  <Lock size={12} className="text-mint mb-1" />
                  <span>Secure Payments</span>
                </div>
                <div className="p-2 border border-slate-150 rounded-xl bg-white flex flex-col items-center">
                  <CheckCircle2 size={12} className="text-mint mb-1" />
                  <span>Verified Chefs</span>
                </div>
                <div className="p-2 border border-slate-150 rounded-xl bg-white flex flex-col items-center">
                  <ThumbsUp size={12} className="text-mint mb-1" />
                  <span>Support Desk</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Global Page Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TiffinTrack. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* ADD NEW ADDRESS SLIDE-IN MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-snow p-5 border-b border-slate-150/60 flex justify-between items-center">
              <h2 className="text-xs font-black text-primary-text uppercase tracking-widest flex items-center">
                <Building size={14} className="text-mint mr-2" />
                Add New Delivery Location
              </h2>
              <button 
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold focus:outline-none cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleAddAddressSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Address Tag</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250/60 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  >
                    <option value="Home Address">🏠 Home Address</option>
                    <option value="Work Address">🏢 Work Address</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Anishka Parekh"
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Mobile Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 9876543210"
                    value={newMobile} 
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">House/Flat Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Flat 402, Block A"
                    value={newFlat} 
                    onChange={(e) => setNewFlat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Street Name / Society</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Green Meadows Apartments"
                  value={newStreet} 
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Area / Locality</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Shastri Marg"
                    value={newArea} 
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Pincode</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="388120"
                    value={newPincode} 
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">City</label>
                  <input 
                    type="text" 
                    required 
                    value={newCity} 
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-secondary-text uppercase tracking-wider block">Landmark (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Near GCET gate"
                    value={newLandmark} 
                    onChange={(e) => setNewLandmark(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-mint font-semibold bg-snow"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="bg-snow -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3 mt-6 border-t border-slate-150/60">
                <button 
                  type="button" 
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Save Address
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
