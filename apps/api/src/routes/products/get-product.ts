import type { FastifyPluginAsync } from "fastify";
import type {
  ProductDetailSuccessResponse,
  ProductErrorResponse,
} from "@task/types/product.js";

import { getProductController } from "../../controllers/products/getProductController.js";
import type { ProductParams } from "./schemas.js";

const getProductRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Params: ProductParams;
    Reply: ProductDetailSuccessResponse | ProductErrorResponse;
  }>("/:id", getProductController);
};

export default getProductRoute;
