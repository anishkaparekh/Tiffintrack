import React from 'react';
import { Search, Download } from 'lucide-react';

interface CustomersFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onExport: () => void;
}

const filterOptions = [
  "All Customers",
  "Active Subscribers",
  "Paused Subscriptions",
  "Expired Subscriptions",
  "New Customers",
  "High-Value Customers"
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "lifetime_value", label: "Highest Lifetime Value" },
  { value: "orders", label: "Most Orders" },
  { value: "newest", label: "Newest Customers" }
];

export default function CustomersFilterBar({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  onExport
}: CustomersFilterBarProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1F2937]/45">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] placeholder-[#1F2937]/40 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
            placeholder="Search by customer name, email, or phone..."
          />
        </div>

        {/* Sort Selector & Export Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="relative flex-1 sm:w-52">
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-2.5 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onExport}
            className="py-2.5 px-4 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-xs font-bold text-slate-600 hover:text-[#F59E0B] flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export Customers</span>
          </button>
        </div>
      </div>

      {/* Subscription Filter Tabs */}
      <div className="border-t border-[#E5E7EB] pt-3.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Filter by Subscriber Segment</p>
        <div className="flex items-center justify-start overflow-x-auto space-x-2 pb-1 scrollbar-none">
          {filterOptions.map((opt) => {
            const isActive = selectedFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => onFilterChange(opt)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                    : 'bg-[#FFF8E7] border border-[#E5E7EB] text-slate-500 hover:text-[#F59E0B] hover:bg-[#F59E0B]/5'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
