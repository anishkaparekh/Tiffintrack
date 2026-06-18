import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || '');
      setPhoneNumber(initialData.phoneNumber || '');
      setAddressLine1(initialData.addressLine1 || '');
      setAddressLine2(initialData.addressLine2 || '');
      setLandmark(initialData.landmark || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setPincode(initialData.pincode || '');
      setIsDefault(initialData.isDefault || false);
    } else {
      setFullName('');
      setPhoneNumber('');
      setAddressLine1('');
      setAddressLine2('');
      setLandmark('');
      setCity('Anand');
      setState('Gujarat');
      setPincode('');
      setIsDefault(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    if (phoneNumber.trim().length < 10) {
      alert('Phone number must be at least 10 digits.');
      return;
    }

    if (pincode.trim().length < 6) {
      alert('Pincode must be at least 6 characters.');
      return;
    }

    onSubmit({
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      isDefault,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h3 className="font-extrabold text-[#1F2937] text-sm md:text-base">
            {initialData ? 'Update Address' : 'Add New Address'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Address Line 1 (Flat, House No, Building) *
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. Flat 402, Green Meadows"
              required
              className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
            />
          </div>

          {/* Address Line 2 */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Address Line 2 (Street, Area, Locality)
            </label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="e.g. Shastri Marg, Vallabh Vidyanagar"
              className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
            />
          </div>

          {/* Landmark */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Landmark (optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Shastri Statue"
              className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
            />
          </div>

          {/* City, State, Pincode */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Anand"
                required
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                State *
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Gujarat"
                required
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Pincode *
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 388120"
                required
                className="w-full bg-[#FFF8E7] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs md:text-sm font-semibold text-[#1F2937] focus:outline-none focus:border-[#F59E0B] transition-all"
              />
            </div>
          </div>

          {/* isDefault Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              disabled={initialData?.isDefault} // Disable if it's already default to prevent unsetting default
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-slate-350 text-[#F59E0B] focus:ring-[#F59E0B] w-4.5 h-4.5 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-slate-650 cursor-pointer select-none">
              Set as primary/default delivery address
            </label>
          </div>

          {/* Form Actions Footer */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#F59E0B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#F59E0B]/15 hover:bg-[#D97706] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              <span>{initialData ? 'Update Address' : 'Add Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
