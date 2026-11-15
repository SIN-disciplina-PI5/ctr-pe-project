import { describe, expect, it } from "@jest/globals";
import { PDFDocument } from "pdf-lib";
import type { GeneratedReport, ReportSection } from "./report-agent.service.js";
import { PdfReportRenderer } from "./report-renderer.service.js";

const A4 = { width: 595.28, height: 841.89 };
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const generatedAt = new Date("2026-11-15T12:00:00.000Z");
const renderer = new PdfReportRenderer();

function section(overrides: Partial<ReportSection> = {}): ReportSection {
  return {
    id: "secao",
    title: "Ordens de serviço por mês",
    status: "ready",
    narrative: "Foram abertas 42 ordens de serviço no período analisado.",
    table: {
      columns: ["mes", "total_os", "custo_total"],
      rows: [
        { mes: "2026-09", total_os: 20, custo_total: 15_300.5 },
        { mes: "2026-10", total_os: 22, custo_total: 18_420.75 },
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
    ...overrides,
  };
}

function report(sections: ReportSection[], title = "Relatório mensal de manutenção"): GeneratedReport {
  return {
    status: "generated",
    reportType: "monthly_maintenance",
    title,
    sections,
    planningMetrics: {
      provider: "test",
      model: "test",
      latencyMs: 0,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    },
  };
}

function rows(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    ativo: `ATV-${String(index + 1).padStart(4, "0")}`,
    descricao: `Equipamento de linha ${index + 1} com descrição longa para quebrar a célula`,
    custo_total: (index + 1) * 137.45,
  }));
}

async function render(sections: ReportSection[], options: { title?: string; companyName?: string } = {}) {
  const file = await renderer.render({
    report: report(sections, options.title),
    companyName: options.companyName ?? "Alpha Brazilian",
    generatedAt,
  });
  const document = await PDFDocument.load(file.bytes, { updateMetadata: false });
  return { file, document };
}

describe("PdfReportRenderer", () => {
  it("gera um PDF A4 válido com metadados e nome de arquivo estáveis", async () => {
    const { file, document } = await render([section()]);

    expect(file.contentType).toBe("application/pdf");
    expect(Buffer.from(file.bytes.subarray(0, 5)).toString("latin1")).toBe("%PDF-");
    expect(file.filename).toBe("relatorio-mensal-de-manutencao-2026-11-15.pdf");
    expect(document.getTitle()).toBe("Relatório mensal de manutenção");
    expect(document.getAuthor()).toBe("CTR-PE");
    expect(document.getCreationDate()?.toISOString()).toBe(generatedAt.toISOString());
    expect(document.getPageCount()).toBe(1);
    for (const page of document.getPages()) {
      expect(page.getWidth()).toBeCloseTo(A4.width, 1);
      expect(page.getHeight()).toBeCloseTo(A4.height, 1);
    }
  });

  it("pagina tabelas longas em vez de cortar linhas", async () => {
    const short = await render([section({ table: { columns: ["ativo", "descricao", "custo_total"], rows: rows(5) }, chart: null })]);
    const long = await render([section({ table: { columns: ["ativo", "descricao", "custo_total"], rows: rows(200) }, chart: null })]);

    expect(short.document.getPageCount()).toBe(1);
    expect(long.document.getPageCount()).toBeGreaterThan(3);
    for (const page of long.document.getPages()) {
      expect(page.getHeight()).toBeCloseTo(A4.height, 1);
    }
  });

  it("renderiza gráficos de barras e linhas com várias séries, negativos e amostragem", async () => {
    const manyPoints = Array.from({ length: 40 }, (_, index) => ({
      label: `Semana ${index + 1}`,
      value: index % 3 === 0 ? -index * 10 : index * 25,
    }));

    const { document } = await render([
      section({
        id: "linhas",
        chart: {
          type: "line",
          series: [
            { name: "Custo", data: manyPoints },
            { name: "Meta", data: manyPoints.map((point) => ({ ...point, value: 300 })) },
          ],
        },
      }),
      section({
        id: "barras",
        chart: {
          type: "bar",
          series: [{ name: "Variação", data: [{ label: "A", value: -50 }, { label: "B", value: 80 }] }],
        },
      }),
    ]);

    expect(document.getPageCount()).toBeGreaterThanOrEqual(1);
  });

  it("mantém seções vazias e recusadas sem inventar tabela ou gráfico", async () => {
    const { document } = await render([
      section({ id: "vazia", status: "empty", narrative: "Nenhum dado foi encontrado para esta seção.", table: null, chart: null }),
      section({ id: "recusada", status: "refused", narrative: "A pergunta não pôde ser respondida com segurança.", table: null, chart: null }),
    ]);

    expect(document.getPageCount()).toBe(1);
  });

  it("não falha com acentos, caracteres fora da fonte e valores atípicos", async () => {
    const { file } = await render(
      [
        section({
          title: "Manutenção — inspeção & calibração 🔧",
          narrative: "Ação corretiva em equipamento crítico: ç, ã, é, ü, 中文.",
          table: {
            columns: ["campo", "valor"],
            rows: [
              { campo: "nulo", valor: null },
              { campo: "infinito", valor: Number.POSITIVE_INFINITY },
              { campo: "booleano", valor: true },
              { campo: "data", valor: new Date("2026-10-01T00:00:00.000Z") },
              { campo: "objeto", valor: { aninhado: 1 } },
            ],
          },
          chart: null,
        }),
      ],
      { title: "Relatório de Ação 🔧", companyName: "Indústria São José" },
    );

    expect(file.filename).toBe("relatorio-de-acao-2026-11-15.pdf");
  });

  it("gera relatório extenso abaixo do limite de 10 MB do storage", async () => {
    const sections = Array.from({ length: 6 }, (_, index) =>
      section({
        id: `secao-${index}`,
        table: { columns: ["ativo", "descricao", "custo_total"], rows: rows(100) },
        chart: {
          type: "bar",
          series: [{ name: "Custo", data: rows(100).map((row) => ({ label: row.ativo, value: row.custo_total })) }],
        },
      }),
    );

    const { file, document } = await render(sections);

    expect(file.bytes.byteLength).toBeLessThan(MAX_FILE_BYTES);
    expect(document.getPageCount()).toBeGreaterThan(6);
  });
});
