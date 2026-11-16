import { logger, queue, schedules, task } from "@trigger.dev/sdk";
import { createReportJobProcessor } from "../modules/ai/report-job.factory.js";
import type { ReportJobProcessor } from "../modules/ai/report-job.processor.js";

/** Tempo máximo de uma geração de relatório no Trigger.dev. */
const GENERATE_MAX_DURATION_S = 900;

/**
 * Concorrência baixa de propósito: cada relatório faz várias chamadas ao
 * Groq e consultas ao banco. Ajuste conforme os limites do provedor.
 */
export const reportJobsQueue = queue({ name: "report-jobs", concurrencyLimit: 2 });

let processor: ReportJobProcessor | undefined;

function getProcessor(): ReportJobProcessor {
  // O lease precisa exceder a duração máxima da task para que a varredura
  // não reassuma um job que ainda está rodando.
  processor ??= createReportJobProcessor(process.env, {
    leaseMs: (GENERATE_MAX_DURATION_S + 60) * 1000,
  });
  return processor;
}

export const generateReportTask = task({
  id: "generate-report",
  queue: reportJobsQueue,
  maxDuration: GENERATE_MAX_DURATION_S,
  // Retry de negócio (LLM, storage) é do nosso núcleo, com estado no banco.
  // Aqui só repetimos quando a própria task falha (ex.: banco indisponível
  // no claim); runJob é idempotente, então repetir é seguro.
  retry: { maxAttempts: 2, minTimeoutInMs: 10_000, maxTimeoutInMs: 60_000, factor: 2 },
  run: async (payload: { jobId: string }) => {
    const outcome = await getProcessor().runJob(payload.jobId);
    logger.info("report_job_outcome", { ...outcome });
    return outcome;
  },
});

export const reportJobsSweepTask = schedules.task({
  id: "report-jobs-sweep",
  cron: "*/5 * * * *",
  maxDuration: 120,
  run: async () => {
    const summary = await getProcessor().dispatchAvailable(20);
    logger.info("report_jobs_sweep", { ...summary });
    return summary;
  },
});
