import React from 'react';
import { UserCheck, UserMinus, Eye, RefreshCw, Navigation } from 'lucide-react';
import { DeliveryAssignment } from '../../../data/vendorDeliveryMockData';

interface AssignmentTableProps {
  deliveries: DeliveryAssignment[];
  onAssign: (delivery: DeliveryAssignment) => void;
  onRemove: (id: string) => void;
  onViewDetails: (delivery: DeliveryAssignment) => void;
}

export default function AssignmentTable({ 
  deliveries, 
  onAssign, 
  onRemove, 
  onViewDetails 
}: AssignmentTableProps) {
  
  const handleNavigate = (delivery: DeliveryAssignment) => {
    if (delivery.latitude && delivery.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${delivery.latitude},${delivery.longitude}`, '_blank');
    } else {
      const destination = encodeURIComponent(delivery.deliveryAddress || '');
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    }
  };
  
  const getStatusBadge = (status: DeliveryAssignment['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Out for Delivery':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Preparing':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Assigned':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Failed':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'Pending Assignment':
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-100';
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs font-semibold text-[#1F2937]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-4 px-6">Order ID</th>
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Meal Details</th>
              <th className="py-4 px-6">Address</th>
              <th className="py-4 px-6">Slot Time</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Partner</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="hover:bg-[#FFF8E7]/30 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-500">{delivery.id}</td>
                <td className="py-4 px-6 font-black text-[#1F2937]">{delivery.customerName}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 border border-slate-200/40 text-slate-600">
                    {delivery.mealName}
                  </span>
                </td>
                <td className="py-4 px-6 max-w-[200px] truncate" title={delivery.deliveryAddress}>
                  {delivery.deliveryAddress}
                </td>
                <td className="py-4 px-6 text-slate-500">{delivery.deliveryTime}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getStatusBadge(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {delivery.assignedPartnerName ? (
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-[#F59E0B]">{delivery.assignedPartnerName}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-bold italic">Unassigned</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleNavigate(delivery)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Navigate on Google Maps"
                    >
                      <Navigation size={14} />
                    </button>
                    <button
                      onClick={() => onViewDetails(delivery)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    
                    {delivery.status === 'Pending Assignment' ? (
                      <button
                        onClick={() => onAssign(delivery)}
                        className="py-1 px-2.5 bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-sm"
                        title="Assign Partner"
                      >
                        <UserCheck size={12} />
                        <span>Assign</span>
                      </button>
                    ) : (
                      <>
                        {(delivery.status === 'Assigned' || delivery.status === 'Preparing') && (
                          <>
                            <button
                              onClick={() => onAssign(delivery)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg border border-slate-200 cursor-pointer"
                              title="Reassign Partner"
                            >
                              <RefreshCw size={12} />
                            </button>
                            <button
                              onClick={() => onRemove(delivery.id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 cursor-pointer"
                              title="Remove Assignment"
                            >
                              <UserMinus size={12} />
                            </button>
                          </>
                        )}
                      </>
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
