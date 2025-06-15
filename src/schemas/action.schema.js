import { z } from "zod";

export const actionTypeEnum = z.enum([
  "EDIT_CONTACT",
  "ADD_CONTACT",
  "VIEW_CONTACTS",
  "CONNECT_CRM",
  "WELCOME",
  "REFER_USER",
]);

export const actionSchema = z.object({
  id: z.number(),
  type: actionTypeEnum,
  userId: z.number(),
  createdAt: z.string(),
});

export const actionCountSchema = z.object({
  count: z.number().min(0),
});
