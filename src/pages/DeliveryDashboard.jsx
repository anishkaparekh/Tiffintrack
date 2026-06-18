import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bike, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Compass,
  MapPin,
  Bell,
  User,
  Settings,
  Sparkles,
  RefreshCw,
  Plus,
  Info,
  X,
  Navigation,
  History
} from 'lucide-react';

// Import Reusable Components
import DeliveryLayout from '../components/delivery/DeliveryLayout';
import DeliveryStatsCard from '../components/delivery/DeliveryStatsCard';
import DeliveryTable from '../components/delivery/DeliveryTable';
import CustomerDeliveryInfo from '../components/customer/addresses/CustomerDeliveryInfo';
import DeliveryHistoryCard from '../components/delivery/DeliveryHistoryCard';
import DeliveryNotificationCard from '../components/delivery/DeliveryNotificationCard';
import EmptyState from '../components/delivery/EmptyState';
import LoadingSkeleton from '../components/delivery/LoadingSkeleton';
import StatusUpdateModal from '../components/delivery/workflow/StatusUpdateModal';

// Import Mock Data
import { 
  initialDeliveries, 
  completedDeliveries, 
  deliveryNotifications, 
  deliveryProfile 
} from '../data/deliveryMockData';

export default function DeliveryDashboard({ defaultTab = 'dashboard' }) {
  const location = useLocation();

  // Core tab state
  const [currentTab, setCurrentTab] = useState(defaultTab);

  // Sync tab state with route props if path changes
  useEffect(() => {
    if (location.pathname.includes('/history')) {
      setCurrentTab('history');
    } else if (location.pathname.includes('/notifications')) {
      setCurrentTab('notifications');
    } else if (location.pathname.includes('/profile')) {
      setCurrentTab('profile');
    } else {
      setCurrentTab(defaultTab);
    }
  }, [location.pathname, defaultTab]);

  const fetchAssignedOrders = async (partnerId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch Today's Active Deliveries
      const todayResponse = await fetch('/api/v1/deliveries/delivery-partner/deliveries/today', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      let activeDeliveries = [];
      if (todayResponse.ok) {
        const resData = await todayResponse.json();
        if (resData.success && Array.isArray(resData.data)) {
          activeDeliveries = resData.data.map(d => {
            const customer = d.customerId || {};
            const vendor = d.vendorId || {};
            const subscription = d.subscriptionId || {};
            const meal = d.mealId || {};

            let mappedStatus = 'Pending';
            if (d.status === 'assigned' || d.status === 'pending') mappedStatus = 'Pending';
            else if (d.status === 'picked_up' || d.status === 'out_for_delivery') mappedStatus = 'Picked Up';
            else if (d.status === 'delivered') mappedStatus = 'Delivered';
            else if (d.status === 'failed') mappedStatus = 'Failed';

            return {
              id: d._id,
              customerName: customer.name || "Customer",
              customerPhone: customer.phone || "+91 98765 00111",
              mealType: subscription.planName || meal.mealName || "Standard Tiffin Meal",
              address: subscription.deliveryAddress || d.deliveryAddress || "Anand, Gujarat",
              latitude: subscription.latitude || d.latitude,
              longitude: subscription.longitude || d.longitude,
              landmark: d.landmark || "Near City Center",
              deliveryInstructions: d.notes || subscription.preferences?.join(', ') || "Deliver carefully.",
              timeSlot: d.deliveryTime || subscription.deliveryTime || "12:30 PM - 1:00 PM",
              status: mappedStatus,
              failReason: d.notes || "",
              notes: d.notes || "",
              vendorName: vendor.businessName || vendor.name || "Chef Kitchen",
              vendorPhone: vendor.phone || "+91 98765 00222",
              vendorAddress: vendor.kitchenAddress || "Vendor Kitchen Address",
              rawDelivery: d
            };
          });
        }
      }

      // Fetch History Deliveries
      const historyResponse = await fetch('/api/v1/deliveries/delivery-partner/deliveries/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      let completedDeliveriesList = [];
      if (historyResponse.ok) {
        const resData = await historyResponse.json();
        if (resData.success && Array.isArray(resData.data)) {
          completedDeliveriesList = resData.data.map(d => {
            const customer = d.customerId || {};
            const vendor = d.vendorId || {};
            const subscription = d.subscriptionId || {};
            const meal = d.mealId || {};

            let mappedStatus = 'Delivered';
            if (d.status === 'delivered') mappedStatus = 'Delivered';
            else if (d.status === 'failed') mappedStatus = 'Failed';

            return {
              id: d._id,
              customerName: customer.name || "Customer",
              customerPhone: customer.phone || "+91 98765 00111",
              mealType: subscription.planName || meal.mealName || "Standard Tiffin Meal",
              address: subscription.deliveryAddress || d.deliveryAddress || "Anand, Gujarat",
              latitude: subscription.latitude || d.latitude,
              longitude: subscription.longitude || d.longitude,
              landmark: d.landmark || "Near City Center",
              deliveryInstructions: d.notes || subscription.preferences?.join(', ') || "Deliver carefully.",
              timeSlot: d.deliveryTime || subscription.deliveryTime || "12:30 PM - 1:00 PM",
              status: mappedStatus,
              failReason: d.notes || "",
              notes: d.notes || "",
              vendorName: vendor.businessName || vendor.name || "Chef Kitchen",
              vendorPhone: vendor.phone || "+91 98765 00222",
              vendorAddress: vendor.kitchenAddress || "Vendor Kitchen Address",
              rawDelivery: d
            };
          });
        }
      }

      setTodayDeliveries(activeDeliveries);
      setHistoryList(completedDeliveriesList);
    } catch (e) {
      console.error("Failed to fetch assigned deliveries:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPartnerNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(notif => {
            let cat = 'update';
            if (notif.category === 'DELIVERY') {
              if (notif.title.includes('Assigned')) cat = 'assignment';
              else if (notif.title.includes('Delivered')) cat = 'success';
              else cat = 'update';
            } else if (notif.type === 'error') {
              cat = 'unavailable';
            }
            
            const timeAgo = notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Just now';

            return {
              id: notif._id || notif.id,
              category: cat,
              message: notif.message,
              timestamp: `Today, ${timeAgo}`,
              isRead: notif.isRead
            };
          });
          setNotifications(mapped);
        }
      }
    } catch (e) {
      console.error("Failed to fetch partner notifications:", e);
    }
  };

  // Load actual user session details
  useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_delivery_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const pId = u._id || u.id;
        setProfile(prev => ({
          ...prev,
          id: pId || prev.id,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          vehicleType: u.vehicleType || prev.vehicleType,
          vehicleNumber: u.vehicleNumber || prev.vehicleNumber,
        }));
        if (pId) {
          fetchAssignedOrders(pId);
          fetchPartnerNotifications();
        }
      } catch (e) {
        console.error("Failed to parse delivery partner from localStorage:", e);
      }
    }
  }, []);

  // Operational State
  const [todayDeliveries, setTodayDeliveries] = useState(initialDeliveries);
  const [historyList, setHistoryList] = useState(completedDeliveries);
  const [notifications, setNotifications] = useState(deliveryNotifications);
  const [profile, setProfile] = useState(deliveryProfile);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [activeNavigation, setActiveNavigation] = useState(null);
  const [viewingDeliveryDetails, setViewingDeliveryDetails] = useState(null);
  const [toast, setToast] = useState(null);

  // Status Modal States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalParams, setStatusModalParams] = useState(null); // { id, newStatus, customerName }

  // Sandbox Override States
  const [sandboxForceSkel, setSandboxForceSkel] = useState(false);
  const [sandboxForceEmpty, setSandboxForceEmpty] = useState(false);

  // Helper trigger to show custom toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Status prompt and confirm wrappers
  const promptUpdateStatus = (id, newStatus, reason = null) => {
    const item = todayDeliveries.find(d => d.id === id);
    if (!item) return;
    setStatusModalParams({ id, newStatus, customerName: item.customerName });
    setShowStatusModal(true);
  };

  const confirmUpdateStatus = (reason = null) => {
    if (!statusModalParams) return;
    const { id, newStatus } = statusModalParams;
    handleUpdateStatus(id, newStatus, reason);
    setShowStatusModal(false);
    setStatusModalParams(null);
  };

  const handleUpdateStatus = async (id, newStatus, reason = null) => {
    const item = todayDeliveries.find(d => d.id === id);
    if (!item) return;

    let backendStatus = 'picked_up';
    if (newStatus === 'Picked Up') {
      backendStatus = 'picked_up';
    } else if (newStatus === 'Delivered') {
      backendStatus = 'delivered';
    } else if (newStatus === 'Failed') {
      backendStatus = 'failed';
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/deliveries/delivery-partner/deliveries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: backendStatus,
          notes: reason ? `Attempt failed: ${reason}` : (item.notes || '')
        })
      });

      if (response.ok) {
        if (profile.id) {
          await fetchAssignedOrders(profile.id);
        }
        
        if (newStatus === 'Delivered') {
          showToast(`Delivery ${id} marked as Delivered! Warm thali served.`, 'success');
        } else if (newStatus === 'Picked Up') {
          showToast(`Delivery ${id} Picked Up from vendor kitchen.`, 'info');
        } else if (newStatus === 'Failed') {
          showToast(`Delivery ${id} failed: ${reason || 'Customer Unavailable'}.`, 'error');
        }
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Failed to update delivery status.', 'error');
      }
    } catch (e) {
      console.error("Failed to update delivery status via API:", e);
      showToast('Connection error. Failed to update status.', 'error');
    }
  };

  // Google Maps Navigation Trigger
  const handleNavigate = (delivery) => {
    if (!delivery) return;
    if (delivery.latitude && delivery.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${delivery.latitude},${delivery.longitude}`, '_blank');
    } else {
      const destination = encodeURIComponent(delivery.address || '');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }
  };

  // Notification Mark Read Handler
  const handleMarkNotificationRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        await fetchPartnerNotifications();
        showToast('Alert marked as read.', 'info');
      }
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  // Sandbox simulations
  const handleSimulateNewAssignment = () => {
    const randomNum = Math.floor(Math.random() * 9000 + 1000);
    const mockCustomers = [
      { name: "Sneha Nair", address: "Plot 89, VIP Road, Anand", meal: "Gujarati Lunch Thali" },
      { name: "Vikram Sen", address: "Flat 102, Shivalik residency, Vidyanagar", meal: "Punjabi Veg Deluxe" },
      { name: "Divya Patel", address: "15, Mangal Jyot Society, Anand", meal: "Satvik Regular Plan" }
    ];
    
    const picked = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
    const newId = `OD-${randomNum}`;

    const newDelivery = {
      id: newId,
      customerName: picked.name,
      mealType: picked.meal,
      address: picked.address,
      timeSlot: "2:00 PM - 2:30 PM",
      status: "Pending",
      notes: "Ring bell twice, deliver to first floor."
    };

    setTodayDeliveries(prev => [newDelivery, ...prev]);

    // Push alert
    const newAlert = {
      id: `nt-del-${Date.now()}`,
      category: "assignment",
      message: `New delivery assigned: ${newId} for ${picked.name}.`,
      timestamp: "Just Now",
      isRead: false
    };
    setNotifications(prev => [newAlert, ...prev]);

    showToast(`New simulated delivery assigned: ${newId}`, 'success');
  };

  const handleResetSandbox = () => {
    setTodayDeliveries(initialDeliveries);
    setHistoryList(completedDeliveries);
    setNotifications(deliveryNotifications);
    setProfile(deliveryProfile);
    setSandboxForceSkel(false);
    setSandboxForceEmpty(false);
    showToast("Restored original delivery databases.");
  };

  // Statistics Computations
  const stats = useMemo(() => {
    const todayRuns = todayDeliveries.length;
    
    // Count completed (delivered today + completed history)
    const completedCount = historyList.length;
    
    // Count pending (status is Pending or Picked Up)
    const pendingCount = todayDeliveries.filter(d => d.status === 'Pending' || d.status === 'Picked Up').length;
    
    // Count failed
    const failedCount = todayDeliveries.filter(d => d.status === 'Failed').length;

    return {
      todayTotal: todayRuns,
      completed: completedCount,
      pending: pendingCount,
      failed: failedCount
    };
  }, [todayDeliveries, historyList]);

  // Derived loading/empty states
  const showSkeleton = isLoading || sandboxForceSkel;
  const isDeliveriesEmpty = sandboxForceEmpty || todayDeliveries.length === 0;
  const isHistoryEmpty = sandboxForceEmpty || historyList.length === 0;
  const isNotifsEmpty = sandboxForceEmpty || notifications.length === 0;

  return (
    <DeliveryLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      
      {/* Toast Alert Popup */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 animate-slideUp px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : toast.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-100'
            : 'bg-blue-50 text-blue-800 border-blue-100'
        }`}>
          <div className={`p-1 rounded-lg ${
            toast.type === 'success' ? 'text-emerald-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
          }`}>
            <CheckCircle size={16} />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
        </div>
      )}

      {/* Main Dashboard Layout */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Welcome Intro Section */}
          <div className="pb-2">
            <h1 className="text-2xl font-black text-primary-text tracking-tight flex items-center space-x-2">
              <span>Welcome Back, {profile.name ? profile.name.split(' ')[0] : 'Partner'} 👋</span>
            </h1>
            <p className="text-xs md:text-sm text-secondary-text mt-1">
              Deliver homemade happiness, one meal at a time.
            </p>
          </div>

          {/* Metrics stats */}
          {showSkeleton ? (
            <LoadingSkeleton type="stats" />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <DeliveryStatsCard 
                title="Today's Deliveries" 
                value={`${stats.todayTotal} Deliveries`} 
                desc="Assigned for today's run"
                icon={Bike}
                colorClass="bg-blue-50 border border-blue-100 text-blue-600"
              />
              <DeliveryStatsCard 
                title="Completed Deliveries" 
                value={`${stats.completed} Completed`} 
                desc="Delivered to doorstep"
                icon={CheckCircle}
                colorClass="bg-emerald-50 border border-emerald-100 text-emerald-600"
              />
              <DeliveryStatsCard 
                title="Pending Deliveries" 
                value={`${stats.pending} Pending`} 
                desc="Remaining to serve"
                icon={Clock}
                colorClass="bg-amber-50 border border-amber-100 text-amber-600"
              />
              <DeliveryStatsCard 
                title="Failed Deliveries" 
                value={`${stats.failed} Failed`} 
                desc="Customer unavailable"
                icon={AlertTriangle}
                colorClass="bg-red-50 border border-red-100 text-red-600"
              />
            </div>
          )}

          {/* Double Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Main column - Today's Pending deliveries */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin size={15} className="text-mint" />
                  <span>Assigned Deliveries Queue</span>
                </h3>
                <button 
                  onClick={() => setCurrentTab('deliveries')}
                  className="text-[10px] font-bold text-mint hover:underline"
                >
                  View full queue
                </button>
              </div>

              {showSkeleton ? (
                <LoadingSkeleton type="table" />
              ) : isDeliveriesEmpty ? (
                <EmptyState type="deliveries" />
              ) : (
                <DeliveryTable 
                  deliveries={todayDeliveries} 
                  onNavigate={handleNavigate}
                  onViewDetails={setViewingDeliveryDetails}
                  onUpdateStatus={promptUpdateStatus}
                />
              )}
            </div>

            {/* Right column - Alerts & History widgets */}
            <div className="space-y-6">
              {/* Notifications Widget */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center space-x-1.5 px-1">
                  <Bell size={15} className="text-mint" />
                  <span>Recent Security Alerts</span>
                </h3>

                {showSkeleton ? (
                  <LoadingSkeleton type="notifications" />
                ) : isNotifsEmpty ? (
                  <EmptyState type="notifications" message="No urgent alerts logged today." />
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 2).map((notif) => (
                      <DeliveryNotificationCard 
                        key={notif.id} 
                        notification={notif}
                        onMarkRead={handleMarkNotificationRead}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* History Widget */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center space-x-1.5 px-1">
                  <History size={15} className="text-mint" />
                  <span>Recent History Logs</span>
                </h3>

                {showSkeleton ? (
                  <LoadingSkeleton type="history" />
                ) : isHistoryEmpty ? (
                  <EmptyState type="history" message="No runs completed recently." />
                ) : (
                  <div className="space-y-3">
                    {historyList.slice(0, 3).map((item) => (
                      <DeliveryHistoryCard 
                        key={item.id} 
                        record={item}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Tab Page */}
      {currentTab === 'deliveries' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-primary-text">Today's Deliveries Queue</h1>
            <p className="text-xs text-secondary-text mt-0.5">Manage your daily pickups, drops, and customer directions.</p>
          </div>

          {showSkeleton ? (
            <LoadingSkeleton type="table" />
          ) : isDeliveriesEmpty ? (
            <EmptyState type="deliveries" />
          ) : (
            <DeliveryTable 
              deliveries={todayDeliveries} 
              onNavigate={handleNavigate}
              onViewDetails={setViewingDeliveryDetails}
              onUpdateStatus={promptUpdateStatus}
            />
          )}
        </div>
      )}

      {/* History Tab Page */}
      {currentTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-primary-text">Fulfillment History</h1>
            <p className="text-xs text-secondary-text mt-0.5">Search and inspect your past delivered or failed packages.</p>
          </div>

          {showSkeleton ? (
            <LoadingSkeleton type="history" />
          ) : isHistoryEmpty ? (
            <EmptyState type="history" message="Your delivery history log is empty." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {historyList.map((item) => (
                <DeliveryHistoryCard 
                  key={item.id} 
                  record={item}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab Page */}
      {currentTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-primary-text">Partner Alerts</h1>
              <p className="text-xs text-secondary-text mt-0.5">Keep track of new delivery assignments and instructions.</p>
            </div>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <button 
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  showToast('All alerts marked as read.', 'info');
                }}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {showSkeleton ? (
            <LoadingSkeleton type="notifications" />
          ) : isNotifsEmpty ? (
            <EmptyState type="notifications" />
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <DeliveryNotificationCard 
                  key={notif.id} 
                  notification={notif}
                  onMarkRead={handleMarkNotificationRead}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab Page */}
      {currentTab === 'profile' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-primary-text">Partner Profile Settings</h1>
            <p className="text-xs text-secondary-text mt-0.5">Manage your personal credentials, contact info, and vehicle registry details.</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card max-w-2xl">
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-xl">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-primary-text">{profile.name}</h3>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{profile.role}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs leading-relaxed font-semibold">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Tiffin Vendor</span>
                <span className="text-primary-text block">{profile.assignedVendor}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined Platform</span>
                <span className="text-primary-text block">{profile.joinedDate}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                <span className="text-primary-text block">{profile.phone}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-primary-text block">{profile.email}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Registration Number</span>
                <span className="text-primary-text block bg-slate-100 px-2.5 py-1 rounded w-fit text-[11px] font-black tracking-wide border border-slate-200/40 mt-1">
                  {profile.vehicleNumber}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Vehicle Category Type</span>
                <span className="text-primary-text block">{profile.vehicleType}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER SANDBOX CONTROL PANEL */}
      <div className="bg-white border border-slate-200/60 p-5 rounded-3xl shadow-card space-y-4 max-w-6xl">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Sparkles size={16} className="text-[#C2410C]" />
          <h3 className="text-xs font-bold text-primary-text uppercase tracking-wider">Delivery Agent Sandbox Controller</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
          <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <input 
              id="skel-del"
              type="checkbox"
              checked={sandboxForceSkel}
              onChange={(e) => setSandboxForceSkel(e.target.checked)}
              className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
            />
            <label htmlFor="skel-del" className="cursor-pointer text-[11px]">Force Skeletons</label>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <input 
              id="empty-del"
              type="checkbox"
              checked={sandboxForceEmpty}
              onChange={(e) => setSandboxForceEmpty(e.target.checked)}
              className="w-4 h-4 text-mint border-slate-300 rounded focus:ring-mint cursor-pointer"
            />
            <label htmlFor="empty-del" className="cursor-pointer text-[11px]">Force Empty Lists</label>
          </div>

          <button 
            onClick={handleSimulateNewAssignment}
            className="py-2.5 bg-mint/10 hover:bg-mint/20 text-mint text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1 border border-mint/10 transition-colors"
          >
            <Plus size={12} />
            <span>Simulate Delivery</span>
          </button>

          <button 
            onClick={handleResetSandbox}
            className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1 transition-colors"
          >
            <RefreshCw size={12} />
            <span>Reset Sandbox</span>
          </button>
        </div>
      </div>

      {/* STATUS UPDATE CONFIRMATION MODAL */}
      {statusModalParams && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setStatusModalParams(null);
          }}
          orderId={statusModalParams.id}
          customerName={statusModalParams.customerName}
          targetStatus={statusModalParams.newStatus}
          onConfirm={confirmUpdateStatus}
        />
      )}

      {/* Detailed Address Modal */}
      {viewingDeliveryDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingDeliveryDetails(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full p-1"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-extrabold text-[#1F2937] border-b border-slate-100 pb-3 mb-4">
              📋 Route Details (Pickup & Dropoff)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Column */}
              <div>
                <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mb-2">Customer Dropoff</h4>
                <CustomerDeliveryInfo
                  customerName={viewingDeliveryDetails.customerName}
                  phone={viewingDeliveryDetails.customerPhone || "+91 98765 00111"}
                  address={viewingDeliveryDetails.address}
                  landmark={viewingDeliveryDetails.landmark}
                  deliveryInstructions={viewingDeliveryDetails.deliveryInstructions}
                  onNavigate={() => {
                    setViewingDeliveryDetails(null);
                    handleNavigate(viewingDeliveryDetails);
                  }}
                />
              </div>

              {/* Vendor Column */}
              <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {viewingDeliveryDetails.vendorName ? viewingDeliveryDetails.vendorName.charAt(0).toUpperCase() : 'V'}
                      </div>
                      <div>
                        <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Vendor</h4>
                        <span className="text-sm font-extrabold text-[#1F2937]">{viewingDeliveryDetails.vendorName || "Priya's Home Kitchen"}</span>
                      </div>
                    </div>
                    
                    <a 
                      href={`tel:${viewingDeliveryDetails.vendorPhone || "+91 99741 00222"}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-650/10 border border-blue-600/10 text-blue-600 rounded-xl text-xs font-bold transition-all"
                    >
                      <Phone size={13} />
                      <span>Call Vendor</span>
                    </a>
                  </div>

                  <div className="space-y-4 text-xs text-slate-650 font-semibold leading-relaxed mt-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin size={15} className="text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Kitchen Address</span>
                        <span className="text-[#1F2937] leading-normal block">{viewingDeliveryDetails.vendorAddress || "12, Shastri Marg, Anand"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setViewingDeliveryDetails(null);
                      handleNavigate({ address: viewingDeliveryDetails.vendorAddress || "12, Shastri Marg, Anand" });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Navigation size={14} fill="white" />
                    <span>Navigate to Kitchen</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingDeliveryDetails(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE MAPS PLACEHOLDER OVERLAY MODAL */}
      {activeNavigation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-center space-y-4">
            
            {/* Top Close */}
            <button 
              onClick={() => setActiveNavigation(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full p-1"
            >
              <X size={16} />
            </button>

            {/* Icon Banner */}
            <div className="w-16 h-16 rounded-full bg-mint-light text-mint flex items-center justify-center mx-auto animate-bounce">
              <Navigation size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-primary-text">Opening Google Maps Navigation...</h3>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto leading-relaxed">
                Loading driving routes to:
                <span className="block text-primary-text font-bold mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {activeNavigation.address}
                </span>
              </p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setActiveNavigation(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Close Navigation
              </button>
            </div>
          </div>
        </div>
      )}

    </DeliveryLayout>
  );
}
