import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import RevenueStatsCard from '../../components/vendor/revenue/RevenueStatsCard';
import RevenueFilters from '../../components/vendor/revenue/RevenueFilters';
import RevenueChartCard from '../../components/vendor/revenue/RevenueChartCard';
import RevenueBreakdownCard from '../../components/vendor/revenue/RevenueBreakdownCard';
import TopMealRevenueCard from '../../components/vendor/revenue/TopMealRevenueCard';
import TopCustomerRevenueCard from '../../components/vendor/revenue/TopCustomerRevenueCard';
import InsightsCard from '../../components/vendor/revenue/InsightsCard';
import RevenueGoalCard from '../../components/vendor/revenue/RevenueGoalCard';
import RevenueTable from '../../components/vendor/revenue/RevenueTable';
import EmptyState from '../../components/vendor/revenue/EmptyState';
import SkeletonLoader from '../../components/vendor/revenue/SkeletonLoader';

import { 
  mockRevenueStats, 
  mockTopMealsRevenue, 
  mockTopCustomersRevenue, 
  mockRevenueInsights, 
  mockRevenueGoals, 
  mockTransactions 
} from '../../data/revenueMockData';

import { Sparkles, BarChart, CheckCircle } from 'lucide-react';

export default function VendorRevenue() {
  const [transactions, setTransactions] = useState(mockTransactions);
  
  // Date range and source channel states
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [selectedSource, setSelectedSource] = useState('All Revenue');

  // Reviewer sandboxes
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleExport = () => {
    showToast(`Downloading revenue report summary (Date: ${selectedRange}, Source: ${selectedSource}) in PDF format...`, 'success');
  };

  const handleResetFilters = () => {
    setSelectedRange('Last 30 Days');
    setSelectedSource('All Revenue');
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (isEmpty) return [];

    return transactions.filter(t => {
      if (selectedSource === 'All Revenue') return true;
      if (selectedSource === 'Subscription Revenue') {
        return t.source.includes('Plan') && !t.source.includes('Family') && !t.source.includes('Custom');
      }
      if (selectedSource === 'One-Time Orders') {
        return !t.source.includes('Plan');
      }
      if (selectedSource === 'Family Plans') {
        return t.source.includes('Family');
      }
      if (selectedSource === 'Custom Plans') {
        return t.source.includes('Custom');
      }
      return true;
    });
  }, [transactions, selectedSource, isEmpty]);

  return (
    <DashboardLayout activeTab="revenue" onTabSelect={() => {}}>
      {/* Sandbox controller */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Use these switches to instantly test loading placeholders and empty states across revenue dashboard.
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

      {/* Page Content */}
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Revenue Dashboard</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Track earnings, identify growth opportunities, and understand your business performance.
          </p>
        </div>

        {/* 1. Revenue Overview Statistics */}
        {isLoading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <RevenueStatsCard {...mockRevenueStats} />
        )}

        {/* 2. Filters bar */}
        {!isLoading && (
          <RevenueFilters 
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
            onExport={handleExport}
          />
        )}

        {/* 3. Recharts analytics trend graphs */}
        {isLoading ? (
          <SkeletonLoader type="charts" />
        ) : (
          <RevenueChartCard />
        )}

        {/* 4. Contribution percentage breakdown cards */}
        {!isLoading && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-1.5 rounded-lg bg-[#00B074]/10 text-[#00B074]">
                <BarChart size={16} />
              </div>
              <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Earnings Channels Contribution</h3>
            </div>
            <RevenueBreakdownCard />
          </div>
        )}

        {/* 5. Top dishes & Top customer segments side-by-side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Top Meals */}
          {isLoading ? (
            <SkeletonLoader type="top_meals" />
          ) : (
            <TopMealRevenueCard topMeals={mockTopMealsRevenue} />
          )}

          {/* Top Customers */}
          {isLoading ? (
            <SkeletonLoader type="top_customers" />
          ) : (
            <TopCustomerRevenueCard topCustomers={mockTopCustomersRevenue} />
          )}

          {/* Goals tracker progress */}
          {isLoading ? (
            <SkeletonLoader type="goals" />
          ) : (
            <RevenueGoalCard goals={mockRevenueGoals} />
          )}
        </div>

        {/* 6. Context-rich business insights */}
        {!isLoading && (
          <InsightsCard insights={mockRevenueInsights} />
        )}

        {/* 7. Ledger Transactions Table */}
        <div className="w-full">
          {isLoading ? (
            <SkeletonLoader type="table" />
          ) : filteredTransactions.length === 0 ? (
            isEmpty || transactions.length === 0 ? (
              <EmptyState type="no_revenue" onActionClick={() => showToast("Navigating to subscription configurations...", "info")} />
            ) : (
              <EmptyState type="no_transactions" onActionClick={handleResetFilters} />
            )
          ) : (
            <RevenueTable transactions={filteredTransactions} />
          )}
        </div>

      </div>

      {/* Toast notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp bg-[#1F2937] text-white px-5 py-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center space-x-3 max-w-sm">
          <div className="p-1.5 rounded-lg bg-[#00B074]/20 text-[#00B074]">
            <CheckCircle size={16} />
          </div>
          <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
        </div>
      )}
    </DashboardLayout>
  );
}
