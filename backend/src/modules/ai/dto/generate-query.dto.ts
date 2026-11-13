import { z } from "zod";

export const generateQueryDto = z
  .object({
    question: z.string().trim().min(3).max(1_000),
  })
  .strict();

export type GenerateQueryDto = z.infer<typeof generateQueryDto>;
