import { evaluateTenantFilterCases } from "./tenant-filter-evaluation.js";

const results = await evaluateTenantFilterCases();
const falseAcceptances = results.filter((result) => result.falseAcceptance);

console.log(
  JSON.stringify(
    {
      strategy: "backend-string-presence-validation",
      totalCases: results.length,
      falseAcceptanceCount: falseAcceptances.length,
      secureDecisionPct:
        (results.filter((result) => result.decisionMatchesExpectation).length /
          results.length) *
        100,
      falseAcceptanceIds: falseAcceptances.map((result) => result.id),
      results,
    },
    null,
    2,
  ),
);
