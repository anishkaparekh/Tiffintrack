import { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, 
  Bell, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  ChevronRight,
  Inbox,
  Loader2,
  Search,
  Star,
  Heart,
  Clock,
  Compass,
  ArrowLeft
} from 'lucide-react';

// Import Reusable Components
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import NotificationCard from '../components/NotificationCard';
import OrderTable from '../components/OrderTable';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock Vendors Database
const initialVendors = [];

// Reusable Skeleton Loader Components

const VendorSkeleton = () => (
  <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card animate-pulse flex flex-col justify-between min-w-[280px] w-full h-[320px]">
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="h-5 bg-slate-200 rounded w-36"></div>
        <div className="h-6 bg-slate-200 rounded-full w-10"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>
      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-5 bg-slate-200 rounded-full w-12"></div>
        <div className="h-5 bg-slate-200 rounded-full w-16"></div>
      </div>
    </div>
    <div className="flex space-x-2 pt-2 border-t border-slate-100">
      <div className="h-9 bg-slate-200 rounded-xl flex-1"></div>
      <div className="h-9 bg-slate-200 rounded-xl flex-1"></div>
    </div>
  </div>
);

const ActivitySkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-slate-200/20">
        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          <div className="h-2 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [prevPath, setPrevPath] = useState(location.pathname);
  const [currentTab, setCurrentTab] = useState(() => {
    if (location.pathname === '/my-subscriptions') {
      return 'subscriptions';
    }
    if (location.pathname === '/track-orders') {
      return 'track_orders';
    }
    if (location.pathname === '/browse-vendors') {
      return 'vendors';
    }
    return 'dashboard';
  });

  // Adjust state when path changes (prevents set-state-in-effect warnings)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (location.pathname === '/my-subscriptions') {
      setCurrentTab('subscriptions');
    } else if (location.pathname === '/track-orders') {
      setCurrentTab('track_orders');
    } else if (location.pathname === '/browse-vendors') {
      setCurrentTab('vendors');
    } else if (location.pathname === '/customer-dashboard') {
      setCurrentTab('dashboard');
    }
  }

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const nextActivityId = useRef(4);

  const fetchApprovedVendors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendors`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(v => ({
            id: v._id,
            name: v.businessName || v.name || 'Vendor Kitchen',
            owner: v.name || 'Vendor Owner',
            area: v.city || 'Anand',
            locality: v.kitchenAddress || 'Anand',
            rating: 4.8,
            distance: 1.2,
            startingPrice: 120,
            mealType: "Veg",
            description: v.description || "Fresh homestyle specialties cooked daily.",
            categories: ["Gujarati Meals", "Family Plans"],
            status: v.verificationStatus || 'approved',
            plans: []
          }));
          setVendors(mapped);
        }
      }
    } catch (e) {
      console.error("Failed to fetch approved vendors:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Search & Filter States
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Developer Sandbox Controls
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyVendors, setEmptyVendors] = useState(false);
  const [emptySubscription, setEmptySubscription] = useState(false);
  const [emptyActivity, setEmptyActivity] = useState(false);

  // Authenticated User Settings
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: 'Flat 402, Green Meadows, Shastri Marg',
    city: 'Vallabh Vidyanagar',
    pincode: '388120'
  });

  const fetchCustomerSubscription = async (customerId) => {
    if (emptySubscription) {
      setSubscription(null);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/customer/${customerId}`);
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const activeSub = resData.data.find(sub => sub.status === 'Active' || sub.status === 'Paused');
          if (activeSub) {
            setSubscription({
              ...activeSub,
              nextDelivery: activeSub.status === 'Active' ? 'Tomorrow, 12:45 PM' : 'Suspended (Paused)'
            });
            return;
          }
        }
        setSubscription(null);
      }
    } catch (e) {
      console.error("Failed to fetch customer subscription:", e);
    }
  };

  // Payment History State
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const fetchPaymentHistory = async (cId) => {
    const token = localStorage.getItem('token');
    if (!token || !cId) return;
    try {
      setPaymentsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/payments/customer/${cId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          setPayments(resData.data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch payment history:", e);
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('customer_user');
    let customerId = "";
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setProfile(prev => ({
          ...prev,
          fullName: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          city: u.city || prev.city
        }));
        customerId = u._id || u.id || "";
      } catch (e) {
        console.error("Failed to parse customer_user from localStorage in CustomerDashboard:", e);
      }
    }
    fetchApprovedVendors();
    if (customerId) {
      fetchCustomerSubscription(customerId);
      fetchPaymentHistory(customerId);
      fetchCustomerLatestOrder(customerId);
    } else {
      setSubscription(null);
    }
  }, [emptySubscription]);

  // Saved Vendor IDs State
  const [savedVendorIds, setSavedVendorIds] = useState([1, 3, 5]);

  // Active Subscription State
  const [subscription, setSubscription] = useState(null);
  const [latestOrder, setLatestOrder] = useState(null);

  const fetchCustomerLatestOrder = async (customerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const latest = resData.data.find(o => o.status !== 'Cancelled') || resData.data[0];
          setLatestOrder(latest);
        } else {
          setLatestOrder(null);
        }
      }
    } catch (e) {
      console.error("Failed to fetch customer latest order:", e);
    }
  };

  // Recent Activity log state
  const [activities, setActivities] = useState([
    { id: 1, text: "You viewed Priya's Home Kitchen", time: "10 mins ago" },
    { id: 2, text: "You saved Healthy Meals Hub to favorites", time: "2 hours ago" },
    { id: 3, text: "Subscription renewed successfully", time: "2 days ago" }
  ]);

  // Order history state
  const [orders] = useState([
    { id: 1, date: 'June 09, 2026', mealType: 'Lunch (Roti, Dal, Rice, Bhindi)', vendor: "Priya's Home Kitchen", status: 'In Progress' },
    { id: 2, date: 'June 08, 2026', mealType: 'Dinner (Paneer Masala + Roti)', vendor: "Priya's Home Kitchen", status: 'Delivered' },
    { id: 3, date: 'June 08, 2026', mealType: 'Lunch (Roti, Dal, Rice, Aloo)', vendor: "Priya's Home Kitchen", status: 'Delivered' },
    { id: 4, date: 'June 07, 2026', mealType: 'Dinner (Veg Biryani + Raita)', vendor: "Priya's Home Kitchen", status: 'Delivered' },
    { id: 5, date: 'June 06, 2026', mealType: 'Lunch (Roti, Dal, Rice, Mix Veg)', vendor: "Priya's Home Kitchen", status: 'Delivered' },
  ]);

  // System Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Rahul Kumar dispatched your tiffin from Priya's Kitchen.", time: '15 mins ago', isRead: false },
    { id: 2, text: "Weekly menu changes submitted for Healthy Meals Hub.", time: '1 day ago', isRead: false },
    { id: 3, text: "Kathiyawadi Swad is offering 15% discount for Student budget plans.", time: '2 days ago', isRead: true },
  ]);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [message, setMessage] = useState(null);

  // Tab change loading simulation
  const handleTabChange = (tab) => {
    if (tab === 'subscriptions') {
      navigate('/my-subscriptions');
      return;
    }
    if (tab === 'track_orders') {
      navigate('/track-orders');
      return;
    }
    if (tab === 'addresses') {
      navigate('/customer/addresses');
      return;
    }
    if (tab === 'vendors') {
      navigate('/browse-vendors');
      return;
    }
    if (tab === 'history') {
      navigate('/order-history');
      return;
    }
    if (tab === 'settings') {
      navigate('/profile-settings');
      return;
    }
    if (tab === 'notifications') {
      navigate('/notifications');
      return;
    }
    setCurrentTab(tab);
    setIsLoading(true);
    setSelectedVendor(null); // Reset detail view when changing tabs
  };

  // Simulated initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Auto-clear success messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Favorites heart toggle
  const toggleSaveVendor = (vendorId) => {
    const isSaved = savedVendorIds.includes(vendorId);
    let newSaved;
    let vendor = vendors.find(v => v.id === vendorId);

    if (isSaved) {
      newSaved = savedVendorIds.filter(id => id !== vendorId);
      logActivity(`You removed ${vendor?.name || 'Vendor'} from saved list`);
    } else {
      newSaved = [...savedVendorIds, vendorId];
      logActivity(`You saved ${vendor?.name || 'Vendor'} to favorites`);
    }
    setSavedVendorIds(newSaved);
  };

  // Log activity helper
  const logActivity = (text) => {
    const newAct = {
      id: nextActivityId.current++,
      text,
      time: "Just now"
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Complete subscription handler
  const handleSubscribe = async (vendor, plan) => {
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
      customerId = "6a2c2ae16199858551b2db1a"; // Fallback customer ID
    }

    const payload = {
      customerId,
      vendorId: vendor.id,
      planId: plan.id || plan._id,
      startDate: new Date(),
      deliveryAddress: profile.address || "No Address Specified",
      preferences: []
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setSubscription({
          ...resData.data,
          nextDelivery: 'Tomorrow, 12:45 PM'
        });
        localStorage.setItem('tiffintrack_active_subscription', JSON.stringify(resData.data));
        setEmptySubscription(false);
        logActivity(`Subscribed to ${vendor.name} - ${plan.name}`);
        setMessage({
          type: 'success',
          text: `Subscription initiated! Welcome to ${vendor.name}. First delivery set for tomorrow.`
        });
        setCurrentTab('subscriptions');
        setSelectedVendor(null);
      } else {
        alert(resData.message || 'Failed to initiate subscription.');
      }
    } catch (err) {
      console.error("Failed to subscribe directly:", err);
      alert('An error occurred while creating the subscription.');
    }
  };

  // Pause/Resume subscription
  const handleToggleSubscription = async () => {
    if (!subscription) return;
    const isPaused = subscription.status === 'Paused';
    const newStatus = isPaused ? 'Active' : 'Paused';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/${subscription._id || subscription.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setSubscription({
            ...resData.data,
            nextDelivery: newStatus === 'Active' ? 'Tomorrow, 12:45 PM' : 'Suspended (Paused)'
          });
          logActivity(`${isPaused ? 'Resumed' : 'Paused'} subscription at ${subscription.vendorName}`);
          setMessage({
            type: 'success',
            text: `Subscription ${isPaused ? 'resumed' : 'paused'} successfully.`
          });
        }
      }
    } catch (e) {
      console.error("Failed to toggle subscription status:", e);
    }
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!subscription) return;
    const subId = subscription._id || subscription.id;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/${subId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          setSubscription(null);
          logActivity(`Cancelled subscription at ${subscription.vendorName}`);
          setMessage({
            type: 'success',
            text: "Subscription cancelled successfully. You will not be billed further."
          });
        }
      }
    } catch (e) {
      console.error("Failed to cancel subscription:", e);
    }
  };

  // Profile forms
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setTimeout(() => {
      setProfileSaving(false);
      setProfileMessage({ type: 'success', text: 'Settings updated successfully!' });
    }, 1200);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };



  const activeLoading = isLoading || forceLoadingState;

  // Marketplace filter calculations
  const filteredVendors = emptyVendors ? [] : vendors.filter(v => {
    // Only approved vendors are visible to customers
    if (v.status !== "Approved" && v.status !== "approved") return false;

    const matchesSearch = searchText ? (
      v.name.toLowerCase().includes(searchText.toLowerCase()) ||
      v.area.toLowerCase().includes(searchText.toLowerCase()) ||
      v.locality.toLowerCase().includes(searchText.toLowerCase()) ||
      v.mealType.toLowerCase().includes(searchText.toLowerCase()) ||
      v.description.toLowerCase().includes(searchText.toLowerCase())
    ) : true;
    
    const matchesCategory = selectedCategory !== 'All' ? (
      v.categories.includes(selectedCategory)
    ) : true;
    
    const matchesArea = selectedArea !== 'All' ? (
      v.area === selectedArea
    ) : true;

    return matchesSearch && matchesCategory && matchesArea;
  });

  const activeOrderDp = latestOrder?.deliveryPartnerId || null;
  const customerDashPartnerName = activeOrderDp ? activeOrderDp.name : "Rider Assignment Pending";
  const customerDashPartnerPhone = activeOrderDp ? activeOrderDp.phone : "N/A";
  const customerDashPartnerInitials = activeOrderDp ? customerDashPartnerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "DP";
  const customerDashPartnerVehicle = activeOrderDp ? `${activeOrderDp.vehicleType || ''} (${activeOrderDp.vehicleNumber || ''})` : "Searching for courier partner...";

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* App Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-35">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Sidebar Trigger */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-secondary-text hover:text-primary-text lg:hidden rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            
            {/* App Branding */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-primary-text tracking-tight">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>
            
            <span className="hidden md:inline-block h-4 w-[1px] bg-slate-200 mx-2"></span>
            <span className="hidden md:inline-block text-[10px] font-bold text-mint uppercase tracking-wider bg-mint-light px-2.5 py-0.5 rounded-full">
              Meal Subscription Marketplace
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Panel */}
            <div className="hidden xl:flex items-center space-x-4 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text">Mock Sandbox:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyVendors} 
                  onChange={(e) => setEmptyVendors(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Vendors</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptySubscription} 
                  onChange={(e) => setEmptySubscription(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Active Sub</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyActivity} 
                  onChange={(e) => setEmptyActivity(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Activity</span>
              </label>
            </div>

            {/* Notifications Shortcut */}
            <button 
              onClick={() => handleTabChange('notifications')}
              className="p-1.5 text-secondary-text hover:text-primary-text hover:bg-slate-100 rounded-lg relative cursor-pointer"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-mint border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Profile Avatar Trigger */}
            <button 
              onClick={() => handleTabChange('settings')}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-sm">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C'}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-primary-text group-hover:text-mint transition-colors">
                {profile.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Framework Grid */}
      <div className="flex-grow max-w-7xl mx-auto w-full flex flex-col lg:flex-row p-4 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={handleTabChange} 
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content Panel */}
        <main className="flex-grow lg:max-w-[calc(100%-17rem)] flex flex-col">
          
          {/* Dashboard Notifications and Banners */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start space-x-3 border shadow-sm transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-mint-light border-mint/20 text-mint' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              )}
              <span className="text-xs font-semibold flex-grow">{message.text}</span>
              <button 
                onClick={() => setMessage(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-bold focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: MAIN DISCOVERY MARKETPLACE DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Hero Header Section */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-card relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-mint/5 rounded-full pointer-events-none"></div>
                <div className="relative z-10 max-w-xl">
                  <span className="text-[10px] font-extrabold text-mint uppercase tracking-wider bg-mint-light px-2.5 py-1 rounded-md">
                    Daily Subscriptions Made Wholesome
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-primary-text mt-3 tracking-tight">
                    Find Fresh Home-Cooked Meals Near You 🍱
                  </h1>
                  <p className="text-xs md:text-sm text-secondary-text mt-2 leading-relaxed">
                    Discover trusted home chefs and clean tiffin providers in your area. Choose a plan that fits your diet, budget, and taste.
                  </p>
                  
                  {/* Hero Search Bar */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                      <input 
                        type="text"
                        placeholder="Search by vendor name, area, locality, or meal type..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTabChange('vendors');
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-snow border border-slate-200 rounded-xl text-xs text-primary-text focus:outline-none focus:border-mint placeholder-slate-400 font-medium shadow-inner"
                      />
                      {searchText && (
                        <button 
                          onClick={() => setSearchText('')}
                          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => handleTabChange('vendors')}
                      className="px-5 py-3 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer shadow-sm shadow-mint/10"
                    >
                      <Compass size={14} />
                      <span>Search Marketplace</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Nearby Vendors" 
                  value={activeLoading ? null : (emptyVendors ? "0 Vendors" : "25 Vendors")} 
                  subtext={emptyVendors ? "No kitchens servicing area" : "In Anand & Vidyanagar"}
                  icon={Compass}
                  isLoading={activeLoading}
                  accent={true}
                />
                <StatCard 
                  title="Active Subscriptions" 
                  value={activeLoading ? null : (emptySubscription || !subscription ? "0 Plans" : "1 Active Plan")}
                  subtext={emptySubscription || !subscription ? "Discover chefs below" : `With ${subscription.vendorName}`}
                  icon={Calendar}
                  isLoading={activeLoading}
                />
                <StatCard 
                  title="Today's Deliveries" 
                  value={activeLoading ? null : (emptySubscription || !subscription ? "0 Deliveries" : (subscription.status === 'Paused' ? "Suspended" : "1 Scheduled"))} 
                  subtext={emptySubscription || !subscription ? "No pending drop-offs" : (subscription.status === 'Paused' ? "Plan is paused" : "Est. arrival 12:45 PM")}
                  icon={Clock}
                  isLoading={activeLoading}
                />
                <StatCard 
                  title="Saved Vendors" 
                  value={activeLoading ? null : `${savedVendorIds.length} Saved`} 
                  subtext="Quick access favorites"
                  icon={Heart}
                  isLoading={activeLoading}
                />
              </div>

              {/* Today's Subscription Status Panel (Only shown if active subscription exists) */}
              {subscription && !emptySubscription && (
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-mint-light rounded-2xl text-mint flex-shrink-0">
                      <Utensils size={24} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-mint bg-mint-light px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active subscription
                        </span>
                        {subscription.status === 'Paused' && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Paused
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-primary-text mt-1.5">{subscription.planName}</h3>
                      <p className="text-xs text-secondary-text mt-1">
                        Chef: <span className="font-semibold text-primary-text">{subscription.vendorName}</span> • Next Tiffin: <span className="font-semibold text-primary-text">{subscription.nextDelivery}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleTabChange('track_orders')}
                      disabled={subscription.status === 'Paused'}
                      className="px-4 py-2.5 bg-mint hover:bg-mint-hover disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm flex-1 md:flex-none flex items-center justify-center space-x-2"
                    >
                      <MapPin size={12} />
                      <span>Track Delivery</span>
                    </button>
                    <button 
                      onClick={() => handleTabChange('subscriptions')}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer flex-1 md:flex-none flex items-center justify-center"
                    >
                      <span>Manage Subscription</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Featured Vendors Row */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-base font-bold text-primary-text">Featured Home Kitchens</h3>
                    <p className="text-[11px] text-secondary-text">Highly-rated tiffin providers preparing food near you.</p>
                  </div>
                  <button 
                    onClick={() => handleTabChange('vendors')}
                    className="text-xs font-bold text-mint hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Browse all</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Horizontal Scrolling Vendor Grid */}
                {activeLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <VendorSkeleton />
                    <VendorSkeleton />
                    <VendorSkeleton />
                  </div>
                ) : (
                  filteredVendors.length === 0 ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-10 shadow-card text-center flex flex-col items-center justify-center min-h-[220px]">
                      <Inbox size={32} className="text-slate-300 mb-2" />
                      <p className="text-xs text-primary-text font-bold">No Vendors Available</p>
                      <p className="text-[11px] text-secondary-text max-w-sm mt-1">There are no featured home kitchens matching your search. Try adjusting filters or searching a different area.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredVendors.slice(0, 3).map((vendor) => {
                        const isSaved = savedVendorIds.includes(vendor.id);
                        return (
                          <div 
                            key={vendor.id} 
                            className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card hover:shadow-card-hover hover:border-mint/20 transition-all duration-200 flex flex-col justify-between h-[320px] relative overflow-hidden group"
                          >
                            <div>
                              {/* Top card row */}
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                  vendor.mealType === 'Veg' 
                                    ? 'bg-mint-light text-mint border border-mint/10' 
                                    : vendor.mealType === 'Non-Veg' 
                                    ? 'bg-red-50 text-red-500 border border-red-100'
                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                }`}>
                                  {vendor.mealType}
                                </span>
                                <button 
                                  onClick={() => toggleSaveVendor(vendor.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer animate-none"
                                >
                                  <Heart size={18} fill={isSaved ? "#EF4444" : "none"} className={isSaved ? "text-red-500" : ""} />
                                </button>
                              </div>

                              <h4 className="text-sm font-extrabold text-primary-text group-hover:text-mint transition-colors">
                                {vendor.name}
                              </h4>
                              
                              {/* Rating & Distance */}
                              <div className="flex items-center space-x-2 text-[10px] text-secondary-text mt-1 font-semibold">
                                <span className="flex items-center text-amber-500">
                                  <Star size={10} fill="#F59E0B" className="mr-0.5" />
                                  {vendor.rating}
                                </span>
                                <span>•</span>
                                <span>{vendor.distance} km away</span>
                                <span>•</span>
                                <span>{vendor.locality}, {vendor.area}</span>
                              </div>

                              <p className="text-[11px] text-secondary-text mt-3 leading-relaxed line-clamp-2">
                                {vendor.description}
                              </p>

                              {/* Price tag */}
                              <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-between items-center text-[11px]">
                                <span className="text-secondary-text">Starting from:</span>
                                <span className="font-extrabold text-primary-text text-xs">₹{vendor.startingPrice}/meal</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 mt-4 pt-2 border-t border-slate-100">
                              <button 
                                onClick={() => navigate(`/vendor/${vendor.id}`)}
                                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                              >
                                View Vendor
                              </button>
                              <button 
                                onClick={() => navigate(`/vendor/${vendor.id}/plans`)}
                                className="flex-1 py-2 bg-mint hover:bg-mint-hover text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-mint/5"
                              >
                                View Plans
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>

              {/* Popular Categories Section */}
              <div>
                <h3 className="text-base font-bold text-primary-text mb-3">Popular Meal Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { name: 'Gujarati Meals', color: 'bg-amber-50 hover:bg-amber-100/70 text-amber-700 border-amber-150' },
                    { name: 'Jain Meals', color: 'bg-green-50 hover:bg-green-100/70 text-green-700 border-green-150' },
                    { name: 'Punjabi Meals', color: 'bg-red-50 hover:bg-red-100/70 text-red-700 border-red-150' },
                    { name: 'South Indian Meals', color: 'bg-indigo-50 hover:bg-indigo-100/70 text-indigo-700 border-indigo-150' },
                    { name: 'Healthy Diet Meals', color: 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 border-emerald-150' },
                    { name: 'Student Budget Meals', color: 'bg-sky-50 hover:bg-sky-100/70 text-sky-700 border-sky-150' },
                    { name: 'Family Plans', color: 'bg-purple-50 hover:bg-purple-100/70 text-purple-700 border-purple-150' },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        handleTabChange('vendors');
                      }}
                      className={`p-3 rounded-2xl border text-center font-bold text-[10px] md:text-xs transition-all duration-150 cursor-pointer shadow-sm flex items-center justify-center ${cat.color}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Areas Section */}
              <div>
                <h3 className="text-base font-bold text-primary-text mb-2">Commonly Searched Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {['Anand', 'Vallabh Vidyanagar', 'Nadiad', 'Ahmedabad', 'Vadodara', 'Rajkot', 'Bhavnagar'].map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        handleTabChange('vendors');
                      }}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-full transition-all duration-150 flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <MapPin size={12} className="text-mint" />
                      <span>{area}</span>
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                      setSelectedArea('All');
                      handleTabChange('vendors');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-mint hover:underline cursor-pointer"
                  >
                    Clear area filter
                  </button>
                </div>
              </div>

              {/* Split Content: Recent Activity & Customer Reviews */}
              <div className="grid md:grid-cols-12 gap-6">
                
                {/* Recent Activity Feed */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card md:col-span-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-primary-text mb-4 pb-3 border-b border-slate-100">Recent Activity Feed</h3>
                    {activeLoading ? (
                      <ActivitySkeleton />
                    ) : (
                      emptyActivity || activities.length === 0 ? (
                        <div className="text-center py-8">
                          <Inbox size={20} className="mx-auto text-slate-300 mb-2" />
                          <p className="text-[11px] text-secondary-text">No recent activity logged.</p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {activities.slice(0, 4).map((act) => (
                            <div key={act.id} className="flex items-center justify-between text-[11px] text-secondary-text">
                              <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-mint flex-shrink-0"></span>
                                <span className="font-semibold text-slate-700">{act.text}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-normal">{act.time}</span>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                  <button 
                    onClick={() => setActivities([])}
                    disabled={activities.length === 0}
                    className="w-full mt-6 py-2 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-300 text-slate-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Clear Logs
                  </button>
                </div>

                {/* Testimonials Customer Reviews */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card md:col-span-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-primary-text mb-4 pb-3 border-b border-slate-100">Customer Testimonials</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-snow rounded-xl border border-slate-150 text-[11px] leading-relaxed text-secondary-text">
                        <div className="flex items-center text-amber-500 mb-1.5">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="#F59E0B" />)}
                          <span className="text-[9px] font-bold text-slate-400 ml-2">Anand Customer</span>
                        </div>
                        "Subscribed to Priya Patel's Weekly Veg plan for my hostel. The food is absolutely non-greasy, tastes exactly like cooked by my mom, and deliveries are always on time! Wholesome choice."
                      </div>
                      
                      <div className="p-3 bg-snow rounded-xl border border-slate-150 text-[11px] leading-relaxed text-secondary-text">
                        <div className="flex items-center text-amber-500 mb-1.5">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="#F59E0B" />)}
                          <span className="text-[9px] font-bold text-slate-400 ml-2">Vidyanagar Professor</span>
                        </div>
                        "The Healthy Meals Hub salad thali changed my lunch routine. Low carb, premium quality, and super fresh. Marketplace makes it extremely easy to pause subscriptions during university holidays."
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center font-normal pt-4 mt-2">
                    Verified ratings audited via hygiene standards.
                  </div>
                </div>

              </div>

              {/* Payment History Section */}
              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-primary-text">Payment Transaction History</h3>
                    <p className="text-[11px] text-secondary-text">Your billing details, receipts, and order transaction status logs.</p>
                  </div>
                </div>

                {paymentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-mint mr-2" size={18} />
                    <span className="text-xs text-secondary-text">Loading transaction history...</span>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Inbox className="mx-auto mb-2 text-slate-300" size={32} />
                    <p className="text-xs font-semibold">No transactions found</p>
                    <p className="text-[10px] text-slate-400 mt-1">When you complete a plan purchase, transaction history will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="text-[10px] font-black text-slate-450 uppercase border-b border-slate-100 pb-2">
                          <th className="py-2 pr-4">Transaction ID</th>
                          <th className="py-2 pr-4">Order ID</th>
                          <th className="py-2 pr-4">Date</th>
                          <th className="py-2 pr-4">Amount</th>
                          <th className="py-2 pr-4">Gateway</th>
                          <th className="py-2 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {payments.map((pm) => (
                          <tr key={pm._id} className="hover:bg-slate-50/50">
                            <td className="py-3 pr-4 font-mono text-[10px] text-slate-600">{pm.transactionId}</td>
                            <td className="py-3 pr-4 font-mono text-[10px] text-slate-600">{pm.razorpayOrderId}</td>
                            <td className="py-3 pr-4 text-[11px] text-slate-500">
                              {new Date(pm.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 pr-4 text-mint font-extrabold">₹{pm.amount}</td>
                            <td className="py-3 pr-4 text-[11px]">{pm.paymentGateway}</td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                pm.paymentStatus === 'Success'
                                  ? 'bg-mint-light text-mint border border-mint/10'
                                  : 'bg-red-50 text-red-500 border border-red-100'
                              }`}>
                                {pm.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: BROWSE VENDORS MARKETPLACE DIRECTORY */}
          {currentTab === 'vendors' && (
            <div className="space-y-6">
              
              {/* If no selected vendor detail, show listing directory */}
              {!selectedVendor ? (
                <>
                  {/* Search Directory Filter Bar */}
                  <div className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-primary-text">Home Chef Marketplace</h3>
                        <p className="text-xs text-secondary-text">Browse and compare daily tiffin providers servicing your area.</p>
                      </div>

                      {/* Filter stats count */}
                      <span className="text-xs font-bold text-mint bg-mint-light px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                        {filteredVendors.length} Providers Found
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                      {/* Text Search input */}
                      <div className="relative sm:col-span-5">
                        <Search className="absolute left-3 top-3 text-slate-400" size={14} />
                        <input
                          type="text"
                          placeholder="Search kitchen name or keyword..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-snow border border-slate-200 rounded-xl text-xs text-primary-text focus:outline-none focus:border-mint font-medium placeholder-slate-400"
                        />
                      </div>

                      {/* Area Select */}
                      <div className="sm:col-span-2.5">
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full px-3 py-2 bg-snow border border-slate-200 rounded-xl text-xs text-primary-text focus:outline-none focus:border-mint font-medium"
                        >
                          <option value="All">All Locations</option>
                          {[...new Set(vendors.map(v => v.area).filter(Boolean))].sort().map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      {/* Category Select */}
                      <div className="sm:col-span-2.5">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-snow border border-slate-200 rounded-xl text-xs text-primary-text focus:outline-none focus:border-mint font-medium"
                        >
                          <option value="All">All Categories</option>
                          <option value="Gujarati Meals">Gujarati Meals</option>
                          <option value="Jain Meals">Jain Meals</option>
                          <option value="Punjabi Meals">Punjabi Meals</option>
                          <option value="South Indian Meals">South Indian Meals</option>
                          <option value="Healthy Diet Meals">Healthy Diet Meals</option>
                          <option value="Student Budget Meals">Student Budget Meals</option>
                          <option value="Family Plans">Family Plans</option>
                        </select>
                      </div>

                      {/* Clear Filters Button */}
                      <div className="sm:col-span-2">
                        <button
                          onClick={() => {
                            setSearchText('');
                            setSelectedCategory('All');
                            setSelectedArea('All');
                          }}
                          className="w-full py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Listings Grid */}
                  {activeLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <VendorSkeleton />
                      <VendorSkeleton />
                      <VendorSkeleton />
                    </div>
                  ) : (
                    filteredVendors.length === 0 ? (
                      <div className="bg-white border border-slate-200/50 rounded-3xl p-16 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
                        <Inbox size={48} className="text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-primary-text">No Vendors Available</h3>
                        <p className="text-xs text-secondary-text max-w-sm mt-1 mb-6 leading-relaxed">
                          We couldn't find any home kitchen tiffin providers matching your search filters in the local database.
                        </p>
                        <button
                          onClick={() => {
                            setSearchText('');
                            setSelectedCategory('All');
                            setSelectedArea('All');
                          }}
                          className="px-4 py-2 bg-mint text-white text-xs font-bold rounded-xl hover:bg-mint-hover transition-colors cursor-pointer"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredVendors.map((vendor) => {
                          const isSaved = savedVendorIds.includes(vendor.id);
                          return (
                            <div 
                              key={vendor.id} 
                              className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden group"
                            >
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                    vendor.mealType === 'Veg' 
                                      ? 'bg-mint-light text-mint border border-mint/10' 
                                      : vendor.mealType === 'Non-Veg' 
                                      ? 'bg-red-50 text-red-500 border border-red-100'
                                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                                  }`}>{vendor.mealType}</span>
                                  
                                  <button 
                                    onClick={() => toggleSaveVendor(vendor.id)}
                                    className="text-slate-350 hover:text-red-500 transition-colors cursor-pointer"
                                  >
                                    <Heart size={18} fill={isSaved ? "#EF4444" : "none"} className={isSaved ? "text-red-500" : ""} />
                                  </button>
                                </div>

                                <h4 className="text-sm font-extrabold text-primary-text group-hover:text-mint transition-colors mt-1">
                                  {vendor.name}
                                </h4>
                                
                                <div className="flex items-center space-x-2 text-[10px] text-secondary-text mt-1 font-semibold">
                                  <span className="flex items-center text-amber-500">
                                    <Star size={10} fill="#F59E0B" className="mr-0.5" />
                                    {vendor.rating}
                                  </span>
                                  <span>•</span>
                                  <span>{vendor.distance} km</span>
                                  <span>•</span>
                                  <span>{vendor.locality}, {vendor.area}</span>
                                </div>

                                <p className="text-[11px] text-secondary-text mt-3 leading-relaxed line-clamp-3">
                                  {vendor.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 mt-4">
                                  {vendor.categories.map((c) => (
                                    <span key={c} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div className="text-[11px]">
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Starts from</span>
                                  <span className="font-extrabold text-primary-text">₹{vendor.startingPrice}/meal</span>
                                </div>
                                <button
                                  onClick={() => navigate(`/vendor/${vendor.id}`)}
                                  className="px-3.5 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  View Details & Menu
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </>
              ) : (
                /* Selected Vendor Detailed Menu Sub-view */
                <div className="space-y-6">
                  
                  {/* Detailed Page Header */}
                  <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card">
                    <button
                      onClick={() => setSelectedVendor(null)}
                      className="inline-flex items-center space-x-2 text-xs font-bold text-secondary-text hover:text-primary-text cursor-pointer mb-5"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Marketplace Directory</span>
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-extrabold text-primary-text">{selectedVendor.name}</h2>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            selectedVendor.mealType === 'Veg' ? 'bg-mint-light text-mint' : 'bg-red-50 text-red-500'
                          }`}>{selectedVendor.mealType}</span>
                        </div>
                        <p className="text-xs text-secondary-text mt-1">
                          Managed by Home Chef: <span className="font-semibold text-primary-text">{selectedVendor.owner}</span> • Kitchen Locality: <span className="font-semibold text-primary-text">{selectedVendor.locality}, {selectedVendor.area}</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs">
                        <div className="text-right">
                          <span className="text-secondary-text block text-[9px] uppercase font-bold">Rating</span>
                          <span className="font-extrabold text-primary-text flex items-center justify-end text-sm">
                            <Star size={12} fill="#F59E0B" className="text-amber-500 mr-1" />
                            {selectedVendor.rating} / 5.0
                          </span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="text-right">
                          <span className="text-secondary-text block text-[9px] uppercase font-bold">Distance</span>
                          <span className="font-extrabold text-primary-text text-sm">{selectedVendor.distance} km away</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-secondary-text mt-4 leading-relaxed border-t border-slate-100 pt-4">
                      {selectedVendor.description}
                    </p>
                  </div>

                  {/* Plans & Subscriptions List */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-primary-text">Select Subscription Plan</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {selectedVendor.plans.map((plan) => (
                        <div 
                          key={plan.id}
                          className="bg-white border-2 border-slate-100 hover:border-mint/20 rounded-3xl p-6 shadow-card flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-base font-bold text-primary-text">{plan.name}</h4>
                              <span className="text-[10px] font-bold text-mint bg-mint-light px-2.5 py-1 rounded-md uppercase tracking-wider">
                                {plan.duration}
                              </span>
                            </div>
                            
                            <p className="text-xs text-secondary-text mt-1 font-semibold">Includes: {plan.details}</p>
                            <div className="h-6"></div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block uppercase">Price</span>
                              <span className="text-lg font-black text-primary-text">₹{plan.price}</span>
                            </div>
                            <button
                              onClick={() => handleSubscribe(selectedVendor, plan)}
                              className="px-4 py-2.5 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-mint/5"
                            >
                              Subscribe to Plan
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: MY ACTIVE SUBSCRIPTIONS */}
          {currentTab === 'subscriptions' && (
            <div className="space-y-6">
              
              {emptySubscription || !subscription ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <Calendar size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">No Active Subscription</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed">
                    You aren't subscribed to any home kitchen meal plans currently. Tap below to search nearby chefs and pick a plan.
                  </p>
                  <button
                    onClick={() => handleTabChange('vendors')}
                    className="px-5 py-3 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer shadow-sm shadow-mint/10"
                  >
                    Browse Local Vendors
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-6">
                  
                  {/* Active Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-wider px-2.5 py-1 bg-mint-light rounded-md border border-mint/10">
                        Subscribed Marketplace Plan
                      </span>
                      <h3 className="text-xl font-bold text-primary-text mt-2">{subscription.planName}</h3>
                      <p className="text-xs text-secondary-text mt-1">Prepared by chef: <span className="font-semibold text-primary-text">{subscription.vendorName}</span></p>
                    </div>

                    <div className="flex space-x-3 w-full sm:w-auto">
                      <button
                        onClick={handleToggleSubscription}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors duration-200 cursor-pointer border shadow-sm flex-1 sm:flex-none ${
                          subscription.status === 'Active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200/30'
                            : 'bg-mint-light hover:bg-mint-light/80 text-mint border-mint/10'
                        }`}
                      >
                        {subscription.status === 'Active' ? 'Pause Plan' : 'Resume Plan'}
                      </button>

                      <button
                        onClick={handleCancelSubscription}
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/20 font-bold text-xs transition-colors duration-205 cursor-pointer flex-1 sm:flex-none"
                      >
                        Cancel Plan
                      </button>
                    </div>
                  </div>

                  {/* Active Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    <div className="p-4 bg-snow border border-slate-200/40 rounded-2xl">
                      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block mb-1">Status</span>
                      <span className={`text-base font-bold ${
                        subscription.status === 'Active' ? 'text-mint' : 'text-amber-500'
                      }`}>{subscription.status}</span>
                    </div>

                    <div className="p-4 bg-snow border border-slate-200/40 rounded-2xl">
                      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block mb-1">Remaining Meals</span>
                      <span className="text-base font-bold text-primary-text">{subscription.mealsRemaining} Meals Left</span>
                    </div>

                    <div className="p-4 bg-snow border border-slate-200/40 rounded-2xl">
                      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block mb-1">Billing Value</span>
                      <span className="text-base font-bold text-primary-text">₹{subscription.price || subscription.planId?.price || 3200} / cycle</span>
                    </div>
                  </div>

                  {/* Status paused alert check */}
                  {subscription.status === 'Paused' && (
                    <div className="p-4 bg-amber-50 border border-amber-200/30 rounded-2xl text-amber-600 text-xs leading-relaxed flex items-start space-x-2.5">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Your subscription is paused.</strong> No daily tiffin daily boxes will be delivered until you tap \"Resume Plan\". You will not lose remaining meals while your account is suspended.
                      </span>
                    </div>
                  )}

                  {/* Calendar details */}
                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-bold text-primary-text">Delivery Calendar Schedule</h4>
                    <p className="text-xs text-secondary-text leading-relaxed">
                      Meal subscriptions default to active Monday through Friday. You can block or skip individual dates via the scheduling grid below.
                    </p>
                    <div className="border border-slate-200/60 rounded-2xl p-6 bg-snow text-center text-xs text-secondary-text">
                      [ Interactive Subscription Calendar - Skip and shift dates ]
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 4: TRACK ACTIVE ORDERS */}
          {currentTab === 'track_orders' && (
            <div className="space-y-6">
              
              {emptySubscription || !subscription || subscription.status === 'Paused' ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <MapPin size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">No Active Deliveries Today</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed">
                    There are no active dispatches today. Start a subscription or resume your paused plans to view courier status.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-6">
                  
                  {/* Courier Card details */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
                      <h3 className="text-base font-bold text-primary-text border-b border-slate-100 pb-3">Delivery Partner</h3>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 animate-pulse">
                          {customerDashPartnerInitials}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary-text">{customerDashPartnerName}</h4>
                          <span className="text-[10px] text-secondary-text block truncate max-w-[150px]">{customerDashPartnerVehicle}</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Mobile No:</span>
                          <span className="font-semibold text-primary-text">{customerDashPartnerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Tiffin Code:</span>
                          <span className="font-bold text-mint">TT-402</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Est. Delivery:</span>
                          <span className="font-bold text-primary-text">{subscription.nextDelivery}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Delivery Status:</span>
                          <span className={`font-bold ${latestOrder?.status === 'Delivered' ? 'text-mint' : 'text-amber-500'}`}>
                            {latestOrder?.status || 'Pending'}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setMessage({ type: 'success', text: `Calling Courier ${customerDashPartnerPhone}...` })}
                        className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm text-center"
                      >
                        Call Delivery Partner
                      </button>
                    </div>
                  </div>

                  {/* Tracking map details */}
                  <div className="lg:col-span-8">
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card h-full flex flex-col justify-between min-h-[350px]">
                      <div>
                        <h3 className="text-base font-bold text-primary-text border-b border-slate-100 pb-3">Live Map Overview</h3>
                        <p className="text-xs text-secondary-text mt-2 leading-relaxed">
                          Your tiffin box is departing from <span className="font-bold text-primary-text">{subscription.vendorName}</span> to your home at <span className="font-bold text-primary-text">{profile.address}</span>.
                        </p>
                      </div>

                      <div className="border border-slate-200 rounded-2xl bg-snow h-64 flex flex-col items-center justify-center text-xs text-secondary-text relative overflow-hidden my-4">
                        <MapPin size={32} className="text-mint animate-bounce mb-2" />
                        <span className="font-semibold text-slate-700">GPS Logistics Map Simulation</span>
                        <span className="text-[10px] mt-1 text-slate-400">Map updates live during delivery hours</span>
                      </div>

                      <div className="text-[10px] text-slate-400 text-center font-normal">
                        Packaging seal integrity and hygienic guidelines are logged before pickup.
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: ORDER HISTORY LOGS */}
          {currentTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <h3 className="text-lg font-bold text-primary-text mb-1">Order History Log</h3>
                <p className="text-xs text-secondary-text">Comprehensive record of all tiffin deliveries logged under your account.</p>
              </div>

              <OrderTable 
                orders={orders} 
                isLoading={activeLoading}
              />
            </div>
          )}

          {/* TAB 6: INBOX NOTIFICATIONS ALERTS */}
          {currentTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <div>
                  <h3 className="text-lg font-bold text-primary-text mb-1">Alert Notifications</h3>
                  <p className="text-xs text-secondary-text">Updates from home kitchen chefs and platform compliance.</p>
                </div>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])}
                    className="px-3 py-1.5 bg-red-50 text-red-650 rounded-xl text-[10px] font-bold hover:bg-red-100 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <Bell size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">Inbox Clear</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6">You have read all system alerts.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <NotificationCard 
                      key={notif.id}
                      text={notif.text}
                      time={notif.time}
                      isRead={notif.isRead}
                      isLoading={activeLoading}
                      onRead={() => handleMarkAsRead(notif.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PROFILE SETTINGS */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <h3 className="text-lg font-bold text-primary-text mb-1">Account & Delivery Settings</h3>
                <p className="text-xs text-secondary-text">Update your personal account credentials and delivery routes.</p>
              </div>

              <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card">
                {profileMessage && (
                  <div className="p-4 rounded-xl mb-6 bg-mint-light border border-mint/20 text-mint flex items-start space-x-2 text-xs font-semibold">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Phone Number
                      </label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        City
                      </label>
                      <input 
                        type="text" 
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="space-y-1 sm:col-span-8">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Delivery Address
                      </label>
                      <input 
                        type="text" 
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-4">
                      <label className="text-[10px] font-bold text-primary-text uppercase tracking-wider block">
                        Pincode
                      </label>
                      <input 
                        type="text" 
                        value={profile.pincode}
                        onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-snow border border-slate-200 rounded-xl text-xs md:text-sm text-primary-text focus:outline-none focus:border-mint"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="py-3 px-6 rounded-xl bg-mint hover:bg-mint-hover disabled:bg-mint/65 text-white font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    {profileSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving Profiles...</span>
                      </>
                    ) : (
                      <span>Save Profile Details</span>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Page Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs relative z-25 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
