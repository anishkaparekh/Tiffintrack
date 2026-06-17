import React from 'react';
import { Search } from 'lucide-react';
import { MealCategory, MealAvailability } from '../../../types/meals';

interface MealsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (availability: string) => void;
}

const categories = [
  "All Categories",
  "Traditional",
  "Jain Special",
  "North Indian",
  "South Indian",
  "Healthy Meals",
  "Family Specials",
  "Snacks",
  "Beverages"
];

const availabilities = [
  { value: "All", label: "All Availability" },
  { value: "Available", label: "Available" },
  { value: "Unavailable", label: "Unavailable" },
  { value: "Limited Availability", label: "Limited Availability" }
];

export default function MealsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAvailability,
  onAvailabilityChange
}: MealsFilterBarProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
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
            placeholder="Search meals..."
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-44">
            <select
              value={selectedAvailability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="w-full p-2.5 bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] focus:bg-white cursor-pointer"
            >
              {availabilities.map((avail) => (
                <option key={avail.value} value={avail.value}>
                  {avail.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scrolling List */}
      <div className="border-t border-[#E5E7EB] pt-3.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Filter by Cuisine Category</p>
        <div className="flex items-center justify-start overflow-x-auto space-x-2 pb-1 scrollbar-thin scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                    : 'bg-[#FFF8E7] border border-[#E5E7EB] text-slate-500 hover:text-[#F59E0B] hover:bg-[#F59E0B]/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
