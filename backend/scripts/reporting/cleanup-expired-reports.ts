import "dotenv/config";
import { prisma } from "../../src/prisma/prisma.client.js";
import { ReportCleanupService } from "../../src/modules/ai/report-cleanup.service.js";
import { ReportFileRepository } from "../../src/modules/ai/report-file.repository.js";
import { createReportStorage } from "../../src/modules/ai/report-storage.js";

async function main(): Promise<void> {
  const cleanup = new ReportCleanupService(
    createReportStorage(),
    new ReportFileRepository(),
  );
  const summary = await cleanup.cleanupExpired();
  console.info(JSON.stringify({ component: "ai.report-cleanup", ...summary }));
}

main()
  .catch((error: unknown) => {
    console.error(
      JSON.stringify({
        component: "ai.report-cleanup",
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido.",
      }),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
