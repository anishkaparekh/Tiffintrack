import React from 'react';

type LoaderType = 'stats' | 'grid' | 'best_sellers';

interface SkeletonLoaderProps {
  type: LoaderType;
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  
  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-between">
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

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden h-80 flex flex-col justify-between p-5">
          <div className="space-y-4">
            <div className="w-full h-32 bg-slate-100 rounded-xl" />
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded-full w-28" />
              <div className="h-4 bg-slate-200 rounded-full w-12" />
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full w-2/3" />
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <div className="h-2.5 bg-slate-200 rounded-full w-8" />
              <div className="h-4 bg-slate-200 rounded-full w-12" />
            </div>
            <div className="w-14 h-8 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderBestSellers = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-36" />
        <div className="h-2.5 bg-slate-200 rounded-full w-44" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-3.5 flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded-full w-24" />
                <div className="h-2 bg-slate-200 rounded-full w-12" />
              </div>
            </div>
            <div className="text-right space-y-1.5">
              <div className="h-2 bg-slate-200 rounded-full w-10 ml-auto" />
              <div className="h-3 bg-slate-200 rounded-full w-12 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'stats': return renderStats();
    case 'grid': return renderGrid();
    case 'best_sellers': return renderBestSellers();
    default: return null;
  }
}
