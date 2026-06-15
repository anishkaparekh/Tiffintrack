import React from 'react';
import DashboardLayout from '../DashboardLayout';
import { SidebarTab } from '../VendorSidebar';

interface VendorDeliveryLayoutProps {
  children: React.ReactNode;
  activeTab: 'delivery-team' | 'delivery-assignments';
}

export default function VendorDeliveryLayout({ children, activeTab }: VendorDeliveryLayoutProps) {
  return (
    <DashboardLayout activeTab={activeTab as SidebarTab} onTabSelect={() => {}}>
      <div className="space-y-6">
        {children}
      </div>
    </DashboardLayout>
  );
}
