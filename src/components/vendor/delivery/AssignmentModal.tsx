import React, { useMemo } from 'react';
import { X, CheckCircle, Bike, MapPin, UserPlus } from 'lucide-react';
import { DeliveryPartner, DeliveryAssignment } from '../../../data/vendorDeliveryMockData';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: DeliveryAssignment | null;
  partners: DeliveryPartner[];
  onSelectPartner: (partnerId: string) => void;
}

export default function AssignmentModal({ 
  isOpen, 
  onClose, 
  delivery, 
  partners, 
  onSelectPartner 
}: AssignmentModalProps) {
  
  const activePartners = useMemo(() => {
    return partners.filter(p => p.status === 'Active');
  }, [partners]);

  // Extract zone name from delivery address to recommend matching partners
  const recommendedPartners = useMemo(() => {
    if (!delivery) return [];
    
    // Find matching zones in deliveryAddress (e.g., Kalawad Road)
    const addr = delivery.deliveryAddress.toLowerCase();
    
    return activePartners.map(partner => {
      const coversZone = partner.deliveryZones.some(zone => 
        addr.includes(zone.split(',')[0].toLowerCase().trim())
      );
      return { ...partner, coversZone };
    }).sort((a, b) => (b.coversZone ? 1 : 0) - (a.coversZone ? 1 : 0)); // Put recommended ones first
  }, [delivery, activePartners]);

  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#1F2937]">Assign Delivery Partner</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Order ID: {delivery.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
          {/* Target delivery details */}
          <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl text-xs font-semibold text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>Customer: <strong className="text-[#1F2937]">{delivery.customerName}</strong></span>
              <span>Slot: <strong className="text-[#1F2937]">{delivery.deliveryTime}</strong></span>
            </div>
            <div className="flex items-start space-x-1">
              <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
              <span>Address: <strong className="text-[#1F2937]">{delivery.deliveryAddress}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>Meal Type:</span>
              <span className="px-1.5 py-0.5 bg-slate-200/60 border border-slate-350 text-slate-700 rounded text-[9px] font-black uppercase">
                {delivery.mealName}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Available Delivery Partners</h4>
            
            {recommendedPartners.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 font-semibold">No active delivery partners registered.</p>
            ) : (
              <div className="space-y-2.5">
                {recommendedPartners.map((partner) => (
                  <div 
                    key={partner.id} 
                    className={`p-4 border rounded-xl flex items-center justify-between transition-all hover:bg-slate-50/50 ${
                      partner.coversZone 
                        ? 'border-[#00B074]/30 bg-[#00B074]/5' 
                        : 'border-slate-200/70'
                    }`}
                  >
                    <div className="space-y-1.5 flex-grow pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-[#1F2937]">{partner.name}</span>
                        {partner.coversZone && (
                          <span className="bg-[#00B074]/15 text-[#00B074] px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">
                            Zone Match
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center space-x-1">
                          <Bike size={12} className="text-slate-400" />
                          <span>{partner.vehicleType}</span>
                        </span>
                        
                        <span className="text-slate-350">•</span>
                        
                        <span>
                          Workload: &nbsp;
                          <strong className={partner.todayDeliveriesCount > 2 ? 'text-amber-500' : 'text-[#00B074]'}>
                            {partner.todayDeliveriesCount} Assigned
                          </strong>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {partner.deliveryZones.map((z, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded text-[8px] font-bold">
                            {z.replace(', Rajkot', '')}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPartner(partner.id)}
                      className="py-2 px-3.5 bg-[#00B074] hover:bg-[#00B074]/95 text-white text-[10px] font-bold rounded-lg flex items-center space-x-1 cursor-pointer shadow-sm shrink-0"
                    >
                      <UserPlus size={12} />
                      <span>Select</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
