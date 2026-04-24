import type { FastifyPluginAsync } from "fastify";
import type {
  DeleteProductSuccessResponse,
  ProductErrorResponse,
} from "@task/types/product.js";

import { deleteProductController } from "../../controllers/products/deleteProductController.js";
import type { ProductParams } from "./schemas.js";

const deleteProductRoute: FastifyPluginAsync = async (fastify) => {
  fastify.delete<{
    Params: ProductParams;
    Reply: DeleteProductSuccessResponse | ProductErrorResponse;
  }>(
    "/:id",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    deleteProductController,
  );
};

export default deleteProductRoute;
