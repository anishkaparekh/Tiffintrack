import React from 'react';
import { ActivityFeedItem } from '../../types/vendor';

export default function ActivityCard({ text, initials, timestamp }: ActivityFeedItem) {
  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-[#FFF8E7]/50 rounded-xl transition-colors border-b border-[#E5E7EB] last:border-b-0">
      <div className="flex items-center space-x-3.5 overflow-hidden">
        {/* Avatar badge */}
        <div className="w-9 h-9 rounded-xl bg-[#FFF8E7] border border-[#E5E7EB] text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
          {initials}
        </div>
        <p className="text-xs font-semibold text-[#1F2937] leading-relaxed truncate">{text}</p>
      </div>

      <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 tracking-wide ml-3">
        {timestamp}
      </span>
    </div>
  );
}
