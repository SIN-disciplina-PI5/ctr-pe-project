import type { Criticidade, PerfilUsuario, PrismaClient, TipoAtivo } from "@prisma/client";
import type { Aleatorio } from "./utils/aleatorio";
import type { GeradorId } from "./utils/gerador-id";

export type Faixa = readonly [number, number];

export interface Peso<T> {
  valor: T;
  peso: number;
}

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
  tipo: TipoAtivo;
  criticidade: Criticidade;
  ativo: boolean;
}

export interface MaterialCriado {
  id: string;
  empresaId: string;
  codigo: string;
  custoMedio: number;
}
