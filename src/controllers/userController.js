import { getUserById } from "../services/userService.js";
import { calculateReferralIndex } from "../services/referralService.js";
import { ResponseHelpers } from "../errors/customErrors.js";
import { userSchema, referralIndexSchema } from "../schemas/user.schema.js";
import responseHandler from "../utils/responseHandler.js";

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function handleGetUserById(request, reply) {
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

    const user = await getUserById(userId);

    const validatedUser = userSchema.parse(user);

    if (!validatedUser) {
      return ResponseHelpers.notFound(reply, "User", userId);
    }

    return responseHandler(reply, validatedUser);
  } catch (error) {
    return ResponseHelpers.handleError(reply, error, "handleGetUserById");
  }
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
export async function handleGetTotalReferredUsers(request, reply) {
  try {
    const referralIndex = await calculateReferralIndex();

    return responseHandler(reply, referralIndex);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetTotalReferredUsers"
    );
  }
}
