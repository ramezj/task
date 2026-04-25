# Mini Shop Monorepo

Welcome to the Mini Shop project. This is a monorepo containing the full-stack application, including the API, Admin Dashboard, and Mobile App.

## Project Structure

- `apps/api`: Fastify-based backend API using Supabase.
- `apps/dashboard`: Admin Dashboard built with TanStack Start (Vite).
- `apps/mobile`: Mobile App built with Expo and React Native.
- `packages/types`: Shared TypeScript types and schemas used across all applications.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [npm](https://www.npmjs.com/)
- [Supabase Account](https://supabase.com/)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd task
    ```

2.  **Install dependencies:**
    Each application has its own lock file. Navigate to each directory to install dependencies.

3.  **Environment Setup:**
    Each app requires its own `.env` file. Refer to the `README.md` in each individual directory for specific configuration details.

4.  **Running the project:**
    You will typically need to run the API and at least one frontend application.
    - **API:** `cd apps/api && yarn dev`
    - **Dashboard:** `cd apps/dashboard && pnpm dev`
    - **Mobile:** `cd apps/mobile && npm run start`

## Documentation

For detailed setup and configuration instructions, please refer to the README files in the respective directories:

- [API Documentation](./apps/api/README.md)
- [Dashboard Documentation](./apps/dashboard/README.md)
- [Mobile Documentation](./apps/mobile/README.md)
- [Shared Types Documentation](./packages/types/README.md)
