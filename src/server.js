import Fastify from "fastify";
import cors from "@fastify/cors";
import userRoutes from "./routes/userRoutes.js";

const fastify = Fastify({ logger: true });

// Register CORS
await fastify.register(cors, {
  origin: true, // Allow all origins in development
});

// Register routes
await fastify.register(userRoutes, { prefix: "/" });

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
