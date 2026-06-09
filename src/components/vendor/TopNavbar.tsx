import React, { useState } from 'react';
import { Search, Bell, Menu, X, ArrowUpRight } from 'lucide-react';
import { mockProfile, mockNotifications } from '../../data/vendorMockData';

interface TopNavbarProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
  onViewNotifications: () => void;
}

export default function TopNavbar({ onMenuToggle, isSidebarOpen, onViewNotifications }: TopNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  return (
    <nav className="h-20 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-[#F4F9F6] rounded-lg text-[#1F2937] transition-all"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B074] flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-[#00B074]/20">
            TT
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-[#1F2937]">Tiffin<span className="text-[#00B074]">Track</span></span>
              <span className="bg-[#00B074]/10 text-[#00B074] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#00B074]/20">V2.0</span>
            </div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider -mt-1">Vendor Dashboard</span>
          </div>
        </div>
      </div>

      {/* Middle: Search Bar (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1F2937]/40">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-sm text-[#1F2937] placeholder-[#1F2937]/40 focus:outline-none focus:border-[#00B074] focus:bg-white transition-all font-medium"
            placeholder="Search meals, subscribers or orders..."
          />
        </div>
      </div>

      {/* Right Actions: Notifications + User profile */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notifications Icon & Popup */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2.5 text-[#1F2937] hover:text-[#00B074] hover:bg-[#F4F9F6] rounded-xl transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full" />
          </button>

          {showNotificationPopup && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-[#E5E7EB]">
                <h4 className="font-bold text-sm text-[#1F2937]">Alerts & Updates</h4>
                <button 
                  onClick={() => {
                    setShowNotificationPopup(false);
                    onViewNotifications();
                  }}
                  className="text-[10px] text-[#00B074] font-bold uppercase hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-[#E5E7EB] max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-[#F4F9F6] flex items-start space-x-2.5 transition-colors">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.priority === 'high' ? 'bg-[#DC2626]' : n.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'
                    }`} />
                    <p className="text-xs text-[#1F2937] font-semibold leading-relaxed flex-1">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-[#E5E7EB] hidden sm:block" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 hover:bg-[#F4F9F6] p-1.5 pr-3 rounded-xl transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B074] to-[#16A34A] text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-[#00B074]/10">
              {mockProfile.initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[#1F2937] leading-tight">{mockProfile.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{mockProfile.role}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2.5 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#1F2937]">{mockProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{mockProfile.role}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F4F9F6] transition-colors"
                >
                  My Profile Settings
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1F2937] hover:bg-[#F4F9F6] transition-colors"
                >
                  Payout Details
                </button>
                <div className="border-t border-[#E5E7EB] my-1" />
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
