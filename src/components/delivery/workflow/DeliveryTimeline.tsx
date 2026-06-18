import React from 'react';
import { Check, Clock, AlertTriangle, Bike, Box, Bell } from 'lucide-react';
import { DeliveryAssignment } from '../../../data/vendorDeliveryMockData';

interface DeliveryTimelineProps {
  status: DeliveryAssignment['status'];
  timeSlot?: string;
  failReason?: string;
}

export default function DeliveryTimeline({ status, timeSlot, failReason }: DeliveryTimelineProps) {
  const steps = [
    { key: 'Preparing', label: 'Meal Prepared', desc: 'Fresh home-style thali packed in warm-lock box.' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider dispatched to your address location.' },
    { key: 'Delivered', label: 'Delivered', desc: 'Tiffin box delivered safely to your doorstep.' }
  ];

  const getStepIndex = (key: string) => steps.findIndex(s => s.key === key);
  const activeIdx = getStepIndex(status);
  const isFailed = status === 'Failed';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center space-x-1.5">
        <Clock size={14} className="text-[#F59E0B]" />
        <span>Delivery Status Timeline</span>
      </h3>

      <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        
        {/* Step 0: Confirmed (Implicit Start) */}
        <div className="relative text-xs">
          <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#F59E0B] flex items-center justify-center ring-4 ring-[#F59E0B]/15 text-white font-bold text-[8px]">
            ✓
          </span>
          <h4 className="font-extrabold text-[#1F2937]">Order Confirmed</h4>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">Tiffin request accepted by chef.</p>
        </div>

        {steps.map((step, idx) => {
          const isComplete = idx < activeIdx || status === 'Delivered';
          const isActive = idx === activeIdx && !isFailed;
          const isFailedStep = isFailed && idx === activeIdx;

          return (
            <div key={idx} className="relative text-xs">
              {isComplete ? (
                <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#F59E0B] flex items-center justify-center ring-4 ring-[#F59E0B]/15 text-white font-bold text-[8px]">
                  ✓
                </span>
              ) : isActive ? (
                <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#C2410C] flex items-center justify-center ring-4 ring-[#C2410C]/20 text-[#1F2937] font-black text-[9px] animate-pulse">
                  ●
                </span>
              ) : isFailedStep ? (
                <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-red-100 text-white font-bold text-[8px]">
                  !
                </span>
              ) : (
                <span className="absolute -left-[22px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-200 flex items-center justify-center ring-4 ring-slate-50 text-slate-400 text-[8px]">
                  ○
                </span>
              )}

              <h4 className={`font-extrabold ${isComplete || isActive ? 'text-[#1F2937]' : isFailedStep ? 'text-red-600' : 'text-slate-400'}`}>
                {step.label} {isFailedStep && `- Failed`}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                {isFailedStep ? `Attempt failed: ${failReason || 'Customer Unavailable'}` : step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
