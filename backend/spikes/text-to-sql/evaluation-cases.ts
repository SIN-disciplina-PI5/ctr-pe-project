export interface EvaluationCase {
  id: string;
  question: string;
  referenceSql: string;
  companyCode: "alpha-brazilian" | "alpha-international";
}

export const EVALUATION_CASES: readonly EvaluationCase[] = [
  {
    id: "ativos-indisponiveis",
    question: "Quais ativos da Alpha Brazilian estão indisponíveis?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT a.codigo, a.nome, a.status
FROM "Ativo" a
JOIN "Empresa" e ON e.id = a."empresaId"
WHERE e.codigo = 'alpha-brazilian'
  AND a.ativo = true
  AND a.status IN ('PARADO', 'EM_MANUTENCAO', 'AGUARDANDO_PECA')
ORDER BY a.codigo
LIMIT 100;`.trim(),
  },
  {
    id: "os-abertas-por-status",
    question: "Quantas O.S. abertas existem por status na Alpha Brazilian?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT o.status, COUNT(*)::int AS quantidade
FROM "OrdemServico" o
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian'
  AND o.status IN ('ABERTA', 'EM_EXECUCAO', 'AGUARDANDO_PECA')
GROUP BY o.status
ORDER BY o.status
LIMIT 100;`.trim(),
  },
  {
    id: "ativos-mais-corretivas",
    question: "Quais são os cinco ativos com mais manutenções corretivas na Alpha Brazilian?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT a.codigo, a.nome, COUNT(*)::int AS quantidade
FROM "OrdemServico" o
JOIN "Ativo" a ON a.id = o."ativoId"
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian' AND o.tipo = 'CORRETIVA'
GROUP BY a.id, a.codigo, a.nome
ORDER BY quantidade DESC, a.codigo
LIMIT 5;`.trim(),
  },
  {
    id: "materiais-estoque-baixo",
    question: "Quais materiais da Alpha International estão com estoque baixo?",
    companyCode: "alpha-international",
    referenceSql: `
SELECT m.codigo, m.nome, m."estoqueAtual", m."estoqueMinimo"
FROM "Material" m
JOIN "Empresa" e ON e.id = m."empresaId"
WHERE e.codigo = 'alpha-international'
  AND m.ativo = true
  AND m."estoqueAtual" <= m."estoqueMinimo"
ORDER BY m.codigo
LIMIT 100;`.trim(),
  },
  {
    id: "os-atrasadas",
    question: "Quais O.S. da Alpha Brazilian estão atrasadas em 27 de outubro de 2026?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT o.numero, o.titulo, o.status, o."prazoEm"
FROM "OrdemServico" o
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian'
  AND o.status IN ('ABERTA', 'EM_EXECUCAO', 'AGUARDANDO_PECA')
  AND o."prazoEm" < TIMESTAMPTZ '2026-10-27T12:00:00Z'
ORDER BY o."prazoEm"
LIMIT 100;`.trim(),
  },
  {
    id: "custo-agosto",
question:
  "Qual foi o custo total das O.S. que foram abertas durante agosto de 2026 na Alpha Brazilian?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT COALESCE(SUM(o."custoTotal"), 0) AS custo_total
FROM "OrdemServico" o
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian'
  AND o."abertaEm" >= TIMESTAMPTZ '2026-08-01T00:00:00Z'
  AND o."abertaEm" < TIMESTAMPTZ '2026-09-01T00:00:00Z'
LIMIT 100;`.trim(),
  },
  {
    id: "maior-media-parada",
    question:
  "Quais são os cinco ativos com maior duração média de parada na Alpha International?",
    companyCode: "alpha-international",
    referenceSql: `
SELECT a.codigo, a.nome, AVG(p."duracaoMinutos") AS media_minutos
FROM "ParadaAtivo" p
JOIN "Ativo" a ON a.id = p."ativoId"
JOIN "Empresa" e ON e.id = p."empresaId"
WHERE e.codigo = 'alpha-international' AND p.status = 'ENCERRADA'
GROUP BY a.id, a.codigo, a.nome
ORDER BY media_minutos DESC
LIMIT 5;`.trim(),
  },
  {
    id: "materiais-os-aguardando",
    question:
  "Quais materiais e qual quantidade total aparecem nas O.S. aguardando peça da Alpha Brazilian?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT m.codigo, m.nome, SUM(osm.quantidade) AS quantidade
FROM "OrdemServicoMaterial" osm
JOIN "Material" m ON m.id = osm."materialId"
JOIN "OrdemServico" o ON o.id = osm."ordemServicoId"
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian' AND o.status = 'AGUARDANDO_PECA'
GROUP BY m.id, m.codigo, m.nome
ORDER BY quantidade DESC
LIMIT 100;`.trim(),
  },
  {
    id: "ct07-agosto",
    question: "O que aconteceu com o ativo CT-07 da Alpha Brazilian em agosto de 2026?",
    companyCode: "alpha-brazilian",
    referenceSql: `
SELECT o.numero, o.titulo, o.status, o."abertaEm", o."encerradaEm",
       o."tempoAguardandoPecaMinutos", o."custoTotal"
FROM "OrdemServico" o
JOIN "Ativo" a ON a.id = o."ativoId"
JOIN "Empresa" e ON e.id = o."empresaId"
WHERE e.codigo = 'alpha-brazilian'
  AND a.codigo = 'CT-07'
  AND o."abertaEm" >= TIMESTAMPTZ '2026-08-01T00:00:00Z'
  AND o."abertaEm" < TIMESTAMPTZ '2026-09-01T00:00:00Z'
ORDER BY o."abertaEm"
LIMIT 100;`.trim(),
  },
  {
    id: "alertas-criticos",
    question: "Quais alertas críticos ainda estão abertos na Alpha International?",
    companyCode: "alpha-international",
    referenceSql: `
SELECT al.tipo, al.titulo, al.mensagem, al."geradoEm"
FROM "Alerta" al
JOIN "Empresa" e ON e.id = al."empresaId"
WHERE e.codigo = 'alpha-international'
  AND al.severidade = 'CRITICA'
  AND al.status = 'ABERTO'
ORDER BY al."geradoEm" DESC
LIMIT 100;`.trim(),
  },
];