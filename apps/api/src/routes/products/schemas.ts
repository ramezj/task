import { z } from "zod";

const nullableTrimmedString = z
  .string()
  .trim()
  .max(10_000)
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

const nullableUrlString = z
  .string()
  .trim()
  .url()
  .transform((value) => (value.length > 0 ? value : null))
  .nullable()
  .optional();

const nullableUuidString = z
  .string()
  .uuid()
  .nullable()
  .optional();

export const ListProductsQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(120).optional(),
});

export type ListProductsQuery = z.infer<typeof ListProductsQuerySchema>;

export const ProductParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ProductParams = z.infer<typeof ProductParamsSchema>;

export const CreateProductBodySchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: nullableTrimmedString,
  price: z.coerce.number().finite().nonnegative(),
  imageUrl: nullableUrlString,
  categoryId: nullableUuidString,
  isActive: z.boolean().optional(),
});

export type CreateProductBody = z.infer<typeof CreateProductBodySchema>;

export const UpdateProductBodySchema = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    description: nullableTrimmedString,
    price: z.coerce.number().finite().nonnegative().optional(),
    imageUrl: nullableUrlString,
    categoryId: nullableUuidString,
    isActive: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
