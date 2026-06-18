import React from 'react';
import { MapPin, AlertCircle, FileText, Inbox } from 'lucide-react';

interface EmptyStateProps {
  type: 'addresses' | 'instructions' | 'details';
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const getUIConfig = () => {
    switch (type) {
      case 'instructions':
        return {
          icon: FileText,
          title: "No Delivery Instructions",
          desc: message || "No special instructions provided by the customer. Tiffin will be dropped off at the default doorstep location.",
          bgColor: "bg-amber-50/50",
          iconColor: "text-amber-500",
          borderColor: "border-amber-100"
        };
      case 'details':
        return {
          icon: AlertCircle,
          title: "No Delivery Details Available",
          desc: message || "Select a delivery order from the queue to load complete recipient information, landmarks, and drop-off guidelines.",
          bgColor: "bg-slate-50",
          iconColor: "text-slate-400",
          borderColor: "border-slate-200/50"
        };
      case 'addresses':
      default:
        return {
          icon: MapPin,
          title: "No Saved Addresses Yet",
          desc: message || "You haven't added any delivery addresses. Add a home, office, or parents' address to get your hot meals delivered seamlessly.",
          bgColor: "bg-[#FFF8E7]",
          iconColor: "text-[#F59E0B]",
          borderColor: "border-[#F59E0B]/10"
        };
    }
  };

  const config = getUIConfig();
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl border ${config.borderColor} ${config.bgColor} min-h-[220px] transition-all`}>
      <div className={`p-4 rounded-full ${config.bgColor} ${config.iconColor} mb-4 border border-current/10 shadow-sm`}>
        <Icon size={32} strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-extrabold text-[#1F2937] mb-1.5">{config.title}</h3>
      <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed font-semibold">
        {config.desc}
      </p>
    </div>
  );
}
