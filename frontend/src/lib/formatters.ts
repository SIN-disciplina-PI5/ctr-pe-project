// Funções para exibir valores de forma amigável (moeda, tempo, rótulos).

export function formatBRL(value: number): string {
  const seguro = Number.isFinite(value) ? value : 0;
  const fixo = Math.abs(seguro).toFixed(2);
  const [inteiro, decimal] = fixo.split(".");
  const comPontos = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sinal = seguro < 0 ? "-" : "";
  return `${sinal}R$ ${comPontos},${decimal}`;
}

export function formatMinutos(min: number): string {
  const total = Math.max(0, Math.round(min || 0));
  if (total < 60) return `${total} min`;
  const horas = Math.floor(total / 60);
  const resto = total % 60;
  return resto === 0 ? `${horas}h` : `${horas}h ${resto}min`;
}

// Transforma "AGUARDANDO_PECA" em "Aguardando peca"
export function formatRotulo(valor: string): string {
  const texto = valor.replace(/_/g, " ").toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}