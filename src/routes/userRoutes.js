import { handleGetUserById } from "../controllers/userController.js";
import { handleGetUserActionCount } from "../controllers/actionController.js";

async function userRoutes(fastify, options) {
  fastify.get("/:id", handleGetUserById);
  fastify.get("/:id/actions/count", handleGetUserActionCount);
}

export default userRoutes;
