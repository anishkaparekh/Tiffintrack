import React from 'react';
import { X, Bike, Mail, Phone, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { DeliveryPartner } from '../../../data/vendorDeliveryMockData';

interface DeliveryPartnerCardProps {
  partner: DeliveryPartner;
  onClose: () => void;
}

export default function DeliveryPartnerCard({ partner, onClose }: DeliveryPartnerCardProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="font-extrabold text-base text-[#1F2937]">Delivery Partner Profile</h3>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Avatar and Name */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00B074]/10 border border-[#00B074]/20 text-[#00B074] flex items-center justify-center font-black text-lg">
              {partner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h4 className="font-black text-sm text-[#1F2937]">{partner.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{partner.id}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3.5 text-xs font-semibold text-slate-500">
            <div className="flex items-center space-x-3">
              <Phone size={14} className="text-slate-400" />
              <span>{partner.phone}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Mail size={14} className="text-slate-400" />
              <span>{partner.email}</span>
            </div>

            <div className="flex items-center space-x-3">
              <Bike size={14} className="text-slate-400" />
              <span>Vehicle: <strong className="text-[#1F2937]">{partner.vehicleType}</strong></span>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin size={14} className="text-slate-400 mt-0.5" />
              <div>
                <span className="block mb-1">Assigned Delivery Zones:</span>
                <div className="flex flex-wrap gap-1">
                  {partner.deliveryZones.map((zone, idx) => (
                    <span 
                      key={idx} 
                      className="bg-slate-100 border border-slate-200/40 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircle size={14} className="text-slate-400" />
              <span>
                Status: &nbsp;
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  partner.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {partner.status}
                </span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar size={14} className="text-slate-400" />
              <span>Today's Workload: <strong className="text-[#00B074]">{partner.todayDeliveriesCount} deliveries</strong></span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
            >
              Close Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
