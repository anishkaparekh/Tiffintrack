import React from 'react';
import { MapPin, User, Compass, FileText, UserCheck } from 'lucide-react';

interface DeliveryAddressCardProps {
  customerName: string;
  deliveryAddress: string;
  landmark?: string;
  deliveryInstructions?: string;
  assignedPartnerName?: string | null;
  isLoading?: boolean;
}

export default function DeliveryAddressCard({
  customerName,
  deliveryAddress,
  landmark,
  deliveryInstructions,
  assignedPartnerName,
  isLoading = false
}: DeliveryAddressCardProps) {
  
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/60 p-6 rounded-3xl animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-3.5 bg-slate-100 rounded w-full"></div>
        <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card space-y-4">
      {/* Customer Header */}
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
        <div className="w-10 h-10 rounded-full bg-[#e6f7f1] text-[#00B074] flex items-center justify-center font-bold">
          {customerName ? customerName.charAt(0).toUpperCase() : 'C'}
        </div>
        <div>
          <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Recipient Customer</h4>
          <span className="text-sm font-extrabold text-[#1F2937]">{customerName}</span>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-3.5 text-xs text-slate-650 font-semibold leading-relaxed">
        {/* Full Delivery Address */}
        <div className="flex items-start gap-2.5">
          <MapPin size={15} className="text-[#00B074] mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Delivery Address</span>
            <span className="text-[#1F2937] leading-normal block">{deliveryAddress}</span>
          </div>
        </div>

        {/* Landmark */}
        <div className="flex items-start gap-2.5">
          <Compass size={15} className="text-[#FFD200] mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Nearby Landmark</span>
            <span className="text-[#1F2937] leading-normal block">
              {landmark || <em className="text-slate-400 font-normal">No landmark specified</em>}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex items-start gap-2.5">
          <FileText size={15} className="text-slate-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Delivery Instructions</span>
            <span className="text-[#1F2937] leading-normal block">
              {deliveryInstructions || <em className="text-slate-400 font-normal">No instructions provided</em>}
            </span>
          </div>
        </div>

        {/* Assigned Partner */}
        <div className="flex items-start gap-2.5 border-t border-slate-100 pt-3">
          <UserCheck size={15} className="text-[#00B074] mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">Assigned Rider Partner</span>
            {assignedPartnerName ? (
              <span className="text-[#00B074] font-extrabold">{assignedPartnerName}</span>
            ) : (
              <span className="text-slate-400 font-bold italic">Awaiting Partner Assignment</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
