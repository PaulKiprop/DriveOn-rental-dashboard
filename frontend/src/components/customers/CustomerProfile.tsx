import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, CalendarDays, Award, CreditCard, Car } from 'lucide-react';
import { customers as customersApi } from '../../services/api';
import { format } from 'date-fns';
import { getInitials, getAvatarColor } from './CustomerTable';
import { getBookingStatusClass } from '../bookings/BookingTable';

interface CustomerProfileProps {
  customer: any;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onClose }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await customersApi.getById(customer.id);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch customer profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [customer.id]);

  const c = profileData || customer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-800 relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
          <div className="flex gap-6 items-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-sm border-4 border-white dark:border-gray-800 ${getAvatarColor(c.id)}`}>
              {getInitials(c.fullName)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{c.fullName}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {c.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {c.phone || 'No phone'}</span>
                <span className="flex items-center gap-1.5 font-mono"><Award className="w-4 h-4 text-gray-400" /> {c.licenseNumber}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {c.city || 'No city'}</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-gray-400" /> Since {format(new Date(c.createdAt), 'MMM yyyy')}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-xl"></div>)}
              </div>
              <div className="h-64 bg-white dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold dark:text-white">{c.stats?.totalBookings || c._count?.bookings || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</p>
                  <p className="text-2xl font-bold dark:text-white text-green-600 dark:text-green-400">{c.stats?.completedBookings || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><CreditCard className="w-4 h-4" /> Total Spent</p>
                  <p className="text-2xl font-bold dark:text-white">{formatCurrency(c.stats?.totalSpent || 0)}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1"><Car className="w-4 h-4" /> Favourite</p>
                  <p className="text-lg font-bold dark:text-white truncate">{c.stats?.favouriteCategory || '-'}</p>
                </div>
              </div>

              {/* History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Booking History</h3>
                </div>
                {c.bookings?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500">
                        <tr>
                          <th className="p-4 font-medium">ID</th>
                          <th className="p-4 font-medium">Vehicle</th>
                          <th className="p-4 font-medium">Period</th>
                          <th className="p-4 font-medium">Status</th>
                          <th className="p-4 font-medium text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {c.bookings.map((b: any) => (
                          <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="p-4 font-mono text-gray-500 text-xs">#{String(b.id).padStart(3, '0')}</td>
                            <td className="p-4">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{b.vehicle?.make} {b.vehicle?.model}</p>
                              <p className="text-xs text-gray-500">{b.vehicle?.plateNumber}</p>
                            </td>
                            <td className="p-4 text-gray-500 dark:text-gray-400">
                              {format(new Date(b.startDate), 'MMM d, yyyy')} → {format(new Date(b.endDate), 'MMM d, yyyy')}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusClass(b.status)}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-gray-900 dark:text-gray-100 text-right">
                              {b.totalCost ? formatCurrency(b.totalCost) : <span className="text-gray-400 font-normal">Pending</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No bookings found for this customer.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
