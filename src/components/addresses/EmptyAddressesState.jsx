import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function EmptyAddressesState({ onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-4">
      <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full flex items-center justify-center text-[#F59E0B] animate-bounce">
        <MapPin size={32} />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="font-extrabold text-slate-800 text-sm md:text-base">No Addresses Found</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Please add a delivery address to complete your orders or subscriptions.
        </p>
      </div>
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="flex items-center space-x-1.5 px-4.5 py-2 bg-[#F59E0B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#F59E0B]/15 hover:bg-[#D97706] transition-all cursor-pointer border-0"
        >
          <Plus size={14} />
          <span>Add New Address</span>
        </button>
      )}
    </div>
  );
}
