import type { FastifyInstance } from "fastify";
import type { HealthcheckResponse } from "../../../../packages/types/src/system.js";
import { sendSuccess } from "../lib/responses.js";

export const mainRoutes = (app: FastifyInstance) => {
  app.get<{ Reply: HealthcheckResponse }>("/", async (request, reply) => {
    return sendSuccess(reply, 200, { message: "API is running." });
  });
};
