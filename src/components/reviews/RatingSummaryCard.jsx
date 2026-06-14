import React from 'react';
import StarRating from './StarRating';
import { Star } from 'lucide-react';

export default function RatingSummaryCard({ stats }) {
  const { averageRating = 0, totalReviews = 0, ratingBreakdown = {} } = stats || {};

  // Calculate percentages
  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const starKeys = ['5', '4', '3', '2', '1'];

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left side: Big Average Score */}
      <div className="text-center space-y-2 shrink-0 md:border-r border-slate-100 md:pr-8 md:min-w-[180px] w-full md:w-auto">
        <h2 className="text-5xl font-black text-primary-text tracking-tight">
          {averageRating.toFixed(1)}
        </h2>
        <div className="flex justify-center">
          <StarRating rating={averageRating} size={16} />
        </div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
        </p>
      </div>

      {/* Right side: Breakdown Bars */}
      <div className="flex-1 w-full space-y-2.5">
        {starKeys.map((stars) => {
          const count = ratingBreakdown[stars] || 0;
          const percentage = getPercentage(count);

          return (
            <div key={stars} className="flex items-center space-x-3 text-xs text-secondary-text font-medium">
              <span className="w-12 text-slate-400 text-right font-bold shrink-0">{stars} Stars</span>
              
              {/* Progress Bar Container */}
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-mint transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-16 text-slate-400 text-left shrink-0 font-bold">
                {count} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
