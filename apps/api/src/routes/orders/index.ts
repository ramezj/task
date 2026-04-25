import type { FastifyPluginAsync } from "fastify";

import getMyOrdersRoute from "./get-my-orders.js";
import getOrderRoute from "./get-order.js";
import listOrdersRoute from "./list-orders.js";
import placeOrderRoute from "./post-order.js";
import updateOrderStatusRoute from "./patch-order-status.js";

const orderRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(getMyOrdersRoute);
  fastify.register(getOrderRoute);
  fastify.register(listOrdersRoute);
  fastify.register(placeOrderRoute);
  fastify.register(updateOrderStatusRoute);
};

export default orderRoutes;
