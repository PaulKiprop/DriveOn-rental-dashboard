import React, { useState, useEffect } from 'react';
import { List, Grid, ArrowUpDown } from 'lucide-react';
import VehicleTable from '../components/fleet/VehicleTable';
import VehicleCards from '../components/fleet/VehicleCards';
import VehicleDetail from '../components/fleet/VehicleDetail';
import { vehicles as vehiclesApi } from '../services/api';

const FleetPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fuelFilter, setFuelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dailyRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [search] = useState<string>('');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehiclesApi.getAll({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          fuelType: fuelFilter !== 'all' ? fuelFilter : undefined,
          sortBy,
          sortOrder,
          search
        });
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [statusFilter, categoryFilter, fuelFilter, sortBy, sortOrder, search]);

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Rented">Rented</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Compact">Compact</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Luxury">Luxury</option>
        </select>

        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)}
        >
          <option value="all">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select 
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="dailyRate">Daily Rate</option>
          <option value="mileage">Mileage</option>
          <option value="year">Year</option>
        </select>

        <button 
          onClick={toggleSortOrder}
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
            onClick={() => setViewMode('cards')}
            className={`h-9 flex items-center justify-center rounded-md border px-3 text-sm ${viewMode === 'cards' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'} dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <VehicleTable vehicles={vehicles} onSelect={setSelectedVehicle} loading={loading} />
      ) : (
        <VehicleCards vehicles={vehicles} onSelect={setSelectedVehicle} loading={loading} />
      )}
      
      {selectedVehicle && (
        <VehicleDetail vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      )}
    </div>
  );
};

export default FleetPage;
