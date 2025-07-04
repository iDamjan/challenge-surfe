import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
});

export const userListSchema = z.array(userSchema);

// Note: we can create other user schemas here for creating, deleting and updating a user
