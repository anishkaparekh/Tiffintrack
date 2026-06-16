import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Clock, 
  Utensils, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  MessageSquare, 
  Star, 
  Compass, 
  Phone,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

// Unified mock database for recommended vendors
const recommendedVendors = [
  {
    id: 2,
    name: "Healthy Meals Hub",
    rating: 4.5,
    distance: "2.5 km",
    startingPrice: 150,
    cuisine: "Dietitian-curated Veg Meals",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Kathiyawadi Swad Kitchen",
    rating: 4.7,
    distance: "0.8 km",
    startingPrice: 130,
    cuisine: "Kathiyawadi regional thalis",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

// Reusable Skeleton Components
const SummaryCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
    <div className="space-y-2.5">
      <div className="h-3.5 bg-slate-200 rounded w-full"></div>
      <div className="h-3.5 bg-slate-200 rounded w-5/6"></div>
      <div className="h-3.5 bg-slate-200 rounded w-2/3"></div>
    </div>
  </div>
);

const DeliveryCardSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-8 bg-slate-200 rounded"></div>
      <div className="h-8 bg-slate-200 rounded"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded w-full"></div>
  </div>
);

const RecommendationSkeleton = () => (
  <div className="bg-white border border-slate-200/50 rounded-2xl p-4 shadow-card animate-pulse flex gap-3">
    <div className="w-16 h-16 bg-slate-200 rounded-xl flex-shrink-0"></div>
    <div className="flex-grow space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      <div className="h-3 bg-slate-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Reusable Presentational Components

// 1. Success Banner / Hero Section
function SuccessBanner() {
  return (
    <div className="text-center space-y-3 max-w-xl mx-auto py-4">
      <div className="w-20 h-20 bg-mint-light text-mint rounded-full flex items-center justify-center mx-auto shadow-inner relative group transition-transform hover:scale-105 duration-350">
        <CheckCircle2 size={42} strokeWidth={2.5} />
        <div className="absolute -right-2 -top-2 bg-lemon text-lemon-hover p-1.5 rounded-full animate-bounce shadow-sm">
          <Sparkles size={16} fill="currentColor" />
        </div>
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-black text-primary-text tracking-tight flex items-center justify-center gap-2">
          <span>Subscription Activated Successfully!</span>
        </h1>
        <p className="text-xs md:text-sm text-secondary-text max-w-md mx-auto font-medium leading-relaxed">
          Your home-cooked meal subscription is now active and ready to begin.
        </p>
      </div>
    </div>
  );
}

// 2. Subscription Summary Card
function SubscriptionSummaryCard({ subscription, subId }) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 relative overflow-hidden group hover:border-mint/20 transition-all">
      <div className="absolute right-0 top-0 w-24 h-24 bg-mint/5 rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Subscription Details
        </h3>
        <span className="text-[10px] font-bold text-mint bg-mint-light border border-mint/20 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"></span>
          {subscription.status || 'Active'}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Home Chef Vendor</span>
          <span className="font-extrabold text-primary-text text-sm block mt-0.5">{subscription.vendorName}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Plan Package</span>
            <span className="font-bold text-slate-700 block mt-0.5">{subscription.planName}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Subscription ID</span>
            <span className="font-bold text-slate-700 block mt-0.5 font-mono">{subId}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Start Commencement</span>
            <span className="font-bold text-slate-700 block mt-0.5">{subscription.commencedDate || "Tomorrow"}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Meals Remaining</span>
            <span className="font-bold text-mint block mt-0.5">{subscription.mealsRemaining} Meals</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Delivery Details Card
function DeliveryDetailsCard({ subscription }) {
  // Parsing times from default or active sub
  const isLunchOnly = subscription.planName.includes("Lunch Only");
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Delivery Preferences
        </h3>
        <MapPin size={14} className="text-mint" />
      </div>

      <div className="space-y-4 text-xs">
        {/* Timing preferences slots */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-2">
            <Clock size={16} className="text-mint" />
            <div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Lunch Slot</span>
              <span className="font-bold text-slate-700 mt-0.5 block">{isLunchOnly ? "12:30 PM" : "12:30 PM"}</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-2">
            <Clock size={16} className="text-mint" />
            <div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Dinner Slot</span>
              <span className="font-bold text-slate-700 mt-0.5 block">{isLunchOnly ? "N/A" : "8:00 PM"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Drop-off Address</span>
          <span className="font-medium text-slate-650 leading-relaxed block mt-1">
            {subscription.address || "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar - 388120"}
          </span>
        </div>
      </div>
    </div>
  );
}

// 4. Payment Summary Card
function PaymentSummaryCard({ subscription }) {
  const price = subscription.planId?.price || subscription.price || 3149;
  const isDiscounted = price < 3499;
  const discountVal = isDiscounted ? (3499 - price) : 0;
  const subtotal = isDiscounted ? 3499 : price;

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Payment Invoice
        </h3>
        <Lock size={13} className="text-mint" />
      </div>

      <div className="space-y-2 text-xs font-semibold text-slate-650">
        <div className="flex justify-between">
          <span>Plan Subtotal</span>
          <span className="text-primary-text">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        
        {isDiscounted && (
          <div className="flex justify-between text-mint font-extrabold">
            <span>Applied Coupon Discount</span>
            <span>-₹{discountVal.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Hygienic Packaging & Delivery</span>
          <span className="text-mint font-extrabold">FREE</span>
        </div>

        <div className="border-t border-slate-150 pt-2.5 flex justify-between items-center text-primary-text font-black">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-extrabold">Total Paid</span>
          <div className="text-right">
            <span className="text-base font-black text-mint">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-slate-400 block font-bold">via UPI Mode</span>
          </div>
        </div>
      </div>

      <div className="bg-mint-light/40 border border-mint/10 p-2.5 rounded-xl flex items-center justify-between text-[10px] text-mint font-bold">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          <span>Payment Successful</span>
        </div>
        <span>Txn ID: UPI-49272</span>
      </div>
    </div>
  );
}

// 5. Timeline Component
function TimelineComponent() {
  const steps = [
    { title: "Subscription Activated", desc: "Your daily home-chef tiffin schedule has been initialized on TiffinTrack server.", status: "complete" },
    { title: "Vendor Notified", desc: "Chef Priya's Kitchen team has accepted the order and mapped your meal preferences.", status: "complete" },
    { title: "Meal Schedule Prepared", desc: "Fresh ingredient list lock-in scheduled for tomorrow morning.", status: "complete" },
    { title: "First Delivery Scheduled", desc: "Dispatches tomorrow at 12:00 PM for lunch drop-off.", status: "complete" }
  ];

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
        What Happens Next?
      </h3>
      
      <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-150">
        {steps.map((step, idx) => (
          <div key={idx} className="relative text-xs">
            <span className="absolute -left-5.5 top-0.5 w-3.5 h-3.5 rounded-full bg-mint flex items-center justify-center ring-4 ring-mint-light text-white font-bold text-[8px]">
              ✓
            </span>
            <h4 className="font-extrabold text-primary-text">
              {step.title}
            </h4>
            <p className="text-[10px] text-secondary-text mt-0.5 leading-relaxed font-semibold">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Upcoming Delivery Preview Card
function UpcomingPreviewCard({ subscription }) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-3.5 relative overflow-hidden group hover:border-mint/20 transition-all">
      <div className="absolute right-0 top-0 bg-lemon text-primary-text text-[9px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-wider">
        Next Delivery
      </div>
      
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
        Upcoming Delivery Preview
      </h3>

      <div className="flex items-center gap-3.5 pt-1">
        <div className="w-10 h-10 rounded-xl bg-lemon-light border border-lemon/20 flex items-center justify-center text-lemon-hover">
          <Utensils size={20} />
        </div>
        <div className="text-xs">
          <span className="font-black text-slate-700 block">Tomorrow (Lunch Box)</span>
          <span className="text-[10px] text-secondary-text font-bold flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5">⏰ 12:30 PM</span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-0.5">👨‍🍳 {subscription.vendorName}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// 7. Help & Support Section
function SupportSection() {
  const [showSupportModal, setShowSupportModal] = useState(false);
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
        Help & Support
      </h3>
      
      <p className="text-[10px] text-secondary-text font-semibold leading-relaxed">
        Need assistance with delivery slots, menu customization, or payments? We are available 24/7.
      </p>

      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
        <button 
          onClick={() => setShowSupportModal(true)}
          className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <Phone size={11} />
          <span>Contact Support</span>
        </button>
        <button 
          onClick={() => setShowSupportModal(true)}
          className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <MessageSquare size={11} />
          <span>FAQ & Chat Help</span>
        </button>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 relative">
            <div className="w-12 h-12 rounded-full bg-mint-light text-mint flex items-center justify-center mx-auto">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-primary-text">Help Desk Support</h4>
              <p className="text-xs text-secondary-text mt-1 leading-normal font-semibold">
                This is a placeholder support widget. In production, this would trigger an interactive Zendesk chat window or connect to our phone agent dialer at <span className="text-mint font-extrabold">+91 1800-TT-HELP</span>.
              </p>
            </div>
            <button 
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 8. Action Buttons
function ActionButtons({ onNavigate }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <button 
        onClick={() => onNavigate('/my-subscriptions')}
        className="flex-grow py-3 px-5 bg-mint hover:bg-mint-hover text-white text-xs font-black rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Go To My Subscriptions</span>
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={() => onNavigate('/track-orders')}
          className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer text-center"
        >
          Track Orders
        </button>
        <button 
          onClick={() => onNavigate('/browse-vendors')}
          className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer text-center"
        >
          Browse Vendors
        </button>
        <button 
          onClick={() => onNavigate('/customer-dashboard')}
          className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer text-center"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

// 9. Recommended Vendors Section
function RecommendedVendorsSection({ onNavigate }) {
  return (
    <div className="border-t border-slate-150 pt-8 space-y-4">
      <div className="space-y-0.5">
        <h3 className="text-sm font-black text-primary-text">
          Customers who subscribed to this vendor also explored...
        </h3>
        <p className="text-[10px] text-secondary-text font-semibold">
          Handpicked kitchen selections in Anand, Gujarat delivering home-style recipes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {recommendedVendors.map((vendor) => (
          <div 
            key={vendor.id}
            className="bg-white border border-slate-200/50 rounded-2xl p-4 shadow-card flex gap-4 hover:shadow-md hover:border-slate-200 transition-all"
          >
            <img 
              src={vendor.image} 
              alt={vendor.name} 
              className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
            />
            
            <div className="flex-grow flex flex-col justify-between space-y-1">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-primary-text">{vendor.name}</h4>
                  <span className="text-[10px] font-bold text-amber-500 flex items-center bg-amber-50 px-1.5 py-0.5 rounded">
                    <Star size={9} fill="currentColor" className="mr-0.5" />
                    {vendor.rating}
                  </span>
                </div>
                <p className="text-[10px] text-secondary-text font-medium leading-relaxed line-clamp-1">{vendor.cuisine}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-2 text-[10px]">
                <div className="font-bold text-slate-400 flex gap-2">
                  <span>🚗 {vendor.distance}</span>
                  <span>•</span>
                  <span>Starts ₹{vendor.startingPrice}/meal</span>
                </div>
                <button 
                  onClick={() => onNavigate(`/vendor/${vendor.id}`)}
                  className="text-[10px] font-black text-mint hover:text-mint-hover flex items-center cursor-pointer"
                >
                  <span>View Menu</span>
                  <ChevronRight size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 10. Recommended Vendors Loading Skeleton
const RecommendationsSkeletonList = () => (
  <div className="border-t border-slate-150 pt-8 space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
    <div className="grid sm:grid-cols-2 gap-4">
      <RecommendationSkeleton />
      <RecommendationSkeleton />
    </div>
  </div>
);

// MAIN PAGE COMPONENT
export default function SubscriptionSuccess() {
  const navigate = useNavigate();

  // Sandbox simulation overrides
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [simulatedState, setSimulatedState] = useState("active"); // 'active' | 'empty' | 'pending'

  // Load active subscription details directly from localStorage on each render (prevents useEffect warnings)
  const activeSub = (() => {
    const saved = localStorage.getItem('tiffintrack_active_subscription');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  })();

  // Unique subscription ID mock generator
  const [subId] = useState(() => `TT-2026-${Math.floor(100000 + Math.random() * 900000)}`);

  const mockDefaultSubscription = {
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    mealsRemaining: 52,
    status: 'Active',
    nextDelivery: 'Tomorrow, 12:30 PM & 8:00 PM',
    price: 3149,
    commencedDate: '10 June 2026',
    address: 'Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar - 388120. Landmark: Near Shastri Statue',
    preferences: ['Veg', 'Low Oil']
  };

  const subscription = activeSub || mockDefaultSubscription;

  // Manual redirect handler to clean query paths or tabs
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/customer-dashboard')}
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
            {/* Developer Sandbox Controls */}
            <div className="hidden lg:flex items-center space-x-3 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
              <span className="text-secondary-text text-[9px] uppercase tracking-wider">Sandbox Controls:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              
              <span className="text-slate-300">|</span>
              
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="sandboxState" 
                  checked={simulatedState === "active"}
                  onChange={() => setSimulatedState("active")}
                  className="text-mint focus:ring-mint w-3 h-3"
                />
                <span>Success</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="sandboxState" 
                  checked={simulatedState === "pending"}
                  onChange={() => setSimulatedState("pending")}
                  className="text-mint focus:ring-mint w-3 h-3"
                />
                <span>Pending</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="sandboxState" 
                  checked={simulatedState === "empty"}
                  onChange={() => setSimulatedState("empty")}
                  className="text-mint focus:ring-mint w-3 h-3"
                />
                <span>Empty</span>
              </label>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-100 px-3 py-1 rounded-lg">Success Screen</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full p-4 flex-grow space-y-6 md:py-8">
        
        {forceLoadingState ? (
          /* SKELETON LOADING VIEW */
          <div className="space-y-6">
            <div className="w-1/2 h-8 bg-slate-200 rounded mx-auto animate-pulse"></div>
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-6">
                <SummaryCardSkeleton />
                <DeliveryCardSkeleton />
                <SummaryCardSkeleton />
              </div>
              <div className="md:col-span-5 space-y-6">
                <SummaryCardSkeleton />
                <DeliveryCardSkeleton />
              </div>
            </div>
            <RecommendationsSkeletonList />
          </div>
        ) : simulatedState === "empty" ? (
          /* EMPTY STATE: NO SUBSCRIPTION FOUND */
          <div className="bg-white border border-slate-200/50 rounded-3xl p-12 max-w-xl mx-auto text-center space-y-6 shadow-card my-12">
            <div className="w-20 h-20 bg-slate-100 text-slate-450 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-primary-text">No Active Subscription Found</h2>
              <p className="text-xs text-secondary-text max-w-sm mx-auto leading-relaxed font-semibold">
                We couldn't locate any active plan details under this account. Please explore local home chefs to setup your first meal subscription.
              </p>
            </div>
            <button
              onClick={() => handleNavigate('/browse-vendors')}
              className="py-3 px-6 bg-mint hover:bg-mint-hover text-white text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Compass size={14} />
              <span>Browse Home Vendors</span>
            </button>
          </div>
        ) : simulatedState === "pending" ? (
          /* PENDING STATE: PAYMENT VERIFICATION PENDING */
          <div className="bg-white border border-slate-200/50 rounded-3xl p-12 max-w-xl mx-auto text-center space-y-6 shadow-card my-12">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-pulse border border-amber-100 shadow-inner">
              <RefreshCw size={36} className="animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-primary-text">Payment Verification Pending</h2>
              <p className="text-xs text-secondary-text max-w-sm mx-auto leading-relaxed font-semibold">
                Our gateway is verifying your payment with the banking servers. This usually takes less than 2 minutes. Do not refresh or exit.
              </p>
            </div>
            <div className="flex gap-3 justify-center text-xs font-bold">
              <button
                onClick={() => setSimulatedState("active")}
                className="py-2.5 px-5 bg-mint hover:bg-mint-hover text-white rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                <span>Refresh Status</span>
              </button>
              <button
                onClick={() => handleNavigate('/customer-dashboard')}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* NORMAL SUCCESSFUL STATE */
          <div className="space-y-6">
            
            {/* Celebratory Success Banner */}
            <SuccessBanner />

            {/* Content Columns */}
            <div className="grid md:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: SUMMARY CARD, PREFS, INVOICE */}
              <div className="md:col-span-7 space-y-6">
                
                {/* 1. Subscription Summary Card */}
                <SubscriptionSummaryCard subscription={subscription} subId={subId} />

                {/* 2. Delivery Details Card */}
                <DeliveryDetailsCard subscription={subscription} />

                {/* 3. Payment Summary Card */}
                <PaymentSummaryCard subscription={subscription} />

              </div>

              {/* RIGHT COLUMN: TIMELINE, PREVIEW, SUPPORT */}
              <div className="md:col-span-5 space-y-6">
                
                {/* 4. What Happens Next Timeline */}
                <TimelineComponent />

                {/* 5. Upcoming Delivery Preview */}
                <UpcomingPreviewCard subscription={subscription} />

                {/* 6. Help & Support block */}
                <SupportSection />

              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card">
              <ActionButtons onNavigate={handleNavigate} />
            </div>

            {/* Recommended Vendors Grid */}
            <RecommendedVendorsSection onNavigate={handleNavigate} />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-6 text-center">
        <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
          <div>TiffinTrack Secure Payments and Subscription Engine Verified</div>
          <div>© 2026 TiffinTrack. Powered by homemade passion.</div>
        </div>
      </footer>

    </div>
  );
}
