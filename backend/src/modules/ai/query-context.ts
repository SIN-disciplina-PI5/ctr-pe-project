import {
  QUERY_EXAMPLES,
  type QueryExample,
} from "./query-examples.js";
import {
  buildSchemaContext,
  selectRelevantViews,
  type AiViewName,
} from "./schema-context.js";

export const MAX_QUERY_EXAMPLES_IN_CONTEXT = 3;

export interface SelectQueryExamplesOptions {
  readonly question: string;
  readonly relevantViews: readonly AiViewName[];
  readonly limit?: number;
}

export interface BuildQueryContextOptions {
  readonly question: string;
  readonly relevantViews: readonly AiViewName[];
}

const STOP_WORDS = new Set([
  "com",
  "como",
  "das",
  "dos",
  "esta",
  "estao",
  "para",
  "pela",
  "pelas",
  "pelo",
  "pelos",
  "qual",
  "quais",
  "que",
  "uma",
]);

function normalizeToken(token: string): string {
  if (token.length > 4 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function tokensOf(value: string): ReadonlySet<string> {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const tokens = normalized.match(/[a-z0-9_]+/g) ?? [];

  return new Set(
    tokens
      .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
      .map(normalizeToken),
  );
}

function overlapCount(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>,
): number {
  let count = 0;
  for (const token of left) {
    if (right.has(token)) count += 1;
  }
  return count;
}

function hasSameViews(
  example: QueryExample,
  selectedViews: readonly AiViewName[],
): boolean {
  if (example.relevantViews.length !== selectedViews.length) return false;
  const selectedSet = new Set(selectedViews);
  return example.relevantViews.every((view) => selectedSet.has(view));
}

export function selectRelevantQueryExamples(
  options: SelectQueryExamplesOptions,
): readonly QueryExample[] {
  const selectedViews = selectRelevantViews(options.relevantViews);
  const selectedSet = new Set(selectedViews);
  const questionTokens = tokensOf(options.question);
  const limit = options.limit ?? MAX_QUERY_EXAMPLES_IN_CONTEXT;

  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error("O limite de exemplos deve ser um inteiro não negativo.");
  }

  return QUERY_EXAMPLES.map((example, index) => ({
    example,
    index,
    compatible: example.relevantViews.every((view) => selectedSet.has(view)),
    exactViews: hasSameViews(example, selectedViews),
    overlap: overlapCount(questionTokens, tokensOf(example.question)),
  }))
    .filter((candidate) => candidate.compatible)
    .sort(
      (left, right) =>
        Number(right.exactViews) - Number(left.exactViews) ||
        right.overlap - left.overlap ||
        right.example.relevantViews.length -
          left.example.relevantViews.length ||
        left.index - right.index,
    )
    .slice(0, limit)
    .map((candidate) => candidate.example);
}

function renderExamples(examples: readonly QueryExample[]): string {
  if (examples.length === 0) return "";

  return [
    "Exemplos confiáveis de pergunta e SQL:",
    "Use-os somente como referência estrutural. Não reutilize filtros ou valores que não estejam na pergunta atual.",
    ...examples.map((example, index) =>
      [
        `Exemplo ${index + 1}:`,
        `Pergunta: ${example.question}`,
        "SQL:",
        example.sql,
      ].join("\n"),
    ),
  ].join("\n\n");
}

export function buildQueryContext(options: BuildQueryContextOptions): string {
  const examples = selectRelevantQueryExamples(options);
  const sections = [
    buildSchemaContext({ relevantViews: options.relevantViews }),
    renderExamples(examples),
  ];

  return sections.filter(Boolean).join("\n\n");
}
