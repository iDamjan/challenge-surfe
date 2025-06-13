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

export async function getAllUsers() {
  const users = await userRepository.findAll();
  const validatedUsers = userListSchema.parse(users);
  return validatedUsers;
}

export async function createUser(userData) {
  return await userRepository.create(userData);
}

export async function updateUser(userId, userData) {
  const updatedUser = await userRepository.update(userId, userData);
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
}

export async function deleteUser(userId) {
  const result = await userRepository.delete(userId);
  if (!result) {
    throw new Error("User not found");
  }
  return true;
}
