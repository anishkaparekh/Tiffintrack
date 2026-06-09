import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, 
  Bell, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Utensils, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  ShieldAlert,
  Loader2
} from 'lucide-react';

// Import Reusable Components
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import NotificationCard from '../components/NotificationCard';
import OrderTable from '../components/OrderTable';

export default function CustomerDashboard() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle controls to show empty/loading states for review
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyOrders, setEmptyOrders] = useState(false);
  const [emptyNotifications, setEmptyNotifications] = useState(false);
  const [emptySubscription, setEmptySubscription] = useState(false);

  // Mock Data States
  const [profile, setProfile] = useState({
    fullName: 'Anishka Parekh',
    email: 'parekhanishka@gmail.com',
    phone: '9876543210',
    address: 'Flat 402, Green Meadows, Linking Road',
    city: 'Mumbai',
    pincode: '400054'
  });
  
  const [subscription, setSubscription] = useState({
    planName: 'Monthly Veg Plan',
    mealsRemaining: 18,
    status: 'Active', // 'Active', 'Paused', 'None'
    nextDelivery: 'Today, 12:45 PM',
    vendorName: 'Mama\'s Kitchen'
  });

  const [orders, setOrders] = useState([
    { id: 1, date: 'June 09, 2026', mealType: 'Lunch (Roti, Dal, Rice, Bhindi)', vendor: 'Mama\'s Kitchen', status: 'In Progress' },
    { id: 2, date: 'June 08, 2026', mealType: 'Dinner (Paneer Masala + Roti)', vendor: 'Mama\'s Kitchen', status: 'Delivered' },
    { id: 3, date: 'June 08, 2026', mealType: 'Lunch (Roti, Dal, Rice, Aloo Gobhi)', vendor: 'Mama\'s Kitchen', status: 'Delivered' },
    { id: 4, date: 'June 07, 2026', mealType: 'Dinner (Veg Biryani + Raita)', vendor: 'Mama\'s Kitchen', status: 'Delivered' },
    { id: 5, date: 'June 07, 2026', mealType: 'Lunch (Roti, Dal, Rice, Mix Veg)', vendor: 'Mama\'s Kitchen', status: 'Delivered' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your lunch is being prepared by Mama\'s Kitchen.', time: '10 mins ago', isRead: false },
    { id: 2, text: 'Subscription renewal due in 5 days (Monthly Veg Plan).', time: '2 hours ago', isRead: false },
    { id: 3, text: 'New menu available for next week. Review and update choices.', time: '1 day ago', isRead: true },
  ]);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Simulated initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // Handle Mark Notification as Read
  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  };

  // Toggle Subscription Pause/Resume
  const handleToggleSubscription = () => {
    setSubscription(prev => {
      const newStatus = prev.status === 'Active' ? 'Paused' : 'Active';
      return {
        ...prev,
        status: newStatus,
        nextDelivery: newStatus === 'Active' ? 'Today, 12:45 PM' : 'Suspended (Paused)'
      };
    });
  };

  // Profile Form Handler
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    
    setTimeout(() => {
      setProfileSaving(false);
      setProfileMessage({ type: 'success', text: 'Profile changes saved successfully!' });
    }, 1200);
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const activeLoading = isLoading || forceLoadingState;

  return (
    <div className="min-h-screen bg-snow text-primary-text font-sans flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu trigger */}
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
            <span className="hidden md:inline-block text-[11px] font-bold text-mint uppercase tracking-wider bg-mint-light px-2.5 py-0.5 rounded-full">
              Customer Portal
            </span>
          </div>

          {/* Right Top Header Options */}
          <div className="flex items-center space-x-4">
            {/* Interactive State Demo Controls (Aesthetic Toggle Switches) */}
            <div className="hidden lg:flex items-center space-x-4 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px]">
              <span className="font-bold text-secondary-text">Developer Sandbox:</span>
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
                  checked={emptyOrders} 
                  onChange={(e) => setEmptyOrders(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Orders</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyNotifications} 
                  onChange={(e) => setEmptyNotifications(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Notif</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptySubscription} 
                  onChange={(e) => setEmptySubscription(e.target.checked)} 
                  className="rounded border-slate-300 text-mint focus:ring-mint"
                />
                <span>No Sub</span>
              </label>
            </div>

            {/* Notification Icon & Badge */}
            <button 
              onClick={() => setCurrentTab('notifications')}
              className="p-1.5 text-secondary-text hover:text-primary-text hover:bg-slate-100 rounded-lg relative cursor-pointer"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.isRead).length > 0 && !emptyNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-mint rounded-full"></span>
              )}
            </button>

            {/* User Dropdown indicator */}
            <button 
              onClick={() => setCurrentTab('settings')}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-sm">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-primary-text group-hover:text-mint transition-colors">
                {profile.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-grow max-w-7xl mx-auto w-full flex flex-col lg:flex-row p-4 gap-6">
        
        {/* Navigation Sidebar Drawer */}
        <Sidebar 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Container Panel */}
        <main className="flex-grow lg:max-w-[calc(100%-17rem)] flex flex-col">
          
          {/* Welcome Banner */}
          <div className="mb-6">
            <h1 className="text-xl md:text-3xl font-extrabold text-primary-text tracking-tight">
              Good Morning, {profile.fullName.split(' ')[0]} 👋
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1 text-xs md:text-sm text-secondary-text gap-1">
              <p>Here's what's happening with your meal subscriptions today.</p>
              <p className="font-bold text-primary-text">{getFormattedDate()}</p>
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Summary Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                  title="Active Subscription" 
                  value={emptySubscription ? "No Active Plan" : subscription.planName} 
                  subtext={emptySubscription ? "Choose a plan to start" : `From ${subscription.vendorName}`}
                  icon={Utensils}
                  isLoading={activeLoading}
                  accent={true}
                />
                <StatCard 
                  title="Meals Remaining" 
                  value={emptySubscription ? "0 Meals" : `${subscription.mealsRemaining} Meals Left`}
                  subtext={emptySubscription ? "Top up to get meals" : "Valid for this cycle"}
                  icon={Calendar}
                  isLoading={activeLoading}
                />
                <StatCard 
                  title="Next Delivery" 
                  value={emptySubscription ? "--:--" : subscription.nextDelivery} 
                  subtext={emptySubscription ? "No scheduled delivery" : "Estimated at door"}
                  icon={MapPin}
                  isLoading={activeLoading}
                />
                <StatCard 
                  title="Subscription Status" 
                  value={emptySubscription ? "Inactive" : subscription.status} 
                  subtext={emptySubscription ? "No payments logged" : "Renewal due in 12 days"}
                  icon={ShieldAlert}
                  isLoading={activeLoading}
                />
              </div>

              {/* Split Content: Today's Menu & Live Status */}
              <div className="grid md:grid-cols-12 gap-6">
                
                {/* Today's Meals Menu Card */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card md:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                      <h3 className="text-base font-bold text-primary-text">Today's Menu Selection</h3>
                      <span className="text-[10px] font-bold text-mint bg-mint-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {emptySubscription ? "Inactive" : "Scheduled"}
                      </span>
                    </div>

                    {emptySubscription ? (
                      <div className="text-center py-6">
                        <Utensils size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-secondary-text">No meals scheduled for today. Subscriptions are inactive.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-snow rounded-xl border border-slate-200/20">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Breakfast (8:30 AM)</span>
                            <span className="text-xs md:text-sm font-semibold text-primary-text">Poha + Ginger Tea</span>
                          </div>
                          <span className="text-[10px] font-semibold text-secondary-text">Completed</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-snow rounded-xl border border-slate-200/20">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-mint block">Lunch (12:45 PM)</span>
                            <span className="text-xs md:text-sm font-semibold text-primary-text">Butter Roti (3), Dal Tadka, Jeera Rice, Bhindi Masala</span>
                          </div>
                          <span className="text-[10px] font-bold text-mint bg-mint-light px-2 py-0.5 rounded-full">Active</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-snow rounded-xl border border-slate-200/20">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Dinner (8:15 PM)</span>
                            <span className="text-xs md:text-sm font-semibold text-primary-text">Paneer Butter Masala + Phulka Roti (3)</span>
                          </div>
                          <span className="text-[10px] font-semibold text-secondary-text">Scheduled</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setCurrentTab('plans')}
                    className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary-text font-bold text-xs transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer border border-slate-200/20"
                  >
                    <span>Change Subscription Menu Choices</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {/* Delivery Status Progress Timeline Card */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card md:col-span-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-primary-text mb-4 pb-3 border-b border-slate-100">Live Delivery Tracking</h3>
                    
                    {emptySubscription ? (
                      <div className="text-center py-12">
                        <MapPin size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-secondary-text">No delivery tracking available today.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs">
                        {/* Timeline Step 1 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-mint text-white flex items-center justify-center text-[10px]">✓</div>
                            <div className="w-0.5 h-6 bg-mint"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-primary-text">Meal Prepared</h4>
                            <p className="text-[10px] text-secondary-text">Completed at 11:30 AM</p>
                          </div>
                        </div>

                        {/* Timeline Step 2 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-mint text-white flex items-center justify-center text-[10px]">✓</div>
                            <div className="w-0.5 h-6 bg-slate-200"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-primary-text">Packed & Sealed</h4>
                            <p className="text-[10px] text-secondary-text">Completed at 11:55 AM</p>
                          </div>
                        </div>

                        {/* Timeline Step 3 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full border border-slate-300 bg-white text-slate-400 flex items-center justify-center text-[10px]">•</div>
                            <div className="w-0.5 h-6 bg-slate-200"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-secondary-text">Out For Delivery</h4>
                            <p className="text-[10px] text-secondary-text font-normal">Dispatches shortly from kitchen</p>
                          </div>
                        </div>

                        {/* Timeline Step 4 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full border border-slate-300 bg-white text-slate-400 flex items-center justify-center text-[10px]">•</div>
                          </div>
                          <div>
                            <h4 className="font-bold text-secondary-text">Delivered</h4>
                            <p className="text-[10px] text-secondary-text font-normal">Expected by 12:45 PM</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!emptySubscription && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-secondary-text">Expected Arrival:</span>
                      <span className="font-bold text-mint">12:45 PM</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setCurrentTab('plans')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/50 p-4 rounded-2xl shadow-card transition-colors duration-200 text-center font-bold text-xs text-primary-text flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Utensils size={18} className="text-mint" />
                  <span>View Subscribed Menus</span>
                </button>
                
                <button 
                  onClick={() => setCurrentTab('track')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/50 p-4 rounded-2xl shadow-card transition-colors duration-200 text-center font-bold text-xs text-primary-text flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <MapPin size={18} className="text-mint" />
                  <span>Track Live Delivery</span>
                </button>

                <button 
                  onClick={() => setCurrentTab('mysub')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/50 p-4 rounded-2xl shadow-card transition-colors duration-200 text-center font-bold text-xs text-primary-text flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Calendar size={18} className="text-mint" />
                  <span>Manage Subscriptions</span>
                </button>

                <button 
                  onClick={() => setMessage({ type: 'success', text: `Contacting Vendor: Call +91-9898989898 (${subscription.vendorName})` })}
                  className="bg-white hover:bg-slate-50 border border-slate-200/50 p-4 rounded-2xl shadow-card transition-colors duration-200 text-center font-bold text-xs text-primary-text flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Phone size={18} className="text-mint" />
                  <span>Contact Home Chef</span>
                </button>
              </div>

              {/* Grid: Recent Orders & Notifications Preview */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Recent Orders table */}
                <div className="lg:col-span-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-primary-text">Recent Tiffin Orders</h3>
                    <button 
                      onClick={() => setCurrentTab('history')}
                      className="text-xs font-bold text-mint hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Full history</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <OrderTable 
                    orders={emptyOrders ? [] : orders} 
                    isLoading={activeLoading}
                    onReset={() => setEmptyOrders(false)}
                  />
                </div>

                {/* Notifications Preview */}
                <div className="lg:col-span-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-primary-text">Notifications</h3>
                    <button 
                      onClick={() => setCurrentTab('notifications')}
                      className="text-xs font-bold text-mint hover:underline cursor-pointer"
                    >
                      View all
                    </button>
                  </div>

                  {emptyNotifications ? (
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card text-center flex flex-col items-center justify-center min-h-[200px]">
                      <Inbox size={24} className="text-slate-300 mb-2" />
                      <p className="text-xs text-secondary-text">No active alerts found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.slice(0, 3).map((notif) => (
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
              </div>

            </div>
          )}

          {/* TAB 2: SUBSCRIPTION PLANS */}
          {currentTab === 'plans' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <h3 className="text-lg font-bold text-primary-text mb-2">Available Subscription Plans</h3>
                <p className="text-xs text-secondary-text">Select a clean package below to setup daily home-cooked deliveries.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Plan 1 */}
                <div className="bg-white border-2 border-slate-100 hover:border-mint/30 rounded-3xl p-6 shadow-card flex flex-col justify-between relative overflow-hidden transition-all duration-200">
                  <div className="absolute top-0 right-0 bg-lemon text-primary-text font-bold text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Popular
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-primary-text mb-1">Weekly Veg Subscription</h4>
                    <span className="text-xs text-mint font-semibold block mb-4">7 Days Plan</span>
                    <p className="text-xs text-secondary-text mb-6">
                      Perfect for a short test. Includes 1 standard lunch (Roti, Sabzi, Dal, Rice) and 1 light dinner meal daily.
                    </p>
                    <div className="text-2xl font-extrabold text-primary-text mb-6">
                      $45 <span className="text-xs text-secondary-text font-normal">/ week</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSubscription({
                        planName: 'Weekly Veg Subscription',
                        mealsRemaining: 7,
                        status: 'Active',
                        nextDelivery: 'Tomorrow, 12:45 PM',
                        vendorName: 'Mama\'s Kitchen'
                      });
                      setEmptySubscription(false);
                      setCurrentTab('mysub');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    Select Plan
                  </button>
                </div>

                {/* Plan 2 */}
                <div className="bg-white border-2 border-mint rounded-3xl p-6 shadow-card flex flex-col justify-between relative overflow-hidden transition-all duration-200">
                  <div className="absolute top-0 right-0 bg-mint text-white font-bold text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Best Value
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-primary-text mb-1">Monthly Veg Plan</h4>
                    <span className="text-xs text-mint font-semibold block mb-4">30 Days Plan</span>
                    <p className="text-xs text-secondary-text mb-6">
                      Our signature vegetable subscription. Prepared with low oil, fresh produce, and strictly sanitary conditions.
                    </p>
                    <div className="text-2xl font-extrabold text-primary-text mb-6">
                      $160 <span className="text-xs text-secondary-text font-normal">/ month</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSubscription({
                        planName: 'Monthly Veg Plan',
                        mealsRemaining: 30,
                        status: 'Active',
                        nextDelivery: 'Today, 12:45 PM',
                        vendorName: 'Mama\'s Kitchen'
                      });
                      setEmptySubscription(false);
                      setCurrentTab('mysub');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    Select Plan
                  </button>
                </div>

                {/* Plan 3 */}
                <div className="bg-white border-2 border-slate-100 hover:border-mint/30 rounded-3xl p-6 shadow-card flex flex-col justify-between relative overflow-hidden transition-all duration-200">
                  <div>
                    <h4 className="text-base font-bold text-primary-text mb-1">Monthly Non-Veg Plan</h4>
                    <span className="text-xs text-mint font-semibold block mb-4">30 Days Plan</span>
                    <p className="text-xs text-secondary-text mb-6">
                      Enjoy a balanced diet. Includes poultry/fish dishes 3 times a week, combined with light fresh veggies on other days.
                    </p>
                    <div className="text-2xl font-extrabold text-primary-text mb-6">
                      $190 <span className="text-xs text-secondary-text font-normal">/ month</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSubscription({
                        planName: 'Monthly Non-Veg Plan',
                        mealsRemaining: 30,
                        status: 'Active',
                        nextDelivery: 'Today, 12:45 PM',
                        vendorName: 'Mama\'s Kitchen'
                      });
                      setEmptySubscription(false);
                      setCurrentTab('mysub');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MY SUBSCRIPTION */}
          {currentTab === 'mysub' && (
            <div className="space-y-6">
              
              {emptySubscription ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <Calendar size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">No Active Subscription</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6">
                    You aren't subscribed to any home kitchen meal plans currently.
                  </p>
                  <button
                    onClick={() => setCurrentTab('plans')}
                    className="px-5 py-3 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-colors duration-200 cursor-pointer shadow-sm"
                  >
                    Browse Subscription Plans
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-6">
                  
                  {/* Subscription details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-wider px-2.5 py-1 bg-mint-light rounded-md">
                        Subscribed
                      </span>
                      <h3 className="text-xl font-bold text-primary-text mt-2">{subscription.planName}</h3>
                      <p className="text-xs text-secondary-text mt-1">Prepared by: <span className="font-semibold text-primary-text">{subscription.vendorName}</span></p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleToggleSubscription}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors duration-200 cursor-pointer border shadow-sm ${
                          subscription.status === 'Active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200/30'
                            : 'bg-mint-light hover:bg-mint-light/80 text-mint border-mint/10'
                        }`}
                      >
                        {subscription.status === 'Active' ? 'Pause Plan' : 'Resume Plan'}
                      </button>

                      <button
                        onClick={() => {
                          setEmptySubscription(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/20 font-bold text-xs transition-colors duration-200 cursor-pointer"
                      >
                        Cancel Plan
                      </button>
                    </div>
                  </div>

                  {/* Stat grids */}
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
                      <span className="text-[10px] font-bold text-secondary-text uppercase tracking-wider block mb-1">Billing Period</span>
                      <span className="text-base font-bold text-primary-text">30 Days (Monthly)</span>
                    </div>
                  </div>

                  {/* Pause notes alert */}
                  {subscription.status === 'Paused' && (
                    <div className="p-4 bg-amber-50 border border-amber-200/30 rounded-2xl text-amber-600 text-xs leading-relaxed flex items-start space-x-2.5">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Your subscription is paused.</strong> No meals will be prepared or delivered until you tap "Resume Plan". You will not lose any meals while your plan is suspended.
                      </span>
                    </div>
                  )}

                  {/* Calendar view placeholder */}
                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-bold text-primary-text">Delivery Calendar Schedule</h4>
                    <p className="text-xs text-secondary-text leading-relaxed">
                      Meal deliveries are active on weekdays (Monday - Friday) by default. You can pause specific single days by editing the calendar below.
                    </p>
                    <div className="border border-slate-200/60 rounded-2xl p-6 bg-snow text-center text-xs text-secondary-text">
                      [ Interactive Calendar Interface Mockup - Manage weekly schedules ]
                    </div>
                  </div>

                </div>
              )}
              
            </div>
          )}

          {/* TAB 4: TRACK DELIVERY */}
          {currentTab === 'track' && (
            <div className="space-y-6">
              
              {emptySubscription ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <MapPin size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">No Deliveries in Progress</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6">
                    Activate a subscription plan to track deliveries in real-time.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Courier Details */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card space-y-5">
                      <h3 className="text-base font-bold text-primary-text border-b border-slate-100 pb-3">Delivery Partner</h3>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          RK
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary-text">Rahul Kumar</h4>
                          <span className="text-[10px] text-secondary-text block">Express Logistics Courier</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Contact:</span>
                          <span className="font-semibold text-primary-text">+91-9999911111</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Delivery Code:</span>
                          <span className="font-bold text-mint">TT-402</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary-text">Expected:</span>
                          <span className="font-bold text-primary-text">12:45 PM</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setMessage({ type: 'success', text: 'Calling Courier +91-9999911111...' })}
                        className="w-full py-3 px-4 rounded-xl bg-mint hover:bg-mint-hover text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-sm text-center"
                      >
                        Call Delivery Partner
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Tracking Map Mockup */}
                  <div className="lg:col-span-8">
                    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 shadow-card h-full flex flex-col justify-between min-h-[350px]">
                      <div>
                        <h3 className="text-base font-bold text-primary-text border-b border-slate-100 pb-3">Live Tracking Map</h3>
                        <p className="text-xs text-secondary-text mt-2 leading-relaxed">
                          Your tiffin is currently departing from <span className="font-bold text-primary-text">{subscription.vendorName}</span> heading towards <span className="font-bold text-primary-text">{profile.address}</span>.
                        </p>
                      </div>

                      {/* Map Container Box Mockup */}
                      <div className="border border-slate-200 rounded-2xl bg-snow h-64 flex flex-col items-center justify-center text-xs text-secondary-text relative overflow-hidden my-4">
                        <MapPin size={32} className="text-mint animate-bounce mb-2" />
                        <span className="font-semibold">Simulated GPS Live Tracking Grid</span>
                        <span className="text-[10px] mt-1 text-slate-400">Map updates live in production</span>
                      </div>

                      <div className="text-[10px] text-secondary-text text-center">
                        Secure packaging & sanitation logs are verified prior to pickup.
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 5: ORDER HISTORY */}
          {currentTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <div>
                  <h3 className="text-lg font-bold text-primary-text mb-1">Order History Log</h3>
                  <p className="text-xs text-secondary-text">Comprehensive record of all tiffin meals received.</p>
                </div>
                <button
                  onClick={() => setEmptyOrders(!emptyOrders)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bold text-secondary-text hover:text-primary-text cursor-pointer"
                >
                  {emptyOrders ? "Load Orders" : "Simulate No Orders"}
                </button>
              </div>

              <OrderTable 
                orders={emptyOrders ? [] : orders} 
                isLoading={activeLoading}
                onReset={() => setEmptyOrders(false)}
              />
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {currentTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card">
                <div>
                  <h3 className="text-lg font-bold text-primary-text mb-1">Inbox Alerts</h3>
                  <p className="text-xs text-secondary-text">Platform updates regarding tiffin preparation and dispatch cycles.</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEmptyNotifications(!emptyNotifications)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bold text-secondary-text hover:text-primary-text cursor-pointer"
                  >
                    {emptyNotifications ? "Load Notifications" : "Simulate Empty State"}
                  </button>
                  {notifications.length > 0 && !emptyNotifications && (
                    <button 
                      onClick={() => setNotifications([])}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-100 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {notifications.length === 0 || emptyNotifications ? (
                <div className="bg-white border border-slate-200/50 rounded-3xl p-12 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
                    <Bell size={36} />
                  </div>
                  <h3 className="text-base font-bold text-primary-text mb-1">Inbox Clear</h3>
                  <p className="text-xs text-secondary-text max-w-sm mb-6">
                    You have read all notifications. There are no new subscription alerts at this time.
                  </p>
                  <button 
                    onClick={() => {
                      setNotifications([
                        { id: 1, text: 'Your lunch is being prepared by Mama\'s Kitchen.', time: 'Just now', isRead: false },
                        { id: 2, text: 'Subscription renewal due in 5 days (Monthly Veg Plan).', time: '1 hour ago', isRead: false }
                      ]);
                      setEmptyNotifications(false);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-primary-text hover:bg-slate-50 cursor-pointer"
                  >
                    Generate Test Notifications
                  </button>
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
                <p className="text-xs text-secondary-text">Configure personal information and tiffin delivery addresses.</p>
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

      {/* Global Footer Banner */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-secondary-text text-xs relative z-25 mt-8">
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
