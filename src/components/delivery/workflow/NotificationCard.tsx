import React from 'react';
import { Bell, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { WorkflowNotification } from './DeliveryWorkflowProvider';

interface NotificationCardProps {
  notification: WorkflowNotification;
  onRead?: (id: string) => void;
}

export default function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info size={14} className="text-blue-600" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-600" />;
      case 'success':
      default:
        return <CheckCircle2 size={14} className="text-emerald-600" />;
    }
  };

  const getBgClass = () => {
    switch (notification.type) {
      case 'info':
        return 'bg-blue-50 border-blue-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      case 'success':
      default:
        return 'bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className={`p-4 border border-[#E5E7EB] rounded-2xl transition-all shadow-sm flex items-start space-x-3.5 relative bg-white hover:border-slate-300 hover:shadow-md group ${
      !notification.isRead ? "border-l-4 border-l-[#00B074]" : ""
    }`}>
      
      {/* Icon Badge */}
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${getBgClass()}`}>
        {getIcon()}
      </div>

      {/* Details */}
      <div className="flex-grow space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className={`text-xs ${!notification.isRead ? "font-black text-[#1F2937]" : "font-bold text-slate-500"} uppercase tracking-wider`}>
            {notification.title}
          </h4>
          {!notification.isRead && (
            <span className="w-1.5 h-1.5 bg-[#00B074] rounded-full inline-block flex-shrink-0" title="Unread"></span>
          )}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
          {notification.message}
        </p>
        <span className="text-[9px] text-slate-400 font-bold block pt-0.5">{notification.timestamp}</span>
      </div>

      {/* Action Button */}
      {!notification.isRead && onRead && (
        <button
          onClick={() => onRead(notification.id)}
          className="text-[9px] font-bold text-[#00B074] hover:underline absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          Mark Read
        </button>
      )}

    </div>
  );
}
