import React from 'react';
import { CalendarRange, Calendar } from 'lucide-react';
import { DeliveryScheduleItem } from '../../../types/orders';

interface DeliveryScheduleCardProps {
  scheduleItems: DeliveryScheduleItem[];
}

export default function DeliveryScheduleCard({ scheduleItems }: DeliveryScheduleCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
          <CalendarRange size={16} className="text-[#F59E0B] mr-1.5 shrink-0" />
          <span>Delivery Schedule</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold">Today's scheduled delivery slots</p>
      </div>

      <div className="relative pl-5 space-y-4 pt-1">
        {/* Connecting Vertical line */}
        <div className="absolute left-[7px] top-1.5 bottom-1.5 w-[2px] bg-slate-100" />

        {scheduleItems.map((item, idx) => (
          <div key={idx} className="relative flex items-start space-x-3.5 group">
            {/* Timeline dot */}
            <div className="absolute -left-[23px] w-3.5 h-3.5 rounded-full bg-white border-2 border-[#F59E0B] flex items-center justify-center z-10 transition-colors group-hover:bg-[#F59E0B]">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>

            {/* Slot Details */}
            <div className="flex-1 p-3 bg-slate-50/50 hover:bg-[#FFF8E7] border border-[#E5E7EB]/50 hover:border-[#F59E0B]/30 rounded-xl transition-all flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Time Slot</span>
                <span className="text-xs font-black text-[#1F2937]">{item.timeSlot}</span>
              </div>
              
              <div className="text-right shrink-0">
                <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-black px-2.5 py-1 rounded-lg">
                  {item.orderCount} Orders
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
