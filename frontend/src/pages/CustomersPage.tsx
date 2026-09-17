import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerProfile from '../components/customers/CustomerProfile';
import { customers as customersApi } from '../services/api';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const data = await customersApi.getAll({
          search: debouncedSearch,
          sortBy,
          order: sortOrder
        });
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [debouncedSearch, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by name, email, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-3 w-full rounded-md border border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select 
          className="h-10 ml-auto rounded-md border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSort, newOrder] = e.target.value.split('-');
            setSortBy(newSort);
            setSortOrder(newOrder as 'asc' | 'desc');
          }}
        >
          <option value="fullName-asc">Name (A-Z)</option>
          <option value="fullName-desc">Name (Z-A)</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
        </select>
      </div>
      
      <CustomerTable 
        customers={customers} 
        onSelect={setSelectedCustomer} 
        loading={loading} 
      />
      
      {selectedCustomer && (
        <CustomerProfile 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  );
};

export default CustomersPage;
