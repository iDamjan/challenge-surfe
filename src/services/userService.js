import userRepository from "../repositories/userRepository.js";

/**
 * @description Get the user by id
 * @param {number} userId
 * @returns {Promise<User>}
 */
export async function getUserById(userId) {
  return await userRepository.findById(userId);
}
