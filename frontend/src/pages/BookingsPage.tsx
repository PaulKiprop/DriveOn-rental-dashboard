import React, { useState, useEffect } from 'react';
import { List, GanttChartSquare, ArrowUpDown, Search } from 'lucide-react';
import BookingTable from '../components/bookings/BookingTable';
import BookingTimeline from '../components/bookings/BookingTimeline';
import BookingDetail from '../components/bookings/BookingDetail';
import { bookings as bookingsApi } from '../services/api';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await bookingsApi.getAll({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: debouncedSearch,
          sortBy,
          sortOrder
        });
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [statusFilter, debouncedSearch, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by customer or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-md border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="startDate">Start Date</option>
          <option value="endDate">End Date</option>
          <option value="totalCost">Total Cost</option>
          <option value="createdAt">Created Date</option>
        </select>

        <button 
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="h-9 flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>

        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => setViewMode('table')}
            className={`h-9 flex items-center justify-center rounded-md border px-3 text-sm ${viewMode === 'table' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'} dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800`}
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('timeline')}
            className={`h-9 flex items-center justify-center rounded-md border px-3 text-sm ${viewMode === 'timeline' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'} dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800`}
          >
            <GanttChartSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <BookingTable bookings={bookings} onSelect={setSelectedBooking} loading={loading} />
      ) : (
        <BookingTimeline bookings={bookings} loading={loading} />
      )}
      
      {selectedBooking && (
        <BookingDetail booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
};

export default BookingsPage;
