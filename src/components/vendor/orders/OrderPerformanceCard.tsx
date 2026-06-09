import React from 'react';
import { Award, Timer, ShieldCheck, Heart } from 'lucide-react';
import { OrderPerformance } from '../../../types/orders';

interface OrderPerformanceCardProps {
  performance: OrderPerformance;
}

export default function OrderPerformanceCard({ performance }: OrderPerformanceCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
          <Award size={16} className="text-[#00B074] mr-1.5 shrink-0" />
          <span>Kitchen Performance KPIs</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold">Real-time delivery & preparation metrics</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* On-Time Delivery */}
        <div className="p-3 bg-slate-50/50 border border-[#E5E7EB]/50 rounded-xl space-y-1.5 text-center flex flex-col items-center justify-between">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-[#16A34A] shrink-0 border border-[#16A34A]/10">
            <ShieldCheck size={14} />
          </div>
          <div>
            <span className="text-sm font-black text-[#1F2937]">{performance.onTimeDeliveryRate}%</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5 leading-tight">On-Time Rate</span>
          </div>
        </div>

        {/* Avg Prep Time */}
        <div className="p-3 bg-slate-50/50 border border-[#E5E7EB]/50 rounded-xl space-y-1.5 text-center flex flex-col items-center justify-between">
          <div className="p-1.5 rounded-lg bg-amber-50 text-[#F59E0B] shrink-0 border border-amber-200/10">
            <Timer size={14} />
          </div>
          <div>
            <span className="text-sm font-black text-[#1F2937]">{performance.avgPrepMinutes}m</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5 leading-tight">Avg Prep Time</span>
          </div>
        </div>

        {/* CSAT Score */}
        <div className="p-3 bg-slate-50/50 border border-[#E5E7EB]/50 rounded-xl space-y-1.5 text-center flex flex-col items-center justify-between">
          <div className="p-1.5 rounded-lg bg-red-50 text-[#DC2626] shrink-0 border border-red-200/10">
            <Heart size={14} />
          </div>
          <div>
            <span className="text-sm font-black text-[#1F2937]">{performance.csatScore}/5</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5 leading-tight">Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
