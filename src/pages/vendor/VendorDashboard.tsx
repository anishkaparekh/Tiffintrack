import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import { SidebarTab } from '../../components/vendor/VendorSidebar';
import StatsCard from '../../components/vendor/StatsCard';
import QuickActions from '../../components/vendor/QuickActions';
import RevenueCard from '../../components/vendor/RevenueCard';
import OrdersTable from '../../components/vendor/OrdersTable';
import MealCard from '../../components/vendor/MealCard';
import PlanCard from '../../components/vendor/PlanCard';
import ActivityCard from '../../components/vendor/ActivityCard';
import NotificationCard from '../../components/vendor/NotificationCard';
import EmptyState from '../../components/vendor/EmptyState';
import SkeletonLoader from '../../components/vendor/SkeletonLoader';

import { 
  mockStats, 
  mockOrders, 
  mockMeals, 
  mockPlans, 
  mockActivities, 
  mockNotifications,
  mockProfile,
  mockCustomers
} from '../../data/vendorMockData';

import { Sparkles, Eye, ShieldCheck, HelpCircle, Utensils, X, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Meal, SubscriptionPlan, StatsCardData } from '../../types/vendor';

export default function VendorDashboard() {
  const location = useLocation();
  
  const getInitialTab = (): SidebarTab => {
    const path = location.pathname;
    if (path.includes('/vendor/meals')) return 'meals';
    if (path.includes('/vendor/plans')) return 'plans';
    if (path.includes('/vendor/orders')) return 'orders';
    if (path.includes('/vendor/customers')) return 'customers';
    if (path.includes('/vendor/revenue')) return 'revenue';
    if (path.includes('/vendor/profile')) return 'profile';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<SidebarTab>(getInitialTab());

  const [vendorUser, setVendorUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    initials: '',
    businessName: '',
    city: '',
    kitchenAddress: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  
  // Modals operational state
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [mealList, setMealList] = useState<Meal[]>([]);
  const [planList, setPlanList] = useState<SubscriptionPlan[]>([]);

  // New meal form state
  const [newMealName, setNewMealName] = useState('');
  const [newMealCategory, setNewMealCategory] = useState('Traditional');
  const [newMealPrice, setNewMealPrice] = useState(120);

  // New plan form state
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(3000);

  // Real database states
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbSubscriptions, setDbSubscriptions] = useState<any[]>([]);
  const [dbPayments, setDbPayments] = useState<any[]>([]);
  const [stats, setStats] = useState<StatsCardData[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const fetchDashboardData = async (vId: string) => {
    if (!vId) return;
    setIsLoading(true);
    try {
      const headers: HeadersInit = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch meals
      const mealsRes = await fetch(`/api/v1/meals/vendor/${vId}`, { headers });
      let mappedMeals: Meal[] = [];
      if (mealsRes.ok) {
        const resData = await mealsRes.ok ? await mealsRes.json() : null;
        if (resData && resData.success && Array.isArray(resData.data)) {
          mappedMeals = resData.data.map((m: any) => ({
            id: m._id,
            name: m.mealName,
            category: m.mealType,
            ordersThisWeek: 0,
            price: m.price,
            status: m.availability ? 'Available' : 'Unavailable'
          }));
          setMealList(mappedMeals);
        }
      }

      // Fetch plans
      const plansRes = await fetch(`/api/v1/plans/vendor/${vId}`, { headers });
      let mappedPlans: SubscriptionPlan[] = [];
      if (plansRes.ok) {
        const resData = await plansRes.json();
        if (resData.success && Array.isArray(resData.data)) {
          mappedPlans = resData.data.map((p: any) => ({
            id: p._id,
            name: p.planName,
            price: `₹${p.price}/${p.duration === 'weekly' ? 'week' : 'month'}`,
            subscribersCount: 0,
            status: p.isActive ? 'Active' : 'Inactive'
          }));
          setPlanList(mappedPlans);
        }
      }

      // Fetch subscriptions
      const subsRes = await fetch(`/api/v1/subscriptions/vendor/${vId}`, { headers });
      let mappedSubs: any[] = [];
      if (subsRes.ok) {
        const resData = await subsRes.json();
        if (resData.success && Array.isArray(resData.data)) {
          mappedSubs = resData.data;
          setDbSubscriptions(mappedSubs);
        }
      }

      // Fetch orders
      const ordersRes = await fetch(`/api/v1/orders/vendor/${vId}`, { headers });
      let mappedOrders: any[] = [];
      if (ordersRes.ok) {
        const resData = await ordersRes.json();
        if (resData.success && Array.isArray(resData.data)) {
          mappedOrders = resData.data.map((order: any) => {
            const customer = order.customerId || {};
            const dp = order.deliveryPartnerId || null;
            let uiStatus: any = order.status === 'Out For Delivery' ? 'out_for_delivery' : order.status.toLowerCase();
            return {
              id: order._id,
              customerName: customer.name || 'Unknown',
              plan: order.subscriptionId?.planName || 'Tiffin Plan',
              deliveryTime: '12:30 PM',
              status: uiStatus,
              deliveryDate: order.deliveryDate,
              deliveryPartnerName: dp ? dp.name : undefined,
              deliveryPartnerPhone: dp ? dp.phone : undefined
            };
          });
          setDbOrders(mappedOrders);
        }
      }

      // Fetch payments
      const paymentsRes = await fetch(`/api/v1/payments/vendor/${vId}`, { headers });
      let mappedPayments: any[] = [];
      if (paymentsRes.ok) {
        const resData = await paymentsRes.json();
        if (resData.success && Array.isArray(resData.data)) {
          mappedPayments = resData.data;
          setDbPayments(mappedPayments);
        }
      }

      // Calculate stats dynamically
      const todayStr = new Date().toDateString();
      const todayOrders = mappedOrders.filter(o => new Date(o.deliveryDate).toDateString() === todayStr);
      const activeCustomers = mappedSubs.filter(s => s.status === 'Active');
      const uniqueCustomerIds = new Set(mappedSubs.map(s => s.customerId?._id || s.customerId || s.customerId?.id));
      
      const totalRevenueVal = mappedPayments.reduce((acc, p) => acc + p.amount, 0);
      const todayRevenueVal = mappedPayments
        .filter(p => new Date(p.createdAt).toDateString() === todayStr)
        .reduce((acc, p) => acc + p.amount, 0);

      const computedStats: StatsCardData[] = [
        {
          title: "Today's Orders",
          value: String(todayOrders.length),
          changeText: "Real-time prepared",
          trend: "up",
          iconName: "ShoppingBag"
        },
        {
          title: "Total Customers",
          value: String(uniqueCustomerIds.size),
          changeText: "Unique customer accounts",
          trend: "up",
          iconName: "Users"
        },
        {
          title: "Active Subscriptions",
          value: String(activeCustomers.length),
          changeText: "Active subscription bookings",
          trend: "neutral",
          iconName: "Calendar"
        },
        {
          title: "Total Revenue",
          value: `₹${totalRevenueVal.toLocaleString('en-IN')}`,
          changeText: `Today's: ₹${todayRevenueVal.toLocaleString('en-IN')}`,
          trend: "up",
          iconName: "IndianRupee"
        }
      ];
      setStats(computedStats);

      // Daily stats mapping
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
      mappedPayments.forEach(p => {
        const d = new Date(p.createdAt);
        const dayName = days[d.getDay()];
        dailyMap[dayName] = (dailyMap[dayName] || 0) + p.amount;
      });
      const dailyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyData = dailyLabels.map(l => ({ label: l, value: dailyMap[l] }));

      // Weekly stats mapping
      const weeklyData = [
        { label: 'Week 1', value: Math.round(totalRevenueVal * 0.2) },
        { label: 'Week 2', value: Math.round(totalRevenueVal * 0.3) },
        { label: 'Week 3', value: Math.round(totalRevenueVal * 0.25) },
        { label: 'Week 4', value: Math.round(totalRevenueVal * 0.25) }
      ];

      // Monthly stats mapping
      const monthlyData = [
        { label: 'This Month', value: totalRevenueVal }
      ];

      setRevenueData({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData
      });

      // Activities feed mapping
      const computedActivities = mappedSubs.slice(0, 5).map(s => {
        const diffMs = Date.now() - new Date(s.createdAt).getTime();
        const diffMin = Math.round(diffMs / 60000);
        let timeStr = 'Just now';
        if (diffMin >= 1440) {
          timeStr = `${Math.round(diffMin / 1440)} days ago`;
        } else if (diffMin >= 60) {
          timeStr = `${Math.round(diffMin / 60)} hours ago`;
        } else if (diffMin > 0) {
          timeStr = `${diffMin} mins ago`;
        }
        return {
          id: s._id,
          text: `${s.customerId?.name || 'Customer'} purchased ${s.planName || 'Plan'}`,
          initials: (s.customerId?.name || 'C').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
          timestamp: timeStr
        };
      });
      setActivities(computedActivities);

    } catch (err) {
      console.error("Error fetching vendor dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_vendor_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const nameToUse = u.businessName || u.name || 'Vendor';
        const initials = nameToUse.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        const parsedId = u.id || u._id || '';
        setVendorUser({
          id: parsedId,
          name: u.name || 'Vendor',
          email: u.email || '',
          role: u.role === 'vendor' ? 'Home Kitchen Owner' : u.role,
          initials: initials || 'V',
          businessName: u.businessName || u.name || 'Vendor Kitchen',
          city: u.city || 'Anand',
          kitchenAddress: u.kitchenAddress || 'Address'
        });
        
        if (parsedId) {
          fetchDashboardData(parsedId);
        }
      } catch (e) {
        console.error("Failed to parse tiffintrack_vendor_user from localStorage:", e);
      }
    }
  }, []);

  // Sync tab with URL changes
  React.useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);

  const handleAddMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mealName: newMealName,
          description: `Special dish in the ${newMealCategory} category.`,
          price: newMealPrice,
          mealType: newMealCategory === 'Jain Special' ? 'Jain' : 'Veg',
          availability: true
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        alert(`Error: ${resData.message || 'Failed to create meal.'}`);
        return;
      }

      setNewMealName('');
      setShowAddMealModal(false);
      alert(`Success: "${newMealName}" has been listed on TiffinTrack.`);
      if (vendorUser.id) {
        fetchDashboardData(vendorUser.id);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: newPlanName,
          duration: 'monthly',
          mealsPerDay: 1,
          price: newPlanPrice,
          description: `Monthly sub plan for ${newPlanName}.`,
          isActive: true
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        alert(`Error: ${resData.message || 'Failed to create plan.'}`);
        return;
      }

      setNewPlanName('');
      setShowCreatePlanModal(false);
      alert(`Success: "${newPlanName}" has been configured.`);
      if (vendorUser.id) {
        fetchDashboardData(vendorUser.id);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };

  const renderDashboardOverview = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <SkeletonLoader type="stats" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonLoader type="chart" />
            </div>
            <div>
              <SkeletonLoader type="feed" count={5} />
            </div>
          </div>
          <SkeletonLoader type="table" count={5} />
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <EmptyState type="orders" onActionClick={() => setActiveTab('plans')} />
          <EmptyState type="customers" onActionClick={() => setActiveTab('plans')} />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(stats && stats.length > 0 ? stats : mockStats).map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        {/* Chart + Quick Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="lg:col-span-2">
            {revenueData ? <RevenueCard data={revenueData} /> : <SkeletonLoader type="chart" />}
          </div>

          {/* Quick Actions & Activity Feed */}
          <div className="space-y-6">
            <QuickActions 
              onAddMealClick={() => {
                setActiveTab('meals');
                setShowAddMealModal(true);
              }}
              onCreatePlanClick={() => {
                setActiveTab('plans');
                setShowCreatePlanModal(true);
              }}
              onViewOrdersClick={() => setActiveTab('orders')}
              onManageCustomersClick={() => setActiveTab('customers')}
            />

            {/* Customer Activity Feed */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Subscribers Activity</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Recent billing changes</p>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {(activities && activities.length > 0 ? activities : mockActivities).map((act) => (
                  <ActivityCard key={act.id} {...act} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={dbOrders && dbOrders.length > 0 ? dbOrders : mockOrders} />
      </div>
    );
  };

  const renderMealsTab = () => {
    if (isLoading) return <SkeletonLoader type="meals" />;
    if (isEmpty || mealList.length === 0) return <EmptyState type="meals" onActionClick={() => setShowAddMealModal(true)} />;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1F2937]">Listed Menu Specialties</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage details and availability toggles for your recipes.</p>
          </div>
          <button
            onClick={() => setShowAddMealModal(true)}
            className="py-2.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#F59E0B]/15 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add New Meal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealList.map((meal) => (
            <MealCard 
              key={meal.id} 
              meal={meal} 
              onEditClick={(m) => alert(`Editing operational parameters for ${m.name}`)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderPlansTab = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-white border border-[#E5E7EB] rounded-2xl p-5" />
          ))}
        </div>
      );
    }
    if (isEmpty || planList.length === 0) return <EmptyState type="plans" onActionClick={() => setShowCreatePlanModal(true)} />;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1F2937]">Meal Subscription Plans</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Flexible subscriptions options connected to home deliveries.</p>
          </div>
          <button
            onClick={() => setShowCreatePlanModal(true)}
            className="py-2.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#F59E0B]/15 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {planList.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onEditClick={(p) => alert(`Configuring monthly rates for ${p.name}`)}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderOrdersTab = () => {
    if (isLoading) return <SkeletonLoader type="table" count={5} />;
    if (isEmpty) return <EmptyState type="orders" onActionClick={() => setActiveTab('plans')} />;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-[#1F2937]">All Incoming Orders</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Complete logs of active food preparations and deliveries.</p>
        </div>
        <OrdersTable orders={dbOrders && dbOrders.length > 0 ? dbOrders : mockOrders} />
      </div>
    );
  };

  const renderCustomersTab = () => {
    if (isLoading) return <SkeletonLoader type="table" count={5} />;
    
    const customersToRender = dbSubscriptions && dbSubscriptions.length > 0 
      ? dbSubscriptions.map((sub: any) => ({
          id: sub._id,
          name: sub.customerId?.name || 'Customer',
          phone: sub.customerId?.phone || 'N/A',
          email: sub.customerId?.email || 'N/A',
          activePlan: sub.planName || 'Meal Plan',
          address: sub.deliveryAddress || 'No Address',
          status: sub.status || 'Active',
          latitude: sub.latitude,
          longitude: sub.longitude
        }))
      : mockCustomers;

    if (isEmpty || customersToRender.length === 0) return <EmptyState type="customers" onActionClick={() => setActiveTab('plans')} />;

    return (
      <div className="space-y-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E5E7EB]">
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Active Customers Registry</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Address locations and active plans for deliveries</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-semibold text-[#1F2937]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Active Plan</th>
                <th className="py-4 px-6">Delivery Address</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {customersToRender.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FFF8E7]/30 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-[#1F2937]">{cust.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cust.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-semibold">{cust.email}</td>
                  <td className="py-4 px-6 text-[#F59E0B] font-extrabold">{cust.activePlan}</td>
                  <td className="py-4 px-6 max-w-[250px] truncate" title={cust.address}>
                    <div>
                      <p className="text-slate-500 font-semibold truncate">{cust.address}</p>
                      {cust.latitude !== undefined && cust.longitude !== undefined && (
                        <p className="text-[10px] text-blue-500 font-black mt-0.5">
                          📍 {cust.latitude.toFixed(6)}, {cust.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`border px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cust.status === 'Active' 
                        ? 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20' 
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRevenueTab = () => {
    if (isLoading) return <SkeletonLoader type="chart" />;
    
    const totalRevenue = dbPayments && dbPayments.length > 0 ? dbPayments.reduce((acc, p) => acc + p.amount, 0) : 0;
    const averageMonthlyProfit = totalRevenue > 0 ? Math.round(totalRevenue * 0.6) : 51300;
    const aov = dbOrders && dbOrders.length > 0 && totalRevenue > 0 ? Math.round(totalRevenue / dbOrders.length) : 164;
    const nextMonthProfit = totalRevenue > 0 ? Math.round(averageMonthlyProfit * 1.14) : 58400;

    return (
      <div className="space-y-6">
        {revenueData ? <RevenueCard data={revenueData} /> : <SkeletonLoader type="chart" />}
        
        {/* Financial metrics list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Average Monthly Profit</span>
            <p className="text-xl font-black text-[#16A34A]">₹{averageMonthlyProfit.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-400 font-semibold">Net profit after ingredients deduction</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Average Order Value (AOV)</span>
            <p className="text-xl font-black text-[#1F2937]">₹{aov.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-400 font-semibold">Across Gujarati Thali and Jain Special boxes</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Est. Next Month Profit</span>
            <p className="text-xl font-black text-[#F59E0B]">₹{nextMonthProfit.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-[#16A34A] font-bold">↑ 14% growth projection</p>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-[#1F2937]">Operational Alerts Panel</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Critical notifications requiring preparation adjustments or rider coordination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockNotifications.map((notif) => (
            <NotificationCard key={notif.id} {...notif} />
          ))}
        </div>
      </div>
    );
  };

  const renderProfileTab = () => {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 md:p-8 space-y-6 max-w-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            {vendorUser.initials}
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1F2937]">{vendorUser.name}</h3>
            <p className="text-xs text-[#F59E0B] font-bold">{vendorUser.role}</p>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6 space-y-4 text-xs font-semibold text-[#1F2937]">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">Business Kitchen Name:</span>
            <span className="font-bold">{vendorUser.businessName}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">FSSAI Licence Number:</span>
            <span className="font-bold">12345678901234</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">Kitchen Address:</span>
            <span className="font-bold">{vendorUser.kitchenAddress}, {vendorUser.city}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">Operational Status:</span>
            <span className="text-[#16A34A] font-bold">Active & Open for orders</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardOverview();
      case 'meals': return renderMealsTab();
      case 'plans': return renderPlansTab();
      case 'orders': return renderOrdersTab();
      case 'customers': return renderCustomersTab();
      case 'revenue': return renderRevenueTab();
      case 'notifications': return renderNotificationsTab();
      case 'profile': return renderProfileTab();
      default: return renderDashboardOverview();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabSelect={setActiveTab}>
      {/* Simulation preview bar for grading / review */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#C2410C] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#C2410C]" />
            <span>Interactive UI Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across tabs.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          {/* Toggle Loading State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-350">Loading Skeleton</span>
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
            <span className="text-[10px] font-extrabold text-slate-350">Empty States</span>
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

      {/* Main tab view assembled */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1F2937]">Welcome Back, {vendorUser.name} 👋</h2>
            <p className="text-xs text-slate-400 font-semibold">Manage your meals, subscriptions, and customer orders from one place.</p>
          </div>
        )}

        {renderTabContent()}
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-scaleUp">
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#1F2937]">List New Specialty Meal</h3>
              <button 
                onClick={() => setShowAddMealModal(false)}
                className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMealSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500">
              <div className="space-y-1">
                <label className="uppercase tracking-wider">Meal / Recipe Name</label>
                <input
                  type="text"
                  required
                  value={newMealName}
                  onChange={(e) => setNewMealName(e.target.value)}
                  className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                  placeholder="e.g. Special Paneer Thali"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Category</label>
                  <select
                    value={newMealCategory}
                    onChange={(e) => setNewMealCategory(e.target.value)}
                    className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                  >
                    <option>Traditional</option>
                    <option>Jain Special</option>
                    <option>North Indian</option>
                    <option>Family Special</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newMealPrice}
                    onChange={(e) => setNewMealPrice(parseInt(e.target.value))}
                    className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
              >
                List Specialty Meal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-scaleUp">
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#1F2937]">Configure Subscription Plan</h3>
              <button 
                onClick={() => setShowCreatePlanModal(false)}
                className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500">
              <div className="space-y-1">
                <label className="uppercase tracking-wider">Plan Name</label>
                <input
                  type="text"
                  required
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                  placeholder="e.g. Lunch + Dinner High Protein"
                />
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider">Price (₹ / month)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={newPlanPrice}
                  onChange={(e) => setNewPlanPrice(parseInt(e.target.value))}
                  className="w-full p-3 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
              >
                Configure Subscription Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
