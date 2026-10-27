import type { Criticidade, PerfilUsuario, Prisma, PrismaClient, StatusAtivo, TipoAtivo } from "@prisma/client";
import type { Aleatorio } from "./utils/aleatorio.js";
import type { GeradorId } from "./utils/gerador-id.js";

export type Faixa = readonly [number, number];

export interface Peso<T> {
  valor: T;
  peso: number;
}

export type TipoSimulado = Exclude<TipoAtivo, "OUTRO">;

export interface Contexto {
  prisma: PrismaClient;
  aleatorio: Aleatorio;
  ids: GeradorId;
  senhaHash: string;
}

export interface EmpresaCriada {
  id: string;
  codigo: string;
  nome: string;
  adminId: string;
}

export interface UsuarioCriado {
  id: string;
  empresaId: string;
  perfil: PerfilUsuario;
}

export interface UsuariosEmpresa {
  solicitantes: UsuarioCriado[];
  tecnicos: UsuarioCriado[];
}

export interface LocalizacaoCriada {
  id: string;
  empresaId: string;
  codigo: string;
}

export interface AtivoCriado {
  id: string;
  empresaId: string;
  localizacaoId: string | null;
  codigo: string;
  nome: string;
  tipo: TipoAtivo;
  criticidade: Criticidade;
  ativo: boolean;
}

export interface MaterialCriado {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  custoMedio: number;
  quantidade: Faixa;
}

export interface BaseSeed {
  empresas: EmpresaCriada[];
  usuarios: UsuarioCriado[];
  localizacoes: LocalizacaoCriada[];
  ativos: AtivoCriado[];
  materiais: MaterialCriado[];
}

export interface Falha {
  titulo: string;
  descricoes: readonly string[];
  diagnosticos: readonly string[];
  solucoes: readonly string[];
  materiais: readonly string[];
  horas: Faixa;
}

export interface OrdemServicoGerada {
  abertaEm: Date;
  fim: Date;
  statusAtivo: StatusAtivo | null;
  ordem: Prisma.OrdemServicoCreateManyInput;
  parada: Prisma.ParadaAtivoCreateManyInput | null;
  apontamentos: Prisma.ApontamentoOSCreateManyInput[];
  itens: Prisma.OrdemServicoMaterialCreateManyInput[];
  alertas: Prisma.AlertaCreateManyInput[];
  logs: Prisma.LogAuditoriaCreateManyInput[];
}
