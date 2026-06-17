import React, { useState } from 'react';
import { 
  Sparkles, Edit2, Info, MoreVertical, 
  CheckCircle, XCircle, Copy, Trash2, ShoppingBag 
} from 'lucide-react';
import { MealItem } from '../../../types/meals';

interface MealCardProps {
  meal: MealItem;
  onEdit: (meal: MealItem) => void;
  onView: (meal: MealItem) => void;
  onStatusChange: (id: string, status: MealItem['status']) => void;
  onDuplicate: (meal: MealItem) => void;
  onDelete: (id: string) => void;
}

export default function MealCard({ 
  meal, 
  onEdit, 
  onView, 
  onStatusChange, 
  onDuplicate, 
  onDelete 
}: MealCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getStatusBadge = (status: MealItem['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
            <span>Available</span>
          </span>
        );
      case 'Limited Availability':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-pulse" />
            <span>Limited</span>
          </span>
        );
      case 'Unavailable':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            <span>Unavailable</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getDietBadge = (type: MealItem['type']) => {
    return (
      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
        type === 'Jain' 
          ? 'bg-amber-100/70 text-amber-800 border border-amber-200/50' 
          : 'bg-[#FFF8E7] text-[#F59E0B] border border-[#F59E0B]/20'
      }`}>
        {type}
      </span>
    );
  };

  const handleActionClick = (actionType: string) => {
    setShowDropdown(false);
    switch (actionType) {
      case 'mark_available':
        onStatusChange(meal.id, 'Available');
        break;
      case 'mark_unavailable':
        onStatusChange(meal.id, 'Unavailable');
        break;
      case 'duplicate':
        onDuplicate(meal);
        break;
      case 'delete':
        onDelete(meal.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all relative">
      {/* Upper Section */}
      <div>
        {/* Mock Image Area */}
        <div className="h-40 bg-[#FFF8E7] border-b border-[#E5E7EB] flex items-center justify-center text-[#F59E0B]/30 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#F59E0B]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300 select-none">🍱</span>
          
          {/* Badge overlays */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {getDietBadge(meal.type)}
          </div>

          <div className="absolute top-3 right-3">
            {getStatusBadge(meal.status)}
          </div>
        </div>

        {/* Details Area */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">{meal.category}</span>
              <h3 className="font-extrabold text-base text-[#1F2937] leading-snug mt-0.5">{meal.name}</h3>
            </div>
            
            {/* Dropdown Menu Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#1F2937] hover:bg-[#FFF8E7] transition-colors cursor-pointer"
              >
                <MoreVertical size={16} />
              </button>

              {showDropdown && (
                <>
                  <div onClick={() => setShowDropdown(false)} className="fixed inset-0 z-10" />
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 animate-fadeIn">
                    <button 
                      onClick={() => handleActionClick('mark_available')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#F59E0B] transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle size={14} className="text-[#16A34A]" />
                      <span>Mark Available</span>
                    </button>
                    <button 
                      onClick={() => handleActionClick('mark_unavailable')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#DC2626] transition-colors flex items-center space-x-2"
                    >
                      <XCircle size={14} className="text-[#DC2626]" />
                      <span>Mark Unavailable</span>
                    </button>
                    <button 
                      onClick={() => handleActionClick('duplicate')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#FFF8E7] hover:text-[#F59E0B] transition-colors flex items-center space-x-2"
                    >
                      <Copy size={14} className="text-[#F59E0B]" />
                      <span>Duplicate Meal</span>
                    </button>
                    <div className="border-t border-[#E5E7EB] my-1" />
                    <button 
                      onClick={() => handleActionClick('delete')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>Delete Meal</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 min-h-[32px]">
            {meal.description}
          </p>

          {/* Orders this week counter */}
          <div className="flex items-center space-x-2 pt-1">
            <div className="flex items-center space-x-1 text-slate-400 text-xs font-bold">
              <ShoppingBag size={12} className="text-[#F59E0B]" />
              <span>{meal.weeklyOrders} orders <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wide">This Week</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="px-5 py-4 border-t border-[#E5E7EB] bg-slate-50/50 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Price</span>
          <span className="text-lg font-black text-[#F59E0B]">₹{meal.price}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(meal)}
            className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-xs font-bold text-slate-600 hover:text-[#F59E0B] transition-all cursor-pointer"
          >
            Details
          </button>
          <button
            onClick={() => onEdit(meal)}
            className="px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white text-xs font-bold shadow-sm shadow-[#F59E0B]/10 transition-all cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
