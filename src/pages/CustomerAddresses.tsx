import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Plus, Utensils, MapPin, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

// Sidebar
import Sidebar from '../components/Sidebar';

// Data Mock Type
import { Address } from '../data/addressMockData';

// Custom Components
import AddressList from '../components/customer/addresses/AddressList';
import AddressForm from '../components/customer/addresses/AddressForm';

export default function CustomerAddresses() {
  const navigate = useNavigate();

  // Mobile sidebar layout drawer status
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentEditAddress, setCurrentEditAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Sandbox Override States
  const [forceLoadingState, setForceLoadingState] = useState(false);
  const [emptyAddresses, setEmptyAddresses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Banner message state
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    const userStr = localStorage.getItem('customer_user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      setIsLoading(false);
      return;
    }
    try {
      const u = JSON.parse(userStr);
      const customerId = u._id || u.id;
      if (!customerId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/addresses/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map((addr: any) => ({
            id: addr._id,
            label: addr.landmark || 'Address',
            fullName: addr.fullName,
            phone: addr.phoneNumber,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            area: addr.landmark || addr.city,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            landmark: addr.landmark || '',
            deliveryInstructions: '',
            isDefault: addr.isDefault
          }));
          setAddresses(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Auto-clear banner messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'dashboard') {
      navigate('/customer-dashboard');
    } else if (tabId === 'vendors') {
      navigate('/browse-vendors');
    } else if (tabId === 'subscriptions') {
      navigate('/my-subscriptions');
    } else if (tabId === 'track_orders') {
      navigate('/track-orders');
    } else if (tabId === 'history') {
      navigate('/order-history');
    } else if (tabId === 'settings') {
      navigate('/profile-settings');
    } else if (tabId === 'notifications') {
      navigate('/notifications');
    } else if (tabId === 'addresses') {
      // already here
    } else {
      navigate('/customer-dashboard');
    }
  };

  // CRUD Trigger wrappers
  const handleSave = async (addressData: Omit<Address, 'id'> & { id?: string }) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const backendPayload = {
      fullName: addressData.fullName,
      phoneNumber: addressData.phone,
      addressLine1: addressData.addressLine1,
      addressLine2: addressData.addressLine2,
      landmark: addressData.label || addressData.landmark,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      isDefault: addressData.isDefault,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
    };

    try {
      let response;
      if (addressData.id) {
        // Edit mode (PUT)
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/addresses/${addressData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(backendPayload)
        });
      } else {
        // Create mode (POST)
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(backendPayload)
        });
      }

      const resData = await response.json();
      if (response.ok && resData.success) {
        setMessage({ 
          type: 'success', 
          text: addressData.id 
            ? `Address "${addressData.label}" updated successfully!` 
            : `New address "${addressData.label}" added successfully!` 
        });
        fetchAddresses();
        setShowForm(false);
        setCurrentEditAddress(null);
      } else {
        setMessage({ type: 'error', text: resData.message || 'Failed to save address.' });
      }
    } catch (err) {
      console.error('Failed to save address:', err);
      setMessage({ type: 'error', text: 'An error occurred while saving the address.' });
    }
  };

  const handleEditTrigger = (address: Address) => {
    setCurrentEditAddress(address);
    setShowForm(true);
  };

  const handleDeleteTrigger = async (id: string) => {
    const target = addresses.find(a => a.id === id);
    if (!target) return;
    
    if (window.confirm(`Are you sure you want to delete the address "${target.label}"?`)) {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/addresses/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const resData = await response.json();
        if (response.ok && resData.success) {
          setMessage({ type: 'success', text: `Address "${target.label}" deleted successfully.` });
          fetchAddresses();
        } else {
          setMessage({ type: 'error', text: resData.message || 'Failed to delete address.' });
        }
      } catch (err) {
        console.error('Failed to delete address:', err);
        setMessage({ type: 'error', text: 'An error occurred while deleting the address.' });
      }
    }
  };

  const handleSetDefaultTrigger = async (id: string) => {
    const target = addresses.find(a => a.id === id);
    if (!target) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/addresses/${id}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setMessage({ type: 'success', text: `"${target.label}" set as your default delivery address.` });
        fetchAddresses();
      } else {
        setMessage({ type: 'error', text: resData.message || 'Failed to set default address.' });
      }
    } catch (err) {
      console.error('Failed to set default address:', err);
      setMessage({ type: 'error', text: 'An error occurred while setting the default address.' });
    }
  };

  const handleResetSandbox = () => {
    fetchAddresses();
    setMessage({ type: 'success', text: 'Reloaded addresses from backend.' });
  };

  const activeLoading = isLoading || forceLoadingState;
  const activeAddresses = emptyAddresses ? [] : addresses;

  return (
    <div className="flex h-screen bg-snow font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab="addresses" 
        onTabChange={handleTabChange} 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Panel Content Area */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200/60 h-16 flex justify-between items-center px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-secondary-text hover:text-primary-text rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center shadow-sm">
                <Utensils className="text-white" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-primary-text">Portal Manager</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Developer Sandbox Controls */}
            <div className="hidden md:flex items-center space-x-2.5 border border-slate-200/50 bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
              <span className="text-slate-450 uppercase text-[9px] tracking-wider">Sandbox Panel:</span>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={forceLoadingState} 
                  onChange={(e) => setForceLoadingState(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Skeletons</span>
              </label>
              
              <label className="flex items-center space-x-1 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emptyAddresses} 
                  onChange={(e) => setEmptyAddresses(e.target.checked)} 
                  className="rounded border-slate-350 text-mint focus:ring-mint"
                />
                <span>Empty Lists</span>
              </label>

              <button 
                onClick={handleResetSandbox}
                className="px-2 py-0.5 border border-slate-200 bg-white hover:bg-slate-100 rounded text-[9px] text-slate-700 transition cursor-pointer flex items-center gap-1 font-bold"
              >
                <RefreshCw size={10} />
                <span>Reset Storage</span>
              </button>
            </div>
            <span className="text-xs font-semibold text-secondary-text bg-slate-150 px-3 py-1 rounded-lg">My Addresses</span>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 max-w-5xl w-full mx-auto space-y-6 flex-grow">
          
          {/* Section Page Intro Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-2">
            <div>
              <h1 className="text-2xl font-black text-primary-text tracking-tight flex items-center gap-2">
                <MapPin size={24} className="text-mint" />
                <span>My Addresses</span>
              </h1>
              <p className="text-xs text-secondary-text mt-0.5 font-medium">
                Manage your saved delivery locations for reliable homestyle meal deliveries.
              </p>
            </div>

            {!showForm && (
              <button 
                onClick={() => {
                  setCurrentEditAddress(null);
                  setShowForm(true);
                }}
                className="py-2.5 px-4 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Add New Address</span>
              </button>
            )}
          </div>

          {/* Banner alert messages */}
          {message && (
            <div className={`p-4 rounded-xl flex items-start space-x-3 border shadow-sm transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-mint-light border-mint/20 text-mint' 
                : 'bg-red-50 border-red-200 text-red-650'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              )}
              <span className="text-xs font-semibold flex-grow">{message.text}</span>
              <button 
                onClick={() => setMessage(null)} 
                className="text-slate-400 hover:text-slate-650 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form and List Layout */}
          <div className="space-y-6">
            {showForm ? (
              <AddressForm
                address={currentEditAddress}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setCurrentEditAddress(null);
                }}
              />
            ) : (
              <AddressList
                addresses={activeAddresses}
                isLoading={activeLoading}
                onEdit={handleEditTrigger}
                onDelete={handleDeleteTrigger}
                onSetDefault={handleSetDefaultTrigger}
              />
            )}
          </div>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/60 py-6 text-center mt-12 shrink-0">
          <div className="max-w-6xl mx-auto px-4 text-[10px] text-slate-400 font-bold space-y-1">
            <div>TiffinTrack Address Management Panel</div>
            <div>© 2026 TiffinTrack. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </div>
  );
}
