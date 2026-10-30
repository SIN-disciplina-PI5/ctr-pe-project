import { jest } from "@jest/globals";
import type Groq from "groq-sdk";
import { z } from "zod";
import { GroqProvider } from "../../../spikes/text-to-sql/llm-provider.js";

const responseSchema = z.object({
  sql: z.string(),
});

const request = {
  model: "modelo-teste",
  schemaName: "sql_generation",
  schema: responseSchema,
  systemPrompt: "Gere SQL.",
  userPrompt: "Liste ativos.",
};

describe("GroqProvider", () => {
  it("retorna resposta estruturada e métricas", async () => {
    const create = jest.fn(async () => ({
      choices: [{ message: { content: '{"sql":"SELECT 1"}' } }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    }));

    const client = {
      chat: { completions: { create } },
    } as unknown as Groq;

    const provider = new GroqProvider("chave-teste", client);
    const result = await provider.generateStructured(request);

    expect(result).toEqual(
      expect.objectContaining({
        data: { sql: "SELECT 1" },
        provider: "groq",
        model: "modelo-teste",
        inputTokens: 10,
        outputTokens: 5,
        totalTokens: 15,
      }),
    );
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("rejeita resposta incompatível com o schema", async () => {
    const create = jest.fn(async () => ({
      choices: [{ message: { content: '{"sql":123}' } }],
    }));

    const client = {
      chat: { completions: { create } },
    } as unknown as Groq;

    const provider = new GroqProvider("chave-teste", client);

    await expect(provider.generateStructured(request)).rejects.toThrow();
  });

  it("rejeita resposta sem conteúdo", async () => {
    const create = jest.fn(async () => ({
      choices: [{ message: { content: null } }],
    }));

    const client = {
      chat: { completions: { create } },
    } as unknown as Groq;

    const provider = new GroqProvider("chave-teste", client);

    await expect(provider.generateStructured(request)).rejects.toThrow(
      "A Groq não retornou conteúdo.",
    );
  });
});