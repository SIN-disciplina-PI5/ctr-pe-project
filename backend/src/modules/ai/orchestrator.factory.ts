import { ConsoleLlmObserver } from "./llm-console-observer.js";
import {
  createLlmProvider,
  createOrchestratorProvider,
  loadLlmConfig,
} from "./llm-config.js";
import { OrchestratorClassifierService } from "./orchestrator-classifier.service.js";
import { OrchestratorService } from "./orchestrator.service.js";
import { QueryAgentService } from "./query-agent.service.js";
import { QueryAnswerService } from "./query-answer.service.js";
import { createQueryExecutor } from "./query-executor.js";
import { QueryGenerationService } from "./query-generation.service.js";
import { ReportAgentService } from "./report-agent.service.js";

const llmObserver = new ConsoleLlmObserver();

export function createOrchestratorService(): OrchestratorService {
  const config = loadLlmConfig();

  const queryProvider = createLlmProvider(config, llmObserver);
  const orchestratorProvider = createOrchestratorProvider(config, llmObserver);

  const queryAgent = new QueryAgentService(
    new QueryGenerationService(queryProvider),
    createQueryExecutor(),
    new QueryAnswerService(queryProvider),
  );

  const classifier = new OrchestratorClassifierService(orchestratorProvider);

  const reportAgent = new ReportAgentService(queryProvider, queryAgent);

  return new OrchestratorService(classifier, queryAgent, reportAgent);
}
