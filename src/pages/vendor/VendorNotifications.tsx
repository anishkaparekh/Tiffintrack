import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import NotificationsFilterBar from '../../components/vendor/notifications/NotificationsFilterBar';
import NotificationStatsCard from '../../components/vendor/notifications/NotificationStatsCard';
import NotificationTimeline from '../../components/vendor/notifications/NotificationTimeline';
import ImportantAlertCard from '../../components/vendor/notifications/ImportantAlertCard';
import NotificationPreferencesCard from '../../components/vendor/notifications/NotificationPreferencesCard';
import EmptyState from '../../components/vendor/notifications/EmptyState';
import SkeletonLoader from '../../components/vendor/notifications/SkeletonLoader';

import { 
  mockNotificationsList, 
  defaultPreferences, 
  mockStatsData,
  mockPinnedAlerts
} from '../../data/notificationsMockData';

import { NotificationItem, NotificationPreferences } from '../../types/notifications';
import { Sparkles, CheckCircle, Bell, BellOff, X, Eye, Check, Archive, Trash2, ShieldAlert } from 'lucide-react';

export default function VendorNotifications() {
  // Main notification records state
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotificationsList);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Simulation/Sandbox States
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // View details drawer state
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Trigger Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // individual notification actions
  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    showToast('Notification marked as read.', 'success');
  };

  const handleMarkUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: false } : item))
    );
    showToast('Notification marked as unread.', 'info');
  };

  const handleDelete = (id: string) => {
    const itemToDelete = notifications.find(n => n.id === id);
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    showToast(`"${itemToDelete?.title || 'Notification'}" deleted successfully.`, 'error');
    if (activeNotification?.id === id) {
      setActiveNotification(null);
    }
  };

  const handleArchive = (id: string) => {
    const itemToArchive = notifications.find(n => n.id === id);
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    showToast(`"${itemToArchive?.title || 'Notification'}" archived to files.`, 'success');
    if (activeNotification?.id === id) {
      setActiveNotification(null);
    }
  };

  const handleViewDetails = (notification: NotificationItem) => {
    setActiveNotification(notification);
    // Mark as read automatically when viewing details if it was unread
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
      );
    }
  };

  // Bulk actions
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared.', 'error');
  };

  // Clear filters helper
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  // Simulator: Add custom order notification
  const handleSimulateNewOrder = () => {
    const randomId = `NOT-SIM-${Math.floor(Math.random() * 1000)}`;
    const newOrderNotification: NotificationItem = {
      id: randomId,
      category: 'order',
      title: '🚨 LIVE Simulation: New Order Received',
      message: `Order TT${Math.floor(Math.random() * 9000 + 1000)} created. Needs hot packaging within 30 minutes!`,
      timestamp: 'Just now',
      priority: 'High',
      read: false,
      pinned: true,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newOrderNotification, ...prev]);
    showToast('New simulated lunch order received!', 'success');
  };

  // Filter computation
  const filteredNotifications = useMemo(() => {
    if (isEmpty) return [];

    return notifications.filter((item) => {
      // 1. Search Query
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category Dropdown
      const matchesCategory = 
        selectedCategory === 'all' || 
        item.category === selectedCategory;

      // 3. Status Filter
      let matchesStatus = true;
      if (selectedStatus === 'unread') {
        matchesStatus = !item.read;
      } else if (selectedStatus === 'read') {
        matchesStatus = item.read;
      } else if (selectedStatus === 'high') {
        matchesStatus = item.priority === 'High';
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [notifications, searchQuery, selectedCategory, selectedStatus, isEmpty]);

  // Dynamic Statistics
  const dynamicStats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const highPriorityAlerts = notifications.filter((n) => n.priority === 'High').length;
    
    // Count today notifications (using timestamp indicators)
    const todayCount = notifications.filter((n) => {
      const ts = n.timestamp.toLowerCase();
      return ts.includes('minute') || ts.includes('hour') || ts.includes('today') || ts === 'just now';
    }).length;

    return { total, unread, highPriorityAlerts, todayCount };
  }, [notifications]);

  // Pinned alerts extraction for sidebar
  const pinnedAlerts = useMemo(() => {
    // Return order, subscription, and delivery notifications that are pinned
    return notifications
      .filter((n) => n.pinned)
      .map((n) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        message: n.message,
        priority: n.priority,
        timestamp: n.timestamp
      }));
  }, [notifications]);

  return (
    <DashboardLayout activeTab="notifications" onTabSelect={() => {}}>
      {/* 1. Operational Sandbox Toggles */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Interactive Sandbox Control</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Review page states instantly</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Toggle skeleton loaders or simulate new incoming alerts to check layout responsiveness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 w-full lg:w-auto justify-between lg:justify-start">
          {/* Loading Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-300">Loading Skeleton</span>
            <button
              onClick={() => setIsLoading(!isLoading)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isLoading ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isLoading ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>

          <div className="hidden sm:block w-[1px] h-6 bg-slate-700" />

          {/* Empty State Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-300">Empty State</span>
            <button
              onClick={() => setIsEmpty(!isEmpty)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isEmpty ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isEmpty ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>

          <div className="hidden sm:block w-[1px] h-6 bg-slate-700" />

          {/* Simulator Trigger */}
          <button
            onClick={handleSimulateNewOrder}
            className="px-3.5 py-1.5 bg-[#00B074] hover:bg-[#00B074]/90 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-all"
          >
            Simulate Alert
          </button>
        </div>
      </div>

      {/* 2. Page Content */}
      <div className="space-y-6">
        {/* Header Title Area */}
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Notifications</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Stay updated with orders, subscriptions, deliveries, and important business activities.
          </p>
        </div>

        {/* 3. Metrics Statistics */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <NotificationStatsCard stats={dynamicStats} />
        )}

        {/* 4. Filter Bar */}
        {!isLoading && (
          <NotificationsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
            unreadCount={dynamicStats.unread}
            totalCount={filteredNotifications.length}
          />
        )}

        {/* 5. Main Double Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Timeline Feed */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <SkeletonLoader type="feed" />
            ) : filteredNotifications.length === 0 ? (
              isEmpty || notifications.length === 0 ? (
                <EmptyState type="no_notifications" />
              ) : (
                <EmptyState type="no_search_results" onClearFilters={handleClearFilters} />
              )
            ) : (
              <NotificationTimeline
                notifications={filteredNotifications}
                onMarkRead={handleMarkRead}
                onMarkUnread={handleMarkUnread}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>

          {/* Right Column: Alerts & Preferences Sidebar widgets */}
          <div className="space-y-6">
            {/* Pinned Alerts */}
            {isLoading ? (
              <SkeletonLoader type="alerts" />
            ) : (
              pinnedAlerts.length > 0 && (
                <ImportantAlertCard
                  alerts={pinnedAlerts}
                  onSelectAlert={(id) => {
                    const alertItem = notifications.find(n => n.id === id);
                    if (alertItem) handleViewDetails(alertItem);
                  }}
                />
              )
            )}

            {/* Notification settings details */}
            {isLoading ? (
              <SkeletonLoader type="preferences" />
            ) : (
              <NotificationPreferencesCard preferences={preferences} />
            )}
          </div>
        </div>
      </div>

      {/* 6. View Details Drawer (Slide-Over Panel) */}
      {activeNotification && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setActiveNotification(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
          />

          {/* Drawer Body */}
          <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl relative z-10 flex flex-col justify-between border-l border-[#E5E7EB] animate-slideLeft">
            
            {/* Top Close Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                    Notification Details
                  </span>
                  {activeNotification.pinned && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B] bg-[#FFD200]/10 px-2 py-1 rounded-md flex items-center space-x-1">
                      <span>Pinned</span>
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setActiveNotification(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#1F2937] transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Detail Content */}
              <div className="space-y-4 pt-2">
                {/* Title */}
                <h2 className="text-base md:text-lg font-black text-[#1F2937] leading-snug">
                  {activeNotification.title}
                </h2>

                {/* Priority Badge Row */}
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Priority</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border inline-block mt-0.5 ${
                      activeNotification.priority === 'High' 
                        ? 'bg-red-50 text-[#DC2626] border-red-100' 
                        : activeNotification.priority === 'Medium'
                        ? 'bg-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/15'
                        : 'bg-blue-50 text-[#2563EB] border-blue-100'
                    }`}>
                      {activeNotification.priority} Level
                    </span>
                  </div>

                  <div className="w-[1px] h-6 bg-slate-200" />

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Created</span>
                    <span className="text-xs font-semibold text-slate-600 mt-0.5 block">
                      {activeNotification.timestamp}
                    </span>
                  </div>
                </div>

                {/* Main Message Block */}
                <div className="bg-[#F4F9F6] p-5 rounded-2xl border border-[#00B074]/10">
                  <p className="text-xs md:text-sm font-semibold text-[#1F2937] leading-relaxed">
                    {activeNotification.message}
                  </p>
                </div>

                {/* Quick Tips or Reminders box depending on category */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-start space-x-3">
                  <ShieldAlert className="text-[#00B074] shrink-0 mt-0.5" size={16} />
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-extrabold text-[#1F2937] uppercase">Operational Recommendation</h4>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {activeNotification.category === 'order' && "Review details in the Orders Management tab to prepare quantities and coordinate delivery partners."}
                      {activeNotification.category === 'subscription' && "Check expiring subscriptions to coordinate menus and renewals with customers."}
                      {activeNotification.category === 'delivery' && "Track dispatch progress and ensure meals are safely packaged before dispatch."}
                      {activeNotification.category === 'customer' && "Respond to customer reviews promptly to maintain positive relations and rating scores."}
                      {activeNotification.category === 'system' && "Review weekly insights regularly to track kitchen growth metrics."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Drawer */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                {/* Archive Button */}
                <button
                  onClick={() => handleArchive(activeNotification.id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all"
                >
                  <Archive size={14} />
                  <span>Archive</span>
                </button>

                {/* Mark as Unread / Read Toggle */}
                <button
                  onClick={() => {
                    if (activeNotification.read) {
                      handleMarkUnread(activeNotification.id);
                    } else {
                      handleMarkRead(activeNotification.id);
                    }
                    setActiveNotification(null);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all"
                >
                  <Check size={14} />
                  <span>{activeNotification.read ? "Mark as Unread" : "Mark as Read"}</span>
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(activeNotification.id)}
                className="w-full flex items-center justify-center space-x-1.5 py-3 bg-[#DC2626]/5 hover:bg-[#DC2626]/10 text-xs font-bold text-[#DC2626] rounded-xl transition-all"
              >
                <Trash2 size={14} />
                <span>Delete Notification</span>
              </button>

              <button
                onClick={() => setActiveNotification(null)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all text-center"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. Toast Alerts popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp bg-[#1F2937] text-white px-5 py-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center space-x-3 max-w-sm">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' 
              ? 'bg-[#00B074]/20 text-[#00B074]' 
              : toast.type === 'info' 
              ? 'bg-sky-500/20 text-sky-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <CheckCircle size={16} />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
        </div>
      )}

    </DashboardLayout>
  );
}
