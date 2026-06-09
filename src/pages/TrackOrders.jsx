import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  MapPin, 
  Phone, 
  Compass, 
  ArrowRight, 
  Utensils, 
  Inbox,
  User,
  MessageSquare
} from 'lucide-react';

// Import Sidebar component
import Sidebar from '../components/Sidebar';

// REUSABLE SKELETON LOADERS FOR TRACKING
const SkeletonTrackingCard = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
    <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
);

const SkeletonListGroup = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card animate-pulse space-y-4">
    <div className="h-5 bg-slate-200 rounded w-1/4"></div>
    <div className="space-y-2">
      <div className="h-10 bg-slate-200 rounded w-full"></div>
      <div className="h-10 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);

const TrackingSkeleton = () => (
  <div className="grid lg:grid-cols-12 gap-6">
    <div className="lg:col-span-7 space-y-6">
      <SkeletonTrackingCard />
    </div>
    <div className="lg:col-span-5 space-y-6">
      <SkeletonListGroup />
      <SkeletonListGroup />
    </div>
  </div>
);

// Reusable Map Placeholder component preparing for future Google Maps API integration
function MapPlaceholder({ currentStep }) {
  // Translate steps into approximate courier coordinates on path
  // Start (Vendor) -> End (Destination)
  let riderOffsetClass = "left-[15%] top-[65%]"; // Default Prepared/Confirmed
  if (currentStep === "Prepared") {
    riderOffsetClass = "left-[22%] top-[58%]";
  } else if (currentStep === "Packed") {
    riderOffsetClass = "left-[35%] top-[40%]";
  } else if (currentStep === "OutForDelivery") {
    riderOffsetClass = "left-[58%] top-[32%]";
  } else if (currentStep === "Delivered") {
    riderOffsetClass = "left-[82%] top-[24%]";
  }

  return (
    <div className="relative w-full h-52 bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
      {/* Decorative Grid Patterns representing streets */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Visual Simulation of Streets */}
      <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
        {/* Street Lines */}
        <line x1="10%" y1="70%" x2="90%" y2="20%" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
        <line x1="10%" y1="70%" x2="30%" y2="20%" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <line x1="30%" y1="20%" x2="90%" y2="20%" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
        <line x1="50%" y1="80%" x2="60%" y2="10%" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" strokeDasharray="4" />
        
        {/* Active Route Path */}
        <path d="M 15 140 L 50 85 L 120 70 L 260 70 L 360 55" fill="none" stroke="#00B074" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-80" />
      </svg>

      {/* Starting point pin (Vendor) */}
      <div className="absolute left-[10%] top-[60%] flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-white border-2 border-mint flex items-center justify-center shadow-md animate-pulse">
          <Utensils size={12} className="text-mint" />
        </div>
        <span className="text-[8px] font-black text-slate-700 bg-white border border-slate-200 px-1 rounded shadow-sm mt-0.5 whitespace-nowrap">Chef Kitchen</span>
      </div>

      {/* Destination pin (Home) */}
      <div className="absolute left-[85%] top-[15%] flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-white border-2 border-slate-700 flex items-center justify-center shadow-md">
          <MapPin size={12} className="text-slate-700" />
        </div>
        <span className="text-[8px] font-black text-slate-700 bg-white border border-slate-200 px-1 rounded shadow-sm mt-0.5 whitespace-nowrap">Your Home</span>
      </div>

      {/* Delivery Rider Marker (Rahul Kumar) */}
      {currentStep !== "Delivered" && (
        <div className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${riderOffsetClass}`}>
          <div className="w-6 h-6 rounded-full bg-lemon border-2 border-lemon-hover flex items-center justify-center shadow-md animate-bounce">
            🚴
          </div>
          <span className="text-[7px] font-black text-slate-700 bg-lemon px-1 rounded border border-lemon-hover shadow-sm mt-0.5 whitespace-nowrap">Rahul Rider</span>
        </div>
      )}

      {/* Future API overlay banner */}
      <div className="absolute bottom-2 left-2 right-2 bg-slate-800/85 border border-slate-700 text-white text-[8px] font-black uppercase tracking-wider text-center py-1.5 rounded-lg flex items-center justify-center gap-1">
        <Compass size={10} className="animate-spin" style={{ animationDuration: '6s' }} />
        <span>Ready for Google Maps Integration</span>
      </div>
    </div>
  );
}

// Stepper Timeline Component
function OrderTimeline({ currentStep }) {
  const steps = [
    { key: "Confirmed", label: "Order Confirmed", desc: "Tiffin slot confirmed by chef." },
    { key: "Prepared", label: "Meal Being Prepared", desc: "Fresh recipes cooking in progress." },
    { key: "Packed", label: "Packed", desc: "Sealed in warm-lock containers." },
    { key: "OutForDelivery", label: "Out For Delivery", desc: "Rider Rahul dispatched." },
    { key: "Delivered", label: "Delivered", desc: "Contactless delivery successful." }
  ];

  const getStepIndex = (key) => steps.findIndex(s => s.key === key);
  const activeIdx = getStepIndex(currentStep);

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
        Delivery Status timeline
      </h3>

      <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-150">
        {steps.map((step, idx) => {
          const isComplete = idx < activeIdx || currentStep === "Delivered";
          const isActive = idx === activeIdx && currentStep !== "Delivered";
          return (
            <div key={idx} className="relative text-xs">
              {isComplete ? (
                <span className="absolute -left-5.5 top-0.5 w-3.5 h-3.5 rounded-full bg-mint flex items-center justify-center ring-4 ring-mint-light text-white font-bold text-[8px]">
                  ✓
                </span>
              ) : isActive ? (
                <span className="absolute -left-5.5 top-0.5 w-3.5 h-3.5 rounded-full bg-lemon flex items-center justify-center ring-4 ring-lemon-light text-primary-text font-black text-[9px] animate-pulse">
                  ●
                </span>
              ) : (
                <span className="absolute -left-5.5 top-0.5 w-3.5 h-3.5 rounded-full bg-slate-200 flex items-center justify-center ring-4 ring-snow text-slate-450 text-[8px]">
                  ○
                </span>
              )}
              <h4 className={`font-extrabold ${isComplete || isActive ? 'text-primary-text' : 'text-slate-400'}`}>
                {step.label}
              </h4>
              <p className="text-[10px] text-secondary-text mt-0.5 leading-relaxed font-semibold">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// MAIN DASHBOARD COMPONENT
export default function TrackOrders() {
  const navigate = useNavigate();

  // Mobile sidebar drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Developer Sandbox overrides
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [simulatedEmptyState, setSimulatedEmptyState] = useState(false);
  const [timelineStep, setTimelineStep] = useState("OutForDelivery"); // Confirmed | Prepared | Packed | OutForDelivery | Delivered
  const [isLoading, setIsLoading] = useState(true);

  // Modals dialog status
  const [showContactModal, setShowContactModal] = useState(false);

  // Load active subscription from localStorage on each render (prevents useEffect warnings)
  const activeSub = (() => {
    const saved = localStorage.getItem('tiffintrack_active_subscription');
    if (saved && saved !== 'none') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  })();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const defaultMockSub = {
    vendorName: "Priya's Home Kitchen",
    planName: "Lunch + Dinner Plan",
    nextDelivery: "Today, 12:45 PM",
    address: "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar"
  };

  const currentSub = activeSub || defaultMockSub;

  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      navigate('/my-subscriptions');
    } else if (tabId === 'track_orders') {
      // already here
    } else if (tabId === 'history') {
      navigate('/order-history');
    } else if (tabId === 'settings') {
      navigate('/profile-settings');
    } else if (tabId === 'notifications') {
      navigate('/notifications');
    } else {
      navigate('/customer-dashboard');
    }
  };

  // derived ETA calculations based on current step
  const getETADetails = () => {
    if (timelineStep === "Confirmed" || timelineStep === "Prepared") {
      return { time: "Est. 12:45 PM", text: "Chef preparing fresh recipes" };
    }
    if (timelineStep === "Packed") {
      return { time: "Leaving soon", text: "Ready at Dispatch desk" };
    }
    if (timelineStep === "OutForDelivery") {
      return { time: "Arriving in 15 mins", text: "Est: 12:43 PM • Out for delivery" };
    }
    return { time: "Delivered today", text: "Lunch box dropped off at 12:41 PM" };
  };

  const eta = getETADetails();
  const activeLoading = isLoading || forceLoadingState;

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Left Sidebar navigation */}
      <Sidebar 
        currentTab="track_orders" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content scrollable panel */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200/60 h-16 flex justify-between items-center px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-primary-text">Portal Manager</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Panel */}
            <div className="hidden md:flex items-center space-x-3 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
              <span className="text-slate-450 uppercase text-[9px] tracking-wider">Sandbox Panel:</span>
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
                  checked={simulatedEmptyState} 
                  onChange={(e) => setSimulatedEmptyState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>No Deliveries</span>
              </label>

              <span className="text-slate-300">|</span>

              <div className="flex items-center space-x-1">
                <span>Rider Status:</span>
                <select 
                  value={timelineStep} 
                  onChange={(e) => setTimelineStep(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] focus:outline-none focus:border-mint font-semibold cursor-pointer"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Prepared">Preparing</option>
                  <option value="Packed">Packed</option>
                  <option value="OutForDelivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-150 px-3 py-1 rounded-lg">Track Deliveries</span>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Section Introduction Header */}
          <div className="border-b border-slate-150 pb-4">
            <h1 className="text-2xl font-black text-primary-text tracking-tight">
              Track Today's Meal
            </h1>
            <p className="text-xs text-secondary-text mt-0.5 font-medium">
              Monitor the real-time status of your home-cooked meal courier.
            </p>
          </div>

          {activeLoading ? (
            <TrackingSkeleton />
          ) : simulatedEmptyState ? (
            /* EMPTY STATE: NO ACTIVE DISPATCHES TODAY */
            <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 animate-pulse">
                <Inbox size={36} />
              </div>
              <h3 className="text-base font-black text-primary-text mb-1">No Active Dispatches Today</h3>
              <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed font-semibold">
                There are no active dispatches today. Start a subscription or resume your paused plans to view courier status.
              </p>
              <button
                onClick={() => navigate('/my-subscriptions')}
                className="px-5 py-3 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition shadow-sm"
              >
                Manage Subscriptions
              </button>
            </div>
          ) : (
            /* NORMAL TRACKING VIEW LAYOUT */
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: MAP & TIMELINE */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Map Card */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-primary-text uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
                      Today's Live Dispatch Map
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Route: Kitchen → Home</span>
                  </div>

                  <MapPlaceholder currentStep={timelineStep} />
                </div>

                {/* 2. Stepper Timeline */}
                <OrderTimeline currentStep={timelineStep} />

                {/* 3. Delivery Rider Info Card */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-mint/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-lemon-light text-lemon-hover border border-lemon/20 flex items-center justify-center font-black text-sm">
                      RK
                    </div>
                    <div className="text-xs">
                      <h4 className="font-extrabold text-primary-text text-sm flex items-center gap-1.5">
                        <span>Rahul Kumar</span>
                        <span className="text-[9px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full border border-mint/10 uppercase">Rider</span>
                      </h4>
                      <p className="text-[10px] text-secondary-text font-bold mt-0.5">TiffinTrack Certified Delivery Partner</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone size={12} />
                    <span>Call Courier Partner</span>
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: DETAILS, LISTS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 4. ETA Highlight box */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-3 relative overflow-hidden group hover:border-mint/20 transition-all">
                  <div className="absolute right-0 top-0 w-20 h-20 bg-mint/5 rounded-full pointer-events-none"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Estimated Arrival</span>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-mint tracking-tight">{eta.time}</h2>
                    <p className="text-xs text-secondary-text font-semibold">{eta.text}</p>
                  </div>
                </div>

                {/* 5. Active Meal details */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-4 hover:border-mint/20 transition-all">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Current Kitchen Meal</span>
                    <h3 className="text-sm font-black text-primary-text mt-1">{currentSub.vendorName}</h3>
                  </div>

                  <div className="space-y-3.5 text-xs font-semibold">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Plan Package</span>
                      <span className="text-slate-700 block mt-0.5">{currentSub.planName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Today's Menu Details</span>
                      <span className="text-slate-650 font-medium leading-relaxed block mt-1 p-3 bg-snow rounded-xl border border-slate-100">
                        🍲 3 Soft Whole Wheat Phulkas, Authentic Sweet Dal, Steamed Rice, Seasonal Bhindi Masala, Curated Organic Spiced Buttermilk (Chhas).
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
                    <button 
                      onClick={() => setShowContactModal(true)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <MessageSquare size={12} />
                      <span>Contact Vendor</span>
                    </button>
                    <button 
                      onClick={() => navigate('/my-subscriptions')}
                      className="flex-1 py-2 bg-mint hover:bg-mint-hover text-white rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>View Subscription</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>

                {/* 6. Upcoming Deliveries panel */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card space-y-4 hover:border-mint/20 transition-all">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Upcoming Deliveries Forecast
                  </h3>
                  
                  <div className="space-y-3 text-xs font-semibold">
                    {[
                      { day: "Tomorrow", meal: "Lunch Box", time: "12:30 PM", status: "Scheduled" },
                      { day: "Day After", meal: "Lunch Box", time: "12:30 PM", status: "Scheduled" },
                      { day: "12 June 2026", meal: "Dinner Box", time: "8:00 PM", status: "Scheduled" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-700 block">{item.day} ({item.meal})</span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">⏰ Drop-off: {item.time}</span>
                        </div>
                        <span className="text-[9px] font-black text-mint bg-mint-light border border-mint/10 px-2 py-0.5 rounded-full uppercase">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Missed / Skipped Deliveries panel */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card space-y-4 hover:border-mint/20 transition-all">
                  <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-3">
                    Missed / Skipped History
                  </h3>
                  
                  <div className="space-y-3 text-xs font-semibold">
                    {[
                      { date: "08 June 2026", meal: "Dinner Box", reason: "Skipped by Customer" },
                      { date: "05 June 2026", meal: "Lunch Box", reason: "Skipped by Customer" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-700 block">{item.date} ({item.meal})</span>
                          <span className="text-[9px] text-secondary-text leading-none block font-medium">Tiffin delivery paused for date</span>
                        </div>
                        <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-200/20 px-2 py-1 rounded-full uppercase whitespace-nowrap">
                          {item.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/60 py-6 text-center mt-12">
          <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
            <div>TiffinTrack Courier Tracking Panel</div>
            <div>© 2026 TiffinTrack. Hot & Fresh homemade meals daily.</div>
          </div>
        </footer>

      </div>

      {/* CONTACT POPUP MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-mint-light text-mint flex items-center justify-center mx-auto">
              <User size={22} />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-primary-text">Contact Help Partner</h4>
              <p className="text-[11px] text-secondary-text leading-normal font-semibold">
                To contact Chef Priya or Rider Rahul Kumar, dials are automatically redirected to our secure call masking service.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl text-left space-y-2 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span>👨‍🍳 Chef Priya Patel:</span>
                <span className="text-mint font-mono">+91 99741-XXXXX</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span>🚴 Rider Rahul Kumar:</span>
                <span className="text-mint font-mono">+91 76541-XXXXX</span>
              </div>
            </div>

            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Close Mask Dialer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
