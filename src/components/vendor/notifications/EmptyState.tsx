import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Search, XCircle, Home } from 'lucide-react';

type EmptyStateType = 'no_notifications' | 'no_search_results';

interface EmptyStateProps {
  type: EmptyStateType;
  onClearFilters?: () => void;
}

export default function EmptyState({ type, onClearFilters }: EmptyStateProps) {
  const navigate = useNavigate();

  const isNoNotifications = type === 'no_notifications';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-4.5 max-w-lg mx-auto shadow-sm">
      {/* Icon Graphic */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
        isNoNotifications 
          ? 'bg-[#00B074]/10 text-[#00B074]' 
          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
      }`}>
        {isNoNotifications ? (
          <CheckCircle2 size={32} className="stroke-[1.5]" />
        ) : (
          <Search size={32} className="stroke-[1.5]" />
        )}
      </div>

      {/* Message Text */}
      <div className="space-y-1">
        <h3 className="text-sm md:text-base font-black text-[#1F2937]">
          {isNoNotifications ? "You're All Caught Up" : "No Match Found"}
        </h3>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm">
          {isNoNotifications 
            ? "You're all caught up. No notifications to display." 
            : "No notifications match your search query or filter options."}
        </p>
      </div>

      {/* CTA Button */}
      {isNoNotifications ? (
        <button
          onClick={() => navigate('/vendor-dashboard')}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#00B074] hover:bg-[#00B074]/90 text-white text-xs font-black rounded-xl shadow-md shadow-[#00B074]/15 hover:shadow-lg transition-all"
        >
          <Home size={14} />
          <span>Go to Dashboard</span>
        </button>
      ) : (
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 px-5 py-2.5 border border-[#00B074] hover:bg-[#F4F9F6] text-[#00B074] text-xs font-black rounded-xl transition-all"
        >
          <XCircle size={14} />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
