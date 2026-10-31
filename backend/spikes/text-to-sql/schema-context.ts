type SchemaTableConfig = {
  schema: string;
  enums?: readonly string[];
  rules?: readonly string[];
};

const TABLE_CONTEXT = {
  Empresa: {
    schema: '"Empresa": id text, codigo text, nome text, ativa boolean.',
    rules: [
      'Nome "Alpha International" -> codigo "alpha-international".',
      'Nome "Alpha Brazilian" -> codigo "alpha-brazilian".',
    ],
  },
  Ativo: {
    schema:
      '"Ativo": id text, "empresaId" text, codigo text, nome text, tipo text, status text, criticidade text, ativo boolean.',
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
    enums: [
      "StatusOS: ABERTA, EM_EXECUCAO, AGUARDANDO_PECA, ENCERRADA, CANCELADA.",
      "TipoOS: CORRETIVA, PREVENTIVA, INSPECAO, OUTRA.",
    ],
    rules: [
      "O.S. aberta possui status ABERTA, EM_EXECUCAO ou AGUARDANDO_PECA.",
      "O.S. atrasada é uma O.S. aberta cujo prazoEm é anterior à data de referência.",
    ],
  },
  ParadaAtivo: {
    schema:
      '"ParadaAtivo": id text, "empresaId" text, "ativoId" text, "ordemServicoId" text, status text, "inicioEm" timestamp, "fimEm" timestamp, "duracaoMinutos" integer, programada boolean, "impactaDisponibilidade" boolean.',
    enums: ["StatusParada: ABERTA, ENCERRADA, CANCELADA."],
    rules: [
      "Média de parada considera somente paradas ENCERRADAS com duracaoMinutos.",
    ],
  },
  Material: {
    schema:
      '"Material": id text, "empresaId" text, codigo text, nome text, "estoqueAtual" numeric, "estoqueMinimo" numeric, "custoMedio" numeric, ativo boolean.',
    rules: [
      "Material com estoque baixo possui ativo = true e estoqueAtual menor ou igual a estoqueMinimo.",
    ],
  },
  OrdemServicoMaterial: {
    schema:
      '"OrdemServicoMaterial": id text, "ordemServicoId" text, "materialId" text, quantidade numeric, "custoTotal" numeric, status text.',
    enums: [
      "StatusMaterialOS: SOLICITADO, CONSUMIDO, DEVOLVIDO, CANCELADO.",
    ],
  },
  Alerta: {
    schema:
      '"Alerta": id text, "empresaId" text, "ativoId" text, "ordemServicoId" text, tipo text, severidade text, status text, titulo text, mensagem text, "geradoEm" timestamp.',
    enums: [
      "StatusAlerta: ABERTO, LIDO, RESOLVIDO, IGNORADO.",
      "Severidade: INFO, BAIXA, MEDIA, ALTA, CRITICA.",
    ],
  },
} as const satisfies Record<string, SchemaTableConfig>;

export type SchemaTableName = keyof typeof TABLE_CONTEXT;
export type SchemaContextVariant = "full" | "relevant";

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

export function buildSchemaContext(options: {
  variant: SchemaContextVariant;
  relevantTables?: readonly SchemaTableName[];
}): string {
  const allTables = Object.keys(TABLE_CONTEXT) as SchemaTableName[];
  const selected =
    options.variant === "full"
      ? allTables
      : allTables.filter(
          (table) =>
            table === "Empresa" || options.relevantTables?.includes(table),
        );

  const selectedSet = new Set(selected);
  const relationships = RELATIONSHIPS.filter((relationship) =>
    relationship.tables.every((table) => selectedSet.has(table)),
  );
  const enums = selected.flatMap(
  (table) => (TABLE_CONTEXT[table] as SchemaTableConfig).enums ?? [],
);
const rules = selected.flatMap(
  (table) => (TABLE_CONTEXT[table] as SchemaTableConfig).rules ?? [],
);

  return [
    "Banco PostgreSQL. Todos os identificadores com letras maiúsculas exigem aspas duplas.",
    selected.map((table) => TABLE_CONTEXT[table].schema).join("\n"),
    relationships.length
      ? `Relacionamentos:\n${relationships.map((item) => item.description).join("\n")}`
      : "",
    enums.length ? `Enums:\n${enums.join("\n")}` : "",
    rules.length ? `Regras de negócio:\n${rules.join("\n")}` : "",
    [
      "Regras de escrita SQL:",
      "Use aspas duplas em todos os nomes reais de tabelas e colunas.",
      "Não use barras invertidas antes das aspas no SQL.",
      "Aliases podem permanecer sem aspas.",
      'Exemplo correto: SELECT a."codigo" FROM "Ativo" AS a.',
      'Toda consulta deve limitar os dados à empresa indicada por meio de "Empresa".codigo.',
      "A data de referência dos dados sintéticos é 2026-10-27T12:00:00Z.",
    ].join("\n"),
  ]
    .filter(Boolean)
    .join("\n\n");
}

export const SCHEMA_CONTEXT = buildSchemaContext({ variant: "full" });