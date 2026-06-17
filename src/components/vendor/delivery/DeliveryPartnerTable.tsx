import React from 'react';
import { Eye, Edit, ToggleLeft, ToggleRight, Bike, Compass } from 'lucide-react';
import { DeliveryPartner } from '../../../data/vendorDeliveryMockData';

interface DeliveryPartnerTableProps {
  partners: DeliveryPartner[];
  onView: (partner: DeliveryPartner) => void;
  onEdit: (partner: DeliveryPartner) => void;
  onToggleStatus: (id: string) => void;
  onAssignClick: (partner: DeliveryPartner) => void;
}

export default function DeliveryPartnerTable({ 
  partners, 
  onView, 
  onEdit, 
  onToggleStatus,
  onAssignClick 
}: DeliveryPartnerTableProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs font-semibold text-[#1F2937]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-slate-50/50 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-4 px-6">Partner ID</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Phone Number</th>
              <th className="py-4 px-6">Vehicle</th>
              <th className="py-4 px-6">Delivery Zones</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Today's Deliveries</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-[#FFF8E7]/30 transition-colors">
                <td className="py-4 px-6 text-slate-500 font-bold">{partner.id}</td>
                <td className="py-4 px-6 font-bold text-[#1F2937]">{partner.name}</td>
                <td className="py-4 px-6 text-slate-500">{partner.phone}</td>
                <td className="py-4 px-6">
                  <span className="flex items-center space-x-1.5 text-[#1F2937]">
                    <Bike size={13} className="text-slate-400" />
                    <span>{partner.vehicleType}</span>
                  </span>
                </td>
                <td className="py-4 px-6 max-w-[200px] truncate" title={partner.deliveryZones.join(', ')}>
                  <div className="flex flex-wrap gap-1">
                    {partner.deliveryZones.slice(0, 2).map((zone, idx) => (
                      <span 
                        key={idx} 
                        className="bg-slate-100 border border-slate-200/40 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold"
                      >
                        {zone.replace(', Rajkot', '')}
                      </span>
                    ))}
                    {partner.deliveryZones.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-bold">+{partner.deliveryZones.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleStatus(partner.id)}
                    className="focus:outline-none cursor-pointer"
                    title={partner.status === 'Active' ? 'Deactivate Partner' : 'Activate Partner'}
                  >
                    {partner.status === 'Active' ? (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-slate-350 rounded-full"></span>
                        <span>Inactive</span>
                      </span>
                    )}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <span className={`font-extrabold ${partner.todayDeliveriesCount > 0 ? 'text-[#F59E0B]' : 'text-slate-400'}`}>
                    {partner.todayDeliveriesCount} Runs
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(partner)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(partner)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="Edit Partner"
                    >
                      <Edit size={14} />
                    </button>
                    {partner.status === 'Active' && (
                      <button
                        onClick={() => onAssignClick(partner)}
                        className="py-1 px-2.5 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded-lg text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer"
                        title="Assign Deliveries"
                      >
                        <Compass size={11} />
                        <span>Assign</span>
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
