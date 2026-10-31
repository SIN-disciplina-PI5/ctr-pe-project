type SchemaTableConfig = {
  schema: string;
  snakeCaseSchema: string;
  enums?: readonly string[];
  rules?: readonly string[];
  snakeCaseRules?: readonly string[];
};

const TABLE_CONTEXT = {
  Empresa: {
    schema: '"Empresa": id text, codigo text, nome text, ativa boolean.',
    snakeCaseSchema:
      "ai.empresas: id text, codigo text, nome text, ativa boolean.",
    rules: [
      'Nome "Alpha International" -> codigo "alpha-international".',
      'Nome "Alpha Brazilian" -> codigo "alpha-brazilian".',
    ],
  },
  Ativo: {
    schema:
      '"Ativo": id text, "empresaId" text, codigo text, nome text, tipo text, status text, criticidade text, ativo boolean.',
    snakeCaseSchema:
      "ai.ativos: id text, empresa_id text, codigo text, nome text, tipo text, status text, criticidade text, ativo boolean.",
    enums: [
      "StatusAtivo: DISPONIVEL, EM_USO, PARADO, EM_MANUTENCAO, AGUARDANDO_PECA, DESATIVADO.",
    ],
    rules: [
      "Ativo indisponível é um ativo com ativo = true e status PARADO, EM_MANUTENCAO ou AGUARDANDO_PECA.",
    ],
  },
  OrdemServico: {
    schema:
      '"OrdemServico": id text, "empresaId" text, "ativoId" text, numero text, titulo text, tipo text, status text, prioridade text, "abertaEm" timestamp, "iniciadaEm" timestamp, "encerradaEm" timestamp, "prazoEm" timestamp, "tempoAguardandoPecaMinutos" integer, "tempoExecucaoMinutos" integer, "custoMateriais" numeric, "custoMaoObra" numeric, "custoTotal" numeric.',
    snakeCaseSchema:
      "ai.ordens_servico: id text, empresa_id text, ativo_id text, numero text, titulo text, tipo text, status text, prioridade text, aberta_em timestamp, iniciada_em timestamp, encerrada_em timestamp, prazo_em timestamp, tempo_aguardando_peca_minutos integer, tempo_execucao_minutos integer, custo_materiais numeric, custo_mao_obra numeric, custo_total numeric.",
    enums: [
      "StatusOS: ABERTA, EM_EXECUCAO, AGUARDANDO_PECA, ENCERRADA, CANCELADA.",
      "TipoOS: CORRETIVA, PREVENTIVA, INSPECAO, OUTRA.",
    ],
    rules: [
      "O.S. aberta possui status ABERTA, EM_EXECUCAO ou AGUARDANDO_PECA.",
      "O.S. atrasada é uma O.S. aberta cujo prazoEm é anterior à data de referência.",
    ],
    snakeCaseRules: [
      "O.S. aberta possui status ABERTA, EM_EXECUCAO ou AGUARDANDO_PECA.",
      "O.S. atrasada é uma O.S. aberta cujo prazo_em é anterior à data de referência.",
    ],
  },
  ParadaAtivo: {
    schema:
      '"ParadaAtivo": id text, "empresaId" text, "ativoId" text, "ordemServicoId" text, status text, "inicioEm" timestamp, "fimEm" timestamp, "duracaoMinutos" integer, programada boolean, "impactaDisponibilidade" boolean.',
    snakeCaseSchema:
      "ai.paradas: id text, empresa_id text, ativo_id text, ordem_servico_id text, status text, inicio_em timestamp, fim_em timestamp, duracao_minutos integer, programada boolean, impacta_disponibilidade boolean.",
    enums: ["StatusParada: ABERTA, ENCERRADA, CANCELADA."],
    rules: [
      "Média de parada considera somente paradas ENCERRADAS com duracaoMinutos.",
    ],
    snakeCaseRules: [
      "Média de parada considera somente paradas ENCERRADAS com duracao_minutos.",
    ],
  },
  Material: {
    schema:
      '"Material": id text, "empresaId" text, codigo text, nome text, "estoqueAtual" numeric, "estoqueMinimo" numeric, "custoMedio" numeric, ativo boolean.',
    snakeCaseSchema:
      "ai.materiais: id text, empresa_id text, codigo text, nome text, estoque_atual numeric, estoque_minimo numeric, custo_medio numeric, ativo boolean.",
    rules: [
      "Material com estoque baixo possui ativo = true e estoqueAtual menor ou igual a estoqueMinimo.",
    ],
    snakeCaseRules: [
      "Material com estoque baixo possui ativo = true e estoque_atual menor ou igual a estoque_minimo.",
    ],
  },
  OrdemServicoMaterial: {
    schema:
      '"OrdemServicoMaterial": id text, "ordemServicoId" text, "materialId" text, quantidade numeric, "custoTotal" numeric, status text.',
    snakeCaseSchema:
      "ai.os_materiais: id text, ordem_servico_id text, material_id text, quantidade numeric, custo_total numeric, status text.",
    enums: [
      "StatusMaterialOS: SOLICITADO, CONSUMIDO, DEVOLVIDO, CANCELADO.",
    ],
  },
  Alerta: {
    schema:
      '"Alerta": id text, "empresaId" text, "ativoId" text, "ordemServicoId" text, tipo text, severidade text, status text, titulo text, mensagem text, "geradoEm" timestamp.',
    snakeCaseSchema:
      "ai.alertas: id text, empresa_id text, ativo_id text, ordem_servico_id text, tipo text, severidade text, status text, titulo text, mensagem text, gerado_em timestamp.",
    enums: [
      "StatusAlerta: ABERTO, LIDO, RESOLVIDO, IGNORADO.",
      "Severidade: INFO, BAIXA, MEDIA, ALTA, CRITICA.",
    ],
  },
} as const satisfies Record<string, SchemaTableConfig>;

export type SchemaTableName = keyof typeof TABLE_CONTEXT;
export type SchemaContextVariant = "full" | "relevant";
export type SchemaContextNaming = "prisma" | "snake_case";

const RELATIONSHIPS: readonly {
  tables: readonly SchemaTableName[];
  description: string;
}[] = [
  { tables: ["Ativo", "Empresa"], description: '"Ativo"."empresaId" -> "Empresa".id.' },
  { tables: ["OrdemServico", "Empresa"], description: '"OrdemServico"."empresaId" -> "Empresa".id.' },
  { tables: ["OrdemServico", "Ativo"], description: '"OrdemServico"."ativoId" -> "Ativo".id.' },
  { tables: ["ParadaAtivo", "Ativo"], description: '"ParadaAtivo"."ativoId" -> "Ativo".id.' },
  { tables: ["ParadaAtivo", "OrdemServico"], description: '"ParadaAtivo"."ordemServicoId" -> "OrdemServico".id.' },
  { tables: ["Material", "Empresa"], description: '"Material"."empresaId" -> "Empresa".id.' },
  { tables: ["OrdemServicoMaterial", "OrdemServico"], description: '"OrdemServicoMaterial"."ordemServicoId" -> "OrdemServico".id.' },
  { tables: ["OrdemServicoMaterial", "Material"], description: '"OrdemServicoMaterial"."materialId" -> "Material".id.' },
  { tables: ["Alerta", "Empresa"], description: '"Alerta"."empresaId" -> "Empresa".id.' },
];

const SNAKE_CASE_RELATIONSHIPS: typeof RELATIONSHIPS = [
  { tables: ["Ativo", "Empresa"], description: "ai.ativos.empresa_id -> ai.empresas.id." },
  { tables: ["OrdemServico", "Empresa"], description: "ai.ordens_servico.empresa_id -> ai.empresas.id." },
  { tables: ["OrdemServico", "Ativo"], description: "ai.ordens_servico.ativo_id -> ai.ativos.id." },
  { tables: ["ParadaAtivo", "Ativo"], description: "ai.paradas.ativo_id -> ai.ativos.id." },
  { tables: ["ParadaAtivo", "OrdemServico"], description: "ai.paradas.ordem_servico_id -> ai.ordens_servico.id." },
  { tables: ["Material", "Empresa"], description: "ai.materiais.empresa_id -> ai.empresas.id." },
  { tables: ["OrdemServicoMaterial", "OrdemServico"], description: "ai.os_materiais.ordem_servico_id -> ai.ordens_servico.id." },
  { tables: ["OrdemServicoMaterial", "Material"], description: "ai.os_materiais.material_id -> ai.materiais.id." },
  { tables: ["Alerta", "Empresa"], description: "ai.alertas.empresa_id -> ai.empresas.id." },
];

export function buildSchemaContext(options: {
  variant: SchemaContextVariant;
  relevantTables?: readonly SchemaTableName[];
  naming?: SchemaContextNaming;
}): string {
  const naming = options.naming ?? "prisma";
  const allTables = Object.keys(TABLE_CONTEXT) as SchemaTableName[];
  const selected =
    options.variant === "full"
      ? allTables
      : allTables.filter(
          (table) =>
            table === "Empresa" || options.relevantTables?.includes(table),
        );

  const selectedSet = new Set(selected);
  const relationshipCatalog =
    naming === "snake_case" ? SNAKE_CASE_RELATIONSHIPS : RELATIONSHIPS;
  const relationships = relationshipCatalog.filter((relationship) =>
    relationship.tables.every((table) => selectedSet.has(table)),
  );
  const enums = selected.flatMap(
  (table) => (TABLE_CONTEXT[table] as SchemaTableConfig).enums ?? [],
);
const rules = selected.flatMap((table) => {
  const tableContext = TABLE_CONTEXT[table] as SchemaTableConfig;
  return naming === "snake_case"
    ? tableContext.snakeCaseRules ?? tableContext.rules ?? []
    : tableContext.rules ?? [];
});

  const writingRules =
    naming === "snake_case"
      ? [
          "Regras de escrita SQL:",
          "Use somente as views do schema ai apresentadas no contexto.",
          "Use nomes de views e colunas em snake_case, sem acessar as tabelas Prisma originais.",
          "Aliases podem permanecer sem aspas.",
          "Exemplo correto: SELECT a.codigo FROM ai.ativos AS a.",
          "Toda consulta deve limitar os dados à empresa indicada por meio de ai.empresas.codigo.",
          "A data de referência dos dados sintéticos é 2026-10-27T12:00:00Z.",
        ]
      : [
          "Regras de escrita SQL:",
          "Use aspas duplas em todos os nomes reais de tabelas e colunas.",
          "Não use barras invertidas antes das aspas no SQL.",
          "Aliases podem permanecer sem aspas.",
          'Exemplo correto: SELECT a."codigo" FROM "Ativo" AS a.',
          'Toda consulta deve limitar os dados à empresa indicada por meio de "Empresa".codigo.',
          "A data de referência dos dados sintéticos é 2026-10-27T12:00:00Z.",
        ];

  return [
    naming === "snake_case"
      ? "Banco PostgreSQL. Consulte somente as views analíticas do schema ai."
      : "Banco PostgreSQL. Todos os identificadores com letras maiúsculas exigem aspas duplas.",
    selected
      .map((table) =>
        naming === "snake_case"
          ? TABLE_CONTEXT[table].snakeCaseSchema
          : TABLE_CONTEXT[table].schema,
      )
      .join("\n"),
    relationships.length
      ? `Relacionamentos:\n${relationships.map((item) => item.description).join("\n")}`
      : "",
    enums.length ? `Enums:\n${enums.join("\n")}` : "",
    rules.length ? `Regras de negócio:\n${rules.join("\n")}` : "",
    writingRules.join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export const SCHEMA_CONTEXT = buildSchemaContext({ variant: "full" });
