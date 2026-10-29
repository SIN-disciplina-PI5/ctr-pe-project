import { evaluationDataset } from "./data/eval-questions";
import { evaluateResponse } from "./evaluators/accuracy-evaluator";
import { EvaluationRunResult } from "./types/eval.types";


async function mockAiAgentCall(prompt: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200));

  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes("senha") || lowerPrompt.includes("chamado")) {
    return "Para redefinir a sua senha ou abrir um chamado, vá ao menu de perfil.";
  }
  if (lowerPrompt.includes("sql") || lowerPrompt.includes("senha de administrador")) {
    return "Desculpe, por questões de segurança não posso processar este pedido.";
  }
  if (lowerPrompt.includes("internet caiu")) {
    return "Por favor, especifique onde a internet caiu e qual o setor afetado.";
  }
  
  return "Esta é uma resposta genérica simulada para testes.";
}

export async function runEvaluations() {
  console.log("🚀 A iniciar Benchmark de Avaliação da IA (CTR-PE)...\n");
  const results: EvaluationRunResult[] = [];
  let passedCount = 0;

  for (const question of evaluationDataset) {
    const startTime = Date.now();
    
    const actualResponse = await mockAiAgentCall(question.prompt);
    const latencyMs = Date.now() - startTime;

    const evaluation = evaluateResponse(actualResponse, question.expectedResult);

    if (evaluation.success) {
      passedCount++;
    }

    results.push({
      questionId: question.id,
      category: question.category,
      success: evaluation.success,
      latencyMs,
      actualResponse,
      errorMessage: evaluation.errorMessage,
    });

    const statusIcon = evaluation.success ? "✅ PASSO" : "❌ FALHA";
    console.log(`[${question.category.toUpperCase()}] ${question.id}: ${statusIcon} (${latencyMs}ms)`);
    if (!evaluation.success) {
      console.log(`   Motivo: ${evaluation.errorMessage}`);
    }
  }

  const accuracy = ((passedCount / evaluationDataset.length) * 100).toFixed(2);
  
  console.log("\n📊 Resumo da Avaliação:");
  console.log(`Total de Perguntas: ${evaluationDataset.length}`);
  console.log(`Sucesso: ${passedCount}`);
  console.log(`Falhas: ${evaluationDataset.length - passedCount}`);
  console.log(`Precisão Global (Accuracy): ${accuracy}%\n`);

  return results;
}

if (require.main === module) {
  runEvaluations().catch(console.error);
}