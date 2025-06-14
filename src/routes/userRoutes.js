import { handleGetUserById } from "../controllers/userController.js";

async function userRoutes(fastify, options) {
  fastify.get("/:id", handleGetUserById);
}

export default userRoutes;
