import React from 'react';

type LoaderType = 'profile' | 'insights' | 'hours' | 'notifications' | 'delivery';

interface SkeletonLoaderProps {
  type: LoaderType;
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  
  const renderProfile = () => (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden animate-pulse flex flex-col justify-between">
      <div className="h-32 bg-slate-200 w-full" />
      <div className="px-6 pb-6 pt-16 relative space-y-4">
        <div className="absolute -top-12 left-6 w-20 h-20 rounded-2xl bg-slate-300 border-2 border-white" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-full w-32" />
          <div className="h-2.5 bg-slate-200 rounded-full w-48" />
        </div>
        <div className="h-3 bg-slate-200 rounded-full w-full" />
        <div className="h-3 bg-slate-200 rounded-full w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-slate-200 rounded-xl flex-1" />
          <div className="h-10 bg-slate-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-36" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 bg-slate-50 rounded-xl flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2 bg-slate-200 rounded-full w-12" />
              <div className="h-3 bg-slate-200 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHours = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-44" />
      </div>
      <div className="space-y-3 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-xl">
            <div className="space-y-2 flex-1 pr-6">
              <div className="h-3 bg-slate-200 rounded-full w-20" />
              <div className="h-2 bg-slate-200 rounded-full w-12" />
            </div>
            <div className="space-y-1.5 text-right w-28 shrink-0">
              <div className="h-3.5 bg-slate-200 rounded-full w-24 ml-auto" />
              <div className="h-3.5 bg-slate-200 rounded-full w-24 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-44" />
      </div>
      <div className="space-y-4 pt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <div className="space-y-2 flex-1 pr-4">
              <div className="h-3 bg-slate-200 rounded-full w-24" />
              <div className="h-2 bg-slate-200 rounded-full w-full" />
            </div>
            <div className="w-10 h-5 bg-slate-200 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-full w-32" />
        <div className="h-2.5 bg-slate-200 rounded-full w-48" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-2">
            <div className="w-6 h-6 bg-slate-200 rounded-full mx-auto" />
            <div className="h-3 bg-slate-200 rounded-full w-10 mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-2 bg-slate-200 rounded-full w-28" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-16 h-5 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'profile': return renderProfile();
    case 'insights': return renderInsights();
    case 'hours': return renderHours();
    case 'notifications': return renderNotifications();
    case 'delivery': return renderDelivery();
    default: return null;
  }
}
