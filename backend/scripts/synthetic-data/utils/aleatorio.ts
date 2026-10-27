import { fakerPT_BR } from "@faker-js/faker";
import type { Faixa, Peso } from "../types";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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

  escolher<T>(lista: readonly T[]): T {
    return lista[this.inteiro(0, lista.length - 1)];
  }

  escolherPonderado<T>(itens: readonly Peso<T>[]): T {
    const total = itens.reduce((soma, item) => soma + item.peso, 0);
    let restante = this.inteiro(1, total);
    for (const item of itens) {
      restante -= item.peso;
      if (restante <= 0) return item.valor;
    }
    return itens[itens.length - 1].valor;
  }

  nome(): string {
    return fakerPT_BR.person.fullName();
  }

  placa(): string {
    const letra = () => LETRAS[this.inteiro(0, LETRAS.length - 1)];
    return `${letra()}${letra()}${letra()}${this.inteiroEm(DIGITO)}${letra()}${this.inteiroEm(SUFIXO_PLACA)}`;
  }
}
