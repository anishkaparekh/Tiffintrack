import React from 'react';
import { ShoppingBag, Flame, Truck, CheckCircle, ArrowUpRight } from 'lucide-react';

interface OrderStatsCardProps {
  todayOrders: number;
  preparingOrders: number;
  outForDeliveryOrders: number;
  deliveredOrders: number;
}

export default function OrderStatsCard({
  todayOrders,
  preparingOrders,
  outForDeliveryOrders,
  deliveredOrders
}: OrderStatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Today's Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Orders</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{todayOrders} Orders</h3>
          <p className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight size={14} className="mr-0.5" />
            <span>12% from yesterday</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#F4F9F6] text-[#00B074] flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <ShoppingBag size={20} />
        </div>
      </div>

      {/* Preparing Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Preparing Orders</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{preparingOrders} Orders</h3>
          <p className="text-xs font-semibold text-[#F59E0B]">Need attention</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Flame size={20} />
        </div>
      </div>

      {/* Out for Delivery */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Out for Delivery</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{outForDeliveryOrders} Orders</h3>
          <p className="text-xs font-semibold text-blue-600">Drivers assigned</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <Truck size={20} />
        </div>
      </div>

      {/* Delivered Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivered Orders</span>
          <h3 className="text-2xl font-black text-[#1F2937] leading-none">{deliveredOrders} Orders</h3>
          <p className="text-xs font-semibold text-emerald-600">Completed successfully</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-[#E5E7EB]/50">
          <CheckCircle size={20} />
        </div>
      </div>
    </div>
  );
}
