import { useEffect, useState } from 'react';
import { dashboard } from '../services/api';
import KpiCards from '../components/dashboard/KpiCards';
import AvailabilityChecker from '../components/dashboard/AvailabilityChecker';
import EarningsChart from '../components/dashboard/EarningsChart';
import CategoryRevenueChart from '../components/dashboard/CategoryRevenueChart';
import FleetUtilization from '../components/dashboard/FleetUtilization';
import RecentActivity from '../components/dashboard/RecentActivity';
import { Skeleton } from '../components/ui/skeleton';
import type { DashboardSummary, EarningsData, CategoryRevenue, UtilizationData } from '../types/index';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [earnings, setEarnings] = useState<EarningsData[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [utilization, setUtilization] = useState<UtilizationData | null>(null);
  const [recent, setRecent] = useState<{ recentBookings: any[]; recentVehicles: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboard.getSummary(),
      dashboard.getEarnings(),
      dashboard.getEarningsByCategory(),
      dashboard.getUtilization(),
      dashboard.getRecent(),
    ]).then(([s, e, c, u, r]) => {
      setSummary(s);
      setEarnings(e);
      setCategoryRevenue(c);
      setUtilization(u);
      setRecent(r);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : summary ? (
        <KpiCards summary={summary} />
      ) : null}

      {/* Availability Checker */}
      <AvailabilityChecker />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EarningsChart data={earnings} loading={loading} />
        </div>
        <div>
          <CategoryRevenueChart data={categoryRevenue} loading={loading} />
        </div>
      </div>

      {/* Fleet utilization + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <FleetUtilization data={utilization} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity data={recent} loading={loading} />
        </div>
      </div>
    </div>
  );
}
