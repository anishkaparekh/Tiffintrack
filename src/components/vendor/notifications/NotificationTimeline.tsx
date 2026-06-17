import React from 'react';
import { NotificationItem } from '../../../types/notifications';
import NotificationCard from './NotificationCard';
import { Calendar } from 'lucide-react';

interface NotificationTimelineProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onViewDetails: (notification: NotificationItem) => void;
}

export default function NotificationTimeline({
  notifications,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onArchive,
  onViewDetails
}: NotificationTimelineProps) {
  
  // Group notifications chronologically
  const groupNotifications = (items: NotificationItem[]) => {
    const groups: { Today: NotificationItem[]; Yesterday: NotificationItem[]; Earlier: NotificationItem[] } = {
      Today: [],
      Yesterday: [],
      Earlier: []
    };

    items.forEach((item) => {
      const ts = item.timestamp.toLowerCase();
      if (ts.includes('minute') || ts.includes('hour') || ts.includes('today') || ts === 'just now') {
        groups.Today.push(item);
      } else if (ts.includes('yesterday')) {
        groups.Yesterday.push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return groups;
  };

  const grouped = groupNotifications(notifications);

  const renderGroup = (title: string, items: NotificationItem[]) => {
    if (items.length === 0) return null;

    return (
      <div key={title} className="relative space-y-4">
        {/* Timeline Group Header */}
        <div className="flex items-center space-x-2.5 z-10 relative">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-slate-400 shadow-xs">
            <Calendar size={13} className="text-[#F59E0B]" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#1F2937] bg-[#FFF8E7] pr-4">
            {title} ({items.length})
          </span>
        </div>

        {/* Timeline Cards with Left Vertical Connection Line */}
        <div className="pl-4 md:pl-6 border-l-2 border-slate-200/60 ml-3.5 md:ml-4 space-y-4.5 pb-2">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline Connector Bullet */}
              <div className="absolute -left-[21px] md:-left-[29px] top-5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white ring-4 ring-[#FFF8E7]" />
              
              <NotificationCard
                notification={item}
                onMarkRead={onMarkRead}
                onMarkUnread={onMarkUnread}
                onDelete={onDelete}
                onArchive={onArchive}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderGroup('Today', grouped.Today)}
      {renderGroup('Yesterday', grouped.Yesterday)}
      {renderGroup('Earlier', grouped.Earlier)}
    </div>
  );
}
