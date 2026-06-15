import React from 'react';
import { Compass, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ActivityLog } from './DeliveryWorkflowProvider';

interface ActivityLogCardProps {
  log: ActivityLog;
}

export default function ActivityLogCard({ log }: ActivityLogCardProps) {
  const getIcon = () => {
    switch (log.status) {
      case 'Delivered':
        return <CheckCircle2 size={12} className="text-emerald-600" />;
      case 'Failed':
        return <AlertCircle size={12} className="text-red-600" />;
      case 'Out for Delivery':
        return <Compass size={12} className="text-blue-600" />;
      default:
        return <RefreshCw size={12} className="text-slate-500" />;
    }
  };

  const getBgClass = () => {
    switch (log.status) {
      case 'Delivered':
        return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'Failed':
        return 'bg-red-50 border-red-100 text-red-700';
      case 'Out for Delivery':
        return 'bg-blue-50 border-blue-100 text-blue-700';
      default:
        return 'bg-slate-50 border-slate-200/40 text-slate-700';
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] p-4.5 rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
      <div className="space-y-1.5 flex-grow pr-4">
        <div className="flex items-center space-x-2">
          <h4 className="text-xs font-black text-[#1F2937]">{log.customerName}</h4>
          <span className="text-[9px] text-slate-400 font-bold">({log.orderId})</span>
        </div>
        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
          Transitioned to status: &nbsp;
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-flex items-center space-x-1 ${getBgClass()}`}>
            <span className="shrink-0">{getIcon()}</span>
            <span>{log.status}</span>
          </span>
        </p>
        <span className="text-[9px] text-slate-400 font-bold block pt-0.5">Rider: {log.deliveryPartner}</span>
      </div>
      <div className="flex-shrink-0 text-right text-[10px] font-bold text-slate-400">
        {log.timestamp}
      </div>
    </div>
  );
}
