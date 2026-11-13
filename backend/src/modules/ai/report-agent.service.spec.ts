import { describe, expect, it } from "@jest/globals";
import { type output, type ZodType } from "zod";
import {
  LlmProviderError,
  type LlmProvider,
  type StructuredGenerationRequest,
  type StructuredGenerationResult,
} from "./llm-provider.js";
import type {
  QueryAgentResult,
  QueryAgentService,
} from "./query-agent.service.js";
import { ReportAgentService, type ReportPlan } from "./report-agent.service.js";
import { REPORT_PLAN_SYSTEM_PROMPT } from "./report-prompts.config.js";

class FakeProvider implements LlmProvider {
  public request: StructuredGenerationRequest<ZodType> | null = null;

  constructor(
    private readonly plan: unknown,
    private readonly failure?: Error,
  ) {}

  async generateStructured<TSchema extends ZodType>(
    request: StructuredGenerationRequest<TSchema>,
  ): Promise<StructuredGenerationResult<output<TSchema>>> {
    this.request = request;
    if (this.failure) throw this.failure;

    return {
      data: request.schema.parse(this.plan),
      provider: "fake",
      model: "fake-report-model",
      latencyMs: 8,
      inputTokens: 20,
      outputTokens: 10,
      totalTokens: 30,
    };
  }
}

class FakeQueryAgent {
  public readonly calls: Array<{ question: string; empresaId?: string }> = [];

  constructor(
    private readonly results: Readonly<Record<string, QueryAgentResult>>,
  ) {}

  async query(input: {
    question: string;
    empresaId?: string;
  }): Promise<QueryAgentResult> {
    this.calls.push(input);
    const result = this.results[input.question];
    if (!result)
      throw new Error(`Resultado não configurado: ${input.question}`);
    return result;
  }
}

function singleAnswer(
  answer: string,
  rows: readonly Record<string, unknown>[],
): QueryAgentResult {
  return {
    status: "answered",
    mode: "single",
    answer,
    rowsUsed: rows,
    sql: 'SELECT * FROM ai."OrdemServico" LIMIT 100',
    execution: { rowCount: rows.length, latencyMs: 1 },
    correctionApplied: false,
    correctionMetrics: null,
    answerMetrics: null,
    relevantViews: ["OrdemServico"],
    generation: {
      provider: "fake",
      model: "fake-model",
      latencyMs: 1,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
    },
  };
}

function plan(
  reportType: ReportPlan["reportType"],
  section: Partial<ReportPlan["sections"][number]> = {},
): ReportPlan {
  return {
    reportType,
    title: "Relatório de manutenção",
    sections: [
      {
        id: "resumo",
        title: "Resumo",
        question: "Dados do resumo",
        visualization: {
          type: "none",
          categoryKey: null,
          valueKey: null,
        },
        ...section,
      },
    ],
  };
}

function serviceFor(
  reportPlan: ReportPlan,
  results: Readonly<Record<string, QueryAgentResult>>,
) {
  const provider = new FakeProvider(reportPlan);
  const queryAgent = new FakeQueryAgent(results);
  const service = new ReportAgentService(
    provider,
    queryAgent as unknown as QueryAgentService,
  );
  return { service, provider, queryAgent };
}

describe("ReportAgentService", () => {
  it("gera relatório mensal com tabela e série formadas somente pelas linhas consultadas", async () => {
    const question = "Totais mensais de ordens encerradas";
    const rows = [
      { mes: "2026-09", total: 12 },
      { mes: "2026-10", total: 18 },
    ];
    const reportPlan = plan("monthly_maintenance", {
      question,
      visualization: {
        type: "line",
        categoryKey: "mes",
        valueKey: "total",
      },
    });
    const { service, provider, queryAgent } = serviceFor(reportPlan, {
      [question]: singleAnswer("Foram encerradas 18 ordens em outubro.", rows),
    });

    const result = await service.generate({
      request: "Gere o relatório mensal de manutenção.",
      empresaId: "empresa-1",
    });

    expect(queryAgent.calls).toEqual([{ question, empresaId: "empresa-1" }]);
    expect(result).toMatchObject({
      status: "generated",
      reportType: "monthly_maintenance",
      sections: [
        {
          status: "ready",
          narrative: "Foram encerradas 18 ordens em outubro.",
          table: { columns: ["mes", "total"], rows },
          chart: {
            type: "line",
            series: [
              {
                data: [
                  { label: "2026-09", value: 12 },
                  { label: "2026-10", value: 18 },
                ],
              },
            ],
          },
        },
      ],
      planningMetrics: {
        provider: "fake",
        model: "fake-report-model",
        totalTokens: 30,
      },
    });
    expect(JSON.stringify(result)).not.toContain("SELECT");
    expect(provider.request?.schemaName).toBe("ctrpe_report_plan");
    expect(provider.request?.systemPrompt).toBe(REPORT_PLAN_SYSTEM_PROMPT);
  });

  it("gera relatório de custo por ativo preservando valores numéricos consultados", async () => {
    const question = "Custo total agrupado por ativo";
    const rows = [
      { ativo: "AT-001", custoTotal: "1250.50" },
      { ativo: "AT-002", custoTotal: "810.00" },
    ];
    const { service } = serviceFor(
      plan("asset_costs", {
        question,
        visualization: {
          type: "bar",
          categoryKey: "ativo",
          valueKey: "custoTotal",
        },
      }),
      {
        [question]: singleAnswer("AT-001 possui o maior custo total.", rows),
      },
    );

    const result = await service.generate({
      request: "Relatório de custo por ativo.",
      empresaId: "empresa-1",
    });

    expect(result.sections[0]?.table?.rows).toEqual(rows);
    expect(result.sections[0]?.chart?.series[0]?.data).toEqual([
      { label: "AT-001", value: 1250.5 },
      { label: "AT-002", value: 810 },
    ]);
  });

  it("gera relatório de disponibilidade a partir de um plano de consultas em etapas", async () => {
    const question = "Disponibilidade mensal da frota";
    const queryResult = {
      status: "answered",
      mode: "plan",
      answer: "A disponibilidade foi de 94,2% em outubro.",
      steps: [
        {
          id: "disponibilidade",
          purpose: "Calcular disponibilidade.",
          rowsUsed: [{ mes: "2026-10", disponibilidade: 94.2 }],
        },
        {
          id: "paradas",
          purpose: "Contar paradas.",
          rowsUsed: [{ paradas: 4 }],
        },
      ],
    } as unknown as QueryAgentResult;
    const { service } = serviceFor(
      plan("availability", {
        question,
        visualization: {
          type: "line",
          categoryKey: "mes",
          valueKey: "disponibilidade",
        },
      }),
      { [question]: queryResult },
    );

    const result = await service.generate({
      request: "Gere um relatório de disponibilidade.",
      empresaId: "empresa-1",
    });

    expect(result.sections[0]).toMatchObject({
      status: "ready",
      table: {
        columns: ["mes", "disponibilidade", "paradas"],
        rows: [{ mes: "2026-10", disponibilidade: 94.2 }, { paradas: 4 }],
      },
      chart: {
        series: [{ data: [{ label: "2026-10", value: 94.2 }] }],
      },
    });
  });

  it("mantém a estrutura quando uma seção não possui dados", async () => {
    const { service } = serviceFor(plan("monthly_maintenance"), {
      "Dados do resumo": singleAnswer(
        "Nenhum dado foi encontrado para a pergunta nesta empresa.",
        [],
      ),
    });

    const result = await service.generate({
      request: "Relatório mensal.",
      empresaId: "empresa-1",
    });

    expect(result.sections).toEqual([
      {
        id: "resumo",
        title: "Resumo",
        status: "empty",
        narrative: "Nenhum dado foi encontrado para esta seção.",
        table: null,
        chart: null,
      },
    ]);
  });

  it("preserva uma seção recusada sem expor SQL ou criar dados", async () => {
    const { service } = serviceFor(plan("asset_costs"), {
      "Dados do resumo": {
        status: "refused",
        reason: "A seção solicitada está fora do contexto permitido.",
        relevantViews: [],
      },
    });

    const result = await service.generate({
      request: "Relatório de custos.",
      empresaId: "empresa-1",
    });

    expect(result.sections[0]).toEqual({
      id: "resumo",
      title: "Resumo",
      status: "refused",
      narrative: "A seção solicitada está fora do contexto permitido.",
      table: null,
      chart: null,
    });
  });

  it("omite gráfico quando as chaves planejadas não existem nos dados", async () => {
    const { service } = serviceFor(
      plan("availability", {
        visualization: {
          type: "bar",
          categoryKey: "ativo",
          valueKey: "disponibilidade",
        },
      }),
      {
        "Dados do resumo": singleAnswer("Há um registro.", [
          { codigo: "AT-001", total: 1 },
        ]),
      },
    );

    const result = await service.generate({
      request: "Relatório de disponibilidade.",
      empresaId: "empresa-1",
    });

    expect(result.sections[0]?.status).toBe("ready");
    expect(result.sections[0]?.chart).toBeNull();
  });

  it("converte timeout do planejador em erro seguro", async () => {
    const provider = new FakeProvider(
      null,
      new LlmProviderError("TIMEOUT", "detalhe interno do provedor"),
    );
    const service = new ReportAgentService(
      provider,
      new FakeQueryAgent({}) as unknown as QueryAgentService,
    );

    await expect(
      service.generate({
        request: "Relatório mensal.",
        empresaId: "empresa-1",
      }),
    ).rejects.toMatchObject({
      statusCode: 504,
      message: "O planejamento do relatório excedeu o tempo limite.",
      details: { providerErrorCode: "TIMEOUT" },
    });
  });
});
