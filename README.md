# DriveOn — Car Rental Management Dashboard

A modern, read-only admin dashboard for a single-branch car rental business. Built with React, Express, PostgreSQL, and Docker.

## Quick Start (Docker)

```bash
# 1. Clone the repo
git clone <repo-url>
cd DriveOn-rental-dashboard

# 2. Start all services
docker compose up --build

# 3. Seed the database after the backend reports it is running
# (the backend automatically synchronizes the Prisma schema on startup)
docker compose exec backend npx prisma db seed

# Optional: manage the data visually at http://localhost:5555
docker compose --profile tools up -d prisma-studio

# 4. Open the dashboard
# http://localhost:3000
```

**Default credentials:**
- Username: `admin`
- Password: `admin123`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui, Recharts |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Auth | JWT (HTTP-only cookies) |
| Infrastructure | Docker, Docker Compose |

## Local Development (without Docker)

### Prerequisites
- Node.js 24.21.0 (or a supported Node 22.12+ / 24.x version; `.nvmrc` pins the project version)
- PostgreSQL 16 running locally

Use the pinned runtime before installing packages:

```bash
nvm use
```

The project uses lockfiles, so use `npm ci` for repeatable installs. npm is configured to reject unsupported Node versions instead of attempting an unreliable install.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx prisma db push
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Dashboard** — KPI summary, availability checker, monthly earnings chart, fleet utilization, recent activity
- **Fleet** — Filter/sort vehicles by status, category, fuel type; table and card views; vehicle detail modal
- **Bookings** — Filter/sort/search bookings; Gantt timeline visualization; booking detail modal
- **Customers** — Search and sort customers; customer profile with booking history
- **Auth** — JWT-based admin authentication; dark/light theme toggle

## Database Schema

5 normalized tables: `users`, `vehicle_categories`, `vehicles`, `customers`, `bookings`

**Cost calculation (on booking completion):**
```
total_cost = (daily_rate × days) + (price_per_km × km_driven)
```

## Project Structure

```
DriveOn-rental-dashboard/
├── docker-compose.yml
├── README.md
├── backend/           # Express API + Prisma
└── frontend/          # React SPA
```
