import userRepository from "../repositories/userRepository.js";

export async function getUserById(userId) {
  return await userRepository.findById(userId);
}
