import React from 'react';

type LoaderType = 'stats' | 'table' | 'priority' | 'schedule';

interface SkeletonLoaderProps {
  type: LoaderType;
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  
  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
          <div className="space-y-3 flex-1 mr-4">
            <div className="h-2.5 bg-slate-200 rounded-full w-20" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
            <div className="h-2.5 bg-slate-200 rounded-full w-28" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        </div>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-50 border-b border-slate-100 w-full" />
      <div className="divide-y divide-slate-100 p-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="h-3 bg-slate-200 rounded-full w-16" />
            <div className="space-y-2 flex-1 mx-8">
              <div className="h-3.5 bg-slate-200 rounded-full w-32" />
              <div className="h-2 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="h-3 bg-slate-200 rounded-full w-24" />
            <div className="h-6 bg-slate-200 rounded-full w-20 mx-8" />
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-xl" />
              <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPriority = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-28" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="space-y-2 flex-1 pr-6">
              <div className="h-3.5 bg-slate-200 rounded-full w-32" />
              <div className="h-2.5 bg-slate-200 rounded-full w-24" />
            </div>
            <div className="w-20 h-6 bg-slate-200 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-44" />
      </div>
      <div className="space-y-3 pt-2 pl-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="space-y-1.5 flex-1 pr-6">
              <div className="h-2 bg-slate-200 rounded-full w-8" />
              <div className="h-3 bg-slate-200 rounded-full w-24" />
            </div>
            <div className="w-16 h-6 bg-slate-200 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'stats': return renderStats();
    case 'table': return renderTable();
    case 'priority': return renderPriority();
    case 'schedule': return renderSchedule();
    default: return null;
  }
}
