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
      type: z.literal("query_plan"),
      explanation: z.string().trim().min(1),
      assumptions: z.array(z.string().trim().min(1)).max(10),
      steps: z
        .array(
          z
            .object({
              id: z
                .string()
                .trim()
                .regex(/^[a-z][a-z0-9_]{0,39}$/),
              purpose: z.string().trim().min(1),
              sql: z.string().trim().min(1),
            })
            .strict(),
        )
        .min(2)
        .max(3),
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

export const queryCorrectionOutputSchema = z
  .object({
    sql: z.string().trim().min(1),
    explanation: z.string().trim().min(1),
  })
  .strict();

export type QueryCorrectionOutput = z.output<
  typeof queryCorrectionOutputSchema
>;
