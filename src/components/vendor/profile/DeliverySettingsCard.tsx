import React from 'react';
import { Navigation, Map, ShieldCheck, HelpCircle } from 'lucide-react';
import { DeliveryDetails } from '../../../types/profile';

interface DeliverySettingsCardProps {
  details: DeliveryDetails;
  onEditClick: () => void;
  onManageAreasClick: () => void;
}

export default function DeliverySettingsCard({
  details,
  onEditClick,
  onManageAreasClick
}: DeliverySettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Delivery Configuration</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Parameters for courier and location coverage</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {/* Radius */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-between">
          <Navigation size={14} className="text-[#00B074] mx-auto mb-1" />
          <span className="text-xs font-black text-[#1F2937] block leading-none">{details.radiusKm} km</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1 tracking-wider">Service Radius</span>
        </div>

        {/* Min Order */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-between">
          <ShieldCheck size={14} className="text-blue-500 mx-auto mb-1" />
          <span className="text-xs font-black text-[#1F2937] block leading-none">₹{details.minOrderAmount}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1 tracking-wider">Min Order</span>
        </div>

        {/* Free Delivery */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-between">
          <HelpCircle size={14} className="text-[#F59E0B] mx-auto mb-1" />
          <span className="text-xs font-black text-[#1F2937] block leading-none">₹{details.freeDeliveryThreshold}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1 tracking-wider">Free Above</span>
        </div>
      </div>

      {/* Coverage Areas Chips (scrollable/wrap) */}
      <div className="space-y-2">
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Service Coverage Locations</span>
        <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto p-1 scrollbar-none">
          {details.areas.map((area, idx) => (
            <span 
              key={idx}
              className="bg-[#F4F9F6] text-[#00B074] border border-[#00B074]/15 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1"
            >
              <Map size={10} className="mr-0.5" />
              <span>{area}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onManageAreasClick}
          className="py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] text-xs font-bold text-slate-600 hover:text-[#00B074] transition-all cursor-pointer text-center"
        >
          Manage Areas
        </button>

        <button
          onClick={onEditClick}
          className="py-2.5 rounded-xl bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs shadow-md shadow-[#00B074]/15 transition-all cursor-pointer text-center"
        >
          Edit Settings
        </button>
      </div>
    </div>
  );
}
