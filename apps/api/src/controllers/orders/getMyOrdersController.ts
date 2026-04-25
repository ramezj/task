import type { MyOrdersSuccessResponse, OrderErrorResponse } from "@task/types/order.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import { mapOrderRow, orderSelect } from "./shared.js";

export async function getMyOrdersController(
  req: FastifyRequest<{
    Reply: MyOrdersSuccessResponse | OrderErrorResponse;
  }>,
  reply: FastifyReply,
) {
  if (!req.user) {
    return sendError(reply, 401, "Unauthorized", "Authentication is required");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return sendSuccess(reply, 200, {
    message: "Orders retrieved successfully.",
    orders: (data ?? []).map(mapOrderRow),
  });
}
