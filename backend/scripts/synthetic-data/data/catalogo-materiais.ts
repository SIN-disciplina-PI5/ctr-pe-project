export interface ModeloMaterial {
  codigo: string;
  nome: string;
  descricao: string;
  unidade: string;
  custoMedio: number;
  estoqueMinimo: number;
  estoqueAtual: number;
}

export const MODELOS_MATERIAIS: readonly ModeloMaterial[] = [
  { codigo: "MAT-001", nome: "Filtro de óleo do motor", descricao: "Filtro de óleo lubrificante para motores diesel.", unidade: "UN", custoMedio: 85, estoqueMinimo: 10, estoqueAtual: 24 },
  { codigo: "MAT-002", nome: "Filtro de combustível", descricao: "Filtro separador de água e combustível.", unidade: "UN", custoMedio: 70, estoqueMinimo: 10, estoqueAtual: 18 },
  { codigo: "MAT-003", nome: "Filtro de ar", descricao: "Elemento filtrante primário do sistema de admissão.", unidade: "UN", custoMedio: 120, estoqueMinimo: 6, estoqueAtual: 12 },
  { codigo: "MAT-004", nome: "Filtro hidráulico", descricao: "Elemento filtrante do circuito hidráulico.", unidade: "UN", custoMedio: 210, estoqueMinimo: 4, estoqueAtual: 9 },
  { codigo: "MAT-005", nome: "Óleo lubrificante 15W40", descricao: "Óleo mineral para motores diesel.", unidade: "L", custoMedio: 28, estoqueMinimo: 60, estoqueAtual: 140 },
  { codigo: "MAT-006", nome: "Óleo hidráulico", descricao: "Óleo hidráulico ISO VG 68.", unidade: "L", custoMedio: 24, estoqueMinimo: 80, estoqueAtual: 200 },
  { codigo: "MAT-007", nome: "Mangueira hidráulica de alta pressão", descricao: "Mangueira com conexões para circuitos de alta pressão.", unidade: "UN", custoMedio: 180, estoqueMinimo: 6, estoqueAtual: 8 },
  { codigo: "MAT-008", nome: "Jogo de pastilhas de freio", descricao: "Jogo de pastilhas para freio de caminhão.", unidade: "UN", custoMedio: 340, estoqueMinimo: 4, estoqueAtual: 7 },
  { codigo: "MAT-009", nome: "Correia do alternador", descricao: "Correia poly-V do alternador.", unidade: "UN", custoMedio: 95, estoqueMinimo: 5, estoqueAtual: 10 },
  { codigo: "MAT-010", nome: "Bateria 12V 150Ah", descricao: "Bateria estacionária livre de manutenção.", unidade: "UN", custoMedio: 650, estoqueMinimo: 3, estoqueAtual: 4 },
  { codigo: "MAT-011", nome: "Alternador", descricao: "Alternador 24V para máquinas e caminhões.", unidade: "UN", custoMedio: 1250, estoqueMinimo: 1, estoqueAtual: 2 },
  { codigo: "MAT-012", nome: "Motor de partida", descricao: "Motor de partida 24V.", unidade: "UN", custoMedio: 1480, estoqueMinimo: 1, estoqueAtual: 1 },
  { codigo: "MAT-013", nome: "Kit de vedação de cilindro hidráulico", descricao: "Kit com retentores, anéis e guias.", unidade: "UN", custoMedio: 420, estoqueMinimo: 3, estoqueAtual: 5 },
  { codigo: "MAT-014", nome: "Pneu 295/80 R22.5", descricao: "Pneu radial para caminhão off-road.", unidade: "UN", custoMedio: 1900, estoqueMinimo: 4, estoqueAtual: 6 },
  { codigo: "MAT-015", nome: "Rolamento de roda", descricao: "Rolamento cônico do cubo de roda.", unidade: "UN", custoMedio: 140, estoqueMinimo: 6, estoqueAtual: 11 },
  { codigo: "MAT-016", nome: "Graxa multiuso", descricao: "Graxa de lítio para lubrificação geral.", unidade: "KG", custoMedio: 32, estoqueMinimo: 10, estoqueAtual: 30 },
  { codigo: "MAT-017", nome: "Bomba d'água", descricao: "Bomba d'água do sistema de arrefecimento.", unidade: "UN", custoMedio: 560, estoqueMinimo: 2, estoqueAtual: 3 },
  { codigo: "MAT-018", nome: "Sensor de temperatura", descricao: "Sensor de temperatura do líquido de arrefecimento.", unidade: "UN", custoMedio: 130, estoqueMinimo: 3, estoqueAtual: 5 },
  { codigo: "MAT-019", nome: "Kit de fusíveis e relés", descricao: "Kit de reposição para o circuito elétrico.", unidade: "UN", custoMedio: 45, estoqueMinimo: 8, estoqueAtual: 14 },
  { codigo: "MAT-020", nome: "Dente de caçamba", descricao: "Dente de escavadeira com pino de fixação.", unidade: "UN", custoMedio: 260, estoqueMinimo: 8, estoqueAtual: 16 },
  { codigo: "MAT-021", nome: "Radiador", descricao: "Radiador do sistema de arrefecimento do motor.", unidade: "UN", custoMedio: 2100, estoqueMinimo: 1, estoqueAtual: 1 },
  { codigo: "MAT-022", nome: "Kit de reparo da caixa de transmissão", descricao: "Kit com engrenagens, sincronizadores e rolamentos.", unidade: "UN", custoMedio: 8900, estoqueMinimo: 1, estoqueAtual: 1 },
];
