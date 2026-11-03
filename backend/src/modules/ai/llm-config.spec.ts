import { describe, expect, it } from "@jest/globals";
import {
  DEFAULT_GROQ_MODEL,
  DEFAULT_LLM_TIMEOUT_MS,
  loadLlmConfig,
} from "./llm-config.js";

describe("configuração do provedor LLM", () => {
  it("usa modelo 120B e timeout conhecidos por padrão", () => {
    expect(loadLlmConfig({ GROQ_API_KEY: "test-key" })).toEqual({
      apiKey: "test-key",
      model: DEFAULT_GROQ_MODEL,
      timeoutMs: DEFAULT_LLM_TIMEOUT_MS,
    });
  });

  it("aceita modelo e timeout configurados", () => {
    expect(
      loadLlmConfig({
        GROQ_API_KEY: "test-key",
        GROQ_MODEL: "modelo-alternativo",
        AI_LLM_TIMEOUT_MS: "15000",
      }),
    ).toEqual({
      apiKey: "test-key",
      model: "modelo-alternativo",
      timeoutMs: 15_000,
    });
  });

  it("recusa chave ausente", () => {
    expect(() => loadLlmConfig({})).toThrow("GROQ_API_KEY não definida.");
  });

  it("recusa timeout fora do intervalo seguro", () => {
    expect(() =>
      loadLlmConfig({
        GROQ_API_KEY: "test-key",
        AI_LLM_TIMEOUT_MS: "500",
      }),
    ).toThrow();
  });
});
