import { fakerPT_BR } from "@faker-js/faker";
import type { Faixa, Peso } from "../types.js";

const MENSAGEM_LISTA_VAZIA = "Não é possível sortear de uma lista vazia.";
const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PRECISAO_CHANCE = 10_000;
const FATOR_DECIMAL = 100;
const DIGITO: Faixa = [0, 9];
const SUFIXO_PLACA: Faixa = [10, 99];

export class Aleatorio {
  constructor(semente: number) {
    fakerPT_BR.seed(semente);
  }

  inteiro(min: number, max: number): number {
    return fakerPT_BR.number.int({ min, max });
  }

  inteiroEm(faixa: Faixa): number {
    return this.inteiro(faixa[0], faixa[1]);
  }

  decimal(faixa: Faixa): number {
    return this.inteiro(Math.round(faixa[0] * FATOR_DECIMAL), Math.round(faixa[1] * FATOR_DECIMAL)) / FATOR_DECIMAL;
  }

  chance(probabilidade: number): boolean {
    return this.inteiro(1, PRECISAO_CHANCE) <= probabilidade * PRECISAO_CHANCE;
  }

  escolher<T>(lista: readonly T[]): T {
    const item = lista[this.inteiro(0, lista.length - 1)];
    if (item === undefined) throw new Error(MENSAGEM_LISTA_VAZIA);
    return item;
  }

  escolherPonderado<T>(itens: readonly Peso<T>[]): T {
    const total = itens.reduce((soma, item) => soma + item.peso, 0);
    let restante = this.inteiro(1, total);
    for (const item of itens) {
      restante -= item.peso;
      if (restante <= 0) return item.valor;
    }
    const ultimo = itens[itens.length - 1];
    if (!ultimo) throw new Error(MENSAGEM_LISTA_VAZIA);
    return ultimo.valor;
  }

  nome(): string {
    return fakerPT_BR.person.fullName();
  }

  placa(): string {
    const letra = () => LETRAS[this.inteiro(0, LETRAS.length - 1)];
    return `${letra()}${letra()}${letra()}${this.inteiroEm(DIGITO)}${letra()}${this.inteiroEm(SUFIXO_PLACA)}`;
  }
}
