import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import jwt from "jsonwebtoken";
import type { ReportFileScope } from "./report-file.repository.js";
import type { ReportFileDownload } from "./report-file.service.js";

const registrar = jest.fn<(...args: never[]) => Promise<unknown>>();

jest.unstable_mockModule("../auditoria/auditoria.service.js", () => ({
  AuditoriaService: jest.fn(() => ({ registrar })),
}));

const { api } = await import("../../../tests/test-server.js");
const { setReportJobServiceForTests } = await import("./report.controller.js");
const { ReportJobService } = await import("./report-job.service.js");
const { InMemoryReportJobRepository, RecordingDispatcher } = await import(
  "./tests/report-job.fakes.js"
);

const originalSecret = process.env["JWT_SECRET"];
const testSecret = "report-routes-test-secret";

function token(options: { id?: string; empresaId?: string | null } = {}): string {
  const id = options.id ?? "usuario-1";
  return jwt.sign(
    {
      id,
      nome: "Usuário Teste",
      email: "gestor@teste.com",
      perfil: "GESTOR",
      empresaId: options.empresaId === undefined ? "empresa-1" : options.empresaId,
    },
    testSecret,
    { subject: id, expiresIn: "1h" },
  );
}

const auth = (options?: Parameters<typeof token>[0]) => `Bearer ${token(options)}`;

class StreamingDownloads {
  readonly calls: Array<{ id: string; scope: ReportFileScope }> = [];

  async getDownload(id: string, scope: ReportFileScope): Promise<ReportFileDownload> {
    this.calls.push({ id, scope });
    const bytes = new Uint8Array([37, 80, 68, 70, 45]);
    return {
      metadata: { id, nomeArquivo: "relatorio-mensal.pdf" },
      content: {
        stream: new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(bytes);
            controller.close();
          },
        }),
        contentType: "application/pdf",
        size: bytes.byteLength,
        etag: "etag-1",
      },
    } as unknown as ReportFileDownload;
  }
}

let repository: InstanceType<typeof InMemoryReportJobRepository>;
let downloads: StreamingDownloads;

async function flushAudit() {
  await new Promise((resolve) => setImmediate(resolve));
}

describe("rotas de relatórios /api/ai/reports", () => {
  beforeAll(() => {
    process.env["JWT_SECRET"] = testSecret;
  });

  afterAll(() => {
    setReportJobServiceForTests(undefined);
    if (originalSecret === undefined) delete process.env["JWT_SECRET"];
    else process.env["JWT_SECRET"] = originalSecret;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    registrar.mockResolvedValue({ id: "log-1" });
    repository = new InMemoryReportJobRepository();
    downloads = new StreamingDownloads();
    setReportJobServiceForTests(
      new ReportJobService(repository, new RecordingDispatcher(), downloads, {
        logger: { error: () => undefined },
      }),
    );
  });

  describe("autenticação e tenant", () => {
    it.each([
      ["post", "/api/ai/reports"],
      ["get", "/api/ai/reports"],
      ["get", "/api/ai/reports/job-1"],
      ["get", "/api/ai/reports/job-1/download"],
    ] as const)("exige autenticação em %s %s", async (method: "get" | "post", path: string) => {
      const response = await api[method](path);
      expect(response.status).toBe(401);
    });

    it("recusa usuário sem empresa vinculada", async () => {
      const response = await api
        .get("/api/ai/reports")
        .set("Authorization", auth({ id: "admin-global", empresaId: null }));
      expect(response.status).toBe(403);
    });
  });

  describe("validação", () => {
    it.each([
      ["corpo vazio", {}],
      ["campo desconhecido", { reportType: "availability", sql: "SELECT 1" }],
      ["tipo inválido", { reportType: "financeiro" }],
      ["data inválida", { reportType: "availability", period: { start: "2026-02-30", end: "2026-03-01" } }],
      ["período invertido", { reportType: "availability", period: { start: "2026-10-31", end: "2026-10-01" } }],
      ["período longo", { reportType: "availability", period: { start: "2025-01-01", end: "2026-06-01" } }],
    ])("recusa %s com 400", async (_label: string, body: object) => {
      const response = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: `usuario-validacao-${_label}` }))
        .send(body);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ errorCode: "VALIDATION_ERROR" });
      expect(repository.jobs.size).toBe(0);
    });

    it("recusa Idempotency-Key inválida", async () => {
      const response = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-chave" }))
        .set("Idempotency-Key", "curta")
        .send({ reportType: "availability" });

      expect(response.status).toBe(400);
      expect(repository.jobs.size).toBe(0);
    });

    it("recusa filtros de listagem inválidos", async () => {
      const response = await api
        .get("/api/ai/reports?status=pronto&pageSize=500")
        .set("Authorization", auth());
      expect(response.status).toBe(400);
    });
  });

  describe("criação e estados", () => {
    it("aceita o pedido com 202, Location e status queued", async () => {
      const response = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-criacao" }))
        .set("Idempotency-Key", "req-criacao-0001")
        .send({
          reportType: "monthly_maintenance",
          period: { start: "2026-10-01", end: "2026-10-31" },
        });

      expect(response.status).toBe(202);
      expect(response.headers["location"]).toBe(`/api/ai/reports/${response.body.id}`);
      expect(response.body).toMatchObject({
        status: "queued",
        attempts: 0,
        downloadUrl: null,
      });

      const status = await api
        .get(response.headers["location"]!)
        .set("Authorization", auth({ id: "usuario-criacao" }));
      expect(status.status).toBe(200);
      expect(status.body.id).toBe(response.body.id);
    });

    it("repete a resposta para a mesma Idempotency-Key sem duplicar o job", async () => {
      const send = () =>
        api
          .post("/api/ai/reports")
          .set("Authorization", auth({ id: "usuario-replay" }))
          .set("Idempotency-Key", "req-replay-0001")
          .send({ reportType: "availability" });

      const first = await send();
      const second = await send();

      expect(second.status).toBe(202);
      expect(second.headers["idempotent-replayed"]).toBe("true");
      expect(second.body.id).toBe(first.body.id);
      expect(repository.jobs.size).toBe(1);
    });

    it("mostra falha com código e mensagem", async () => {
      const created = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-falha" }))
        .send({ reportType: "asset_costs" });
      repository.setState(created.body.id, {
        status: "FAILED",
        tentativas: 3,
        erroCodigo: "INTERNAL_SERVER_ERROR",
        erroMensagem: "Não foi possível planejar o relatório.",
      });

      const response = await api
        .get(`/api/ai/reports/${created.body.id}`)
        .set("Authorization", auth({ id: "usuario-falha" }));

      expect(response.body).toMatchObject({
        status: "failed",
        error: { code: "INTERNAL_SERVER_ERROR" },
        downloadUrl: null,
      });
    });
  });

  describe("listagem e isolamento", () => {
    it("lista somente os relatórios do usuário na empresa", async () => {
      await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-lista" }))
        .send({ reportType: "availability" });
      await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-lista", empresaId: "empresa-2" }))
        .send({ reportType: "availability" });

      const response = await api
        .get("/api/ai/reports?page=1&pageSize=10")
        .set("Authorization", auth({ id: "usuario-lista" }));

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        total: 1,
        page: 1,
        pageSize: 10,
        hasActiveJobs: true,
      });
      expect(response.body.items).toHaveLength(1);
    });

    it("não revela relatório de outra empresa", async () => {
      const created = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-isolado" }))
        .send({ reportType: "availability" });

      for (const path of [
        `/api/ai/reports/${created.body.id}`,
        `/api/ai/reports/${created.body.id}/download`,
      ]) {
        const response = await api
          .get(path)
          .set("Authorization", auth({ id: "usuario-isolado", empresaId: "empresa-2" }));
        expect(response.status).toBe(404);
      }
      expect(downloads.calls).toHaveLength(0);
    });
  });

  describe("download", () => {
    it("responde 409 enquanto o relatório não está pronto", async () => {
      const created = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-download" }))
        .send({ reportType: "availability" });

      const response = await api
        .get(`/api/ai/reports/${created.body.id}/download`)
        .set("Authorization", auth({ id: "usuario-download" }));

      expect(response.status).toBe(409);
      expect(response.body.details).toEqual({ status: "queued" });
    });

    it("entrega o PDF com cabeçalhos privados quando concluído", async () => {
      const created = await api
        .post("/api/ai/reports")
        .set("Authorization", auth({ id: "usuario-pdf" }))
        .send({ reportType: "availability" });
      repository.setState(created.body.id, { status: "DONE", arquivoId: "arquivo-1" });
      repository.files.set("arquivo-1", {
        titulo: "Disponibilidade",
        tipo: "DISPONIBILIDADE",
        tamanhoBytes: 5,
        expiresAt: new Date(Date.now() + 86_400_000),
      });

      const status = await api
        .get(`/api/ai/reports/${created.body.id}`)
        .set("Authorization", auth({ id: "usuario-pdf" }));
      expect(status.body.downloadUrl).toBe(`/api/ai/reports/${created.body.id}/download`);

      const response = await api
        .get(status.body.downloadUrl)
        .set("Authorization", auth({ id: "usuario-pdf" }))
        .buffer(true)
        .parse((res, callback) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => callback(null, Buffer.concat(chunks)));
        });

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toBe("application/pdf");
      expect(response.headers["content-disposition"]).toBe(
        'attachment; filename="relatorio-mensal.pdf"',
      );
      expect(response.headers["cache-control"]).toBe("private, no-store");
      expect((response.body as Buffer).subarray(0, 4).toString()).toBe("%PDF");
      expect(downloads.calls).toEqual([
        { id: "arquivo-1", scope: { empresaId: "empresa-1", usuarioId: "usuario-pdf" } },
      ]);
    });
  });

  describe("auditoria e rate limit", () => {
    it("audita a criação só com metadados e ignora a repetição", async () => {
      const send = () =>
        api
          .post("/api/ai/reports")
          .set("Authorization", auth({ id: "usuario-auditoria" }))
          .set("Idempotency-Key", "req-auditoria-0001")
          .send({ request: "Custos do contrato com o fornecedor X" });

      const created = await send();
      await send();
      await flushAudit();

      expect(registrar).toHaveBeenCalledTimes(1);
      expect(registrar).toHaveBeenCalledWith({
        entidade: "relatorio_ia",
        entidadeId: created.body.id,
        acao: "CRIACAO",
        empresaId: "empresa-1",
        usuarioId: "usuario-auditoria",
        depois: { id: created.body.id, status: "queued" },
      });
      expect(JSON.stringify(registrar.mock.calls)).not.toContain("fornecedor");
    });

    it("limita a 5 solicitações por usuário e empresa a cada 10 minutos", async () => {
      const authorization = auth({ id: "usuario-rate-limit" });

      for (let index = 0; index < 5; index += 1) {
        const response = await api
          .post("/api/ai/reports")
          .set("Authorization", authorization)
          .send({});
        expect(response.status).toBe(400);
      }

      const limited = await api
        .post("/api/ai/reports")
        .set("Authorization", authorization)
        .send({ reportType: "availability" });

      expect(limited.status).toBe(429);
      expect(limited.body).toMatchObject({ errorCode: "TOO_MANY_REQUESTS" });
    });
  });
});
