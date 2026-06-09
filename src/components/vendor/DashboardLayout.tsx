import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import VendorSidebar, { SidebarTab } from './VendorSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: SidebarTab;
  onTabSelect: (tab: SidebarTab) => void;
}

export default function DashboardLayout({ children, activeTab, onTabSelect }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F9F6] text-[#1F2937] flex flex-col">
      {/* Top Navigation */}
      <TopNavbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
        onViewNotifications={() => onTabSelect('notifications')}
      />

      {/* Sidebar + Main body wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <VendorSidebar 
          activeTab={activeTab} 
          onTabSelect={onTabSelect} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
