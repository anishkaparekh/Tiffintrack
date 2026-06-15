import React from 'react';

export default function DeliveryStatsCard({ title, value, desc, icon: Icon, colorClass }) {
  return (
    <div className="bg-white border border-slate-200/60 p-5 rounded-3xl shadow-card flex items-center justify-between hover:shadow-card-hover transition-all duration-200">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">{title}</span>
        <span className="text-2xl font-black text-primary-text block">{value}</span>
        {desc && <span className="text-[9px] text-secondary-text font-medium block">{desc}</span>}
      </div>
      <div className={`p-3 rounded-2xl ${colorClass || 'bg-slate-50 border border-slate-100 text-slate-500'} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon size={20} />}
      </div>
    </div>
  );
}
