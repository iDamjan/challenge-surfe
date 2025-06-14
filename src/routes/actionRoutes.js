import {
  handleGetUserActionCount,
  handleGetNextActionProbability,
} from "../controllers/actionController.js";

async function actionRoutes(fastify, options) {
  fastify.get("/:id/count", handleGetUserActionCount);
  fastify.get("/next-probability/:actionType", handleGetNextActionProbability);
}

export default actionRoutes;
