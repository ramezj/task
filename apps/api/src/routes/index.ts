import type { FastifyInstance } from "fastify";

export const mainRoutes = (app: FastifyInstance) => {
  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });
};
