import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { EarningsData } from '../../types/index';

interface EarningsChartProps {
  data: EarningsData[];
  loading?: boolean;
}

export default function EarningsChart({ data, loading }: EarningsChartProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          Monthly Revenue
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          From completed bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md"></div>
        ) : data && data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tickFormatter={(value) => `€${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', borderColor: 'var(--tooltip-border, #e2e8f0)', color: 'var(--tooltip-text, #0f172a)' }}
                  formatter={(value: number) => [`€${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#64748b' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  fill="url(#earningsGradient)" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            No revenue data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
