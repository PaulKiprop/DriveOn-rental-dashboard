import React from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from '@tanstack/react-table';
import { Car } from 'lucide-react';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  imageUrl?: string;
  category?: { name: string; pricePerKm: number; color?: string };
  plateNumber: string;
  dailyRate: number;
  mileage: number;
  fuelType: string;
  seats: number;
  status: string;
}

interface VehicleTableProps {
  vehicles: any[];
  onSelect: (v: any) => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<Vehicle>();

export const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'rented': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const columns = [
  columnHelper.accessor('imageUrl', {
    header: '',
    cell: info => (
      <div className="w-12 h-8 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {info.getValue() ? (
          <img src={info.getValue()} alt="Vehicle" className="w-full h-full object-cover" />
        ) : (
          <Car className="w-4 h-4 text-gray-400" />
        )}
      </div>
    ),
  }),
  columnHelper.accessor(row => `${row.make} ${row.model}`, {
    id: 'vehicle',
    header: 'Vehicle',
    cell: info => (
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100">{info.getValue()}</div>
        <div className="text-xs text-gray-500">{info.row.original.year}</div>
      </div>
    ),
  }),
  columnHelper.accessor('category.name', {
    header: 'Category',
    cell: info => (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span className={`w-2 h-2 rounded-full ${info.row.original.category?.color || 'bg-blue-500'}`}></span>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('plateNumber', {
    header: 'Plate',
    cell: info => <span className="font-mono text-sm text-gray-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('dailyRate', {
    header: 'Daily Rate',
    cell: info => <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor('category.pricePerKm', {
    header: 'Per-Km Rate',
    cell: info => <span className="text-sm text-gray-500">{formatCurrency(info.getValue())}/km</span>,
  }),
  columnHelper.accessor('mileage', {
    header: 'Mileage',
    cell: info => <span className="text-sm text-gray-500">{info.getValue().toLocaleString()} km</span>,
  }),
  columnHelper.accessor('fuelType', {
    header: 'Fuel',
    cell: info => <span className="text-sm text-gray-600 dark:text-gray-300">{info.getValue()}</span>,
  }),
  columnHelper.accessor('seats', {
    header: 'Seats',
    cell: info => <span className="text-sm text-gray-600 dark:text-gray-300">{info.getValue()} seats</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
];

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, onSelect, loading }) => {
  const table = useReactTable({
    data: vehicles || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {Array(10).fill(0).map((_, i) => (
                <th key={i} className="p-4 text-xs uppercase text-gray-500"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                {Array(10).fill(0).map((_, j) => (
                  <td key={j} className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-gray-900">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id}
              onClick={() => onSelect(row.original)}
              className="border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
