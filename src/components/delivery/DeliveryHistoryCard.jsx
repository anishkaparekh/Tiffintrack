import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function DeliveryHistoryCard({ record }) {
  const isDelivered = record.status === 'Delivered';
  return (
    <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-card flex items-center justify-between hover:shadow-card-hover transition-all duration-200">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className="text-xs font-bold text-primary-text">{record.customerName}</h4>
          <span className="text-[9px] text-slate-400 font-medium">({record.id})</span>
        </div>
        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
          {record.meal} • {record.address}
        </p>
        <span className="text-[9px] text-slate-400 block pt-0.5">{record.date || record.createdAt}</span>
      </div>
      <div className="flex-shrink-0">
        <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider border flex items-center space-x-1 ${
          isDelivered 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {isDelivered ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
          <span>{record.status}</span>
        </span>
      </div>
    </div>
  );
}
