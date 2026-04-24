import type { FastifyPluginAsync } from "fastify";
import type {
  ListProductsSuccessResponse,
  ProductErrorResponse,
} from "@task/types/product.js";

import { listProductsController } from "../../controllers/products/listProductsController.js";
import type { ListProductsQuery } from "./schemas.js";

const listProductsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: ListProductsQuery;
    Reply: ListProductsSuccessResponse | ProductErrorResponse;
  }>("/", listProductsController);
};

export default listProductsRoute;
