import { handleGetUserActionCount } from "../controllers/actionController.js";

async function actionRoutes(fastify, options) {
  fastify.get("/:id/count", handleGetUserActionCount);
  fastify.get("/next-action", handleGetNextAction);
}

export default actionRoutes;
