import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Compass, CheckCircle, X } from 'lucide-react';
import VendorDeliveryLayout from '../../components/vendor/delivery/VendorDeliveryLayout';
import DeliveryStatsCard from '../../components/vendor/delivery/DeliveryStatsCard';
import AssignmentTable from '../../components/vendor/delivery/AssignmentTable';
import AssignmentModal from '../../components/vendor/delivery/AssignmentModal';
import EmptyState from '../../components/vendor/delivery/EmptyState';
import LoadingSkeleton from '../../components/vendor/delivery/LoadingSkeleton';
import NotificationBanner from '../../components/vendor/delivery/NotificationBanner';
import DeliveryAddressCard from '../../components/customer/addresses/DeliveryAddressCard';

import ActivityLogCard from '../../components/delivery/workflow/ActivityLogCard';
import NotificationCard from '../../components/delivery/workflow/NotificationCard';
import { ActivityLog, WorkflowNotification } from '../../components/delivery/workflow/DeliveryWorkflowProvider';

import { 
  DeliveryAssignment, 
  DeliveryPartner, 
  getStoredDeliveries, 
  saveDeliveries, 
  getStoredPartners, 
  savePartners 
} from '../../data/vendorDeliveryMockData';

export default function VendorDeliveryAssignments() {
  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>([]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<WorkflowNotification[]>([]);
  
  // Selection and Modal controls
  const [activeDelivery, setActiveDelivery] = useState<DeliveryAssignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDeliveryDetails, setViewingDeliveryDetails] = useState<DeliveryAssignment | null>(null);

  // Simulation Toggles
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Notifications alert banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const syncState = () => {
    setDeliveries(getStoredDeliveries());
    setPartners(getStoredPartners());
    
    const logsStr = localStorage.getItem('delivery_activity_logs');
    if (logsStr) setActivityLogs(JSON.parse(logsStr));
    
    const notifsStr = localStorage.getItem('delivery_workflow_notifications');
    if (notifsStr) setNotifications(JSON.parse(notifsStr));
  };

  useEffect(() => {
    syncState();
    window.addEventListener('storage', syncState);
    const interval = setInterval(syncState, 2000);

    return () => {
      window.removeEventListener('storage', syncState);
      clearInterval(interval);
    };
  }, []);

  // Compute metrics
  const stats = useMemo(() => {
    const total = deliveries.length;
    const assigned = deliveries.filter(d => d.status !== 'Pending Assignment').length;
    const unassigned = deliveries.filter(d => d.status === 'Pending Assignment').length;
    const activePartners = partners.filter(p => p.status === 'Active').length;

    return { total, assigned, unassigned, activePartners };
  }, [deliveries, partners]);

  // Handle Assign Click
  const handleAssignClick = (delivery: DeliveryAssignment) => {
    setActiveDelivery(delivery);
    setIsModalOpen(true);
  };

  // Perform Partner Selection and Save Assignment
  const handleSelectPartner = (partnerId: string) => {
    if (!activeDelivery) return;

    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return;

    const previousPartnerId = activeDelivery.assignedPartnerId;
    const isReassignment = previousPartnerId !== null && previousPartnerId !== partnerId;

    // 1. Update deliveries database
    const updatedDeliveries = deliveries.map(d => {
      if (d.id === activeDelivery.id) {
        return {
          ...d,
          status: 'Assigned' as const,
          assignedPartnerId: partner.id,
          assignedPartnerName: partner.name
        };
      }
      return d;
    });

    // 2. Adjust delivery partner workload counts
    const updatedPartners = partners.map(p => {
      let workload = p.todayDeliveriesCount;
      if (p.id === partnerId) {
        workload += 1;
      }
      if (previousPartnerId && p.id === previousPartnerId) {
        workload = Math.max(0, workload - 1);
      }
      return { ...p, todayDeliveriesCount: workload };
    });

    setDeliveries(updatedDeliveries);
    saveDeliveries(updatedDeliveries);
    setPartners(updatedPartners);
    savePartners(updatedPartners);

    // 3. Write Activity Log
    const logsStr = localStorage.getItem('delivery_activity_logs') || '[]';
    const logs = JSON.parse(logsStr);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = "Today, " + timeStr;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      orderId: activeDelivery.id,
      customerName: activeDelivery.customerName,
      status: 'Assigned',
      timestamp: dateStr,
      deliveryPartner: partner.name
    };
    localStorage.setItem('delivery_activity_logs', JSON.stringify([newLog, ...logs]));

    // 4. Write Notifications
    const notifsStr = localStorage.getItem('delivery_workflow_notifications') || '[]';
    const notifs = JSON.parse(notifsStr);
    const newNotif: WorkflowNotification = {
      id: `not-${Date.now()}`,
      title: isReassignment ? "Delivery Reassigned" : "New Delivery Assigned",
      message: isReassignment 
        ? `Delivery reassigned: Order ${activeDelivery.id} reassigned to ${partner.name}.`
        : `New delivery assigned: Order ${activeDelivery.id} assigned to ${partner.name}.`,
      type: 'info',
      role: 'delivery',
      timestamp: dateStr,
      isRead: false
    };
    localStorage.setItem('delivery_workflow_notifications', JSON.stringify([newNotif, ...notifs]));

    setIsModalOpen(false);
    setActiveDelivery(null);
    syncState();

    // Trigger Notification
    if (isReassignment) {
      triggerToast(`Delivery Reassigned: Order ${activeDelivery.id} reassigned to ${partner.name}.`, 'info');
    } else {
      triggerToast(`Delivery Assigned: Order ${activeDelivery.id} successfully assigned to ${partner.name}.`, 'success');
    }
  };

  // Remove Assignment Handler
  const handleRemoveAssignment = (id: string) => {
    const item = deliveries.find(d => d.id === id);
    if (!item) return;

    const assignedPartnerId = item.assignedPartnerId;

    // 1. Update deliveries
    const updatedDeliveries = deliveries.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'Pending Assignment' as const,
          assignedPartnerId: null,
          assignedPartnerName: null
        };
      }
      return d;
    });

    // 2. Update partner workload count
    const updatedPartners = partners.map(p => {
      if (assignedPartnerId && p.id === assignedPartnerId) {
        return { ...p, todayDeliveriesCount: Math.max(0, p.todayDeliveriesCount - 1) };
      }
      return p;
    });

    setDeliveries(updatedDeliveries);
    saveDeliveries(updatedDeliveries);
    setPartners(updatedPartners);
    savePartners(updatedPartners);

    // 3. Update logs
    const logsStr = localStorage.getItem('delivery_activity_logs') || '[]';
    const logs = JSON.parse(logsStr);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = "Today, " + timeStr;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      orderId: id,
      customerName: item.customerName,
      status: 'Pending Assignment',
      timestamp: dateStr,
      deliveryPartner: item.assignedPartnerName || 'Rahul Patel'
    };
    localStorage.setItem('delivery_activity_logs', JSON.stringify([newLog, ...logs]));

    syncState();
    triggerToast(`Assignment Removed: Order ${id} set back to Pending.`, 'info');
  };

  const handleViewDetails = (delivery: DeliveryAssignment) => {
    setViewingDeliveryDetails(delivery);
  };

  const activeDeliveriesList = isEmpty ? [] : deliveries;
  const activeLogsList = isEmpty ? [] : activityLogs;
  const activeNotifsList = isEmpty ? [] : notifications;

  return (
    <VendorDeliveryLayout activeTab="delivery-assignments">
      
      {/* Toast Alert popups */}
      {toastMessage && (
        <NotificationBanner 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Sandbox controller panel */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate order states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Instantly toggle skeleton loaders and empty lists to verify UI designs.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-300">Loading Skeletons</span>
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

          <div className="w-[1px] h-6 bg-slate-700" />

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
        </div>
      </div>

      {/* Header section */}
      <div>
        <h1 className="text-2xl font-black text-[#1F2937]">Delivery Assignments Queue</h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Assign daily warm thalis to your active partners and monitor delivery fulfillment in real-time.</p>
      </div>

      {/* Overview Cards */}
      {isLoading ? (
        <LoadingSkeleton type="stats" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DeliveryStatsCard 
            title="Today's Deliveries" 
            value={`${stats.total} Deliveries`}
            desc="Total lunch subscription thalis"
            icon={Compass}
            colorClass="bg-blue-50 border border-blue-100 text-blue-600"
          />
          <DeliveryStatsCard 
            title="Assigned Deliveries" 
            value={`${stats.assigned} Assigned`}
            desc="Riders dispatched with loads"
            icon={Compass}
            colorClass="bg-emerald-50 border border-emerald-100 text-emerald-600"
          />
          <DeliveryStatsCard 
            title="Unassigned Deliveries" 
            value={`${stats.unassigned} Pending`}
            desc="Awaiting rider selection"
            icon={Compass}
            colorClass="bg-amber-50 border border-amber-100 text-amber-600"
          />
          <DeliveryStatsCard 
            title="Active Delivery Partners" 
            value={`${stats.activePartners} Partners`}
            desc="On-duty delivery team size"
            icon={Compass}
            colorClass="bg-purple-50 border border-purple-100 text-purple-600"
          />
        </div>
      )}

      {/* Main Grid: Left is Table, Right is Logs & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <LoadingSkeleton type="table" count={6} />
          ) : activeDeliveriesList.length === 0 ? (
            <EmptyState type="assignments" />
          ) : (
            <AssignmentTable 
              deliveries={activeDeliveriesList} 
              onAssign={handleAssignClick} 
              onRemove={handleRemoveAssignment} 
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        {/* Right Sidebar: Activity Logs & Live Alerts */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Activity Logs widget */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Fulfillment Activity Log
            </h3>
            {isLoading ? (
              <LoadingSkeleton type="logs" count={2} />
            ) : activeLogsList.length === 0 ? (
              <EmptyState type="logs" />
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {activeLogsList.slice(0, 4).map(log => (
                  <ActivityLogCard key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>

          {/* Notifications widget */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Live Delivery Alerts
            </h3>
            {isLoading ? (
              <LoadingSkeleton type="logs" count={2} />
            ) : activeNotifsList.length === 0 ? (
              <EmptyState type="notifications" />
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {activeNotifsList.slice(0, 4).map(notif => (
                  <NotificationCard key={notif.id} notification={notif} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Assignment Dialog Modal */}
      {isModalOpen && (
        <AssignmentModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setActiveDelivery(null);
          }} 
          delivery={activeDelivery} 
          partners={partners} 
          onSelectPartner={handleSelectPartner} 
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
              📋 Delivery Address Details
            </h3>
            <DeliveryAddressCard
              customerName={viewingDeliveryDetails.customerName}
              deliveryAddress={viewingDeliveryDetails.deliveryAddress}
              landmark={viewingDeliveryDetails.landmark}
              deliveryInstructions={viewingDeliveryDetails.deliveryInstructions}
              assignedPartnerName={viewingDeliveryDetails.assignedPartnerName}
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

    </VendorDeliveryLayout>
  );
}
