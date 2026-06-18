import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { NotificationPreferences } from '../../../types/notifications';

interface NotificationPreferencesCardProps {
  preferences: NotificationPreferences;
}

export default function NotificationPreferencesCard({ preferences }: NotificationPreferencesCardProps) {
  const navigate = useNavigate();

  const settingsList = [
    { label: 'Order Alerts', enabled: preferences.orderAlerts },
    { label: 'Subscription Renewals', enabled: preferences.subscriptionRenewals },
    { label: 'Delivery Updates', enabled: preferences.deliveryUpdates },
    { label: 'Customer Messages', enabled: preferences.customerMessages },
    { label: 'Weekly Reports', enabled: preferences.weeklyReports },
    { label: 'Marketing Updates', enabled: preferences.marketingUpdates }
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5 space-y-4">
      {/* Card Header */}
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-[#FFF8E7] text-[#F59E0B]">
          <Settings size={16} />
        </div>
        <div>
          <h3 className="text-xs font-black text-[#1F2937] uppercase tracking-wider">
            Preferences Summary
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">
            Configured in Profile settings
          </p>
        </div>
      </div>

      {/* Settings Grid/List */}
      <div className="grid grid-cols-1 gap-2.5">
        {settingsList.map((setting, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-[#FFF8E7]/30 text-xs font-semibold text-[#1F2937]"
          >
            <span>{setting.label}</span>
            <div className="flex items-center space-x-1.5 shrink-0">
              {setting.enabled ? (
                <>
                  <CheckCircle2 size={14} className="text-[#16A34A]" />
                  <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-wider">Enabled</span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Disabled</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation CTA */}
      <button
        onClick={() => navigate('/vendor/profile')}
        className="w-full mt-2.5 flex items-center justify-center space-x-1.5 py-3 rounded-xl border border-[#F59E0B] hover:bg-[#F59E0B] hover:text-white text-[11px] font-extrabold text-[#F59E0B] transition-all group"
      >
        <span>Manage Preferences</span>
        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
