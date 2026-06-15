import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Bell, 
  Trash2, 
  CheckCheck, 
  AlertCircle, 
  Sparkles, 
  Package, 
  UserCheck, 
  Search, 
  X, 
  Info,
  CalendarDays,
  Plus,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

// Import Sidebar component
import Sidebar from '../components/Sidebar';
import { useNotifications } from '../auth/NotificationContext';

// Loading Skeleton component for Notifications list
const SkeletonNotificationRow = () => (
  <div className="bg-white border border-slate-200/50 rounded-2xl p-4.5 shadow-card animate-pulse flex items-start space-x-3.5">
    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"></div>
    <div className="flex-grow space-y-2">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
      <div className="h-2.5 bg-slate-200 rounded w-12 pt-1"></div>
    </div>
    <div className="w-6 h-6 rounded bg-slate-100 flex-shrink-0"></div>
  </div>
);

const NotificationsSkeleton = () => (
  <div className="space-y-4">
    <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
    <SkeletonNotificationRow />
    <SkeletonNotificationRow />
    <SkeletonNotificationRow />
  </div>
);

// Default dynamic notifications database
const initialNotifications = [
  {
    id: "notif-1",
    title: "🍱 Lunch Tiffin Prepared & Packed!",
    message: "Chef Priya Patel has packed your Gujarati Lunch Thali. It is ready for delivery partner Rahul Kumar to pick up.",
    timestamp: "12:15 PM",
    date: "09 June 2026",
    category: "Orders",
    isRead: false
  },
  {
    id: "notif-2",
    title: "💸 Special Mid-Week Discount Offer!",
    message: "Get ₹150 off on renewing your Punjabi Veg subscription this week. Use code HOMEFEAST150 at checkout.",
    timestamp: "10:30 AM",
    date: "09 June 2026",
    category: "Offers",
    isRead: false
  },
  {
    id: "notif-3",
    title: "🔄 Subscription Renewed Automatically",
    message: "Your monthly Veg Plan with Priya's Home Kitchen has been successfully renewed. ₹3,200 deducted from UPI.",
    timestamp: "Yesterday, 9:00 AM",
    date: "08 June 2026",
    category: "Subscriptions",
    isRead: true
  },
  {
    id: "notif-4",
    title: "⚠️ Delivery Route Skipped Successfully",
    message: "You skipped delivery for 08 June 2026. ₹135 tiffin balance has been credited back to your wallet.",
    timestamp: "07 June 2026",
    date: "07 June 2026",
    category: "Subscriptions",
    isRead: true
  },
  {
    id: "notif-5",
    title: "🚲 Courier Out for Delivery",
    message: "Rahul Kumar is out for delivery with your Kathiyawadi Dinner box. Track on the live maps screen.",
    timestamp: "06 June 2026",
    date: "06 June 2026",
    category: "Orders",
    isRead: true
  },
  {
    id: "notif-6",
    title: "⚙️ System Update: UPI Portals Restored",
    message: "We have resolved the network latency with Google Pay UPI gateways. Smooth subscription activations are now fully online.",
    timestamp: "31 May 2026",
    date: "31 May 2026",
    category: "System",
    isRead: true
  }
];

export default function Notifications() {
  const navigate = useNavigate();

  // Mobile sidebar layout drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Retrieve context
  const {
    notifications: dbNotifications,
    unreadCount,
    isLoading: contextIsLoading,
    toast: contextToast,
    setToast: setContextToast,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Core notifications state
  const [notifs, setNotifs] = useState(initialNotifications);

  // Search & Filter states
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All | Unread | Read
  const [categoryFilter, setCategoryFilter] = useState("All"); // All | Orders | Subscriptions | Offers | System

  // Saving, loading and sandbox state
  const [isLoading, setIsLoading] = useState(true);
  const [sandboxForceSkeleton, setSandboxForceSkeleton] = useState(false);
  const [sandboxForceEmptyList, setSandboxForceEmptyList] = useState(false);

  // Combined toast from local and context
  const [localToast, setLocalToast] = useState(null);
  const toast = localToast || contextToast;
  const setToast = (t) => {
    if (t === null) {
      setLocalToast(null);
      setContextToast(null);
    } else {
      setLocalToast(t);
    }
  };

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync with context notifications
  useEffect(() => {
    if (contextIsLoading) return;
    if (dbNotifications && dbNotifications.length > 0) {
      setNotifs(dbNotifications);
    } else {
      if (sandboxForceEmptyList) {
        setNotifs([]);
      } else {
        setNotifs(initialNotifications);
      }
    }
  }, [dbNotifications, contextIsLoading, sandboxForceEmptyList]);

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
    } else if (tabId === 'addresses') {
      navigate('/customer/addresses');
    } else if (tabId === 'history') {
      navigate('/order-history');
    } else if (tabId === 'settings') {
      navigate('/profile-settings');
    } else if (tabId === 'notifications') {
      // already here
    } else {
      navigate('/customer-dashboard');
    }
  };

  // Helper trigger to show custom toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Mark single notification as read/unread toggle
  const handleToggleReadStatus = async (id) => {
    const isDbNotif = dbNotifications && dbNotifications.some(n => n._id === id || n.id === id);
    if (isDbNotif) {
      const notif = dbNotifications.find(n => n._id === id || n.id === id);
      if (notif && !notif.isRead) {
        await markAsRead(id);
        showToast("success", "Notification marked as read.");
      } else {
        showToast("info", "Notification is already marked as read.");
      }
    } else {
      setNotifs(prev => prev.map(n => {
        if (n.id === id) {
          const nextState = !n.isRead;
          showToast("success", nextState ? "Notification marked as read." : "Notification marked as unread.");
          return { ...n, isRead: nextState };
        }
        return n;
      }));
    }
  };

  // Delete single notification card
  const handleDeleteNotification = async (id) => {
    const isDbNotif = dbNotifications && dbNotifications.some(n => n._id === id || n.id === id);
    if (isDbNotif) {
      await deleteNotification(id);
    } else {
      setNotifs(prev => prev.filter(n => n.id !== id));
    }
    showToast("success", "Notification removed.");
  };

  // Bulk actions: Mark All as Read
  const handleMarkAllAsRead = async () => {
    const activeNotifs = dbNotifications && dbNotifications.length > 0 ? dbNotifications : notifs;
    const unreadCount = activeNotifs.filter(n => !n.isRead).length;
    if (unreadCount === 0) {
      showToast("info", "All notifications are already read.");
      return;
    }
    if (dbNotifications && dbNotifications.length > 0) {
      await markAllAsRead();
    } else {
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    }
    showToast("success", `Marked notifications as read.`);
  };

  // Bulk actions: Clear All
  const handleClearAll = async () => {
    const activeNotifs = dbNotifications && dbNotifications.length > 0 ? dbNotifications : notifs;
    if (activeNotifs.length === 0) {
      showToast("info", "No notifications to clear.");
      return;
    }
    if (dbNotifications && dbNotifications.length > 0) {
      const deletePromises = dbNotifications.map(n => deleteNotification(n._id || n.id));
      await Promise.all(deletePromises);
    } else {
      setNotifs([]);
    }
    showToast("success", "Cleared all notifications.");
  };

  // Simulator: incoming notification trigger
  const handleSimulateIncoming = () => {
    const mockInbound = [
      {
        id: `notif-sim-${Date.now()}`,
        title: "🏍️ Dispatch: Tiffin Out for Delivery!",
        message: "Rahul Kumar has picked up your Gujarati lunch box. ETA is 18 minutes. Open Track Orders to view location.",
        timestamp: "Just Now",
        date: "09 June 2026",
        category: "Orders",
        isRead: false
      },
      {
        id: `notif-sim-${Date.now() + 1}`,
        title: "✨ Special Offer: Free Dessert Friday",
        message: "Order any Kathiyawadi standard monthly subscription thali and enjoy free Basundi (100ml) every Friday!",
        timestamp: "Just Now",
        date: "09 June 2026",
        category: "Offers",
        isRead: false
      },
      {
        id: `notif-sim-${Date.now() + 2}`,
        title: "⚠️ Subscription Renewal Grace Period",
        message: "Your basic Punjabi subscription expires in 2 days. Renew today to avoid delivery disruptions.",
        timestamp: "Just Now",
        date: "09 June 2026",
        category: "Subscriptions",
        isRead: false
      }
    ];

    const randomChoice = mockInbound[Math.floor(Math.random() * mockInbound.length)];
    setNotifs(prev => [randomChoice, ...prev]);
    showToast("success", `New real-time alert received: "${randomChoice.category}"`);
  };

  // Reset notifications list to defaults
  const handleResetSandboxList = () => {
    setNotifs(initialNotifications);
    setSearchText("");
    setStatusFilter("All");
    setCategoryFilter("All");
    showToast("success", "Restored standard notifications database.");
  };

  // Filter application logic
  const filteredNotifs = notifs.filter(n => {
    // 1. Search filter matches message or title text
    const matchesSearch = n.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          n.message.toLowerCase().includes(searchText.toLowerCase());

    // 2. Read Status filter
    const matchesStatus = statusFilter === "All" ||
                          (statusFilter === "Unread" && !n.isRead) ||
                          (statusFilter === "Read" && n.isRead);

    // 3. Category filter
    let matchesCategory = false;
    if (categoryFilter === "All") {
      matchesCategory = true;
    } else {
      const catUpper = (n.category || "").toUpperCase();
      if (categoryFilter === "Orders") {
        matchesCategory = catUpper === "ORDERS" || catUpper === "ORDER" || catUpper === "DELIVERY";
      } else if (categoryFilter === "Subscriptions") {
        matchesCategory = catUpper === "SUBSCRIPTIONS" || catUpper === "SUBSCRIPTION" || catUpper === "MEAL";
      } else if (categoryFilter === "Offers") {
        matchesCategory = catUpper === "OFFERS" || catUpper === "PROMOTIONAL";
      } else if (categoryFilter === "System") {
        matchesCategory = catUpper === "SYSTEM" || catUpper === "ADMIN" || catUpper === "PAYMENT";
      }
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Grouping function by date segments
  const groupNotifications = (list) => {
    const today = [];
    const thisWeek = [];
    const earlier = [];

    list.forEach(item => {
      const dateVal = item.createdAt ? new Date(item.createdAt) : new Date();
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - dateVal.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const isToday = dateVal.toDateString() === now.toDateString() || (item.timestamp === "Just Now" || item.date === "09 June 2026");
      const isThisWeek = diffDays <= 7 && !isToday;

      if (isToday) {
        today.push(item);
      } else if (isThisWeek) {
        thisWeek.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { today, thisWeek, earlier };
  };

  const grouped = groupNotifications(filteredNotifs);
  const showSkeleton = isLoading || contextIsLoading || sandboxForceSkeleton;
  const showEmptyState = sandboxForceEmptyList || filteredNotifs.length === 0;

  // Retrieve category icons dynamically
  const getCategoryIcon = (category) => {
    const norm = (category || '').toUpperCase();
    switch (norm) {
      case "ORDER":
      case "ORDERS":
      case "DELIVERY":
        return <Package size={16} className="text-emerald-600" />;
      case "SUBSCRIPTION":
      case "SUBSCRIPTIONS":
      case "MEAL":
        return <UserCheck size={16} className="text-blue-600" />;
      case "PROMOTIONAL":
      case "OFFERS":
        return <Sparkles size={16} className="text-amber-500" />;
      case "SYSTEM":
      default:
        return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  const getCategoryBgClass = (category) => {
    const norm = (category || '').toUpperCase();
    switch (norm) {
      case "ORDER":
      case "ORDERS":
      case "DELIVERY":
        return "bg-emerald-50 border-emerald-100/60";
      case "SUBSCRIPTION":
      case "SUBSCRIPTIONS":
      case "MEAL":
        return "bg-blue-50 border-blue-100/60";
      case "PROMOTIONAL":
      case "OFFERS":
        return "bg-amber-50 border-amber-100/60";
      case "SYSTEM":
      default:
        return "bg-red-50 border-red-100/60";
    }
  };

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="notifications" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-y-auto relative pb-20">
        
        {/* Success / Error Alerts pop-up */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-3.5 rounded-2xl shadow-card transition-all duration-300 border animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
              : toast.type === "error" 
                ? "bg-red-50 border-red-100 text-red-800" 
                : "bg-blue-50 border-blue-100 text-blue-800"
          }`}>
            <CheckCircle2 size={16} className={toast.type === "success" ? "text-emerald-500" : toast.type === "error" ? "text-red-500" : "text-blue-500"} />
            <span className="text-xs font-semibold text-slate-800">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Sticky Header */}
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
              <span className="text-sm font-bold text-primary-text">Notifications</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick action buttons */}
            {!showSkeleton && notifs.length > 0 && (
              <div className="hidden sm:flex space-x-2">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1"
                >
                  <CheckCheck size={14} className="text-slate-500" />
                  <span>Mark All as Read</span>
                </button>
                <button 
                  onClick={handleClearAll}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1 border border-red-100"
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              </div>
            )}
            
            <div className="w-8 h-8 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-sm">
              N
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-primary-text tracking-tight flex items-center space-x-2">
                <span>Notifications Hub</span>
                <span className="bg-mint/10 text-mint text-xs font-black px-2 py-0.5 rounded-full">
                  {notifs.filter(n => !n.isRead).length} Unread
                </span>
              </h1>
              <p className="text-xs md:text-sm text-secondary-text mt-1">
                Stay updated with your daily meal subscriptions, hot offers, and dispatch schedules.
              </p>
            </div>

            {/* Mobile Actions Toolbar */}
            {!showSkeleton && notifs.length > 0 && (
              <div className="flex sm:hidden space-x-2">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1"
                >
                  <CheckCheck size={13} />
                  <span>Read All</span>
                </button>
                <button 
                  onClick={handleClearAll}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Trash2 size={13} />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>

          {/* Search & Multi-Filters Panel */}
          <div className="bg-white border border-slate-200/50 p-4 rounded-3xl shadow-card space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input 
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search alerts (e.g. coupon code, vendor, status)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-primary-text focus:bg-white focus:border-mint focus:outline-none transition-all"
                />
                {searchText && (
                  <button onClick={() => setSearchText("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status & Category filters */}
              <div className="flex gap-2 flex-shrink-0">
                <div className="flex-1 md:flex-none">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                  </select>
                </div>

                <div className="flex-1 md:flex-none">
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Orders">Orders</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Offers">Offers</option>
                    <option value="System">System</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Main List Section */}
          {showSkeleton ? (
            <NotificationsSkeleton />
          ) : showEmptyState ? (
            <div className="py-12 text-center bg-white border border-slate-200/50 rounded-3xl shadow-card space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <Bell size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-primary-text">No Notifications Found</h3>
                <p className="text-xs text-secondary-text max-w-xs mx-auto">
                  There are no alerts matching your filters or search keywords.
                </p>
              </div>
              {(searchText || statusFilter !== "All" || categoryFilter !== "All") && (
                <button 
                  onClick={() => {
                    setSearchText("");
                    setStatusFilter("All");
                    setCategoryFilter("All");
                  }}
                  className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TIMEFRAME: TODAY */}
              {grouped.today.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-400 px-1">
                    <CalendarDays size={13} className="text-mint" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Today</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {grouped.today.map((notif) => (
                      <NotificationCard 
                        key={notif._id || notif.id} 
                        notif={notif} 
                        getCategoryIcon={getCategoryIcon}
                        getCategoryBgClass={getCategoryBgClass}
                        onToggleRead={handleToggleReadStatus}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TIMEFRAME: THIS WEEK */}
              {grouped.thisWeek.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-400 px-1 pt-2">
                    <CalendarDays size={13} className="text-blue-500" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">This Week</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {grouped.thisWeek.map((notif) => (
                      <NotificationCard 
                        key={notif._id || notif.id} 
                        notif={notif} 
                        getCategoryIcon={getCategoryIcon}
                        getCategoryBgClass={getCategoryBgClass}
                        onToggleRead={handleToggleReadStatus}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TIMEFRAME: EARLIER */}
              {grouped.earlier.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-slate-400 px-1 pt-2">
                    <CalendarDays size={13} className="text-slate-400" />
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Earlier</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {grouped.earlier.map((notif) => (
                      <NotificationCard 
                        key={notif._id || notif.id} 
                        notif={notif} 
                        getCategoryIcon={getCategoryIcon}
                        getCategoryBgClass={getCategoryBgClass}
                        onToggleRead={handleToggleReadStatus}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DEVELOPER SANDBOX PANEL */}
          <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Info size={16} className="text-lemon" />
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Notification Sandbox Controller</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <input 
                  id="sandbox-skel"
                  type="checkbox"
                  checked={sandboxForceSkeleton}
                  onChange={(e) => setSandboxForceSkeleton(e.target.checked)}
                  className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
                />
                <label htmlFor="sandbox-skel" className="cursor-pointer text-[11px]">Force Loading Skeletons</label>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <input 
                  id="sandbox-empty"
                  type="checkbox"
                  checked={sandboxForceEmptyList}
                  onChange={(e) => setSandboxForceEmptyList(e.target.checked)}
                  className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
                />
                <label htmlFor="sandbox-empty" className="cursor-pointer text-[11px]">Force Empty Lists</label>
              </div>

              <div className="flex items-center justify-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                <button
                  onClick={handleSimulateIncoming}
                  className="w-full py-1.5 bg-mint text-white text-[11px] font-bold rounded-lg cursor-pointer flex items-center justify-center space-x-1 shadow-sm shadow-mint/10 hover:bg-mint-hover transition-colors"
                >
                  <Plus size={12} />
                  <span>Simulate Incoming Alert</span>
                </button>
              </div>

              <div className="flex items-center justify-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                <button
                  onClick={handleResetSandboxList}
                  className="w-full py-1.5 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer hover:bg-slate-100 flex items-center justify-center space-x-1"
                >
                  <RefreshCw size={11} />
                  <span>Reset Database</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}

// Subcomponent: Reusable Notification Card
const NotificationCard = ({ notif, getCategoryIcon, getCategoryBgClass, onToggleRead, onDelete }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const timestamp = notif.timestamp || formatTime(notif.createdAt);
  const date = notif.date || formatDate(notif.createdAt);

  return (
    <div className={`p-4 border.5 rounded-2xl transition-all shadow-card flex items-start space-x-3.5 relative hover:border-slate-300 bg-white border-slate-200/70 hover:shadow-card-hover group ${
      !notif.isRead ? "border-l-4 border-l-mint" : ""
    }`}>
      
      {/* Category Icon Badge */}
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${getCategoryBgClass(notif.category)}`}>
        {getCategoryIcon(notif.category)}
      </div>

      {/* Info details */}
      <div className="flex-grow space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className={`text-xs ${!notif.isRead ? "font-bold text-primary-text" : "font-semibold text-slate-700"}`}>
            {notif.title}
          </h4>
          {!notif.isRead && (
            <span className="w-1.5 h-1.5 bg-mint rounded-full inline-block flex-shrink-0" title="Unread"></span>
          )}
          <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-slate-100 border border-slate-200/50 text-slate-500 tracking-wider">
            {notif.category}
          </span>
        </div>
        <p className="text-[11px] text-secondary-text leading-relaxed">
          {notif.message}
        </p>
        <div className="text-[9px] text-slate-400 font-medium pt-0.5">
          {timestamp} • {date}
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
        <button
          onClick={() => onToggleRead(notif._id || notif.id)}
          className="p-1.5 text-slate-400 hover:text-mint hover:bg-mint-light rounded-lg transition-colors cursor-pointer"
          title={notif.isRead ? "Mark as Unread" : "Mark as Read"}
        >
          {notif.isRead ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          onClick={() => onDelete(notif._id || notif.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Notification"
        >
          <Trash2 size={13} />
        </button>
      </div>
      
    </div>
  );
};

// CheckCircle2 backup declaration for toast
const CheckCircle2 = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
