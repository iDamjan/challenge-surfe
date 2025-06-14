import { getUserActionCount } from "../services/actionService.js";
import { getNextActionsProbability } from "../utils/actions.js";

export async function handleGetUserActionCount(request, reply) {
  try {
    const { id } = request.params;

    // If user id is not valid return error
    if (isNaN(id) || id < 0) {
      return reply.code(400).send({ error: "User ID is required" });
    }

    const result = await getUserActionCount(id);
    return reply.code(200).send(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return reply.code(404).send({ error: "User not found" });
    }
    return reply.code(500).send({ error: "Internal server error" });
  }
}
