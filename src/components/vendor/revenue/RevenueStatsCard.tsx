import React from 'react';
import { IndianRupee, TrendingUp, Calendar, CreditCard, ArrowUpRight } from 'lucide-react';
import { RevenueStats } from '../../../types/revenue';

export default function RevenueStatsCard({
  todayRevenue,
  weeklyRevenue,
  monthlyRevenue,
  avgOrderValue
}: RevenueStats) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Today's Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">₹{todayRevenue.toLocaleString()}</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>18% from yesterday</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <IndianRupee size={20} />
        </div>
      </div>

      {/* Weekly Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Weekly Revenue</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">₹{weeklyRevenue.toLocaleString()}</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>12% from last week</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Calendar size={20} />
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monthly MRR</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">₹{monthlyRevenue.toLocaleString()}</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>9% from last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <TrendingUp size={20} />
        </div>
      </div>

      {/* Average Order Value */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Order Value</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">₹{avgOrderValue.toLocaleString()}</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>6% improvement</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <CreditCard size={20} />
        </div>
      </div>
    </div>
  );
}
