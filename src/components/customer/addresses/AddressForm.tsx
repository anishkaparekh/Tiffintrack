import React, { useState, useEffect } from 'react';
import { Address } from '../../../data/addressMockData';
import { Home, Briefcase, MapPin, Check } from 'lucide-react';
import LocationMap from '../../common/LocationMap';

interface AddressFormProps {
  address?: Address | null; // Null if adding
  onSave: (address: Omit<Address, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    area: '',
    city: 'Rajkot', // Defaults to Rajkot for meal delivery context
    state: 'Gujarat',
    pincode: '',
    landmark: '',
    deliveryInstructions: '',
    isDefault: false,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || '',
        fullName: address.fullName || '',
        phone: address.phone || '',
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        area: address.area || '',
        city: address.city || 'Rajkot',
        state: address.state || 'Gujarat',
        pincode: address.pincode || '',
        landmark: address.landmark || '',
        deliveryInstructions: address.deliveryInstructions || '',
        isDefault: address.isDefault || false,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    }
  }, [address]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.label.trim()) newErrors.label = 'Address label is required (e.g. Home, Office)';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number format';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.area.trim()) newErrors.area = 'Area/Locality is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Submitting form data:', formData);
      onSave({
        ...formData,
        id: address?.id
      });
    }
  };

  // Get user location using browser Geolocation API
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location retrieved:', position.coords);
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve location. Please allow location access or enter manually.');
      }
    );
  };

  const selectLabelTag = (tag: string) => {
    console.log('Label selected:', tag);
    setFormData(prev => ({ ...prev, label: tag }));
    if (errors.label) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.label;
        return copy;
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card w-full max-w-2xl mx-auto">
      <h3 className="text-base font-extrabold text-[#1F2937] border-b border-slate-100 pb-3 mb-5">
        {address ? '✏️ Edit Delivery Address' : '📍 Add New Delivery Address'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Tag Selectors */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Address Type / Label *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {['Home', 'Work (Office)', 'Parents', 'Gym', 'Other'].map(tag => {
              const isActive = formData.label === tag;
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => selectLabelTag(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#F59E0B] border-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Or enter custom label (e.g. Brother's Flat)"
            value={formData.label}
            onChange={e => {
              setFormData({ ...formData, label: e.target.value });
              if (errors.label) setErrors({ ...errors, label: '' });
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937] transition-all"
          />
          {errors.label && (
            <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.label}</span>
          )}
        </div>

        {/* Name and Phone */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Recipient Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ananya Rao"
              value={formData.fullName}
              onChange={e => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.fullName && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.fullName}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Contact Phone Number *
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={e => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.phone && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.phone}</span>
            )}
          </div>
        </div>

        {/* Address Lines */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Address Line 1 *
            </label>
            <input
              type="text"
              placeholder="Flat/House No., Building Name"
              value={formData.addressLine1}
              onChange={e => {
                setFormData({ ...formData, addressLine1: e.target.value });
                if (errors.addressLine1) setErrors({ ...errors, addressLine1: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.addressLine1 && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.addressLine1}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              placeholder="Street Name, Society Lane"
              value={formData.addressLine2}
              onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
          </div>
        </div>

        {/* Area, City, State, Pincode */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Area/Locality *
            </label>
            <input
              type="text"
              placeholder="e.g. Kalawad Road"
              value={formData.area}
              onChange={e => {
                setFormData({ ...formData, area: e.target.value });
                if (errors.area) setErrors({ ...errors, area: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.area && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.area}</span>
            )}
          </div>


          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              City *
            </label>
            <input
              type="text"
              placeholder="e.g. Rajkot"
              value={formData.city}
              onChange={e => {
                setFormData({ ...formData, city: e.target.value });
                if (errors.city) setErrors({ ...errors, city: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.city && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.city}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              State *
            </label>
            <input
              type="text"
              placeholder="e.g. Gujarat"
              value={formData.state}
              onChange={e => {
                setFormData({ ...formData, state: e.target.value });
                if (errors.state) setErrors({ ...errors, state: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.state && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.state}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Pincode *
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 360005"
              value={formData.pincode}
              onChange={e => {
                setFormData({ ...formData, pincode: e.target.value });
                if (errors.pincode) setErrors({ ...errors, pincode: '' });
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
            {errors.pincode && (
              <span className="text-[10px] text-red-500 font-bold block mt-1">⚠️ {errors.pincode}</span>
            )}
          </div>
        </div>

        {/* Landmark & Instructions */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Nearby Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Opposite Crystal Mall"
              value={formData.landmark}
              onChange={e => setFormData({ ...formData, landmark: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ring bell twice, deliver to first floor."
              value={formData.deliveryInstructions}
              onChange={e => setFormData({ ...formData, deliveryInstructions: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#F59E0B] rounded-xl text-xs font-semibold placeholder-slate-400 text-[#1F2937]"
            />
          </div>
        </div>

        {/* Map Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Select Location on Map *
          </label>
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <LocationMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              title={formData.fullName || 'Selected Location'}
              onMapClick={(lat: number, lng: number) => {
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
            <span>Click on the map to place a pin or detect location manually.</span>
            <button
              type="button"
              onClick={getLocation}
              className="text-[#F59E0B] hover:text-[#C2410C] font-extrabold cursor-pointer"
            >
              📍 Detect My Geolocation
            </button>
          </div>
          {formData.latitude && formData.longitude && (
            <div className="text-[10px] text-emerald-600 font-extrabold">
              Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
            </div>
          )}
        </div>

        {/* Set as Default Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
          <div>
            <span className="text-xs font-bold text-[#1F2937] block">Mark as Default Address</span>
            <span className="text-[10px] text-slate-500 font-semibold leading-normal">
              Automatically use this address for future subscriptions and checkouts.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            disabled={address?.isDefault} // Disable toggling off if it's already the default address
            className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
              formData.isDefault ? 'bg-[#F59E0B]' : 'bg-slate-300'
            } ${address?.isDefault ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
              formData.isDefault ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#F59E0B] hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer shadow-[#F59E0B]/15"
          >
            {address ? 'Save Changes' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
