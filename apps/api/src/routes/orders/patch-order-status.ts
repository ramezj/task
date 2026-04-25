import type { FastifyPluginAsync } from "fastify";
import type {
  OrderErrorResponse,
  UpdateOrderStatusSuccessResponse,
} from "@task/types/order.js";

import { updateOrderStatusController } from "../../controllers/orders/updateOrderStatusController.js";
import type { OrderParams, UpdateOrderStatusBody } from "./schemas.js";

const updateOrderStatusRoute: FastifyPluginAsync = async (fastify) => {
  fastify.patch<{
    Body: UpdateOrderStatusBody;
    Params: OrderParams;
    Reply: UpdateOrderStatusSuccessResponse | OrderErrorResponse;
  }>(
    "/:id/status",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    updateOrderStatusController,
  );
};

export default updateOrderStatusRoute;
