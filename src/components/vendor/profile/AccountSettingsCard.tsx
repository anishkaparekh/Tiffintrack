import React, { useState } from 'react';
import { Settings, Lock, ShieldCheck, Globe, LogOut } from 'lucide-react';

interface AccountSettingsCardProps {
  onLogoutClick: () => void;
  onPasswordChangeClick: () => void;
}

export default function AccountSettingsCard({
  onLogoutClick,
  onPasswordChangeClick
}: AccountSettingsCardProps) {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-lg bg-[#00B074]/10 text-[#00B074]">
          <Settings size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Account Credentials</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Manage authentication and localization settings</p>
        </div>
      </div>

      <div className="space-y-4 pt-1 text-xs font-semibold text-slate-500">
        {/* Change Password */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-[#1F2937] block leading-none">Security Password</span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">Update login credentials periodically</span>
          </div>
          <button
            onClick={onPasswordChangeClick}
            className="px-3.5 py-1.5 bg-[#F4F9F6] border border-[#00B074]/10 rounded-xl text-xs font-extrabold text-[#00B074] hover:bg-[#00B074]/5 transition-all cursor-pointer flex items-center space-x-1"
          >
            <Lock size={12} className="mr-0.5" />
            <span>Change</span>
          </button>
        </div>

        {/* 2FA Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-[#1F2937] block leading-none">Two-Factor Authentication</span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">Secure account logins with mobile OTP validation</span>
          </div>
          
          <button
            onClick={() => setIsTwoFactorEnabled(!isTwoFactorEnabled)}
            className={`w-10 h-5 rounded-full transition-all relative shrink-0 cursor-pointer ${
              isTwoFactorEnabled ? 'bg-[#00B074]' : 'bg-slate-300'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
              isTwoFactorEnabled ? 'right-0.75' : 'left-0.75'
            }`} />
          </button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex-1 pr-4">
            <span className="text-xs font-black text-[#1F2937] block leading-none">Language Localization</span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">Select dashboard display language</span>
          </div>
          
          <div className="relative w-28 shrink-0">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100 my-1" />

        {/* Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-red-500 block leading-none">Logout Session</span>
            <span className="text-[10px] text-slate-400 font-semibold block leading-relaxed">Terminate active credentials</span>
          </div>
          
          <button
            onClick={onLogoutClick}
            className="px-3.5 py-1.5 bg-red-50 text-[#DC2626] border border-red-200 hover:bg-red-100/30 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1"
          >
            <LogOut size={12} className="mr-0.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
