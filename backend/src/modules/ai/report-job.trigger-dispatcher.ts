import { idempotencyKeys, tasks } from "@trigger.dev/sdk";
import type { generateReportTask } from "../../trigger/report-jobs.js";
import type {
  DispatchReportJobInput,
  ReportJobDispatcher,
} from "./report-job.dispatcher.js";

export const GENERATE_REPORT_TASK_ID = "generate-report";

/** Janela da varredura: no máximo um redisparo por job a cada 5 minutos. */
const SWEEP_SLOT_MS = 5 * 60_000;

export interface TriggerReportJobOptions {
  readonly idempotencyKey: unknown;
  readonly delay?: string;
  readonly tags: string[];
}

export type TriggerReportJob = (
  payload: { jobId: string },
  options: TriggerReportJobOptions,
) => Promise<unknown>;

export type CreateIdempotencyKey = (key: string) => Promise<unknown>;

const defaultTrigger: TriggerReportJob = (payload, options) =>
  tasks.trigger<typeof generateReportTask>(GENERATE_REPORT_TASK_ID, payload, {
    idempotencyKey: options.idempotencyKey as Awaited<
      ReturnType<typeof idempotencyKeys.create>
    >,
    tags: options.tags,
    ...(options.delay === undefined ? {} : { delay: options.delay }),
  });

// Escopo global: a mesma chave deduplica disparos vindos do backend e de
// dentro das tasks (retries e varredura).
const defaultCreateKey: CreateIdempotencyKey = (key) =>
  idempotencyKeys.create(key, { scope: "global" });

/**
 * Chave de idempotência por job e tentativa: a mesma tentativa nunca gera
 * duas execuções no Trigger.dev, mas cada retry gera uma nova.
 */
export function reportJobIdempotencyKey(
  input: DispatchReportJobInput,
  nowMs: number,
): string {
  if (input.reason === "sweep") {
    return `report-job:${input.jobId}:sweep:${Math.floor(nowMs / SWEEP_SLOT_MS)}`;
  }
  return `report-job:${input.jobId}:attempt:${input.attempt ?? 0}`;
}

export class TriggerDevReportJobDispatcher implements ReportJobDispatcher {
  constructor(
    private readonly trigger: TriggerReportJob = defaultTrigger,
    private readonly createKey: CreateIdempotencyKey = defaultCreateKey,
    private readonly now: () => number = Date.now,
  ) {}

  async dispatch(input: DispatchReportJobInput): Promise<void> {
    const delayMs = input.delayMs ?? 0;
    const idempotencyKey = await this.createKey(
      reportJobIdempotencyKey(input, this.now()),
    );

    await this.trigger(
      { jobId: input.jobId },
      {
        idempotencyKey,
        // Só o id do job: nada de empresa, usuário ou texto do pedido.
        tags: [`report-job_${input.jobId}`],
        ...(delayMs > 0 ? { delay: `${Math.ceil(delayMs / 1000)}s` } : {}),
      },
    );
  }
}
