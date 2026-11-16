import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import type { ReportFileScope } from "./report-file.repository.js";
import type { ReportFileDownload } from "./report-file.service.js";
import { composeReportRequest, ReportJobService } from "./report-job.service.js";
import {
  InMemoryReportJobRepository,
  ManualClock,
  RecordingDispatcher,
} from "./tests/report-job.fakes.js";

const scope = { empresaId: "empresa-a", usuarioId: "usuario-a" };
const otherCompany = { empresaId: "empresa-b", usuarioId: "usuario-a" };
const key = "req-2026-11-15-0001";

class FakeDownloads {
  readonly calls: Array<{ id: string; scope: ReportFileScope }> = [];

  async getDownload(id: string, fileScope: ReportFileScope): Promise<ReportFileDownload> {
    this.calls.push({ id, scope: fileScope });
    return {
      metadata: { id, nomeArquivo: "relatorio.pdf" },
      content: { size: 4 },
    } as unknown as ReportFileDownload;
  }
}

function createService() {
  const repository = new InMemoryReportJobRepository();
  const dispatcher = new RecordingDispatcher();
  const downloads = new FakeDownloads();
  const clock = new ManualClock(new Date("2026-11-15T12:00:00.000Z"));
  const errors: string[] = [];
  const service = new ReportJobService(repository, dispatcher, downloads, {
    now: clock.now,
    logger: { error: (message: string) => errors.push(message) },
  });
  return { service, repository, dispatcher, downloads, clock, errors };
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

/** Cria um job concluído com arquivo dentro ou fora da retenção. */
async function createDoneJob(
  setup: ReturnType<typeof createService>,
  expiresAt = new Date("2026-12-15T12:00:00.000Z"),
) {
  const { job } = await setup.service.enqueue({
    ...scope,
    request: "Relatório mensal",
    idempotencyKey: key,
  });
  setup.repository.setState(job.id, {
    status: "DONE",
    tentativas: 1,
    arquivoId: "arquivo-1",
    concluidoEm: new Date("2026-11-15T12:05:00.000Z"),
  });
  setup.repository.files.set("arquivo-1", {
    titulo: "Manutenção mensal",
    tipo: "MANUTENCAO_MENSAL",
    tamanhoBytes: 2048,
    expiresAt,
  });
  return job.id;
}

describe("ReportJobService", () => {
  describe("criação", () => {
    it("enfileira o job como queued e aciona o dispatcher", async () => {
      const { service, dispatcher } = createService();

      const result = await service.enqueue({
        ...scope,
        request: "  Relatório mensal de outubro  ",
        idempotencyKey: key,
      });

      expect(result.created).toBe(true);
      expect(result.job).toMatchObject({
        status: "queued",
        request: "Relatório mensal de outubro",
        attempts: 0,
        maxAttempts: 3,
        reportFileId: null,
        downloadUrl: null,
      });
      expect(dispatcher.calls).toEqual([
        { jobId: result.job.id, attempt: 0, reason: "created" },
      ]);
    });

    it("monta o pedido a partir de tipo, período e texto", async () => {
      const { service, repository } = createService();

      const { job } = await service.enqueue({
        ...scope,
        reportType: "asset_costs",
        period: { start: "2026-10-01", end: "2026-10-31" },
        request: "Destaque os cinco ativos mais caros.",
        idempotencyKey: key,
      });

      expect(repository.jobs.get(job.id)?.solicitacao).toBe(
        [
          "Tipo de relatório: Relatório de custos por ativo.",
          "Período: de 2026-10-01 a 2026-10-31.",
          "Pedido: Destaque os cinco ativos mais caros.",
        ].join("\n"),
      );
    });

    it("aceita somente o tipo, sem texto livre", () => {
      expect(composeReportRequest({ reportType: "availability" })).toBe(
        "Tipo de relatório: Relatório de disponibilidade de ativos.",
      );
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
      ["pedido vazio", { request: "   ", idempotencyKey: key }],
      ["pedido longo", { request: "x".repeat(2001), idempotencyKey: key }],
      ["chave curta", { request: "Relatório", idempotencyKey: "abc" }],
      ["chave com espaço", { request: "Relatório", idempotencyKey: "chave com espaco" }],
    ])(
      "valida a entrada: %s",
      async (_label: string, input: { request: string; idempotencyKey: string }) => {
        const { service } = createService();
        const error = await rejection(service.enqueue({ ...scope, ...input }));
        expect(error.statusCode).toBe(422);
      },
    );

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

    it("rejeita configuração inválida de tentativas", () => {
      const repository = new InMemoryReportJobRepository();
      const dispatcher = new RecordingDispatcher();
      const downloads = new FakeDownloads();
      expect(
        () => new ReportJobService(repository, dispatcher, downloads, { maxAttempts: 0 }),
      ).toThrow();
      expect(
        () => new ReportJobService(repository, dispatcher, downloads, { maxAttempts: 11 }),
      ).toThrow();
    });
  });

  describe("estados", () => {
    it("expõe resumo e link somente quando o relatório está pronto", async () => {
      const setup = createService();
      const id = await createDoneJob(setup);

      const view = await setup.service.getOwned(id, scope);

      expect(view).toMatchObject({
        status: "done",
        reportFileId: "arquivo-1",
        expired: false,
        downloadUrl: `/api/ai/reports/${id}/download`,
        report: {
          title: "Manutenção mensal",
          type: "monthly_maintenance",
          sizeBytes: 2048,
          expiresAt: "2026-12-15T12:00:00.000Z",
        },
      });
    });

    it("marca como expirado o relatório fora da retenção", async () => {
      const setup = createService();
      const id = await createDoneJob(setup, new Date("2026-11-15T11:59:59.000Z"));

      const view = await setup.service.getOwned(id, scope);

      expect(view).toMatchObject({
        status: "done",
        expired: true,
        report: null,
        reportFileId: null,
        downloadUrl: null,
      });
    });

    it("expõe a falha com código e mensagem, sem link", async () => {
      const setup = createService();
      const { job } = await setup.service.enqueue({
        ...scope,
        request: "Relatório mensal",
        idempotencyKey: key,
      });
      setup.repository.setState(job.id, {
        status: "FAILED",
        tentativas: 3,
        erroCodigo: "INTERNAL_SERVER_ERROR",
        erroMensagem: "Não foi possível planejar o relatório.",
      });

      const view = await setup.service.getOwned(job.id, scope);

      expect(view).toMatchObject({
        status: "failed",
        attempts: 3,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível planejar o relatório.",
        },
        downloadUrl: null,
      });
    });

    it("não expõe job de outra empresa", async () => {
      const { service } = createService();
      const { job } = await service.enqueue({
        ...scope,
        request: "Relatório mensal",
        idempotencyKey: key,
      });

      expect((await service.getOwned(job.id, scope)).id).toBe(job.id);
      const error = await rejection(service.getOwned(job.id, otherCompany));
      expect(error.statusCode).toBe(404);
    });
  });

  describe("listagem", () => {
    async function seed(setup: ReturnType<typeof createService>) {
      const ids: string[] = [];
      for (const [index, owner] of [scope, scope, scope, otherCompany].entries()) {
        const { job } = await setup.service.enqueue({
          ...owner,
          request: `Relatório ${index}`,
          idempotencyKey: `req-lista-000${index}`,
        });
        ids.push(job.id);
        setup.clock.advance(1_000);
      }
      return ids;
    }

    it("pagina do mais recente para o mais antigo, só do próprio usuário e empresa", async () => {
      const setup = createService();
      const ids = await seed(setup);

      const first = await setup.service.listOwned(scope, { page: 1, pageSize: 2 });
      const second = await setup.service.listOwned(scope, { page: 2, pageSize: 2 });

      expect(first.total).toBe(3);
      expect(first.items.map((item) => item.id)).toEqual([ids[2], ids[1]]);
      expect(second.items.map((item) => item.id)).toEqual([ids[0]]);
      expect(
        [...first.items, ...second.items].some((item) => item.id === ids[3]),
      ).toBe(false);
    });

    it("filtra por status e informa se há jobs ativos", async () => {
      const setup = createService();
      const ids = await seed(setup);
      setup.repository.setState(ids[0]!, { status: "FAILED" });
      setup.repository.setState(ids[1]!, { status: "FAILED" });
      setup.repository.setState(ids[2]!, { status: "FAILED" });

      const failed = await setup.service.listOwned(scope, {
        status: "failed",
        page: 1,
        pageSize: 20,
      });
      expect(failed.total).toBe(3);
      expect(failed.hasActiveJobs).toBe(false);

      setup.repository.setState(ids[2]!, { status: "RUNNING" });
      const all = await setup.service.listOwned(scope, { page: 1, pageSize: 20 });
      expect(all.hasActiveJobs).toBe(true);
    });
  });

  describe("download", () => {
    it("libera o arquivo do job concluído com o escopo do usuário", async () => {
      const setup = createService();
      const id = await createDoneJob(setup);

      const download = await setup.service.getDownload(id, scope);

      expect(download.metadata.id).toBe("arquivo-1");
      expect(setup.downloads.calls).toEqual([{ id: "arquivo-1", scope }]);
    });

    it.each([["QUEUED"], ["RUNNING"], ["FAILED"]] as const)(
      "recusa com 409 enquanto o job está %s",
      async (status: "QUEUED" | "RUNNING" | "FAILED") => {
        const setup = createService();
        const { job } = await setup.service.enqueue({
          ...scope,
          request: "Relatório mensal",
          idempotencyKey: key,
        });
        setup.repository.setState(job.id, { status });

        const error = await rejection(setup.service.getDownload(job.id, scope));

        expect(error.statusCode).toBe(409);
        expect(setup.downloads.calls).toHaveLength(0);
      },
    );

    it("recusa com 404 o relatório expirado", async () => {
      const setup = createService();
      const id = await createDoneJob(setup, new Date("2026-11-01T00:00:00.000Z"));

      const error = await rejection(setup.service.getDownload(id, scope));

      expect(error.statusCode).toBe(404);
      expect(setup.downloads.calls).toHaveLength(0);
    });

    it("não libera o arquivo para outra empresa", async () => {
      const setup = createService();
      const id = await createDoneJob(setup);

      const error = await rejection(setup.service.getDownload(id, otherCompany));

      expect(error.statusCode).toBe(404);
      expect(setup.downloads.calls).toHaveLength(0);
    });
  });
});
