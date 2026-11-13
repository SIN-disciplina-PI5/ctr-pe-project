import { describe, expect, it } from "@jest/globals";
import { AI_VIEW_NAMES, buildSchemaContext } from "./schema-context.js";
import {
  QUERY_EXAMPLES,
  validateExpectedResult,
  type QueryExampleCategory,
} from "./query-examples.js";

const REQUIRED_CATEGORIES: readonly QueryExampleCategory[] = [
  "filter",
  "join",
  "aggregation",
  "date",
  "top-n",
];

describe("exemplos confiáveis de perguntas e SQL", () => {
  it("possui pelo menos vinte pares únicos", () => {
    expect(QUERY_EXAMPLES.length).toBeGreaterThanOrEqual(20);
    expect(new Set(QUERY_EXAMPLES.map((item) => item.id)).size).toBe(
      QUERY_EXAMPLES.length,
    );
    expect(new Set(QUERY_EXAMPLES.map((item) => item.question)).size).toBe(
      QUERY_EXAMPLES.length,
    );
  });

  it("cobre filtros, joins, agregações, datas e top-N", () => {
    const categories = new Set(
      QUERY_EXAMPLES.flatMap((item) => item.categories),
    );
    for (const category of REQUIRED_CATEGORIES) {
      expect(categories).toContain(category);
    }
  });

  it("usa somente SELECT, views autorizadas e LIMIT entre 1 e 100", () => {
    for (const example of QUERY_EXAMPLES) {
      expect(example.sql.trimStart()).toMatch(/^SELECT\b/i);
      expect(example.sql).not.toMatch(/\bpublic\./i);
      expect(example.sql).not.toMatch(
        /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b/i,
      );
      expect(example.sql).not.toContain(";");

      const limit = example.sql.match(/\bLIMIT\s+(\d+)\s*$/i);
      expect(limit).not.toBeNull();
      expect(Number(limit?.[1])).toBeGreaterThanOrEqual(1);
      expect(Number(limit?.[1])).toBeLessThanOrEqual(100);

      const referencedViews = [
        ...example.sql.matchAll(/ai\."([A-Za-z]+)"/g),
      ].map((match) => match[1]);
      expect(referencedViews.length).toBeGreaterThan(0);
      expect(
        referencedViews.every((view) => AI_VIEW_NAMES.includes(view as never)),
      ).toBe(true);
      expect(new Set(referencedViews)).toEqual(new Set(example.relevantViews));
    }
  });

  it("gera um contexto mínimo que contém todas as views de cada exemplo", () => {
    for (const example of QUERY_EXAMPLES) {
      const context = buildSchemaContext({
        relevantViews: example.relevantViews,
      });

      for (const view of example.relevantViews) {
        expect(context).toContain(`ai."${view}"`);
      }
      for (const view of AI_VIEW_NAMES) {
        if (!example.relevantViews.includes(view)) {
          expect(context).not.toContain(`ai."${view}"`);
        }
      }
    }
  });

  it("registra resultado esperado verificável para todos os exemplos", () => {
    for (const example of QUERY_EXAMPLES) {
      expect(example.expected.description.length).toBeGreaterThan(10);
      expect(example.expected.columns.length).toBeGreaterThan(0);
      expect(
        example.expected.rowCount ||
          example.expected.exactRows ||
          example.expected.exactRowsByTenant,
      ).toBeTruthy();
    }
  });

  it("valida resultados exatos, limites, tipos e ordenação", () => {
    const example = QUERY_EXAMPLES.find((item) => item.id === "empresa-atual")!;
    expect(
      validateExpectedResult(
        [{ codigo: "alpha-brazilian", nome: "Alpha Brazilian" }],
        example.expected,
        "alpha-brazilian",
      ),
    ).toEqual([]);

    expect(
      validateExpectedResult(
        [{ codigo: "outra", nome: "Outra" }],
        example.expected,
        "alpha-brazilian",
      ),
    ).toContain("linhas diferentes do resultado exato esperado");
  });
});
