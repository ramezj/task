# Mini Shop Admin Dashboard

The Admin Dashboard for managing products, categories, and viewing orders.

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React)
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** TanStack Query
- **Routing:** TanStack Router
- **Auth/Backend:** Supabase SSR

## Prerequisites

- Node.js (v18+)
- pnpm

## Configuration

Create a `.env` file in the root of `apps/dashboard/` with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8080
```

## Installation

```bash
cd apps/dashboard
pnpm install
```

## Running the Dashboard

### Development Mode
```bash
pnpm dev
```
The application will be available at `http://localhost:3000` (default TanStack Start port).

## Features

- **Dashboard Overview**: View key metrics like total revenue and active products.
- **Product Management**: Create, edit, and toggle the status of products.
- **Order Management**: View all customer orders and update their fulfillment status (Pending, Confirmed, Shipped, etc.).
- **Authentication**: Secure login for administrative accounts.

## Deployment

To build the application for production:

```bash
pnpm build
pnpm start
```
