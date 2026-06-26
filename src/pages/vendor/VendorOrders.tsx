import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import OrderStatsCard from '../../components/vendor/orders/OrderStatsCard';
import PriorityOrderCard from '../../components/vendor/orders/PriorityOrderCard';
import OrdersFilterBar from '../../components/vendor/orders/OrdersFilterBar';
import OrdersTable from '../../components/vendor/orders/OrdersTable';
import OrderDetailsDrawer from '../../components/vendor/orders/OrderDetailsDrawer';
import DeliveryScheduleCard from '../../components/vendor/orders/DeliveryScheduleCard';
import OrderPerformanceCard from '../../components/vendor/orders/OrderPerformanceCard';
import EmptyState from '../../components/vendor/orders/EmptyState';
import SkeletonLoader from '../../components/vendor/orders/SkeletonLoader';

import { 
  mockOrdersList, 
  mockDeliverySchedule, 
  mockOrderPerformance,
  mockOrderStats
} from '../../data/ordersMockData';

import { OrderItem, OrderStatus } from '../../types/orders';
import { Sparkles, BarChart, CheckCircle } from 'lucide-react';

export default function VendorOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  
  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Orders');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('All Deliveries');

  // Simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Drawer and Toast states
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVendorOrders = async (vId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/vendor/${vId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map((order: any) => {
            const customer = order.customerId || {};
            const meal = order.mealId || {};
            const uiStatus: OrderStatus = order.status === 'Out For Delivery' ? 'Out for Delivery' : order.status;

            const dp = order.deliveryPartnerId || null;
            return {
              id: order._id,
              customerName: customer.name || 'Unknown Customer',
              phone: customer.phone || 'N/A',
              address: order.deliveryAddress || customer.address || 'No Address Specified',
              mealName: meal.mealName || 'Tiffin Meal',
              plan: order.subscriptionId?.planName || 'Tiffin Subscription',
              status: uiStatus,
              deliveryTime: '12:30 PM',
              orderDate: new Date(order.orderDate || order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              quantity: 1,
              priority: 'On Track' as PriorityLevel,
              deliveryPartnerName: dp ? dp.name : undefined,
              deliveryPartnerPhone: dp ? dp.phone : undefined,
              deliveryPartnerVehicleType: dp ? dp.vehicleType : undefined,
              deliveryPartnerVehicleNumber: dp ? dp.vehicleNumber : undefined
            };
          });
          setOrders(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vendor orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_vendor_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const parsedId = u.id || u._id || '';
        setVendorId(parsedId);
        if (parsedId) {
          fetchVendorOrders(parsedId);
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to parse vendor user:", e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: OrderStatus) => {
    const dbStatus = newStatus === 'Out for Delivery' ? 'Out For Delivery' : newStatus;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: dbStatus })
      });
      if (response.ok) {
        setOrders(prev => 
          prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
        );
        showToast(`Order status updated to "${newStatus}".`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status.", "error");
    }
  };

  const handleExport = () => {
    showToast("Simulating Excel/CSV Export: 8 orders downloaded.", "success");
  };

  const handleViewDetails = (order: OrderItem) => {
    setViewingOrder(order);
    setIsDrawerOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All Orders');
    setSelectedDeliveryTime('All Deliveries');
  };

  // Filter orders list
  const filteredOrders = useMemo(() => {
    if (isEmpty) return [];

    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.mealName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'All Orders' || 
        order.status === selectedStatus;

      // Delivery Time filter rules
      let matchesTime = true;
      if (selectedDeliveryTime === 'Next 30 Minutes') {
        matchesTime = order.remainingMinutes !== undefined && order.remainingMinutes <= 30 && order.status !== 'Delivered' && order.status !== 'Cancelled';
      } else if (selectedDeliveryTime === 'Today') {
        matchesTime = order.orderDate === '09 Jun 2026';
      } else if (selectedDeliveryTime === 'Evening Deliveries') {
        matchesTime = order.deliveryTime.includes('PM') && parseInt(order.deliveryTime.split(':')[0]) >= 6;
      }

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [orders, searchQuery, selectedStatus, selectedDeliveryTime, isEmpty]);

  // Compute priority orders (High, Medium, or Out for Delivery within 50 mins)
  const priorityOrders = useMemo(() => {
    return orders.filter(o => 
      (o.status === 'Preparing' && (o.priority === 'High' || o.priority === 'Medium')) ||
      (o.status === 'Out for Delivery' && o.remainingMinutes !== undefined && o.remainingMinutes <= 50)
    );
  }, [orders]);

  // Compute live statistics based on orders state
  const liveStats = useMemo(() => {
    const today = orders.length;
    const preparing = orders.filter(o => o.status === 'Preparing').length;
    const outForDelivery = orders.filter(o => o.status === 'Out for Delivery').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;

    return {
      todayOrders: today,
      preparingOrders: preparing,
      outForDeliveryOrders: outForDelivery,
      deliveredOrders: delivered
    };
  }, [orders]);

  return (
    <DashboardLayout activeTab="orders" onTabSelect={() => {}}>
      {/* Sandbox Toggle bar */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#C2410C] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#C2410C]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across orders page.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          {/* Toggle Loading State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-355">Loading Skeleton</span>
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

          {/* Toggle Empty State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-355">Empty States</span>
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

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Orders Management</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Track, prepare, and fulfill customer orders efficiently.</p>
        </div>

        {/* 1. Statistics Cards */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <OrderStatsCard {...liveStats} />
        )}

        {/* 2. Filter Bar */}
        {!isLoading && (
          <OrdersFilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedDeliveryTime={selectedDeliveryTime}
            onDeliveryTimeChange={setSelectedDeliveryTime}
            onExport={handleExport}
          />
        )}

        {/* 3. Orders List & Sidebar info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Table / Card List */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <SkeletonLoader type="table" />
            ) : filteredOrders.length === 0 ? (
              isEmpty || orders.length === 0 ? (
                <EmptyState type="no_orders" onActionClick={() => showToast("Redirecting to subscription plans...", "info")} />
              ) : (
                <EmptyState type="no_search" onActionClick={handleClearFilters} />
              )
            ) : (
              <OrdersTable 
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Priority Alert Box */}
            {isLoading ? (
              <SkeletonLoader type="priority" />
            ) : (
              <PriorityOrderCard 
                priorityOrders={priorityOrders} 
                onViewDetails={handleViewDetails}
              />
            )}

            {/* Delivery Slots Timeline */}
            {isLoading ? (
              <SkeletonLoader type="schedule" />
            ) : (
              <DeliveryScheduleCard scheduleItems={mockDeliverySchedule} />
            )}

            {/* Performance KPI Scores */}
            {!isLoading && (
              <OrderPerformanceCard performance={mockOrderPerformance} />
            )}
          </div>
        </div>
      </div>

      {/* Slide-over details drawer */}
      <OrderDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setViewingOrder(null);
        }}
        order={viewingOrder}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp bg-[#1F2937] text-white px-5 py-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center space-x-3 max-w-sm">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' 
              ? 'bg-[#F59E0B]/20 text-[#F59E0B]' 
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
