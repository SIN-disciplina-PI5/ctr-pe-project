import "dotenv/config";
import { PlanosManutencaoService } from "../../src/modules/planos-manutencao/planos-manutencao.service.js";
import { prisma } from "../../src/prisma/prisma.client.js";

async function main() {
  const service = new PlanosManutencaoService();
  const result = await service.processarPlanosVencidos();
  console.log("Processamento de planos preventivos concluído:", result);
}

main()
  .catch((error) => {
    console.error("Erro ao processar planos preventivos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
