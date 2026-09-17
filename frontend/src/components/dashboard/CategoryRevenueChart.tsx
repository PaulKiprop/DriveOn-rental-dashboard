import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryRevenue } from '../../types/index';

interface CategoryRevenueChartProps {
  data: CategoryRevenue[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Economy: '#22C55E',
  Compact: '#3B82F6',
  SUV: '#8B5CF6',
  Luxury: '#F59E0B',
  Van: '#F97316'
};

export default function CategoryRevenueChart({ data, loading }: CategoryRevenueChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-white">{data.category}</p>
          <p className="text-slate-600 dark:text-slate-300">Revenue: €{data.revenue.toLocaleString()}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{data.bookingCount} bookings</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium mr-1">{entry.payload.category}</span>
            <span className="text-slate-500 dark:text-slate-400">€{entry.payload.revenue.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 w-full h-full">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Revenue by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="revenue"
                  nameKey="category"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.category] || '#94A3B8'} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
