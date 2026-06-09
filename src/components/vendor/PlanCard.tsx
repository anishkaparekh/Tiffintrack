import React from 'react';
import { Users, Shield, Settings } from 'lucide-react';
import { SubscriptionPlan } from '../../types/vendor';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onEditClick?: (plan: SubscriptionPlan) => void;
}

export default function PlanCard({ plan, onEditClick }: PlanCardProps) {
  
  const getStatusBadge = (status: SubscriptionPlan['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Active
          </span>
        );
      case 'Flexible':
        return (
          <span className="bg-[#00B074]/10 text-[#00B074] border border-[#00B074]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Flexible
          </span>
        );
      case 'Inactive':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
      {/* Header Info */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <h3 className="font-extrabold text-base text-[#1F2937] leading-snug">{plan.name}</h3>
          {getStatusBadge(plan.status)}
        </div>

        {/* Pricing details */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Billed Monthly</span>
          <p className="text-2xl font-black text-[#1F2937]">{plan.price}</p>
        </div>

        {/* Stats segment */}
        <div className="flex items-center space-x-3 p-3 bg-[#F4F9F6] rounded-xl border border-[#E5E7EB]/50">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB]/40 flex items-center justify-center text-[#00B074] shrink-0 shadow-sm">
            <Users size={14} />
          </div>
          <div>
            <p className="text-xs font-black text-[#1F2937]">{plan.subscribersCount} Active Subscribers</p>
            <p className="text-[10px] text-slate-400 font-semibold">Automatic renewals</p>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold uppercase">
          <Shield size={12} className="text-[#00B074]" />
          <span>FSSAI Vetted</span>
        </div>
        <button
          onClick={() => onEditClick?.(plan)}
          className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] hover:text-[#00B074] text-xs font-bold text-[#1F2937] transition-all flex items-center space-x-1 cursor-pointer"
        >
          <Settings size={12} />
          <span>Configure</span>
        </button>
      </div>
    </div>
  );
}
