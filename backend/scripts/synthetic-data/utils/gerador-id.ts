const TAMANHO_SEQUENCIAL = 6;

export class GeradorId {
  private readonly contadores = new Map<string, number>();

  proximo(prefixo: string): string {
    const valor = (this.contadores.get(prefixo) ?? 0) + 1;
    this.contadores.set(prefixo, valor);
    return `${prefixo}_${String(valor).padStart(TAMANHO_SEQUENCIAL, "0")}`;
  }
}
