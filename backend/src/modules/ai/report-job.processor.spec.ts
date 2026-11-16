import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import type { GeneratedReport } from "./report-agent.service.js";
import { ReportJobProcessor } from "./report-job.processor.js";
import { GENERIC_JOB_ERROR_MESSAGE, toReportJobView } from "./report-job.types.js";
import {
  FakeFileService,
  FakeRenderer,
  generatedReport,
  InMemoryReportJobRepository,
  ManualClock,
  RecordingDispatcher,
  ScriptedReportAgent,
  silentLogger,
} from "./tests/report-job.fakes.js";

const LEASE_MS = 330_000;
const transient = () =>
  new AppError({
    message: "Não foi possível planejar o relatório.",
    statusCode: 502,
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
  });
const permanent = () =>
  new AppError({
    message: "O arquivo do relatório excede o tamanho permitido.",
    statusCode: 422,
    errorCode: ErrorCode.VALIDATION_ERROR,
  });

async function setup(
  script: ReadonlyArray<GeneratedReport | Error>,
  maxTentativas = 3,
) {
  const clock = new ManualClock(new Date("2026-11-15T12:00:00.000Z"));
  const repository = new InMemoryReportJobRepository({ "empresa-a": "Empresa A" });
  const agent = new ScriptedReportAgent(script);
  const renderer = new FakeRenderer();
  const files = new FakeFileService();
  const dispatcher = new RecordingDispatcher();
  let tokenSequence = 0;
  const processor = new ReportJobProcessor(
    repository,
    agent,
    renderer,
    files,
    dispatcher,
    {
      leaseMs: LEASE_MS,
      now: clock.now,
      createLeaseToken: () => `lease-${++tokenSequence}`,
      logger: silentLogger,
    },
  );
  const { job } = await repository.createOrGetExisting({
    empresaId: "empresa-a",
    usuarioId: "usuario-a",
    chaveIdempotencia: "req-0001-abcdef",
    solicitacao: "Relatório mensal de outubro",
    maxTentativas,
    disponivelEm: clock.now(),
  });

  return { clock, repository, agent, renderer, files, dispatcher, processor, jobId: job.id };
}

describe("ReportJobProcessor", () => {
  describe("sucesso", () => {
    it("executa queued -> running -> done e vincula o arquivo", async () => {
      const { processor, repository, renderer, files, agent, jobId } = await setup([
        generatedReport,
      ]);

      const outcome = await processor.runJob(jobId);

      expect(outcome).toEqual({ status: "done", jobId, arquivoId: "arquivo-1" });
      const job = repository.jobs.get(jobId)!;
      expect(job.status).toBe("DONE");
      expect(job.tentativas).toBe(1);
      expect(job.arquivoId).toBe("arquivo-1");
      expect(job.leaseToken).toBeNull();
      expect(job.concluidoEm).not.toBeNull();
      expect(agent.calls).toBe(1);
      expect(renderer.inputs[0]?.companyName).toBe("Empresa A");
      expect(files.stored[0]).toMatchObject({
        empresaId: "empresa-a",
        usuarioId: "usuario-a",
        reportType: "monthly_maintenance",
        title: "Manutenção mensal",
      });
      expect(toReportJobView(job)).toMatchObject({
        status: "done",
        reportFileId: "arquivo-1",
        error: null,
      });
    });
  });

  describe("falha", () => {
    it("marca failed sem retry quando o erro é permanente", async () => {
      const { processor, repository, dispatcher, jobId } = await setup([permanent()]);

      const outcome = await processor.runJob(jobId);

      expect(outcome).toEqual({ status: "failed", jobId, errorCode: "VALIDATION_ERROR" });
      const job = repository.jobs.get(jobId)!;
      expect(job.status).toBe("FAILED");
      expect(job.tentativas).toBe(1);
      expect(job.erroMensagem).toBe("O arquivo do relatório excede o tamanho permitido.");
      expect(dispatcher.calls).toHaveLength(0);
      expect(toReportJobView(job)).toMatchObject({
        status: "failed",
        reportFileId: null,
        error: { code: "VALIDATION_ERROR" },
      });
    });

    it("não persiste a mensagem de erros inesperados", async () => {
      const { processor, repository, jobId } = await setup(
        [new Error("relation \"ai\".\"segredo\" does not exist")],
        1,
      );

      await processor.runJob(jobId);

      const job = repository.jobs.get(jobId)!;
      expect(job.status).toBe("FAILED");
      expect(job.erroCodigo).toBe("UNEXPECTED_ERROR");
      expect(job.erroMensagem).toBe(GENERIC_JOB_ERROR_MESSAGE);
    });
  });

  describe("retry", () => {
    it("reagenda erro transitório com backoff e conclui na tentativa seguinte", async () => {
      const { processor, repository, dispatcher, clock, jobId } = await setup([
        transient(),
        generatedReport,
      ]);

      const first = await processor.runJob(jobId);
      expect(first).toMatchObject({ status: "retry_scheduled" });
      const queued = repository.jobs.get(jobId)!;
      expect(queued.status).toBe("QUEUED");
      expect(queued.disponivelEm.toISOString()).toBe("2026-11-15T12:00:30.000Z");
      expect(dispatcher.calls).toEqual([
        { jobId, delayMs: 30_000, attempt: 1, reason: "retry" },
      ]);
      expect(toReportJobView(queued)).toMatchObject({
        status: "queued",
        attempts: 1,
        nextAttemptAt: "2026-11-15T12:00:30.000Z",
        error: { code: "INTERNAL_SERVER_ERROR" },
      });

      // Antes do backoff o job não pode ser assumido.
      expect(await processor.runJob(jobId)).toMatchObject({ status: "skipped" });

      clock.advance(30_000);
      const second = await processor.runJob(jobId);

      expect(second).toMatchObject({ status: "done" });
      const done = repository.jobs.get(jobId)!;
      expect(done.tentativas).toBe(2);
      expect(done.erroCodigo).toBeNull();
    });

    it("marca failed ao esgotar as tentativas, com backoff crescente", async () => {
      const { processor, repository, dispatcher, clock, jobId } = await setup(
        [transient()],
        3,
      );

      await processor.runJob(jobId);
      clock.advance(30_000);
      await processor.runJob(jobId);
      clock.advance(60_000);
      const last = await processor.runJob(jobId);

      expect(dispatcher.calls.map((call) => call.delayMs)).toEqual([30_000, 60_000]);
      expect(last).toMatchObject({ status: "failed" });
      expect(repository.jobs.get(jobId)).toMatchObject({ status: "FAILED", tentativas: 3 });
      clock.advance(10 * 60_000);
      expect(await processor.runJob(jobId)).toMatchObject({ status: "skipped" });
    });
  });

  describe("duplicidade", () => {
    it("executa uma única vez quando o gatilho entrega o mesmo job em paralelo", async () => {
      const { processor, agent, files, jobId } = await setup([generatedReport]);

      const outcomes = await Promise.all([processor.runJob(jobId), processor.runJob(jobId)]);

      expect(outcomes.map((outcome) => outcome.status).sort()).toEqual(["done", "skipped"]);
      expect(agent.calls).toBe(1);
      expect(files.stored).toHaveLength(1);
    });

    it("ignora reentrega de job já concluído", async () => {
      const { processor, agent, jobId } = await setup([generatedReport]);

      await processor.runJob(jobId);
      const again = await processor.runJob(jobId);

      expect(again).toEqual({ status: "skipped", jobId, reason: "not_claimable" });
      expect(agent.calls).toBe(1);
    });

    it("descarta o PDF quando outro worker assumiu o lease", async () => {
      const { processor, repository, files, jobId } = await setup([generatedReport]);
      files.afterStore = () => repository.stealLease(jobId, "lease-de-outro-worker");

      const outcome = await processor.runJob(jobId);

      expect(outcome).toEqual({ status: "skipped", jobId, reason: "lease_lost" });
      expect(files.discarded).toEqual(["arquivo-1"]);
      expect(repository.jobs.get(jobId)).toMatchObject({
        status: "RUNNING",
        leaseToken: "lease-de-outro-worker",
        arquivoId: null,
      });
    });

    it("descarta o PDF e reagenda quando a conclusão falha no banco", async () => {
      const { processor, repository, files, jobId } = await setup([generatedReport]);
      repository.markDone = async () => {
        throw new Error("connection reset");
      };

      const outcome = await processor.runJob(jobId);

      expect(outcome).toMatchObject({ status: "retry_scheduled" });
      expect(files.discarded).toEqual(["arquivo-1"]);
      expect(repository.jobs.get(jobId)?.status).toBe("QUEUED");
    });
  });

  describe("recuperação", () => {
    it("recoloca na fila job com lease vencido e o executa", async () => {
      const { processor, repository, clock, jobId } = await setup([generatedReport]);
      // Worker que assumiu o job e morreu (ex.: função encerrada por timeout).
      await repository.claim(jobId, {
        now: clock.now(),
        leaseToken: "lease-morto",
        leaseAte: new Date(clock.now().getTime() + LEASE_MS),
      });

      clock.advance(LEASE_MS - 1);
      const early = await processor.runAvailable();
      expect(early.recovered).toEqual({ requeued: 0, failed: 0 });
      expect(early.outcomes).toHaveLength(0);

      clock.advance(2);
      const summary = await processor.runAvailable();

      expect(summary.recovered).toEqual({ requeued: 1, failed: 0 });
      expect(summary.outcomes).toEqual([{ status: "done", jobId, arquivoId: "arquivo-1" }]);
      expect(repository.jobs.get(jobId)?.tentativas).toBe(2);
    });

    it("marca failed o lease vencido sem tentativas restantes", async () => {
      const { processor, repository, clock, jobId } = await setup([generatedReport], 1);
      await repository.claim(jobId, {
        now: clock.now(),
        leaseToken: "lease-morto",
        leaseAte: new Date(clock.now().getTime() + LEASE_MS),
      });

      clock.advance(LEASE_MS + 1);
      const summary = await processor.runAvailable();

      expect(summary.recovered).toEqual({ requeued: 0, failed: 1 });
      expect(summary.outcomes).toHaveLength(0);
      expect(repository.jobs.get(jobId)).toMatchObject({
        status: "FAILED",
        erroCodigo: "LEASE_EXPIRED",
      });
    });

    it("na varredura, recupera e redispara os jobs prontos sem executá-los", async () => {
      const { processor, repository, dispatcher, agent, clock, jobId } = await setup([
        generatedReport,
      ]);
      await repository.claim(jobId, {
        now: clock.now(),
        leaseToken: "lease-morto",
        leaseAte: new Date(clock.now().getTime() + LEASE_MS),
      });
      clock.advance(LEASE_MS + 1);

      const summary = await processor.dispatchAvailable();

      expect(summary).toEqual({
        recovered: { requeued: 1, failed: 0 },
        dispatched: 1,
        failed: 0,
      });
      expect(dispatcher.calls).toEqual([{ jobId, reason: "sweep" }]);
      expect(agent.calls).toBe(0);
      expect(repository.jobs.get(jobId)?.status).toBe("QUEUED");
    });

    it("na varredura, conta falhas de disparo sem interromper", async () => {
      const { processor, dispatcher } = await setup([generatedReport]);
      dispatcher.failure = new Error("gatilho indisponível");

      expect(await processor.dispatchAvailable()).toMatchObject({ dispatched: 0, failed: 1 });
    });

    it("respeita o limite de jobs por execução", async () => {
      const { processor, repository, clock } = await setup([generatedReport]);
      for (const suffix of ["b", "c"]) {
        await repository.createOrGetExisting({
          empresaId: "empresa-a",
          usuarioId: "usuario-a",
          chaveIdempotencia: `req-0001-${suffix}`,
          solicitacao: "Relatório",
          maxTentativas: 3,
          disponivelEm: clock.now(),
        });
      }

      const summary = await processor.runAvailable({ limit: 2 });

      expect(summary.outcomes).toHaveLength(2);
      expect(
        [...repository.jobs.values()].filter((job) => job.status === "QUEUED"),
      ).toHaveLength(1);
    });
  });
});
