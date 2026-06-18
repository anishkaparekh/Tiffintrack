import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { RevenueGoal } from '../../../types/revenue';

interface RevenueGoalCardProps {
  goals: RevenueGoal[];
}

export default function RevenueGoalCard({ goals }: RevenueGoalCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-5">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]">
          <Target size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Business Target Progress</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Tracking against target objectives</p>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal, idx) => (
          <div key={idx} className="space-y-2 p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
            <div className="flex items-center justify-between font-bold text-xs">
              <span className="text-slate-700">{goal.title}</span>
              <span className="text-[#F59E0B] font-black">{goal.progressPercentage}% Achieved</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-500" 
                style={{ width: `${goal.progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1">
              <span>Current: <strong className="text-slate-600 font-bold">{goal.unit === '₹' ? '₹' : ''}{goal.currentValue.toLocaleString()} {goal.unit !== '₹' ? goal.unit : ''}</strong></span>
              <span>Target: <strong className="text-slate-600 font-bold">{goal.unit === '₹' ? '₹' : ''}{goal.goalValue.toLocaleString()} {goal.unit !== '₹' ? goal.unit : ''}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
