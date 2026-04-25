import type {
  OrderDetailSuccessResponse,
  OrderErrorResponse,
} from "@task/types/order.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import {
  OrderParamsSchema,
  type OrderParams,
} from "../../routes/orders/schemas.js";
import { mapOrderRow, orderSelect } from "./shared.js";

export async function getOrderController(
  req: FastifyRequest<{
    Params: OrderParams;
    Reply: OrderDetailSuccessResponse | OrderErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = OrderParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    return sendError(reply, 400, "Validation Error", "Invalid order id.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return sendError(reply, 404, "Not Found", "Order not found");
  }

  return sendSuccess(reply, 200, {
    message: "Order retrieved successfully.",
    order: mapOrderRow(data),
  });
}
