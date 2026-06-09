import React from 'react';
import { Phone, Mail, PhoneCall } from 'lucide-react';
import { ContactDetails } from '../../../types/profile';

interface ContactInfoCardProps {
  contacts: ContactDetails;
  onUpdateClick: () => void;
}

export default function ContactInfoCard({ contacts, onUpdateClick }: ContactInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Contact Information</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Primary coordinates for communications</p>
      </div>

      <div className="space-y-3.5 text-xs font-semibold text-slate-500">
        {/* Primary Phone */}
        <div className="flex items-start space-x-3">
          <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Primary Phone Number</span>
            <span className="text-[#1F2937] font-black">{contacts.phone}</span>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex items-start space-x-3">
          <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Email Address</span>
            <span className="text-[#1F2937] font-black truncate">{contacts.email}</span>
          </div>
        </div>

        {/* Alternate Contact */}
        <div className="flex items-start space-x-3">
          <PhoneCall size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Alternate Contact Number</span>
            <span className="text-[#1F2937] font-black">{contacts.alternatePhone}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onUpdateClick}
        className="w-full py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F4F9F6] text-xs font-bold text-slate-600 hover:text-[#00B074] transition-all cursor-pointer text-center"
      >
        Update Contact Information
      </button>
    </div>
  );
}
