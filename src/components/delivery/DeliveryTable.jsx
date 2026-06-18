import React from 'react';
import { Compass, Check, Package, AlertTriangle, Eye } from 'lucide-react';

export default function DeliveryTable({ deliveries, onNavigate, onViewDetails, onUpdateStatus }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Picked Up':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Failed':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/60 text-[10px] font-bold text-slate-500 G G uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Meal Type</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Delivery Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Distance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-all font-semibold">
                <td className="px-6 py-4.5 text-primary-text">{delivery.id}</td>
                <td className="px-6 py-4.5 text-slate-700">{delivery.customerName}</td>
                <td className="px-6 py-4.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 border border-slate-200/40 text-slate-600">
                    {delivery.mealType}
                  </span>
                </td>
                <td className="px-6 py-4.5 text-slate-600 max-w-[200px] truncate" title={delivery.address}>
                  {delivery.address}
                </td>
                <td className="px-6 py-4.5 text-slate-700">{delivery.customerPhone || 'N/A'}</td>
                <td className="px-6 py-4.5 text-slate-500">{delivery.timeSlot}</td>
                <td className="px-6 py-4.5">
                  <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider border ${getStatusBadge(delivery.status)}`}>
                    {delivery.status}
                  </span>
                  {delivery.status === 'Failed' && delivery.failReason && (
                    <span className="block text-[8px] text-red-500 mt-0.5 font-semibold">({delivery.failReason})</span>
                  )}
                </td>
                <td className="px-6 py-4.5 text-slate-700">-</td>
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => onViewDetails(delivery)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                      title="View Customer & Address Details"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Navigate */}
                    <button
                      onClick={() => {
                        const destination = encodeURIComponent(delivery.address);
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                      }}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                      title="Navigate using Maps"
                    >
                      <Compass size={14} />
                    </button>

                    {/* Picked Up */}
                    {delivery.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateStatus(delivery.id, 'Picked Up')}
                        className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 cursor-pointer flex items-center space-x-1 transition-colors"
                      >
                        <Package size={12} />
                        <span>Pickup</span>
                      </button>
                    )}

                    {/* Delivered */}
                    {delivery.status === 'Picked Up' && (
                      <button
                        onClick={() => onUpdateStatus(delivery.id, 'Delivered')}
                        className="px-2 py-1.5 bg-mint-light hover:bg-mint/20 text-mint text-[10px] font-bold rounded-lg border border-mint/20 cursor-pointer flex items-center space-x-1 transition-colors"
                      >
                        <Check size={12} />
                        <span>Deliver</span>
                      </button>
                    )}

                    {/* Failed */}
                    {(delivery.status === 'Pending' || delivery.status === 'Picked Up') && (
                      <button
                        onClick={() => onUpdateStatus(delivery.id, 'Failed', 'Customer Unavailable')}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 cursor-pointer transition-colors"
                        title="Mark Customer Unavailable"
                      >
                        <AlertTriangle size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
