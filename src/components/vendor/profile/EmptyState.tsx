import React from 'react';
import { UserX, Map } from 'lucide-react';

interface EmptyStateProps {
  type: 'missing_info' | 'no_delivery_areas';
  onActionClick?: () => void;
}

export default function EmptyState({ type, onActionClick }: EmptyStateProps) {
  const isMissingInfo = type === 'missing_info';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center space-y-5 max-w-md mx-auto my-10 animate-scaleUp">
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] border border-[#E5E7EB] text-[#F59E0B] flex items-center justify-center shadow-inner">
        {isMissingInfo ? <UserX size={28} /> : <Map size={28} />}
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h4 className="font-extrabold text-base text-[#1F2937] leading-snug">
          {isMissingInfo ? "Complete your profile to build trust with customers." : "Add delivery locations to start receiving customer orders."}
        </h4>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          {isMissingInfo 
            ? "Enter your kitchen details, specialties, contact parameters, and years of experience to launch your profile." 
            : "Without delivery coverage locations set, customers will not see your kitchen listed in search results."
          }
        </p>
      </div>

      <button
        onClick={onActionClick}
        className="px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold text-xs shadow-md shadow-[#F59E0B]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        {isMissingInfo ? "Complete Profile" : "Add Delivery Areas"}
      </button>
    </div>
  );
}
