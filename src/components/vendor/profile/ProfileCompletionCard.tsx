import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProfileCompletionCardProps {
  completionPercentage: number;
}

export default function ProfileCompletionCard({ completionPercentage }: ProfileCompletionCardProps) {
  const checklist = [
    { text: "Business Information Completed", isDone: true },
    { text: "Kitchen Details Added", isDone: true },
    { text: "Delivery Areas Configured", isDone: true },
    { text: "Operating Hours Updated", isDone: true },
    { text: "Upload Business Cover Photo", isDone: false }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      {/* Title & Progress % */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Profile Setup Progress</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Complete tasks to publish your kitchen</p>
        </div>
        <span className="text-base font-black text-[#F59E0B]">{completionPercentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-[#F59E0B] h-full rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Checklist list */}
      <div className="space-y-2.5 pt-2">
        {checklist.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-xs font-bold">
            {item.isDone ? (
              <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
            ) : (
              <AlertTriangle size={16} className="text-[#F59E0B] shrink-0 animate-pulse" />
            )}
            <span className={item.isDone ? 'text-slate-600' : 'text-slate-500 font-extrabold'}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
