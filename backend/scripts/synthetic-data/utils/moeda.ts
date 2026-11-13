const FATOR = 100;
const CASAS = 2;

export class Moeda {
  static arredondar(valor: number): number {
    return Math.round(valor * FATOR) / FATOR;
  }

  static somar(valores: readonly number[]): number {
    return Moeda.arredondar(valores.reduce((soma, valor) => soma + valor, 0));
  }

  static formatar(valor: number): string {
    return valor.toFixed(CASAS);
  }
}
