import React from 'react';
import { Layers, ShoppingBag, Users, Zap } from 'lucide-react';

export default function RevenueBreakdownCard() {
  const categories = [
    {
      title: "Subscription Revenue",
      amount: 171800,
      contribution: 72,
      desc: "Recurring monthly memberships",
      icon: Layers,
      color: "bg-[#00B074]/10 text-[#00B074]",
      progressColor: "bg-[#00B074]"
    },
    {
      title: "One-Time Orders",
      amount: 42900,
      contribution: 18,
      desc: "Single purchase chef lunches",
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
      progressColor: "bg-blue-600"
    },
    {
      title: "Family Plans Revenue",
      amount: 16700,
      contribution: 7,
      desc: "4-member bundle subscriptions",
      icon: Users,
      color: "bg-amber-50 text-amber-500",
      progressColor: "bg-amber-500"
    },
    {
      title: "Custom Plans Revenue",
      amount: 7300,
      contribution: 3,
      desc: "Bespoke kitchen configurations",
      icon: Zap,
      color: "bg-red-50 text-red-500",
      progressColor: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{cat.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 ${cat.color}`}>
                <Icon size={16} />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black text-[#1F2937]">₹{cat.amount.toLocaleString()}</h4>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                <span>Contribution</span>
                <span className="text-slate-700">{cat.contribution}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className={`h-full rounded-full ${cat.progressColor}`}
                  style={{ width: `${cat.contribution}%` }}
                />
              </div>
              
              <span className="block text-[9px] text-slate-400 font-semibold mt-2">{cat.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
