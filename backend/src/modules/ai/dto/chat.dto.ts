import { z } from "zod";

export const chatDto = z
  .object({
    message: z.string().trim().min(3).max(2_000),
    conversationId: z.string().trim().min(10).max(64).optional(),
  })
  .strict();

export type ChatDto = z.infer<typeof chatDto>;
