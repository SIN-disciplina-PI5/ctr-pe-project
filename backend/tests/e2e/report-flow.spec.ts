import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { PDFDocument } from "pdf-lib";
import { AppError } from "../../src/common/errors/AppError.js";
import { ErrorCode } from "../../src/common/errors/error-code.js";
import type { GeneratedReport, ReportAgent } from "../../src/modules/ai/report-agent.service.js";
import { ReportFileRepository } from "../../src/modules/ai/report-file.repository.js";
import { ReportFileService } from "../../src/modules/ai/report-file.service.js";
import { ManualReportJobDispatcher } from "../../src/modules/ai/report-job.dispatcher.js";
import { ReportJobProcessor } from "../../src/modules/ai/report-job.processor.js";
import { ReportJobRepository } from "../../src/modules/ai/report-job.repository.js";
import { ReportJobService } from "../../src/modules/ai/report-job.service.js";
import {
  PdfReportRenderer,
  type RenderedReportFile,
  type ReportRendererInput,
} from "../../src/modules/ai/report-renderer.service.js";
import { setReportJobServiceForTests } from "../../src/modules/ai/report.controller.js";
import { SYNTHETIC_TENANTS } from "../../src/modules/ai/query-examples.js";
import { InMemoryReportStorage } from "../../src/modules/ai/tests/report-storage.fakes.js";
import { prisma } from "../../src/prisma/prisma.client.js";
import { api } from "../test-server.js";

/**
 * Feat 7, Task 08: fluxo completo de relatórios com duas empresas.
 *
 * Reais: rotas HTTP, autenticação, validação, auditoria, migration e
 * repositories Prisma, processamento do job e renderização do PDF.
 * Substituídos: o agente de relatórios (LLM, já coberto pelo E2E da Task 02)
 * e o Vercel Blob (storage em memória com a mesma interface).
 */

const describeWithDatabase = process.env["DATABASE_URL"] ? describe : describe.skip;

const originalSecret = process.env["JWT_SECRET"];
const testSecret = "report-flow-e2e-secret";
const runId = `e2e-${Date.now().toString(36)}`;

type Tenant = {
  empresaId: string;
  empresaNome: string;
  usuario: { id: string; nome: string; email: string; perfil: string };
  token: string;
};

const tenants: Tenant[] = [];
const createdJobIds: string[] = [];

/** Agente roteirizado: cada chamada consome o próximo passo da fila. */
class ScriptedAgent implements ReportAgent {
  private readonly steps: Array<GeneratedReport | Error> = [];
  readonly calls: Array<{ request: string; empresaId: string }> = [];

  enqueue(...steps: Array<GeneratedReport | Error>) {
    this.steps.push(...steps);
  }

  async generate(input: { request: string; empresaId: string }): Promise<GeneratedReport> {
    this.calls.push(input);
    const step = this.steps.shift();
    if (!step) throw new Error("Passo do agente não configurado no teste.");
    if (step instanceof Error) throw step;
    return step;
  }
}

class CapturingRenderer extends PdfReportRenderer {
  readonly inputs: ReportRendererInput[] = [];

  override async render(input: ReportRendererInput): Promise<RenderedReportFile> {
    this.inputs.push(input);
    return super.render(input);
  }
}

const report: GeneratedReport = {
  status: "generated",
  reportType: "monthly_maintenance",
  title: "Relatório mensal de manutenção E2E",
  sections: [
    {
      id: "ordens",
      title: "Ordens de serviço por mês",
      status: "ready",
      narrative: "Foram abertas 42 ordens de serviço no período.",
      table: {
        columns: ["mes", "total_os"],
        rows: [
          { mes: "2026-09", total_os: 20 },
          { mes: "2026-10", total_os: 22 },
        ],
      },
      chart: {
        type: "bar",
        series: [
          {
            name: "Ordens",
            data: [
              { label: "2026-09", value: 20 },
              { label: "2026-10", value: 22 },
            ],
          },
        ],
      },
    },
  ],
  planningMetrics: {
    provider: "e2e",
    model: "e2e",
    latencyMs: 0,
    inputTokens: null,
    outputTokens: null,
    totalTokens: null,
  },
};

const agent = new ScriptedAgent();
const renderer = new CapturingRenderer();
const storage = new InMemoryReportStorage();
const jobRepository = new ReportJobRepository();
const fileService = new ReportFileService(storage, new ReportFileRepository());
const dispatcher = new ManualReportJobDispatcher();
const silentLogger = { info: () => undefined, error: () => undefined };

function processor(offsetMs = 0) {
  return new ReportJobProcessor(jobRepository, agent, renderer, fileService, dispatcher, {
    now: () => new Date(Date.now() + offsetMs),
    logger: silentLogger,
  });
}

const service = new ReportJobService(jobRepository, dispatcher, fileService, {
  logger: silentLogger,
});

function bearer(tenant: Tenant) {
  return `Bearer ${tenant.token}`;
}

async function waitForAudit(jobId: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const logs = await prisma.logAuditoria.findMany({
      where: { entidade: "relatorio_ia", entidadeId: jobId },
    });
    if (logs.length > 0) return logs;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return [];
}

describeWithDatabase("Feat 7 — fluxo completo de relatórios com duas empresas", () => {
  beforeAll(async () => {
    process.env["JWT_SECRET"] = testSecret;
    setReportJobServiceForTests(service);

    const empresas = await prisma.empresa.findMany({
      where: { codigo: { in: SYNTHETIC_TENANTS.map((tenant) => tenant.code) } },
      select: { id: true, nome: true },
      orderBy: { codigo: "asc" },
    });
    if (empresas.length !== SYNTHETIC_TENANTS.length) {
      throw new Error("Base sintética não encontrada. Rode db:reset-synthetic antes deste E2E.");
    }

    for (const empresa of empresas) {
      const usuario = await prisma.usuario.findFirst({
        where: { empresaId: empresa.id, ativo: true },
        select: { id: true, nome: true, email: true, perfil: true },
        orderBy: { createdAt: "asc" },
      });
      if (!usuario) throw new Error(`Empresa ${empresa.nome} sem usuário ativo.`);

      tenants.push({
        empresaId: empresa.id,
        empresaNome: empresa.nome,
        usuario,
        token: jwt.sign(
          { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, empresaId: empresa.id },
          testSecret,
          { subject: usuario.id, expiresIn: "1h" },
        ),
      });
    }
  });

  afterAll(async () => {
    setReportJobServiceForTests(undefined);
    if (originalSecret === undefined) delete process.env["JWT_SECRET"];
    else process.env["JWT_SECRET"] = originalSecret;

    if (createdJobIds.length > 0) {
      const jobs = await prisma.jobRelatorioIA.findMany({
        where: { id: { in: createdJobIds } },
        select: { arquivoId: true },
      });
      const arquivoIds = jobs.flatMap((job) => (job.arquivoId ? [job.arquivoId] : []));
      await prisma.jobRelatorioIA.deleteMany({ where: { id: { in: createdJobIds } } });
      await prisma.arquivoRelatorioIA.deleteMany({ where: { id: { in: arquivoIds } } });
      await prisma.logAuditoria.deleteMany({
        where: { entidade: "relatorio_ia", entidadeId: { in: createdJobIds } },
      });
    }
  });

  it("solicita, acompanha, conclui e baixa o PDF; outra empresa não acessa nada", async () => {
    const [empresaA, empresaB] = tenants as [Tenant, Tenant];
    const idempotencyKey = `${runId}-fluxo`;
    const body = {
      reportType: "monthly_maintenance",
      period: { start: "2026-10-01", end: "2026-10-31" },
    };

    // 1. Solicitação: 202 e status queued.
    const created = await api
      .post("/api/ai/reports")
      .set("Authorization", bearer(empresaA))
      .set("Idempotency-Key", idempotencyKey)
      .send(body);
    expect(created.status).toBe(202);
    expect(created.body).toMatchObject({ status: "queued", downloadUrl: null });
    const jobId = created.body.id as string;
    createdJobIds.push(jobId);

    // 2. Repetição idempotente: mesmo job, sem duplicar.
    const replay = await api
      .post("/api/ai/reports")
      .set("Authorization", bearer(empresaA))
      .set("Idempotency-Key", idempotencyKey)
      .send(body);
    expect(replay.status).toBe(202);
    expect(replay.body.id).toBe(jobId);
    expect(replay.headers["idempotent-replayed"]).toBe("true");

    // 3. Download antes da conclusão é recusado.
    const early = await api
      .get(`/api/ai/reports/${jobId}/download`)
      .set("Authorization", bearer(empresaA));
    expect(early.status).toBe(409);

    // 4. Processamento em segundo plano.
    agent.enqueue(report);
    expect(await processor().runJob(jobId)).toMatchObject({ status: "done" });
    expect(agent.calls.at(-1)).toMatchObject({ empresaId: empresaA.empresaId });
    expect(agent.calls.at(-1)?.request).toContain("Período: de 2026-10-01 a 2026-10-31.");
    expect(renderer.inputs.at(-1)?.companyName).toBe(empresaA.empresaNome);

    // 5. Status concluído com link de download.
    const done = await api
      .get(`/api/ai/reports/${jobId}`)
      .set("Authorization", bearer(empresaA));
    expect(done.status).toBe(200);
    expect(done.body).toMatchObject({
      status: "done",
      attempts: 1,
      downloadUrl: `/api/ai/reports/${jobId}/download`,
      report: { title: report.title, type: "monthly_maintenance" },
    });

    // 6. Download do PDF real.
    const download = await api
      .get(done.body.downloadUrl)
      .set("Authorization", bearer(empresaA))
      .buffer(true)
      .parse((res, callback) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => callback(null, Buffer.concat(chunks)));
      });
    expect(download.status).toBe(200);
    expect(download.headers["content-type"]).toBe("application/pdf");
    expect(download.headers["cache-control"]).toBe("private, no-store");
    const pdf = await PDFDocument.load(download.body as Buffer, { updateMetadata: false });
    expect(pdf.getTitle()).toBe(report.title);
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1);

    // 7. Metadados e blob isolados por empresa e usuário.
    const arquivo = await prisma.arquivoRelatorioIA.findUniqueOrThrow({
      where: { id: done.body.reportFileId },
    });
    expect(arquivo).toMatchObject({
      empresaId: empresaA.empresaId,
      usuarioId: empresaA.usuario.id,
      tipo: "MANUTENCAO_MENSAL",
    });
    expect(arquivo.storagePathname.startsWith(`reports/${empresaA.empresaId}/${empresaA.usuario.id}/`)).toBe(true);
    expect(storage.objects.has(arquivo.storagePathname)).toBe(true);

    // 8. Outra empresa: status, download e listagem não revelam o relatório.
    for (const path of [`/api/ai/reports/${jobId}`, `/api/ai/reports/${jobId}/download`]) {
      const denied = await api.get(path).set("Authorization", bearer(empresaB));
      expect(denied.status).toBe(404);
    }
    const listB = await api
      .get("/api/ai/reports?pageSize=50")
      .set("Authorization", bearer(empresaB));
    expect(listB.status).toBe(200);
    expect(listB.body.items.some((item: { id: string }) => item.id === jobId)).toBe(false);

    const listA = await api
      .get("/api/ai/reports?pageSize=50")
      .set("Authorization", bearer(empresaA));
    expect(listA.body.items.some((item: { id: string }) => item.id === jobId)).toBe(true);

    // 9. Auditoria: um registro, só com metadados (a repetição não audita).
    const logs = await waitForAudit(jobId);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      acao: "CRIACAO",
      empresaId: empresaA.empresaId,
      usuarioId: empresaA.usuario.id,
      depois: { id: jobId, status: "queued" },
    });
  });

  it("registra a falha permanente e não libera download", async () => {
    const [empresaA] = tenants as [Tenant];
    const { job } = await service.enqueue({
      empresaId: empresaA.empresaId,
      usuarioId: empresaA.usuario.id,
      reportType: "asset_costs",
      idempotencyKey: `${runId}-falha`,
    });
    createdJobIds.push(job.id);

    agent.enqueue(
      new AppError({
        message: "O arquivo do relatório excede o tamanho permitido.",
        statusCode: 422,
        errorCode: ErrorCode.VALIDATION_ERROR,
      }),
    );
    expect(await processor().runJob(job.id)).toMatchObject({ status: "failed" });

    const status = await api
      .get(`/api/ai/reports/${job.id}`)
      .set("Authorization", bearer(empresaA));
    expect(status.body).toMatchObject({
      status: "failed",
      attempts: 1,
      error: { code: "VALIDATION_ERROR", message: "O arquivo do relatório excede o tamanho permitido." },
      downloadUrl: null,
    });

    const download = await api
      .get(`/api/ai/reports/${job.id}/download`)
      .set("Authorization", bearer(empresaA));
    expect(download.status).toBe(409);
  });

  it("reprocessa a falha transitória depois do backoff e conclui", async () => {
    const [empresaA] = tenants as [Tenant];
    const { job } = await service.enqueue({
      empresaId: empresaA.empresaId,
      usuarioId: empresaA.usuario.id,
      reportType: "availability",
      idempotencyKey: `${runId}-retry`,
    });
    createdJobIds.push(job.id);

    agent.enqueue(
      new AppError({
        message: "Não foi possível planejar o relatório.",
        statusCode: 502,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      }),
      report,
    );

    expect(await processor().runJob(job.id)).toMatchObject({ status: "retry_scheduled" });
    const waiting = await api
      .get(`/api/ai/reports/${job.id}`)
      .set("Authorization", bearer(empresaA));
    expect(waiting.body).toMatchObject({
      status: "queued",
      attempts: 1,
      error: { code: "INTERNAL_SERVER_ERROR" },
    });
    expect(waiting.body.nextAttemptAt).not.toBeNull();

    // Antes do backoff o job não pode ser assumido; 31 s depois, sim.
    expect(await processor().runJob(job.id)).toMatchObject({ status: "skipped" });
    expect(await processor(31_000).runJob(job.id)).toMatchObject({ status: "done" });

    const done = await api
      .get(`/api/ai/reports/${job.id}`)
      .set("Authorization", bearer(empresaA));
    expect(done.body).toMatchObject({ status: "done", attempts: 2, error: null });
  });
});
