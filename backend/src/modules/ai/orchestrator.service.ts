import type {
  QueryAgentResult,
  QueryAgentService,
} from "./query-agent.service.js";
import type { OrchestratorClassifierService } from "./orchestrator-classifier.service.js";
import type { ConversationTurn } from "./orchestrator-classifier.service.js";

export interface OrchestratorInput {
  readonly message: string;
  readonly empresaId: string;
  readonly history?: readonly ConversationTurn[];
}

export type OrchestratorResult =
  | {
      readonly status: "answered";
      readonly intent: "data_question";
      readonly result: Extract<QueryAgentResult, { status: "answered" }>;
    }
  | {
      readonly status: "refused";
      readonly intent: "data_question";
      readonly result: Extract<QueryAgentResult, { status: "refused" }>;
    }
  | {
      readonly status: "report_pending";
      readonly intent: "report_request";
      readonly message: string;
    }
  | {
      readonly status: "clarification";
      readonly intent: "unclear";
      readonly message: string;
    }
  | {
      readonly status: "refused";
      readonly intent: "write_request" | "out_of_domain";
      readonly message: string;
    };

export class OrchestratorService {
  constructor(
    private readonly classifier: OrchestratorClassifierService,
    private readonly queryAgent: QueryAgentService,
  ) {}

  async handle(input: OrchestratorInput): Promise<OrchestratorResult> {
    const classification = await this.classifier.classify({
      message: input.message,
      ...(input.history === undefined ? {} : { history: input.history }),
    });

    switch (classification.intent) {
      case "data_question": {
        const result = await this.queryAgent.query({
            question: classification.contextualizedQuestion ?? input.message,
            empresaId: input.empresaId,
        });

        if (result.status === "refused") {
            return {
            status: "refused",
            intent: "data_question",
            result,
            };
        }

        return {
            status: "answered",
            intent: "data_question",
            result,
        };
        }

      case "report_request":
        return {
          status: "report_pending",
          intent: "report_request",
          message:
            "A funcionalidade de geração de relatórios ainda não está disponível.",
        };

      case "unclear":
        return {
          status: "clarification",
          intent: "unclear",
          message:
            classification.clarification ?? "Pode esclarecer sua solicitação?",
        };

      case "write_request":
      case "out_of_domain":
        return {
          status: "refused",
          intent: classification.intent,
          message:
            classification.refusalReason ??
            "Não posso atender a essa solicitação.",
        };
    }
  }
}
