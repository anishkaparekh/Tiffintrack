import React from 'react';

export default function AddressLoadingSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border-2 border-slate-200/60 rounded-2xl p-5 bg-white space-y-4 animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-slate-200 rounded-lg" />
              <div className="w-12 h-3 bg-slate-200 rounded" />
            </div>
            <div className="w-16 h-4 bg-slate-200 rounded-md" />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="w-1/3 h-3.5 bg-slate-200 rounded" />
            <div className="w-1/4 h-3 bg-slate-200 rounded" />
          </div>

          {/* Body */}
          <div className="w-5/6 h-3 bg-slate-200 rounded" />

          {/* Footer */}
          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
            <div className="w-20 h-3 bg-slate-200 rounded" />
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-slate-200 rounded-lg" />
              <div className="w-6 h-6 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
