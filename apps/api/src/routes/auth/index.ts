import type { FastifyPluginAsync } from "fastify";
import loginRoute from "./login.js";
import meRoute from "./me.js";
import registerRoute from "./register.js";
import resetPasswordRoute from "./reset-password.js";

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(registerRoute);
  fastify.register(loginRoute);
  fastify.register(meRoute);
  fastify.register(resetPasswordRoute);
};

export default authRoutes;
