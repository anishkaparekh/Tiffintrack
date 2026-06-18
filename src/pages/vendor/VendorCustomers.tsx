import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import CustomerStatsCard from '../../components/vendor/customers/CustomerStatsCard';
import CustomerSegmentCard from '../../components/vendor/customers/CustomerSegmentCard';
import CustomersFilterBar from '../../components/vendor/customers/CustomersFilterBar';
import CustomersTable from '../../components/vendor/customers/CustomersTable';
import CustomerDetailsDrawer from '../../components/vendor/customers/CustomerDetailsDrawer';
import CustomerAnalyticsCard from '../../components/vendor/customers/CustomerAnalyticsCard';
import TopCustomerCard from '../../components/vendor/customers/TopCustomerCard';
import EmptyState from '../../components/vendor/customers/EmptyState';
import SkeletonLoader from '../../components/vendor/customers/SkeletonLoader';

import { 
  mockCustomersList, 
  mockCustomerStats, 
  mockCustomerSegments, 
  mockTopCustomers 
} from '../../data/customersMockData';

import { CustomerItem, SubscriptionStatus } from '../../types/customers';
import { Sparkles, BarChart, CheckCircle } from 'lucide-react';

export default function VendorCustomers() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  
  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Customers');
  const [selectedSort, setSelectedSort] = useState('recent');
  
  // Custom segment click filter (loyal, new, high_value, at_risk)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Drawer and Toast states
  const [viewingCustomer, setViewingCustomer] = useState<CustomerItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVendorSubscriptions = async (vId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/subscriptions/vendor/${vId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map((sub: any) => {
            const customer = sub.customerId || {};
            const plan = sub.planId || {};
            const status: SubscriptionStatus = sub.status === 'Cancelled' ? 'Expired' : (sub.status as SubscriptionStatus);

            return {
              id: sub._id,
              name: customer.name || 'Unknown Customer',
              phone: customer.phone || 'N/A',
              email: customer.email || 'N/A',
              currentPlan: sub.planName || plan.planName || 'Tiffin Plan',
              joinDate: new Date(sub.createdAt || sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: status,
              lifetimeValue: plan.price || sub.price || 3000,
              lastOrderDate: new Date(sub.updatedAt || sub.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              deliveryAddress: sub.deliveryAddress || 'No address specified',
              mealsPerWeek: plan.duration === 'weekly' ? '6 meals/week' : '26 meals/week',
              totalOrders: plan.duration === 'weekly' ? 6 : 26,
              favoriteMeal: 'Standard Veg Meal',
              avgMonthlySpend: plan.price || sub.price || 3000,
              activityFeed: [
                { id: `act-1-${sub._id}`, text: 'Subscribed to plan', timestamp: 'Initial checkout' }
              ],
              isNew: true
            };
          });
          setCustomers(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vendor subscriptions:", err);
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
          fetchVendorSubscriptions(parsedId);
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

  const handleSubscriptionAction = async (id: string, actionType: 'pause' | 'resume' | 'reminder' | 'export') => {
    const customerName = customers.find(c => c.id === id)?.name;
    
    if (actionType === 'pause' || actionType === 'resume') {
      const newStatus = actionType === 'pause' ? 'Paused' : 'Active';
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/v1/subscriptions/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            setCustomers(prev => 
              prev.map(c => c.id === id ? { 
                ...c, 
                status: newStatus as SubscriptionStatus,
                activityFeed: [
                  { id: `act-${Date.now()}`, text: `${actionType === 'pause' ? 'Paused' : 'Resumed'} Subscription`, timestamp: 'Just now' },
                  ...c.activityFeed
                ]
              } : c)
            );
            showToast(`Subscription ${actionType === 'pause' ? 'paused' : 'resumed'} for ${customerName}.`, 'success');
          }
        }
      } catch (err) {
        console.error("Failed to update subscription status:", err);
        showToast("Error updating subscription status.", "error");
      }
    } else if (actionType === 'reminder') {
      showToast(`Renewal payment reminder notification dispatched to ${customerName}.`, 'info');
    } else if (actionType === 'export') {
      showToast(`Downloaded profile schema for ${customerName}.`, 'success');
    }
  };

  const handleExportAll = () => {
    showToast(`Simulated Export: Directory of ${customers.length} customers saved.`, 'success');
  };

  const handleViewProfile = (customer: CustomerItem) => {
    setViewingCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleViewActivity = (customer: CustomerItem) => {
    setViewingCustomer(customer);
    setIsDrawerOpen(true);
    showToast(`Opening timeline activity logs for ${customer.name}.`, 'info');
  };

  const handleViewProfileByName = (name: string) => {
    const found = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setViewingCustomer(found);
      setIsDrawerOpen(true);
    } else {
      showToast(`Customer details for "${name}" not found.`, 'error');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFilter('All Customers');
    setSelectedSort('recent');
    setSelectedSegment(null);
  };

  // Filter and sort customer directory
  const filteredCustomers = useMemo(() => {
    if (isEmpty) return [];

    let result = customers.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Subscription filters rules
      let matchesFilter = true;
      if (selectedFilter === 'Active Subscribers') {
        matchesFilter = c.status === 'Active';
      } else if (selectedFilter === 'Paused Subscriptions') {
        matchesFilter = c.status === 'Paused';
      } else if (selectedFilter === 'Expired Subscriptions') {
        matchesFilter = c.status === 'Expired';
      } else if (selectedFilter === 'New Customers') {
        matchesFilter = c.isNew === true;
      } else if (selectedFilter === 'High-Value Customers') {
        matchesFilter = c.lifetimeValue >= 10000;
      }

      // Customer Segment card clicks filter rules
      let matchesSegment = true;
      if (selectedSegment === 'loyal') {
        matchesSegment = c.isLoyal === true;
      } else if (selectedSegment === 'new') {
        matchesSegment = c.isNew === true;
      } else if (selectedSegment === 'high_value') {
        matchesSegment = c.lifetimeValue >= 10000;
      } else if (selectedSegment === 'at_risk') {
        matchesSegment = c.status === 'Renewal Due';
      }

      return matchesSearch && matchesFilter && matchesSegment;
    });

    // Apply sorting selection
    if (selectedSort === 'recent') {
      result.sort((a, b) => b.lastOrderDate.localeCompare(a.lastOrderDate));
    } else if (selectedSort === 'lifetime_value') {
      result.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
    } else if (selectedSort === 'orders') {
      result.sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (selectedSort === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [customers, searchQuery, selectedFilter, selectedSort, selectedSegment, isEmpty]);

  // Compute live stats based on state
  const liveStats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'Active').length;
    const newCount = customers.filter(c => c.isNew).length;

    return {
      totalCustomers: total,
      activeSubscribers: active,
      newCustomersThisMonth: newCount,
      avgRetentionRate: total > 0 ? Math.round((active / total) * 100) : 0
    };
  }, [customers]);

  // Compute live segment sizes
  const liveSegments = useMemo(() => {
    return mockCustomerSegments.map(seg => {
      let count = 0;
      if (seg.type === 'loyal') {
        count = customers.filter(c => c.isLoyal).length;
      } else if (seg.type === 'new') {
        count = customers.filter(c => c.isNew).length;
      } else if (seg.type === 'high_value') {
        count = customers.filter(c => c.lifetimeValue >= 10000).length;
      } else if (seg.type === 'at_risk') {
        count = customers.filter(c => c.status === 'Expired' || c.status === 'Renewal Due').length;
      }
      return { ...seg, count };
    });
  }, [customers]);

  return (
    <DashboardLayout activeTab="customers" onTabSelect={() => {}}>
      {/* Sandbox Toggle bar */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#C2410C] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#C2410C]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across customers page.
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

      {/* Main Page Layout */}
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Customers</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage customer relationships, subscriptions, and engagement from one place.
          </p>
        </div>

        {/* 1. Customer Statistics */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <CustomerStatsCard {...liveStats} />
        )}

        {/* 2. Segments distribution widgets */}
        {!isLoading && (
          <CustomerSegmentCard 
            segments={liveSegments}
            selectedSegment={selectedSegment}
            onSegmentSelect={setSelectedSegment}
          />
        )}

        {/* 3. Search filter controls */}
        {!isLoading && (
          <CustomersFilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            onExport={handleExportAll}
          />
        )}

        {/* 4. Table directory & Top Performers sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Table */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <SkeletonLoader type="table" />
            ) : filteredCustomers.length === 0 ? (
              isEmpty || customers.length === 0 ? (
                <EmptyState type="no_customers" onActionClick={() => showToast("Showing plan link details...", "info")} />
              ) : (
                <EmptyState type="no_search" onActionClick={handleClearFilters} />
              )
            ) : (
              <CustomersTable 
                customers={filteredCustomers}
                onViewProfile={handleViewProfile}
                onViewActivity={handleViewActivity}
                onSubscriptionAction={handleSubscriptionAction}
              />
            )}
          </div>

          {/* Sidebar widget */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {isLoading ? (
              <SkeletonLoader type="top_customers" />
            ) : (
              <TopCustomerCard 
                topCustomers={mockTopCustomers} 
                onViewProfileByName={handleViewProfileByName}
              />
            )}
          </div>
        </div>

        {/* 5. Recharts business charts */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
              <BarChart size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Subscriber Engagement Analytics</h3>
          </div>
          {isLoading ? (
            <SkeletonLoader type="charts" />
          ) : (
            <CustomerAnalyticsCard />
          )}
        </div>
      </div>

      {/* Details drawer sheet */}
      <CustomerDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setViewingCustomer(null);
        }}
        customer={viewingCustomer}
      />

      {/* Toast Feedbacks */}
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
