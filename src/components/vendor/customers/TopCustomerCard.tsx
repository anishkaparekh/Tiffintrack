import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { TopCustomer } from '../../../types/customers';

interface TopCustomerCardProps {
  topCustomers: TopCustomer[];
  onViewProfileByName: (name: string) => void;
}

export default function TopCustomerCard({ topCustomers, onViewProfileByName }: TopCustomerCardProps) {
  
  const getRankIndicator = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl select-none" title="1st Place">🥇</span>;
      case 2:
        return <span className="text-2xl select-none" title="2nd Place">🥈</span>;
      case 3:
        return <span className="text-2xl select-none" title="3rd Place">🥉</span>;
      default:
        return <span className="text-xs font-bold text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
          <Sparkles size={16} className="text-[#C2410C] mr-1.5 shrink-0" />
          <span>Top Valuable Customers</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold">Ranked by overall platform lifetime spend (LTV)</p>
      </div>

      <div className="space-y-3">
        {topCustomers.map((customer) => (
          <div 
            key={customer.rank}
            onClick={() => onViewProfileByName(customer.name)}
            className="flex items-center justify-between p-3.5 bg-[#FFF8E7]/50 border border-[#E5E7EB]/50 rounded-xl hover:bg-[#FFF8E7] transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3.5 overflow-hidden">
              {/* Medal icon */}
              <div className="shrink-0 flex items-center justify-center">
                {getRankIndicator(customer.rank)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-[#1F2937] truncate group-hover:text-[#F59E0B] transition-colors">
                  {customer.name}
                </h4>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                  {customer.currentPlan}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="text-right shrink-0 font-bold text-xs">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">LTV Spend</span>
              <span className="text-[#F59E0B] font-black flex items-center justify-end">
                <TrendingUp size={12} className="text-[#16A34A] mr-0.5" />
                ₹{customer.lifetimeValue.toLocaleString()}
              </span>
              <span className="block text-[8.5px] font-semibold text-slate-400 mt-0.5">{customer.ordersPlaced} Orders</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
