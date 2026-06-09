import React from 'react';
import { Home, Award, MapPin, Tag } from 'lucide-react';
import { KitchenDetails } from '../../../types/profile';

interface KitchenInfoCardProps {
  details: KitchenDetails;
  onEditClick: () => void;
}

export default function KitchenInfoCard({ details, onEditClick }: KitchenInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Kitchen Details</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Physical kitchen and cuisines setups</p>
        </div>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-slate-500">
        {/* Kitchen Type */}
        <div className="flex items-start space-x-3">
          <Home size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Kitchen Type</span>
            <span className="text-[#1F2937] font-black">{details.kitchenType}</span>
          </div>
        </div>

        {/* FSSAI Registration */}
        <div className="flex items-start space-x-3">
          <Award size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">FSSAI License Number</span>
            <span className="text-[#1F2937] font-black">{details.fssaiNumber}</span>
          </div>
        </div>

        {/* Kitchen Specialties */}
        <div className="flex items-start space-x-3">
          <Tag size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Specialties & Cuisines</span>
            <div className="flex flex-wrap gap-1.5">
              {details.specialties.map((spec, idx) => (
                <span 
                  key={idx}
                  className="bg-[#F4F9F6] text-[#00B074] border border-[#00B074]/15 px-2.5 py-0.5 rounded-lg font-bold text-[10px]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="flex items-start space-x-3">
          <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Kitchen Address</span>
            <span className="text-slate-600 font-bold leading-relaxed">{details.address}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onEditClick}
        className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] text-xs font-bold text-slate-600 hover:text-[#00B074] transition-all cursor-pointer text-center"
      >
        Edit Kitchen Details
      </button>
    </div>
  );
}
