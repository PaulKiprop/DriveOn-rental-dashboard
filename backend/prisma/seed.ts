import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.booking.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.vehicleCategory.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@driveon.com',
      passwordHash,
      fullName: 'Admin User',
      role: 'admin',
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: 'Economy', pricePerKm: 0.20 },
    { name: 'Compact', pricePerKm: 0.30 },
    { name: 'SUV', pricePerKm: 0.45 },
    { name: 'Luxury', pricePerKm: 0.65 },
    { name: 'Van', pricePerKm: 0.35 },
  ];

  const categories = await Promise.all(
    categoriesData.map(c => prisma.vehicleCategory.create({ data: c }))
  );

  const getCatId = (name: string) => categories.find(c => c.name === name)!.id;

  // 3. Vehicles
  const vehiclesData = [
    // Economy
    { categoryId: getCatId('Economy'), make: 'Fiat', model: '500', year: 2022, plateNumber: 'B-F500', imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=500&q=60', mileage: 25000, dailyRate: 28, fuelType: 'Petrol', transmission: 'Manual', seats: 5, color: 'Red', status: 'Available' },
    { categoryId: getCatId('Economy'), make: 'Toyota', model: 'Yaris', year: 2023, plateNumber: 'M-Y2023', imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd74143275f?auto=format&fit=crop&w=500&q=60', mileage: 18000, dailyRate: 30, fuelType: 'Hybrid', transmission: 'Automatic', seats: 5, color: 'White', status: 'Rented' },
    { categoryId: getCatId('Economy'), make: 'VW', model: 'Polo', year: 2021, plateNumber: 'H-P21', imageUrl: 'https://images.unsplash.com/photo-1616422285623-14ff0163351e?auto=format&fit=crop&w=500&q=60', mileage: 42000, dailyRate: 27, fuelType: 'Petrol', transmission: 'Manual', seats: 5, color: 'Blue', status: 'Available' },
    // Compact
    { categoryId: getCatId('Compact'), make: 'VW', model: 'Golf', year: 2022, plateNumber: 'F-G22', imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=60', mileage: 30000, dailyRate: 42, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, color: 'Black', status: 'Available' },
    { categoryId: getCatId('Compact'), make: 'Ford', model: 'Focus', year: 2023, plateNumber: 'B-F23', imageUrl: 'https://images.unsplash.com/photo-1612056910609-8d76db841fbc?auto=format&fit=crop&w=500&q=60', mileage: 22000, dailyRate: 40, fuelType: 'Petrol', transmission: 'Manual', seats: 5, color: 'Silver', status: 'Available' },
    { categoryId: getCatId('Compact'), make: 'Mazda', model: '3', year: 2022, plateNumber: 'M-M322', imageUrl: 'https://images.unsplash.com/photo-1623514210404-58a4362b53f6?auto=format&fit=crop&w=500&q=60', mileage: 35000, dailyRate: 44, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Red', status: 'Maintenance' },
    // SUV
    { categoryId: getCatId('SUV'), make: 'BMW', model: 'X3', year: 2023, plateNumber: 'B-X323', imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=500&q=60', mileage: 12000, dailyRate: 72, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, color: 'Black', status: 'Available' },
    { categoryId: getCatId('SUV'), make: 'Audi', model: 'Q5', year: 2022, plateNumber: 'M-Q522', imageUrl: 'https://images.unsplash.com/photo-1618693721385-f5cd2d44fc3f?auto=format&fit=crop&w=500&q=60', mileage: 28000, dailyRate: 70, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, color: 'White', status: 'Available' },
    { categoryId: getCatId('SUV'), make: 'Toyota', model: 'RAV4', year: 2023, plateNumber: 'H-R23', imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=500&q=60', mileage: 15000, dailyRate: 65, fuelType: 'Hybrid', transmission: 'Automatic', seats: 5, color: 'Silver', status: 'Available' },
    // Luxury
    { categoryId: getCatId('Luxury'), make: 'Mercedes', model: 'E-Class', year: 2023, plateNumber: 'B-ME23', imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=500&q=60', mileage: 8000, dailyRate: 110, fuelType: 'Petrol', transmission: 'Automatic', seats: 5, color: 'Black', status: 'Available' },
    { categoryId: getCatId('Luxury'), make: 'BMW', model: '5 Series', year: 2022, plateNumber: 'M-B522', imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=500&q=60', mileage: 18000, dailyRate: 105, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, color: 'White', status: 'Rented' },
    { categoryId: getCatId('Luxury'), make: 'Audi', model: 'A6', year: 2023, plateNumber: 'F-A623', imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=500&q=60', mileage: 11000, dailyRate: 100, fuelType: 'Diesel', transmission: 'Automatic', seats: 5, color: 'Grey', status: 'Available' },
    // Van
    { categoryId: getCatId('Van'), make: 'VW', model: 'Transporter', year: 2022, plateNumber: 'B-VT22', imageUrl: 'https://images.unsplash.com/photo-1563243229-3b9835824c08?auto=format&fit=crop&w=500&q=60', mileage: 50000, dailyRate: 58, fuelType: 'Diesel', transmission: 'Manual', seats: 9, color: 'White', status: 'Available' },
    { categoryId: getCatId('Van'), make: 'Mercedes', model: 'Vito', year: 2021, plateNumber: 'M-MV21', imageUrl: 'https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?auto=format&fit=crop&w=500&q=60', mileage: 65000, dailyRate: 55, fuelType: 'Diesel', transmission: 'Automatic', seats: 8, color: 'Silver', status: 'Available' },
    { categoryId: getCatId('Van'), make: 'Ford', model: 'Transit', year: 2023, plateNumber: 'H-FT23', imageUrl: 'https://images.unsplash.com/photo-1589882255747-975945199616?auto=format&fit=crop&w=500&q=60', mileage: 32000, dailyRate: 60, fuelType: 'Diesel', transmission: 'Manual', seats: 9, color: 'White', status: 'Available' },
  ];

  const vehicles = await Promise.all(
    vehiclesData.map(v => prisma.vehicle.create({ data: v }))
  );

  // 4. Customers
  const customerNames = [
    'Hans Müller', 'Sophie Martin', 'Giulia Rossi', 'Lukas Schmidt', 'Emma Weber',
    'Marie Dubois', 'Luca Ferrari', 'Felix Wagner', 'Chloe Thomas', 'Marco Romano',
    'Leon Becker', 'Camille Richard', 'Alessandro Colombo', 'Maximilian Hoffmann', 'Sarah Petit',
    'Matteo Ricci', 'Julian Schäfer', 'Léa Robert', 'Lorenzo Marino', 'Tim Koch',
    'Manon Simon', 'Gabriele Greco', 'Jonas Bauer', 'Juliette Michel', 'Edoardo Conti'
  ];

  const cities = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Paris', 'Lyon', 'Rome', 'Milan'];

  const customers = await Promise.all(
    customerNames.map((name, i) => prisma.customer.create({
      data: {
        fullName: name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: `+49 151 ${Math.floor(10000000 + Math.random() * 90000000)}`,
        licenseNumber: `DL${100000 + i}${Math.floor(Math.random() * 1000)}`,
        city: cities[i % cities.length],
        dateOfBirth: new Date(1970 + (i % 30), (i % 12), (i % 28) + 1),
      }
    }))
  );

  // 5. Bookings
  const today = new Date('2026-09-13T12:00:00Z');
  
  // Random helper
  const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const bookingsData: any[] = [];

  // 35 Completed
  for (let i = 0; i < 35; i++) {
    const v = randomElement(vehicles);
    const c = randomElement(customers);
    const cat = categories.find(cat => cat.id === v.categoryId)!;
    
    // Spread between March and August
    const month = randomInt(2, 7); // 0-based: March (2) to August (7)
    const day = randomInt(1, 28);
    const start = new Date(2026, month, day);
    const days = randomInt(1, 7);
    const end = new Date(start);
    end.setDate(start.getDate() + days);

    const km = randomInt(200, 800);
    const cost = (Number(v.dailyRate) * days) + (Number(cat.pricePerKm) * km);

    bookingsData.push({
      vehicleId: v.id,
      customerId: c.id,
      startDate: start,
      endDate: end,
      kmDriven: km,
      totalCost: cost,
      status: 'Completed',
    });
  }

  // 5 Active
  for (let i = 0; i < 5; i++) {
    const v = vehicles[i % vehicles.length];
    const c = customers[i % customers.length];
    
    const start = new Date(2026, 8, 10 + i); // Early Sept
    const end = new Date(2026, 8, 20 + i); // Later Sept
    
    bookingsData.push({
      vehicleId: v.id,
      customerId: c.id,
      startDate: start,
      endDate: end,
      status: 'Active',
    });
  }

  // 8 Confirmed
  for (let i = 0; i < 8; i++) {
    const v = randomElement(vehicles);
    const c = randomElement(customers);
    
    const start = new Date(today);
    start.setDate(today.getDate() + randomInt(1, 14));
    const end = new Date(start);
    end.setDate(start.getDate() + randomInt(1, 5));
    
    bookingsData.push({
      vehicleId: v.id,
      customerId: c.id,
      startDate: start,
      endDate: end,
      status: 'Confirmed',
    });
  }

  // 5 Pending
  for (let i = 0; i < 5; i++) {
    const v = randomElement(vehicles);
    const c = randomElement(customers);
    
    const start = new Date(today);
    start.setDate(today.getDate() + randomInt(15, 30));
    const end = new Date(start);
    end.setDate(start.getDate() + randomInt(1, 3));
    
    bookingsData.push({
      vehicleId: v.id,
      customerId: c.id,
      startDate: start,
      endDate: end,
      status: 'Pending',
    });
  }

  // 7 Cancelled
  for (let i = 0; i < 7; i++) {
    const v = randomElement(vehicles);
    const c = randomElement(customers);
    
    const start = new Date(2026, randomInt(3, 8), randomInt(1, 28));
    const end = new Date(start);
    end.setDate(start.getDate() + 2);
    
    bookingsData.push({
      vehicleId: v.id,
      customerId: c.id,
      startDate: start,
      endDate: end,
      status: 'Cancelled',
    });
  }

  for (const b of bookingsData) {
    await prisma.booking.create({ data: b });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
