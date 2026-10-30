import "dotenv/config";
import { z } from "zod";
import { GroqProvider } from "./llm-provider.js";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY não definida.");
}

const model = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

const sqlResponseSchema = z.object({
  sql: z.string(),
  explicacao: z.string(),
  observacoes: z.array(z.string()),
});

const provider = new GroqProvider(apiKey);

const resultado = await provider.generateStructured({
  model,
  schemaName: "sql_generation",
  schema: sqlResponseSchema,
  systemPrompt: [
    "Você gera consultas PostgreSQL somente de leitura.",
    "Produza exatamente uma instrução SELECT.",
    "Não use blocos Markdown.",
  ].join(" "),
  userPrompt: `
Schema disponível:

"Ativo"(
  id text,
  "empresaId" text,
  nome text,
  status text enum: DISPONIVEL, EM_USO, PARADO, EM_MANUTENCAO, AGUARDANDO_PECA, DESATIVADO
)

Gere uma consulta que liste nome e status de até 10 ativos parados
pertencentes à empresa "empresa-1".
  `.trim(),
});

console.log(JSON.stringify(resultado, null, 2));