import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Gauge } from 'lucide-react';
import { UtilizationData } from '../../types/index';

interface FleetUtilizationProps {
  data: UtilizationData | null;
  loading?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Economy: 'bg-green-500',
  Compact: 'bg-blue-500',
  SUV: 'bg-purple-500',
  Luxury: 'bg-amber-500',
  Van: 'bg-orange-500'
};

export default function FleetUtilization({ data, loading }: FleetUtilizationProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          Fleet Utilization
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-md mb-6 w-3/4 mx-auto"></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
          </div>
        ) : data ? (
          <>
            <div className="text-center mb-8">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">
                {data.utilizationPercentage.toFixed(1)}%
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                of fleet currently active
              </p>
            </div>

            <div className="space-y-4">
              {data.breakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {cat.category}
                      <span className="text-slate-400 dark:text-slate-500 ml-2 font-normal">
                        ({cat.rented}/{cat.total} vehicles)
                      </span>
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {cat.utilizationPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${CATEGORY_COLORS[cat.category] || 'bg-slate-500'}`}
                      style={{ width: `${cat.utilizationPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 h-full">
            No utilization data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
