import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, CreditCard, Heart, ShoppingBag, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { CustomerItem, SubscriptionStatus } from '../../../types/customers';

interface CustomerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerItem | null;
}

export default function CustomerDetailsDrawer({
  isOpen,
  onClose,
  customer
}: CustomerDetailsDrawerProps) {
  if (!isOpen || !customer) return null;

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
            <span>Active</span>
          </span>
        );
      case 'Paused':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
            <span>Paused</span>
          </span>
        );
      case 'Renewal Due':
        return (
          <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
            <span>Renewal Due</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            <span>Expired</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-stretch justify-end">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel container */}
      <div className={`relative bg-white shadow-2xl transition-all duration-300 ease-in-out border-[#E5E7EB]
        w-full max-h-[85vh] sm:max-h-full rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl sm:max-w-md flex flex-col justify-between z-10
        ${isOpen ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}
      `}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="text-[#00B074]" size={20} />
            <h3 className="font-extrabold text-base text-[#1F2937]">Customer Profile</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-[#1F2937] hover:bg-[#F4F9F6] rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-bold text-slate-500">
          
          {/* Profile Name Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F9F6]/50 p-4 rounded-xl border border-[#00B074]/15">
            <div>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">ID: {customer.id}</span>
              <h2 className="text-base font-black text-[#1F2937] leading-none mt-0.5">{customer.name}</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Customer since {customer.joinDate.split(' ')[2]}</p>
            </div>
            {getStatusBadge(customer.status)}
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <User size={16} className="text-slate-400" />
              <span className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Personal Details</span>
            </div>

            <div className="space-y-3 pl-7 font-semibold text-slate-600">
              <div className="flex items-center space-x-2.5">
                <Phone size={13} className="text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail size={13} className="text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{customer.deliveryAddress}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E5E7EB]" />

          {/* Subscription Details */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <CreditCard size={16} className="text-slate-400" />
              <span className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Subscription Plan Details</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pl-7 text-xs font-semibold">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Subscription Tier</span>
                <span className="text-[#1F2937] font-black">{customer.currentPlan}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Meals per Week</span>
                <span className="text-[#1F2937] font-black">{customer.mealsPerWeek}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Start Date</span>
                <span className="text-slate-600 font-semibold">{customer.joinDate}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Renewal Date</span>
                <span className="text-slate-600 font-semibold">09 Jul 2026</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E5E7EB]" />

          {/* Order Spend Summary */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-3 text-slate-700">
              <TrendingUp size={16} className="text-slate-400" />
              <span className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Engagement & Order Summary</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pl-7 text-center">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <ShoppingBag size={14} className="text-[#00B074] mx-auto mb-1" />
                <span className="text-base font-black text-[#1F2937] block leading-none">{customer.totalOrders}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1 tracking-wider">Total Tiffins</span>
              </div>
              
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <Heart size={14} className="text-[#DC2626] mx-auto mb-1" />
                <span className="text-[10px] font-black text-[#1F2937] block leading-none truncate">{customer.favoriteMeal}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block mt-1.5 tracking-wider">Favorite meal</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[#00B074] font-black text-xs block leading-none">₹{customer.avgMonthlySpend.toLocaleString()}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block mt-2.5 tracking-wider">Avg spend / Mo</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[#00B074] font-black text-xs block leading-none">₹{customer.lifetimeValue.toLocaleString()}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase block mt-2.5 tracking-wider">Lifetime value</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#E5E7EB]" />

          {/* Activity Timeline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-slate-700">
              <Sparkles size={16} className="text-slate-400" />
              <span className="text-xs font-black text-[#1F2937] uppercase tracking-wider">Relationship Activity Feed</span>
            </div>

            <div className="relative pl-6 space-y-4 ml-2 pt-1">
              {/* Connecting Vertical line */}
              <div className="absolute left-2.5 top-2 bottom-2 w-[1.5px] bg-slate-200" />

              {customer.activityFeed.map((log) => (
                <div key={log.id} className="relative flex items-start space-x-3 group">
                  {/* Dot */}
                  <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-white border-2 border-[#00B074] flex items-center justify-center z-10">
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>

                  <div className="space-y-0.5 flex-1 leading-snug">
                    <p className="text-slate-700 font-bold text-xs">{log.text}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 w-full bg-[#00B074] hover:bg-[#00B074]/95 text-white font-bold text-xs rounded-xl shadow-md shadow-[#00B074]/15 transition-all cursor-pointer text-center"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
