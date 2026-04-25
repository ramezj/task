import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const PlaceOrderBodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
      }),
    )
    .min(1),
});

export type PlaceOrderBody = z.infer<typeof PlaceOrderBodySchema>;

export const OrdersPaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type OrdersPaginationQuery = z.infer<typeof OrdersPaginationQuerySchema>;

export const OrderParamsSchema = z.object({
  id: z.string().uuid(),
});

export type OrderParams = z.infer<typeof OrderParamsSchema>;

export const UpdateOrderStatusBodySchema = z.object({
  status: OrderStatusSchema,
});

export type UpdateOrderStatusBody = z.infer<typeof UpdateOrderStatusBodySchema>;
