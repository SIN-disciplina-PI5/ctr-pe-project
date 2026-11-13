import type { OrchestratorIntent } from "./orchestrator.js";

const CREDENTIAL_PATTERN =
  /\b(senha|password|credenciais?|tokens?|api[-_ ]?keys?|chaves? de api|database_url|groq_api_key|url (?:do|de) banco)\b/i;
const PROMPT_INJECTION_PATTERN =
  /(?:ignore|desconsidere|esque[cç]a).{0,50}(?:instru[cç][oõ]es|regras|prompt|sistema)|system prompt|prompt do sistema|revele.{0,40}(?:instru[cç][oõ]es|prompt)|finja que (?:n[aã]o|voc[eê] n[aã]o)/i;
const CROSS_TENANT_PATTERN =
  /outra empresa|todas as empresas|ignore.{0,40}empresa|empresa.{0,30}sess[aã]o/i;
const SQL_WRITE_PATTERN = /\b(delete|insert|update|drop|alter|truncate)\b/i;
const WRITE_ACTION_PATTERN =
  /\b(apague|apagar|exclua|excluir|remova|remover|altere|alterar|edite|editar|cadastre|cadastrar)\b/i;
const REPORT_PATTERN = /\b(relat[oó]rio|relat[oó]rios)\b/i;

function refusal(
  intent: "write_request" | "out_of_domain",
  refusalReason: string,
): OrchestratorIntent {
  return {
    intent,
    contextualizedQuestion: null,
    clarification: null,
    refusalReason,
  };
}

export function classifyRestrictedRequest(
  message: string,
): OrchestratorIntent | null {
  if (CREDENTIAL_PATTERN.test(message)) {
    return refusal(
      "out_of_domain",
      "Não posso fornecer credenciais, segredos ou configurações internas.",
    );
  }

  if (PROMPT_INJECTION_PATTERN.test(message)) {
    return refusal(
      "out_of_domain",
      "Não posso ignorar regras de segurança nem revelar instruções internas.",
    );
  }

  if (CROSS_TENANT_PATTERN.test(message)) {
    return refusal(
      "out_of_domain",
      "Não posso ignorar a empresa da sessão nem acessar dados de outra empresa.",
    );
  }

  if (
    SQL_WRITE_PATTERN.test(message) ||
    (WRITE_ACTION_PATTERN.test(message) && !REPORT_PATTERN.test(message))
  ) {
    return refusal(
      "write_request",
      "Não posso criar, alterar ou excluir registros; o assistente opera somente leitura.",
    );
  }

  return null;
}
