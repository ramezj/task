import type {
  ListOrdersSuccessResponse,
  OrderErrorResponse,
} from "@task/types/order.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import {
  OrdersPaginationQuerySchema,
  type OrdersPaginationQuery,
} from "../../routes/orders/schemas.js";
import { mapOrderRow, orderSelect } from "./shared.js";

export async function listOrdersController(
  req: FastifyRequest<{
    Querystring: OrdersPaginationQuery;
    Reply: ListOrdersSuccessResponse | OrderErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = OrdersPaginationQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    const details = Object.entries(parsed.error.flatten().fieldErrors)
      .flatMap(([field, messages]) => (messages ?? []).map((message) => `${field}: ${message}`))
      .join(", ");

    return sendError(reply, 400, "Validation Error", details || "Validation failed.");
  }

  const { page, limit } = parsed.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("orders")
    .select(orderSelect, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return sendSuccess(reply, 200, {
    message: "Orders retrieved successfully.",
    page,
    limit,
    total,
    totalPages,
    orders: (data ?? []).map(mapOrderRow),
  });
}
