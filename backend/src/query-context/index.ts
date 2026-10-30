import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaContext = fs.readFileSync(
  path.join(__dirname, "schema-context-v1.md"),
  "utf8"
);

const questionExamples = fs.readFileSync(
  path.join(__dirname, "question-sql-examples.md"),
  "utf8"
);

export const QUERY_CONTEXT = `
${schemaContext}

${questionExamples}
`;