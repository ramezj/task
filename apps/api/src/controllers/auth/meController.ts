import type { FastifyRequest, FastifyReply } from "fastify";
import type {
  AuthErrorResponse,
  MeSuccessResponse,
} from "@task/types/auth.js";
import { sendError, sendSuccess } from "../../lib/responses.js";

export async function meController(
  req: FastifyRequest<{
    Reply: MeSuccessResponse | AuthErrorResponse;
  }>,
  reply: FastifyReply,
) {
  if (!req.user) {
    return sendError(
      reply,
      401,
      "Unauthorized",
      "Invalid token or user not found",
    );
  }

  return sendSuccess(reply, 200, {
    message: "Authenticated user retrieved successfully.",
    user: {
      id: req.user.id,
      email: req.user.email ?? null,
      name:
        typeof req.user.user_metadata?.name === "string"
          ? req.user.user_metadata.name
          : null,
    },
  });
}
