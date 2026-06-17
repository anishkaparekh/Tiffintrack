import React, { useState } from 'react';
import { 
  Sparkles, Edit2, Info, MoreVertical, 
  Play, Pause, Copy, Archive, Trash2, Users, IndianRupee, Clock, ShieldCheck
} from 'lucide-react';
import { PlanItem, PlanStatus } from '../../../types/plans';

interface PlanCardProps {
  plan: PlanItem;
  onEdit: (plan: PlanItem) => void;
  onView: (plan: PlanItem) => void;
  onStatusChange: (id: string, status: PlanStatus) => void;
  onDuplicate: (plan: PlanItem) => void;
  onDelete: (id: string) => void;
}

export default function PlanCard({
  plan,
  onEdit,
  onView,
  onStatusChange,
  onDuplicate,
  onDelete
}: PlanCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
            <span>Active</span>
          </span>
        );
      case 'Paused':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-pulse" />
            <span>Paused</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            <span>Draft</span>
          </span>
        );
      case 'Archived':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            <span>Archived</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleActionClick = (actionType: string) => {
    setShowDropdown(false);
    switch (actionType) {
      case 'activate':
        onStatusChange(plan.id, 'Active');
        break;
      case 'pause':
        onStatusChange(plan.id, 'Paused');
        break;
      case 'archive':
        onStatusChange(plan.id, 'Archived');
        break;
      case 'duplicate':
        onDuplicate(plan);
        break;
      case 'delete':
        onDelete(plan.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative">
      {/* Upper Section */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">{plan.mealsPerWeek} / week</span>
            <h3 className="font-extrabold text-base text-[#1F2937] leading-snug">{plan.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(plan.status)}
            
            {/* Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] transition-colors cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>

              {showDropdown && (
                <>
                  <div onClick={() => setShowDropdown(false)} className="fixed inset-0 z-10" />
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 animate-fadeIn">
                    {plan.status !== 'Active' && (
                      <button 
                        onClick={() => handleActionClick('activate')}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#F59E0B] transition-colors flex items-center space-x-2"
                      >
                        <Play size={14} className="text-[#16A34A]" />
                        <span>Activate Plan</span>
                      </button>
                    )}
                    {plan.status === 'Active' && (
                      <button 
                        onClick={() => handleActionClick('pause')}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#F59E0B] transition-colors flex items-center space-x-2"
                      >
                        <Pause size={14} className="text-[#F59E0B]" />
                        <span>Pause Plan</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleActionClick('duplicate')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#F59E0B] transition-colors flex items-center space-x-2"
                    >
                      <Copy size={14} className="text-[#F59E0B]" />
                      <span>Duplicate Plan</span>
                    </button>
                    <button 
                      onClick={() => handleActionClick('archive')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-slate-900 transition-colors flex items-center space-x-2"
                    >
                      <Archive size={14} className="text-slate-400" />
                      <span>Archive Plan</span>
                    </button>
                    <div className="border-t border-[#E5E7EB] my-1" />
                    <button 
                      onClick={() => handleActionClick('delete')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>Delete Plan</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          {plan.description}
        </p>

        {/* Included meals tags */}
        {plan.includedMeals && plan.includedMeals.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Included Menu Items</span>
            <div className="flex flex-wrap gap-1.5">
              {plan.includedMeals.map((meal, idx) => (
                <span 
                  key={idx}
                  className="bg-[#FFF8E7] text-[#F59E0B] border border-[#F59E0B]/15 px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  {meal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Analytics counts indicators */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-[#FFF8E7]/50 border border-[#E5E7EB]/40 rounded-xl flex items-center space-x-2.5 shadow-inner">
            <Users size={14} className="text-[#F59E0B]" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Subscribers</span>
              <span className="text-xs font-extrabold text-[#1F2937]">{plan.subscriberCount} Users</span>
            </div>
          </div>

          <div className="p-3 bg-[#FFF8E7]/50 border border-[#E5E7EB]/40 rounded-xl flex items-center space-x-2.5 shadow-inner">
            <IndianRupee size={14} className="text-[#F59E0B]" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Revenue</span>
              <span className="text-xs font-extrabold text-[#1F2937]">₹{plan.revenueGenerated.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs">
          <Clock size={12} className="text-[#F59E0B]" />
          <span className="font-extrabold text-[#1F2937]">{plan.monthlyPrice}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">({plan.duration})</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(plan)}
            className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-xs font-bold text-slate-600 hover:text-[#F59E0B] transition-all cursor-pointer"
          >
            Details
          </button>
          <button
            onClick={() => onEdit(plan)}
            className="px-3.5 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white text-xs font-bold shadow-sm shadow-[#F59E0B]/10 transition-all cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
