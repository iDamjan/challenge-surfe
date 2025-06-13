import { handleGetUserById } from "../controllers/userController.js";
import { handleGetUserActionCount } from "../controllers/actionController.js";

async function userRoutes(fastify, options) {
  fastify.get("/users/:id", handleGetUserById);
  fastify.get("/users/:id/actions/count", handleGetUserActionCount);
}

export default userRoutes;
