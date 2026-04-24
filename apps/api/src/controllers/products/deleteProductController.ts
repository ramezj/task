import type { DeleteProductSuccessResponse, ProductErrorResponse } from "@task/types/product.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import {
  ProductParamsSchema,
  type ProductParams,
} from "../../routes/products/schemas.js";
import { supabase } from "../../plugins/supabase.js";

export async function deleteProductController(
  req: FastifyRequest<{
    Params: ProductParams;
    Reply: DeleteProductSuccessResponse | ProductErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = ProductParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return sendError(reply, 400, "Validation Error", "Invalid product id.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", parsed.data.id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return sendError(reply, 404, "Not Found", "Product not found");
  }

  return sendSuccess(reply, 200, {
    message: "Product soft deleted successfully.",
  });
}
