import React from 'react';
import { ChefHat, CheckCircle2, Award, TrendingUp, ArrowUpRight } from 'lucide-react';

interface StatsCardItemProps {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

function StatsCardItem({ title, value, description, trend, icon: Icon }: StatsCardItemProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
        <h3 className="text-2xl font-black text-[#1F2937] leading-none">{value}</h3>
        <div className="flex items-center space-x-1">
          {trend && (
            <span className="text-xs font-bold text-[#16A34A] flex items-center mr-1">
              <ArrowUpRight size={14} className="shrink-0 mr-0.5" />
              {trend}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-400">{description}</span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#F4F9F6] text-[#00B074] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
        <Icon size={20} />
      </div>
    </div>
  );
}

interface MealStatsCardProps {
  totalMeals: number;
  availableMeals: number;
  bestSellerName: string;
  bestSellerOrders: number;
  weeklyOrdersTotal: number;
  weeklyOrdersIncreasePercent: number;
}

export default function MealStatsCard({
  totalMeals,
  availableMeals,
  bestSellerName,
  bestSellerOrders,
  weeklyOrdersTotal,
  weeklyOrdersIncreasePercent
}: MealStatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCardItem 
        title="Total Meals" 
        value={`${totalMeals} Meals`} 
        description="Listed on your menu" 
        icon={ChefHat} 
      />
      <StatsCardItem 
        title="Available Meals" 
        value={`${availableMeals} Available`} 
        description="Active for order bookings" 
        icon={CheckCircle2} 
      />
      <StatsCardItem 
        title="Best Seller" 
        value={bestSellerName} 
        description={`${bestSellerOrders} Orders this week`} 
        icon={Award} 
      />
      <StatsCardItem 
        title="Weekly Meal Orders" 
        value={`${weeklyOrdersTotal} Orders`} 
        description="from last week" 
        trend={`${weeklyOrdersIncreasePercent}%`}
        icon={TrendingUp} 
      />
    </div>
  );
}
