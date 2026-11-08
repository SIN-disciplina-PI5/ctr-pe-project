
import type { LlmProvider } from "./llm-provider.js";
import {
  validateOrchestratorIntent,
  orchestratorIntentSchema,
  type OrchestratorIntent,
} from "./orchestrator.js";
import { ORCHESTRATOR_SYSTEM_PROMPT } from "./orchestrator-prompts.config.js";

export interface ConversationTurn {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface ClassifyIntentInput {
  readonly message: string;
  readonly history?: readonly ConversationTurn[];
}

export class OrchestratorClassifierService {
  constructor(private readonly provider: LlmProvider) {}

  async classify(input: ClassifyIntentInput): Promise<OrchestratorIntent> {
    const MAX_HISTORY_TURNS = 10;
    const history = (input.history ?? []).slice(-(MAX_HISTORY_TURNS * 2));

    const userPrompt = [
      "Histórico da conversa:",
      JSON.stringify(history),
      "",
      "Mensagem atual do usuário:",
      JSON.stringify(input.message),
      "",
      "Classifique a intenção considerando o histórico e a mensagem atual.",
    ].join("\n");

    const result = await this.provider.generateStructured({
      schemaName: "ctrpe_orchestrator_intent",
      schema: orchestratorIntentSchema,
      systemPrompt: ORCHESTRATOR_SYSTEM_PROMPT,
      userPrompt,
    });

    return validateOrchestratorIntent(result.data);
  }
}
