import type { GeneratedReport, ReportAgent } from "../report-agent.service.js";
import type { ReportFileRecord } from "../report-file.repository.js";
import type {
  ReportFileService,
  StoreReportFileInput,
} from "../report-file.service.js";
import type {
  DispatchReportJobInput,
  ReportJobDispatcher,
} from "../report-job.dispatcher.js";
import type {
  ClaimReportJobInput,
  CreateReportJobInput,
  ListOwnedReportJobsInput,
  RecoverExpiredSummary,
  ReportJobDetails,
  ReportJobError,
  ReportJobFileSummary,
  ReportJobRecord,
  ReportJobRepositoryPort,
  ReportJobScope,
} from "../report-job.types.js";
import type {
  RenderedReportFile,
  ReportRenderer,
  ReportRendererInput,
} from "../report-renderer.service.js";

type MutableJob = { -readonly [K in keyof ReportJobRecord]: ReportJobRecord[K] };

/**
 * Reproduz a semântica do ReportJobRepository (updates condicionais e
 * fencing por leaseToken) sem banco de dados.
 */
export class InMemoryReportJobRepository implements ReportJobRepositoryPort {
  readonly jobs = new Map<string, MutableJob>();
  /** Resumos de ArquivoRelatorioIA por id, simulando o join do Prisma. */
  readonly files = new Map<string, ReportJobFileSummary>();
  private sequence = 0;

  constructor(private readonly companies: Record<string, string> = {}) {}

  async createOrGetExisting(input: CreateReportJobInput) {
    const existing = [...this.jobs.values()].find(
      (job) =>
        job.empresaId === input.empresaId &&
        job.usuarioId === input.usuarioId &&
        job.chaveIdempotencia === input.chaveIdempotencia,
    );
    if (existing) return { job: { ...existing }, created: false };

    this.sequence += 1;
    const job: MutableJob = {
      id: `job-${this.sequence}`,
      empresaId: input.empresaId,
      usuarioId: input.usuarioId,
      chaveIdempotencia: input.chaveIdempotencia,
      solicitacao: input.solicitacao,
      status: "QUEUED",
      tentativas: 0,
      maxTentativas: input.maxTentativas,
      disponivelEm: input.disponivelEm,
      leaseToken: null,
      leaseAte: null,
      iniciadoEm: null,
      concluidoEm: null,
      erroCodigo: null,
      erroMensagem: null,
      arquivoId: null,
      createdAt: input.disponivelEm,
      updatedAt: input.disponivelEm,
    };
    this.jobs.set(job.id, job);
    return { job: { ...job }, created: true };
  }

  async findOwned(id: string, scope: ReportJobScope) {
    const job = this.jobs.get(id);
    if (
      !job ||
      job.empresaId !== scope.empresaId ||
      job.usuarioId !== scope.usuarioId
    ) {
      return null;
    }
    return this.details(job);
  }

  async listOwned(scope: ReportJobScope, input: ListOwnedReportJobsInput) {
    const owned = [...this.jobs.values()]
      .filter(
        (job) =>
          job.empresaId === scope.empresaId &&
          job.usuarioId === scope.usuarioId &&
          (input.status === undefined || job.status === input.status),
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return {
      items: owned
        .slice(input.skip, input.skip + input.take)
        .map((job) => this.details(job)),
      total: owned.length,
    };
  }

  /** Força um estado para testar consulta, listagem e download. */
  setState(id: string, changes: Partial<MutableJob>): void {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Job ${id} inexistente.`);
    Object.assign(job, changes);
  }

  private details(job: MutableJob): ReportJobDetails {
    const arquivo =
      job.arquivoId === null ? null : (this.files.get(job.arquivoId) ?? null);
    return { ...job, arquivo };
  }

  async claim(id: string, input: ClaimReportJobInput) {
    const job = this.jobs.get(id);
    if (
      !job ||
      job.status !== "QUEUED" ||
      job.disponivelEm.getTime() > input.now.getTime() ||
      job.tentativas >= job.maxTentativas
    ) {
      return null;
    }
    Object.assign(job, {
      status: "RUNNING",
      tentativas: job.tentativas + 1,
      leaseToken: input.leaseToken,
      leaseAte: input.leaseAte,
      iniciadoEm: input.now,
    });
    return { ...job };
  }

  async findRunnableIds(now: Date, limit: number) {
    return [...this.jobs.values()]
      .filter(
        (job) =>
          job.status === "QUEUED" &&
          job.disponivelEm.getTime() <= now.getTime() &&
          job.tentativas < job.maxTentativas,
      )
      .sort((a, b) => a.disponivelEm.getTime() - b.disponivelEm.getTime())
      .slice(0, limit)
      .map((job) => job.id);
  }

  async markDone(id: string, leaseToken: string, arquivoId: string, now: Date) {
    const job = this.runningWith(id, leaseToken);
    if (!job) return false;
    Object.assign(job, {
      status: "DONE",
      arquivoId,
      concluidoEm: now,
      leaseToken: null,
      leaseAte: null,
      erroCodigo: null,
      erroMensagem: null,
    });
    return true;
  }

  async scheduleRetry(
    id: string,
    leaseToken: string,
    disponivelEm: Date,
    error: ReportJobError,
  ) {
    const job = this.runningWith(id, leaseToken);
    if (!job) return false;
    Object.assign(job, {
      status: "QUEUED",
      disponivelEm,
      leaseToken: null,
      leaseAte: null,
      erroCodigo: error.code,
      erroMensagem: error.message,
    });
    return true;
  }

  async markFailed(
    id: string,
    leaseToken: string,
    error: ReportJobError,
    now: Date,
  ) {
    const job = this.runningWith(id, leaseToken);
    if (!job) return false;
    Object.assign(job, {
      status: "FAILED",
      concluidoEm: now,
      leaseToken: null,
      leaseAte: null,
      erroCodigo: error.code,
      erroMensagem: error.message,
    });
    return true;
  }

  async recoverExpired(now: Date): Promise<RecoverExpiredSummary> {
    let requeued = 0;
    let failed = 0;
    for (const job of this.jobs.values()) {
      if (
        job.status !== "RUNNING" ||
        !job.leaseAte ||
        job.leaseAte.getTime() >= now.getTime()
      ) {
        continue;
      }
      const exhausted = job.tentativas >= job.maxTentativas;
      Object.assign(job, {
        status: exhausted ? "FAILED" : "QUEUED",
        disponivelEm: exhausted ? job.disponivelEm : now,
        concluidoEm: exhausted ? now : null,
        leaseToken: null,
        leaseAte: null,
        erroCodigo: "LEASE_EXPIRED",
        erroMensagem: "A geração do relatório excedeu o tempo de execução.",
      });
      if (exhausted) failed += 1;
      else requeued += 1;
    }
    return { requeued, failed };
  }

  async findCompanyName(empresaId: string) {
    return this.companies[empresaId] ?? null;
  }

  /** Simula outro worker assumindo o job depois que o lease venceu. */
  stealLease(id: string, newToken: string): void {
    const job = this.jobs.get(id);
    if (job) job.leaseToken = newToken;
  }

  private runningWith(id: string, leaseToken: string): MutableJob | null {
    const job = this.jobs.get(id);
    if (!job || job.status !== "RUNNING" || job.leaseToken !== leaseToken) {
      return null;
    }
    return job;
  }
}

export class RecordingDispatcher implements ReportJobDispatcher {
  readonly calls: DispatchReportJobInput[] = [];
  failure: Error | null = null;

  async dispatch(input: DispatchReportJobInput): Promise<void> {
    this.calls.push(input);
    if (this.failure) throw this.failure;
  }
}

export const generatedReport: GeneratedReport = {
  status: "generated",
  reportType: "monthly_maintenance",
  title: "Manutenção mensal",
  sections: [],
  planningMetrics: {
    provider: "fake",
    model: "fake-model",
    latencyMs: 1,
    inputTokens: 1,
    outputTokens: 1,
    totalTokens: 2,
  },
};

/** Agente que executa uma sequência de resultados: relatório ou erro. */
export class ScriptedReportAgent implements ReportAgent {
  calls = 0;

  constructor(private readonly script: ReadonlyArray<GeneratedReport | Error>) {}

  async generate(): Promise<GeneratedReport> {
    const step = this.script[Math.min(this.calls, this.script.length - 1)];
    this.calls += 1;
    if (step === undefined) throw new Error("Roteiro vazio.");
    if (step instanceof Error) throw step;
    return step;
  }
}

export class FakeRenderer implements ReportRenderer {
  readonly inputs: ReportRendererInput[] = [];

  async render(input: ReportRendererInput): Promise<RenderedReportFile> {
    this.inputs.push(input);
    return {
      bytes: new Uint8Array([37, 80, 68, 70]),
      contentType: "application/pdf",
      filename: "relatorio.pdf",
    };
  }
}

export class FakeFileService
  implements Pick<ReportFileService, "store" | "discard">
{
  readonly stored: StoreReportFileInput[] = [];
  readonly discarded: string[] = [];
  private sequence = 0;
  /** Executado depois do upload, antes de devolver o registro. */
  afterStore: (() => void) | null = null;

  async store(input: StoreReportFileInput): Promise<ReportFileRecord> {
    this.sequence += 1;
    this.stored.push(input);
    this.afterStore?.();
    const now = new Date("2026-11-15T12:00:00.000Z");
    return {
      id: `arquivo-${this.sequence}`,
      empresaId: input.empresaId,
      usuarioId: input.usuarioId,
      tipo: "MANUTENCAO_MENSAL",
      titulo: input.title,
      nomeArquivo: input.file.filename,
      storagePathname: `reports/${input.empresaId}/arquivo-${this.sequence}.pdf`,
      contentType: "application/pdf",
      tamanhoBytes: input.file.bytes.byteLength,
      createdAt: now,
      expiresAt: now,
    };
  }

  async discard(record: ReportFileRecord): Promise<void> {
    this.discarded.push(record.id);
  }
}

export const silentLogger = {
  info: () => undefined,
  error: () => undefined,
};

/** Relógio controlável para testar backoff e leases. */
export class ManualClock {
  constructor(private current: Date) {}

  now = (): Date => new Date(this.current);

  advance(ms: number): void {
    this.current = new Date(this.current.getTime() + ms);
  }
}
