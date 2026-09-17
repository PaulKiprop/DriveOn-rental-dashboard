# DriveOn — Car Rental Management Dashboard

DriveOn is an authenticated admin dashboard for managing a single-branch car-rental fleet. It provides an overview of vehicles, customers, bookings, revenue, and availability, with a booking-creation workflow that prevents overlapping rentals.

## Requirements

### Docker (recommended)

- Docker Engine with Docker Compose

### Local development

- Node.js **24.21.0** (or Node 22.12+ / 24.x)
- npm 10+
- PostgreSQL 16
- `nvm` is recommended; `.nvmrc` pins the project runtime to Node 24.21.0.


## Run with Docker

Docker runs PostgreSQL, the Express API, and the production frontend together:

```bash
git clone <repo-url>
cd DriveOn-rental-dashboard
docker compose up -d --build

# Seed the database after the backend is healthy
docker compose exec backend npx prisma db seed
```

Open the dashboard at <http://localhost:3000>. Useful commands:

```bash
docker compose logs -f backend       # follow API logs
docker compose ps                    # check service status
docker compose down                  # stop services (keeps database volume)
docker compose down -v               # stop services and delete database data
```

Prisma Studio is optional:

```bash
docker compose --profile tools up -d prisma-studio
# http://localhost:5555
```

The compose file supplies development database credentials and a JWT secret for local use. Replace them before deploying anywhere public.

## Run locally without Docker

### 1. Start PostgreSQL

Create a PostgreSQL 16 database named `driveon`, then switch to the pinned Node version:

```bash
nvm use
```

### 2. Configure and start the backend

```bash
cd backend
npm ci
cp .env.example .env
```

Edit `backend/.env` with your database connection and a long, private `JWT_SECRET`. Then create the schema, seed sample data, and start the API:

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

The API listens on <http://localhost:5000>.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
nvm use
npm ci
npm run dev
```

Open the Vite URL shown in the terminal (normally <http://localhost:5173>). Its development proxy forwards `/api` requests to the backend on port 5000.

Production builds can be checked with:

```bash
cd backend && npm run build
cd frontend && npm run build
```

## Sign in

Seed data includes the development account:

| Username | Password |
|---|---|
| `admin` | `admin123` |

Change or remove this account before using the application outside local development. Authentication uses JWTs stored in HTTP-only cookies.

## Dashboard and features

- **Dashboard** — KPI cards for fleet and booking status, current availability, active rentals, customer count, and revenue; monthly earnings; category revenue; fleet utilization; and recent activity.
- **Availability Checker** — select a vehicle and pickup/return dates to see whether the requested period overlaps a non-cancelled booking. End-date/pickup-date boundaries may touch (checkout on the same date as the next pickup).
- **Fleet** — filter and sort vehicles by status, category, fuel type, or transmission; switch between table and card views; inspect vehicle details, utilization, earnings, and booking history.
- **Bookings** — search by customer or registration plate, filter by status, sort by dates/cost/created date, and switch between table and Gantt timeline views.
- **Create booking** — from the Bookings page, choose a customer, vehicle, pickup date, return date, and optional notes. Availability is checked before submission and the API checks again server-side. Conflicting or maintenance vehicles are rejected with a clear error. New bookings start as `Pending`.
- **Customers** — search and sort customers, view contact/licence details, spending statistics, favourite vehicle category, and booking history.
- **Theme and authentication** — protected routes, login/register screens, logout, and dark/light theme support.

## Booking rules

Booking periods use an inclusive pickup / exclusive return boundary. A requested period conflicts when:

```text
existing.start < requested.end
AND existing.end > requested.start
```

All statuses except `Cancelled` reserve the vehicle. A vehicle in `Maintenance` cannot be booked. The API rejects invalid dates, unknown customers or vehicles, and overlapping reservations even if the browser-side availability check is bypassed.

## Data model and pricing

The database contains five normalized tables: `users`, `vehicle_categories`, `vehicles`, `customers`, and `bookings`.

When a booking is completed, the documented cost formula is:

```text
total_cost = (daily_rate × rental_days) + (price_per_km × km_driven)
```

## Project structure

```text
DriveOn-rental-dashboard/
├── docker-compose.yml
├── README.md
├── .nvmrc / .npmrc
├── backend/           # Express API, Prisma schema, and seed data
└── frontend/          # React + Vite dashboard
```
