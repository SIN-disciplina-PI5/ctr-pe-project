export interface SecurityCheckResult {
  passed: boolean;
  score: number;
  threatDetected?: string;
  matchedRule?: string;
}

export interface GuardrailRule {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}