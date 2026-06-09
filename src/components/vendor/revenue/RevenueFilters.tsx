import React from 'react';
import { Download, CalendarDays } from 'lucide-react';

interface RevenueFiltersProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onExport: () => void;
}

const dateRanges = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "This Year"
];

const revenueSources = [
  "All Revenue",
  "Subscription Revenue",
  "One-Time Orders",
  "Family Plans",
  "Custom Plans"
];

export default function RevenueFilters({
  selectedRange,
  onRangeChange,
  selectedSource,
  onSourceChange,
  onExport
}: RevenueFiltersProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Date Range Dropdown */}
        <div className="relative flex items-center space-x-2.5 flex-1 max-w-xs">
          <CalendarDays size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value)}
            className="w-full p-2.5 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white cursor-pointer"
          >
            {dateRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] text-xs font-bold text-slate-600 hover:text-[#00B074] flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <Download size={14} />
          <span>Export Revenue Report</span>
        </button>
      </div>

      {/* Revenue Source Filter Tabs */}
      <div className="border-t border-[#E5E7EB] pt-3.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Filter by Earnings Channel</p>
        <div className="flex items-center justify-start overflow-x-auto space-x-2 pb-1 scrollbar-none">
          {revenueSources.map((source) => {
            const isActive = selectedSource === source;
            return (
              <button
                key={source}
                onClick={() => onSourceChange(source)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#00B074] text-white shadow-sm shadow-[#00B074]/10' 
                    : 'bg-[#F4F9F6] border border-[#E5E7EB] text-slate-500 hover:text-[#00B074] hover:bg-[#00B074]/5'
                }`}
              >
                {source}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
