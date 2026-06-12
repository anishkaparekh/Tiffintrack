import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarRange, 
  UserCheck, 
  MapPin, 
  History, 
  Bell, 
  Settings, 
  LogOut, 
  X,
  Utensils
} from 'lucide-react';

export default function Sidebar({ currentTab, onTabChange, isOpen, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vendors', label: 'Browse Vendors', icon: CalendarRange },
    { id: 'subscriptions', label: 'My Subscriptions', icon: UserCheck },
    { id: 'track_orders', label: 'Track Orders', icon: MapPin },
    { id: 'history', label: 'Order History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Clear token and customer session details on logout
    localStorage.removeItem('token');
    localStorage.removeItem('customer_user');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between w-64 bg-white border-r border-slate-200/60 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Top Section */}
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-primary-text tracking-tight">
                Tiffin<span className="text-mint">Track</span>
              </span>
            </div>
            {/* Close Button on Mobile */}
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-primary-text lg:hidden cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose(); // Auto-close drawer on mobile
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-mint text-white shadow-sm shadow-mint/10' 
                      : 'text-secondary-text hover:bg-slate-50 hover:text-primary-text'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs md:text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}
