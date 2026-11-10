import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { QueryAgentService } from "../src/modules/ai/query-agent.service.js";
import { QueryAnswerService } from "../src/modules/ai/query-answer.service.js";
import {
  createLlmProvider,
  createOrchestratorProvider,
  loadLlmConfig,
} from "../src/modules/ai/llm-config.js";
import { OrchestratorClassifierService } from "../src/modules/ai/orchestrator-classifier.service.js";
import { OrchestratorService } from "../src/modules/ai/orchestrator.service.js";
import { QueryGenerationService } from "../src/modules/ai/query-generation.service.js";
import { PgReadOnlyQueryExecutor } from "../src/modules/ai/query-executor.js";
import {
  SYNTHETIC_TENANTS,
  type SyntheticTenantCode,
} from "../src/modules/ai/query-examples.js";
import { OrchestratorEvaluationAdapter } from "./orchestrator-evaluation-adapter.js";
import { QUERY_EVALUATION_DATASET } from "./query-evaluation-dataset.js";
import {
  QueryEvaluationRunner,
  serializeEvaluationCsv,
} from "./query-evaluation-runner.js";

const { Pool } = pg;

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} não definida.`);
  return value;
}

function tenantCode(): SyntheticTenantCode {
  const value =
    process.env["AI_EVALUATION_TENANT_CODE"]?.trim() ?? "alpha-international";
  if (!SYNTHETIC_TENANTS.some((tenant) => tenant.code === value)) {
    throw new Error(`AI_EVALUATION_TENANT_CODE inválido: ${value}.`);
  }
  return value as SyntheticTenantCode;
}

async function main(): Promise<void> {
  const connectionString = requiredEnvironment("AI_READONLY_DATABASE_URL");
  const empresaId = requiredEnvironment("AI_EVALUATION_EMPRESA_ID");
  const config = loadLlmConfig();
  const pool = new Pool({ connectionString });
  const executedAt = new Date().toISOString();
  const safeTimestamp = executedAt.replaceAll(":", "-");

  try {
    const provider = createLlmProvider(config);
    const orchestratorProvider = createOrchestratorProvider(config);
    const agent = new QueryAgentService(
      new QueryGenerationService(provider),
      new PgReadOnlyQueryExecutor(pool),
      new QueryAnswerService(provider),
    );
    const orchestrator = new OrchestratorService(
      new OrchestratorClassifierService(orchestratorProvider),
      agent,
    );
    const adapter = new OrchestratorEvaluationAdapter(orchestrator, {
      provider: "groq",
      model: config.orchestratorModel,
    });
    const runner = new QueryEvaluationRunner({
      adapter,
      empresaId,
      tenantCode: tenantCode(),
      executedAt,
      fallbackProvider: "groq",
      fallbackModel: config.model,
    });
    const report = await runner.run(QUERY_EVALUATION_DATASET);
    const outputDirectory = path.resolve("evaluation/results");
    const outputPath = path.join(
      outputDirectory,
      `query-evaluation-${safeTimestamp}.csv`,
    );
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(outputPath, serializeEvaluationCsv(report), "utf8");

    console.log(
      `Avaliação concluída: ${report.correctCases}/${report.totalCases} casos corretos.`,
    );
    console.log(`Precisão geral: ${(report.precision * 100).toFixed(2)}%.`);
    for (const category of report.categories) {
      console.log(
        `${category.category}: ${(category.precision * 100).toFixed(2)}% | ` +
          `${category.averageLatencyMs.toFixed(2)} ms | tokens=${category.totalTokens ?? "n/d"}`,
      );
    }
    console.log(`CSV: ${outputPath}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
