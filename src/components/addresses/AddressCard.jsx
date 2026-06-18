import React from 'react';
import { MapPin, Phone, User, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const {
    _id,
    fullName,
    phoneNumber,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    pincode,
    isDefault,
  } = address;

  // Format full address string
  const fullAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}${
    landmark ? ' (Landmark: ' + landmark + ')' : ''
  }, ${city}, ${state} - ${pincode}`;

  return (
    <div
      className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between relative group ${
        isDefault
          ? 'border-[#F59E0B] bg-[#F59E0B]/5'
          : 'border-slate-200/80 hover:border-slate-350'
      }`}
    >
      <div className="space-y-3">
        {/* Header: Label / Type and Default Badge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isDefault ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <MapPin size={14} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {isDefault ? 'Primary' : 'Address'}
            </span>
          </div>

          {isDefault && (
            <span className="flex items-center text-[9px] font-black text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md uppercase border border-[#F59E0B]/20 tracking-wider">
              <CheckCircle2 size={10} className="mr-1" />
              Default
            </span>
          )}
        </div>

        {/* Recipient Details */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center">
            <User size={12} className="mr-1.5 text-slate-400" />
            {fullName}
          </h4>
          <p className="text-[10px] text-slate-500 font-semibold flex items-center">
            <Phone size={12} className="mr-1.5 text-slate-400" />
            {phoneNumber}
          </p>
        </div>

        {/* Address text */}
        <p className="text-[11px] text-slate-650 leading-relaxed font-medium line-clamp-3">
          {fullAddress}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
        {onSetDefault && !isDefault ? (
          <button
            onClick={() => onSetDefault(_id)}
            className="text-[10px] font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors cursor-pointer bg-transparent border-0"
          >
            Use as Default
          </button>
        ) : (
          <span className="text-[9px] font-bold text-slate-400">
            {isDefault ? 'Default Delivery Address' : ''}
          </span>
        )}

        <div className="flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(address)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Edit Address"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(_id)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete Address"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
