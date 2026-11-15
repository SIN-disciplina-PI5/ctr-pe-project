import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import { ReportJobService } from "./report-job.service.js";
import {
  InMemoryReportJobRepository,
  ManualClock,
  RecordingDispatcher,
} from "./tests/report-job.fakes.js";

const scope = { empresaId: "empresa-a", usuarioId: "usuario-a" };
const key = "req-2026-11-15-0001";

function createService() {
  const repository = new InMemoryReportJobRepository();
  const dispatcher = new RecordingDispatcher();
  const clock = new ManualClock(new Date("2026-11-15T12:00:00.000Z"));
  const errors: string[] = [];
  const service = new ReportJobService(repository, dispatcher, {
    now: clock.now,
    logger: { error: (message: string) => errors.push(message) },
  });
  return { service, repository, dispatcher, errors };
}

async function rejection(promise: Promise<unknown>): Promise<AppError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof AppError) return error;
    throw error;
  }
  throw new Error("A promise deveria ter sido rejeitada.");
}

describe("ReportJobService", () => {
  it("enfileira o job como queued e aciona o dispatcher", async () => {
    const { service, dispatcher } = createService();

    const result = await service.enqueue({
      ...scope,
      request: "  Relatório mensal de outubro  ",
      idempotencyKey: key,
    });

    expect(result.created).toBe(true);
    expect(result.job.status).toBe("queued");
    expect(result.job.attempts).toBe(0);
    expect(result.job.maxAttempts).toBe(3);
    expect(result.job.reportFileId).toBeNull();
    expect(dispatcher.calls).toEqual([{ jobId: result.job.id }]);
  });

  it("devolve o mesmo job para requisição duplicada sem novo dispatch", async () => {
    const { service, repository, dispatcher } = createService();
    const input = { ...scope, request: "Relatório mensal", idempotencyKey: key };

    const first = await service.enqueue(input);
    const second = await service.enqueue(input);

    expect(second.created).toBe(false);
    expect(second.job.id).toBe(first.job.id);
    expect(repository.jobs.size).toBe(1);
    expect(dispatcher.calls).toHaveLength(1);
  });

  it("rejeita a mesma chave com outra solicitação", async () => {
    const { service } = createService();
    await service.enqueue({ ...scope, request: "Relatório mensal", idempotencyKey: key });

    const error = await rejection(
      service.enqueue({ ...scope, request: "Custos por ativo", idempotencyKey: key }),
    );

    expect(error.statusCode).toBe(409);
  });

  it("isola a chave de idempotência por empresa e usuário", async () => {
    const { service, repository } = createService();

    await service.enqueue({ ...scope, request: "Relatório mensal", idempotencyKey: key });
    const other = await service.enqueue({
      empresaId: "empresa-b",
      usuarioId: "usuario-b",
      request: "Relatório mensal",
      idempotencyKey: key,
    });

    expect(other.created).toBe(true);
    expect(repository.jobs.size).toBe(2);
  });

  it("mantém o job queued quando o dispatch falha", async () => {
    const { service, repository, dispatcher, errors } = createService();
    dispatcher.failure = new Error("fila indisponível");

    const result = await service.enqueue({
      ...scope,
      request: "Relatório mensal",
      idempotencyKey: key,
    });

    expect(result.job.status).toBe("queued");
    expect(repository.jobs.get(result.job.id)?.status).toBe("QUEUED");
    expect(errors.join("\n")).toContain("dispatch_failed");
  });

  it.each([
    ["solicitação vazia", { request: "   ", idempotencyKey: key }],
    ["solicitação longa", { request: "x".repeat(2001), idempotencyKey: key }],
    ["chave curta", { request: "Relatório", idempotencyKey: "abc" }],
    ["chave com espaço", { request: "Relatório", idempotencyKey: "chave com espaco" }],
  ])("valida a entrada: %s", async (_label: string, input: { request: string; idempotencyKey: string }) => {
    const { service } = createService();
    const error = await rejection(service.enqueue({ ...scope, ...input }));
    expect(error.statusCode).toBe(422);
  });

  it("exige empresa e usuário", async () => {
    const { service } = createService();
    const error = await rejection(
      service.enqueue({
        empresaId: " ",
        usuarioId: "usuario-a",
        request: "Relatório",
        idempotencyKey: key,
      }),
    );
    expect(error.statusCode).toBe(403);
  });

  it("não expõe job de outra empresa", async () => {
    const { service } = createService();
    const { job } = await service.enqueue({
      ...scope,
      request: "Relatório mensal",
      idempotencyKey: key,
    });

    expect((await service.getOwned(job.id, scope)).id).toBe(job.id);
    const error = await rejection(
      service.getOwned(job.id, { empresaId: "empresa-b", usuarioId: "usuario-a" }),
    );
    expect(error.statusCode).toBe(404);
  });

  it("rejeita configuração inválida de tentativas", () => {
    const repository = new InMemoryReportJobRepository();
    const dispatcher = new RecordingDispatcher();
    expect(() => new ReportJobService(repository, dispatcher, { maxAttempts: 0 })).toThrow();
    expect(() => new ReportJobService(repository, dispatcher, { maxAttempts: 11 })).toThrow();
  });
});
