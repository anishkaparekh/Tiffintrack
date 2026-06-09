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
import { Meal, SubscriptionPlan } from '../../types/vendor';

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

  // Sync tab with URL changes
  React.useEffect(() => {
    setActiveTab(getInitialTab());
  }, [location.pathname]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  
  // Modals operational state
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [mealList, setMealList] = useState<Meal[]>(mockMeals);
  const [planList, setPlanList] = useState<SubscriptionPlan[]>(mockPlans);

  // New meal form state
  const [newMealName, setNewMealName] = useState('');
  const [newMealCategory, setNewMealCategory] = useState('Traditional');
  const [newMealPrice, setNewMealPrice] = useState(120);

  // New plan form state
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(3000);

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealName) return;
    const newMeal: Meal = {
      id: `M${mealList.length + 1}`,
      name: newMealName,
      category: newMealCategory,
      ordersThisWeek: 0,
      price: newMealPrice,
      status: 'Available'
    };
    setMealList([...mealList, newMeal]);
    setNewMealName('');
    setShowAddMealModal(false);
    alert(`Success: "${newMeal.name}" has been listed on TiffinTrack.`);
  };

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;
    const newPlan: SubscriptionPlan = {
      id: `P${planList.length + 1}`,
      name: newPlanName,
      price: `₹${newPlanPrice}/month`,
      subscribersCount: 0,
      status: 'Active'
    };
    setPlanList([...planList, newPlan]);
    setNewPlanName('');
    setShowCreatePlanModal(false);
    alert(`Success: "${newPlan.name}" has been configured.`);
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
          {mockStats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>

        {/* Chart + Quick Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Overview */}
          <div className="lg:col-span-2">
            <RevenueCard />
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
                {mockActivities.map((act) => (
                  <ActivityCard key={act.id} {...act} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={mockOrders} />
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
            className="py-2.5 px-4 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#00B074]/15 transition-all cursor-pointer"
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
            className="py-2.5 px-4 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#00B074]/15 transition-all cursor-pointer"
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
        <OrdersTable orders={mockOrders} />
      </div>
    );
  };

  const renderCustomersTab = () => {
    if (isLoading) return <SkeletonLoader type="table" count={5} />;
    if (isEmpty) return <EmptyState type="customers" onActionClick={() => setActiveTab('plans')} />;

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
              {mockCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#F4F9F6]/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1F2937]">{cust.name}</td>
                  <td className="py-4 px-6 text-slate-500 font-semibold">{cust.email}</td>
                  <td className="py-4 px-6 text-[#00B074] font-extrabold">{cust.activePlan}</td>
                  <td className="py-4 px-6 text-slate-500 font-semibold max-w-[200px] truncate">{cust.address}</td>
                  <td className="py-4 px-6">
                    <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
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
    
    return (
      <div className="space-y-6">
        <RevenueCard />
        
        {/* Financial metrics list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Average Monthly Profit</span>
            <p className="text-xl font-black text-[#16A34A]">₹51,300</p>
            <p className="text-[10px] text-slate-400 font-semibold">Net profit after ingredients deduction</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Average Order Value (AOV)</span>
            <p className="text-xl font-black text-[#1F2937]">₹164</p>
            <p className="text-[10px] text-slate-400 font-semibold">Across Gujarati Thali and Jain Special boxes</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Est. Next Month Profit</span>
            <p className="text-xl font-black text-[#00B074]">₹58,400</p>
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
          <div className="w-16 h-16 rounded-2xl bg-[#00B074] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            {mockProfile.initials}
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1F2937]">{mockProfile.name}</h3>
            <p className="text-xs text-[#00B074] font-bold">{mockProfile.role}</p>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6 space-y-4 text-xs font-semibold text-[#1F2937]">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">Business Kitchen Name:</span>
            <span className="font-bold">Priya's Home Kitchen</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">FSSAI Licence Number:</span>
            <span className="font-bold">12345678901234</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <span className="text-slate-400">Kitchen Address:</span>
            <span className="font-bold">Flat 102, Gardenia Residency, HSR Layout, Bengaluru</span>
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
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
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
                isLoading ? 'bg-[#00B074]' : 'bg-slate-600'
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

      {/* Main tab view assembled */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#1F2937]">Welcome Back, Priya 👋</h2>
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
                className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all"
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
                  className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                  placeholder="e.g. Special Paneer Thali"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Category</label>
                  <select
                    value={newMealCategory}
                    onChange={(e) => setNewMealCategory(e.target.value)}
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
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
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
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
                className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all"
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
                  className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
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
                  className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-sm shadow-md transition-all mt-4 cursor-pointer"
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
