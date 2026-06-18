import React from 'react';
import { Layers, Users, IndianRupee, Heart } from 'lucide-react';
import { PlanStats } from '../../../types/plans';

interface StatsCardItemProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

function StatsCardItem({ title, value, description, icon: Icon }: StatsCardItemProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <h3 className="text-2xl font-black text-[#1F2937] leading-none">{value}</h3>
        <p className="text-xs font-semibold text-slate-400">{description}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
        <Icon size={20} />
      </div>
    </div>
  );
}

export default function PlanStatsCard({
  totalPlans,
  activeSubscribers,
  monthlyRecurringRevenue,
  mostPopularPlanName,
  mostPopularPlanSubscribers
}: PlanStats) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCardItem 
        title="Total Plans" 
        value={`${totalPlans} Plans`} 
        description="Created subscription tiers" 
        icon={Layers} 
      />
      <StatsCardItem 
        title="Active Subscribers" 
        value={`${activeSubscribers} Users`} 
        description="Currently active bookings" 
        icon={Users} 
      />
      <StatsCardItem 
        title="Monthly Recurring Revenue" 
        value={`₹${monthlyRecurringRevenue.toLocaleString()}`} 
        description="Est. monthly projection" 
        icon={IndianRupee} 
      />
      <StatsCardItem 
        title="Most Popular Plan" 
        value={mostPopularPlanName} 
        description={`${mostPopularPlanSubscribers} Subscribers`} 
        icon={Heart} 
      />
    </div>
  );
}
