import React from 'react';
import { CalendarRange, SearchX } from 'lucide-react';

interface EmptyStateProps {
  type: 'no_plans' | 'no_search';
  onActionClick?: () => void;
}

export default function EmptyState({ type, onActionClick }: EmptyStateProps) {
  const isNoPlans = type === 'no_plans';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center space-y-5 max-w-md mx-auto my-10 animate-scaleUp">
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#F4F9F6] border border-[#E5E7EB] text-[#00B074] flex items-center justify-center shadow-inner">
        {isNoPlans ? <CalendarRange size={28} /> : <SearchX size={28} />}
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h4 className="font-extrabold text-base text-[#1F2937] leading-snug">
          {isNoPlans ? "You haven't created any subscription plans yet." : "No plans match your search criteria."}
        </h4>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          {isNoPlans 
            ? "Configure recurring monthly meal subscription plans to secure recurring business revenue." 
            : "Try adjusting your status filters, search terms, or clearing filters to see all plans."
          }
        </p>
      </div>

      <button
        onClick={onActionClick}
        className="px-6 py-3 rounded-xl bg-[#00B074] hover:bg-[#00B074]/90 text-white font-bold text-xs shadow-md shadow-[#00B074]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        {isNoPlans ? "Create Your First Plan" : "Clear Filters"}
      </button>
    </div>
  );
}
