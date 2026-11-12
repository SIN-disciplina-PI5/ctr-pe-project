import type { GuardrailRule, SecurityCheckResult } from './types';

export const DEFAULT_GUARDRAIL_RULES: GuardrailRule[] = [
  {
    id: 'g1',
    name: 'Prompt Injection - Ignore Instructions',
    pattern: /ignore previous instructions|ignore all previous instructions/i,
    severity: 'HIGH',
  },
  {
    id: 'g2',
    name: 'System Prompt Extraction',
    pattern: /reveal system prompt|show me your instructions|print your system prompt/i,
    severity: 'CRITICAL',
  },
];

export function validateAIPrompt(input: string): SecurityCheckResult {
  for (const rule of DEFAULT_GUARDRAIL_RULES) {
    if (rule.pattern.test(input)) {
      return {
        passed: false,
        score: 0,
        threatDetected: rule.name,
        matchedRule: rule.id,
      };
    }
  }

  return {
    passed: true,
    score: 1,
  };
}