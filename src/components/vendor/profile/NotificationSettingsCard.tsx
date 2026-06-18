import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationToggles } from '../../../types/profile';

interface NotificationSettingsCardProps {
  initialToggles: NotificationToggles;
  onToggleChange?: (toggles: NotificationToggles) => void;
}

export default function NotificationSettingsCard({
  initialToggles,
  onToggleChange
}: NotificationSettingsCardProps) {
  const [toggles, setToggles] = useState<NotificationToggles>(initialToggles);

  const handleToggle = (key: keyof NotificationToggles) => {
    const updated = {
      ...toggles,
      [key]: !toggles[key]
    };
    setToggles(updated);
    if (onToggleChange) onToggleChange(updated);
  };

  const toggleOptions = [
    { key: "newOrders" as keyof NotificationToggles, label: "New Orders", desc: "Get notified immediately when a customer orders." },
    { key: "subscriptionRenewals" as keyof NotificationToggles, label: "Subscription Renewals", desc: "Know when members renew billing cycles." },
    { key: "deliveryReminders" as keyof NotificationToggles, label: "Delivery Reminders", desc: "Logistics notifications for allocated couriers." },
    { key: "customerMessages" as keyof NotificationToggles, label: "Customer Messages", desc: "Receive alerts for chef query messages." },
    { key: "weeklyReports" as keyof NotificationToggles, label: "Weekly Business Reports", desc: "Receive MRR earnings analytics directly." },
    { key: "marketingUpdates" as keyof NotificationToggles, label: "Marketing Updates", desc: "News on upcoming platform features." }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
          <Bell size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Notification Preferences</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Customize alerts channels and frequencies</p>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {toggleOptions.map((opt) => {
          const isActive = toggles[opt.key];
          return (
            <div key={opt.key} className="flex items-center justify-between space-x-4">
              <div className="space-y-0.5 flex-1 pr-4">
                <span className="text-xs font-black text-[#1F2937] block leading-none">{opt.label}</span>
                <span className="text-[10px] text-slate-400 font-semibold leading-relaxed block">{opt.desc}</span>
              </div>

              {/* Custom Toggle Switch */}
              <button
                onClick={() => handleToggle(opt.key)}
                className={`w-10 h-5 rounded-full transition-all relative shrink-0 cursor-pointer ${
                  isActive ? 'bg-[#F59E0B]' : 'bg-slate-300'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                  isActive ? 'right-0.75' : 'left-0.75'
                }`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
