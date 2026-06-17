import React, { useState } from 'react';
import { MoreVertical, Check, Truck, Play, Ban, Eye, RefreshCw } from 'lucide-react';
import { OrderItem, OrderStatus } from '../../../types/orders';

interface OrdersTableProps {
  orders: OrderItem[];
  onViewDetails: (order: OrderItem) => void;
  onStatusUpdate: (id: string, newStatus: OrderStatus) => void;
}

export default function OrdersTable({ orders, onViewDetails, onStatusUpdate }: OrdersTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full animate-pulse" />
            <span>Preparing</span>
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleActionClick = (id: string, action: OrderStatus) => {
    onStatusUpdate(id, action);
    setActiveDropdownId(null);
  };

  return (
    <div className="w-full">
      {/* 1. Desktop & Tablet View (Scrollable Table) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-[#E5E7EB] text-slate-400 font-black uppercase tracking-wider">
                <th className="py-4 px-5 font-black">Order ID</th>
                <th className="py-4 px-5 font-black">Customer</th>
                <th className="py-4 px-5 font-black">Meal details</th>
                <th className="py-4 px-5 font-black">Address</th>
                <th className="py-4 px-5 font-black">Delivery Time</th>
                <th className="py-4 px-5 font-black">Delivery Partner</th>
                <th className="py-4 px-5 font-black">Status</th>
                <th className="py-4 px-5 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-bold text-[#1F2937]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-5 font-black text-slate-700">{order.id}</td>
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-extrabold">{order.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{order.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-extrabold text-slate-800">{order.mealName}</p>
                      <p className="text-[10px] text-[#F59E0B] font-bold">{order.plan} {order.quantity > 1 ? `x${order.quantity}` : ''}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5 max-w-[200px] truncate" title={order.address}>
                    {order.address}
                  </td>
                  <td className="py-4 px-5 font-black text-slate-600">{order.deliveryTime}</td>
                  <td className="py-4 px-5">
                    {order.deliveryPartnerName ? (
                      <div>
                        <p className="font-extrabold">{order.deliveryPartnerName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.deliveryPartnerPhone}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold">Not Assigned</span>
                    )}
                  </td>
                  <td className="py-4 px-5">{getStatusBadge(order.status)}</td>
                  <td className="py-4 px-5 text-right relative">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetails(order)}
                        className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-slate-500 hover:text-[#F59E0B] transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Dropdown for Status Transition */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === order.id ? null : order.id)}
                          className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                          title="Update Status"
                        >
                          <RefreshCw size={14} />
                        </button>

                        {activeDropdownId === order.id && (
                          <>
                            <div onClick={() => setActiveDropdownId(null)} className="fixed inset-0 z-10" />
                            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 text-left font-semibold">
                              {order.status !== 'Preparing' && (
                                <button
                                  onClick={() => handleActionClick(order.id, 'Preparing')}
                                  className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Play size={13} className="text-[#F59E0B]" />
                                  <span>Mark Preparing</span>
                                </button>
                              )}
                              {order.status !== 'Out for Delivery' && (
                                <button
                                  onClick={() => handleActionClick(order.id, 'Out for Delivery')}
                                  className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Truck size={13} className="text-blue-600" />
                                  <span>Mark Out for Delivery</span>
                                </button>
                              )}
                              {order.status !== 'Delivered' && (
                                <button
                                  onClick={() => handleActionClick(order.id, 'Delivered')}
                                  className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Check size={13} className="text-[#16A34A]" />
                                  <span>Mark Delivered</span>
                                </button>
                              )}
                              {order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleActionClick(order.id, 'Cancelled')}
                                  className="w-full px-3.5 py-2 hover:bg-red-50 hover:text-[#DC2626] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Ban size={13} className="text-[#DC2626]" />
                                  <span>Cancel Order</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile View (Card-Based Layout) */}
      <div className="block sm:hidden space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col space-y-4"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">ID: {order.id}</span>
                <h4 className="font-extrabold text-sm text-[#1F2937] leading-none mt-0.5">{order.customerName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">{order.phone}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Meal Metadata */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <p className="text-xs font-black text-slate-800">{order.mealName}</p>
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-[#F59E0B]">{order.plan} {order.quantity > 1 ? `x${order.quantity}` : ''}</span>
                <span className="text-slate-400">Due: {order.deliveryTime}</span>
              </div>
            </div>

            {/* Address */}
            <div className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              <span className="font-bold text-slate-400 block uppercase tracking-wide">Delivery Address</span>
              {order.address}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <button
                onClick={() => onViewDetails(order)}
                className="px-4 py-2 bg-[#FFF8E7] border border-[#F59E0B]/10 rounded-xl text-xs font-extrabold text-[#F59E0B] hover:bg-[#F59E0B]/5 transition-all cursor-pointer"
              >
                View Details
              </button>

              {/* Status Update Quick Buttons */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdownId(activeDropdownId === order.id ? null : order.id)}
                  className="px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <span>Update</span>
                  <MoreVertical size={12} />
                </button>

                {activeDropdownId === order.id && (
                  <>
                    <div onClick={() => setActiveDropdownId(null)} className="fixed inset-0 z-30" />
                    <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-40 text-left font-semibold">
                      {order.status !== 'Preparing' && (
                        <button
                          onClick={() => handleActionClick(order.id, 'Preparing')}
                          className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Play size={13} className="text-[#F59E0B]" />
                          <span>Mark Preparing</span>
                        </button>
                      )}
                      {order.status !== 'Out for Delivery' && (
                        <button
                          onClick={() => handleActionClick(order.id, 'Out for Delivery')}
                          className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Truck size={13} className="text-blue-600" />
                          <span>Mark Out for Delivery</span>
                        </button>
                      )}
                      {order.status !== 'Delivered' && (
                        <button
                          onClick={() => handleActionClick(order.id, 'Delivered')}
                          className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Check size={13} className="text-[#16A34A]" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                      {order.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleActionClick(order.id, 'Cancelled')}
                          className="w-full px-3.5 py-2 hover:bg-red-50 hover:text-[#DC2626] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Ban size={13} className="text-[#DC2626]" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
