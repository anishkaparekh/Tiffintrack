import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  mockCustomerGrowth, 
  mockSubscribersByPlan, 
  mockRetentionTrend 
} from '../../../data/customersMockData';

export default function CustomerAnalyticsCard() {
  
  const formatPercentage = (val: number) => `${val}%`;

  return (
    <div className="space-y-6">
      {/* 2-Column charts for Desktop, stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customer Growth Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Customer Acquisition</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Total customer accounts growth (Jan – Jun)</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCustomerGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
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
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} Accounts`, 'Customers']}
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
                  dataKey="customers" 
                  stroke="#00B074" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCustomers)" 
                  dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention Rate Trend Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Retention Performance</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Average customer retention rate trend</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRetentionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  tickFormatter={formatPercentage}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Retention Rate']}
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
                  dataKey="rate" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Plan Contribution Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] space-y-4 max-w-2xl mx-auto">
        <div>
          <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider text-center">Plan Subscribers Distribution</h3>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5 text-center">Number of active subscriptions categorized by plan</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockSubscribersByPlan} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              />
              <Tooltip 
                formatter={(value: any) => [`${value} Users`, 'Subscribers']}
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '12px' 
                }}
                labelStyle={{ fontWeight: 850, fontSize: '11px', color: '#1F2937' }}
              />
              <Bar 
                dataKey="subscribers" 
                fill="#00B074" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
