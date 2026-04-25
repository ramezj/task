import type { FastifyPluginAsync } from "fastify";
import { listCategoriesController } from "../../controllers/products/listCategoriesController.js";

const listCategoriesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/categories", listCategoriesController);
};

export default listCategoriesRoute;
