import { getUserById } from "../services/userService.js";
import { calculateReferralIndex } from "../services/referralService.js";
import { ResponseHelpers } from "../errors/customErrors.js";

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

    if (!user) {
      return ResponseHelpers.notFound(reply, "User", userId);
    }

    return ResponseHelpers.success(reply, user);
  } catch (error) {
    return ResponseHelpers.handleError(reply, error, "handleGetUserById");
  }
}

export async function handleGetTotalReferredUsers(request, reply) {
  try {
    const referredUsers = await calculateReferralIndex();
    return ResponseHelpers.success(reply, referredUsers);
  } catch (error) {
    return ResponseHelpers.handleError(
      reply,
      error,
      "handleGetTotalReferredUsers"
    );
  }
}
