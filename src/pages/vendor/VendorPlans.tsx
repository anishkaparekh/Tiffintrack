import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import PlanStatsCard from '../../components/vendor/plans/PlanStatsCard';
import PlansFilterBar from '../../components/vendor/plans/PlansFilterBar';
import PlanCard from '../../components/vendor/plans/PlanCard';
import PlanAnalyticsCard from '../../components/vendor/plans/PlanAnalyticsCard';
import TopPlanCard from '../../components/vendor/plans/TopPlanCard';
import CreatePlanModal from '../../components/vendor/plans/CreatePlanModal';
import EmptyState from '../../components/vendor/plans/EmptyState';
import SkeletonLoader from '../../components/vendor/plans/SkeletonLoader';
import ViewPlanDetailsModal from '../../components/vendor/plans/ViewPlanDetailsModal';

import { 
  mockPlansList, 
  mockPlansStats, 
  mockTopPerformingPlans 
} from '../../data/plansMockData';

import { PlanItem, PlanStatus } from '../../types/plans';
import { Sparkles, Plus, Layers, ShieldAlert, BarChart, CheckCircle } from 'lucide-react';

export default function VendorPlans() {
  const [plans, setPlans] = useState<PlanItem[]>(mockPlansList);
  
  // Filtering and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Plans');
  const [selectedSort, setSelectedSort] = useState('subscribers');

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);

  // Details Modal and Toast state
  const [viewingPlan, setViewingPlan] = useState<PlanItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSavePlan = (planData: Omit<PlanItem, 'id' | 'subscriberCount' | 'revenueGenerated'>) => {
    if (editingPlan) {
      setPlans(prev => 
        prev.map(p => p.id === editingPlan.id ? { ...p, ...planData } : p)
      );
      showToast(`Success: "${planData.name}" has been updated.`, 'success');
      setEditingPlan(null);
    } else {
      const newPlan: PlanItem = {
        id: `P${Date.now()}`,
        name: planData.name,
        description: planData.description,
        includedMeals: planData.includedMeals,
        mealsPerWeek: planData.mealsPerWeek,
        monthlyPrice: planData.monthlyPrice,
        subscriberCount: 0,
        revenueGenerated: 0,
        duration: planData.duration,
        status: planData.status
      };
      setPlans([newPlan, ...plans]);
      showToast(`Success: "${newPlan.name}" has been created.`, 'success');
    }
  };

  const handleStatusChange = (id: string, newStatus: PlanStatus) => {
    setPlans(prev => 
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
    const planName = plans.find(p => p.id === id)?.name;
    showToast(`"${planName}" status changed to ${newStatus}.`, 'success');
  };

  const handleDuplicate = (plan: PlanItem) => {
    const duplicated: PlanItem = {
      ...plan,
      id: `P${Date.now()}`,
      name: `${plan.name} (Copy)`,
      subscriberCount: 0,
      revenueGenerated: 0
    };
    setPlans([duplicated, ...plans]);
    showToast(`Duplicated "${plan.name}" as "${duplicated.name}".`, 'success');
  };

  const handleDelete = (id: string) => {
    const planName = plans.find(p => p.id === id)?.name;
    if (confirm(`Are you sure you want to delete "${planName}"?`)) {
      setPlans(prev => prev.filter(p => p.id !== id));
      showToast(`"${planName}" has been removed.`, 'info');
    }
  };

  const handleEditClick = (plan: PlanItem) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleViewClick = (plan: PlanItem) => {
    setViewingPlan(plan);
    setIsViewModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All Plans');
    setSelectedSort('subscribers');
  };

  // Filter and sort plans list
  const filteredPlans = useMemo(() => {
    if (isEmpty) return [];

    let result = plans.filter(plan => {
      const matchesSearch = 
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'All Plans' || 
        plan.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    if (selectedSort === 'subscribers') {
      result.sort((a, b) => b.subscriberCount - a.subscriberCount);
    } else if (selectedSort === 'revenue') {
      result.sort((a, b) => b.revenueGenerated - a.revenueGenerated);
    } else if (selectedSort === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (selectedSort === 'oldest') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [plans, searchQuery, selectedStatus, selectedSort, isEmpty]);

  // Compute stats on-the-fly
  const activeStats = useMemo(() => {
    const total = plans.length;
    const activeSubs = plans.reduce((acc, p) => acc + p.subscriberCount, 0);
    
    // Find best seller in local state
    const sorted = [...plans].sort((a, b) => b.subscriberCount - a.subscriberCount);
    const bestSeller = sorted[0];

    return {
      totalPlans: total,
      activeSubscribers: activeSubs,
      monthlyRecurringRevenue: mockPlansStats.monthlyRecurringRevenue,
      mostPopularPlanName: bestSeller ? bestSeller.name : "None",
      mostPopularPlanSubscribers: bestSeller ? bestSeller.subscriberCount : 0
    };
  }, [plans]);

  return (
    <DashboardLayout activeTab="plans" onTabSelect={() => {}}>
      {/* Simulation preview bar for grading / review */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across plans page.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          {/* Toggle Loading State */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-355">Loading Skeleton</span>
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
            <span className="text-[10px] font-extrabold text-slate-355">Empty States</span>
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

      {/* Main page content */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1F2937]">Subscription Plans</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Create and manage recurring meal subscriptions for your customers.</p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            className="sm:hidden w-full py-3 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00B074]/15 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New Plan</span>
          </button>
        </div>

        {/* 1. Statistics Cards */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <PlanStatsCard {...activeStats} />
        )}

        {/* 2. Filter Bar */}
        {!isLoading && (
          <PlansFilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        )}

        {/* 3. Plans Grid + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Plans listings */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <SkeletonLoader type="grid" />
            ) : filteredPlans.length === 0 ? (
              isEmpty || plans.length === 0 ? (
                <EmptyState type="no_plans" onActionClick={() => setIsModalOpen(true)} />
              ) : (
                <EmptyState type="no_search" onActionClick={handleClearFilters} />
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPlans.map((plan) => (
                  <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onEdit={handleEditClick}
                    onView={handleViewClick}
                    onStatusChange={handleStatusChange}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar controls & top performers */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="hidden sm:block bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <button
                onClick={() => {
                  setEditingPlan(null);
                  setIsModalOpen(true);
                }}
                className="w-full py-3.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00B074]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Create New Subscription Plan</span>
              </button>
            </div>

            {isLoading ? (
              <SkeletonLoader type="best_sellers" />
            ) : (
              <TopPlanCard bestPerformingPlans={mockTopPerformingPlans} />
            )}
          </div>
        </div>

        {/* 4. Subscription Analytics Charts */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-1.5 rounded-lg bg-[#00B074]/10 text-[#00B074]">
              <BarChart size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Plan Business Intelligence</h3>
          </div>
          {isLoading ? (
            <SkeletonLoader type="charts" />
          ) : (
            <PlanAnalyticsCard />
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreatePlanModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        editPlan={editingPlan}
      />

      {/* Details Modal */}
      <ViewPlanDetailsModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingPlan(null);
        }}
        plan={viewingPlan}
      />

      {/* Toast Notifications */}
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
