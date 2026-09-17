import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { bookings, customers, availability, vehicles } from '../../services/api';
import { AvailabilityResult, Customer, Vehicle } from '../../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  initialValues?: {
    vehicleId?: number;
    startDate?: string;
    endDate?: string;
  };
}

export default function NewBookingDialog({ open, onOpenChange, onCreated, initialValues }: NewBookingDialogProps) {
  const [vehicleId, setVehicleId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);
  const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !initialValues) return;
    setVehicleId(initialValues.vehicleId ? String(initialValues.vehicleId) : '');
    setStartDate(initialValues.startDate || '');
    setEndDate(initialValues.endDate || '');
    setAvailabilityResult(null);
    setError(null);
  }, [open, initialValues]);

  useEffect(() => {
    if (!open || vehicleOptions.length) return;
    setLoadingOptions(true);
    Promise.all([vehicles.getAll(), customers.getAll()])
      .then(([loadedVehicles, loadedCustomers]) => {
        setVehicleOptions(loadedVehicles);
        setCustomerOptions(loadedCustomers);
      })
      .catch((err: Error) => setError(err.message || 'Could not load booking options'))
      .finally(() => setLoadingOptions(false));
  }, [open, vehicleOptions.length]);

  useEffect(() => {
    setAvailabilityResult(null);
    if (!vehicleId || !startDate || !endDate || startDate >= endDate) return;

    const timer = window.setTimeout(async () => {
      setCheckingAvailability(true);
      try {
        setAvailabilityResult(await availability.check(Number(vehicleId), startDate, endDate));
      } catch (err: any) {
        setError(err.message || 'Could not check availability');
      } finally {
        setCheckingAvailability(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [vehicleId, startDate, endDate]);

  const close = () => {
    if (submitting) return;
    setError(null);
    onOpenChange(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (startDate >= endDate) {
      setError('Return date must be after the pickup date');
      return;
    }
    if (!availabilityResult?.available) {
      setError('Choose dates when this vehicle is available before creating the booking');
      return;
    }

    setSubmitting(true);
    try {
      await bookings.create({ vehicleId: Number(vehicleId), customerId: Number(customerId), startDate, endDate, notes });
      setVehicleId('');
      setCustomerId('');
      setStartDate('');
      setEndDate('');
      setNotes('');
      setAvailabilityResult(null);
      onOpenChange(false);
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Could not create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New booking</DialogTitle>
          <DialogDescription>New bookings are created as Pending. A vehicle cannot be booked over an existing non-cancelled rental.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              Customer
              <select required value={customerId} onChange={(e) => setCustomerId(e.target.value)} disabled={loadingOptions || submitting} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 font-normal dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
                <option value="">Select customer…</option>
                {customerOptions.map((customer) => <option key={customer.id} value={customer.id}>{customer.fullName} · {customer.email}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              Vehicle
              <select required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} disabled={loadingOptions || submitting} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 font-normal dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
                <option value="">Select vehicle…</option>
                {vehicleOptions.filter((vehicle) => vehicle.status !== 'Maintenance').map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} · {vehicle.plateNumber}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              Pickup date
              <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={submitting} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 font-normal dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
              Return date
              <input required type="date" min={startDate || undefined} value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={submitting} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 font-normal dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
            Notes <span className="font-normal text-gray-400">(optional)</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={submitting} rows={3} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
          </label>
          {checkingAvailability && <p className="text-sm text-gray-500">Checking availability…</p>}
          {availabilityResult && <p className={`rounded-md p-3 text-sm ${availabilityResult.available ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'}`}>
            {availabilityResult.available ? 'This vehicle is available for these dates.' : `Not available: booked by ${availabilityResult.conflict?.customerName} from ${String(availabilityResult.conflict?.startDate).slice(0, 10)} to ${String(availabilityResult.conflict?.endDate).slice(0, 10)}.`}
          </p>}
          {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={close} disabled={submitting} className="h-10 rounded-md border border-gray-200 px-4 text-sm dark:border-gray-700 dark:text-gray-100">Cancel</button>
            <button type="submit" disabled={loadingOptions || checkingAvailability || submitting || !availabilityResult?.available} className="flex h-10 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create booking
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
