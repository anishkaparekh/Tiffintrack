import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOutVendor } from '../../auth/session';
import { 
  LayoutDashboard, Utensils, CalendarRange, ShoppingBag, 
  Users, TrendingUp, Bell, Settings, LogOut, X, Star, Bike, ClipboardList 
} from 'lucide-react';

export type SidebarTab = 'dashboard' | 'meals' | 'plans' | 'orders' | 'customers' | 'revenue' | 'notifications' | 'profile' | 'reviews' | 'delivery-team' | 'delivery-assignments';

interface MenuItem {
  tab: SidebarTab | 'logout';
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const menuItems: MenuItem[] = [
  { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { tab: 'meals', label: 'My Meals', icon: Utensils },
  { tab: 'plans', label: 'Subscription Plans', icon: CalendarRange },
  { tab: 'orders', label: 'Orders', icon: ShoppingBag },
  { tab: 'customers', label: 'Customers', icon: Users },
  { tab: 'delivery-team', label: 'Delivery Team', icon: Bike },
  { tab: 'delivery-assignments', label: 'Assignments', icon: ClipboardList },
  { tab: 'revenue', label: 'Revenue', icon: TrendingUp },
  { tab: 'notifications', label: 'Notifications', icon: Bell },
  { tab: 'profile', label: 'Profile Settings', icon: Settings },
  { tab: 'reviews', label: 'Reviews', icon: Star }
];

interface VendorSidebarProps {
  activeTab: SidebarTab;
  onTabSelect: (tab: SidebarTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorSidebar({ activeTab, onTabSelect, isOpen, onClose }: VendorSidebarProps) {
  const navigate = useNavigate();
  
  const handleItemClick = (tab: SidebarTab | 'logout') => {
    if (tab === 'logout') {
      console.log('[VendorSidebar] Logging out vendor and redirecting to /vendor/login');
      signOutVendor();
      navigate('/vendor/login');
    } else {
      onTabSelect(tab);
      if (tab === 'dashboard') {
        navigate('/vendor-dashboard');
      } else {
        navigate(`/vendor/${tab}`);
      }
    }
    // Close sidebar on mobile/tablet after selection
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`w-64 bg-[#1F2937] text-slate-300 flex flex-col justify-between p-6 fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out lg:sticky lg:h-[calc(100vh-80px)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between lg:hidden border-b border-slate-700/50 pb-3">
            <span className="font-extrabold text-white text-sm">Navigation Menu</span>
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              
              return (
                <button
                  key={item.tab}
                  onClick={() => handleItemClick(item.tab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/15'
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="pt-6 border-t border-slate-700/50">
          <button
            onClick={() => handleItemClick('logout')}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-bold hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all text-left"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
