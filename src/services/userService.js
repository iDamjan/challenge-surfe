import userRepository from "../repositories/userRepository.js";

/**
 *
 * @param {number} userId
 * @returns {Promise<User>}
 */
export async function getUserById(userId) {
  return await userRepository.findById(userId);
}
