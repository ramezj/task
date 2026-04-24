import Fastify from "fastify";

const app = Fastify({
  logger: true,
});
const port = Number(process.env.PORT ?? 8080);

app.get("/", async (request, reply) => {
  return { hello: "world" };
});

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
