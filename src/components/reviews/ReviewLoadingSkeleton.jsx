import React from 'react';

export default function ReviewLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div 
          key={item} 
          className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-card animate-pulse space-y-3"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-4 bg-slate-200 rounded w-28"></div>
              <div className="h-2.5 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-14"></div>
          </div>

          {/* Stars */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="w-3.5 h-3.5 bg-slate-200 rounded-full"></div>
            ))}
          </div>

          {/* Review text */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-slate-200 rounded w-full"></div>
            <div className="h-3 bg-slate-200 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
