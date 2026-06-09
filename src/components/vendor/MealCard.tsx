import React from 'react';
import { Sparkles, Edit3, ShoppingBag } from 'lucide-react';
import { Meal } from '../../types/vendor';

interface MealCardProps {
  meal: Meal;
  onEditClick?: (meal: Meal) => void;
}

export default function MealCard({ meal, onEditClick }: MealCardProps) {
  
  const getStatusBadge = (status: Meal['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Available
          </span>
        );
      case 'Limited Availability':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Limited
          </span>
        );
      case 'Unavailable':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Unavailable
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
      {/* Upper header */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <span className="bg-[#F4F9F6] text-[#00B074] border border-[#00B074]/15 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1">
            <Sparkles size={10} className="text-[#00B074]" />
            <span>{meal.category}</span>
          </span>
          {getStatusBadge(meal.status)}
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-base text-[#1F2937] leading-snug">{meal.name}</h3>
          <p className="text-xs text-slate-400 font-semibold">Weekly demand analysis</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center space-x-2 bg-[#F4F9F6] p-3 rounded-xl border border-[#E5E7EB]/50">
          <ShoppingBag size={14} className="text-[#00B074]" />
          <p className="text-xs font-bold text-[#1F2937]">
            {meal.ordersThisWeek} orders <span className="text-slate-400 font-semibold">this week</span>
          </p>
        </div>
      </div>

      {/* Footer price & controls */}
      <div className="px-5 py-4 border-t border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Price</span>
          <span className="text-lg font-black text-[#00B074]">₹{meal.price}</span>
        </div>
        <button
          onClick={() => onEditClick?.(meal)}
          className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] hover:text-[#00B074] text-[#1F2937] transition-all cursor-pointer"
          title="Edit Meal"
        >
          <Edit3 size={14} />
        </button>
      </div>
    </div>
  );
}
