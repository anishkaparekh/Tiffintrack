import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Sparkles, X, Bike } from 'lucide-react';
import VendorDeliveryLayout from '../../components/vendor/delivery/VendorDeliveryLayout';
import DeliveryStatsCard from '../../components/vendor/delivery/DeliveryStatsCard';
import DeliveryPartnerTable from '../../components/vendor/delivery/DeliveryPartnerTable';
import DeliveryPartnerCard from '../../components/vendor/delivery/DeliveryPartnerCard';
import EmptyState from '../../components/vendor/delivery/EmptyState';
import LoadingSkeleton from '../../components/vendor/delivery/LoadingSkeleton';
import NotificationBanner from '../../components/vendor/delivery/NotificationBanner';

import { 
  DeliveryPartner, 
  getStoredPartners, 
  savePartners, 
  RAJKOT_ZONES 
} from '../../data/vendorDeliveryMockData';

export default function VendorDeliveryTeam() {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  
  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<DeliveryPartner | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState<DeliveryPartner['vehicleType']>('Bike');
  const [status, setStatus] = useState<DeliveryPartner['status']>('Active');
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  // Simulation Toggles
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  useEffect(() => {
    setPartners(getStoredPartners());
  }, []);

  // Compute metrics
  const stats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter(p => p.status === 'Active').length;
    const inactive = partners.filter(p => p.status === 'Inactive').length;
    const totalDeliveries = partners.reduce((acc, p) => acc + p.todayDeliveriesCount, 0);

    return { total, active, inactive, totalDeliveries };
  }, [partners]);

  // Toggle active status
  const handleToggleStatus = (id: string) => {
    const updated = partners.map(p => {
      if (p.id === id) {
        const nextStatus: DeliveryPartner['status'] = p.status === 'Active' ? 'Inactive' : 'Active';
        triggerToast(`Partner ${p.name} marked as ${nextStatus}`, 'info');
        return { ...p, status: nextStatus };
      }
      return p;
    });
    setPartners(updated);
    savePartners(updated);
  };

  // Open modal to add partner
  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setName('');
    setPhone('');
    setEmail('');
    setVehicleType('Bike');
    setStatus('Active');
    setSelectedZones([]);
    setIsFormModalOpen(true);
  };

  // Open modal to edit partner
  const handleOpenEditModal = (partner: DeliveryPartner) => {
    setEditingPartner(partner);
    setName(partner.name);
    setPhone(partner.phone);
    setEmail(partner.email);
    setVehicleType(partner.vehicleType);
    setStatus(partner.status);
    setSelectedZones(partner.deliveryZones);
    setIsFormModalOpen(true);
  };

  // Toggle zone checklist selection
  const handleZoneToggle = (zone: string) => {
    setSelectedZones(prev => 
      prev.includes(zone) 
        ? prev.filter(z => z !== zone) 
        : [...prev, zone]
    );
  };

  // Save Partner Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || selectedZones.length === 0) {
      alert("Please fill all required fields and select at least one delivery zone.");
      return;
    }

    let updatedList: DeliveryPartner[];

    if (editingPartner) {
      // Edit Mode
      updatedList = partners.map(p => {
        if (p.id === editingPartner.id) {
          return {
            ...p,
            name,
            phone,
            email,
            vehicleType,
            status,
            deliveryZones: selectedZones
          };
        }
        return p;
      });
      triggerToast(`Saved details for ${name}`);
    } else {
      // Create Mode
      const newId = `DP-00${partners.length + 1}`;
      const newPartner: DeliveryPartner = {
        id: newId,
        name,
        phone,
        email,
        vehicleType,
        deliveryZones: selectedZones,
        status,
        todayDeliveriesCount: 0
      };
      updatedList = [...partners, newPartner];
      triggerToast(`Successfully registered ${name} 🚴`);
    }

    setPartners(updatedList);
    savePartners(updatedList);
    setIsFormModalOpen(false);
  };

  const activePartnersList = isEmpty ? [] : partners;

  return (
    <VendorDeliveryLayout activeTab="delivery-team">
      
      {/* Toast Alert popup */}
      {toastMessage && (
        <NotificationBanner 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Simulation preview panel */}
      <div className="mb-6 p-4 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md text-white border border-slate-800">
        <div className="space-y-1">
          <p className="text-[#FFD200] text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#FFD200]" />
            <span>Operational Sandbox Toggles</span>
          </p>
          <h3 className="font-bold text-xs text-slate-100">Simulate team states for review</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            Toggle skeletons and empty states to verify loader templates and empty placeholders.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-300">Loading Skeletons</span>
            <button
              onClick={() => setIsLoading(!isLoading)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isLoading ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isLoading ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>

          <div className="w-[1px] h-6 bg-slate-700" />

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-slate-300">Empty State</span>
            <button
              onClick={() => setIsEmpty(!isEmpty)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isEmpty ? 'bg-[#00B074]' : 'bg-slate-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                isEmpty ? 'right-0.75' : 'left-0.75'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1F2937]">Delivery Team Management</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Register, manage, and coordinate your own home delivery team members.</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="py-3 px-5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-[#00B074]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Delivery Partner</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      {isLoading ? (
        <LoadingSkeleton type="stats" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DeliveryStatsCard 
            title="Total Delivery Partners" 
            value={`${stats.total} Riders`}
            desc="Total registered staff"
            icon={Bike}
            colorClass="bg-blue-50 border border-blue-100 text-blue-600"
          />
          <DeliveryStatsCard 
            title="Active Partners" 
            value={`${stats.active} Active`}
            desc="Riders currently available"
            icon={Bike}
            colorClass="bg-emerald-50 border border-emerald-100 text-emerald-600"
          />
          <DeliveryStatsCard 
            title="Inactive Partners" 
            value={`${stats.inactive} Inactive`}
            desc="Riders off-duty"
            icon={Bike}
            colorClass="bg-slate-100 border border-slate-200 text-slate-500"
          />
          <DeliveryStatsCard 
            title="Today's Deliveries" 
            value={`${stats.totalDeliveries} Runs`}
            desc="Total loads assigned today"
            icon={Bike}
            colorClass="bg-amber-50 border border-amber-100 text-amber-600"
          />
        </div>
      )}

      {/* Main Table section */}
      {isLoading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : activePartnersList.length === 0 ? (
        <EmptyState 
          type="partners" 
          onActionClick={handleOpenAddModal} 
          actionText="Add New Delivery Partner" 
        />
      ) : (
        <DeliveryPartnerTable 
          partners={activePartnersList} 
          onView={setSelectedPartner} 
          onEdit={handleOpenEditModal} 
          onToggleStatus={handleToggleStatus}
          onAssignClick={(p) => triggerToast(`Navigating to assignments for ${p.name}...`, 'info')}
        />
      )}

      {/* Detail Popover card */}
      {selectedPartner && (
        <DeliveryPartnerCard 
          partner={selectedPartner} 
          onClose={() => setSelectedPartner(null)} 
        />
      )}

      {/* Add / Edit Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#1F2937]">
                {editingPartner ? 'Edit Delivery Partner details' : 'Register New Delivery Partner'}
              </h3>
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-500">
              
              <div className="space-y-1">
                <label className="uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                  placeholder="e.g. Rahul Patel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                    placeholder="e.g. +91 98250 12345"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                    placeholder="e.g. rahul.patel@tiffintrack.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Vehicle Type *</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as DeliveryPartner['vehicleType'])}
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                  >
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Walking">Walking</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider">Availability Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DeliveryPartner['status'])}
                    className="w-full p-3 bg-[#F4F9F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#00B074] focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Delivery Zone checkboxes */}
              <div className="space-y-2">
                <label className="uppercase tracking-wider block">Assigned Delivery Zones * (Select at least one)</label>
                <div className="grid grid-cols-2 gap-2 bg-[#F4F9F6] p-4.5 rounded-xl border border-[#E5E7EB] max-h-[140px] overflow-y-auto">
                  {RAJKOT_ZONES.map((zone) => {
                    const isChecked = selectedZones.includes(zone);
                    return (
                      <div key={zone} className="flex items-center space-x-2">
                        <input
                          id={`zone-${zone}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleZoneToggle(zone)}
                          className="h-3.5 w-3.5 text-[#00B074] border-slate-300 rounded focus:ring-[#00B074] cursor-pointer"
                        />
                        <label 
                          htmlFor={`zone-${zone}`}
                          className="text-[10px] font-semibold text-[#1F2937] cursor-pointer select-none"
                        >
                          {zone.replace(', Rajkot', '')}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-[#1F2937] font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs transition-colors cursor-pointer shadow-md text-center"
                >
                  {editingPartner ? 'Save Changes' : 'Register Partner'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </VendorDeliveryLayout>
  );
}
