import React from 'react';
import { ShoppingBag, Users, Calendar, IndianRupee, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { StatsCardData } from '../../types/vendor';

const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  ShoppingBag: ShoppingBag,
  Users: Users,
  Calendar: Calendar,
  IndianRupee: IndianRupee
};

export default function StatsCard({ title, value, changeText, trend, iconName }: StatsCardData) {
  const IconComponent = iconMap[iconName] || ShoppingBag;

  // Trend styling
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <h3 className="text-2xl font-black text-[#1F2937] leading-none">{value}</h3>
        
        <div className="flex items-center space-x-1.5 pt-0.5">
          {isUp ? (
            <ArrowUpRight size={14} className="text-[#16A34A] shrink-0" />
          ) : isDown ? (
            <ArrowDownRight size={14} className="text-[#DC2626] shrink-0" />
          ) : (
            <Minus size={14} className="text-[#F59E0B] shrink-0" />
          )}
          <span className={`text-xs font-semibold ${
            isUp ? 'text-[#16A34A]' : isDown ? 'text-[#DC2626]' : 'text-slate-400'
          }`}>
            {changeText}
          </span>
        </div>
      </div>

      <div className="w-12 h-12 rounded-xl bg-[#F4F9F6] text-[#00B074] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
        <IconComponent size={20} />
      </div>
    </div>
  );
}
