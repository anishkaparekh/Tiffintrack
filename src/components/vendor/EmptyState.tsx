import React from 'react';
import { ChefHat, ShoppingBag, Users, CalendarRange } from 'lucide-react';

export type EmptyStateType = 'meals' | 'plans' | 'orders' | 'customers';

interface EmptyStateProps {
  type: EmptyStateType;
  onActionClick?: () => void;
}

export default function EmptyState({ type, onActionClick }: EmptyStateProps) {
  
  const getConfig = () => {
    switch (type) {
      case 'orders':
        return {
          icon: ShoppingBag,
          title: "No orders yet today.",
          description: "Start promoting your meal plans to receive bookings.",
          cta: "View Subscription Plans"
        };
      case 'customers':
        return {
          icon: Users,
          title: "No customers found.",
          description: "Create attractive meal plans to attract subscribers.",
          cta: "Create Plan"
        };
      case 'meals':
        return {
          icon: ChefHat,
          title: "You haven't added any meals yet.",
          description: "List your kitchen specialties to start receiving customer orders.",
          cta: "Add Your First Meal"
        };
      case 'plans':
        return {
          icon: CalendarRange,
          title: "No subscription plans available.",
          description: "Set up flexible daily, weekly, or monthly subscription plans for customers.",
          cta: "Create New Plan"
        };
      default:
        return {
          icon: ChefHat,
          title: "No data available",
          description: "Please check back later or add content.",
          cta: "Reload Page"
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto my-6">
      {/* Icon circle */}
      <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] border border-[#E5E7EB] text-[#F59E0B] flex items-center justify-center shadow-inner">
        <Icon size={28} />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h4 className="font-extrabold text-base text-[#1F2937] leading-snug">{config.title}</h4>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">{config.description}</p>
      </div>

      <button
        onClick={onActionClick}
        className="px-6 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white font-bold text-xs shadow-md shadow-[#F59E0B]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
      >
        {config.cta}
      </button>
    </div>
  );
}
