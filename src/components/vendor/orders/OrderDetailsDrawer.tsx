import React from 'react';
import { X, User, Phone, MapPin, ClipboardList, Clock, Truck, FileText, CheckCircle2 } from 'lucide-react';
import { OrderItem, OrderStatus } from '../../../types/orders';

interface OrderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null;
}

const TIMELINE_STAGES: OrderStatus[] = [
  'Preparing', // Wait, let's treat "Received" as implicit stage 0, Preparing as stage 1, Out for Delivery as stage 2, Delivered as stage 3.
  'Preparing',
  'Out for Delivery',
  'Delivered'
];

export default function OrderDetailsDrawer({ isOpen, onClose, order }: OrderDetailsDrawerProps) {
  if (!isOpen || !order) return null;

  // Compute active timeline step index
  const getTimelineStep = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
      default:
        return -1;
    }
  };

  const currentStep = getTimelineStep(order.status);

  const steps = [
    { title: 'Order Received', desc: 'Subscription scheduled meal' },
    { title: 'Preparing', desc: 'Chef cooking fresh home meals' },
    { title: 'Out for Delivery', desc: 'Driver carrying tiffin box' },
    { title: 'Delivered', desc: 'Tiffin delivered successfully' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-stretch justify-end">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Panel container */}
      <div className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out border-[#E5E7EB]
        w-full max-h-[85vh] sm:max-h-full rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl sm:max-w-md flex flex-col justify-between z-10
        ${isOpen ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}
      `}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Fulfillment Details</span>
            <h3 className="font-extrabold text-base text-[#1F2937]">Order {order.id}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-bold text-slate-500">
          
          {/* Order Details & Quantity */}
          <div className="p-4 bg-[#F4F9F6]/50 border border-[#00B074]/15 rounded-xl space-y-3.5">
            <div className="flex items-center space-x-3 text-[#00B074]">
              <ClipboardList size={18} />
              <span className="text-sm font-black text-[#1F2937]">Meal & Plan Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Dish Ordered</span>
                <span className="text-[#1F2937] font-black">{order.mealName}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Quantity</span>
                <span className="text-[#1F2937] font-black">{order.quantity} Tiffin Box{order.quantity > 1 ? 'es' : ''}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Subscription Membership</span>
                <span className="text-[#00B074] font-black">{order.plan}</span>
              </div>
            </div>
          </div>

          {/* Customer Profile */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <User size={18} className="text-slate-400" />
              <span className="text-sm font-black text-[#1F2937]">Customer Details</span>
            </div>

            <div className="space-y-3 pl-7">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Contact Name</span>
                <span className="text-[#1F2937] font-extrabold">{order.customerName}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span className="text-slate-600 font-semibold">{order.phone}</span>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-semibold leading-relaxed">{order.address}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E5E7EB]" />

          {/* Delivery Specifics */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <Truck size={18} className="text-slate-400" />
              <span className="text-sm font-black text-[#1F2937]">Delivery & Courier Rules</span>
            </div>

            <div className="space-y-3 pl-7">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Target Delivery Window</span>
                <span className="text-[#1F2937] font-extrabold flex items-center mt-0.5">
                  <Clock size={12} className="text-[#00B074] mr-1.5" />
                  {order.deliveryTime}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Special Courier Instructions</span>
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-2.5 text-[11px] font-semibold text-[#F59E0B] leading-relaxed mt-0.5">
                  {order.deliveryInstructions || "No special instructions provided by customer."}
                </div>
              </div>

              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Assigned Delivery Partner</span>
                {order.deliveryPartnerName ? (
                  <div className="mt-1 space-y-1">
                    <span className="text-[#1F2937] font-extrabold block">{order.deliveryPartnerName}</span>
                    <span className="text-slate-650 font-semibold block">📞 {order.deliveryPartnerPhone || 'N/A'}</span>
                  </div>
                ) : (
                  <span className="text-[#1F2937] font-extrabold block mt-0.5">{order.assignedDriver || "Awaiting Driver Allocation"}</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E5E7EB]" />

          {/* Timeline Stages */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-700">
              <FileText size={18} className="text-slate-400" />
              <span className="text-sm font-black text-[#1F2937]">Fulfillment Progress Timeline</span>
            </div>

            {order.status === 'Cancelled' ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-[#DC2626] ml-7">
                <X size={16} className="bg-[#DC2626] text-white rounded-full p-0.5" />
                <span className="font-extrabold text-xs">Order Cancelled. Preparing and delivery logs terminated.</span>
              </div>
            ) : (
              <div className="relative pl-8 space-y-5 ml-2.5">
                {/* Connecting Vertical line */}
                <div className="absolute left-3.5 top-2.5 bottom-2.5 w-[2px] bg-slate-200" />

                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={idx} className="relative flex items-start space-x-4">
                      {/* Node Indicator */}
                      <div className={`absolute -left-[27px] w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                        isCompleted
                          ? 'bg-[#00B074] border-[#00B074] text-white'
                          : 'bg-white border-slate-300 text-slate-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 size={10} className="stroke-[3px]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* Details text */}
                      <div className="space-y-0.5">
                        <p className={`font-black text-xs transition-colors ${isCurrent ? 'text-[#00B074]' : isCompleted ? 'text-[#1F2937]' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 w-full bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#00B074]/15 transition-all cursor-pointer text-center"
          >
            Dismiss Details
          </button>
        </div>
      </div>
    </div>
  );
}
