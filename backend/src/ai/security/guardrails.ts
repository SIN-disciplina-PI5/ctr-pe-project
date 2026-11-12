import type { GuardrailRule, SecurityCheckResult } from './types.js';

const rules: GuardrailRule[] = [
  { id: 'no_prompt_injection', pattern: /(ignore (all )?instructions|system prompt|bypass|override)/i, errorMessage: 'Attempted prompt injection detected.' },
  { id: 'no_credentials_access', pattern: /(passwords?|credentials?|users? table|secret)/i, errorMessage: 'Access to credentials or user tables is forbidden.' },
  { id: 'no_write_attempts', pattern: /\b(DELETE|DROP|UPDATE|INSERT|ALTER|TRUNCATE)\b/i, errorMessage: 'Write operations are strictly forbidden.' }
];

export function validateAIPrompt(prompt: string, contextCompanyId?: string, requestedCompanyId?: string): SecurityCheckResult {
  if (contextCompanyId && requestedCompanyId && contextCompanyId !== requestedCompanyId) {
    return { isValid: false, reason: 'Cross-company data access is forbidden.' };
  }
  for (const rule of rules) {
    if (rule.pattern.test(prompt)) {
      return { isValid: false, reason: rule.errorMessage };
    }
  }
  return { isValid: true };
}
