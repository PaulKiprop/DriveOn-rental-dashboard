import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { CalendarDays, Car } from 'lucide-react';
import { getStatusBadgeClass, formatDate } from '../../lib/utils';
import { Booking, Vehicle } from '../../types/index';

interface RecentActivityProps {
  data: { recentBookings: Booking[], recentVehicles: Vehicle[] } | null;
  loading?: boolean;
}

export default function RecentActivity({ data, loading }: RecentActivityProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-md"></div>)}
            </div>
          ) : data && data.recentBookings.length > 0 ? (
            <div className="space-y-4">
              {data.recentBookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {booking.vehicle?.make} {booking.vehicle?.model}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {booking.customer?.fullName}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No recent bookings found.
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <Link to="/bookings" className="text-sm text-blue-600 dark:text-blue-500 hover:underline font-medium w-full text-center">
            View all bookings →
          </Link>
        </CardFooter>
      </Card>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Car className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            Fleet Additions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-md"></div>)}
            </div>
          ) : data && data.recentVehicles.length > 0 ? (
            <div className="space-y-4">
              {data.recentVehicles.slice(0, 5).map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {vehicle.make} {vehicle.model} {vehicle.year}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {vehicle.category?.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        {vehicle.plateNumber}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No recent vehicles found.
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <Link to="/fleet" className="text-sm text-blue-600 dark:text-blue-500 hover:underline font-medium w-full text-center">
            View all vehicles →
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
