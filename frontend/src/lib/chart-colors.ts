const PALETA = ["#1E3A8A", "#3B82F6", "#14B8A6", "#F59E0B", "#8B5CF6", "#64748B"];

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Cores com significado: verde = bom, âmbar = atenção, tons escuros = crítico.
const REGRAS: { contem: string; cor: string }[] = [
  { contem: "disponivel", cor: "#10B981" },
  { contem: "em uso", cor: "#3B82F6" },
  { contem: "manutencao", cor: "#F59E0B" },
  { contem: "parado", cor: "#475569" },
  { contem: "aguardando", cor: "#8B5CF6" },
  { contem: "baixa", cor: "#10B981" },
  { contem: "media", cor: "#F59E0B" },
  { contem: "alta", cor: "#EA580C" },
  { contem: "critica", cor: "#7C2D12" },
  { contem: "urgente", cor: "#7C2D12" },
  { contem: "preventiva", cor: "#10B981" },
  { contem: "corretiva", cor: "#F59E0B" },
  { contem: "preditiva", cor: "#3B82F6" },
];

// Devolve a cor do rótulo. Se não houver regra, usa a paleta pela posição.
export function corDoRotulo(rotulo: string, indice: number): string {
  const normal = normalizar(rotulo);
  const regra = REGRAS.find((item) => normal.includes(item.contem));
  return regra?.cor ?? PALETA[indice % PALETA.length];
}