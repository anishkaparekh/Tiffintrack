import React from 'react';
import { Bike, Bell, CalendarClock } from 'lucide-react';

interface EmptyStateProps {
  type: 'deliveries' | 'notifications' | 'logs';
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'notifications':
        return <Bell className="text-slate-400" size={32} />;
      case 'logs':
        return <CalendarClock className="text-slate-400" size={32} />;
      case 'deliveries':
      default:
        return <Bike className="text-slate-400" size={32} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'notifications':
        return 'All Caught Up!';
      case 'logs':
        return 'No Activity Logs Yet';
      case 'deliveries':
      default:
        return 'No Active Deliveries';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'notifications':
        return 'You have no new alerts. Operational updates will appear here.';
      case 'logs':
        return 'Operational status logs and transition histories will be logged here.';
      case 'deliveries':
      default:
        return 'There are no active dispatches registered on your schedule today.';
    }
  };

  return (
    <div className="py-12 text-center bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-4 max-w-md mx-auto w-full p-6">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
        {getIcon()}
      </div>
      <div className="space-y-1 px-4">
        <h3 className="text-sm font-black text-[#1F2937]">{getTitle()}</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold text-center">
          {message || getDefaultMessage()}
        </p>
      </div>
    </div>
  );
}
