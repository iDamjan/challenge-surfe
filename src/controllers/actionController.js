import { getUserActionCount } from "../services/actionService.js";
import { calculateNextActionProbability } from "../services/actionService.js";
import { actionCountSchema, actionTypeEnum } from "../schemas/action.schema.js";

export async function handleGetUserActionCount(request, reply) {
  try {
    const { id } = request.params;

    // If user id is not valid return error
    if (isNaN(id) || id < 0) {
      return reply.code(400).send({ error: "User ID is required" });
    }

    const result = await getUserActionCount(id);

    const validatedResult = actionCountSchema.parse(result);

    if (!validatedResult) {
      return reply.code(400).send({ error: "Invalid result" });
    }

    return reply.code(200).send(validatedResult);
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

    const parsedActionType = actionTypeEnum.safeParse(actionType);

    if (!parsedActionType.success) {
      return reply.code(400).send({
        error: "Invalid action type",
        validActions: actionTypeEnum.options,
      });
    }

    const probabilities = await calculateNextActionProbability(actionType);

    return reply.code(200).send(probabilities);
  } catch (error) {
    console.error("Error calculating action probabilities:", error);
    return reply.code(500).send({ error: "Internal server error" });
  }
}
