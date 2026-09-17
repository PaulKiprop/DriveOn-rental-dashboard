export interface User { id: number; username: string; email: string; fullName: string; role: string; createdAt: string; }
export interface VehicleCategory { id: number; name: string; description?: string; pricePerKm: number; }
export interface Vehicle { id: number; categoryId: number; category: VehicleCategory; make: string; model: string; year: number; plateNumber: string; imageUrl?: string; mileage: number; dailyRate: number; fuelType: string; transmission: string; seats: number; color: string; status: 'Available' | 'Rented' | 'Maintenance'; createdAt: string; updatedAt: string; }
export interface Customer { id: number; fullName: string; email: string; phone: string; licenseNumber: string; address?: string; city?: string; dateOfBirth?: string; createdAt: string; }
export interface Booking { id: number; vehicleId: number; vehicle: Vehicle; customerId: number; customer: Customer; startDate: string; endDate: string; kmDriven?: number; totalCost?: number; status: 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'; notes?: string; createdAt: string; updatedAt: string; }
export interface DashboardSummary { totalVehicles: number; available: number; rented: number; maintenance: number; totalBookings: number; pending: number; confirmed: number; active: number; completed: number; cancelled: number; totalCustomers: number; totalRevenue: number; }
export interface EarningsData { month: string; revenue: number; }
export interface CategoryRevenue { category: string; revenue: number; bookingCount: number; }
export interface UtilizationData { totalVehicles: number; currentlyRented: number; utilizationPercentage: number; breakdown: { category: string; total: number; rented: number; utilizationPercentage: number; }[]; }
export interface TimelineBooking { id: number; vehicleId: number; vehicleName: string; startDate: string; endDate: string; status: string; customerName: string; }
export interface AvailabilityResult { available: boolean; conflict?: { bookingId: number; customerName: string; startDate: string; endDate: string; status: string; }; }
