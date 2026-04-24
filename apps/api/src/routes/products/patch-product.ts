import type { FastifyPluginAsync } from "fastify";
import type {
  ProductErrorResponse,
  ProductMutationSuccessResponse,
} from "@task/types/product.js";

import { updateProductController } from "../../controllers/products/updateProductController.js";
import type { ProductParams, UpdateProductBody } from "./schemas.js";

const updateProductRoute: FastifyPluginAsync = async (fastify) => {
  fastify.patch<{
    Body: UpdateProductBody;
    Params: ProductParams;
    Reply: ProductMutationSuccessResponse | ProductErrorResponse;
  }>(
    "/:id",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    updateProductController,
  );
};

export default updateProductRoute;
