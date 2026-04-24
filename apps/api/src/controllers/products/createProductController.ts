import type { ProductErrorResponse, ProductMutationSuccessResponse } from "@task/types/product.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import {
  CreateProductBodySchema,
  type CreateProductBody,
} from "../../routes/products/schemas.js";
import { ensureCategoryExists, mapProductRow, productSelect } from "./shared.js";
import { supabase } from "../../plugins/supabase.js";

export async function createProductController(
  req: FastifyRequest<{
    Body: CreateProductBody;
    Reply: ProductMutationSuccessResponse | ProductErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = CreateProductBodySchema.safeParse(req.body);

  if (!parsed.success) {
    const details = Object.entries(parsed.error.flatten().fieldErrors)
      .flatMap(([field, messages]) =>
        (messages ?? []).map((message) => `${field}: ${message}`),
      )
      .join(", ");

    return sendError(
      reply,
      400,
      "Validation Error",
      details || "Validation failed.",
    );
  }

  const categoryExists = await ensureCategoryExists(parsed.data.categoryId, reply);

  if (!categoryExists || reply.sent) {
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      price: parsed.data.price,
      image_url: parsed.data.imageUrl ?? null,
      category_id: parsed.data.categoryId ?? null,
      is_active: parsed.data.isActive ?? true,
    })
    .select(productSelect)
    .single();

  if (error) {
    throw error;
  }

  return sendSuccess(reply, 201, {
    message: "Product created successfully.",
    product: mapProductRow(data),
  });
}
