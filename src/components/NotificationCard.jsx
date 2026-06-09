import { Bell } from 'lucide-react';

export default function NotificationCard({ text, time, isRead, isLoading, onRead }) {
  if (isLoading) {
    return (
      <div className="flex items-start space-x-3 p-4 bg-white border border-slate-200/50 rounded-2xl animate-pulse">
        <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 p-4 bg-white border ${
      isRead ? 'border-slate-100' : 'border-mint/20 bg-mint-light/10'
    } rounded-2xl shadow-card transition-all duration-200`}>
      <div className={`p-2 rounded-xl flex-shrink-0 ${
        isRead ? 'bg-slate-100 text-slate-400' : 'bg-mint-light text-mint'
      }`}>
        <Bell size={16} />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-xs md:text-sm text-primary-text leading-relaxed ${
          isRead ? 'font-normal' : 'font-semibold'
        }`}>{text}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-secondary-text font-normal">{time}</span>
          {!isRead && onRead && (
            <button 
              onClick={onRead} 
              className="text-[10px] font-bold text-mint hover:underline cursor-pointer"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
