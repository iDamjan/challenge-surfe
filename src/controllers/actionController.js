import { getUserActionCount } from "../services/actionService.js";
import { calculateNextActionProbability } from "../services/actionService.js";
import { actionCountSchema, actionTypeEnum } from "../schemas/action.schema.js";
import { ResponseHelpers } from "../errors/customErrors.js";
import responseHandler from "../utils/responseHandler.js";

/**
 * @description Get the action count for a user
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function handleGetUserActionCount(request, reply) {
  try {
    const { id } = request.params;
    const userId = parseInt(id);

    // Validate user ID
    if (isNaN(userId) || userId < 0) {
      return ResponseHelpers.validationError(
        reply,
        "User ID must be a positive number",
        "id"
      );
    }

    const count = await getUserActionCount(userId);
    const validatedCount = actionCountSchema.parse(count);

    return responseHandler(reply, validatedCount);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetUserActionCount"
    );
  }
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function handleGetNextActionProbability(request, reply) {
  try {
    const { actionType } = request.params;

    const parsedActionType = actionTypeEnum.safeParse(actionType);

    if (!parsedActionType.success) {
      return ResponseHelpers.badRequest(reply, "Invalid action type", {
        validActions: actionTypeEnum.options,
      });
    }

    const probabilities = await calculateNextActionProbability(actionType);

    return responseHandler(reply, probabilities);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetNextActionProbability"
    );
  }
}
