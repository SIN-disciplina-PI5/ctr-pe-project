import { Criticidade, PerfilUsuario, TipoAtivo } from "@prisma/client";
import type { Peso } from "./types";

export const FLAG_FORCE = "--force";
export const ESPERA_CONFIRMACAO_MS = 3_000;
export const SALT_ROUNDS = 10;
export const SENHA_PADRAO = process.env.SEED_ADMIN_PASSWORD ?? "@ChangeMe12345!";
export const SEMENTE = 42;

export const PREFIXO_ID = {
  empresa: "emp",
  usuario: "usr",
  localizacao: "loc",
  ativo: "atv",
  material: "mat",
} as const;

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
