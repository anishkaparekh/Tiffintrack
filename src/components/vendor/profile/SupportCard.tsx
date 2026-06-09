import React from 'react';
import { HelpCircle, MessageSquare, BookOpen, ShieldAlert } from 'lucide-react';
import { SupportLink } from '../../../types/profile';

interface SupportCardProps {
  links: SupportLink[];
  onLinkClick: (title: string) => void;
}

export default function SupportCard({ links, onLinkClick }: SupportCardProps) {
  
  const getSupportIcon = (title: string) => {
    if (title.includes('FAQ')) return <HelpCircle size={18} className="text-[#00B074]" />;
    if (title.includes('Hotline')) return <MessageSquare size={18} className="text-blue-600" />;
    if (title.includes('Guidelines')) return <BookOpen size={18} className="text-amber-500" />;
    return <ShieldAlert size={18} className="text-red-500" />;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Help & Vendor Support</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Explore guidelines or reach our onboarding team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {links.map((link, idx) => (
          <div 
            key={idx}
            onClick={() => onLinkClick(link.title)}
            className="p-4 bg-slate-50/50 hover:bg-[#F4F9F6] border border-[#E5E7EB]/50 hover:border-[#00B074]/30 rounded-xl transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-lg bg-white border border-[#E5E7EB]/40 group-hover:border-[#00B074]/20 transition-all shrink-0">
                {getSupportIcon(link.title)}
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-[#1F2937] group-hover:text-[#00B074] transition-colors">{link.title}</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{link.description}</p>
            </div>
            
            <span className="text-[10px] font-black text-[#00B074] uppercase tracking-wider mt-1 block">
              {link.label} →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
