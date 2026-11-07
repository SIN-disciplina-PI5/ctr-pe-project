export interface AiColumnDefinition {
  readonly name: string;
  readonly type: string;
  readonly nullable?: boolean;
}

export interface AiViewDefinition {
  readonly description: string;
  readonly columns: readonly AiColumnDefinition[];
  readonly enums?: Readonly<Record<string, readonly string[]>>;
  readonly rules?: readonly string[];
}

const column = (
  name: string,
  type: string,
  nullable = false,
): AiColumnDefinition => ({ name, type, ...(nullable ? { nullable } : {}) });

export const AI_SCHEMA_CATALOG = {
  Empresa: {
    description: "Empresa visível para a sessão de consulta da IA.",
    columns: [
      column("id", "text"),
      column("codigo", "text", true),
      column("nome", "text"),
      column("ativa", "boolean"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    rules: ["Empresa ativa: ativa = true."],
  },
  Localizacao: {
    description: "Localizações operacionais da empresa da sessão.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("codigo", "text", true),
      column("nome", "text"),
      column("tipo", "text", true),
      column("ativa", "boolean"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    rules: ["Localização ativa: ativa = true."],
  },
  Ativo: {
    description: "Ativos da empresa, com identificação e situação operacional.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("localizacaoId", "text", true),
      column("codigo", "text"),
      column("nome", "text"),
      column("descricao", "text", true),
      column("tipo", "TipoAtivo"),
      column("status", "StatusAtivo"),
      column("criticidade", "Criticidade"),
      column("marca", "text", true),
      column("modelo", "text", true),
      column("numeroSerie", "text", true),
      column("placa", "text", true),
      column("horimetroAtual", "numeric", true),
      column("odometroAtual", "numeric", true),
      column("ativo", "boolean"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    enums: {
      TipoAtivo: ["MAQUINA", "CAMINHAO", "EQUIPAMENTO", "COMPONENTE", "OUTRO"],
      StatusAtivo: [
        "DISPONIVEL",
        "EM_USO",
        "PARADO",
        "EM_MANUTENCAO",
        "AGUARDANDO_PECA",
        "DESATIVADO",
      ],
      Criticidade: ["BAIXA", "MEDIA", "ALTA", "CRITICA"],
    },
    rules: [
      "Ativo cadastralmente ativo: ativo = true.",
      "Máquina parada no dashboard: status = 'PARADO'.",
    ],
  },
  OrdemServico: {
    description: "Ordens de serviço sem credenciais ou outros dados sensíveis de usuários.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("localizacaoId", "text", true),
      column("ativoId", "text"),
      column("solicitanteId", "text", true),
      column("solicitanteNome", "text", true),
      column("responsavelId", "text", true),
      column("responsavelNome", "text", true),
      column("numero", "text"),
      column("titulo", "text"),
      column("descricao", "text"),
      column("tipo", "TipoOS"),
      column("status", "StatusOS"),
      column("prioridade", "Prioridade"),
      column("impactaDisponibilidade", "boolean"),
      column("abertaEm", "timestamp"),
      column("iniciadaEm", "timestamp", true),
      column("encerradaEm", "timestamp", true),
      column("canceladaEm", "timestamp", true),
      column("prazoEm", "timestamp", true),
      column("aguardandoPecaDesde", "timestamp", true),
      column("tempoAguardandoPecaMinutos", "integer", true),
      column("tempoParadoMinutos", "integer", true),
      column("tempoExecucaoMinutos", "integer", true),
      column("custoMateriais", "numeric"),
      column("custoMaoObra", "numeric"),
      column("custoTotal", "numeric"),
      column("diagnostico", "text", true),
      column("solucao", "text", true),
      column("observacao", "text", true),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    enums: {
      TipoOS: ["CORRETIVA", "PREVENTIVA", "INSPECAO", "OUTRA"],
      StatusOS: ["ABERTA", "EM_EXECUCAO", "AGUARDANDO_PECA", "ENCERRADA", "CANCELADA"],
      Prioridade: ["BAIXA", "MEDIA", "ALTA", "CRITICA"],
    },
    rules: [
      "O.S. ainda não iniciada: status = 'ABERTA'.",
      "O.S. em andamento: status NOT IN ('ENCERRADA', 'CANCELADA').",
      "O.S. aguardando peça: status = 'AGUARDANDO_PECA'.",
      "O.S. atrasada: status NOT IN ('ENCERRADA', 'CANCELADA') AND prazoEm < instante de referência.",
    ],
  },
  ParadaAtivo: {
    description: "Períodos de parada dos ativos da empresa.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("ativoId", "text"),
      column("ordemServicoId", "text", true),
      column("status", "StatusParada"),
      column("inicioEm", "timestamp"),
      column("fimEm", "timestamp", true),
      column("duracaoMinutos", "integer", true),
      column("motivo", "text", true),
      column("programada", "boolean"),
      column("impactaDisponibilidade", "boolean"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    enums: { StatusParada: ["ABERTA", "ENCERRADA", "CANCELADA"] },
    rules: [
      "Parada aberta: status = 'ABERTA'.",
      "Tempo médio de parada: média de duracaoMinutos somente quando status = 'ENCERRADA'.",
      "Considere impacto na disponibilidade somente quando impactaDisponibilidade = true.",
    ],
  },
  Material: {
    description: "Materiais e posição de estoque da empresa.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("codigo", "text"),
      column("nome", "text"),
      column("descricao", "text", true),
      column("unidade", "text"),
      column("estoqueAtual", "numeric"),
      column("estoqueMinimo", "numeric"),
      column("custoMedio", "numeric"),
      column("ativo", "boolean"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    rules: [
      "Material com estoque baixo: ativo = true AND estoqueAtual < estoqueMinimo.",
    ],
  },
  OrdemServicoMaterial: {
    description: "Materiais solicitados, consumidos, devolvidos ou cancelados por ordem de serviço.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("ordemServicoId", "text"),
      column("materialId", "text"),
      column("quantidade", "numeric"),
      column("custoUnitario", "numeric"),
      column("custoTotal", "numeric"),
      column("status", "StatusMaterialOS"),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    enums: {
      StatusMaterialOS: ["SOLICITADO", "CONSUMIDO", "DEVOLVIDO", "CANCELADO"],
    },
    rules: ["Material efetivamente consumido: status = 'CONSUMIDO'."],
  },
  ApontamentoOS: {
    description: "Apontamentos de trabalho por ordem de serviço, sem credenciais do técnico.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("ordemServicoId", "text"),
      column("usuarioId", "text"),
      column("tecnicoNome", "text"),
      column("inicioEm", "timestamp"),
      column("fimEm", "timestamp", true),
      column("duracaoMinutos", "integer", true),
      column("descricao", "text", true),
      column("custoHora", "numeric", true),
      column("custoTotal", "numeric", true),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    rules: [
      "Apontamento finalizado: fimEm IS NOT NULL; duracaoMinutos pode ser usado nos cálculos de tempo.",
    ],
  },
  Alerta: {
    description: "Alertas operacionais da empresa.",
    columns: [
      column("id", "text"),
      column("empresaId", "text"),
      column("ativoId", "text", true),
      column("ordemServicoId", "text", true),
      column("tipo", "TipoAlerta"),
      column("severidade", "Severidade"),
      column("status", "StatusAlerta"),
      column("titulo", "text"),
      column("mensagem", "text"),
      column("geradoEm", "timestamp"),
      column("lidoEm", "timestamp", true),
      column("resolvidoEm", "timestamp", true),
      column("createdAt", "timestamp"),
      column("updatedAt", "timestamp"),
    ],
    enums: {
      TipoAlerta: [
        "ATIVO_PARADO",
        "OS_ATRASADA",
        "AGUARDANDO_PECA",
        "ESTOQUE_BAIXO",
        "CUSTO_ALTO",
        "OUTRO",
      ],
      Severidade: ["INFO", "BAIXA", "MEDIA", "ALTA", "CRITICA"],
      StatusAlerta: ["ABERTO", "LIDO", "RESOLVIDO", "IGNORADO"],
    },
    rules: [
      "Alerta pendente de tratamento: status IN ('ABERTO', 'LIDO').",
      "Alerta resolvido: status = 'RESOLVIDO'.",
    ],
  },
} as const satisfies Record<string, AiViewDefinition>;

export type AiViewName = keyof typeof AI_SCHEMA_CATALOG;

export const AI_VIEW_NAMES = Object.freeze(
  Object.keys(AI_SCHEMA_CATALOG) as AiViewName[],
);

interface AiRelationship {
  readonly views: readonly AiViewName[];
  readonly description: string;
}

export const AI_RELATIONSHIPS: readonly AiRelationship[] = [
  { views: ["Localizacao", "Empresa"], description: '"Localizacao"."empresaId" = "Empresa"."id"' },
  { views: ["Ativo", "Empresa"], description: '"Ativo"."empresaId" = "Empresa"."id"' },
  { views: ["Ativo", "Localizacao"], description: '"Ativo"."localizacaoId" = "Localizacao"."id"' },
  { views: ["OrdemServico", "Empresa"], description: '"OrdemServico"."empresaId" = "Empresa"."id"' },
  { views: ["OrdemServico", "Localizacao"], description: '"OrdemServico"."localizacaoId" = "Localizacao"."id"' },
  { views: ["OrdemServico", "Ativo"], description: '"OrdemServico"."ativoId" = "Ativo"."id"' },
  { views: ["ParadaAtivo", "Empresa"], description: '"ParadaAtivo"."empresaId" = "Empresa"."id"' },
  { views: ["ParadaAtivo", "Ativo"], description: '"ParadaAtivo"."ativoId" = "Ativo"."id"' },
  { views: ["ParadaAtivo", "OrdemServico"], description: '"ParadaAtivo"."ordemServicoId" = "OrdemServico"."id"' },
  { views: ["Material", "Empresa"], description: '"Material"."empresaId" = "Empresa"."id"' },
  { views: ["OrdemServicoMaterial", "Empresa"], description: '"OrdemServicoMaterial"."empresaId" = "Empresa"."id"' },
  { views: ["OrdemServicoMaterial", "OrdemServico"], description: '"OrdemServicoMaterial"."ordemServicoId" = "OrdemServico"."id"' },
  { views: ["OrdemServicoMaterial", "Material"], description: '"OrdemServicoMaterial"."materialId" = "Material"."id"' },
  { views: ["ApontamentoOS", "Empresa"], description: '"ApontamentoOS"."empresaId" = "Empresa"."id"' },
  { views: ["ApontamentoOS", "OrdemServico"], description: '"ApontamentoOS"."ordemServicoId" = "OrdemServico"."id"' },
  { views: ["Alerta", "Empresa"], description: '"Alerta"."empresaId" = "Empresa"."id"' },
  { views: ["Alerta", "Ativo"], description: '"Alerta"."ativoId" = "Ativo"."id"' },
  { views: ["Alerta", "OrdemServico"], description: '"Alerta"."ordemServicoId" = "OrdemServico"."id"' },
];

export interface BuildSchemaContextOptions {
  readonly relevantViews?: readonly AiViewName[];
}

export function selectRelevantViews(
  requested: readonly AiViewName[] = AI_VIEW_NAMES,
): readonly AiViewName[] {
  const unknown = requested.filter((view) => !(view in AI_SCHEMA_CATALOG));

  if (unknown.length > 0) {
    throw new Error(`Views de IA desconhecidas: ${unknown.join(", ")}`);
  }

  const requestedSet = new Set(requested);
  return AI_VIEW_NAMES.filter((view) => requestedSet.has(view));
}

function quote(identifier: string): string {
  return `"${identifier}"`;
}

function renderView(viewName: AiViewName): string {
  const view = AI_SCHEMA_CATALOG[viewName] as AiViewDefinition;
  const columns = view.columns
    .map((item) => `${quote(item.name)} ${item.type}${item.nullable ? " NULL" : " NOT NULL"}`)
    .join(", ");

  return `ai.${quote(viewName)} (${columns}) — ${view.description}`;
}

function renderEnums(selected: readonly AiViewName[]): string[] {
  const enums = new Map<string, readonly string[]>();

  for (const viewName of selected) {
    const view = AI_SCHEMA_CATALOG[viewName] as AiViewDefinition;
    for (const [name, values] of Object.entries(view.enums ?? {})) {
      enums.set(name, values);
    }
  }

  return [...enums.entries()].map(
    ([name, values]) => `${name}: ${values.join(", ")}.`,
  );
}

export function buildSchemaContext(
  options: BuildSchemaContextOptions = {},
): string {
  const selected = selectRelevantViews(options.relevantViews);
  const selectedSet = new Set(selected);
  const relationships = AI_RELATIONSHIPS.filter((relationship) =>
    relationship.views.every((view) => selectedSet.has(view)),
  );
  const rules = selected.flatMap((viewName) => {
    const view = AI_SCHEMA_CATALOG[viewName] as AiViewDefinition;
    return view.rules?.map((rule) => `${viewName}: ${rule}`) ?? [];
  });
  const sections = [
    "Banco PostgreSQL. Consulte exclusivamente as views autorizadas do schema ai listadas abaixo.",
    [
      "Regras SQL:",
      "- Use a nomenclatura Prisma e aspas duplas nos nomes das views e colunas.",
      "- Nunca consulte o schema public nem tabelas que não aparecem neste contexto.",
      "- O isolamento da empresa é aplicado pela sessão do banco; não tente trocar ou ampliar a empresa da sessão.",
      "- Trate o instante de referência informado pela solicitação como o momento atual para regras de prazo.",
    ].join("\n"),
    `Views autorizadas:\n${selected.map(renderView).join("\n")}`,
    relationships.length > 0
      ? `Relacionamentos disponíveis:\n${relationships.map((item) => item.description).join("\n")}`
      : "",
    renderEnums(selected).length > 0
      ? `Enums:\n${renderEnums(selected).join("\n")}`
      : "",
    rules.length > 0 ? `Regras de negócio:\n${rules.join("\n")}` : "",
  ];

  return sections.filter(Boolean).join("\n\n");
}

export const FULL_SCHEMA_CONTEXT = buildSchemaContext();
