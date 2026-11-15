import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { GeneratedReport } from "../../src/modules/ai/report-agent.service.js";
import { PdfReportRenderer } from "../../src/modules/ai/report-renderer.service.js";

/**
 * Gera um PDF de exemplo, sem banco e sem LLM, para conferir visualmente
 * título, tabelas paginadas, gráficos e acentuação.
 * Uso: npm run reports:sample-pdf [caminho-de-saida.pdf]
 */
const months = ["2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"];

const report: GeneratedReport = {
  status: "generated",
  reportType: "monthly_maintenance",
  title: "Relatório mensal de manutenção (exemplo)",
  sections: [
    {
      id: "ordens",
      title: "Ordens de serviço e custos por mês",
      status: "ready",
      narrative:
        "Exemplo com dados fictícios. O volume de ordens cresceu no período, com pico em outubro.",
      table: {
        columns: ["mes", "total_os", "custo_total"],
        rows: months.map((mes, index) => ({
          mes,
          total_os: 18 + index * 3,
          custo_total: 12_500 + index * 2_340.5,
        })),
      },
      chart: {
        type: "bar",
        series: [
          {
            name: "Ordens de serviço",
            data: months.map((mes, index) => ({ label: mes, value: 18 + index * 3 })),
          },
        ],
      },
    },
    {
      id: "ativos",
      title: "Custo por ativo (tabela longa)",
      status: "ready",
      narrative: "Tabela com muitas linhas para conferir a paginação.",
      table: {
        columns: ["ativo", "descricao", "custo_total"],
        rows: Array.from({ length: 80 }, (_, index) => ({
          ativo: `ATV-${String(index + 1).padStart(3, "0")}`,
          descricao: `Equipamento de produção nº ${index + 1} — linha de envase`,
          custo_total: (index + 1) * 431.27,
        })),
      },
      chart: {
        type: "line",
        series: [
          {
            name: "Variação de custo",
            data: Array.from({ length: 30 }, (_, index) => ({
              label: `Dia ${index + 1}`,
              value: index % 4 === 0 ? -index * 15 : index * 40,
            })),
          },
        ],
      },
    },
    {
      id: "vazia",
      title: "Seção sem dados",
      status: "empty",
      narrative: "Nenhum dado foi encontrado para esta seção.",
      table: null,
      chart: null,
    },
  ],
  planningMetrics: {
    provider: "exemplo",
    model: "exemplo",
    latencyMs: 0,
    inputTokens: null,
    outputTokens: null,
    totalTokens: null,
  },
};

async function main(): Promise<void> {
  const output = process.argv[2] ?? join(tmpdir(), "relatorio-exemplo.pdf");
  const file = await new PdfReportRenderer().render({
    report,
    companyName: "Empresa de Exemplo Ltda.",
    generatedAt: new Date(),
  });
  await writeFile(output, file.bytes);
  console.info(`PDF de exemplo gerado em ${output} (${file.bytes.byteLength} bytes).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
