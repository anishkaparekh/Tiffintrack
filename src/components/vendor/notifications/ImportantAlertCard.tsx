import React from 'react';
import { AlertTriangle, AlertCircle, ShoppingBag, CalendarRange, Truck, ChevronRight } from 'lucide-react';
import { NotificationCategory, NotificationPriority } from '../../../types/notifications';

interface AlertItem {
  id: string;
  title: string;
  category: NotificationCategory;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
}

interface ImportantAlertCardProps {
  alerts: AlertItem[];
  onSelectAlert: (id: string) => void;
}

export default function ImportantAlertCard({ alerts, onSelectAlert }: ImportantAlertCardProps) {
  
  const getAlertIcon = (cat: NotificationCategory, pri: NotificationPriority) => {
    if (pri === 'High') {
      return {
        icon: AlertCircle,
        color: 'text-[#DC2626]',
        bg: 'bg-red-50'
      };
    }
    switch (cat) {
      case 'order':
        return {
          icon: ShoppingBag,
          color: 'text-[#00B074]',
          bg: 'bg-[#00B074]/10'
        };
      case 'subscription':
        return {
          icon: CalendarRange,
          color: 'text-[#F59E0B]',
          bg: 'bg-[#F59E0B]/10'
        };
      case 'delivery':
        return {
          icon: Truck,
          color: 'text-[#DC2626]',
          bg: 'bg-red-50'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-slate-500',
          bg: 'bg-slate-50'
        };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden ring-1 ring-red-100">
      {/* Card Header */}
      <div className="bg-red-500/5 px-5 py-4 border-b border-red-100 flex items-center space-x-2">
        <AlertTriangle className="text-[#DC2626] shrink-0" size={16} />
        <h3 className="text-xs font-black text-[#DC2626] uppercase tracking-wider">
          Action Required ({alerts.length})
        </h3>
      </div>

      {/* Alerts Checklist */}
      <div className="divide-y divide-red-100/60">
        {alerts.map((alert) => {
          const meta = getAlertIcon(alert.category, alert.priority);
          const IconComponent = meta.icon;

          return (
            <div 
              key={alert.id} 
              className="p-4 hover:bg-slate-50/50 transition-colors flex items-start space-x-3 cursor-pointer group"
              onClick={() => onSelectAlert(alert.id)}
            >
              <div className={`p-2 rounded-xl shrink-0 ${meta.bg} ${meta.color}`}>
                <IconComponent size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#1F2937] leading-snug group-hover:text-[#00B074] transition-colors">
                    {alert.title}
                  </h4>
                  <ChevronRight size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5 line-clamp-2">
                  {alert.message}
                </p>
                <span className="text-[9px] text-slate-400 font-bold mt-1 block">
                  {alert.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
