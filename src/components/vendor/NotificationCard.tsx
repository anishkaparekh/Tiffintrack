import React from 'react';
import { AlertCircle, AlertTriangle, Info, BellRing } from 'lucide-react';
import { SystemNotification } from '../../types/vendor';

export default function NotificationCard({ text, priority }: SystemNotification) {
  
  const getPriorityStyle = () => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50/55',
          border: 'border-red-200/60',
          text: 'text-[#DC2626]',
          icon: AlertCircle
        };
      case 'medium':
        return {
          bg: 'bg-[#F59E0B]/5',
          border: 'border-[#F59E0B]/20',
          text: 'text-[#F59E0B]',
          icon: AlertTriangle
        };
      case 'info':
        return {
          bg: 'bg-emerald-50/50',
          border: 'border-emerald-200/50',
          text: 'text-[#16A34A]',
          icon: Info
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-[#E5E7EB]',
          text: 'text-slate-500',
          icon: BellRing
        };
    }
  };

  const styles = getPriorityStyle();
  const IconComponent = styles.icon;

  return (
    <div className={`p-4 rounded-xl border flex items-start space-x-3.5 transition-all ${styles.bg} ${styles.border}`}>
      <div className={`p-1.5 rounded-lg bg-white shadow-sm ${styles.text} shrink-0`}>
        <IconComponent size={16} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-[#1F2937] leading-relaxed">{text}</p>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
          Priority: {priority}
        </p>
      </div>
    </div>
  );
}
