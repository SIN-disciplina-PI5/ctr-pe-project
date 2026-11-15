import { ConsoleLlmObserver } from "./llm-console-observer.js";
import { createLlmProvider, loadLlmConfig } from "./llm-config.js";
import { QueryAgentService } from "./query-agent.service.js";
import { QueryAnswerService } from "./query-answer.service.js";
import { createQueryExecutor } from "./query-executor.js";
import { QueryGenerationService } from "./query-generation.service.js";
import { ReportAgentService } from "./report-agent.service.js";
import { ReportFileRepository } from "./report-file.repository.js";
import { ReportFileService } from "./report-file.service.js";
import {
  ManualReportJobDispatcher,
  type ReportJobDispatcher,
} from "./report-job.dispatcher.js";
import { ReportJobProcessor } from "./report-job.processor.js";
import { ReportJobRepository } from "./report-job.repository.js";
import { ReportJobService } from "./report-job.service.js";
import { PdfReportRenderer } from "./report-renderer.service.js";
import { createReportStorage } from "./report-storage.js";

function optionalPositiveInteger(
  environment: NodeJS.ProcessEnv,
  name: string,
): number | undefined {
  const raw = environment[name]?.trim();
  if (!raw) return undefined;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} deve ser um inteiro positivo.`);
  }
  return value;
}

/**
 * Ponto único de troca do gatilho: quando a decisão de processamento for
 * tomada, basta devolver o adaptador escolhido aqui.
 */
export function createReportJobDispatcher(): ReportJobDispatcher {
  return new ManualReportJobDispatcher();
}

export function createReportJobService(
  environment: NodeJS.ProcessEnv = process.env,
): ReportJobService {
  const maxAttempts = optionalPositiveInteger(
    environment,
    "REPORT_JOB_MAX_ATTEMPTS",
  );
  return new ReportJobService(
    new ReportJobRepository(),
    createReportJobDispatcher(),
    maxAttempts === undefined ? {} : { maxAttempts },
  );
}

export function createReportJobProcessor(
  environment: NodeJS.ProcessEnv = process.env,
): ReportJobProcessor {
  const config = loadLlmConfig(environment);
  const provider = createLlmProvider(config, new ConsoleLlmObserver());
  const queryAgent = new QueryAgentService(
    new QueryGenerationService(provider),
    createQueryExecutor(),
    new QueryAnswerService(provider),
  );
  const leaseMs = optionalPositiveInteger(environment, "REPORT_JOB_LEASE_MS");

  return new ReportJobProcessor(
    new ReportJobRepository(),
    new ReportAgentService(provider, queryAgent),
    new PdfReportRenderer(),
    new ReportFileService(
      createReportStorage(environment),
      new ReportFileRepository(),
    ),
    createReportJobDispatcher(),
    leaseMs === undefined ? {} : { leaseMs },
  );
}
