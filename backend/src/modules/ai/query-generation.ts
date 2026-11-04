import { z } from "zod";

export const queryGenerationOutputSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("query"),
      sql: z.string().trim().min(1),
      explanation: z.string().trim().min(1),
      assumptions: z.array(z.string().trim().min(1)).max(10),
    })
    .strict(),
  z
    .object({
      type: z.literal("refusal"),
      reason: z.string().trim().min(1),
    })
    .strict(),
]);

export type QueryGenerationOutput = z.output<
  typeof queryGenerationOutputSchema
>;
