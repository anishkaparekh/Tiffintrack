import React from 'react';
import { Plus, CalendarPlus, FileText, Users } from 'lucide-react';

interface QuickActionsProps {
  onAddMealClick: () => void;
  onCreatePlanClick: () => void;
  onViewOrdersClick: () => void;
  onManageCustomersClick: () => void;
}

export default function QuickActions({ 
  onAddMealClick, 
  onCreatePlanClick, 
  onViewOrdersClick, 
  onManageCustomersClick 
}: QuickActionsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Quick Actions</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Kitchen operational shortcuts</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onAddMealClick}
          className="py-3 px-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#F59E0B]/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={14} />
          <span className="truncate">Add New Meal</span>
        </button>

        <button
          onClick={onCreatePlanClick}
          className="py-3 px-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#F59E0B]/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <CalendarPlus size={14} />
          <span className="truncate">Create Plan</span>
        </button>

        <button
          onClick={onViewOrdersClick}
          className="py-3 px-3 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FFF8E7] text-[#1F2937] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <FileText size={14} className="text-[#F59E0B]" />
          <span className="truncate">View Orders</span>
        </button>

        <button
          onClick={onManageCustomersClick}
          className="py-3 px-3 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#FFF8E7] text-[#1F2937] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Users size={14} className="text-[#F59E0B]" />
          <span className="truncate">Customers</span>
        </button>
      </div>
    </div>
  );
}
