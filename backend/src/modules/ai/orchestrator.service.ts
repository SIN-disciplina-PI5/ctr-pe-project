import type {
  QueryAgentResult,
  QueryAgentService,
} from "./query-agent.service.js";
import type { OrchestratorClassifierService } from "./orchestrator-classifier.service.js";
import type { ConversationTurn } from "./orchestrator-classifier.service.js";
import type { GenerationMetrics } from "./query-generation.service.js";

interface OrchestratorMetrics {
  readonly classificationMetrics: GenerationMetrics | null;
}

export interface OrchestratorInput {
  readonly message: string;
  readonly empresaId: string;
  readonly history?: readonly ConversationTurn[];
}

export type OrchestratorResult =
  | (OrchestratorMetrics & {
      readonly status: "answered";
      readonly intent: "data_question";
      readonly result: Extract<QueryAgentResult, { status: "answered" }>;
    })
  | (OrchestratorMetrics & {
      readonly status: "refused";
      readonly intent: "data_question";
      readonly result: Extract<QueryAgentResult, { status: "refused" }>;
    })
  | (OrchestratorMetrics & {
      readonly status: "report_pending";
      readonly intent: "report_request";
      readonly message: string;
    })
  | (OrchestratorMetrics & {
      readonly status: "clarification";
      readonly intent: "unclear";
      readonly message: string;
    })
  | (OrchestratorMetrics & {
      readonly status: "refused";
      readonly intent: "write_request" | "out_of_domain";
      readonly message: string;
    });

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
    const classificationMetrics = classification.metrics ?? null;

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
            classificationMetrics,
          };
        }

        return {
          status: "answered",
          intent: "data_question",
          result,
          classificationMetrics,
        };
      }

      case "report_request":
        return {
          status: "report_pending",
          intent: "report_request",
          message:
            "A funcionalidade de geração de relatórios ainda não está disponível.",
          classificationMetrics,
        };

      case "unclear":
        return {
          status: "clarification",
          intent: "unclear",
          message:
            classification.clarification ?? "Pode esclarecer sua solicitação?",
          classificationMetrics,
        };

      case "write_request":
      case "out_of_domain":
        return {
          status: "refused",
          intent: classification.intent,
          message:
            classification.refusalReason ??
            "Não posso atender a essa solicitação.",
          classificationMetrics,
        };
    }
  }
}
