import React from 'react';

interface DeliveryStatsCardProps {
  title: string;
  value: string | number;
  desc?: string;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  colorClass?: string;
}

export default function DeliveryStatsCard({ title, value, desc, icon: Icon, colorClass }: DeliveryStatsCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
      <div className="space-y-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block leading-tight">{title}</span>
        <span className="text-2xl font-black text-[#1F2937] block">{value}</span>
        {desc && <span className="text-[10px] text-slate-400 font-semibold block">{desc}</span>}
      </div>
      <div className={`p-3 rounded-xl ${colorClass || 'bg-slate-50 border border-slate-100 text-slate-500'} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon size={20} />}
      </div>
    </div>
  );
}
