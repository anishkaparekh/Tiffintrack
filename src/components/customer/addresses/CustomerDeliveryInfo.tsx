import React from 'react';
import { MapPin, User, Phone, Compass, FileText, Navigation } from 'lucide-react';

interface CustomerDeliveryInfoProps {
  customerName: string;
  phone: string;
  address: string;
  landmark?: string;
  deliveryInstructions?: string;
  onNavigate: () => void;
  isLoading?: boolean;
}

export default function CustomerDeliveryInfo({
  customerName,
  phone,
  address,
  landmark,
  deliveryInstructions,
  onNavigate,
  isLoading = false
}: CustomerDeliveryInfoProps) {

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/60 p-6 rounded-3xl animate-pulse space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="h-3.5 bg-slate-100 rounded w-full"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card space-y-5">
      {/* Header with Name & Phone */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center font-bold">
            {customerName ? customerName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Customer</h4>
            <span className="text-sm font-extrabold text-[#1F2937]">{customerName}</span>
          </div>
        </div>
        
        {/* Phone Button Link */}
        <a 
          href={`tel:${phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] hover:bg-[#F59E0B]/10 border border-[#F59E0B]/10 text-[#F59E0B] rounded-xl text-xs font-bold transition-all"
        >
          <Phone size={13} />
          <span>Call Client</span>
        </a>
      </div>

      {/* Address and details */}
      <div className="space-y-4 text-xs text-slate-650 font-semibold leading-relaxed">
        {/* Address */}
        <div className="flex items-start gap-2.5">
          <MapPin size={15} className="text-[#F59E0B] mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Address</span>
            <span className="text-[#1F2937] leading-normal block">{address}</span>
          </div>
        </div>

        {/* Landmark */}
        <div className="flex items-start gap-2.5">
          <Compass size={15} className="text-[#C2410C] mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Landmark</span>
            <span className="text-[#1F2937] leading-normal block">
              {landmark || <em className="text-slate-400 font-normal">No landmark listed</em>}
            </span>
          </div>
        </div>

        {/* Delivery Instructions */}
        <div className="flex items-start gap-2.5">
          <FileText size={15} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Delivery Instructions</span>
            <span className="text-[#1F2937] leading-normal block">
              {deliveryInstructions || <em className="text-slate-400 font-normal">No specific drop-off guidelines</em>}
            </span>
          </div>
        </div>
      </div>

      {/* Navigate Action Button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onNavigate}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Navigation size={14} fill="white" />
          <span>Navigate to Location</span>
        </button>
      </div>

    </div>
  );
}
