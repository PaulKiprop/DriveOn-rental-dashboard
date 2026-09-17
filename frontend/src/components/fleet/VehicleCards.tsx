import React from 'react';
import { Car } from 'lucide-react';
import { getStatusBadgeClass } from './VehicleTable';

interface VehicleCardsProps {
  vehicles: any[];
  onSelect: (v: any) => void;
  loading?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const VehicleCards: React.FC<VehicleCardsProps> = ({ vehicles, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden animate-pulse">
            <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              <div className="pt-3 flex justify-between">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Car className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No vehicles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {vehicles.map(vehicle => (
        <div 
          key={vehicle.id}
          onClick={() => onSelect(vehicle)} 
          className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
        >
          <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
            {vehicle.imageUrl 
              ? <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
              : <div className="flex items-center justify-center h-full"><Car className="w-12 h-12 text-gray-400" /></div>
            }
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${getStatusBadgeClass(vehicle.status)}`}>{vehicle.status}</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{vehicle.make} {vehicle.model}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.year} · {vehicle.category?.name}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-1">{vehicle.plateNumber}</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(vehicle.dailyRate)}<span className="text-xs font-normal text-gray-500">/day</span></p>
                <p className="text-xs text-gray-500">{formatCurrency(vehicle.category?.pricePerKm)}/km</p>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                <p>{vehicle.fuelType}</p>
                <p>{vehicle.seats} seats</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleCards;
