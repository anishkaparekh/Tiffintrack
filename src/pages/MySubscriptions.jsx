import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Pause,
  Play,
  RotateCcw,
  TrendingUp,
  Trash2,
  Inbox,
  Plus,
  Utensils
} from 'lucide-react';

// Import Sidebar component
import Sidebar from '../components/Sidebar';

// SKELETON LOADERS FOR MY SUBSCRIPTIONS
const SkeletonCard = () => (
  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
      <div className="h-5 bg-slate-200 rounded w-16"></div>
    </div>
    <div className="space-y-2.5">
      <div className="h-3.5 bg-slate-200 rounded w-full"></div>
      <div className="h-3.5 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="h-px bg-slate-100 my-2"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="flex gap-2 w-1/2">
        <div className="h-8 bg-slate-200 rounded-xl flex-grow"></div>
        <div className="h-8 bg-slate-200 rounded-xl flex-grow"></div>
      </div>
    </div>
  </div>
);

const SubscriptionsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-slate-200 rounded w-1/4 animate-pulse"></div>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default function MySubscriptions() {
  const navigate = useNavigate();

  // Mobile sidebar layout drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search & Filter Status States
  const [searchText, setSearchText] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All"); // 'All' | 'Active' | 'Paused' | 'Upcoming' | 'Expired'

  // Developer Sandbox Controls
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [simulatedEmptyState, setSimulatedEmptyState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Dialogs Status
  const [activeCancelSub, setActiveCancelSub] = useState(null); // Sub object to cancel
  const [activeUpgradeSub, setActiveUpgradeSub] = useState(null); // Sub object to upgrade

  // Master subscriptions state loaded dynamically from localStorage or mock
  const [subscriptionsList, setSubscriptionsList] = useState(() => {
    // Dynamic fetch active subscription
    const savedActive = localStorage.getItem('tiffintrack_active_subscription');
    let activeItem = null;
    if (savedActive && savedActive !== 'none') {
      try {
        activeItem = JSON.parse(savedActive);
      } catch (e) {
        console.error(e);
      }
    }

    // Default mock lists
    const defaultList = [];

    // If active tiffin exists, push it
    if (activeItem) {
      defaultList.push({
        id: "sub_active_1",
        vendorId: activeItem.vendorId || 1,
        vendorName: activeItem.vendorName || "Priya's Home Kitchen",
        planName: activeItem.planName || "Lunch + Dinner Plan",
        price: activeItem.price || 3149,
        startDate: activeItem.commencedDate || "08 June 2026",
        renewalDate: "08 July 2026",
        status: activeItem.status || "Active",
        deliverySchedule: activeItem.planName.includes("Lunch Only") ? "Lunch: 12:30 PM (Mon-Sat)" : "Lunch: 12:30 PM & Dinner: 8:00 PM (Mon-Sat)",
        mealsRemaining: activeItem.mealsRemaining || 52,
        address: activeItem.address || "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar"
      });
    } else {
      // Default Active Fallback
      defaultList.push({
        id: "sub_active_fallback",
        vendorId: 1,
        vendorName: "Priya's Home Kitchen",
        planName: "Lunch + Dinner Plan",
        price: 3499,
        startDate: "08 June 2026",
        renewalDate: "08 July 2026",
        status: "Active",
        deliverySchedule: "Lunch: 12:30 PM & Dinner: 8:00 PM (Mon-Sat)",
        mealsRemaining: 52,
        address: "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar"
      });
    }

    // Add Mock Upcoming subscription
    defaultList.push({
      id: "sub_upcoming_1",
      vendorId: 4,
      vendorName: "Mom's Punjabi Rasoi",
      planName: "Weekly Punjabi Veg Plan",
      price: 900,
      startDate: "15 June 2026",
      renewalDate: "22 June 2026",
      status: "Upcoming",
      deliverySchedule: "Lunch: 1:00 PM (Mon-Sat)",
      mealsRemaining: 6,
      address: "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar"
    });

    // Add Mock Expired subscription
    defaultList.push({
      id: "sub_expired_1",
      vendorId: 7,
      vendorName: "Student Budget Tiffins",
      planName: "Basic Homestyle Plan",
      price: 1500,
      startDate: "01 May 2026",
      renewalDate: "31 May 2026",
      status: "Expired",
      deliverySchedule: "Dinner: 8:30 PM (Mon-Sat)",
      mealsRemaining: 0,
      address: "Flat 402, Green Meadows, Shastri Marg, Vallabh Vidyanagar"
    });

    return defaultList;
  });

  // Load subscriptions list and handle localStorage sync
  useEffect(() => {
    // Initial load loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Sync state update to localStorage if active subscription changes
  const updateActiveSubStorage = (updatedList) => {
    const activeSub = updatedList.find(s => s.id === "sub_active_1" || s.id === "sub_active_fallback");
    if (activeSub) {
      const storageObj = {
        vendorId: activeSub.vendorId,
        vendorName: activeSub.vendorName,
        planName: activeSub.planName,
        mealsRemaining: activeSub.mealsRemaining,
        status: activeSub.status,
        nextDelivery: activeSub.planName.includes("Lunch Only") ? "Tomorrow, 12:30 PM" : "Tomorrow, 12:30 PM & 8:00 PM",
        price: activeSub.price,
        commencedDate: activeSub.startDate,
        address: activeSub.address,
        preferences: ["Veg", "Low Oil"]
      };
      localStorage.setItem('tiffintrack_active_subscription', JSON.stringify(storageObj));
    } else {
      localStorage.setItem('tiffintrack_active_subscription', 'none');
    }
  };

  // Switch between tabs in the Left Sidebar
  const handleTabChange = (tabId) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      // already here
    } else if (tabId === 'track_orders') {
      navigate('/track-orders');
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

  // Pause Action Handler
  const handlePauseSubscription = (subId) => {
    const updated = subscriptionsList.map(s => {
      if (s.id === subId) {
        return { ...s, status: 'Paused' };
      }
      return s;
    });
    setSubscriptionsList(updated);
    updateActiveSubStorage(updated);
  };

  // Resume Action Handler
  const handleResumeSubscription = (subId) => {
    const updated = subscriptionsList.map(s => {
      if (s.id === subId) {
        return { ...s, status: 'Active' };
      }
      return s;
    });
    setSubscriptionsList(updated);
    updateActiveSubStorage(updated);
  };

  // Renew Expired Action Handler
  const handleRenewSubscription = (subId) => {
    const updated = subscriptionsList.map(s => {
      if (s.id === subId) {
        return { 
          ...s, 
          status: 'Active', 
          startDate: 'Tomorrow', 
          renewalDate: '30 Days Later',
          mealsRemaining: 26 
        };
      }
      return s;
    });
    setSubscriptionsList(updated);
    updateActiveSubStorage(updated);
  };

  // Plan Upgrade trigger handler
  const handleConfirmUpgrade = (upgradePlanName, upgradePrice) => {
    if (!activeUpgradeSub) return;
    const updated = subscriptionsList.map(s => {
      if (s.id === activeUpgradeSub.id) {
        return { 
          ...s, 
          planName: upgradePlanName, 
          price: upgradePrice, 
          deliverySchedule: upgradePlanName.includes("Lunch Only") ? "Lunch: 12:30 PM (Mon-Sat)" : "Lunch: 12:30 PM & Dinner: 8:00 PM (Mon-Sat)",
          mealsRemaining: s.mealsRemaining + 20
        };
      }
      return s;
    });
    setSubscriptionsList(updated);
    updateActiveSubStorage(updated);
    setActiveUpgradeSub(null);
  };

  // Cancel trigger handler
  const handleConfirmCancel = () => {
    if (!activeCancelSub) return;
    // Remove or move to Expired status
    const updated = subscriptionsList.map(s => {
      if (s.id === activeCancelSub.id) {
        return { ...s, status: 'Expired', renewalDate: 'Ended Today', mealsRemaining: 0 };
      }
      return s;
    });
    setSubscriptionsList(updated);
    updateActiveSubStorage(updated);
    setActiveCancelSub(null);
  };

  // Reset localStorage to default Active plan in Sandbox
  const handleResetLocalStorage = () => {
    localStorage.removeItem('tiffintrack_active_subscription');
    window.location.reload();
  };

  // Filtering list logic
  const filteredList = subscriptionsList.filter(sub => {
    // Search input match
    const searchMatch = sub.vendorName.toLowerCase().includes(searchText.toLowerCase()) || 
                        sub.planName.toLowerCase().includes(searchText.toLowerCase());
    
    // Status match
    if (selectedStatusFilter === "All") return searchMatch;
    return searchMatch && sub.status === selectedStatusFilter;
  });

  const activeLoading = isLoading || forceLoadingState;
  const isListEmpty = simulatedEmptyState || filteredList.length === 0;

  // Split list by category sections for rendering
  const activeSubs = filteredList.filter(s => s.status === 'Active' || s.status === 'Paused');
  const upcomingSubs = filteredList.filter(s => s.status === 'Upcoming');
  const expiredSubs = filteredList.filter(s => s.status === 'Expired');

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="subscriptions" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Panel Content Area */}
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
            {/* Developer Sandbox Controls */}
            <div className="hidden md:flex items-center space-x-2.5 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
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
                <span>Empty Lists</span>
              </label>

              <button 
                onClick={handleResetLocalStorage}
                className="px-2 py-0.5 border border-slate-200 bg-white hover:bg-slate-100 rounded text-[9px] text-slate-700 transition cursor-pointer"
              >
                Reset Storage sub
              </button>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-150 px-3 py-1 rounded-lg">My Subscriptions</span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 max-w-5xl w-full mx-auto space-y-6">
          
          {/* Section Page Intro Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-2">
            <div>
              <h1 className="text-2xl font-black text-primary-text tracking-tight">
                My Subscriptions
              </h1>
              <p className="text-xs text-secondary-text mt-0.5 font-medium">
                View, schedule, pause, or customize your active home-cooked tiffin packages.
              </p>
            </div>

            <button 
              onClick={() => navigate('/browse-vendors')}
              className="py-2 px-4 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Subscribe New Kitchen</span>
            </button>
          </div>

          {/* Filtering and Search Section */}
          <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-card flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search subscriptions by chef, plan, or locality"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint rounded-xl text-xs bg-snow font-semibold placeholder-slate-450 text-primary-text"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {["All", "Active", "Paused", "Upcoming", "Expired"].map(status => {
                const isSelected = selectedStatusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusFilter(status)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-mint border-mint text-white shadow-sm' 
                        : 'bg-snow border-slate-150 text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subscriptions Rendering Blocks */}
          {activeLoading ? (
            <SubscriptionsSkeleton />
          ) : isListEmpty ? (
            /* EMPTY STATES rendering */
            <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 animate-pulse">
                <Inbox size={36} />
              </div>
              <h3 className="text-base font-black text-primary-text mb-1">No Subscriptions Found</h3>
              <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed font-semibold">
                We couldn't locate any subscription plan matches under your search keywords or selected filter categories.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setSearchText(""); setSelectedStatusFilter("All"); setSimulatedEmptyState(false); }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/browse-vendors')}
                  className="px-4 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  Browse Home Chefs
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL SUBSCRIPTION GROUPS */
            <div className="space-y-8">
              
              {/* GROUP 1: ACTIVE & PAUSED SUBSCRIPTIONS */}
              {activeSubs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-sm font-black text-primary-text uppercase tracking-wider">
                      Active & Paused Subscriptions
                    </h2>
                    <span className="text-[10px] font-black text-mint bg-mint-light px-2 py-0.5 rounded-full">
                      {activeSubs.length}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {activeSubs.map((sub) => {
                      const isActive = sub.status === 'Active';
                      return (
                        <div 
                          key={sub.id} 
                          className={`bg-white border-2 rounded-3xl p-6 shadow-card flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all ${
                            isActive ? 'border-slate-150' : 'border-amber-200 bg-amber-50/5'
                          }`}
                        >
                          <div className="space-y-4">
                            {/* Header details */}
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                  isActive 
                                    ? 'text-mint bg-mint-light border-mint/10' 
                                    : 'text-amber-600 bg-amber-50 border-amber-200/30'
                                }`}>
                                  {sub.status}
                                </span>
                                <h3 className="text-base font-black text-primary-text mt-1.5">{sub.planName}</h3>
                                <p className="text-[11px] text-secondary-text font-bold">Chef Vendor: {sub.vendorName}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-black text-primary-text">₹{sub.price}</span>
                                <span className="text-[9px] text-slate-400 block font-bold">/Month start</span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400" />
                                <span>Commenced: {sub.startDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} className="text-slate-400" />
                                <span>Renewal: {sub.renewalDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5 col-span-2 border-t border-slate-100/50 pt-1.5">
                                <Clock size={13} className="text-slate-400" />
                                <span className="truncate">Schedule: {sub.deliverySchedule}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 border-t border-slate-100 pt-4 mt-5">
                            {isActive ? (
                              <button
                                onClick={() => handlePauseSubscription(sub.id)}
                                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200/20 text-amber-600 text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Pause size={12} />
                                <span>Pause Plan</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleResumeSubscription(sub.id)}
                                className="flex-1 py-2 bg-mint-light hover:bg-mint-light/80 border border-mint/10 text-mint text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Play size={12} />
                                <span>Resume Plan</span>
                              </button>
                            )}
                            <button
                              onClick={() => setActiveUpgradeSub(sub)}
                              className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <TrendingUp size={12} />
                              <span>Upgrade Plan</span>
                            </button>
                            <button
                              onClick={() => setActiveCancelSub(sub)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200/20 text-red-500 rounded-xl transition flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GROUP 2: UPCOMING SUBSCRIPTIONS */}
              {upcomingSubs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-sm font-black text-primary-text uppercase tracking-wider">
                      Upcoming Subscriptions
                    </h2>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {upcomingSubs.length}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {upcomingSubs.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 shadow-card flex flex-col justify-between hover:border-blue-300 transition-all"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border text-blue-600 bg-blue-50 border-blue-200/30">
                                {sub.status}
                              </span>
                              <h3 className="text-base font-black text-primary-text mt-1.5">{sub.planName}</h3>
                              <p className="text-[11px] text-secondary-text font-bold">Chef Vendor: {sub.vendorName}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-primary-text">₹{sub.price}</span>
                              <span className="text-[9px] text-slate-400 block font-bold">/Week cycle</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-500 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-slate-400" />
                              <span>Commences: {sub.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} className="text-slate-400" />
                              <span>Meals: {sub.mealsRemaining} Lunch Meals</span>
                            </div>
                            <div className="flex items-center gap-1.5 col-span-2 border-t border-slate-100/50 pt-1.5">
                              <MapPin size={13} className="text-slate-400" />
                              <span className="truncate">Address: {sub.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-5">
                          <button
                            onClick={() => {
                              // Toggles upcoming plan to active
                              const updated = subscriptionsList.map(s => {
                                if (s.id === sub.id) {
                                  return { ...s, status: 'Active' };
                                }
                                return s;
                              });
                              setSubscriptionsList(updated);
                              updateActiveSubStorage(updated);
                            }}
                            className="flex-grow py-2 bg-mint hover:bg-mint-hover text-white text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play size={12} />
                            <span>Activate Now</span>
                          </button>
                          <button
                            onClick={() => {
                              const updated = subscriptionsList.filter(s => s.id !== sub.id);
                              setSubscriptionsList(updated);
                            }}
                            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-500 border border-red-200/20 text-[10px] font-extrabold rounded-xl transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GROUP 3: EXPIRED SUBSCRIPTIONS */}
              {expiredSubs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <h2 className="text-sm font-black text-primary-text uppercase tracking-wider">
                      Expired Subscriptions
                    </h2>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {expiredSubs.length}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {expiredSubs.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-card flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border text-slate-500 bg-slate-50 border-slate-200/30">
                                {sub.status}
                              </span>
                              <h3 className="text-base font-black text-primary-text mt-1.5">{sub.planName}</h3>
                              <p className="text-[11px] text-secondary-text font-bold">Chef Vendor: {sub.vendorName}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-black text-slate-450">₹{sub.price}</span>
                              <span className="text-[9px] text-slate-450 block font-bold">/Month start</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} />
                              <span>Commenced: {sub.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} />
                              <span>Ended: {sub.renewalDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-5">
                          <button
                            onClick={() => handleRenewSubscription(sub.id)}
                            className="flex-grow py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw size={12} />
                            <span>Renew Subscription</span>
                          </button>
                          <button 
                            onClick={() => navigate(`/vendor/${sub.vendorId}`)}
                            className="px-4 py-2.5 text-mint hover:bg-mint-light/40 border border-transparent rounded-xl text-[10px] font-extrabold transition cursor-pointer"
                          >
                            View Kitchen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/60 py-6 text-center mt-12">
          <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
            <div>TiffinTrack Subscriptions Management Panel</div>
            <div>© 2026 TiffinTrack. All rights reserved.</div>
          </div>
        </footer>

      </div>

      {/* CANCEL CONFIRMATION MODAL */}
      {activeCancelSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle size={22} />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-primary-text">Cancel Meal Subscription?</h4>
              <p className="text-[11px] text-secondary-text leading-normal font-semibold">
                Are you sure you want to cancel your tiffin plan with <span className="font-extrabold text-primary-text">{activeCancelSub.vendorName}</span>? You will lose active delivery slots.
              </p>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/30 p-2.5 rounded-xl text-[10px] text-amber-600 font-bold text-left leading-normal flex items-start gap-1.5">
              <span>⚠️</span>
              <span><strong>Alternative Option:</strong> You can pause your subscription instead to temporarily skip deliveries without cancelling completely!</span>
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button 
                onClick={() => {
                  handlePauseSubscription(activeCancelSub.id);
                  setActiveCancelSub(null);
                }}
                className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/20 rounded-xl cursor-pointer"
              >
                Pause Instead
              </button>
              <button 
                onClick={handleConfirmCancel}
                className="flex-1 py-2 bg-red-500 hover:bg-red-650 text-white rounded-xl cursor-pointer"
              >
                Yes, Cancel Plan
              </button>
              <button 
                onClick={() => setActiveCancelSub(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE PLAN CHOICE MODAL */}
      {activeUpgradeSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-primary-text">Upgrade Subscription Plan</h4>
                <p className="text-[10px] text-secondary-text mt-0.5">Subscribed with {activeUpgradeSub.vendorName}</p>
              </div>
              <TrendingUp className="text-mint animate-pulse" size={18} />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Choose premium package upgrade:</span>
              
              {[
                { name: "Lunch + Dinner Plan", price: 3499, diff: 3499 - activeUpgradeSub.price, desc: "Gets you lunch at 12:30 PM & dinner at 8:00 PM daily." },
                { name: "Family Portion Package", price: 5999, diff: 5999 - activeUpgradeSub.price, desc: "Generous portions of authentic homestyle cooking for 3-4 members." }
              ].map((upg, idx) => {
                const isUnavailable = upg.diff <= 0;
                return (
                  <div 
                    key={idx}
                    className={`border-2 rounded-2xl p-4 flex flex-col justify-between gap-2 transition-all ${
                      isUnavailable 
                        ? 'border-slate-100 opacity-50 bg-slate-50 cursor-not-allowed' 
                        : 'border-slate-150 hover:border-mint/35 cursor-pointer bg-white'
                    }`}
                    onClick={() => {
                      if (!isUnavailable) handleConfirmUpgrade(upg.name, upg.price);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs text-slate-700">{upg.name}</span>
                        <p className="text-[10px] text-slate-400 leading-normal font-medium mt-0.5">{upg.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-black text-primary-text">₹{upg.price}</span>
                        <span className="text-[9px] text-mint block font-extrabold mt-0.5">
                          {isUnavailable ? "Current Tier" : `+₹${upg.diff} change`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 text-xs font-bold justify-end">
              <button 
                onClick={() => setActiveUpgradeSub(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
              >
                Cancel Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
