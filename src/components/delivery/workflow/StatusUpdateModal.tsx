import React, { useState } from 'react';
import { X, CheckCircle2, Bike, AlertTriangle, ArrowRight, PackageOpen } from 'lucide-react';
import { DeliveryAssignment } from '../../../data/vendorDeliveryMockData';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  targetStatus: DeliveryAssignment['status'];
  onConfirm: (reason?: string | null) => void;
}

export default function StatusUpdateModal({
  isOpen,
  onClose,
  orderId,
  customerName,
  targetStatus,
  onConfirm
}: StatusUpdateModalProps) {
  const [failReason, setFailReason] = useState('Customer Unavailable');

  if (!isOpen) return null;

  const getConfirmationMessage = () => {
    switch (targetStatus) {
      case 'Out for Delivery':
        return {
          title: 'Mark Out for Delivery?',
          desc: `Confirm that you are leaving the kitchen and heading to ${customerName}'s delivery address.`,
          btnClass: 'bg-[#F59E0B] hover:bg-[#F59E0B]/95',
          icon: <Bike size={24} className="text-[#F59E0B]" />,
          iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20'
        };
      case 'Delivered':
        return {
          title: 'Confirm Delivery Complete?',
          desc: `Have you successfully handed over the thali to ${customerName} or left it as per instructions?`,
          btnClass: 'bg-[#F59E0B] hover:bg-[#F59E0B]/95',
          icon: <CheckCircle2 size={24} className="text-[#F59E0B]" />,
          iconBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20'
        };
      case 'Failed':
        return {
          title: 'Mark Delivery Failed?',
          desc: `Please select the reason for failing to deliver the tiffin box to ${customerName}.`,
          btnClass: 'bg-red-600 hover:bg-red-700',
          icon: <AlertTriangle size={24} className="text-red-600" />,
          iconBg: 'bg-red-50 border-red-100'
        };
      case 'Preparing':
        return {
          title: 'Mark Meal Prepared?',
          desc: `Confirm that the meal has been prepared and packed at the kitchen desk for ${customerName}.`,
          btnClass: 'bg-indigo-600 hover:bg-indigo-750',
          icon: <PackageOpen size={24} className="text-indigo-600" />,
          iconBg: 'bg-indigo-50 border-indigo-100'
        };
      case 'Assigned':
      default:
        return {
          title: 'Confirm Operation Action?',
          desc: `Confirm transitioning order ${orderId} to status ${targetStatus}.`,
          btnClass: 'bg-slate-900 hover:bg-slate-800',
          icon: <CheckCircle2 size={24} className="text-slate-600" />,
          iconBg: 'bg-slate-100 border-slate-200'
        };
    }
  };

  const modalDetails = getConfirmationMessage();

  const handleConfirmClick = () => {
    if (targetStatus === 'Failed') {
      onConfirm(failReason);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-[#E5E7EB] animate-scaleUp">
        
        {/* Top Close */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 cursor-pointer transition-colors"
        >
          <X size={14} />
        </button>

        {/* Modal body */}
        <div className="p-6 text-center space-y-4 pt-8">
          
          {/* Header Icon */}
          <div className={`w-14 h-14 rounded-full border flex items-center justify-center mx-auto ${modalDetails.iconBg}`}>
            {modalDetails.icon}
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-[#1F2937]">{modalDetails.title}</h3>
            <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto leading-relaxed">
              {modalDetails.desc}
            </p>
          </div>

          {/* Failed details selection */}
          {targetStatus === 'Failed' && (
            <div className="text-left space-y-1 mt-2">
              <label className="text-[9px] font-black text-slate-450 uppercase tracking-wider block">Reason for failure</label>
              <select
                value={failReason}
                onChange={(e) => setFailReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-red-500 focus:bg-white"
              >
                <option value="Customer Unavailable">Customer Unavailable</option>
                <option value="House Locked / Phone Switched Off">House Locked / Phone Switched Off</option>
                <option value="Incorrect Address Location">Incorrect Address Location</option>
                <option value="Customer Cancelled at Doorstep">Customer Cancelled at Doorstep</option>
              </select>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClick}
              className={`flex-1 py-2.5 text-xs font-bold text-white rounded-xl transition-all cursor-pointer ${modalDetails.btnClass}`}
            >
              Confirm
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
