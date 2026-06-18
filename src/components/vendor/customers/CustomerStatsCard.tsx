import React from 'react';
import { Users, UserPlus, Heart, Award, ArrowUpRight } from 'lucide-react';

interface CustomerStatsCardProps {
  totalCustomers: number;
  activeSubscribers: number;
  newCustomersThisMonth: number;
  avgRetentionRate: number;
}

export default function CustomerStatsCard({
  totalCustomers,
  activeSubscribers,
  newCustomersThisMonth,
  avgRetentionRate
}: CustomerStatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Customers */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Customers</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{totalCustomers} Customers</h3>
          <p className="text-xs font-semibold text-slate-400">Unique consumer accounts</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Users size={20} />
        </div>
      </div>

      {/* Active Subscribers */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Subscribers</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{activeSubscribers} Users</h3>
          <p className="text-xs font-semibold text-[#16A34A]">Recurring meal buyers</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Heart size={20} />
        </div>
      </div>

      {/* New Customers */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">New Customers</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{newCustomersThisMonth} Customers</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>22% from last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <UserPlus size={20} />
        </div>
      </div>

      {/* Average Retention */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Retention Rate</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{avgRetentionRate}%</h3>
          <p className="text-xs font-semibold text-slate-400">Average renewal rate</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Award size={20} />
        </div>
      </div>
    </div>
  );
}
