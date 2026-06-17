import React from 'react';
import { Users, BookOpen, Star, IndianRupee } from 'lucide-react';
import { InsightsSnapshot } from '../../../types/profile';

export default function BusinessInsightsCard({
  totalCustomers,
  activePlans,
  rating,
  monthlyRevenue
}: InsightsSnapshot) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Kitchen Performance Snapshot</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">High-level aggregates of your tiffin service</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Customers */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] shrink-0">
            <Users size={14} />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Customers</span>
            <span className="text-xs font-black text-[#1F2937]">{totalCustomers} Users</span>
          </div>
        </div>

        {/* Active Plans */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <BookOpen size={14} />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Active Tiers</span>
            <span className="text-xs font-black text-[#1F2937]">{activePlans} Plans</span>
          </div>
        </div>

        {/* Rating */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-500 shrink-0">
            <Star size={14} className="fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Kitchen Rating</span>
            <span className="text-xs font-black text-[#1F2937]">{rating} / 5</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A] shrink-0">
            <IndianRupee size={14} />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Monthly MRR</span>
            <span className="text-xs font-black text-[#1F2937]">₹{monthlyRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
