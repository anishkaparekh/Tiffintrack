import React from 'react';

interface LoadingSkeletonProps {
  type: 'stats' | 'timeline' | 'logs' | 'table';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 3 }: LoadingSkeletonProps) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm animate-pulse flex items-center justify-between h-24">
            <div className="space-y-2 flex-grow">
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0 ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm animate-pulse space-y-5">
        <div className="h-3.5 bg-slate-200 rounded w-1/3 border-b border-slate-100 pb-3"></div>
        <div className="space-y-4 pl-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative space-y-2">
              <div className="absolute -left-8.5 top-0.5 w-3.5 h-3.5 rounded-full bg-slate-200"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'logs') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-4.5 rounded-2xl shadow-sm animate-pulse flex items-center justify-between h-20">
            <div className="space-y-2 flex-grow">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-2.5 bg-slate-100 rounded w-1/4"></div>
            </div>
            <div className="w-16 h-4 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm animate-pulse">
        <div className="bg-slate-50 h-12 border-b border-[#E5E7EB]"></div>
        <div className="p-4 space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-28"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-36"></div>
              <div className="h-5 bg-slate-200 rounded-full w-14"></div>
              <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
