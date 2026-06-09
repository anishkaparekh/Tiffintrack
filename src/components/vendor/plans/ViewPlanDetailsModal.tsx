import React from 'react';
import { X, CalendarRange, Users, IndianRupee, Clock, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PlanItem, PlanStatus } from '../../../types/plans';

interface ViewPlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanItem | null;
}

export default function ViewPlanDetailsModal({ isOpen, onClose, plan }: ViewPlanDetailsModalProps) {
  if (!isOpen || !plan) return null;

  const maxSubscribers = 100; // Mock capacity limit
  const fillPercentage = Math.min((plan.subscriberCount / maxSubscribers) * 100, 100);

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse" />
            <span>Active</span>
          </span>
        );
      case 'Paused':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 bg-[#F59E0B] rounded-full" />
            <span>Paused</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 bg-slate-400 rounded-full" />
            <span>Draft</span>
          </span>
        );
      case 'Archived':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-2 h-2 bg-[#DC2626] rounded-full" />
            <span>Archived</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarRange className="text-[#00B074]" size={20} />
            <h3 className="font-extrabold text-base text-[#1F2937]">Plan Configuration Details</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Plan Name & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F9F6]/50 p-4 rounded-xl border border-[#E5E7EB]/40">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{plan.mealsPerWeek} / week</span>
              <h2 className="text-lg font-black text-[#1F2937] leading-tight">{plan.name}</h2>
            </div>
            {getStatusBadge(plan.status)}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Plan Description</h4>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-[#E5E7EB]/30">
              {plan.description}
            </p>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#00B074]/10 text-[#00B074]">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Subscribers</span>
                <span className="text-sm font-black text-[#1F2937]">{plan.subscriberCount} Users</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl flex items-center space-x-3.5 shadow-sm">
              <div className="p-2.5 rounded-xl bg-[#00B074]/10 text-[#00B074]">
                <IndianRupee size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated MRR</span>
                <span className="text-sm font-black text-[#1F2937]">₹{plan.revenueGenerated.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Included Menu Items */}
          {plan.includedMeals && plan.includedMeals.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Included Menu Items</h4>
              <div className="flex flex-wrap gap-2">
                {plan.includedMeals.map((meal, idx) => (
                  <span 
                    key={idx}
                    className="bg-[#F4F9F6] text-[#00B074] border border-[#00B074]/15 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                  >
                    <CheckCircle2 size={12} />
                    <span>{meal}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Limits / Capacity */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="uppercase tracking-wider">Kitchen Capacity Fill</span>
              <span className="text-[#1f2937]">{plan.subscriberCount} / {maxSubscribers} Users</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#00B074] h-full rounded-full transition-all duration-500" 
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
              <Award size={12} className="text-[#00B074]" />
              <span>Recommended limit based on home chef tiffin delivery kitchen capacity.</span>
            </p>
          </div>

          {/* Details Metadata List */}
          <div className="border-t border-[#E5E7EB] pt-4 grid grid-cols-2 gap-y-3 text-xs font-semibold text-slate-500">
            <div className="flex items-center space-x-2">
              <Clock size={14} className="text-slate-400" />
              <span>Billing Cycle: <strong className="text-[#1F2937]">{plan.duration}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <IndianRupee size={14} className="text-slate-400" />
              <span>Rate: <strong className="text-[#1F2937]">{plan.monthlyPrice}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#00B074]/15 transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
