import { describe, expect, it } from "@jest/globals";
import {
  ConsoleLlmObserver,
  type LlmLogSink,
} from "./llm-console-observer.js";
import type { LlmObservation } from "./llm-provider.js";

class FakeSink implements LlmLogSink {
  readonly infoMessages: string[] = [];
  readonly errorMessages: string[] = [];

  info(message: string): void {
    this.infoMessages.push(message);
  }

  error(message: string): void {
    this.errorMessages.push(message);
  }
}

describe("ConsoleLlmObserver", () => {
  it("registra sucesso em uma linha JSON com latência e tokens", () => {
    const sink = new FakeSink();
    const observer = new ConsoleLlmObserver(sink);

    observer.record({
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "success",
      latencyMs: 125,
      inputTokens: 40,
      outputTokens: 12,
      totalTokens: 52,
    });

    expect(sink.errorMessages).toEqual([]);
    expect(sink.infoMessages).toHaveLength(1);
    expect(JSON.parse(sink.infoMessages[0]!)).toEqual({
      component: "ai.llm",
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "success",
      latencyMs: 125,
      inputTokens: 40,
      outputTokens: 12,
      totalTokens: 52,
    });
  });

  it("registra somente o código seguro quando ocorre erro", () => {
    const sink = new FakeSink();
    const observer = new ConsoleLlmObserver(sink);

    observer.record({
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "error",
      latencyMs: 30_000,
      errorCode: "TIMEOUT",
    });

    expect(sink.infoMessages).toEqual([]);
    expect(sink.errorMessages).toHaveLength(1);
    expect(JSON.parse(sink.errorMessages[0]!)).toEqual({
      component: "ai.llm",
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "error",
      latencyMs: 30_000,
      errorCode: "TIMEOUT",
    });
  });

  it("ignora conteúdo sensível mesmo quando recebe propriedades extras", () => {
    const sink = new FakeSink();
    const observer = new ConsoleLlmObserver(sink);
    const observation = {
      operation: "generate_structured",
      provider: "groq",
      model: "openai/gpt-oss-120b",
      status: "success",
      latencyMs: 10,
      inputTokens: 1,
      outputTokens: 1,
      totalTokens: 2,
      apiKey: "segredo",
      prompt: "pergunta sensível",
      sql: "SELECT dado_sensivel",
      rows: [{ dado: "sensível" }],
    } as LlmObservation & Record<string, unknown>;

    observer.record(observation);

    const entry = JSON.parse(sink.infoMessages[0]!) as Record<
      string,
      unknown
    >;
    expect(entry).not.toHaveProperty("apiKey");
    expect(entry).not.toHaveProperty("prompt");
    expect(entry).not.toHaveProperty("sql");
    expect(entry).not.toHaveProperty("rows");
    expect(sink.infoMessages[0]).not.toContain("segredo");
    expect(sink.infoMessages[0]).not.toContain("sensível");
  });
});
