import React from 'react';
import { Bell, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DeliveryNotificationCard({ notification, onMarkRead }) {
  const getIcon = (category) => {
    switch (category) {
      case 'assignment':
        return <Bell size={14} className="text-blue-600" />;
      case 'unavailable':
        return <ShieldAlert size={14} className="text-red-600" />;
      case 'update':
        return <Sparkles size={14} className="text-amber-500" />;
      case 'success':
      default:
        return <CheckCircle2 size={14} className="text-emerald-600" />;
    }
  };

  const getBgClass = (category) => {
    switch (category) {
      case 'assignment':
        return 'bg-blue-50 border-blue-100/60';
      case 'unavailable':
        return 'bg-red-50 border-red-100/60';
      case 'update':
        return 'bg-amber-50 border-amber-100/60';
      case 'success':
      default:
        return 'bg-emerald-50 border-emerald-100/60';
    }
  };

  return (
    <div className={`p-4 border.5 rounded-2xl transition-all shadow-card flex items-start space-x-3.5 relative hover:border-slate-300 bg-white border-slate-200/70 hover:shadow-card-hover group ${
      !notification.isRead ? "border-l-4 border-l-mint" : ""
    }`}>
      
      {/* Icon Badge */}
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${getBgClass(notification.category)}`}>
        {getIcon(notification.category)}
      </div>

      {/* Details */}
      <div className="flex-grow space-y-1">
        <div className="flex items-center space-x-2">
          <h4 className={`text-xs ${!notification.isRead ? "font-bold text-primary-text" : "font-semibold text-slate-700"}`}>
            {notification.category.toUpperCase()} ALERT
          </h4>
          {!notification.isRead && (
            <span className="w-1.5 h-1.5 bg-mint rounded-full inline-block flex-shrink-0" title="Unread"></span>
          )}
        </div>
        <p className="text-[11px] text-secondary-text leading-relaxed">
          {notification.message}
        </p>
        <span className="text-[9px] text-slate-400 font-medium block pt-0.5">{notification.timestamp}</span>
      </div>

      {/* Mark read action button */}
      {!notification.isRead && onMarkRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="text-[9px] font-bold text-mint hover:underline absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          Mark Read
        </button>
      )}

    </div>
  );
}
