import type { FastifyPluginAsync } from "fastify";

import createProductRoute from "./post-product.js";
import deleteProductRoute from "./delete-product.js";
import getProductRoute from "./get-product.js";
import listProductsRoute from "./list-products.js";
import updateProductRoute from "./patch-product.js";

const productRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(listProductsRoute);
  fastify.register(getProductRoute);
  fastify.register(createProductRoute);
  fastify.register(updateProductRoute);
  fastify.register(deleteProductRoute);
};

export default productRoutes;
