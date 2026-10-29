import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { EvaluationRunResult } from "./types/eval.types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function exportToCSV(results: EvaluationRunResult[], modelName: string): void {
  const resultsDir = path.join(__dirname, "results");
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const date = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `run_${modelName}_${date}.csv`;
  const filePath = path.join(resultsDir, fileName);

  const headers = ["QuestionID", "Category", "Success", "LatencyMs", "ActualResponse", "ErrorMessage"];
  
  const rows = results.map((r) => {
    const safeResponse = r.actualResponse.replace(/"/g, '""');
    const safeError = r.errorMessage ? r.errorMessage.replace(/"/g, '""') : "";
    return `"${r.questionId}","${r.category}",${r.success},${r.latencyMs},"${safeResponse}","${safeError}"`;
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  fs.writeFileSync(filePath, csvContent, "utf-8");
  
  console.log(`Resultados salvos em: eval/results/${fileName}`);
}