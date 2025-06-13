import { getUserById } from "../services/userService.js";

export async function handleGetUserById(request, reply) {
  try {
    const { id } = request.params;
    console.log(id);
    const user = await getUserById(id);

    if (!user) {
      return reply.code(404).send({ error: "User not found" });
    }

    return reply.code(200).send(user);
  } catch (error) {
    return reply.code(500).send({ error: "Internal server error" });
  }
}
