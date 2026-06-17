import React from 'react';
import { Users, SearchX } from 'lucide-react';

interface EmptyStateProps {
  type: 'no_customers' | 'no_search';
  onActionClick?: () => void;
}

export default function EmptyState({ type, onActionClick }: EmptyStateProps) {
  const isNoCustomers = type === 'no_customers';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center space-y-5 max-w-md mx-auto my-10 animate-scaleUp">
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] border border-[#E5E7EB] text-[#F59E0B] flex items-center justify-center shadow-inner">
        {isNoCustomers ? <Users size={28} /> : <SearchX size={28} />}
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h4 className="font-extrabold text-base text-[#1F2937] leading-snug">
          {isNoCustomers ? "No customers have subscribed yet." : "No customers match your search criteria."}
        </h4>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          {isNoCustomers 
            ? "Configure and share your home tiffin subscription plan links to start attracting home-cooked food subscribers." 
            : "Try adjusting your search queries, sorting selections, or subscription segments to locate specific accounts."
          }
        </p>
      </div>

      <button
        onClick={onActionClick}
        className="px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold text-xs shadow-md shadow-[#F59E0B]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        {isNoCustomers ? "Promote Your Plans" : "Clear Filters"}
      </button>
    </div>
  );
}
