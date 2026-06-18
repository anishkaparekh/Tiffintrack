import React, { useState } from 'react';
import { MoreVertical, Bell, Pause, Play, Download, User, Activity } from 'lucide-react';
import { CustomerItem, SubscriptionStatus } from '../../../types/customers';

interface CustomersTableProps {
  customers: CustomerItem[];
  onViewProfile: (customer: CustomerItem) => void;
  onViewActivity: (customer: CustomerItem) => void;
  onSubscriptionAction: (id: string, actionType: 'pause' | 'resume' | 'reminder' | 'export') => void;
}

export default function CustomersTable({
  customers,
  onViewProfile,
  onViewActivity,
  onSubscriptionAction
}: CustomersTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
            <span>Active</span>
          </span>
        );
      case 'Paused':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
            <span>Paused</span>
          </span>
        );
      case 'Renewal Due':
        return (
          <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            <span>Renewal Due</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 w-max">
            <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
            <span>Expired</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleDropdownAction = (id: string, actionType: 'pause' | 'resume' | 'reminder' | 'export') => {
    onSubscriptionAction(id, actionType);
    setActiveDropdownId(null);
  };

  return (
    <div className="w-full">
      {/* 1. Desktop & Tablet View (Scrollable Table) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-[#E5E7EB] text-slate-400 font-black uppercase tracking-wider">
                <th className="py-4 px-5 font-black">Customer</th>
                <th className="py-4 px-5 font-black">Current Plan</th>
                <th className="py-4 px-5 font-black">Delivery Address</th>
                <th className="py-4 px-5 font-black">Join Date</th>
                <th className="py-4 px-5 font-black">Status</th>
                <th className="py-4 px-5 font-black">Lifetime Value</th>
                <th className="py-4 px-5 font-black">Last Order</th>
                <th className="py-4 px-5 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] font-bold text-[#1F2937]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-extrabold text-sm">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{c.phone} • {c.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-extrabold text-slate-800">{c.currentPlan}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{c.mealsPerWeek}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5 max-w-[200px] truncate" title={c.deliveryAddress}>
                    <div>
                      <p className="font-semibold text-slate-600 truncate">{c.deliveryAddress}</p>
                      {c.latitude !== undefined && c.longitude !== undefined && (
                        <p className="text-[10px] text-blue-500 font-black mt-0.5">
                          📍 {c.latitude.toFixed(6)}, {c.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-semibold">{c.joinDate}</td>
                  <td className="py-4 px-5">{getStatusBadge(c.status)}</td>
                  <td className="py-4 px-5 font-black text-slate-700">₹{c.lifetimeValue.toLocaleString()}</td>
                  <td className="py-4 px-5 text-slate-400 font-semibold">{c.lastOrderDate}</td>
                  <td className="py-4 px-5 text-right relative">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewProfile(c)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-slate-500 hover:text-[#F59E0B] transition-all cursor-pointer flex items-center space-x-1"
                        title="View Profile"
                      >
                        <User size={13} />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => onViewActivity(c)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FFF8E7] text-slate-500 hover:text-[#F59E0B] transition-all cursor-pointer flex items-center space-x-1"
                        title="View Activity"
                      >
                        <Activity size={13} />
                        <span>Activity</span>
                      </button>

                      {/* Action Dropdown Toggle */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === c.id ? null : c.id)}
                          className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {activeDropdownId === c.id && (
                          <>
                            <div onClick={() => setActiveDropdownId(null)} className="fixed inset-0 z-10" />
                            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-20 text-left font-semibold">
                              <button
                                onClick={() => handleDropdownAction(c.id, 'reminder')}
                                className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                              >
                                <Bell size={13} className="text-amber-500" />
                                <span>Send Reminder</span>
                              </button>
                              
                              {c.status === 'Active' ? (
                                <button
                                  onClick={() => handleDropdownAction(c.id, 'pause')}
                                  className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Pause size={13} className="text-[#F59E0B]" />
                                  <span>Pause Sub</span>
                                </button>
                              ) : c.status === 'Paused' ? (
                                <button
                                  onClick={() => handleDropdownAction(c.id, 'resume')}
                                  className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                                >
                                  <Play size={13} className="text-[#F59E0B]" />
                                  <span>Resume Sub</span>
                                </button>
                              ) : null}

                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => handleDropdownAction(c.id, 'export')}
                                className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                              >
                                <Download size={13} className="text-slate-400" />
                                <span>Export Data</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile View (Card-Based Layout) */}
      <div className="block sm:hidden space-y-4">
        {customers.map((c) => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col space-y-4"
          >
            {/* Card Header */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-extrabold text-sm text-[#1F2937] leading-none">{c.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">{c.phone} • {c.email}</p>
              </div>
              {getStatusBadge(c.status)}
            </div>

            {/* Plan Info */}
            <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-[10px] font-bold">
              <div>
                <span className="text-slate-400 block uppercase tracking-wide">Subscription Plan</span>
                <span className="text-slate-800 font-extrabold">{c.currentPlan}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block uppercase tracking-wide">Lifetime Value</span>
                <span className="text-[#F59E0B] font-black">₹{c.lifetimeValue.toLocaleString()}</span>
              </div>
            </div>

            {/* Address & coordinates */}
            <div className="text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-3">
              <span className="text-slate-400 block uppercase tracking-wide">Delivery Address</span>
              <p className="text-slate-700 font-bold mt-0.5">{c.deliveryAddress}</p>
              {c.latitude !== undefined && c.longitude !== undefined && (
                <p className="text-blue-500 font-black mt-1">📍 GPS: {c.latitude.toFixed(6)}, {c.longitude.toFixed(6)}</p>
              )}
            </div>

            {/* Dates info */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold">
              <div>
                <span className="block uppercase tracking-wide">Joined</span>
                <span className="text-slate-600 font-bold">{c.joinDate}</span>
              </div>
              <div>
                <span className="block uppercase tracking-wide">Last Order</span>
                <span className="text-slate-600 font-bold">{c.lastOrderDate}</span>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewProfile(c)}
                  className="px-3.5 py-1.5 bg-[#FFF8E7] border border-[#F59E0B]/10 rounded-xl text-xs font-extrabold text-[#F59E0B] hover:bg-[#F59E0B]/5 transition-all cursor-pointer"
                >
                  Profile
                </button>
                <button
                  onClick={() => onViewActivity(c)}
                  className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Activity
                </button>
              </div>

              {/* Status Update Quick Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdownId(activeDropdownId === c.id ? null : c.id)}
                  className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <span>Actions</span>
                  <MoreVertical size={12} />
                </button>

                {activeDropdownId === c.id && (
                  <>
                    <div onClick={() => setActiveDropdownId(null)} className="fixed inset-0 z-30" />
                    <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-40 text-left font-semibold">
                      <button
                        onClick={() => handleDropdownAction(c.id, 'reminder')}
                        className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                      >
                        <Bell size={13} className="text-amber-500" />
                        <span>Send Reminder</span>
                      </button>
                      
                      {c.status === 'Active' ? (
                        <button
                          onClick={() => handleDropdownAction(c.id, 'pause')}
                          className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Pause size={13} className="text-[#F59E0B]" />
                          <span>Pause Sub</span>
                        </button>
                      ) : c.status === 'Paused' ? (
                        <button
                          onClick={() => handleDropdownAction(c.id, 'resume')}
                          className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] hover:text-[#F59E0B] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                        >
                          <Play size={13} className="text-[#F59E0B]" />
                          <span>Resume Sub</span>
                        </button>
                      ) : null}

                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => handleDropdownAction(c.id, 'export')}
                        className="w-full px-3.5 py-2 hover:bg-[#FFF8E7] flex items-center space-x-2 text-slate-700 transition-colors text-xs"
                      >
                        <Download size={13} className="text-slate-400" />
                        <span>Export Data</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
