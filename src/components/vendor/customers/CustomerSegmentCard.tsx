import React from 'react';
import { Award, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { CustomerSegment } from '../../../types/customers';

interface CustomerSegmentCardProps {
  segments: CustomerSegment[];
  selectedSegment: string | null;
  onSegmentSelect: (segmentType: string | null) => void;
}

export default function CustomerSegmentCard({
  segments,
  selectedSegment,
  onSegmentSelect
}: CustomerSegmentCardProps) {
  
  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'loyal':
        return <Award size={18} />;
      case 'new':
        return <Sparkles size={18} />;
      case 'high_value':
        return <Zap size={18} />;
      case 'at_risk':
      default:
        return <ShieldAlert size={18} />;
    }
  };

  const getSegmentColors = (type: string, isSelected: boolean) => {
    if (isSelected) {
      switch (type) {
        case 'loyal': return 'bg-[#F59E0B] text-white border-[#F59E0B]';
        case 'new': return 'bg-blue-600 text-white border-blue-600';
        case 'high_value': return 'bg-amber-500 text-white border-amber-500';
        case 'at_risk': return 'bg-red-600 text-white border-red-600';
        default: return 'bg-[#F59E0B] text-white border-[#F59E0B]';
      }
    } else {
      switch (type) {
        case 'loyal': return 'bg-white border-[#E5E7EB] hover:border-[#F59E0B]/30 text-slate-700 hover:bg-[#FFF8E7]';
        case 'new': return 'bg-white border-[#E5E7EB] hover:border-blue-300 text-slate-700 hover:bg-blue-50/50';
        case 'high_value': return 'bg-white border-[#E5E7EB] hover:border-amber-300 text-slate-700 hover:bg-amber-50/50';
        case 'at_risk': return 'bg-white border-[#E5E7EB] hover:border-red-300 text-slate-700 hover:bg-red-50/50';
        default: return 'bg-white border-[#E5E7EB] text-slate-700';
      }
    }
  };

  const getIconContainerColors = (type: string, isSelected: boolean) => {
    if (isSelected) return 'bg-white/20 text-white';
    switch (type) {
      case 'loyal': return 'bg-[#FFF8E7] text-[#F59E0B]';
      case 'new': return 'bg-blue-50 text-blue-600';
      case 'high_value': return 'bg-amber-50 text-amber-500';
      case 'at_risk': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {segments.map((segment) => {
        const isSelected = selectedSegment === segment.type;
        return (
          <div
            key={segment.type}
            onClick={() => onSegmentSelect(isSelected ? null : segment.type)}
            className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between h-[120px] ${getSegmentColors(segment.type, isSelected)}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                {segment.name}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${getIconContainerColors(segment.type, isSelected)}`}>
                {getSegmentIcon(segment.type)}
              </div>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xl font-black leading-none">{segment.count} Customers</h4>
              <p className={`text-[10px] font-semibold mt-1.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                {segment.definition}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
