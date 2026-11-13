import { describe, expect, it } from "@jest/globals";
import {
  DEFAULT_GROQ_MODEL,
  DEFAULT_LLM_TIMEOUT_MS,
  DEFAULT_ORCHESTRATOR_MODEL,
  loadLlmConfig,
  createLlmProvider,
  createOrchestratorProvider,
} from "./llm-config.js";


describe("configuração do provedor LLM", () => {
  it("usa modelos e timeout conhecidos por padrão", () => {
    expect(loadLlmConfig({ GROQ_API_KEY: "test-key" })).toEqual({
      apiKey: "test-key",
      model: DEFAULT_GROQ_MODEL,
      orchestratorModel: DEFAULT_ORCHESTRATOR_MODEL,
      timeoutMs: DEFAULT_LLM_TIMEOUT_MS,
    });
  });

  it("aceita modelos e timeout configurados", () => {
    expect(
      loadLlmConfig({
        GROQ_API_KEY: "test-key",
        GROQ_MODEL: "modelo-alternativo",
        GROQ_ORCHESTRATOR_MODEL: "modelo-orquestrador",
        AI_LLM_TIMEOUT_MS: "15000",
      }),
    ).toEqual({
      apiKey: "test-key",
      model: "modelo-alternativo",
      orchestratorModel: "modelo-orquestrador",
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

  it("cria o provider principal com o modelo 120B", () => {
    const config = loadLlmConfig({ GROQ_API_KEY: "test-key" });

    const provider = createLlmProvider(config);

    expect(provider).toBeDefined();
    expect(provider.constructor.name).toBe("GroqProvider");
  });

  it("cria o provider do Orchestrator com o modelo 20B", () => {
    const config = loadLlmConfig({ GROQ_API_KEY: "test-key" });

    const provider = createOrchestratorProvider(config);

    expect(provider).toBeDefined();
    expect(provider.constructor.name).toBe("GroqProvider");
  });
});