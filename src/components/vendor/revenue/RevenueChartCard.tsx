import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  mockDailyRevenue, 
  mockMonthlyRevenue, 
  mockPlanRevenue, 
  mockRevenueDistribution 
} from '../../../data/revenueMockData';

const COLORS = ['#00B074', '#FFD200', '#F59E0B', '#DC2626'];

export default function RevenueChartCard() {
  
  const formatYAxisValue = (val: number) => {
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="space-y-6">
      {/* Grid 1: Daily (Line) and Monthly (Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Daily Revenue Trend</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Earnings distribution over the past week</p>
          </div>

          <div className="h-60 w-full overflow-x-auto">
            <div className="min-w-[400px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockDailyRevenue} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="day" 
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
                    tickFormatter={formatYAxisValue}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Daily Income']}
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
                    dataKey="revenue" 
                    stroke="#00B074" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#00B074' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Monthly Revenue Trend</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Recurring revenue build-up (Jan – Jun)</p>
          </div>

          <div className="h-60 w-full overflow-x-auto">
            <div className="min-w-[400px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B074" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00B074" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
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
                    tickFormatter={formatYAxisValue}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Monthly Income']}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.03)' 
                    }}
                    labelStyle={{ fontWeight: 850, fontSize: '11px', color: '#1F2937' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#00B074" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Plan Revenue (Bar) and Share Distribution (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscription Plan revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Plan Performance Revenue</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Earnings across subscription types</p>
          </div>

          <div className="h-60 w-full overflow-x-auto">
            <div className="min-w-[400px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockPlanRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      borderRadius: '12px' 
                    }}
                    labelStyle={{ fontWeight: 850, fontSize: '11px', color: '#1F2937' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#00B074" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Share Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Revenue Stream Distribution</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Contribution percentage by channels</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-60 pt-2">
            <div className="h-40 w-40 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockRevenueDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockRevenueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Contribution']}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '12px' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-xl font-black text-[#1F2937]">₹2.38L</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-wider">MRR Earning</span>
              </div>
            </div>

            {/* Legend grid */}
            <div className="space-y-2 font-bold text-xs text-[#1F2937] shrink-0">
              {mockRevenueDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-500 font-semibold truncate max-w-[120px]">{entry.name}:</span>
                  <span>{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
