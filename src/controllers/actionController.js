import { getUserActionCount } from "../services/actionService.js";
import { calculateNextActionProbability } from "../services/actionService.js";

const VALID_ACTION_TYPES = [
  "WELCOME",
  "CONNECT_CRM",
  "EDIT_CONTACT",
  "ADD_CONTACT",
  "VIEW_CONTACTS",
  "REFER_USER",
];

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

export async function handleGetNextActionProbability(request, reply) {
  try {
    const { actionType } = request.params;

    if (!VALID_ACTION_TYPES.includes(actionType)) {
      return reply.code(400).send({
        error: "Invalid action type",
        validActions: VALID_ACTION_TYPES,
      });
    }

    const probabilities = await calculateNextActionProbability(actionType);

    return reply.code(200).send(probabilities);
  } catch (error) {
    console.error("Error calculating action probabilities:", error);
    return reply.code(500).send({ error: "Internal server error" });
  }
}
