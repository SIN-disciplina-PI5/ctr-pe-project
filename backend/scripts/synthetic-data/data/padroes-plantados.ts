import { Criticidade, Prioridade } from "@prisma/client";
import type { Faixa, Falha } from "../types.js";

export const ATIVO_PROBLEMATICO = {
  codigo: "CT-07",
  criticidade: Criticidade.ALTA,
  intervaloDias: [2, 5] as Faixa,
  chanceCorretiva: 0.85,
  multiplicadorExecucao: 1.4,
  emAndamentoAgora: true,
};

export const MATERIAL_ATRASO = {
  codigo: "MAT-007",
  chance: 0.85,
  esperaDias: [4, 9] as Faixa,
};

export const PICO_CUSTO = {
  ano: 2026,
  mes: 8,
  chance: 0.4,
  materiais: ["MAT-021", "MAT-011"] as readonly string[],
  complementoDiagnostico: "Constatado dano adicional em componente de maior custo.",
  complementoSolucao: "Componente danificado substituído em conjunto com o reparo principal.",
};

const FALHA_TRANSMISSAO: Falha = {
  titulo: "Falha na caixa de transmissão",
  descricoes: [
    "Caminhão perdeu tração e apresentou ruído forte na caixa de transmissão.",
    "Marchas não engatam e há vibração intensa na transmissão durante a carga.",
    "Operador relatou travamento de marchas e cheiro de óleo queimado.",
  ],
  diagnosticos: [
    "Engrenagens e sincronizadores da caixa de transmissão danificados, exigindo reparo completo.",
    "Desgaste severo dos sincronizadores com limalha metálica no óleo da transmissão.",
    "Rolamentos da caixa de transmissão colapsados, com dano nas engrenagens.",
  ],
  solucoes: [
    "Realizado o reparo completo da caixa de transmissão com kit de reparo e troca do óleo.",
    "Caixa de transmissão desmontada e reconstruída com kit novo; óleo substituído e teste em rampa aprovado.",
    "Substituídos sincronizadores, engrenagens e rolamentos pelo kit de reparo; veículo testado e liberado.",
  ],
  materiais: ["MAT-022", "MAT-005"],
  horas: [24, 36],
};

export const EVENTO_TRANSMISSAO = {
  codigoAtivo: "CT-07",
  data: new Date("2026-08-11T11:00:00.000Z"),
  esperaPecaDias: 14,
  prioridade: Prioridade.CRITICA,
  falha: FALHA_TRANSMISSAO,
};
