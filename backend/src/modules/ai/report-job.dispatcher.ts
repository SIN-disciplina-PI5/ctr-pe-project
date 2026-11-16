export type DispatchReason = "created" | "retry" | "sweep";

export interface DispatchReportJobInput {
  readonly jobId: string;
  /** Atraso mínimo antes da execução; usado no agendamento de retries. */
  readonly delayMs?: number;
  /** Tentativas já feitas quando o disparo ocorre (0 na criação). */
  readonly attempt?: number;
  /** Origem do disparo; compõe a chave de idempotência do gatilho. */
  readonly reason?: DispatchReason;
}

/**
 * Porta do gatilho de execução. Quando a decisão de processamento for
 * tomada, o adaptador (fila gerenciada, serviço externo ou worker fora da
 * Vercel) implementa esta interface e chama ReportJobProcessor.runJob(jobId).
 *
 * O dispatch é apenas um aviso: o estado do job vive no Postgres. Se o
 * dispatch falhar, o job continua QUEUED e é encontrado por
 * ReportJobProcessor.runAvailable().
 */
export interface ReportJobDispatcher {
  dispatch(input: DispatchReportJobInput): Promise<void>;
}

/**
 * Implementação provisória enquanto o gatilho não é escolhido: não envia
 * nada. Os jobs ficam QUEUED até alguém executar `npm run reports:jobs:run`.
 */
export class ManualReportJobDispatcher implements ReportJobDispatcher {
  async dispatch(): Promise<void> {
    // Intencionalmente vazio.
  }
}
