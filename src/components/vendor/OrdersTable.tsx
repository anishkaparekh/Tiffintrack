import React from 'react';
import { Order, OrderStatus } from '../../types/vendor';

interface OrdersTableProps {
  orders: Order[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'preparing':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Preparing
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Delivered
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Out For Delivery
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Recent Orders</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Real-time order statuses</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs font-semibold text-[#1F2937]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Customer Name</th>
              <th className="py-4 px-6">Subscription Plan</th>
              <th className="py-4 px-6">Delivery Schedule</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#F4F9F6]/30 transition-colors">
                <td className="py-4.5 px-6 font-bold text-[#00B074]">
                  {order.id}
                </td>
                <td className="py-4.5 px-6 font-bold text-[#1F2937]">
                  {order.customerName}
                </td>
                <td className="py-4.5 px-6 font-semibold text-slate-500">
                  {order.plan}
                </td>
                <td className="py-4.5 px-6 font-bold text-[#1F2937]">
                  {order.deliveryTime}
                </td>
                <td className="py-4.5 px-6">
                  {getStatusBadge(order.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
