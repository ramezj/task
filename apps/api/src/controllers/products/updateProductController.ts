import type { ProductErrorResponse, ProductMutationSuccessResponse } from "@task/types/product.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import {
  ProductParamsSchema,
  UpdateProductBodySchema,
  type ProductParams,
  type UpdateProductBody,
} from "../../routes/products/schemas.js";
import { ensureCategoryExists, mapProductRow, productSelect } from "./shared.js";
import { supabase } from "../../plugins/supabase.js";

export async function updateProductController(
  req: FastifyRequest<{
    Body: UpdateProductBody;
    Params: ProductParams;
    Reply: ProductMutationSuccessResponse | ProductErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = ProductParamsSchema.safeParse(req.params);
  const parsedBody = UpdateProductBodySchema.safeParse(req.body);

  if (!parsedParams.success) {
    return sendError(reply, 400, "Validation Error", "Invalid product id.");
  }

  if (!parsedBody.success) {
    const formErrors = parsedBody.error.flatten();
    const details = [
      ...Object.entries(formErrors.fieldErrors).flatMap(([field, messages]) =>
        (messages ?? []).map((message) => `${field}: ${message}`),
      ),
      ...formErrors.formErrors,
    ].join(", ");

    return sendError(
      reply,
      400,
      "Validation Error",
      details || "Validation failed.",
    );
  }

  const categoryExists = await ensureCategoryExists(parsedBody.data.categoryId, reply);

  if (!categoryExists || reply.sent) {
    return;
  }

  const updatePayload: {
    name?: string;
    description?: string | null;
    price?: number;
    image_url?: string | null;
    category_id?: string | null;
    is_active?: boolean;
  } = {};

  if (parsedBody.data.name !== undefined) updatePayload.name = parsedBody.data.name;
  if (parsedBody.data.description !== undefined) updatePayload.description = parsedBody.data.description;
  if (parsedBody.data.price !== undefined) updatePayload.price = parsedBody.data.price;
  if (parsedBody.data.imageUrl !== undefined) updatePayload.image_url = parsedBody.data.imageUrl;
  if (parsedBody.data.categoryId !== undefined) updatePayload.category_id = parsedBody.data.categoryId;
  if (parsedBody.data.isActive !== undefined) updatePayload.is_active = parsedBody.data.isActive;

  const { data: updatedRow, error: updateError } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", parsedParams.data.id)
    .select("id")
    .maybeSingle();

  if (updateError) {
    throw updateError;
  }

  if (!updatedRow) {
    return sendError(reply, 404, "Not Found", "Product not found");
  }

  const { data: fullProduct, error: fetchError } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", updatedRow.id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  return sendSuccess(reply, 200, {
    message: "Product updated successfully.",
    product: mapProductRow(fullProduct as any),
  });
}
