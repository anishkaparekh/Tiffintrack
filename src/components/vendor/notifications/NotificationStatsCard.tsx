import React from 'react';
import { Bell, BellRing, AlertTriangle, Calendar } from 'lucide-react';
import { NotificationStats } from '../../../types/notifications';

interface NotificationStatsCardProps {
  stats: NotificationStats;
}

export default function NotificationStatsCard({ stats }: NotificationStatsCardProps) {
  const { total, unread, highPriorityAlerts, todayCount } = stats;

  const cardItems = [
    {
      title: 'Total Notifications',
      value: `${total} Notifications`,
      icon: Bell,
      color: 'text-[#00B074]',
      bg: 'bg-[#00B074]/10',
      border: 'border-[#E5E7EB]'
    },
    {
      title: 'Unread Notifications',
      value: `${unread} Unread`,
      icon: BellRing,
      color: 'text-[#2563EB]',
      bg: 'bg-[#2563EB]/10',
      border: 'border-[#E5E7EB]'
    },
    {
      title: 'High Priority Alerts',
      value: `${highPriorityAlerts} Alerts`,
      icon: AlertTriangle,
      color: 'text-[#DC2626]',
      bg: 'bg-[#DC2626]/10',
      border: highPriorityAlerts > 0 ? 'border-red-200 ring-1 ring-red-100' : 'border-[#E5E7EB]',
      highlight: highPriorityAlerts > 0
    },
    {
      title: 'Notifications Today',
      value: `${todayCount} Today`,
      icon: Calendar,
      color: 'text-[#F59E0B]',
      bg: 'bg-[#F59E0B]/10',
      border: 'border-[#E5E7EB]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between transition-all duration-300 hover:shadow-md ${
              item.border
            } ${item.highlight ? 'bg-red-50/20' : ''}`}
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {item.title}
              </span>
              <h3 className="text-lg md:text-xl font-black text-[#1F2937] leading-tight transition-all">
                {item.value}
              </h3>
              {item.title === 'High Priority Alerts' && highPriorityAlerts > 0 && (
                <span className="text-[9px] font-extrabold text-[#DC2626] bg-red-100/40 px-2 py-0.5 rounded-full inline-block mt-1 animate-pulse">
                  Immediate Action Required
                </span>
              )}
            </div>

            <div className={`w-11 h-11 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 border border-[#E5E7EB]/30 transition-transform hover:scale-105`}>
              <IconComponent size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
