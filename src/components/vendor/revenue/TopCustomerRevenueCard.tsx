import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import { TopCustomerRevenue } from '../../../types/revenue';

interface TopCustomerRevenueCardProps {
  topCustomers: TopCustomerRevenue[];
}

export default function TopCustomerRevenueCard({ topCustomers }: TopCustomerRevenueCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider flex items-center">
          <Users size={16} className="text-[#00B074] mr-1.5 shrink-0" />
          <span>Top Contributing Customers</span>
        </h3>
        <p className="text-[11px] text-slate-400 font-semibold">Customers with the highest billing contribution</p>
      </div>

      <div className="space-y-3">
        {topCustomers.map((customer, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-3.5 bg-[#F4F9F6]/50 border border-[#E5E7EB]/50 rounded-xl hover:bg-[#F4F9F6] transition-all"
          >
            <div className="flex items-center space-x-3.5 overflow-hidden">
              <span className="text-sm font-black text-slate-400">#{idx + 1}</span>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-[#1F2937] truncate">{customer.name}</h4>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                  {customer.planName}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="text-right shrink-0 font-bold text-xs">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">LTV Earnings</span>
              <span className="text-[#00B074] font-black flex items-center justify-end">
                <TrendingUp size={12} className="text-[#16A34A] mr-0.5" />
                ₹{customer.lifetimeValue.toLocaleString()}
              </span>
              <span className="block text-[8.5px] font-semibold text-slate-400 mt-0.5">{customer.ordersCount} Orders</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
