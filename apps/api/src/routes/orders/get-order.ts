import type { FastifyPluginAsync } from "fastify";
import type {
  OrderDetailSuccessResponse,
  OrderErrorResponse,
} from "@task/types/order.js";

import { getOrderController } from "../../controllers/orders/getOrderController.js";
import type { OrderParams } from "./schemas.js";

const getOrderRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Params: OrderParams;
    Reply: OrderDetailSuccessResponse | OrderErrorResponse;
  }>(
    "/:id",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    getOrderController,
  );
};

export default getOrderRoute;
