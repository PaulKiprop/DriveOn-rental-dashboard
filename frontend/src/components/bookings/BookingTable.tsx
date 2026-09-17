import React from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from '@tanstack/react-table';
import { format, differenceInDays } from 'date-fns';
import { CalendarX2 } from 'lucide-react';

interface BookingTableProps {
  bookings: any[];
  onSelect: (b: any) => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<any>();

export const getBookingStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
    case 'confirmed': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount || 0);
};

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => <span className="text-gray-500 font-mono text-xs">#{String(info.getValue()).padStart(3, '0')}</span>,
  }),
  columnHelper.accessor(row => row.vehicle, {
    id: 'vehicle',
    header: 'Vehicle',
    cell: info => {
      const v = info.getValue();
      if (!v) return '-';
      return (
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100">{v.make} {v.model}</div>
          <div className="text-xs text-gray-500 font-mono">{v.plateNumber}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor(row => row.customer, {
    id: 'customer',
    header: 'Customer',
    cell: info => <span className="text-gray-900 dark:text-gray-200">{info.getValue()?.fullName || info.row.original.customerName}</span>,
  }),
  columnHelper.accessor('startDate', {
    id: 'period',
    header: 'Period',
    cell: info => {
      const start = new Date(info.getValue());
      const end = new Date(info.row.original.endDate);
      return <span className="text-sm text-gray-600 dark:text-gray-300">{format(start, 'MMM d')} → {format(end, 'MMM d')}</span>;
    },
  }),
  columnHelper.accessor('endDate', {
    id: 'nights',
    header: 'Nights',
    cell: info => {
      const start = new Date(info.row.original.startDate);
      const end = new Date(info.getValue());
      const days = differenceInDays(end, start);
      return <span className="text-sm text-gray-500">{days} nights</span>;
    },
  }),
  columnHelper.accessor('kmDriven', {
    header: 'Km Driven',
    cell: info => <span className="text-sm text-gray-500">{info.getValue() ? `${info.getValue()} km` : '—'}</span>,
  }),
  columnHelper.accessor('totalCost', {
    header: 'Total Cost',
    cell: info => (
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {info.getValue() ? formatCurrency(info.getValue()) : <span className="text-gray-400 font-normal italic">Pending</span>}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBookingStatusClass(info.getValue())}`}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created',
    cell: info => <span className="text-sm text-gray-500">{format(new Date(info.getValue()), 'MMM d, yyyy')}</span>,
  }),
];

const BookingTable: React.FC<BookingTableProps> = ({ bookings, onSelect, loading }) => {
  const table = useReactTable({
    data: bookings || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {Array(9).fill(0).map((_, i) => (
                <th key={i} className="p-4 text-xs uppercase text-gray-500"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                {Array(9).fill(0).map((_, j) => (
                  <td key={j} className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CalendarX2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
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

export default BookingTable;
