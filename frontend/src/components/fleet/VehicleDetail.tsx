import React, { useState, useEffect } from 'react';
import { Car, X, Euro, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { vehicles as vehiclesApi } from '../../services/api';
import { getStatusBadgeClass } from './VehicleTable';
import { format } from 'date-fns';

interface VehicleDetailProps {
  vehicle: any;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onClose }) => {
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await vehiclesApi.getById(vehicle.id);
        setDetailData(data);
      } catch (error) {
        console.error("Failed to fetch vehicle details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [vehicle.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-lg dark:text-white">Vehicle Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-1/3">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                {vehicle.imageUrl ? (
                  <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><Car className="w-16 h-16 text-gray-400" /></div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClass(vehicle.status)}`}>{vehicle.status}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {vehicle.make} {vehicle.model} <span className="text-gray-500 font-normal">· {vehicle.year}</span>
              </h1>
              <div className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-sm font-mono text-gray-700 dark:text-gray-300 mb-6">
                {vehicle.plateNumber}
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg h-24"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-500 mb-1"><Euro className="w-4 h-4 mr-1" /> Earnings</div>
                    <div className="text-xl font-bold dark:text-white">{formatCurrency(detailData?.totalEarnings || 0)}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-500 mb-1"><TrendingUp className="w-4 h-4 mr-1" /> Utilization</div>
                    <div className="text-xl font-bold dark:text-white">{detailData?.utilizationRate?.toFixed(1) || '0.0'}%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-500 mb-1"><Calendar className="w-4 h-4 mr-1" /> Bookings</div>
                    <div className="text-xl font-bold dark:text-white">{detailData?.totalBookings || 0}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-500 mb-1">Daily Rate</div>
                    <div className="text-xl font-bold dark:text-white">{formatCurrency(vehicle.dailyRate)}<span className="text-sm font-normal text-gray-500">/day</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Bookings</h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded"></div>)}
            </div>
          ) : detailData?.bookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500">
                  <tr>
                    <th className="p-3 font-medium">Customer</th>
                    <th className="p-3 font-medium">Period</th>
                    <th className="p-3 font-medium">Days</th>
                    <th className="p-3 font-medium">Km</th>
                    <th className="p-3 font-medium">Total Cost</th>
                    <th className="p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {detailData.bookings.slice(0, 5).map((b: any) => (
                    <tr key={b.id}>
                      <td className="p-3 font-medium dark:text-gray-200">{b.customer?.fullName || b.customerName || 'Unknown'}</td>
                      <td className="p-3 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          {format(new Date(b.startDate), 'MMM d')} <ArrowRight className="w-3 h-3" /> {format(new Date(b.endDate), 'MMM d')}
                        </div>
                      </td>
                      <td className="p-3 text-gray-500 dark:text-gray-400">{b.daysCount || '-'}</td>
                      <td className="p-3 text-gray-500 dark:text-gray-400">{b.kmDriven ? `${b.kmDriven} km` : '-'}</td>
                      <td className="p-3 font-medium dark:text-gray-200">{b.totalCost ? formatCurrency(b.totalCost) : '-'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No booking history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
