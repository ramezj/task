import type { FastifyPluginAsync } from "fastify";
import type {
  AuthErrorResponse,
  MeSuccessResponse,
} from "@task/types/auth.js";
import { meController } from "../../controllers/auth/meController.js";

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: MeSuccessResponse | AuthErrorResponse;
  }>(
    "/me",
    {
      preHandler: [async (request, reply) => fastify.authenticate(request, reply)],
    },
    meController,
  );
};

export default meRoute;
