import { describe, expect, it } from "@jest/globals";
import {
  reportJobIdempotencyKey,
  TriggerDevReportJobDispatcher,
  type TriggerReportJobOptions,
} from "./report-job.trigger-dispatcher.js";

const NOW = Date.parse("2026-11-15T12:07:00.000Z");

function setup(failure?: Error) {
  const calls: Array<{ payload: { jobId: string }; options: TriggerReportJobOptions }> = [];
  const keys: string[] = [];
  const dispatcher = new TriggerDevReportJobDispatcher(
    async (payload, options) => {
      calls.push({ payload, options });
      if (failure) throw failure;
    },
    async (key) => {
      keys.push(key);
      return `idem:${key}`;
    },
    () => NOW,
  );
  return { dispatcher, calls, keys };
}

describe("TriggerDevReportJobDispatcher", () => {
  it("dispara na criação sem atraso, com chave da tentativa 0", async () => {
    const { dispatcher, calls, keys } = setup();

    await dispatcher.dispatch({ jobId: "job-1", attempt: 0, reason: "created" });

    expect(keys).toEqual(["report-job:job-1:attempt:0"]);
    expect(calls).toEqual([
      {
        payload: { jobId: "job-1" },
        options: { idempotencyKey: "idem:report-job:job-1:attempt:0", tags: ["report-job_job-1"] },
      },
    ]);
  });

  it("no retry, agenda com o atraso do backoff e uma chave nova por tentativa", async () => {
    const { dispatcher, calls } = setup();

    await dispatcher.dispatch({ jobId: "job-1", delayMs: 30_000, attempt: 1, reason: "retry" });
    await dispatcher.dispatch({ jobId: "job-1", delayMs: 60_500, attempt: 2, reason: "retry" });

    expect(calls.map((call) => call.options.delay)).toEqual(["30s", "61s"]);
    expect(calls.map((call) => call.options.idempotencyKey)).toEqual([
      "idem:report-job:job-1:attempt:1",
      "idem:report-job:job-1:attempt:2",
    ]);
  });

  it("na varredura, usa uma chave por janela de 5 minutos", () => {
    const sweep = { jobId: "job-1", reason: "sweep" as const };

    const first = reportJobIdempotencyKey(sweep, NOW);
    expect(first).toBe(reportJobIdempotencyKey(sweep, NOW + 60_000));
    expect(first).not.toBe(reportJobIdempotencyKey(sweep, NOW + 5 * 60_000));
  });

  it("não envia empresa, usuário nem texto do pedido ao Trigger.dev", async () => {
    const { dispatcher, calls } = setup();

    await dispatcher.dispatch({ jobId: "job-1", reason: "created" });

    expect(Object.keys(calls[0]!.payload)).toEqual(["jobId"]);
  });

  it("propaga a falha do Trigger.dev para quem chamou", async () => {
    const failure = new Error("Trigger.dev indisponível");
    const { dispatcher } = setup(failure);

    await expect(dispatcher.dispatch({ jobId: "job-1", reason: "created" })).rejects.toBe(failure);
  });
});
