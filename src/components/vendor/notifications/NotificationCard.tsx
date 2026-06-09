import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, CalendarRange, Users, Truck, Info, Settings,
  MoreVertical, Check, CheckSquare, Square, Eye, Archive, Trash2, Pin, X
} from 'lucide-react';
import { NotificationItem, NotificationCategory } from '../../../types/notifications';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onViewDetails: (notification: NotificationItem) => void;
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onArchive,
  onViewDetails
}: NotificationCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { id, category, title, message, timestamp, priority, read, pinned } = notification;

  // Category Icon & Styling mappings
  const getCategoryMeta = (cat: NotificationCategory) => {
    switch (cat) {
      case 'order':
        return {
          icon: ShoppingBag,
          color: 'text-[#00B074]',
          bg: 'bg-[#00B074]/10',
          label: 'Order'
        };
      case 'subscription':
        return {
          icon: CalendarRange,
          color: 'text-[#2563EB]',
          bg: 'bg-[#2563EB]/10',
          label: 'Subscription'
        };
      case 'customer':
        return {
          icon: Users,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          label: 'Customer'
        };
      case 'delivery':
        return {
          icon: Truck,
          color: 'text-[#F59E0B]',
          bg: 'bg-[#F59E0B]/10',
          label: 'Delivery'
        };
      case 'system':
      default:
        return {
          icon: Info,
          color: 'text-[#6B7280]',
          bg: 'bg-slate-100',
          label: 'System'
        };
    }
  };

  const getPriorityStyle = (pri: typeof priority) => {
    switch (pri) {
      case 'High':
        return 'bg-red-50 text-[#DC2626] border-red-100';
      case 'Medium':
        return 'bg-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/15';
      case 'Info':
      default:
        return 'bg-blue-50 text-[#2563EB] border-blue-100';
    }
  };

  const categoryMeta = getCategoryMeta(category);
  const CategoryIcon = categoryMeta.icon;

  const handleDropdownAction = (action: () => void) => {
    action();
    setShowDropdown(false);
  };

  const handleBottomSheetAction = (action: () => void) => {
    action();
    setShowBottomSheet(false);
  };

  const triggerOptions = () => {
    if (window.innerWidth < 768) {
      setShowBottomSheet(true);
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <>
      <div 
        className={`relative p-4 md:p-5 rounded-2xl border transition-all ${
          read 
            ? 'bg-white border-[#E5E7EB] hover:shadow-sm' 
            : 'bg-[#F4F9F6] border-[#00B074]/20 shadow-sm hover:border-[#00B074]/30'
        } ${pinned ? 'ring-1 ring-[#FFD200]/40' : ''}`}
      >
        {/* Pinned Icon */}
        {pinned && (
          <div className="absolute top-3 right-10 flex items-center space-x-1 text-[#F59E0B] bg-[#FFD200]/10 px-2 py-0.5 rounded-full">
            <Pin size={10} className="fill-[#F59E0B]" />
            <span className="text-[8px] font-black uppercase tracking-wider">Pinned</span>
          </div>
        )}

        <div className="flex items-start space-x-3.5">
          {/* Unread indicator dot */}
          {!read && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00B074]" />
          )}

          {/* Category Icon */}
          <div className={`p-2.5 rounded-xl ${categoryMeta.bg} ${categoryMeta.color} shrink-0`}>
            <CategoryIcon size={18} />
          </div>

          {/* Notification Info */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {categoryMeta.label}
              </span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityStyle(priority)}`}>
                {priority}
              </span>
            </div>

            <h4 className={`text-xs md:text-sm font-black text-[#1F2937] leading-snug ${read ? '' : 'font-extrabold'}`}>
              {title}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
              {message}
            </p>

            <span className="text-[10px] font-bold text-slate-400 mt-2 block">
              {timestamp}
            </span>

            {/* Desktop Action Buttons Row */}
            <div className="hidden md:flex items-center space-x-3 mt-3.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => onViewDetails(notification)}
                className="flex items-center space-x-1 text-[11px] font-bold text-[#00B074] hover:text-[#00B074]/85 transition-colors"
              >
                <Eye size={12} />
                <span>View Details</span>
              </button>

              <div className="w-[1px] h-3 bg-slate-200" />

              <button
                onClick={() => read ? onMarkUnread(id) : onMarkRead(id)}
                className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 hover:text-[#1F2937] transition-colors"
              >
                {read ? (
                  <>
                    <Square size={12} />
                    <span>Mark as Unread</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={12} />
                    <span>Mark as Read</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options Trigger (Dropdown / Bottom Sheet) */}
          <div className="absolute right-3.5 top-3.5 md:right-4 md:top-4" ref={dropdownRef}>
            <button
              onClick={triggerOptions}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#1F2937] transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {/* Desktop Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 text-xs font-semibold text-slate-600 animate-fadeIn">
                <button
                  onClick={() => handleDropdownAction(() => onViewDetails(notification))}
                  className="w-full px-4 py-2 hover:bg-[#F4F9F6] hover:text-[#00B074] text-left flex items-center space-x-2"
                >
                  <Eye size={13} />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleDropdownAction(() => read ? onMarkUnread(id) : onMarkRead(id))}
                  className="w-full px-4 py-2 hover:bg-[#F4F9F6] hover:text-[#00B074] text-left flex items-center space-x-2"
                >
                  <Check size={13} />
                  <span>Mark as {read ? 'Unread' : 'Read'}</span>
                </button>
                <button
                  onClick={() => handleDropdownAction(() => onArchive(id))}
                  className="w-full px-4 py-2 hover:bg-[#F4F9F6] hover:text-[#00B074] text-left flex items-center space-x-2"
                >
                  <Archive size={13} />
                  <span>Archive Notification</span>
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  onClick={() => handleDropdownAction(() => onDelete(id))}
                  className="w-full px-4 py-2 hover:bg-red-50 text-[#DC2626] text-left flex items-center space-x-2"
                >
                  <Trash2 size={13} />
                  <span>Delete Notification</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Actions Menu */}
      {showBottomSheet && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-end justify-center md:hidden animate-fadeIn">
          {/* Backdrop Touch Area to close */}
          <div className="absolute inset-0" onClick={() => setShowBottomSheet(false)} />
          
          {/* Sheet Body */}
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl relative z-10 flex flex-col space-y-4 max-w-lg animate-slideUp border-t border-[#E5E7EB]">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{categoryMeta.label} Notification</span>
                <h3 className="text-xs font-black text-[#1F2937] mt-0.5 line-clamp-1">{title}</h3>
              </div>
              <button 
                onClick={() => setShowBottomSheet(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Actions list */}
            <div className="space-y-1.5 py-1">
              <button
                onClick={() => handleBottomSheetAction(() => onViewDetails(notification))}
                className="w-full p-3.5 bg-slate-50 hover:bg-[#F4F9F6] rounded-xl flex items-center space-x-3 text-xs font-bold text-[#1F2937] transition-all"
              >
                <Eye size={16} className="text-[#00B074]" />
                <span>View Full Details</span>
              </button>

              <button
                onClick={() => handleBottomSheetAction(() => read ? onMarkUnread(id) : onMarkRead(id))}
                className="w-full p-3.5 bg-slate-50 hover:bg-[#F4F9F6] rounded-xl flex items-center space-x-3 text-xs font-bold text-[#1F2937] transition-all"
              >
                <Check size={16} className="text-[#00B074]" />
                <span>Mark as {read ? 'Unread' : 'Read'}</span>
              </button>

              <button
                onClick={() => handleBottomSheetAction(() => onArchive(id))}
                className="w-full p-3.5 bg-slate-50 hover:bg-[#F4F9F6] rounded-xl flex items-center space-x-3 text-xs font-bold text-[#1F2937] transition-all"
              >
                <Archive size={16} className="text-[#2563EB]" />
                <span>Archive Notification</span>
              </button>

              <button
                onClick={() => handleBottomSheetAction(() => onDelete(id))}
                className="w-full p-3.5 bg-red-50 hover:bg-red-100/80 rounded-xl flex items-center space-x-3 text-xs font-bold text-[#DC2626] transition-all"
              >
                <Trash2 size={16} />
                <span>Delete Notification</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowBottomSheet(false)}
              className="w-full py-3 rounded-xl border border-[#E5E7EB] text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
