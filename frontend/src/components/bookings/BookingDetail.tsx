import React, { useState, useEffect } from 'react';
import { X, User, Car, FileText } from 'lucide-react';
import { bookings as bookingsApi } from '../../services/api';
import { format, differenceInDays } from 'date-fns';
import { getBookingStatusClass } from './BookingTable';

interface BookingDetailProps {
  booking: any;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const BookingDetail: React.FC<BookingDetailProps> = ({ booking, onClose }) => {
  const [fullBooking, setFullBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await bookingsApi.getById(booking.id);
        setFullBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking", error);
        setFullBooking(booking); // Fallback to list data
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [booking.id]);

  const b = fullBooking || booking;
  const start = new Date(b.startDate);
  const end = new Date(b.endDate);
  const nights = differenceInDays(end, start);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg dark:text-white">Booking #{String(b.id).padStart(3, '0')}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBookingStatusClass(b.status)}`}>
              {b.status}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          ) : (
            <>
              {/* Dates */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-5 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Pick-up</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{format(start, 'EEE, MMM d, yyyy')}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <div className="text-sm font-semibold text-gray-500 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                    {nights} nights
                  </div>
                  <div className="h-px w-24 bg-gray-300 dark:bg-gray-700 mt-2"></div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Drop-off</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{format(end, 'EEE, MMM d, yyyy')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Info */}
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-100 dark:border-gray-800 pb-2">
                    <Car className="w-5 h-5 text-gray-400" /> Vehicle
                  </div>
                  {b.vehicle ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Model</span> <span className="font-medium dark:text-gray-200">{b.vehicle.make} {b.vehicle.model}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Plate</span> <span className="font-mono text-gray-700 dark:text-gray-300">{b.vehicle.plateNumber}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Category</span> <span>{b.vehicle.category?.name || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Daily Rate</span> <span>{formatCurrency(b.vehicle.dailyRate)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Per-km Rate</span> <span>{formatCurrency(b.vehicle.category?.pricePerKm)}</span></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Vehicle data missing</p>
                  )}
                </div>

                {/* Customer Info */}
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-100 dark:border-gray-800 pb-2">
                    <User className="w-5 h-5 text-gray-400" /> Customer
                  </div>
                  {b.customer ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Name</span> <span className="font-medium dark:text-gray-200">{b.customer.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="text-gray-700 dark:text-gray-300">{b.customer.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Phone</span> <span>{b.customer.phone || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">License</span> <span className="font-mono">{b.customer.licenseNumber || '-'}</span></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Customer {b.customerName}</p>
                  )}
                </div>
              </div>

              {/* Cost Breakdown */}
              {b.status === 'Completed' && b.totalCost && (
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100 font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">
                    <FileText className="w-5 h-5 text-gray-400" /> Cost Breakdown
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Daily charge ({formatCurrency(b.vehicle?.dailyRate)} × {nights} days)</span>
                      <span className="font-medium dark:text-gray-200">{formatCurrency((b.vehicle?.dailyRate || 0) * nights)}</span>
                    </div>
                    {b.kmDriven > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mileage charge ({formatCurrency(b.vehicle?.category?.pricePerKm)} × {b.kmDriven} km)</span>
                        <span className="font-medium dark:text-gray-200">{formatCurrency((b.vehicle?.category?.pricePerKm || 0) * b.kmDriven)}</span>
                      </div>
                    )}
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-lg">
                      <span className="font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(b.totalCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {b.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded p-3 text-sm text-yellow-800 dark:text-yellow-200">
                    {b.notes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
