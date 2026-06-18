import React from 'react';
import { Award, ShoppingBag, TrendingUp } from 'lucide-react';
import { BestPerformingMeal } from '../../../types/meals';

interface TopMealsCardProps {
  bestPerformingMeals: BestPerformingMeal[];
}

export default function TopMealsCard({ bestPerformingMeals }: TopMealsCardProps) {
  
  const getRankIndicator = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl select-none" title="1st Place">🥇</span>;
      case 2:
        return <span className="text-2xl select-none" title="2nd Place">🥈</span>;
      case 3:
        return <span className="text-2xl select-none" title="3rd Place">🥉</span>;
      default:
        return <span className="text-sm font-bold text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div>
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Top Performing Meals</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Ranked by weekly order revenues</p>
      </div>

      <div className="space-y-3">
        {bestPerformingMeals.map((meal) => (
          <div 
            key={meal.rank}
            className="flex items-center justify-between p-3 bg-[#FFF8E7]/50 border border-[#E5E7EB]/50 rounded-xl hover:bg-[#FFF8E7] transition-all"
          >
            <div className="flex items-center space-x-3.5 overflow-hidden">
              {/* Rank Badge */}
              <div className="shrink-0 flex items-center justify-center">
                {getRankIndicator(meal.rank)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-[#1F2937] truncate">{meal.name}</h4>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                  <ShoppingBag size={10} className="text-[#F59E0B]" />
                  <span>{meal.weeklyOrders} orders</span>
                </div>
              </div>
            </div>

            {/* Revenue value */}
            <div className="text-right shrink-0">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Weekly Revenue</span>
              <span className="text-xs font-black text-[#F59E0B] flex items-center justify-end">
                <TrendingUp size={12} className="text-[#16A34A] mr-0.5" />
                ₹{meal.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
