import React from 'react';
import { Bike, MapPin, ClipboardCheck, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'partners' | 'deliveries' | 'assignments' | 'search';
  message?: string;
  onActionClick?: () => void;
  actionText?: string;
}

export default function EmptyState({ type, message, onActionClick, actionText }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'partners':
        return <Bike className="text-slate-400" size={32} />;
      case 'deliveries':
        return <MapPin className="text-slate-400" size={32} />;
      case 'assignments':
        return <ClipboardCheck className="text-slate-400" size={32} />;
      case 'search':
      default:
        return <Search className="text-slate-400" size={32} />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'partners':
        return 'No Delivery Partners Registered';
      case 'deliveries':
        return 'No Deliveries Tracked Today';
      case 'assignments':
        return 'No Assignments Pending';
      case 'search':
      default:
        return 'No Matches Found';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'partners':
        return 'Your delivery team is ready to spread homemade happiness 🚴🍱';
      case 'deliveries':
        return 'No subscription orders are active for delivery right now.';
      case 'assignments':
        return 'Awesome! All of today\'s meals have been assigned to delivery partners.';
      case 'search':
      default:
        return 'Try adjusting your search filters to find what you are looking for.';
    }
  };

  return (
    <div className="py-12 text-center bg-white border border-[#E5E7EB] rounded-2xl shadow-sm space-y-4 max-w-xl mx-auto w-full p-6">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
        {getIcon()}
      </div>
      <div className="space-y-1 px-4">
        <h3 className="text-sm font-black text-[#1F2937]">{getTitle()}</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
          {message || getDefaultMessage()}
        </p>
      </div>
      {onActionClick && actionText && (
        <button
          onClick={onActionClick}
          className="px-4 py-2 bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#F59E0B]/10 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
