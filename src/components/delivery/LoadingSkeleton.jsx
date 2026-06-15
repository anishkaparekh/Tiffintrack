import React from 'react';

export default function LoadingSkeleton({ type }) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-card animate-pulse flex items-center justify-between h-24">
            <div className="space-y-2 flex-grow">
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-card animate-pulse">
        <div className="bg-slate-50 h-12 border-b border-slate-200/60"></div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-28"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-36"></div>
              <div className="h-5 bg-slate-200 rounded-full w-14"></div>
              <div className="flex space-x-2">
                <div className="h-7 bg-slate-200 rounded-lg w-16"></div>
                <div className="h-7 bg-slate-200 rounded-lg w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'notifications') {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-4.5 shadow-card animate-pulse flex items-start space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-2.5 bg-slate-200 rounded w-12 pt-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'history') {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-card animate-pulse flex items-center justify-between h-20">
            <div className="space-y-2 flex-grow">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-5 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
