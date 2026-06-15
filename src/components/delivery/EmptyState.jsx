import React from 'react';
import { Bell, MapPin, History } from 'lucide-react';

export default function EmptyState({ type, message }) {
  const getIcon = () => {
    switch (type) {
      case 'notifications':
        return <Bell className="text-slate-400" size={32} />;
      case 'history':
        return <History className="text-slate-400" size={32} />;
      case 'deliveries':
      default:
        return <MapPin className="text-slate-400" size={32} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'notifications':
        return 'No Alerts';
      case 'history':
        return 'No History Records';
      case 'deliveries':
      default:
        return 'All Caught Up!';
    }
  };

  return (
    <div className="py-12 text-center bg-white border border-slate-200/60 rounded-3xl shadow-card space-y-4 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
        {getIcon()}
      </div>
      <div className="space-y-1 px-4">
        <h3 className="text-sm font-bold text-primary-text">{getTitle()}</h3>
        <p className="text-xs text-secondary-text max-w-xs mx-auto leading-relaxed">
          {message || "You're all caught up! New deliveries will appear here soon 🚴🍱"}
        </p>
      </div>
    </div>
  );
}
