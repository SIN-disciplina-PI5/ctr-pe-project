const PALETA = ["#F26A21", "#FFB020", "#10B981", "#71717A", "#8B5CF6", "#0EA5E9"];

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Cores com significado: verde = bom, âmbar = atenção, tons escuros = crítico.
const REGRAS: { contem: string; cor: string }[] = [
  { contem: "disponivel", cor: "#10B981" },
  { contem: "em uso", cor: "#F26A21" },
  { contem: "manutencao", cor: "#FFB020" },
  { contem: "parado", cor: "#71717A" },
  { contem: "aguardando", cor: "#8B5CF6" },
  { contem: "baixa", cor: "#10B981" },
  { contem: "media", cor: "#FFB020" },
  { contem: "alta", cor: "#F26A21" },
  { contem: "critica", cor: "#9A3412" },
  { contem: "urgente", cor: "#9A3412" },
  { contem: "preventiva", cor: "#10B981" },
  { contem: "corretiva", cor: "#FFB020" },
  { contem: "preditiva", cor: "#F26A21" },
];

// Devolve a cor do rótulo. Se não houver regra, usa a paleta pela posição.
export function corDoRotulo(rotulo: string, indice: number): string {
  const normal = normalizar(rotulo);
  const regra = REGRAS.find((item) => normal.includes(item.contem));
  return regra?.cor ?? PALETA[indice % PALETA.length];
}