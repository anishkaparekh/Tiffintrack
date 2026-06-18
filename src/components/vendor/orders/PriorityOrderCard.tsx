import React from 'react';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { OrderItem } from '../../../types/orders';

interface PriorityOrderCardProps {
  priorityOrders: OrderItem[];
  onViewDetails: (order: OrderItem) => void;
}

export default function PriorityOrderCard({ priorityOrders, onViewDetails }: PriorityOrderCardProps) {
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center space-x-1 bg-red-50 text-[#DC2626] border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full animate-ping" />
            <span>High Priority</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-[#F59E0B] border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
            <span>Medium Priority</span>
          </span>
        );
      case 'On Track':
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-[#16A34A] border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
            <span>On Track</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
            <AlertCircle size={16} className="text-[#DC2626] mr-1.5 shrink-0" />
            <span>Priority Attention</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold">Orders due shortly requiring kitchen preparation</p>
        </div>
        <span className="bg-red-50 text-[#DC2626] text-[10px] font-black px-2.5 py-1 rounded-lg">
          {priorityOrders.length} Alert{priorityOrders.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {priorityOrders.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-[#E5E7EB] rounded-xl bg-slate-50/50">
            <p className="text-xs font-bold text-slate-400">All orders are currently on track!</p>
          </div>
        ) : (
          priorityOrders.map((order) => (
            <div 
              key={order.id}
              onClick={() => onViewDetails(order)}
              className="group flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-[#FFF8E7] border border-[#E5E7EB]/50 hover:border-[#F59E0B]/30 rounded-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col space-y-1.5 overflow-hidden pr-2">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-black text-[#1F2937]">{order.id}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs font-extrabold text-[#1F2937] truncate">{order.customerName}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold">
                  <Clock size={12} className="text-slate-400" />
                  <span>Due: {order.deliveryTime}</span>
                  {order.remainingMinutes !== undefined && (
                    <span className={`font-black ${order.priority === 'High' ? 'text-[#DC2626]' : 'text-slate-500'}`}>
                      ({order.remainingMinutes} mins left)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                {getPriorityBadge(order.priority)}
                <button className="p-1 rounded-lg text-slate-400 group-hover:text-[#F59E0B] group-hover:bg-white border border-transparent group-hover:border-[#E5E7EB] transition-all">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
