import { describe, expect, it } from "@jest/globals";
import { ManualReportJobDispatcher } from "./report-job.dispatcher.js";
import { createReportJobDispatcher } from "./report-job.factory.js";
import { TriggerDevReportJobDispatcher } from "./report-job.trigger-dispatcher.js";

describe("createReportJobDispatcher", () => {
  it("usa o gatilho manual por padrão", () => {
    expect(createReportJobDispatcher({})).toBeInstanceOf(ManualReportJobDispatcher);
    expect(createReportJobDispatcher({ REPORT_JOB_DISPATCHER: "manual" })).toBeInstanceOf(
      ManualReportJobDispatcher,
    );
  });

  it("liga o Trigger.dev quando configurado", () => {
    expect(createReportJobDispatcher({ REPORT_JOB_DISPATCHER: "trigger" })).toBeInstanceOf(
      TriggerDevReportJobDispatcher,
    );
  });

  it("recusa valor desconhecido em vez de cair silenciosamente no manual", () => {
    expect(() => createReportJobDispatcher({ REPORT_JOB_DISPATCHER: "fila" })).toThrow(
      "REPORT_JOB_DISPATCHER",
    );
  });
});
