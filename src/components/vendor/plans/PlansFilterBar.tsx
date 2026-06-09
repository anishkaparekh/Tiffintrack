import React from 'react';
import { Search } from 'lucide-react';
import { PlanStatus } from '../../../types/plans';

interface PlansFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const statuses = [
  "All Plans",
  "Active",
  "Paused",
  "Draft",
  "Archived"
];

const sortOptions = [
  { value: "subscribers", label: "Most Subscribers" },
  { value: "revenue", label: "Highest Revenue" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" }
];

export default function PlansFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedSort,
  onSortChange
}: PlansFilterBarProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1F2937]/45">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] placeholder-[#1F2937]/40 focus:outline-none focus:border-[#00B074] focus:bg-white transition-all"
            placeholder="Search plans..."
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-44">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2.5 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs (Horizontal Scrollable) */}
      <div className="border-t border-[#E5E7EB] pt-3.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Filter by Subscription State</p>
        <div className="flex items-center justify-start overflow-x-auto space-x-2 pb-1 scrollbar-none">
          {statuses.map((status) => {
            const isActive = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#00B074] text-white shadow-sm shadow-[#00B074]/10' 
                    : 'bg-[#F4F9F6] border border-[#E5E7EB] text-slate-500 hover:text-[#00B074] hover:bg-[#00B074]/5'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
