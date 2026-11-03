import type { AiViewName } from "./schema-context.js";

export const SYNTHETIC_REFERENCE_TIME = "2026-10-27T12:00:00.000Z";

export const SYNTHETIC_TENANTS = [
  { code: "alpha-international", name: "Alpha International" },
  { code: "alpha-brazilian", name: "Alpha Brazilian" },
] as const;

export type SyntheticTenantCode = (typeof SYNTHETIC_TENANTS)[number]["code"];
export type QueryExampleCategory =
  | "filter"
  | "join"
  | "aggregation"
  | "date"
  | "top-n";

export interface ExpectedValueRule {
  readonly column: string;
  readonly type: "string" | "number" | "boolean";
  readonly nullable?: boolean;
  readonly oneOf?: readonly (string | number | boolean)[];
  readonly min?: number;
  readonly max?: number;
}

export interface ExpectedQueryResult {
  readonly description: string;
  readonly columns: readonly string[];
  readonly rowCount?: {
    readonly exact?: number;
    readonly min?: number;
    readonly max?: number;
  };
  readonly exactRows?: readonly Readonly<Record<string, unknown>>[];
  readonly exactRowsByTenant?: Partial<
    Record<SyntheticTenantCode, readonly Readonly<Record<string, unknown>>[]>
  >;
  readonly valueRules?: readonly ExpectedValueRule[];
  readonly orderedBy?: {
    readonly column: string;
    readonly direction: "asc" | "desc";
  };
}

export interface QueryExample {
  readonly id: string;
  readonly question: string;
  readonly categories: readonly QueryExampleCategory[];
  readonly relevantViews: readonly AiViewName[];
  readonly sql: string;
  readonly expected: ExpectedQueryResult;
}

const numberRule = (
  column: string,
  min = 0,
  max?: number,
): ExpectedValueRule => ({
  column,
  type: "number",
  min,
  ...(max === undefined ? {} : { max }),
});

export const QUERY_EXAMPLES: readonly QueryExample[] = [
  {
    id: "empresa-atual",
    question: "Qual é a empresa atualmente selecionada?",
    categories: ["filter"],
    relevantViews: ["Empresa"],
    sql: `SELECT "codigo", "nome"
FROM ai."Empresa"
ORDER BY "codigo"
LIMIT 10`,
    expected: {
      description: "Retorna somente a empresa definida pela sessão RLS.",
      columns: ["codigo", "nome"],
      rowCount: { exact: 1 },
      exactRowsByTenant: {
        "alpha-international": [
          { codigo: "alpha-international", nome: "Alpha International" },
        ],
        "alpha-brazilian": [
          { codigo: "alpha-brazilian", nome: "Alpha Brazilian" },
        ],
      },
    },
  },
  {
    id: "localizacoes-ativas",
    question: "Quais são as localizações ativas da empresa?",
    categories: ["filter"],
    relevantViews: ["Localizacao"],
    sql: `SELECT "codigo", "nome", "tipo"
FROM ai."Localizacao"
WHERE "ativa" = true
ORDER BY "codigo"
LIMIT 100`,
    expected: {
      description:
        "As quatro localizações fixas do seed, ordenadas por código.",
      columns: ["codigo", "nome", "tipo"],
      rowCount: { exact: 4 },
      exactRows: [
        { codigo: "LOC-01", nome: "Oficina Central", tipo: "Oficina" },
        { codigo: "LOC-02", nome: "Pátio de Veículos", tipo: "Pátio" },
        { codigo: "LOC-03", nome: "Galpão A", tipo: "Galpão" },
        {
          codigo: "LOC-04",
          nome: "Setor de Geração de Energia",
          tipo: "Setor",
        },
      ],
    },
  },
  {
    id: "total-ativos",
    question: "Quantos ativos existem na empresa?",
    categories: ["aggregation"],
    relevantViews: ["Ativo"],
    sql: `SELECT COUNT(*)::int AS "total"
FROM ai."Ativo"
LIMIT 1`,
    expected: {
      description:
        "Cada empresa recebe os 18 ativos definidos no catálogo sintético.",
      columns: ["total"],
      rowCount: { exact: 1 },
      exactRows: [{ total: 18 }],
    },
  },
  {
    id: "ativos-por-tipo",
    question: "Quantos ativos existem de cada tipo?",
    categories: ["aggregation"],
    relevantViews: ["Ativo"],
    sql: `SELECT "tipo"::text AS "tipo", COUNT(*)::int AS "total"
FROM ai."Ativo"
GROUP BY "tipo"
ORDER BY "tipo"
LIMIT 100`,
    expected: {
      description: "Distribuição fixa do catálogo de ativos.",
      columns: ["tipo", "total"],
      rowCount: { exact: 4 },
      exactRows: [
        { tipo: "CAMINHAO", total: 8 },
        { tipo: "COMPONENTE", total: 2 },
        { tipo: "EQUIPAMENTO", total: 4 },
        { tipo: "MAQUINA", total: 4 },
      ],
    },
  },
  {
    id: "ativo-desativado",
    question: "Qual ativo está desativado?",
    categories: ["filter"],
    relevantViews: ["Ativo"],
    sql: `SELECT "codigo", "nome", "status"
FROM ai."Ativo"
WHERE "ativo" = false OR "status" = 'DESATIVADO'
ORDER BY "codigo"
LIMIT 100`,
    expected: {
      description: "O seed desativa somente a bomba BMB-02.",
      columns: ["codigo", "nome", "status"],
      rowCount: { exact: 1 },
      exactRows: [
        {
          codigo: "BMB-02",
          nome: "Bomba hidráulica reserva BMB-02",
          status: "DESATIVADO",
        },
      ],
    },
  },
  {
    id: "ativos-criticos-top5",
    question: "Quais são os cinco ativos mais críticos?",
    categories: ["filter", "top-n"],
    relevantViews: ["Ativo"],
    sql: `SELECT "codigo", "nome", "criticidade", "status"
FROM ai."Ativo"
WHERE "ativo" = true
ORDER BY CASE "criticidade"
  WHEN 'CRITICA' THEN 4
  WHEN 'ALTA' THEN 3
  WHEN 'MEDIA' THEN 2
  ELSE 1
END DESC, "codigo"
LIMIT 5`,
    expected: {
      description: "Até cinco ativos ativos, priorizados por criticidade.",
      columns: ["codigo", "nome", "criticidade", "status"],
      rowCount: { exact: 5 },
      valueRules: [
        {
          column: "criticidade",
          type: "string",
          oneOf: ["BAIXA", "MEDIA", "ALTA", "CRITICA"],
        },
      ],
    },
  },
  {
    id: "ativos-com-localizacao",
    question: "Em qual localização está cada ativo?",
    categories: ["join"],
    relevantViews: ["Ativo", "Localizacao"],
    sql: `SELECT a."codigo", a."nome", l."codigo" AS "localizacaoCodigo", l."nome" AS "localizacaoNome"
FROM ai."Ativo" a
JOIN ai."Localizacao" l ON l."id" = a."localizacaoId"
ORDER BY a."codigo"
LIMIT 100`,
    expected: {
      description: "Os 18 ativos possuem localização coerente com seu tipo.",
      columns: ["codigo", "nome", "localizacaoCodigo", "localizacaoNome"],
      rowCount: { exact: 18 },
    },
  },
  {
    id: "disponibilidade-atual",
    question: "Qual é o percentual atual de ativos disponíveis ou em uso?",
    categories: ["aggregation", "filter"],
    relevantViews: ["Ativo"],
    sql: `SELECT ROUND(
  100.0 * COUNT(*) FILTER (
    WHERE "ativo" = true AND "status" IN ('DISPONIVEL', 'EM_USO')
  ) / NULLIF(COUNT(*) FILTER (WHERE "ativo" = true), 0),
  2
)::float8 AS "percentual"
FROM ai."Ativo"
LIMIT 1`,
    expected: {
      description:
        "Percentual entre zero e cem, excluindo o ativo desativado do denominador.",
      columns: ["percentual"],
      rowCount: { exact: 1 },
      valueRules: [numberRule("percentual", 0, 100)],
    },
  },
  {
    id: "materiais-estoque-baixo",
    question: "Quais materiais ativos estão abaixo do estoque mínimo?",
    categories: ["filter"],
    relevantViews: ["Material"],
    sql: `SELECT "codigo", "nome", "estoqueAtual"::float8 AS "estoqueAtual", "estoqueMinimo"::float8 AS "estoqueMinimo"
FROM ai."Material"
WHERE "ativo" = true AND "estoqueAtual" < "estoqueMinimo"
ORDER BY "codigo"
LIMIT 100`,
    expected: {
      description:
        "Somente materiais estritamente abaixo do mínimo; igualdade não é estoque baixo no dashboard.",
      columns: ["codigo", "nome", "estoqueAtual", "estoqueMinimo"],
      rowCount: { exact: 3 },
      exactRows: [
        {
          codigo: "MAT-007",
          nome: "Mangueira hidráulica de alta pressão",
          estoqueAtual: 0,
          estoqueMinimo: 6,
        },
        {
          codigo: "MAT-010",
          nome: "Bateria 12V 150Ah",
          estoqueAtual: 2,
          estoqueMinimo: 3,
        },
        {
          codigo: "MAT-022",
          nome: "Kit de reparo da caixa de transmissão",
          estoqueAtual: 0,
          estoqueMinimo: 1,
        },
      ],
    },
  },
  {
    id: "valor-total-estoque",
    question: "Qual é o valor total estimado do estoque atual?",
    categories: ["aggregation"],
    relevantViews: ["Material"],
    sql: `SELECT SUM("estoqueAtual" * "custoMedio")::float8 AS "valorTotal"
FROM ai."Material"
WHERE "ativo" = true
LIMIT 1`,
    expected: {
      description:
        "Valor fixo do catálogo sintético antes do consumo simulado.",
      columns: ["valorTotal"],
      rowCount: { exact: 1 },
      exactRows: [{ valorTotal: 49180 }],
    },
  },
  {
    id: "maiores-valores-estoque",
    question:
      "Quais materiais representam os cinco maiores valores em estoque?",
    categories: ["aggregation", "top-n"],
    relevantViews: ["Material"],
    sql: `SELECT "codigo", "nome", ("estoqueAtual" * "custoMedio")::float8 AS "valorEstoque"
FROM ai."Material"
WHERE "ativo" = true
ORDER BY "valorEstoque" DESC, "codigo"
LIMIT 5`,
    expected: {
      description: "Cinco maiores valores de estoque, em ordem decrescente.",
      columns: ["codigo", "nome", "valorEstoque"],
      rowCount: { exact: 5 },
      exactRows: [
        { codigo: "MAT-014", nome: "Pneu 295/80 R22.5", valorEstoque: 11400 },
        { codigo: "MAT-006", nome: "Óleo hidráulico", valorEstoque: 4800 },
        { codigo: "MAT-020", nome: "Dente de caçamba", valorEstoque: 4160 },
        {
          codigo: "MAT-005",
          nome: "Óleo lubrificante 15W40",
          valorEstoque: 3920,
        },
        { codigo: "MAT-011", nome: "Alternador", valorEstoque: 2500 },
      ],
      orderedBy: { column: "valorEstoque", direction: "desc" },
    },
  },
  {
    id: "os-em-andamento-por-status",
    question: "Quantas ordens de serviço ainda estão em andamento por status?",
    categories: ["aggregation", "filter"],
    relevantViews: ["OrdemServico"],
    sql: `SELECT "status"::text AS "status", COUNT(*)::int AS "total"
FROM ai."OrdemServico"
WHERE "status" NOT IN ('ENCERRADA', 'CANCELADA')
GROUP BY "status"
ORDER BY "status"
LIMIT 100`,
    expected: {
      description:
        "Ao menos a O.S. atual plantada no seed permanece em andamento.",
      columns: ["status", "total"],
      rowCount: { min: 1, max: 3 },
      valueRules: [
        {
          column: "status",
          type: "string",
          oneOf: ["ABERTA", "EM_EXECUCAO", "AGUARDANDO_PECA"],
        },
        numberRule("total", 1),
      ],
    },
  },
  {
    id: "os-atrasadas",
    question:
      "Quantas ordens de serviço estavam atrasadas em 27 de outubro de 2026 ao meio-dia UTC?",
    categories: ["aggregation", "date", "filter"],
    relevantViews: ["OrdemServico"],
    sql: `SELECT COUNT(*)::int AS "total"
FROM ai."OrdemServico"
WHERE "status" NOT IN ('ENCERRADA', 'CANCELADA')
  AND "prazoEm" < TIMESTAMPTZ '${SYNTHETIC_REFERENCE_TIME}'
LIMIT 1`,
    expected: {
      description:
        "Contagem não negativa usando a data de referência fixa do seed.",
      columns: ["total"],
      rowCount: { exact: 1 },
      valueRules: [numberRule("total")],
    },
  },
  {
    id: "os-maior-custo-top5",
    question: "Quais foram as cinco ordens de serviço de maior custo?",
    categories: ["top-n", "join"],
    relevantViews: ["OrdemServico", "Ativo"],
    sql: `SELECT os."numero", os."titulo", a."codigo" AS "ativoCodigo", os."custoTotal"::float8 AS "custoTotal"
FROM ai."OrdemServico" os
JOIN ai."Ativo" a ON a."id" = os."ativoId"
ORDER BY os."custoTotal" DESC, os."numero"
LIMIT 5`,
    expected: {
      description: "Cinco O.S. ordenadas do maior para o menor custo total.",
      columns: ["numero", "titulo", "ativoCodigo", "custoTotal"],
      rowCount: { exact: 5 },
      valueRules: [numberRule("custoTotal")],
      orderedBy: { column: "custoTotal", direction: "desc" },
    },
  },
  {
    id: "os-por-mes",
    question:
      "Quantas ordens de serviço foram abertas por mês nos seis meses simulados?",
    categories: ["aggregation", "date"],
    relevantViews: ["OrdemServico"],
    sql: `SELECT TO_CHAR(DATE_TRUNC('month', "abertaEm"), 'YYYY-MM') AS "mes", COUNT(*)::int AS "total"
FROM ai."OrdemServico"
WHERE "abertaEm" >= TIMESTAMPTZ '2026-04-01T00:00:00.000Z'
  AND "abertaEm" <= TIMESTAMPTZ '${SYNTHETIC_REFERENCE_TIME}'
GROUP BY DATE_TRUNC('month', "abertaEm")
ORDER BY DATE_TRUNC('month', "abertaEm")
LIMIT 12`,
    expected: {
      description: "Série mensal não vazia dentro da janela simulada.",
      columns: ["mes", "total"],
      rowCount: { min: 1, max: 7 },
      valueRules: [{ column: "mes", type: "string" }, numberRule("total", 1)],
    },
  },
  {
    id: "custos-acumulados-os",
    question:
      "Qual foi o custo acumulado de materiais, mão de obra e total das ordens?",
    categories: ["aggregation"],
    relevantViews: ["OrdemServico"],
    sql: `SELECT
  COALESCE(SUM("custoMateriais"), 0)::float8 AS "materiais",
  COALESCE(SUM("custoMaoObra"), 0)::float8 AS "maoDeObra",
  COALESCE(SUM("custoTotal"), 0)::float8 AS "total"
FROM ai."OrdemServico"
LIMIT 1`,
    expected: {
      description:
        "Custos acumulados não negativos e calculados exclusivamente das O.S. visíveis.",
      columns: ["materiais", "maoDeObra", "total"],
      rowCount: { exact: 1 },
      valueRules: [
        numberRule("materiais"),
        numberRule("maoDeObra"),
        numberRule("total"),
      ],
    },
  },
  {
    id: "paradas-abertas",
    question: "Quais ativos possuem uma parada aberta agora?",
    categories: ["filter", "join"],
    relevantViews: ["ParadaAtivo", "Ativo"],
    sql: `SELECT a."codigo", a."nome", p."inicioEm", p."motivo"
FROM ai."ParadaAtivo" p
JOIN ai."Ativo" a ON a."id" = p."ativoId"
WHERE p."status" = 'ABERTA'
ORDER BY p."inicioEm", a."codigo"
LIMIT 100`,
    expected: {
      description:
        "Inclui ao menos a parada atual do ativo problemático plantado.",
      columns: ["codigo", "nome", "inicioEm", "motivo"],
      rowCount: { min: 1, max: 18 },
    },
  },
  {
    id: "media-duracao-paradas",
    question: "Qual foi a duração média, em minutos, das paradas encerradas?",
    categories: ["aggregation", "filter"],
    relevantViews: ["ParadaAtivo"],
    sql: `SELECT ROUND(AVG("duracaoMinutos"), 2)::float8 AS "mediaMinutos"
FROM ai."ParadaAtivo"
WHERE "status" = 'ENCERRADA' AND "duracaoMinutos" IS NOT NULL
LIMIT 1`,
    expected: {
      description: "Média positiva calculada apenas sobre paradas encerradas.",
      columns: ["mediaMinutos"],
      rowCount: { exact: 1 },
      valueRules: [numberRule("mediaMinutos", 0.01)],
    },
  },
  {
    id: "ativos-maior-tempo-parado",
    question:
      "Quais foram os cinco ativos com maior tempo de parada encerrada?",
    categories: ["aggregation", "join", "top-n"],
    relevantViews: ["ParadaAtivo", "Ativo"],
    sql: `SELECT a."codigo", a."nome", SUM(p."duracaoMinutos")::float8 AS "minutosParados"
FROM ai."ParadaAtivo" p
JOIN ai."Ativo" a ON a."id" = p."ativoId"
WHERE p."status" = 'ENCERRADA'
GROUP BY a."id", a."codigo", a."nome"
ORDER BY "minutosParados" DESC, a."codigo"
LIMIT 5`,
    expected: {
      description: "Cinco maiores totais históricos de parada encerrada.",
      columns: ["codigo", "nome", "minutosParados"],
      rowCount: { exact: 5 },
      valueRules: [numberRule("minutosParados", 0.01)],
      orderedBy: { column: "minutosParados", direction: "desc" },
    },
  },
  {
    id: "materiais-mais-consumidos",
    question: "Quais foram os cinco materiais mais consumidos nas ordens?",
    categories: ["aggregation", "join", "top-n"],
    relevantViews: ["OrdemServicoMaterial", "Material"],
    sql: `SELECT m."codigo", m."nome", SUM(item."quantidade")::float8 AS "quantidadeConsumida"
FROM ai."OrdemServicoMaterial" item
JOIN ai."Material" m ON m."id" = item."materialId"
WHERE item."status" = 'CONSUMIDO'
GROUP BY m."id", m."codigo", m."nome"
ORDER BY "quantidadeConsumida" DESC, m."codigo"
LIMIT 5`,
    expected: {
      description: "Cinco maiores somas de quantidade efetivamente consumida.",
      columns: ["codigo", "nome", "quantidadeConsumida"],
      rowCount: { exact: 5 },
      valueRules: [numberRule("quantidadeConsumida", 0.01)],
      orderedBy: { column: "quantidadeConsumida", direction: "desc" },
    },
  },
  {
    id: "horas-por-tecnico",
    question: "Quais técnicos registraram mais horas de trabalho?",
    categories: ["aggregation", "top-n"],
    relevantViews: ["ApontamentoOS"],
    sql: `SELECT "tecnicoNome", ROUND(SUM("duracaoMinutos") / 60.0, 2)::float8 AS "horas"
FROM ai."ApontamentoOS"
WHERE "duracaoMinutos" IS NOT NULL
GROUP BY "usuarioId", "tecnicoNome"
ORDER BY "horas" DESC, "tecnicoNome"
LIMIT 5`,
    expected: {
      description: "Cinco técnicos com maior total de horas apontadas.",
      columns: ["tecnicoNome", "horas"],
      rowCount: { exact: 5 },
      valueRules: [numberRule("horas", 0.01)],
      orderedBy: { column: "horas", direction: "desc" },
    },
  },
  {
    id: "alertas-pendentes-por-tipo",
    question: "Quantos alertas pendentes existem de cada tipo?",
    categories: ["aggregation", "filter"],
    relevantViews: ["Alerta"],
    sql: `SELECT "tipo"::text AS "tipo", COUNT(*)::int AS "total"
FROM ai."Alerta"
WHERE "status" IN ('ABERTO', 'LIDO')
GROUP BY "tipo"
ORDER BY "tipo"
LIMIT 100`,
    expected: {
      description:
        "Agrupamento não vazio dos alertas ainda não resolvidos nem ignorados.",
      columns: ["tipo", "total"],
      rowCount: { min: 1, max: 6 },
      valueRules: [numberRule("total", 1)],
    },
  },
  {
    id: "alertas-por-severidade",
    question: "Como os alertas estão distribuídos por severidade?",
    categories: ["aggregation"],
    relevantViews: ["Alerta"],
    sql: `SELECT "severidade"::text AS "severidade", COUNT(*)::int AS "total"
FROM ai."Alerta"
GROUP BY "severidade"
ORDER BY "severidade"
LIMIT 100`,
    expected: {
      description:
        "Distribuição não vazia entre as severidades previstas no domínio.",
      columns: ["severidade", "total"],
      rowCount: { min: 1, max: 5 },
      valueRules: [
        {
          column: "severidade",
          type: "string",
          oneOf: ["INFO", "BAIXA", "MEDIA", "ALTA", "CRITICA"],
        },
        numberRule("total", 1),
      ],
    },
  },
  {
    id: "evento-transmissao-ct07",
    question:
      "Quantas falhas na caixa de transmissão do caminhão CT-07 ocorreram em agosto de 2026?",
    categories: ["aggregation", "date", "filter", "join"],
    relevantViews: ["OrdemServico", "Ativo"],
    sql: `SELECT COUNT(*)::int AS "total"
FROM ai."OrdemServico" os
JOIN ai."Ativo" a ON a."id" = os."ativoId"
WHERE a."codigo" = 'CT-07'
  AND os."titulo" = 'Falha na caixa de transmissão'
  AND os."abertaEm" >= TIMESTAMPTZ '2026-08-01T00:00:00.000Z'
  AND os."abertaEm" < TIMESTAMPTZ '2026-09-01T00:00:00.000Z'
LIMIT 1`,
    expected: {
      description:
        "Uma ocorrência plantada por empresa para validar séries e picos.",
      columns: ["total"],
      rowCount: { exact: 1 },
      exactRows: [{ total: 1 }],
    },
  },
  {
    id: "ultimas-os-com-contexto",
    question: "Quais são as dez ordens mais recentes, com ativo e localização?",
    categories: ["date", "join", "top-n"],
    relevantViews: ["OrdemServico", "Ativo", "Localizacao"],
    sql: `SELECT os."numero", os."titulo", os."status", os."abertaEm", a."codigo" AS "ativoCodigo", l."nome" AS "localizacaoNome"
FROM ai."OrdemServico" os
JOIN ai."Ativo" a ON a."id" = os."ativoId"
LEFT JOIN ai."Localizacao" l ON l."id" = os."localizacaoId"
ORDER BY os."abertaEm" DESC, os."numero"
LIMIT 10`,
    expected: {
      description:
        "As dez O.S. mais recentes em ordem decrescente de abertura.",
      columns: [
        "numero",
        "titulo",
        "status",
        "abertaEm",
        "ativoCodigo",
        "localizacaoNome",
      ],
      rowCount: { exact: 10 },
      orderedBy: { column: "abertaEm", direction: "desc" },
    },
  },
] as const satisfies readonly QueryExample[];

function compareValues(
  left: unknown,
  right: unknown,
  direction: "asc" | "desc",
): number {
  const leftValue = left instanceof Date ? left.getTime() : left;
  const rightValue = right instanceof Date ? right.getTime() : right;
  const factor = direction === "asc" ? 1 : -1;

  if (leftValue === rightValue) return 0;
  return (leftValue! < rightValue! ? -1 : 1) * factor;
}

export function validateExpectedResult(
  rows: readonly Readonly<Record<string, unknown>>[],
  expected: ExpectedQueryResult,
  tenantCode: SyntheticTenantCode,
): string[] {
  const failures: string[] = [];
  const count = expected.rowCount;

  if (count?.exact !== undefined && rows.length !== count.exact) {
    failures.push(
      `quantidade esperada ${count.exact}, recebida ${rows.length}`,
    );
  }
  if (count?.min !== undefined && rows.length < count.min) {
    failures.push(`quantidade mínima ${count.min}, recebida ${rows.length}`);
  }
  if (count?.max !== undefined && rows.length > count.max) {
    failures.push(`quantidade máxima ${count.max}, recebida ${rows.length}`);
  }

  const expectedColumns = [...expected.columns].sort();
  for (const [index, row] of rows.entries()) {
    const columns = Object.keys(row).sort();
    if (JSON.stringify(columns) !== JSON.stringify(expectedColumns)) {
      failures.push(`linha ${index}: colunas ${columns.join(", ")}`);
    }
  }

  const exactRows =
    expected.exactRowsByTenant?.[tenantCode] ?? expected.exactRows;
  if (exactRows && JSON.stringify(rows) !== JSON.stringify(exactRows)) {
    failures.push("linhas diferentes do resultado exato esperado");
  }

  for (const rule of expected.valueRules ?? []) {
    for (const [index, row] of rows.entries()) {
      const value = row[rule.column];
      if (value === null && rule.nullable) continue;
      if (typeof value !== rule.type) {
        failures.push(
          `linha ${index}: ${rule.column} deveria ser ${rule.type}`,
        );
        continue;
      }
      if (rule.oneOf && !rule.oneOf.includes(value as never)) {
        failures.push(
          `linha ${index}: ${rule.column} fora dos valores permitidos`,
        );
      }
      if (
        typeof value === "number" &&
        rule.min !== undefined &&
        value < rule.min
      ) {
        failures.push(`linha ${index}: ${rule.column} menor que ${rule.min}`);
      }
      if (
        typeof value === "number" &&
        rule.max !== undefined &&
        value > rule.max
      ) {
        failures.push(`linha ${index}: ${rule.column} maior que ${rule.max}`);
      }
    }
  }

  if (expected.orderedBy) {
    for (let index = 1; index < rows.length; index += 1) {
      const previous = rows[index - 1]?.[expected.orderedBy.column];
      const current = rows[index]?.[expected.orderedBy.column];
      if (compareValues(previous, current, expected.orderedBy.direction) > 0) {
        failures.push(`ordenação inválida em ${expected.orderedBy.column}`);
        break;
      }
    }
  }

  return failures;
}
