import type {
  OrderErrorResponse,
  UpdateOrderStatusSuccessResponse,
} from "@task/types/order.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import {
  OrderParamsSchema,
  UpdateOrderStatusBodySchema,
  type OrderParams,
  type UpdateOrderStatusBody,
} from "../../routes/orders/schemas.js";
import { mapOrderRow, orderSelect } from "./shared.js";

export async function updateOrderStatusController(
  req: FastifyRequest<{
    Body: UpdateOrderStatusBody;
    Params: OrderParams;
    Reply: UpdateOrderStatusSuccessResponse | OrderErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsedParams = OrderParamsSchema.safeParse(req.params);
  const parsedBody = UpdateOrderStatusBodySchema.safeParse(req.body);

  if (!parsedParams.success) {
    return sendError(reply, 400, "Validation Error", "Invalid order id.");
  }

  if (!parsedBody.success) {
    const details = Object.entries(parsedBody.error.flatten().fieldErrors)
      .flatMap(([field, messages]) => (messages ?? []).map((message) => `${field}: ${message}`))
      .join(", ");

    return sendError(reply, 400, "Validation Error", details || "Validation failed.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: parsedBody.data.status })
    .eq("id", parsedParams.data.id)
    .select(orderSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return sendError(reply, 404, "Not Found", "Order not found");
  }

  return sendSuccess(reply, 200, {
    message: "Order status updated successfully.",
    order: mapOrderRow(data),
  });
}
