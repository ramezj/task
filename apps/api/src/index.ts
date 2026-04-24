import Fastify from "fastify";
import authPlugin from "./plugins/auth.js";

const app = Fastify({
  logger: true,
});
const port = Number(process.env.PORT ?? 8080);

// Register Auth Plugin
app.register(authPlugin);

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Example of a protected route using preHandler hook
app.get("/me", { preHandler: [async (request, reply) => app.authenticate(request, reply)] }, async (request, reply) => {
  return { 
    message: "You are authenticated via Supabase",
    user: request.user 
  };
});

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
