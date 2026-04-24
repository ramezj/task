import type { FastifyPluginAsync } from "fastify";
import type {
  ProductErrorResponse,
  ProductMutationSuccessResponse,
} from "@task/types/product.js";

import { createProductController } from "../../controllers/products/createProductController.js";
import type { CreateProductBody } from "./schemas.js";

const createProductRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: CreateProductBody;
    Reply: ProductMutationSuccessResponse | ProductErrorResponse;
  }>(
    "/",
    {
      preHandler: [async (request, reply) => fastify.authorizeAdmin(request, reply)],
    },
    createProductController,
  );
};

export default createProductRoute;
