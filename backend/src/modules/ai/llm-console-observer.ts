import type {
  LlmObservation,
  LlmObserver,
} from "./llm-provider.js";

export interface LlmLogSink {
  info(message: string): void;
  error(message: string): void;
}

const consoleSink: LlmLogSink = {
  info: (message) => console.info(message),
  error: (message) => console.error(message),
};

export class ConsoleLlmObserver implements LlmObserver {
  constructor(private readonly sink: LlmLogSink = consoleSink) {}

  record(observation: LlmObservation): void {
    const base = {
      component: "ai.llm",
      operation: observation.operation,
      provider: observation.provider,
      model: observation.model,
      status: observation.status,
      latencyMs: observation.latencyMs,
    };
    const entry =
      observation.status === "success"
        ? {
            ...base,
            inputTokens: observation.inputTokens,
            outputTokens: observation.outputTokens,
            totalTokens: observation.totalTokens,
          }
        : { ...base, errorCode: observation.errorCode };
    const message = JSON.stringify(entry);

    if (observation.status === "error") {
      this.sink.error(message);
      return;
    }

    this.sink.info(message);
  }
}
