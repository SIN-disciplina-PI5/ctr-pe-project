import Groq from "groq-sdk";
import { z, type output, type ZodType } from "zod";

export interface StructuredGenerationRequest<TSchema extends ZodType> {
  model: string;
  schemaName: string;
  schema: TSchema;
  systemPrompt: string;
  userPrompt: string;
}

export interface StructuredGenerationResult<T> {
  data: T;
  provider: string;
  model: string;
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}

export interface LlmProvider {
  generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>>;
}

export class GroqProvider implements LlmProvider {
  constructor(
    apiKey: string,
    private readonly client = new Groq({ apiKey }),
  ) {}

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    const inicio = performance.now();

    const completion = await this.client.chat.completions.create({
      model: request.model,
      temperature: 0,
      messages: [
        { role: "system", content: request.systemPrompt },
        { role: "user", content: request.userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: request.schemaName,
          strict: true,
          schema: z.toJSONSchema(request.schema),
        },
      },
    });

    const content = completion.choices[0]?.message.content;

    if (!content) {
      throw new Error("A Groq não retornou conteúdo.");
    }

    return {
      data: request.schema.parse(JSON.parse(content)),
      provider: "groq",
      model: request.model,
      latencyMs: Math.round(performance.now() - inicio),
      inputTokens: completion.usage?.prompt_tokens ?? null,
      outputTokens: completion.usage?.completion_tokens ?? null,
      totalTokens: completion.usage?.total_tokens ?? null,
    };
  }
}