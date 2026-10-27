import { TipoAtivo } from "@prisma/client";
import type { Faixa } from "../types.js";

export interface MarcaModelo {
  marca: string;
  modelo: string;
}

export interface ModeloAtivo {
  prefixo: string;
  nome: string;
  tipo: TipoAtivo;
  quantidade: number;
  marcas: readonly MarcaModelo[];
  contador: "horimetro" | "odometro";
  faixaContador: Faixa;
}

export const MODELOS_ATIVOS: readonly ModeloAtivo[] = [
  {
    prefixo: "EX",
    nome: "Escavadeira hidráulica",
    tipo: TipoAtivo.MAQUINA,
    quantidade: 4,
    marcas: [
      { marca: "Caterpillar", modelo: "320D" },
      { marca: "Komatsu", modelo: "PC210" },
      { marca: "Volvo", modelo: "EC210" },
    ],
    contador: "horimetro",
    faixaContador: [3_000, 12_000],
  },
  {
    prefixo: "CT",
    nome: "Caminhão basculante",
    tipo: TipoAtivo.CAMINHAO,
    quantidade: 8,
    marcas: [
      { marca: "Volvo", modelo: "FMX 500" },
      { marca: "Scania", modelo: "P360" },
      { marca: "Mercedes-Benz", modelo: "Actros 3344" },
    ],
    contador: "odometro",
    faixaContador: [80_000, 420_000],
  },
  {
    prefixo: "GER",
    nome: "Gerador diesel",
    tipo: TipoAtivo.EQUIPAMENTO,
    quantidade: 4,
    marcas: [
      { marca: "Cummins", modelo: "C150D5" },
      { marca: "Perkins", modelo: "1106A" },
      { marca: "Stemac", modelo: "GS-125" },
    ],
    contador: "horimetro",
    faixaContador: [1_500, 9_000],
  },
  {
    prefixo: "BMB",
    nome: "Bomba hidráulica reserva",
    tipo: TipoAtivo.COMPONENTE,
    quantidade: 2,
    marcas: [
      { marca: "Rexroth", modelo: "A10VSO" },
      { marca: "Parker", modelo: "PV180" },
    ],
    contador: "horimetro",
    faixaContador: [200, 3_000],
  },
];
