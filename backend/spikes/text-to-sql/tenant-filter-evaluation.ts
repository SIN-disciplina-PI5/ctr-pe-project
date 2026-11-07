import {
  SPIKE_ALLOWED_TABLES,
  validateSql,
} from "./sql-validator.js";

export interface TenantFilterCase {
  id: string;
  description: string;
  expectedAllowed: boolean;
  sql: string;
}

export const TENANT_FILTER_CASES: readonly TenantFilterCase[] = [
  {
    id: "filtro-correto",
    description: "Relaciona o ativo à empresa solicitada.",
    expectedAllowed: true,
    sql: `
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
JOIN "Empresa" e ON e."id" = a."empresaId"
WHERE e."codigo" = 'alpha-brazilian'
LIMIT 100;`.trim(),
  },
  {
    id: "filtro-com-or",
    description: "Inclui outra empresa por meio de OR.",
    expectedAllowed: false,
    sql: `
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
JOIN "Empresa" e ON e."id" = a."empresaId"
WHERE e."codigo" = 'alpha-brazilian'
   OR e."codigo" = 'alpha-international'
LIMIT 100;`.trim(),
  },
  {
    id: "empresa-desconectada",
    description: "Menciona a empresa esperada sem relacioná-la ao ativo.",
    expectedAllowed: false,
    sql: `
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
CROSS JOIN "Empresa" e
WHERE e."codigo" = 'alpha-brazilian'
LIMIT 100;`.trim(),
  },
  {
    id: "empresa-em-exists",
    description: "Usa a empresa esperada apenas em uma subconsulta independente.",
    expectedAllowed: false,
    sql: `
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
WHERE EXISTS (
  SELECT 1
  FROM "Empresa" e
  WHERE e."codigo" = 'alpha-brazilian'
)
LIMIT 100;`.trim(),
  },
  {
    id: "union-outra-empresa",
    description: "Une resultados da empresa esperada aos de outra empresa.",
    expectedAllowed: false,
    sql: `
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
JOIN "Empresa" e ON e."id" = a."empresaId"
WHERE e."codigo" = 'alpha-brazilian'
UNION ALL
SELECT a."empresaId" AS empresa_id, a."codigo"
FROM "Ativo" a
JOIN "Empresa" e ON e."id" = a."empresaId"
WHERE e."codigo" = 'alpha-international'
LIMIT 100;`.trim(),
  },
];

export async function evaluateTenantFilterCases() {
  const results = [];

  for (const evaluationCase of TENANT_FILTER_CASES) {
    const validation = await validateSql(evaluationCase.sql, {
      allowedTables: SPIKE_ALLOWED_TABLES,
      expectedCompanyCode: "alpha-brazilian",
      maxRows: 100,
    });

    results.push({
      id: evaluationCase.id,
      description: evaluationCase.description,
      expectedAllowed: evaluationCase.expectedAllowed,
      validatorAccepted: validation.valid,
      falseAcceptance: validation.valid && !evaluationCase.expectedAllowed,
      decisionMatchesExpectation:
        validation.valid === evaluationCase.expectedAllowed,
      validation,
    });
  }

  return results;
}
