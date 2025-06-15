import { getUserActionCount } from "../services/actionService.js";
import { calculateNextActionProbability } from "../services/actionService.js";
import { actionCountSchema, actionTypeEnum } from "../schemas/action.schema.js";
import { ResponseHelpers } from "../errors/customErrors.js";

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

    const result = await getUserActionCount(userId);
    const validatedResult = actionCountSchema.parse(result);

    return ResponseHelpers.success(reply, validatedResult);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetUserActionCount"
    );
  }
}

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

    return ResponseHelpers.success(reply, probabilities);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetNextActionProbability"
    );
  }
}
