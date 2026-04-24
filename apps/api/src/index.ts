import cors from "@fastify/cors";
import Fastify from "fastify";
import type { HealthcheckResponse } from "@task/types/system.js";
import authPlugin from "./plugins/auth.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth/index.js";
import productRoutes from "./routes/products/index.js";
import { sendError, sendSuccess } from "./lib/responses.js";

const app = Fastify({
  logger: true,
});
const port = Number(process.env.PORT ?? 8080);

app.register(cors, {
  origin: [env.CLIENT_URL],
});

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
app.register(productRoutes, { prefix: "/api/products" });

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
