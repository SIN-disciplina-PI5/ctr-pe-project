import { MINUTO_MS } from "../config.js";

export class Tempo {
  static somarMinutos(data: Date, minutos: number): Date {
    return new Date(data.getTime() + minutos * MINUTO_MS);
  }

  static diferencaMinutos(inicio: Date, fim: Date): number {
    return Math.round((fim.getTime() - inicio.getTime()) / MINUTO_MS);
  }

  static minimo(a: Date, b: Date): Date {
    return a.getTime() <= b.getTime() ? a : b;
  }
}
