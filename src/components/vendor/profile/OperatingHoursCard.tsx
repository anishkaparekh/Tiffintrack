import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { OperatingHours } from '../../../types/profile';

interface OperatingHoursCardProps {
  hours: OperatingHours;
  onUpdateClick: () => void;
}

export default function OperatingHoursCard({ hours, onUpdateClick }: OperatingHoursCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
            <Clock size={16} className="text-[#F59E0B] mr-1.5 shrink-0" />
            <span>Operating Hours</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Kitchen operating and delivery slots schedule</p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {/* Monday - Friday */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-[#1F2937]">Monday – Friday</span>
            <span className="text-[9px] text-slate-400 font-bold block uppercase">Weekdays slot</span>
          </div>
          <div className="text-right text-[11px] font-semibold text-slate-600 space-y-1">
            <div className="flex items-center space-x-1 justify-end">
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Lunch</span>
              <span>{hours.mondayFriday.lunch.openTime} – {hours.mondayFriday.lunch.closeTime}</span>
            </div>
            <div className="flex items-center space-x-1 justify-end">
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Dinner</span>
              <span>{hours.mondayFriday.dinner.openTime} – {hours.mondayFriday.dinner.closeTime}</span>
            </div>
          </div>
        </div>

        {/* Saturday */}
        <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-[#1F2937]">Saturday</span>
            <span className="text-[9px] text-slate-400 font-bold block uppercase">Weekend slot</span>
          </div>
          <div className="text-right text-[11px] font-semibold text-slate-600 space-y-1">
            <div className="flex items-center space-x-1 justify-end">
              <span className="bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Lunch</span>
              <span>{hours.saturday.lunch.openTime} – {hours.saturday.lunch.closeTime}</span>
            </div>
            <div className="flex items-center space-x-1 justify-end">
              <span className="bg-red-50 text-red-500 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Dinner</span>
              <span>Closed</span>
            </div>
          </div>
        </div>

        {/* Sunday */}
        <div className="flex justify-between items-center p-3 bg-red-50/20 border border-red-100/30 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-slate-500">Sunday</span>
            <span className="text-[9px] text-slate-400 font-bold block uppercase">Weekly off</span>
          </div>
          <div className="text-right text-[10px] font-extrabold text-red-500 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span>Closed</span>
          </div>
        </div>
      </div>

      <button
        onClick={onUpdateClick}
        className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-xs font-bold text-slate-600 hover:text-[#F59E0B] transition-all cursor-pointer text-center"
      >
        Update Timings
      </button>
    </div>
  );
}
