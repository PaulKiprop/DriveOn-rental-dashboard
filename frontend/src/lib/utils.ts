import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(amount));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function daysBetween(start: string | Date, end: string | Date): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Available':    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Rented':       return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Maintenance':  return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Pending':      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Confirmed':    return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
    case 'Active':       return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Completed':    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Cancelled':    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default:             return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
}

export function getStatusDotColor(status: string): string {
  switch (status) {
    case 'Available':   return 'bg-green-500';
    case 'Rented':      return 'bg-blue-500';
    case 'Maintenance': return 'bg-amber-500';
    case 'Pending':     return 'bg-yellow-500';
    case 'Confirmed':   return 'bg-indigo-500';
    case 'Active':      return 'bg-blue-500';
    case 'Completed':   return 'bg-green-500';
    case 'Cancelled':   return 'bg-red-500';
    default:            return 'bg-gray-400';
  }
}
