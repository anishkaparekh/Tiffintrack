import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { mockRevenue } from '../../data/vendorMockData';

interface RevenueCardProps {
  data?: {
    daily: { label: string; value: number }[];
    weekly: { label: string; value: number }[];
    monthly: { label: string; value: number }[];
  };
}

export default function RevenueCard({ data }: RevenueCardProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getData = () => {
    const source = data || mockRevenue;
    switch (timeframe) {
      case 'daily': return source.daily;
      case 'weekly': return source.weekly;
      case 'monthly': return source.monthly;
      default: return source.daily;
    }
  };

  const currentData = getData();

  const handleTimeframeChange = (frame: 'daily' | 'weekly' | 'monthly') => {
    setTimeframe(frame);
  };

  const getFormatValue = (val: number) => {
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-6">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base text-[#1F2937]">Revenue Performance</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Summary of incoming subscriber revenues</p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex bg-[#FFF8E7] border border-[#E5E7EB] p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => handleTimeframeChange('daily')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'daily' 
                ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                : 'text-[#1F2937]/60 hover:text-[#1F2937]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handleTimeframeChange('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'weekly' 
                ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                : 'text-[#1F2937]/60 hover:text-[#1F2937]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handleTimeframeChange('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'monthly' 
                ? 'bg-[#F59E0B] text-white shadow-sm shadow-[#F59E0B]/10' 
                : 'text-[#1F2937]/60 hover:text-[#1F2937]'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {timeframe === 'daily' ? (
            <LineChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="label" 
                stroke="#1F2937" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#1F2937" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
                tickFormatter={getFormatValue} 
              />
              <Tooltip 
                formatter={(value: any) => [`₹${value}`, 'Revenue']}
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)' 
                }}
                labelStyle={{ fontWeight: 800, fontSize: '11px', color: '#1F2937' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#F59E0B" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }} 
              />
            </LineChart>
          ) : (
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="label" 
                stroke="#1F2937" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#1F2937" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
                tickFormatter={getFormatValue} 
              />
              <Tooltip 
                formatter={(value: any) => [`₹${value}`, 'Revenue']}
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)' 
                }}
                labelStyle={{ fontWeight: 800, fontSize: '11px', color: '#1F2937' }}
              />
              <Bar 
                dataKey="value" 
                fill="#F59E0B" 
                radius={[8, 8, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
