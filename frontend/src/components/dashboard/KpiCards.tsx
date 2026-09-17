import { Card, CardContent } from '../ui/card';
import { formatCurrency } from '../../lib/utils';
import { DashboardSummary } from '../../types/index';
import { Car, CheckCircle, Navigation, Wrench, CalendarDays, Activity, CheckSquare, TrendingUp, Users } from 'lucide-react';

interface KpiCardsProps {
  summary: DashboardSummary | null;
}

export default function KpiCards({ summary }: KpiCardsProps) {
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.totalVehicles}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                <Car className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.available}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rented</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.rented}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Navigation className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Maintenance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.maintenance}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.totalBookings}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                <CalendarDays className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Now</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.active}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.completed}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{summary.totalCustomers}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
