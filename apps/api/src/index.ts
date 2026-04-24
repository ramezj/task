import Fastify from "fastify";
import type { HealthcheckResponse } from "@task/types/system.js";
import type { AuthErrorResponse, MeSuccessResponse } from "@task/types/auth.js";
import authPlugin from "./plugins/auth.js";
import authRoutes from "./routes/auth/index.js";
import { sendError, sendSuccess } from "./lib/responses.js";

const app = Fastify({
  logger: true,
});
const port = Number(process.env.PORT ?? 8080);

// Register Auth Plugin
app.register(authPlugin);

app.setNotFoundHandler((request, reply) => {
  return sendError(
    reply,
    404,
    "Not Found",
    `Route ${request.method} ${request.url} not found.`,
  );
});

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (reply.sent) {
    return;
  }

  return sendError(
    reply,
    500,
    "Internal Server Error",
    "Something went wrong.",
  );
});

app.get<{ Reply: HealthcheckResponse }>("/", async (request, reply) => {
  return sendSuccess(reply, 200, { message: "API is running." });
});

app.register(authRoutes, { prefix: "/api/auth" });
// Example of a protected route using preHandler hook
app.get<{
  Reply: MeSuccessResponse | AuthErrorResponse;
}>(
  "/me",
  { preHandler: [async (request, reply) => app.authenticate(request, reply)] },
  async (request, reply) => {
    if (!request.user) {
      return sendError(
        reply,
        401,
        "Unauthorized",
        "Invalid token or user not found",
      );
    }

    return sendSuccess(reply, 200, {
      message: "You are authenticated via Supabase",
      user: request.user,
    });
  },
);

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
