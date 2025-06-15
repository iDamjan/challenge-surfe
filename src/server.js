import Fastify from "fastify";
import cors from "@fastify/cors";
import userRoutes from "./routes/userRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: true,
});

await fastify.register(userRoutes, { prefix: "/users" });
await fastify.register(actionRoutes, { prefix: "/actions" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
