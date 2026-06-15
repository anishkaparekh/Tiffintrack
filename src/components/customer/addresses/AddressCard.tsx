import React from 'react';
import { Address } from '../../../data/addressMockData';
import { MapPin, User, Phone, Compass, FileText, Check, Trash2, Edit2, Home, Briefcase } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  
  const getLabelIcon = (label: string) => {
    const norm = label.toLowerCase();
    if (norm.includes('home')) return Home;
    if (norm.includes('work') || norm.includes('office')) return Briefcase;
    return MapPin;
  };

  const Icon = getLabelIcon(address.label);

  const getCompleteAddressString = () => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.area,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className={`bg-white border-2 rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between relative overflow-hidden group ${
      address.isDefault ? 'border-[#00B074]' : 'border-slate-200/60'
    }`}>
      
      <div className="space-y-4">
        {/* Header (Label, Icon, Default Badge) */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-xl border ${
              address.isDefault 
                ? 'bg-[#e6f7f1] text-[#00B074] border-[#00B074]/15' 
                : 'bg-slate-50 text-slate-500 border-slate-200/50'
            }`}>
              <Icon size={16} strokeWidth={2.25} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#1F2937] leading-none">{address.label}</h4>
            </div>
          </div>
          
          {address.isDefault && (
            <span className="text-[9px] font-black uppercase tracking-wider bg-[#e6f7f1] text-[#00B074] px-2.5 py-1 rounded-md border border-[#00B074]/15 flex items-center gap-1 shadow-sm">
              <Check size={10} strokeWidth={3} />
              <span>Default</span>
            </span>
          )}
        </div>

        {/* Content details */}
        <div className="space-y-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
          {/* Recipient name */}
          <div className="flex items-center gap-2 text-[#1F2937] font-bold">
            <User size={14} className="text-slate-400" />
            <span>{address.fullName}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-slate-400" />
            <span>{address.phone}</span>
          </div>

          {/* Full Address */}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <span className="leading-normal">{getCompleteAddressString()}</span>
          </div>

          {/* Landmark */}
          {address.landmark && (
            <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
              <Compass size={13} className="text-[#FFD200] mt-0.5 shrink-0" />
              <span>
                <strong className="text-[#1F2937]">Landmark:</strong> {address.landmark}
              </span>
            </div>
          )}

          {/* Delivery Instructions */}
          {address.deliveryInstructions && (
            <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
              <FileText size={13} className="text-[#00B074] mt-0.5 shrink-0" />
              <span>
                <strong className="text-[#1F2937]">Instructions:</strong> {address.deliveryInstructions}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex gap-2 border-t border-slate-100 pt-4 mt-5">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex-1 py-2 bg-[#e6f7f1] hover:bg-[#00B074]/10 border border-[#00B074]/10 text-[#00B074] text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Check size={12} strokeWidth={2.5} />
            <span>Set Default</span>
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <Edit2 size={12} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200/20 text-red-500 rounded-xl transition flex items-center justify-center cursor-pointer"
          title="Delete Address"
        >
          <Trash2 size={13} />
        </button>
      </div>

    </div>
  );
}
