import React from 'react';

type LoaderType = 'stats' | 'charts' | 'top_meals' | 'top_customers' | 'table' | 'goals';

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

  const renderCharts = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-6">
            <div className="space-y-2">
              <div className="h-3.5 bg-slate-200 rounded-full w-32" />
              <div className="h-2.5 bg-slate-200 rounded-full w-44" />
            </div>
            <div className="h-60 bg-slate-100 rounded-xl w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTopMeals = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-3.5 flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded-full w-24" />
                <div className="h-2.5 bg-slate-200 rounded-full w-14" />
              </div>
            </div>
            <div className="text-right space-y-1.5">
              <div className="h-3 bg-slate-200 rounded-full w-12 ml-auto" />
              <div className="h-2 bg-slate-200 rounded-full w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTopCustomers = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-3.5 flex-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded-full w-24" />
                <div className="h-2.5 bg-slate-200 rounded-full w-14" />
              </div>
            </div>
            <div className="text-right space-y-1.5">
              <div className="h-3 bg-slate-200 rounded-full w-12 ml-auto" />
              <div className="h-2 bg-slate-200 rounded-full w-16 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-50 border-b border-slate-100 w-full" />
      <div className="divide-y divide-slate-100 p-5 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="h-3 bg-slate-200 rounded-full w-16" />
            <div className="space-y-2 flex-1 mx-8">
              <div className="h-3.5 bg-slate-200 rounded-full w-32" />
              <div className="h-2 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="h-3 bg-slate-200 rounded-full w-24" />
            <div className="h-6 bg-slate-200 rounded-full w-20 mx-8" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="space-y-4 pt-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <div className="h-3 bg-slate-200 rounded-full w-28" />
              <div className="h-3 bg-slate-200 rounded-full w-12" />
            </div>
            <div className="h-2 bg-slate-200 rounded-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'stats': return renderStats();
    case 'charts': return renderCharts();
    case 'top_meals': return renderTopMeals();
    case 'top_customers': return renderTopCustomers();
    case 'table': return renderTable();
    case 'goals': return renderGoals();
    default: return null;
  }
}
