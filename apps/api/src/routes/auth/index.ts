import type { FastifyPluginAsync } from "fastify";
import registerRoute from "./register.js";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(registerRoute);
};

export default authRoutes;
