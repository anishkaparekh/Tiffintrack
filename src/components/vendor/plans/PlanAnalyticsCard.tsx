import React from 'react';
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
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  mockSubscriberGrowth, 
  mockRevenueByPlan, 
  mockPlanDistribution 
} from '../../../data/plansMockData';

const COLORS = ['#F59E0B', '#C2410C', '#F59E0B', '#DC2626'];

export default function PlanAnalyticsCard() {
  
  const formatYAxisValue = (val: number) => {
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="space-y-6">
      {/* 2-Column charts for Desktop, stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriber Growth Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Subscriber Growth</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Active users count over the last 6 months</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSubscriberGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
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
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} Users`, 'Subscribers']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)' 
                  }}
                  labelStyle={{ fontWeight: 850, fontSize: '11px', color: '#1F2937' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#F59E0B" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Revenue by Plan</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Income generated across subscription categories</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueByPlan} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  stroke="#1F2937" 
                  fontSize={9} 
                  fontWeight={750}
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#1F2937" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={formatYAxisValue}
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)' 
                  }}
                  labelStyle={{ fontWeight: 850, fontSize: '11px', color: '#1F2937' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#F59E0B" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Distribution Donut Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 max-w-xl mx-auto">
        <div className="text-center">
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Subscribers Distribution</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Percentage share of each subscription plan</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-2">
          {/* Donut chart canvas */}
          <div className="h-44 w-44 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPlanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockPlanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} Users`, 'Subscribers']}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '12px' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total count center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-2xl font-black text-[#1F2937]">98</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Total Users</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="space-y-2.5 font-bold text-xs text-[#1F2937]">
            {mockPlanDistribution.map((entry, index) => {
              const total = mockPlanDistribution.reduce((acc, curr) => acc + curr.value, 0);
              const percent = Math.round((entry.value / total) * 100);
              
              return (
                <div key={entry.name} className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-md shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 font-semibold truncate max-w-[130px]">{entry.name}:</span>
                    <span>{entry.value} ({percent}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
