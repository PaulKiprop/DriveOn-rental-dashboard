# DriveOn — Car Rental Management Dashboard

DriveOn is a full-stack admin dashboard for managing a car rental business. It gives fleet operators a single place to track vehicles, customers, bookings, and revenue — with real-time availability checking and overlap prevention built in.

Built with **React**, **Vite**, **TypeScript** on the frontend and **Express**, **Prisma**, **PostgreSQL** on the backend. Supports **Docker** for one-command setup.

## Features

- **Dashboard** — KPI cards, monthly earnings charts, category revenue breakdown, fleet utilization, and recent activity feed.
- **Fleet Management** — Filter and sort vehicles by status, category, fuel type, or transmission. Table and card views with per-vehicle utilization, earnings, and booking history.
- **Bookings** — Search, filter, and sort bookings. Table and Gantt timeline views. Create new bookings with automatic availability validation (both client- and server-side).
- **Customers** — Search and view customer details, spending stats, favourite vehicle category, and booking history.
- **Availability Checker** — Select a vehicle and date range to instantly verify availability.
- **Auth & Theming** — JWT-based authentication, protected routes, login/register, and dark/light theme toggle.

## Prerequisites

**With Docker (recommended):**
- Docker Engine with Docker Compose

**Without Docker:**
- Node.js 22.12+ or 24.x (`.nvmrc` included)
- npm 10+
- PostgreSQL 16

## Getting Started

### Option 1 — Docker

```bash
git clone <repo-url>
cd DriveOn-rental-dashboard
docker compose up -d --build

# Seed sample data
docker compose exec backend npx prisma db seed
```

Open **http://localhost:3000**

```bash
docker compose logs -f backend   # follow API logs
docker compose down              # stop (keeps data)
docker compose down -v           # stop and delete data
```

### Option 2 — Local Development

**Backend:**

```bash
cd backend
nvm use
npm ci
cp .env.example .env             # edit with your DB connection and JWT_SECRET
npx prisma db push
npx prisma db seed
npm run dev                      # API on http://localhost:5000
```

**Frontend** (second terminal):

```bash
cd frontend
nvm use
npm ci
npm run dev                      # Dashboard on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend automatically.

## Default Login

Seed data includes a development account:

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

> ⚠️ Change or remove this account before deploying outside local development.

## Project Structure

```
DriveOn-rental-dashboard/
├── docker-compose.yml
├── backend/          # Express API, Prisma schema & seed
└── frontend/         # React + Vite dashboard
```
