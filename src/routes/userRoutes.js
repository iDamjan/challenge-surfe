import {
  handleGetUserById,
  handleGetReferredUsersIndex,
} from "../controllers/userController.js";

async function userRoutes(fastify, options) {
  fastify.get("/:id", handleGetUserById);
  fastify.get("/referred-users", handleGetTotalReferredUsers);
}

export default userRoutes;
