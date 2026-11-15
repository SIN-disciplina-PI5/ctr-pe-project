import { randomUUID } from "node:crypto";
import type { ReportAgent } from "./report-agent.service.js";
import type { ReportFileService } from "./report-file.service.js";
import type { ReportJobDispatcher } from "./report-job.dispatcher.js";
import {
  classifyJobError,
  DEFAULT_RETRY_POLICY,
  retryDelayMs,
  type ReportJobRecord,
  type ReportJobRepositoryPort,
  type RetryPolicy,
} from "./report-job.types.js";
import type { ReportRenderer } from "./report-renderer.service.js";

/**
 * O lease precisa ser maior que a duração máxima de quem executa o job.
 * No plano Hobby da Vercel a função é encerrada em 300 s; 330 s garante que
 * nenhum outro worker reassuma um job que ainda pode estar rodando.
 */
const DEFAULT_LEASE_MS = 330_000;
const DEFAULT_RUN_LIMIT = 5;

export type ReportJobRunOutcome =
  | { readonly status: "done"; readonly jobId: string; readonly arquivoId: string }
  | {
      readonly status: "retry_scheduled";
      readonly jobId: string;
      readonly nextAttemptAt: Date;
    }
  | { readonly status: "failed"; readonly jobId: string; readonly errorCode: string }
  | {
      readonly status: "skipped";
      readonly jobId: string;
      readonly reason: "not_claimable" | "lease_lost";
    };

export interface RunAvailableOptions {
  readonly limit?: number;
  /** Não inicia novos jobs depois deste tempo (ms), para caber no runtime. */
  readonly budgetMs?: number;
}

export interface RunAvailableSummary {
  readonly recovered: { readonly requeued: number; readonly failed: number };
  readonly outcomes: readonly ReportJobRunOutcome[];
}

export interface DispatchAvailableSummary {
  readonly recovered: { readonly requeued: number; readonly failed: number };
  readonly dispatched: number;
  readonly failed: number;
}

export interface ReportJobProcessorOptions {
  readonly leaseMs?: number;
  readonly retryPolicy?: RetryPolicy;
  readonly now?: () => Date;
  readonly createLeaseToken?: () => string;
  readonly logger?: Pick<Console, "info" | "error">;
}

export class ReportJobProcessor {
  private readonly leaseMs: number;
  private readonly retryPolicy: RetryPolicy;
  private readonly now: () => Date;
  private readonly createLeaseToken: () => string;
  private readonly logger: Pick<Console, "info" | "error">;

  constructor(
    private readonly repository: ReportJobRepositoryPort,
    private readonly reportAgent: ReportAgent,
    private readonly renderer: ReportRenderer,
    private readonly fileService: Pick<ReportFileService, "store" | "discard">,
    private readonly dispatcher: ReportJobDispatcher,
    options: ReportJobProcessorOptions = {},
  ) {
    this.leaseMs = options.leaseMs ?? DEFAULT_LEASE_MS;
    this.retryPolicy = options.retryPolicy ?? DEFAULT_RETRY_POLICY;
    this.now = options.now ?? (() => new Date());
    this.createLeaseToken = options.createLeaseToken ?? randomUUID;
    this.logger = options.logger ?? console;

    if (!Number.isInteger(this.leaseMs) || this.leaseMs <= 0) {
      throw new Error("leaseMs deve ser um inteiro positivo.");
    }
  }

  /**
   * Executa um job específico. É seguro chamar mais de uma vez para o mesmo
   * ID (entrega duplicada do gatilho): só quem fizer o claim executa.
   */
  async runJob(jobId: string): Promise<ReportJobRunOutcome> {
    const claimedAt = this.now();
    const leaseToken = this.createLeaseToken();
    const job = await this.repository.claim(jobId, {
      now: claimedAt,
      leaseToken,
      leaseAte: new Date(claimedAt.getTime() + this.leaseMs),
    });

    if (!job) {
      this.log("info", "claim_skipped", { jobId });
      return { status: "skipped", jobId, reason: "not_claimable" };
    }

    this.log("info", "job_started", { jobId, attempt: job.tentativas });

    try {
      return await this.execute(job, leaseToken);
    } catch (error) {
      return this.handleFailure(job, leaseToken, error);
    }
  }

  /**
   * Recupera leases vencidos e executa jobs disponíveis em sequência. Serve
   * como varredura de segurança e como worker manual enquanto o gatilho
   * definitivo não existe.
   */
  async runAvailable(
    options: RunAvailableOptions = {},
  ): Promise<RunAvailableSummary> {
    const limit = options.limit ?? DEFAULT_RUN_LIMIT;
    const startedAt = this.now().getTime();
    const recovered = await this.repository.recoverExpired(this.now());
    const ids = await this.repository.findRunnableIds(this.now(), limit);
    const outcomes: ReportJobRunOutcome[] = [];

    for (const id of ids) {
      if (
        options.budgetMs !== undefined &&
        this.now().getTime() - startedAt >= options.budgetMs
      ) {
        break;
      }
      outcomes.push(await this.runJob(id));
    }

    return { recovered, outcomes };
  }

  /**
   * Varredura de segurança para gatilhos externos: recupera leases vencidos e
   * dispara de novo os jobs prontos, sem executá-los aqui. Cobre disparos
   * perdidos (ex.: falha de rede ao chamar o gatilho na criação do pedido).
   */
  async dispatchAvailable(limit = DEFAULT_RUN_LIMIT): Promise<DispatchAvailableSummary> {
    const recovered = await this.repository.recoverExpired(this.now());
    const ids = await this.repository.findRunnableIds(this.now(), limit);
    let dispatched = 0;
    let failed = 0;

    for (const jobId of ids) {
      try {
        await this.dispatcher.dispatch({ jobId, reason: "sweep" });
        dispatched += 1;
      } catch {
        failed += 1;
        this.log("error", "dispatch_failed", { jobId, reason: "sweep" });
      }
    }

    return { recovered, dispatched, failed };
  }

  private async execute(
    job: ReportJobRecord,
    leaseToken: string,
  ): Promise<ReportJobRunOutcome> {
    const report = await this.reportAgent.generate({
      request: job.solicitacao,
      empresaId: job.empresaId,
    });
    const companyName =
      (await this.repository.findCompanyName(job.empresaId)) ?? "";
    const file = await this.renderer.render({
      report,
      companyName,
      generatedAt: this.now(),
    });
    const stored = await this.fileService.store({
      empresaId: job.empresaId,
      usuarioId: job.usuarioId,
      reportType: report.reportType,
      title: report.title,
      file,
    });

    let completed: boolean;
    try {
      completed = await this.repository.markDone(
        job.id,
        leaseToken,
        stored.id,
        this.now(),
      );
    } catch (error) {
      await this.discardQuietly(job.id, stored);
      throw error;
    }

    if (!completed) {
      // Outro worker reassumiu o job após o lease vencer; este resultado é
      // descartado para não deixar dois PDFs para o mesmo pedido.
      await this.discardQuietly(job.id, stored);
      this.log("info", "lease_lost", { jobId: job.id });
      return { status: "skipped", jobId: job.id, reason: "lease_lost" };
    }

    this.log("info", "job_done", { jobId: job.id, arquivoId: stored.id });
    return { status: "done", jobId: job.id, arquivoId: stored.id };
  }

  private async handleFailure(
    job: ReportJobRecord,
    leaseToken: string,
    error: unknown,
  ): Promise<ReportJobRunOutcome> {
    const classified = classifyJobError(error);
    const jobError = { code: classified.code, message: classified.message };
    const canRetry =
      classified.retryable && job.tentativas < job.maxTentativas;

    this.log("error", "job_attempt_failed", {
      jobId: job.id,
      attempt: job.tentativas,
      errorCode: classified.code,
      retryable: classified.retryable,
      cause: error instanceof Error ? error.name : typeof error,
    });

    if (canRetry) {
      const delayMs = retryDelayMs(job.tentativas, this.retryPolicy);
      const nextAttemptAt = new Date(this.now().getTime() + delayMs);
      const scheduled = await this.repository.scheduleRetry(
        job.id,
        leaseToken,
        nextAttemptAt,
        jobError,
      );
      if (!scheduled) {
        return { status: "skipped", jobId: job.id, reason: "lease_lost" };
      }

      try {
        await this.dispatcher.dispatch({
          jobId: job.id,
          delayMs,
          attempt: job.tentativas,
          reason: "retry",
        });
      } catch {
        // O job está QUEUED com disponivelEm; a varredura o encontra.
        this.log("error", "dispatch_failed", { jobId: job.id });
      }
      return { status: "retry_scheduled", jobId: job.id, nextAttemptAt };
    }

    const failed = await this.repository.markFailed(
      job.id,
      leaseToken,
      jobError,
      this.now(),
    );
    if (!failed) {
      return { status: "skipped", jobId: job.id, reason: "lease_lost" };
    }
    return { status: "failed", jobId: job.id, errorCode: classified.code };
  }

  private async discardQuietly(
    jobId: string,
    stored: Parameters<ReportFileService["discard"]>[0],
  ): Promise<void> {
    try {
      await this.fileService.discard(stored);
    } catch {
      this.log("error", "discard_failed", { jobId, arquivoId: stored.id });
    }
  }

  private log(
    level: "info" | "error",
    event: string,
    data: Record<string, unknown>,
  ): void {
    this.logger[level](
      JSON.stringify({ component: "ai.report-jobs", event, ...data }),
    );
  }
}
