import React from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerTableProps {
  customers: any[];
  onSelect: (c: any) => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<any>();

const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarColor = (id: number) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  ];
  return colors[id % colors.length];
};

const columns = [
  columnHelper.accessor('id', {
    header: '',
    cell: info => {
      const name = info.row.original.fullName;
      const id = info.getValue();
      return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(id)}`}>
          {getInitials(name)}
        </div>
      );
    },
  }),
  columnHelper.accessor('fullName', {
    header: 'Full Name',
    cell: info => <span className="font-semibold text-gray-900 dark:text-gray-100">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => <span className="text-gray-500 dark:text-gray-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: info => <span className="text-sm text-gray-600 dark:text-gray-300">{info.getValue() || '-'}</span>,
  }),
  columnHelper.accessor('licenseNumber', {
    header: 'License #',
    cell: info => <span className="font-mono text-sm text-gray-500">{info.getValue()}</span>,
  }),
  columnHelper.accessor('city', {
    header: 'City',
    cell: info => <span className="text-sm text-gray-600 dark:text-gray-300">{info.getValue() || '-'}</span>,
  }),
  columnHelper.accessor('_count.bookings', {
    id: 'bookings',
    header: 'Bookings',
    cell: info => {
      const count = info.getValue() ?? info.row.original.bookingCount ?? 0;
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          {count}
        </span>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Member Since',
    cell: info => <span className="text-sm text-gray-500">{format(new Date(info.getValue()), 'MMM d, yyyy')}</span>,
  }),
];

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onSelect, loading }) => {
  const table = useReactTable({
    data: customers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {Array(8).fill(0).map((_, i) => (
                <th key={i} className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(5).fill(0).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="p-4"><div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div></td>
                {Array(7).fill(0).map((_, j) => (
                  <td key={j} className="p-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4"></div></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No customers found</p>
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

export default CustomerTable;
export { getInitials, getAvatarColor };
