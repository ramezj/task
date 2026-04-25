import type { FastifyPluginAsync } from "fastify";
import type {
  MyOrdersSuccessResponse,
  OrderErrorResponse,
} from "@task/types/order.js";

import { getMyOrdersController } from "../../controllers/orders/getMyOrdersController.js";

const getMyOrdersRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: MyOrdersSuccessResponse | OrderErrorResponse;
  }>(
    "/my",
    {
      preHandler: [async (request, reply) => fastify.authenticate(request, reply)],
    },
    getMyOrdersController,
  );
};

export default getMyOrdersRoute;
