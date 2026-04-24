import type { ProductDetailSuccessResponse, ProductErrorResponse } from "@task/types/product.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import {
  ProductParamsSchema,
  type ProductParams,
} from "../../routes/products/schemas.js";
import { mapProductRow, productSelect } from "./shared.js";
import { supabase } from "../../plugins/supabase.js";

export async function getProductController(
  req: FastifyRequest<{
    Params: ProductParams;
    Reply: ProductDetailSuccessResponse | ProductErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = ProductParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return sendError(reply, 400, "Validation Error", "Invalid product id.");
  }

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", parsed.data.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return sendError(reply, 404, "Not Found", "Product not found");
  }

  return sendSuccess(reply, 200, {
    message: "Product retrieved successfully.",
    product: mapProductRow(data),
  });
}
