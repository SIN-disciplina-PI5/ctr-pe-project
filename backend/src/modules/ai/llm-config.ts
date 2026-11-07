import { z } from "zod";
import { GroqProvider } from "./groq-provider.js";
import type { LlmObserver, LlmProvider } from "./llm-provider.js";

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
export const DEFAULT_LLM_TIMEOUT_MS = 30_000;

const llmEnvironmentSchema = z.object({
  GROQ_API_KEY: z.string().trim().min(1, "GROQ_API_KEY não definida."),
  GROQ_MODEL: z.string().trim().min(1).default(DEFAULT_GROQ_MODEL),
  AI_LLM_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(120_000)
    .default(DEFAULT_LLM_TIMEOUT_MS),
});

export interface LlmConfig {
  readonly apiKey: string;
  readonly model: string;
  readonly timeoutMs: number;
}

export function loadLlmConfig(
  environment: NodeJS.ProcessEnv = process.env,
): LlmConfig {
  if (!environment["GROQ_API_KEY"]?.trim()) {
    throw new Error("GROQ_API_KEY não definida.");
  }

  const parsed = llmEnvironmentSchema.parse(environment);
  return {
    apiKey: parsed.GROQ_API_KEY,
    model: parsed.GROQ_MODEL,
    timeoutMs: parsed.AI_LLM_TIMEOUT_MS,
  };
}

export function createLlmProvider(
  config: LlmConfig = loadLlmConfig(),
  observer?: LlmObserver,
): LlmProvider {
  return new GroqProvider({
    ...config,
    ...(observer === undefined ? {} : { observer }),
  });
}
