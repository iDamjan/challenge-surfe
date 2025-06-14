import userRepository from "../repositories/userRepository.js";
import { userSchema, userListSchema } from "../schemas/user.schema.js";

export async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  console.log(user);
  const validatedUser = userSchema.parse(user);

  if (!validatedUser) {
    throw new Error("User not found");
  }

  return validatedUser;
}

export async function getTotalReferredUsers() {
  const totalReferredUsers = await userRepository.findAll();
  return totalReferredUsers;
}
