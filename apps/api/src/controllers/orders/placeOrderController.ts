import type {
  OrderErrorResponse,
  PlaceOrderSuccessResponse,
} from "@task/types/order.js";
import type { FastifyReply, FastifyRequest } from "fastify";

import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import {
  PlaceOrderBodySchema,
  type PlaceOrderBody,
} from "../../routes/orders/schemas.js";
import { mapOrderRow, orderSelect } from "./shared.js";

export async function placeOrderController(
  req: FastifyRequest<{
    Body: PlaceOrderBody;
    Reply: PlaceOrderSuccessResponse | OrderErrorResponse;
  }>,
  reply: FastifyReply,
) {
  if (!req.user) {
    return sendError(reply, 401, "Unauthorized", "Authentication is required");
  }

  const parsed = PlaceOrderBodySchema.safeParse(req.body);

  if (!parsed.success) {
    const details = Object.entries(parsed.error.flatten().fieldErrors)
      .flatMap(([field, messages]) => (messages ?? []).map((message) => `${field}: ${message}`))
      .join(", ");

    return sendError(reply, 400, "Validation Error", details || "Validation failed.");
  }

  const productIds = Array.from(new Set(parsed.data.items.map((item) => item.productId)));
  const { data: productRows, error: productsError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError) {
    throw productsError;
  }

  const productsById = new Map((productRows ?? []).map((row) => [row.id, Number(row.price)]));
  const missingProductId = productIds.find((productId) => !productsById.has(productId));

  if (missingProductId) {
    return sendError(reply, 404, "Not Found", `Product not found: ${missingProductId}`);
  }

  const totalAmount = parsed.data.items.reduce((sum, item) => {
    const unitPrice = productsById.get(item.productId) ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  const { data: createdOrder, error: createOrderError } = await supabase
    .from("orders")
    .insert({
      user_id: req.user.id,
      status: "pending",
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (createOrderError) {
    throw createOrderError;
  }

  const orderItemsPayload = parsed.data.items.map((item) => ({
    order_id: createdOrder.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: productsById.get(item.productId) ?? 0,
  }));

  const { error: createItemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (createItemsError) {
    await supabase.from("orders").delete().eq("id", createdOrder.id);
    throw createItemsError;
  }

  const { data: orderRow, error: orderFetchError } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("id", createdOrder.id)
    .maybeSingle();

  if (orderFetchError) {
    throw orderFetchError;
  }

  if (!orderRow) {
    return sendError(reply, 404, "Not Found", "Order not found");
  }

  return sendSuccess(reply, 201, {
    message: "Order placed successfully.",
    order: mapOrderRow(orderRow),
  });
}
