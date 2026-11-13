import {
  Criticidade,
  PerfilUsuario,
  Prioridade,
  Severidade,
  StatusAtivo,
  StatusParada,
  TipoAtivo,
  TipoOS,
} from "@prisma/client";
import type { Faixa, Peso } from "./types.js";

export const FLAG_FORCE = "--force";
export const ESPERA_CONFIRMACAO_MS = 3_000;
export const SALT_ROUNDS = 10;
export const SENHA_PADRAO = process.env.SEED_ADMIN_PASSWORD ?? "@ChangeMe12345!";
export const SEMENTE = 42;
export const TAMANHO_LOTE = 400;

export const DATA_REFERENCIA = new Date("2026-10-27T12:00:00.000Z");
export const MESES_SIMULACAO = 6;

const inicioSimulacao = new Date(DATA_REFERENCIA);
inicioSimulacao.setUTCMonth(inicioSimulacao.getUTCMonth() - MESES_SIMULACAO);
export const INICIO_SIMULACAO = inicioSimulacao;

export const MINUTO_MS = 60_000;
export const HORA_MIN = 60;
export const DIA_MIN = 1_440;
export const TURNO_MAX_MIN = 480;
export const HORA_ABERTURA_UTC: Faixa = [9, 20];
export const MINUTO_ABERTURA: Faixa = [0, 59];

export const PREFIXO_ID = {
  empresa: "emp",
  usuario: "usr",
  localizacao: "loc",
  ativo: "atv",
  material: "mat",
  ordemServico: "os",
  parada: "par",
  apontamento: "apt",
  itemMaterial: "osm",
  alerta: "alt",
  log: "log",
} as const;

export const PREFIXO_NUMERO_OS = "OS";
export const DIGITOS_NUMERO_OS = 4;
export const TOKEN_NUMERO = "{{numero}}";
export const ENTIDADE_AUDITORIA_OS = "ordens-servico";
export const DIGITOS_CODIGO_ATIVO = 2;
export const SUFIXO_EMAIL = ".com";

export const TABELAS = [
  "LogAuditoria",
  "Alerta",
  "ApontamentoOS",
  "OrdemServicoMaterial",
  "ParadaAtivo",
  "OrdemServico",
  "Material",
  "Ativo",
  "Localizacao",
  "RefreshToken",
  "Usuario",
  "Empresa",
] as const;

export const EMPRESAS = [
  {
    codigo: "alpha-international",
    nome: "Alpha International",
    admin: { nome: "International Admin", email: "international-admin@alpha-international.com" },
  },
  {
    codigo: "alpha-brazilian",
    nome: "Alpha Brazilian",
    admin: { nome: "Brazilian Admin", email: "brazilian-admin@alpha-brazilian.com" },
  },
] as const;

export const USUARIOS_POR_PERFIL = [
  { perfil: PerfilUsuario.GESTOR, quantidade: 1 },
  { perfil: PerfilUsuario.SUPERVISOR, quantidade: 2 },
  { perfil: PerfilUsuario.TECNICO, quantidade: 6 },
  { perfil: PerfilUsuario.CONSULTA, quantidade: 1 },
] as const;

export const PERFIS_SOLICITANTES: readonly PerfilUsuario[] = [
  PerfilUsuario.GESTOR,
  PerfilUsuario.SUPERVISOR,
  PerfilUsuario.TECNICO,
];

export const LOCALIZACOES = [
  { codigo: "LOC-01", nome: "Oficina Central", tipo: "Oficina" },
  { codigo: "LOC-02", nome: "Pátio de Veículos", tipo: "Pátio" },
  { codigo: "LOC-03", nome: "Galpão A", tipo: "Galpão" },
  { codigo: "LOC-04", nome: "Setor de Geração de Energia", tipo: "Setor" },
] as const;

export const LOCALIZACAO_POR_TIPO: Record<TipoAtivo, string> = {
  MAQUINA: "LOC-03",
  CAMINHAO: "LOC-02",
  EQUIPAMENTO: "LOC-04",
  COMPONENTE: "LOC-01",
  OUTRO: "LOC-01",
};

export const CODIGO_ATIVO_DESATIVADO = "BMB-02";

export const PESO_CRITICIDADE: readonly Peso<Criticidade>[] = [
  { valor: Criticidade.BAIXA, peso: 15 },
  { valor: Criticidade.MEDIA, peso: 45 },
  { valor: Criticidade.ALTA, peso: 30 },
  { valor: Criticidade.CRITICA, peso: 10 },
];

export const INTERVALO_ENTRE_OS_DIAS: Record<Criticidade, Faixa> = {
  BAIXA: [18, 35],
  MEDIA: [12, 25],
  ALTA: [8, 18],
  CRITICA: [6, 14],
};

export const CHANCE_CORRETIVA = 0.55;

export const PESO_TIPO_NAO_CORRETIVA: readonly Peso<TipoOS>[] = [
  { valor: TipoOS.PREVENTIVA, peso: 70 },
  { valor: TipoOS.INSPECAO, peso: 30 },
];

export const CHANCE_IMPACTA: Record<TipoOS, number> = {
  CORRETIVA: 0.92,
  PREVENTIVA: 0.35,
  INSPECAO: 0,
  OUTRA: 0,
};

export const PESO_PRIORIDADE_CORRETIVA: Record<Criticidade, readonly Peso<Prioridade>[]> = {
  BAIXA: [
    { valor: Prioridade.BAIXA, peso: 50 },
    { valor: Prioridade.MEDIA, peso: 40 },
    { valor: Prioridade.ALTA, peso: 10 },
  ],
  MEDIA: [
    { valor: Prioridade.BAIXA, peso: 20 },
    { valor: Prioridade.MEDIA, peso: 50 },
    { valor: Prioridade.ALTA, peso: 25 },
    { valor: Prioridade.CRITICA, peso: 5 },
  ],
  ALTA: [
    { valor: Prioridade.MEDIA, peso: 30 },
    { valor: Prioridade.ALTA, peso: 50 },
    { valor: Prioridade.CRITICA, peso: 20 },
  ],
  CRITICA: [
    { valor: Prioridade.ALTA, peso: 40 },
    { valor: Prioridade.CRITICA, peso: 60 },
  ],
};

export const PRIORIDADE_NAO_CORRETIVA: Record<TipoOS, Prioridade> = {
  CORRETIVA: Prioridade.MEDIA,
  PREVENTIVA: Prioridade.MEDIA,
  INSPECAO: Prioridade.BAIXA,
  OUTRA: Prioridade.BAIXA,
};

export const PRAZO_HORAS: Record<Prioridade, number> = {
  BAIXA: 360,
  MEDIA: 168,
  ALTA: 72,
  CRITICA: 24,
};

export const ATRASO_INICIO_MIN: Record<Prioridade, Faixa> = {
  BAIXA: [600, 7_200],
  MEDIA: [240, 2_880],
  ALTA: [60, 600],
  CRITICA: [30, 180],
};

export const CHANCE_CANCELAMENTO = 0.03;
export const CANCELAMENTO_MIN: Faixa = [120, 2_880];
export const CHANCE_ESPERA_ALEATORIA = 0.06;
export const ESPERA_ALEATORIA_DIAS: Faixa = [1, 4];
export const FRACAO_FASE_INICIAL = 0.4;
export const CHANCE_TECNICO_ALTERNATIVO = 0.3;
export const CHANCE_DEVOLUCAO_MATERIAL = 0.03;
export const CHANCE_EM_USO = 0.6;
export const CHANCE_OS_EM_ANDAMENTO = 0.3;
export const JANELA_OS_EM_ANDAMENTO_DIAS = 25;
export const MARGEM_OS_EM_ANDAMENTO_MIN = 1_440;
export const CHANCE_FALHA_PECA_ATRASO_ATUAL = 0.5;
export const PESO_JANELA_ATUAL = { aberta: 20, execucao: 30, espera: 40, retomada: 10 } as const;
export const FAIXA_VARIACAO_CUSTO: Faixa = [0.92, 1.12];
export const CUSTO_HORA: Faixa = [45, 95];
export const CHANCE_ALERTA_LIDO = 0.5;
export const LIDO_APOS_MIN: Faixa = [5, 600];
export const ATRASO_ALERTA_ESTOQUE_DIAS: Faixa = [0, 10];

export const SEVERIDADE_ATIVO_PARADO: Record<Criticidade, Severidade> = {
  BAIXA: Severidade.MEDIA,
  MEDIA: Severidade.MEDIA,
  ALTA: Severidade.ALTA,
  CRITICA: Severidade.CRITICA,
};

export const STATUS_ATIVO_POR_STATUS_OS: Partial<Record<string, StatusAtivo>> = {
  ABERTA: StatusAtivo.PARADO,
  EM_EXECUCAO: StatusAtivo.EM_MANUTENCAO,
  AGUARDANDO_PECA: StatusAtivo.AGUARDANDO_PECA,
};

export const STATUS_PARADA_POR_STATUS_OS: Partial<Record<string, StatusParada>> = {
  ENCERRADA: StatusParada.ENCERRADA,
  CANCELADA: StatusParada.CANCELADA,
};

export const DESCRICOES_APONTAMENTO: readonly string[] = [
  "Execução do serviço conforme o diagnóstico.",
  "Desmontagem, substituição de componentes e testes.",
  "Intervenção no equipamento e verificação do funcionamento.",
  "Trabalho de reparo e conferência final.",
];

export const OBSERVACOES_AGUARDANDO_PECA: readonly string[] = [
  "Aguardando chegada da peça do fornecedor.",
  "Pedido de compra emergencial aberto junto ao fornecedor.",
  "Equipamento parado até a entrega da peça solicitada.",
];

export const OBSERVACAO_CANCELAMENTO = "OS cancelada: serviço deixou de ser necessário.";
