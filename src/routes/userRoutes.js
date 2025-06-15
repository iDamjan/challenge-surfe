import {
  handleGetUserById,
  handleGetTotalReferredUsers,
} from "../controllers/userController.js";

async function userRoutes(fastify, options) {
  fastify.get("/:id", handleGetUserById);
  fastify.get("/referrals", handleGetTotalReferredUsers);
}

export default userRoutes;
