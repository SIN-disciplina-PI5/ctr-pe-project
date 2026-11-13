import type { AiViewName } from "./schema-context.js";

const VIEW_TERMS: Readonly<Record<AiViewName, readonly string[]>> = {
  Empresa: ["empresa", "companhia"],
  Localizacao: [
    "localizacao",
    "localizacoes",
    "oficina",
    "patio",
    "galpao",
    "setor",
  ],
  Ativo: [
    "ativo",
    "ativos",
    "frota",
    "maquina",
    "maquinas",
    "caminhao",
    "caminhoes",
    "equipamento",
    "equipamentos",
    "componente",
    "criticidade",
    "disponibilidade",
  ],
  OrdemServico: [
    "ordem de servico",
    "ordens de servico",
    "ordem",
    "ordens",
    "manutencao",
    "manutencoes",
    "falha",
    "falhas",
    "prazo",
    "prioridade",
  ],
  ParadaAtivo: ["parada", "paradas", "tempo parado", "indisponibilidade"],
  Material: [
    "material",
    "materiais",
    "estoque",
    "peca",
    "pecas",
    "bateria",
    "oleo",
    "pneu",
  ],
  OrdemServicoMaterial: [
    "material consumido",
    "materiais consumidos",
    "consumido",
    "consumidos",
    "consumida",
    "consumidas",
    "consumo de material",
    "consumo de materiais",
    "quantidade consumida",
  ],
  ApontamentoOS: [
    "apontamento",
    "apontamentos",
    "tecnico",
    "tecnicos",
    "horas de trabalho",
    "horas trabalhadas",
  ],
  Alerta: ["alerta", "alertas", "severidade"],
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function inferRelevantViews(question: string): readonly AiViewName[] {
  const normalizedQuestion = normalize(question);

  return (Object.entries(VIEW_TERMS) as [AiViewName, readonly string[]][])
    .filter(([, terms]) =>
      terms.some((term) => normalizedQuestion.includes(term)),
    )
    .map(([view]) => view);
}
