import type { FastifyPluginAsync } from "fastify";
import type {
  OrderErrorResponse,
  PlaceOrderSuccessResponse,
} from "@task/types/order.js";

import { placeOrderController } from "../../controllers/orders/placeOrderController.js";
import type { PlaceOrderBody } from "./schemas.js";

const placeOrderRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: PlaceOrderBody;
    Reply: PlaceOrderSuccessResponse | OrderErrorResponse;
  }>(
    "/",
    {
      preHandler: [async (request, reply) => fastify.authenticate(request, reply)],
    },
    placeOrderController,
  );
};

export default placeOrderRoute;
