import React from 'react';

type SkeletonType = 'stats' | 'feed' | 'alerts' | 'preferences';

interface SkeletonLoaderProps {
  type: SkeletonType;
  count?: number;
}

export default function SkeletonLoader({ type, count = 3 }: SkeletonLoaderProps) {
  
  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="space-y-2.5 flex-1 mr-4">
            <div className="h-2 bg-slate-200 rounded-full w-24" />
            <div className="h-5 bg-slate-200 rounded-full w-32" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100" />
        </div>
      ))}
    </div>
  );

  const renderFeed = () => (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 2 }).map((_, groupIdx) => (
        <div key={groupIdx} className="space-y-4">
          {/* Header Title */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="h-3 bg-slate-200 rounded-full w-20" />
          </div>

          {/* Cards timeline items */}
          <div className="pl-4 md:pl-6 border-l-2 border-slate-100 ml-3.5 md:ml-4 space-y-4">
            {Array.from({ length: count }).map((_, cardIdx) => (
              <div key={cardIdx} className="relative bg-white p-4 md:p-5 rounded-2xl border border-slate-100 flex items-start space-x-3.5">
                <div className="absolute -left-[21px] md:-left-[29px] top-5 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                <div className="p-2.5 rounded-xl bg-slate-100 w-10 h-10 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 bg-slate-200 rounded-full w-14" />
                    <div className="h-2 bg-slate-200 rounded-full w-10" />
                  </div>
                  <div className="h-3.5 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-2.5 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-2 bg-slate-200 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAlerts = () => (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 h-11" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-slate-100 w-8 h-8 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-slate-200 rounded-full w-2/3" />
              <div className="h-2 bg-slate-200 rounded-full w-full" />
              <div className="h-2 bg-slate-200 rounded-full w-1/3 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
      <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-slate-100 w-8 h-8" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 bg-slate-200 rounded-full w-24" />
          <div className="h-2 bg-slate-200 rounded-full w-16" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2.5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 h-9" />
        ))}
      </div>
      <div className="w-full py-5 rounded-xl bg-slate-100" />
    </div>
  );

  switch (type) {
    case 'stats': return renderStats();
    case 'feed': return renderFeed();
    case 'alerts': return renderAlerts();
    case 'preferences': return renderPreferences();
    default: return null;
  }
}
