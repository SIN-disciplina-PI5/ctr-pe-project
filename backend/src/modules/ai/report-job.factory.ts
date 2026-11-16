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
import { loadQStashPublishConfig } from "./report-job.qstash-config.js";
import { QStashReportJobDispatcher } from "./report-job.qstash-dispatcher.js";
import { ReportJobRepository } from "./report-job.repository.js";
import { ReportJobService } from "./report-job.service.js";
import { TriggerDevReportJobDispatcher } from "./report-job.trigger-dispatcher.js";
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
 * Ponto único de troca do gatilho. REPORT_JOB_DISPATCHER seleciona QStash,
 * Trigger.dev ou o processamento manual.
 */
export function createReportJobDispatcher(
  environment: NodeJS.ProcessEnv = process.env,
): ReportJobDispatcher {
  const mode = environment["REPORT_JOB_DISPATCHER"]?.trim() || "manual";
  if (mode === "qstash") {
    return new QStashReportJobDispatcher(loadQStashPublishConfig(environment));
  }
  if (mode === "trigger") return new TriggerDevReportJobDispatcher();
  if (mode === "manual") return new ManualReportJobDispatcher();
  throw new Error("REPORT_JOB_DISPATCHER deve ser 'manual', 'qstash' ou 'trigger'.");
}

export function createReportJobService(
  environment: NodeJS.ProcessEnv = process.env,
): ReportJobService {
  const maxAttempts = optionalPositiveInteger(
    environment,
    "REPORT_JOB_MAX_ATTEMPTS",
  );
  // O storage só é criado no primeiro download: criar, consultar e listar
  // relatórios não dependem do token do Vercel Blob.
  let fileService: ReportFileService | undefined;
  const downloads: Pick<ReportFileService, "getDownload"> = {
    getDownload: (id, scope) => {
      fileService ??= new ReportFileService(
        createReportStorage(environment),
        new ReportFileRepository(),
      );
      return fileService.getDownload(id, scope);
    },
  };

  return new ReportJobService(
    new ReportJobRepository(),
    createReportJobDispatcher(environment),
    downloads,
    maxAttempts === undefined ? {} : { maxAttempts },
  );
}

export function createReportJobProcessor(
  environment: NodeJS.ProcessEnv = process.env,
  overrides: { readonly leaseMs?: number } = {},
): ReportJobProcessor {
  const config = loadLlmConfig(environment);
  const provider = createLlmProvider(config, new ConsoleLlmObserver());
  const queryAgent = new QueryAgentService(
    new QueryGenerationService(provider),
    createQueryExecutor(),
    new QueryAnswerService(provider),
  );
  const leaseMs =
    overrides.leaseMs ?? optionalPositiveInteger(environment, "REPORT_JOB_LEASE_MS");

  return new ReportJobProcessor(
    new ReportJobRepository(),
    new ReportAgentService(provider, queryAgent),
    new PdfReportRenderer(),
    new ReportFileService(
      createReportStorage(environment),
      new ReportFileRepository(),
    ),
    createReportJobDispatcher(environment),
    leaseMs === undefined ? {} : { leaseMs },
  );
}
