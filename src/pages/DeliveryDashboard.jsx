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

  // Update Status Handlers
  const handleUpdateStatus = (id, newStatus, reason = null) => {
    // 1. Find delivery item
    const item = todayDeliveries.find(d => d.id === id);
    if (!item) return;

    // 2. Update list state
    setTodayDeliveries(prev => prev.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          status: newStatus,
          failReason: reason
        };
      }
      return d;
    }));

    // Synchronize back to shared localStorage database
    const saved = localStorage.getItem('vendor_deliveries');
    if (saved) {
      try {
        const deliveries = JSON.parse(saved);
        const updated = deliveries.map(d => {
          if (d.id === id) {
            let mappedStatus = d.status;
            if (newStatus === 'Picked Up') mappedStatus = 'Out for Delivery';
            else if (newStatus === 'Delivered') mappedStatus = 'Delivered';
            else if (newStatus === 'Failed') mappedStatus = 'Failed';
            
            return {
              ...d,
              status: mappedStatus,
              failReason: reason || undefined
            };
          }
          return d;
        });
        localStorage.setItem('vendor_deliveries', JSON.stringify(updated));

        // Create Activity Log
        const logsStr = localStorage.getItem('delivery_activity_logs') || '[]';
        const logs = JSON.parse(logsStr);
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const newLog = {
          id: `act-${Date.now()}`,
          orderId: id,
          customerName: item.customerName,
          status: newStatus === 'Picked Up' ? 'Out for Delivery' : newStatus,
          timestamp: "Today, " + timeStr,
          deliveryPartner: "Rahul Kumar"
        };
        localStorage.setItem('delivery_activity_logs', JSON.stringify([newLog, ...logs]));

        // Create notification
        const notifsStr = localStorage.getItem('delivery_workflow_notifications') || '[]';
        const notifs = JSON.parse(notifsStr);
        const customerMsg = newStatus === 'Picked Up' 
          ? `🚴 Your tiffin is on the way.` 
          : newStatus === 'Delivered' 
          ? `❤️ Your homemade meal has arrived.` 
          : `⚠️ Delivery attempt failed: ${reason || 'Customer Unavailable'}.`;

        const newNotif = {
          id: `not-${Date.now()}`,
          title: newStatus === 'Picked Up' ? 'Tiffin On The Way' : newStatus === 'Delivered' ? 'Meal Arrived' : 'Delivery Failed',
          message: customerMsg,
          type: newStatus === 'Delivered' ? 'success' : newStatus === 'Failed' ? 'error' : 'info',
          role: 'customer',
          timestamp: "Today, " + timeStr,
          isRead: false
        };
        localStorage.setItem('delivery_workflow_notifications', JSON.stringify([newNotif, ...notifs]));
      } catch (e) {
        console.error(e);
      }
    }

    if (newStatus === 'Delivered') {
      showToast(`Order ${id} marked as Delivered! Warm thali served.`, 'success');
      
      // Move to completed history
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      const newHistoryItem = {
        id: item.id,
        customerName: item.customerName,
        date: formattedDate,
        meal: item.mealType,
        status: 'Delivered',
        address: item.address
      };
      
      setHistoryList(prev => [newHistoryItem, ...prev]);
      
      // Log success notification
      const newNotif = {
        id: `nt-del-${Date.now()}`,
        category: 'success',
        message: `Delivery completed successfully: ${item.id} for ${item.customerName}.`,
        timestamp: 'Just now',
        isRead: false
      };
      setNotifications(prev => [newNotif, ...prev]);

    } else if (newStatus === 'Picked Up') {
      showToast(`Order ${id} Picked Up from vendor kitchen.`, 'info');
    } else if (newStatus === 'Failed') {
      showToast(`Order ${id} delivery failed: ${reason}.`, 'error');
      
      // Log unavailable notification
      const newNotif = {
        id: `nt-del-${Date.now()}`,
        category: 'unavailable',
        message: `Delivery failed: Customer unavailable at ${item.address} (${item.customerName}).`,
        timestamp: 'Just now',
        isRead: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Google Maps Placeholder Navigation Trigger
  const handleNavigate = (delivery) => {
    setActiveNavigation(delivery);
  };

  // Notification Mark Read Handler
  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    showToast('Alert marked as read.', 'info');
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
              <span>Welcome Back, Rahul 👋</span>
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
          <Sparkles size={16} className="text-[#FFD200]" />
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
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingDeliveryDetails(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full p-1"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-extrabold text-[#1F2937] border-b border-slate-100 pb-3 mb-4">
              📋 Delivery Location Details
            </h3>
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
            <div className="pt-4 mt-2 flex justify-end">
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
