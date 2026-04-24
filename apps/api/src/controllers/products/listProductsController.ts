import type { ProductErrorResponse, ListProductsSuccessResponse } from "@task/types/product.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import {
  ListProductsQuerySchema,
  type ListProductsQuery,
} from "../../routes/products/schemas.js";
import {
  mapProductRow,
  productSelect,
  resolveCategoryIdBySlug,
} from "./shared.js";
import { supabase } from "../../plugins/supabase.js";

export async function listProductsController(
  req: FastifyRequest<{
    Querystring: ListProductsQuery;
    Reply: ListProductsSuccessResponse | ProductErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = ListProductsQuerySchema.safeParse(req.query);

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

  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (parsed.data.category) {
    const categoryId = await resolveCategoryIdBySlug(parsed.data.category, reply);

    if (reply.sent) {
      return;
    }

    if (!categoryId) {
      return sendSuccess(reply, 200, {
        message: "Active products retrieved successfully.",
        products: [],
      });
    }

    query = query.eq("category_id", categoryId);
  }

  if (parsed.data.search) {
    const searchTerm = parsed.data.search.replace(/[%_,]/g, " ").trim();
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return sendSuccess(reply, 200, {
    message: "Active products retrieved successfully.",
    products: (data ?? []).map(mapProductRow),
  });
}
