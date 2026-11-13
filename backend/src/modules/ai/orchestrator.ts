import { z } from "zod";
import { LlmProviderError } from "./llm-provider.js";

export const orchestratorIntentSchema = z
  .object({
    intent: z.enum([
      "data_question",
      "report_request",
      "unclear",
      "write_request",
      "out_of_domain",
    ]),
    contextualizedQuestion: z.string().nullable(),
    clarification: z.string().nullable(),
    refusalReason: z.string().nullable(),
  })
  .strict();

export type OrchestratorIntent = z.infer<
  typeof orchestratorIntentSchema
>;

export function validateOrchestratorIntent(
  value: OrchestratorIntent,
): OrchestratorIntent {
  const hasContent = (content: string | null): boolean =>
    content !== null && content.trim().length > 0;

  const invalidResponse = (): never => {
    throw new LlmProviderError(
      "INVALID_RESPONSE",
      "O classificador retornou uma intenção inconsistente.",
    );
  };

  switch (value.intent) {
    case "data_question":
      if (
        !hasContent(value.contextualizedQuestion) ||
        value.clarification !== null ||
        value.refusalReason !== null
      ) {
        invalidResponse();
      }
      break;

    case "report_request":
      if (
        value.contextualizedQuestion !== null ||
        value.clarification !== null ||
        value.refusalReason !== null
      ) {
        invalidResponse();
      }
      break;

    case "unclear":
      if (
        !hasContent(value.clarification) ||
        value.contextualizedQuestion !== null ||
        value.refusalReason !== null
      ) {
        invalidResponse();
      }
      break;

    case "write_request":
    case "out_of_domain":
      if (
        !hasContent(value.refusalReason) ||
        value.contextualizedQuestion !== null ||
        value.clarification !== null
      ) {
        invalidResponse();
      }
      break;
  }

  return value;
}