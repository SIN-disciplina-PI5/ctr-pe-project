import { z } from "zod";

export const QuestionCategorySchema = z.enum([
  "direct",
  "multi-step",
  "text-content",
  "ambiguous",
  "refused"
]);

export const ExpectedResultSchema = z.object({
  pattern: z.string().describe("Padrão de texto ou Regex que deve constar na resposta"),
  shouldRefuse: z.boolean().default(false).describe("Se o agente deve se recusar a responder (segurança/fora de escopo)"),
});

export const EvaluationQuestionSchema = z.object({
  id: z.string(),
  category: QuestionCategorySchema,
  prompt: z.string(),
  expectedResult: ExpectedResultSchema,
});

export const EvaluationRunResultSchema = z.object({
  questionId: z.string(),
  category: QuestionCategorySchema,
  success: z.boolean(),
  latencyMs: z.number(),
  actualResponse: z.string(),
  errorMessage: z.string().optional(),
});

export type QuestionCategory = z.infer<typeof QuestionCategorySchema>;
export type ExpectedResult = z.infer<typeof ExpectedResultSchema>;
export type EvaluationQuestion = z.infer<typeof EvaluationQuestionSchema>;
export type EvaluationRunResult = z.infer<typeof EvaluationRunResultSchema>;