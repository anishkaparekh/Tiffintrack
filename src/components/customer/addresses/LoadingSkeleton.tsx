import React from 'react';

interface LoadingSkeletonProps {
  type: 'card' | 'form' | 'vendor' | 'partner';
  count?: number;
}

export default function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const renderCards = () => (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card animate-pulse space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 rounded w-20"></div>
            <div className="h-5 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="space-y-2.5">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3.5 bg-slate-200 rounded w-full"></div>
            <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
          </div>
          <div className="h-px bg-slate-100 my-2"></div>
          <div className="flex gap-2 pt-2">
            <div className="h-9 bg-slate-200 rounded-xl flex-grow"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-10"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-10"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderForm = () => (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card animate-pulse space-y-6 max-w-2xl w-full">
      <div className="h-5 bg-slate-200 rounded w-1/4"></div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
            <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
        <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
        <div className="h-10 bg-slate-300 rounded-xl w-28"></div>
      </div>
    </div>
  );

  const renderVendor = () => (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card animate-pulse space-y-5 w-full">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="h-3 bg-slate-250 rounded w-20"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-12"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="h-2.5 bg-slate-200 rounded w-24"></div>
          <div className="h-3.5 bg-slate-250 rounded w-full"></div>
        </div>

        <div className="space-y-1.5">
          <div className="h-2.5 bg-slate-200 rounded w-16"></div>
          <div className="h-3.5 bg-slate-250 rounded w-1/2"></div>
        </div>

        <div className="space-y-1.5">
          <div className="h-2.5 bg-slate-200 rounded w-24"></div>
          <div className="h-3.5 bg-slate-250 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );

  const renderPartner = () => (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-card animate-pulse space-y-5 w-full">
      <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3.5 bg-slate-250 rounded w-1/4"></div>
        </div>
      </div>

      <div className="space-y-3.5 pt-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-20"></div>
            <div className="h-3.5 bg-slate-250 rounded w-32"></div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );

  switch (type) {
    case 'form':
      return renderForm();
    case 'vendor':
      return renderVendor();
    case 'partner':
      return renderPartner();
    case 'card':
    default:
      return renderCards();
  }
}
