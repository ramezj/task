# Mini Shop API

This is the backend API for the Mini Shop project, built with [Fastify](https://www.fastify.io/) and [Supabase](https://supabase.com/).

## Tech Stack

- **Framework:** Fastify
- **Language:** TypeScript
- **Database/Auth:** Supabase (PostgreSQL)
- **Validation:** Zod
- **Runtime:** Node.js with `tsx` for development

## Prerequisites

- Node.js (v18+)
- Yarn
- A Supabase project

## Configuration

Create a `.env` file in `apps/api/src/config/` (or the root of `apps/api/` depending on your setup) with the following variables:

```env
PORT=8080
NODE_ENV=development
LOG_LEVEL=info
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
CLIENT_URL=http://localhost:3000
```

*Note: The `SUPABASE_SERVICE_ROLE_KEY` is required for administrative actions like updating order statuses.*

## Installation

```bash
cd apps/api
yarn install
```

## Running the API

### Development Mode
```bash
yarn dev
```
The server will start at `http://localhost:8080`.

### Database Seeding
To populate the database with initial categories and products:
```bash
yarn seed
```

## API Endpoints

- `GET /`: Health check
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `GET /api/products`: List active products
- `GET /api/products/categories`: List product categories
- `GET /api/orders`: List orders (Admin only)
- `PATCH /api/orders/:id/status`: Update order status (Admin only)

## Authentication

The API uses Supabase Auth. Routes are protected using an `authenticate` or `authorizeAdmin` pre-handler. Pass the JWT in the `Authorization` header as `Bearer <token>`.
