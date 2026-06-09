import React from 'react';

type LoaderType = 'stats' | 'chart' | 'table' | 'feed' | 'meals';

interface SkeletonLoaderProps {
  type: LoaderType;
  count?: number;
}

export default function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  
  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between animate-pulse">
          <div className="space-y-3 flex-1 mr-4">
            <div className="h-2.5 bg-slate-200 rounded-full w-24" />
            <div className="h-6 bg-slate-200 rounded-full w-16" />
            <div className="h-2.5 bg-slate-200 rounded-full w-32" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
        </div>
      ))}
    </div>
  );

  const renderChart = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-full w-36" />
          <div className="h-2.5 bg-slate-200 rounded-full w-48" />
        </div>
        <div className="h-9 bg-slate-200 rounded-xl w-44" />
      </div>
      {/* simulated chart area */}
      <div className="h-80 w-full bg-slate-100 rounded-xl flex items-end justify-between p-4 space-x-2">
        <div className="h-1/3 w-full bg-slate-200 rounded-t-lg" />
        <div className="h-1/2 w-full bg-slate-200 rounded-t-lg" />
        <div className="h-2/3 w-full bg-slate-200 rounded-t-lg" />
        <div className="h-1/2 w-full bg-slate-200 rounded-t-lg" />
        <div className="h-3/4 w-full bg-slate-200 rounded-t-lg" />
        <div className="h-full w-full bg-slate-200 rounded-t-lg" />
        <div className="h-2/3 w-full bg-slate-200 rounded-t-lg" />
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-pulse">
      <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-200 rounded-full w-28" />
          <div className="h-2.5 bg-slate-200 rounded-full w-36" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
            <div className="h-3.5 bg-slate-200 rounded-full w-20" />
            <div className="h-3.5 bg-slate-200 rounded-full w-32" />
            <div className="h-3.5 bg-slate-200 rounded-full w-24" />
            <div className="h-3.5 bg-slate-200 rounded-full w-16" />
            <div className="h-6 bg-slate-200 rounded-full w-24" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeed = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
            <div className="flex items-center space-x-3.5 flex-1">
              <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
              <div className="h-3 bg-slate-200 rounded-full w-3/4" />
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full w-12 ml-4" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeals = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden h-72 flex flex-col justify-between p-5 animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-slate-200 rounded-full w-20" />
              <div className="h-5 bg-slate-200 rounded-full w-16" />
            </div>
            <div className="h-4 bg-slate-200 rounded-full w-36" />
            <div className="h-2.5 bg-slate-200 rounded-full w-28" />
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <div className="h-2.5 bg-slate-200 rounded-full w-10" />
              <div className="h-4 bg-slate-200 rounded-full w-16" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );

  switch (type) {
    case 'stats': return renderStats();
    case 'chart': return renderChart();
    case 'table': return renderTable();
    case 'feed': return renderFeed();
    case 'meals': return renderMeals();
    default: return null;
  }
}
