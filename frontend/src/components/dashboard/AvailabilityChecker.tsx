import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { availability, vehicles as vehiclesApi } from '../../services/api';
import { formatDate, daysBetween } from '../../lib/utils';
import { CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { AvailabilityResult, Vehicle } from '../../types/index';

export default function AvailabilityChecker() {
  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehiclesApi.getAll();
        setVehicles(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to load vehicles', err);
      }
    };
    fetchVehicles();
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !startDate || !endDate) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await availability.check(Number(vehicleId), startDate, endDate);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-600 dark:border-l-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          Availability Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4 mb-4">
          <select
            className="flex h-10 w-full md:w-1/3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="" disabled>Select Vehicle...</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} · {v.plateNumber} ({v.status})
              </option>
            ))}
          </select>
          
          <Input
            type="date"
            className="md:w-1/4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          
          <Input
            type="date"
            className="md:w-1/4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading} className="md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Check
          </Button>
        </form>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            result.available 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            {result.available ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-500 shrink-0" />
            )}
            <div>
              {result.available ? (
                <p className="font-medium">
                  ✅ Available! This vehicle is free from {formatDate(startDate)} to {formatDate(endDate)}. ({daysBetween(startDate, endDate)} nights)
                </p>
              ) : (
                <p className="font-medium">
                  ❌ Not Available — Conflicting booking by {result.conflict?.customerName} from {formatDate(result.conflict?.startDate || '')} to {formatDate(result.conflict?.endDate || '')} · Status: {result.conflict?.status}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
