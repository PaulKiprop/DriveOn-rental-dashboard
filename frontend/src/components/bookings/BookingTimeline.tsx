import React from 'react';
import { subMonths, addMonths, format, eachMonthOfInterval } from 'date-fns';

interface BookingTimelineProps {
  bookings: any[];
  loading?: boolean;
}

const getStatusBarColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-blue-500';
    case 'confirmed': return 'bg-indigo-500';
    case 'pending': return 'bg-yellow-500';
    case 'completed': return 'bg-green-600';
    case 'cancelled': return 'bg-red-400';
    default: return 'bg-gray-400';
  }
};

const BookingTimeline: React.FC<BookingTimelineProps> = ({ bookings, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full mb-4"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex h-12 mb-2">
            <div className="w-40 h-full bg-gray-100 dark:bg-gray-800 rounded-l mr-2"></div>
            <div className="flex-1 h-full bg-gray-50 dark:bg-gray-800/50 rounded-r relative">
              <div className="absolute top-2 bottom-2 rounded bg-gray-200 dark:bg-gray-700" style={{ left: `${10 * i}%`, width: '20%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const windowStart = subMonths(new Date(), 3);
  const windowEnd = addMonths(new Date(), 3);
  const months = eachMonthOfInterval({ start: windowStart, end: windowEnd });

  const vehicleMap = new Map<number, { name: string; bookings: any[] }>();

  // Group by vehicle
  bookings.forEach(b => {
    if (!b.vehicle) return;
    const vId = b.vehicle.id;
    if (!vehicleMap.has(vId)) {
      vehicleMap.set(vId, { 
        name: `${b.vehicle.make} ${b.vehicle.model} (${b.vehicle.plateNumber})`, 
        bookings: [] 
      });
    }
    vehicleMap.get(vId)!.bookings.push(b);
  });

  const todayTime = new Date().getTime();
  const todayPercent = Math.max(0, Math.min(100, (todayTime - windowStart.getTime()) / (windowEnd.getTime() - windowStart.getTime()) * 100));

  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
      <div className="min-w-[800px]">
        {/* Month header */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-800"></div>
          <div className="flex-1 flex relative h-10">
            {months.map((m, i) => (
              <div 
                key={i} 
                className="flex-1 text-xs font-semibold text-gray-500 uppercase flex items-center justify-center border-r border-gray-100 dark:border-gray-800 last:border-r-0"
              >
                {format(m, 'MMM yyyy')}
              </div>
            ))}
          </div>
        </div>
        
        {/* Vehicle rows */}
        {Array.from(vehicleMap.entries()).map(([vehicleId, { name, bookings: vBookings }]) => (
          <div className="flex border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20" key={vehicleId}>
            {/* Vehicle label */}
            <div className="w-48 flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 truncate border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20">
              {name}
            </div>
            {/* Timeline area */}
            <div className="flex-1 relative h-12 bg-white dark:bg-gray-900">
              {/* Today line */}
              <div 
                className="absolute top-0 bottom-0 border-l-2 border-red-400 border-dashed z-10" 
                style={{ left: `${todayPercent}%` }}
                title="Today"
              />
              
              {/* Grid lines for months */}
              <div className="absolute inset-0 flex pointer-events-none">
                 {months.map((_, i) => (
                    <div key={i} className="flex-1 border-r border-gray-50 dark:border-gray-800/30 last:border-r-0"></div>
                 ))}
              </div>

              {vBookings.map(b => {
                const bStart = new Date(b.startDate).getTime();
                const bEnd = new Date(b.endDate).getTime();
                
                // Skip if entirely outside window
                if (bEnd < windowStart.getTime() || bStart > windowEnd.getTime()) return null;

                const left = Math.max(0, (bStart - windowStart.getTime()) / (windowEnd.getTime() - windowStart.getTime()) * 100);
                const right = Math.min(100, (bEnd - windowStart.getTime()) / (windowEnd.getTime() - windowStart.getTime()) * 100);
                const width = right - left;

                return (
                  <div
                    key={b.id}
                    title={`${b.customer?.fullName || b.customerName}: ${format(new Date(b.startDate), 'MMM d')} → ${format(new Date(b.endDate), 'MMM d')}`}
                    className={`absolute top-2 bottom-2 rounded shadow-sm flex items-center px-2 text-xs font-medium text-white overflow-hidden cursor-help hover:opacity-90 transition-opacity ${getStatusBarColor(b.status)} z-20`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    <span className="truncate">{b.customer?.fullName || b.customerName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {vehicleMap.size === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">
            No vehicle bookings found in this time range.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTimeline;
