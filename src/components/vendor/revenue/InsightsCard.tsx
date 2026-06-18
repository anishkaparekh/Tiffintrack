import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { BusinessInsight } from '../../../types/revenue';

interface InsightsCardProps {
  insights: BusinessInsight[];
}

export default function InsightsCard({ insights }: InsightsCardProps) {
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />;
      case 'warning':
        return <TrendingUp size={16} className="text-[#F59E0B] shrink-0" />;
      case 'info':
      default:
        return <Info size={16} className="text-blue-500 shrink-0" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-50/50 border-emerald-100/50';
      case 'warning': return 'bg-amber-50/50 border-amber-100/50';
      case 'info':
      default:
        return 'bg-blue-50/30 border-blue-100/30';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 rounded-lg bg-[#C2410C]/10 text-amber-500">
          <Lightbulb size={18} />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Operational Insights</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Automated suggestions and spikes analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className={`p-3.5 border rounded-xl flex items-start space-x-3 text-xs font-semibold text-slate-600 ${getInsightBg(insight.type)}`}
          >
            {getInsightIcon(insight.type)}
            <span className="leading-relaxed">{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
