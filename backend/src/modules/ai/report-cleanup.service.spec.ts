import { describe, expect, it } from "@jest/globals";
import { ReportCleanupService } from "./report-cleanup.service.js";
import type { CreateReportFileInput } from "./report-file.repository.js";
import {
  InMemoryReportFileRepository,
  InMemoryReportStorage,
} from "./tests/report-storage.fakes.js";

const NOW = new Date("2026-11-15T12:00:00.000Z");
const DAY = 86_400_000;

async function seed(
  storage: InMemoryReportStorage,
  repository: InMemoryReportFileRepository,
  expiresInDays: number[],
) {
  const pathnames: string[] = [];
  for (const [index, days] of expiresInDays.entries()) {
    const pathname = `reports/empresa-a/usuario-a/${index}/relatorio.pdf`;
    const input: CreateReportFileInput = {
      empresaId: "empresa-a",
      usuarioId: "usuario-a",
      tipo: "DISPONIBILIDADE",
      titulo: `Relatório ${index}`,
      nomeArquivo: "relatorio.pdf",
      storagePathname: pathname,
      contentType: "application/pdf",
      tamanhoBytes: 5,
      expiresAt: new Date(NOW.getTime() + days * DAY),
    };
    await storage.upload({ pathname, bytes: new Uint8Array(5), contentType: "application/pdf" });
    await repository.create(input);
    pathnames.push(pathname);
  }
  return pathnames;
}

function setup(batchSize?: number) {
  const storage = new InMemoryReportStorage();
  const repository = new InMemoryReportFileRepository(() => NOW);
  const service = new ReportCleanupService(storage, repository, {
    now: () => NOW,
    ...(batchSize === undefined ? {} : { batchSize }),
  });
  return { storage, repository, service };
}

describe("ReportCleanupService", () => {
  it("remove blob e metadados só dos relatórios vencidos", async () => {
    const { storage, repository, service } = setup();
    const paths = await seed(storage, repository, [-2, -1, 0, 1, 29]);

    const summary = await service.cleanupExpired();

    expect(summary).toEqual({ examined: 3, deleted: 3, failed: 0 });
    expect([...storage.objects.keys()].sort()).toEqual([paths[3], paths[4]].sort());
    expect(repository.records.size).toBe(2);
  });

  it("é idempotente: a segunda execução não encontra nada", async () => {
    const { storage, repository, service } = setup();
    await seed(storage, repository, [-1, -1]);

    await service.cleanupExpired();
    const again = await service.cleanupExpired();

    expect(again).toEqual({ examined: 0, deleted: 0, failed: 0 });
  });

  it("mantém os metadados quando o blob não pode ser removido", async () => {
    const { storage, repository, service } = setup();
    const paths = await seed(storage, repository, [-1, -1]);
    storage.failDeleteFor.add(paths[0]!);

    const summary = await service.cleanupExpired();

    expect(summary).toEqual({ examined: 2, deleted: 1, failed: 1 });
    expect(repository.records.size).toBe(1);
  });

  it("processa em lotes", async () => {
    const { storage, repository, service } = setup(2);
    await seed(storage, repository, [-3, -2, -1]);

    expect(await service.cleanupExpired()).toMatchObject({ examined: 2, deleted: 2 });
    expect(await service.cleanupExpired()).toMatchObject({ examined: 1, deleted: 1 });
  });

  it.each([0, 101, 1.5])("rejeita batchSize inválido: %p", (batchSize: number) => {
    expect(() => setup(batchSize)).toThrow();
  });
});
