import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import { Menu } from 'lucide-react';

export default function DeliveryLayout({ children, currentTab, onTabChange }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('Delivery Partner');

  useEffect(() => {
    const userStr = localStorage.getItem('tiffintrack_delivery_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) {
          setPartnerName(u.name);
        }
      } catch (e) {
        console.error("Failed to parse delivery partner from localStorage:", e);
      }
    }
  }, []);

  const initials = partnerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'D';

  return (
    <div className="flex h-screen bg-[#FFF8E7] font-sans overflow-hidden">
      {/* Sidebar navigation */}
      <DeliverySidebar 
        currentTab={currentTab} 
        onTabChange={onTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main content body */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto relative pb-20">
        {/* Sticky top navbar */}
        <header className="h-16 border-b border-slate-200/60 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary-text cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-slate-400">Partner Portal</span>
              <span className="text-slate-300 font-light">/</span>
              <span className="text-sm font-bold text-primary-text capitalize">
                {currentTab === 'deliveries' ? "Today's Deliveries" : currentTab}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">{partnerName}</span>
            <div className="w-8 h-8 rounded-full bg-mint-light text-mint flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Child Page Area */}
        <main className="p-6 max-w-6xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
