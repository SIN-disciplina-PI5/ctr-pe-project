import { Client } from "@upstash/qstash";
import type {
  DispatchReportJobInput,
  ReportJobDispatcher,
} from "./report-job.dispatcher.js";
import type { QStashPublishConfig } from "./report-job.qstash-config.js";

const SWEEP_SLOT_MS = 5 * 60_000;
const FLOW_CONTROL_KEY = "ctrpe-report-jobs";

type PublishJson = (
  request: Parameters<Client["publishJSON"]>[0],
) => Promise<unknown>;

function deduplicationId(input: DispatchReportJobInput, nowMs: number): string {
  if (input.reason === "sweep") {
    return `report-job-${input.jobId}-sweep-${Math.floor(nowMs / SWEEP_SLOT_MS)}`;
  }
  return `report-job-${input.jobId}-attempt-${input.attempt ?? 0}`;
}

export class QStashReportJobDispatcher implements ReportJobDispatcher {
  private readonly publish: PublishJson;

  constructor(
    private readonly config: QStashPublishConfig,
    publish?: PublishJson,
    private readonly now: () => number = Date.now,
  ) {
    const client = new Client({ token: config.token });
    this.publish = publish ?? ((request) => client.publishJSON(request));
  }

  async dispatch(input: DispatchReportJobInput): Promise<void> {
    const delayMs = input.delayMs ?? 0;
    await this.publish({
      url: this.config.reportJobUrl,
      body: { jobId: input.jobId },
      deduplicationId: deduplicationId(input, this.now()),
      retries: 3,
      flowControl: { key: FLOW_CONTROL_KEY, parallelism: 2 },
      label: ["ctrpe", "report-job", input.reason ?? "created"],
      ...(delayMs > 0 ? { delay: Math.ceil(delayMs / 1000) } : {}),
    });
  }
}
