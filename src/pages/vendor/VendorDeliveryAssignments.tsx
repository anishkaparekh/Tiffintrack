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

  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // 1. Fetch Today's Deliveries
      const dResponse = await fetch('/api/v1/deliveries/vendor/today', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (dResponse.ok) {
        const resData = await dResponse.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped: DeliveryAssignment[] = resData.data.map((d: any) => {
            const customer = d.customerId || {};
            const partner = d.deliveryPartnerId || {};
            const subscription = d.subscriptionId || {};
            
            let mappedStatus: DeliveryAssignment['status'] = 'Pending Assignment';
            if (d.status === 'pending') mappedStatus = 'Pending Assignment';
            else if (d.status === 'assigned') mappedStatus = 'Assigned';
            else if (d.status === 'picked_up') mappedStatus = 'Preparing';
            else if (d.status === 'out_for_delivery') mappedStatus = 'Out for Delivery';
            else if (d.status === 'delivered') mappedStatus = 'Delivered';
            else if (d.status === 'failed') mappedStatus = 'Failed';

            return {
              id: d._id,
              customerName: customer.name || 'Customer',
              customerPhone: customer.phone || '',
              mealName: subscription.planName || 'Veg Warm Thali',
              deliveryAddress: subscription.deliveryAddress || d.deliveryAddress || 'Anand, Gujarat',
              landmark: subscription.landmark || '',
              deliveryInstructions: subscription.preferences ? subscription.preferences.join(', ') : '',
              deliveryTime: d.deliveryTime || subscription.deliveryTime || '12:30 PM',
              status: mappedStatus,
              assignedPartnerId: partner._id || null,
              assignedPartnerName: partner.name || null
            };
          });
          setDeliveries(mapped);
        }
      }
      
      // 2. Fetch Active Partners
      const pResponse = await fetch('/api/v1/deliveries/vendor/partners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (pResponse.ok) {
        const resData = await pResponse.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mappedPartners = resData.data.map((p: any) => ({
            id: p.id || p.deliveryPartnerId || p._id,
            name: p.name,
            phone: p.phone,
            email: p.email,
            vehicleType: p.vehicleType || 'Bike',
            deliveryZones: p.deliveryZones || [RAJKOT_ZONES[0], RAJKOT_ZONES[1]],
            status: p.status || 'Active',
            todayDeliveriesCount: p.activeDeliveriesCount || 0
          }));
          setPartners(mappedPartners);
        }
      }

      // 3. Fetch Notifications & Activity Logs
      const notifResponse = await fetch('/api/v1/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (notifResponse.ok) {
        const resData = await notifResponse.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mappedNotifs = resData.data
            .filter((n: any) => n.category === 'DELIVERY')
            .map((n: any) => ({
              id: n._id,
              title: n.title,
              message: n.message,
              type: n.type === 'success' ? ('success' as const) : ('info' as const),
              role: 'vendor' as const,
              timestamp: new Date(n.createdAt).toLocaleTimeString(),
              isRead: n.isRead
            }));
          setNotifications(mappedNotifs);
          
          // Generate activity logs based on delivery-related notifications
          const mappedLogs = resData.data
            .filter((n: any) => n.category === 'DELIVERY' && n.title.includes('Delivery'))
            .map((n: any) => ({
              id: n._id,
              orderId: n.message.match(/subscription\s([a-f\d]{24})/i)?.[1] || 'Fulfillment',
              customerName: n.message.includes('to ') ? n.message.split('to ')[1].split(' has')[0] : 'Customer',
              status: n.title.includes('Completed') ? 'Delivered' : 'Failed',
              timestamp: new Date(n.createdAt).toLocaleTimeString(),
              deliveryPartner: 'Delivery Staff'
            }));
          setActivityLogs(mappedLogs);
        }
      }
    } catch (err) {
      console.error("Failed to sync deliveries dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics
  const stats = useMemo(() => {
    const total = deliveries.length;
    const assigned = deliveries.filter(d => d.status !== 'Pending Assignment').length;
    const unassigned = deliveries.filter(d => d.status === 'Pending Assignment').length;
    const activePartners = partners.filter(p => p.status === 'Active' || p.status === 'active').length;

    return { total, assigned, unassigned, activePartners };
  }, [deliveries, partners]);

  // Handle Assign Click
  const handleAssignClick = (delivery: DeliveryAssignment) => {
    setActiveDelivery(delivery);
    setIsModalOpen(true);
  };

  // Perform Partner Selection and Save Assignment
  const handleSelectPartner = async (partnerId: string) => {
    if (!activeDelivery) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/deliveries/${activeDelivery.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryPartnerId: partnerId })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const partnerName = partners.find(p => p.id === partnerId)?.name || 'Rider';
        triggerToast(`Delivery assigned to ${partnerName} successfully!`, 'success');
        setIsModalOpen(false);
        setActiveDelivery(null);
        fetchDeliveries();
      } else {
        triggerToast(resData.message || 'Failed to assign delivery partner.', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Connection error', 'error');
    }
  };

  // Remove Assignment Handler
  const handleRemoveAssignment = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/deliveries/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryPartnerId: null })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        triggerToast(`Assignment removed successfully.`, 'info');
        fetchDeliveries();
      } else {
        triggerToast(resData.message || 'Failed to remove assignment.', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Connection error', 'error');
    }
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
          <p className="text-[#C2410C] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#C2410C]" />
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
                isLoading ? 'bg-[#F59E0B]' : 'bg-slate-600'
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
                isEmpty ? 'bg-[#F59E0B]' : 'bg-slate-600'
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
