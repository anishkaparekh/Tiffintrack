import React from 'react';
import { Search, CheckSquare, Trash2, Filter } from 'lucide-react';
import { NotificationCategory } from '../../../types/notifications';

interface NotificationsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  unreadCount: number;
  totalCount: number;
}

export default function NotificationsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onMarkAllRead,
  onClearAll,
  unreadCount,
  totalCount
}: NotificationsFilterBarProps) {
  
  const categories = [
    { value: 'all', label: 'All Notifications' },
    { value: 'order', label: 'Orders' },
    { value: 'subscription', label: 'Subscriptions' },
    { value: 'customer', label: 'Customers' },
    { value: 'delivery', label: 'Deliveries' },
    { value: 'system', label: 'System Updates' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'high', label: 'High Priority' }
  ];

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      {/* Search and Filters row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F4F9F6] text-xs font-semibold text-[#1F2937] placeholder-slate-400 focus:outline-none focus:border-[#00B074] focus:ring-1 focus:ring-[#00B074] transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative md:col-span-4 flex items-center">
          <div className="w-full relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#1F2937] appearance-none focus:outline-none focus:border-[#00B074] focus:ring-1 focus:ring-[#00B074] transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <Filter size={12} />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative md:col-span-3 flex items-center">
          <div className="w-full relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#1F2937] appearance-none focus:outline-none focus:border-[#00B074] focus:ring-1 focus:ring-[#00B074] transition-all cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <Filter size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 border-t border-[#E5E7EB]/50">
        <div className="text-[11px] font-bold text-slate-400">
          Showing <span className="text-[#1F2937]">{totalCount}</span> notifications
          {unreadCount > 0 && (
            <>
              {' • '}
              <span className="text-[#00B074]">{unreadCount} unread</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto self-end">
          {/* Mark All Read */}
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-[11px] font-bold text-slate-600 hover:bg-[#F4F9F6] hover:text-[#00B074] hover:border-[#00B074]/30 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-[#E5E7EB] transition-all"
          >
            <CheckSquare size={13} />
            <span>Mark All Read</span>
          </button>

          {/* Clear All */}
          <button
            onClick={onClearAll}
            disabled={totalCount === 0}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl border border-red-100 bg-[#DC2626]/5 text-[11px] font-bold text-[#DC2626] hover:bg-[#DC2626]/10 disabled:opacity-40 disabled:hover:bg-[#DC2626]/5 transition-all"
          >
            <Trash2 size={13} />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
