import type { FastifyPluginAsync } from "fastify";
import type {
  ListOrdersSuccessResponse,
  OrderErrorResponse,
} from "@task/types/order.js";

import { listOrdersController } from "../../controllers/orders/listOrdersController.js";
import type { OrdersPaginationQuery } from "./schemas.js";

const listOrdersRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: OrdersPaginationQuery;
    Reply: ListOrdersSuccessResponse | OrderErrorResponse;
  }>(
    "/",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    listOrdersController,
  );
};

export default listOrdersRoute;
