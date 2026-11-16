import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../common/errors/AppError.js";
import { ReportFileService } from "./report-file.service.js";
import type { RenderedReportFile } from "./report-renderer.service.js";
import {
  InMemoryReportFileRepository,
  InMemoryReportStorage,
} from "./tests/report-storage.fakes.js";

const NOW = new Date("2026-11-15T12:00:00.000Z");
const scopeA = { empresaId: "empresa-a", usuarioId: "usuario-a" };
const scopeB = { empresaId: "empresa-b", usuarioId: "usuario-b" };

function pdf(size = 5, filename = "relatorio-mensal-2026-11-15.pdf"): RenderedReportFile {
  const bytes = new Uint8Array(size);
  bytes.set([37, 80, 68, 70, 45].slice(0, size));
  return { bytes, contentType: "application/pdf", filename };
}

function setup(now = NOW) {
  let current = now;
  const clock = () => new Date(current);
  const storage = new InMemoryReportStorage();
  const repository = new InMemoryReportFileRepository(clock);
  const service = new ReportFileService(storage, repository, {
    now: clock,
    createId: () => "id-fixo",
  });
  return {
    storage,
    repository,
    service,
    advance: (ms: number) => {
      current = new Date(current.getTime() + ms);
    },
  };
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

function store(service: ReportFileService, scope = scopeA, file = pdf()) {
  return service.store({
    ...scope,
    reportType: "monthly_maintenance",
    title: "  Relatório mensal  ",
    file,
  });
}

describe("ReportFileService", () => {
  describe("upload", () => {
    it("guarda o PDF em caminho isolado por empresa e usuário, com retenção de 30 dias", async () => {
      const { service, storage } = setup();

      const record = await store(service);

      expect(record).toMatchObject({
        empresaId: "empresa-a",
        usuarioId: "usuario-a",
        tipo: "MANUTENCAO_MENSAL",
        titulo: "Relatório mensal",
        storagePathname: "reports/empresa-a/usuario-a/id-fixo/relatorio-mensal-2026-11-15.pdf",
        contentType: "application/pdf",
        tamanhoBytes: 5,
      });
      expect(record.expiresAt.toISOString()).toBe("2026-12-15T12:00:00.000Z");
      expect(storage.objects.has(record.storagePathname)).toBe(true);
    });

    it("neutraliza barras vindas dos identificadores", async () => {
      const { service } = setup();

      const record = await store(service, { empresaId: "../outra", usuarioId: "a/b" });

      // Cada identificador vira um único segmento: nenhuma barra extra.
      expect(record.storagePathname).toBe(
        "reports/..-outra/a-b/id-fixo/relatorio-mensal-2026-11-15.pdf",
      );
      expect(record.storagePathname.split("/")).toHaveLength(5);
    });

    it.each([
      ["arquivo vazio", pdf(0)],
      ["nome sem .pdf", pdf(5, "relatorio.txt")],
      ["tipo diferente de PDF", { ...pdf(), contentType: "text/html" } as unknown as RenderedReportFile],
      ["acima de 10 MB", pdf(10 * 1024 * 1024 + 1)],
    ])("recusa %s sem enviar ao storage", async (_label: string, file: RenderedReportFile) => {
      const { service, storage } = setup();

      const error = await rejection(store(service, scopeA, file));

      expect(error.statusCode).toBe(422);
      expect(storage.objects.size).toBe(0);
    });

    it("aceita arquivo com exatamente 10 MB", async () => {
      const { service } = setup();
      const record = await store(service, scopeA, pdf(10 * 1024 * 1024));
      expect(record.tamanhoBytes).toBe(10 * 1024 * 1024);
    });

    it("remove o blob quando a gravação dos metadados falha", async () => {
      const { service, storage, repository } = setup();
      const failure = new Error("banco indisponível");
      repository.failCreate = failure;

      await expect(store(service)).rejects.toBe(failure);

      expect(storage.objects.size).toBe(0);
      expect(storage.deleted).toEqual([
        "reports/empresa-a/usuario-a/id-fixo/relatorio-mensal-2026-11-15.pdf",
      ]);
    });

    it("preserva o erro original mesmo se a compensação falhar", async () => {
      const { service, storage, repository } = setup();
      const failure = new Error("banco indisponível");
      repository.failCreate = failure;
      storage.failDeleteFor.add("reports/empresa-a/usuario-a/id-fixo/relatorio-mensal-2026-11-15.pdf");

      await expect(store(service)).rejects.toBe(failure);
    });
  });

  describe("download", () => {
    it("entrega o arquivo ao dono dentro da retenção", async () => {
      const { service } = setup();
      const record = await store(service);

      const download = await service.getDownload(record.id, scopeA);

      expect(download.metadata.id).toBe(record.id);
      expect(download.content.size).toBe(5);
    });

    it("nega o arquivo a outra empresa e a outro usuário da mesma empresa", async () => {
      const { service } = setup();
      const record = await store(service);

      expect((await rejection(service.getDownload(record.id, scopeB))).statusCode).toBe(404);
      expect(
        (await rejection(
          service.getDownload(record.id, { empresaId: "empresa-a", usuarioId: "usuario-x" }),
        )).statusCode,
      ).toBe(404);
    });

    it("nega o arquivo expirado mesmo antes da limpeza", async () => {
      const { service, advance } = setup();
      const record = await store(service);
      advance(30 * 86_400_000);

      expect((await rejection(service.getDownload(record.id, scopeA))).statusCode).toBe(404);
    });

    it("responde 404 quando o blob não existe mais", async () => {
      const { service, storage } = setup();
      const record = await store(service);
      storage.objects.clear();

      expect((await rejection(service.getDownload(record.id, scopeA))).statusCode).toBe(404);
    });

    it("exige empresa e usuário", async () => {
      const { service } = setup();
      const error = await rejection(service.getDownload("arquivo-1", { empresaId: "", usuarioId: "u" }));
      expect(error.statusCode).toBe(403);
    });
  });

  it("descarta blob e metadados de um arquivo órfão", async () => {
    const { service, storage, repository } = setup();
    const record = await store(service);

    await service.discard(record);

    expect(storage.objects.size).toBe(0);
    expect(repository.records.size).toBe(0);
  });
});
