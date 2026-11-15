import "dotenv/config";
import { prisma } from "../../src/prisma/prisma.client.js";
import { createReportJobProcessor } from "../../src/modules/ai/report-job.factory.js";

/**
 * Worker manual: recupera leases vencidos e executa os jobs disponíveis.
 * Uso em desenvolvimento e validação enquanto o gatilho definitivo da
 * Task 05 não é escolhido. Não é o mecanismo de produção.
 */
async function main(): Promise<void> {
  const limitArgument = process.argv[2];
  const limit = limitArgument ? Number(limitArgument) : 5;
  if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
    throw new Error("O limite deve ser um inteiro entre 1 e 50.");
  }

  const summary = await createReportJobProcessor().runAvailable({ limit });
  console.info(
    JSON.stringify({ component: "ai.report-jobs", event: "run_summary", ...summary }),
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      JSON.stringify({
        component: "ai.report-jobs",
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido.",
      }),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
