# Shared Types Package

This package contains shared TypeScript interfaces, types, and Zod schemas used across the Mini Shop monorepo.

## Structure

- `src/api.ts`: Common API response and error types.
- `src/auth.ts`: Authentication related types (Login, Register, User profile).
- `src/product.ts`: Product and Category interfaces.
- `src/order.ts`: Order and OrderItem types, including status enums.
- `src/system.ts`: General system types (Healthcheck, etc).

## Usage

This package is intended to be used as a local dependency in other workspaces within this monorepo.

### Referencing in `tsconfig.json`

The workspaces are configured to resolve these types via paths:

```json
"paths": {
  "@task/types/*": ["../../packages/types/src/*"]
}
```

## Why a shared package?

1. **Type Safety**: Ensures the API and clients (Mobile, Dashboard) are always in sync regarding data structures.
2. **Validation Consistency**: Zod schemas defined here can be used for both backend validation and frontend form handling.
3. **Reduced Duplication**: Critical enums like `OrderStatus` are defined once and reused everywhere.
