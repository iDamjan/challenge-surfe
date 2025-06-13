import actionRepository from "../repositories/actionRepository.js";

export async function getUserActionCount(userId) {
  try {
    const count = await actionRepository.getAllUserActions(userId);
    return { count };
  } catch (error) {
    return { error: "Error counting user actions" };
  }
}
