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
    quantidade: 16,
    marcas: [
      { marca: "Caterpillar", modelo: "320D" },
      { marca: "Komatsu", modelo: "PC210" },
      { marca: "Volvo", modelo: "EC210" },
    ],
    contador: "horimetro",
    faixaContador: [3_000, 12_000],
  },
  {
    prefixo: "RE",
    nome: "Retroescavadeira",
    tipo: TipoAtivo.MAQUINA,
    quantidade: 12,
    marcas: [
      { marca: "Case", modelo: "580N" },
      { marca: "JCB", modelo: "3CX" },
      { marca: "New Holland", modelo: "B95" },
    ],
    contador: "horimetro",
    faixaContador: [2_000, 10_000],
  },
  {
    prefixo: "PC",
    nome: "Pá carregadeira",
    tipo: TipoAtivo.MAQUINA,
    quantidade: 10,
    marcas: [
      { marca: "Caterpillar", modelo: "924K" },
      { marca: "Komatsu", modelo: "WA320" },
      { marca: "Volvo", modelo: "L90H" },
    ],
    contador: "horimetro",
    faixaContador: [2_500, 11_000],
  },
  {
    prefixo: "CT",
    nome: "Caminhão basculante",
    tipo: TipoAtivo.CAMINHAO,
    quantidade: 28,
    marcas: [
      { marca: "Volvo", modelo: "FMX 500" },
      { marca: "Scania", modelo: "P360" },
      { marca: "Mercedes-Benz", modelo: "Actros 3344" },
    ],
    contador: "odometro",
    faixaContador: [80_000, 420_000],
  },
  {
    prefixo: "CB",
    nome: "Caminhão comboio",
    tipo: TipoAtivo.CAMINHAO,
    quantidade: 10,
    marcas: [
      { marca: "Volkswagen", modelo: "Constellation 24.280" },
      { marca: "Ford", modelo: "Cargo 2429" },
      { marca: "Iveco", modelo: "Tector 240E28" },
    ],
    contador: "odometro",
    faixaContador: [60_000, 380_000],
  },
  {
    prefixo: "GER",
    nome: "Gerador diesel",
    tipo: TipoAtivo.EQUIPAMENTO,
    quantidade: 14,
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
    quantidade: 6,
    marcas: [
      { marca: "Rexroth", modelo: "A10VSO" },
      { marca: "Parker", modelo: "PV180" },
    ],
    contador: "horimetro",
    faixaContador: [200, 3_000],
  },
  {
    prefixo: "MTR",
    nome: "Motor hidráulico reserva",
    tipo: TipoAtivo.COMPONENTE,
    quantidade: 6,
    marcas: [
      { marca: "Rexroth", modelo: "A6VM" },
      { marca: "Parker", modelo: "V14" },
      { marca: "Danfoss", modelo: "OMS" },
    ],
    contador: "horimetro",
    faixaContador: [150, 2_500],
  },
];
