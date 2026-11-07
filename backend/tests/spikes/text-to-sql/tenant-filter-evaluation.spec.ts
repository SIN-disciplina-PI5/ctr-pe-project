import { describe, expect, it } from "@jest/globals";
import {
  evaluateTenantFilterCases,
  TENANT_FILTER_CASES,
} from "../../../spikes/text-to-sql/tenant-filter-evaluation.js";

describe("tenant-filter-evaluation", () => {
  it("mantém um caso legítimo e quatro tentativas de vazamento", () => {
    expect(TENANT_FILTER_CASES).toHaveLength(5);
    expect(
      TENANT_FILTER_CASES.filter((item) => item.expectedAllowed),
    ).toHaveLength(1);
  });

  it("aceita corretamente a consulta com relacionamento de empresa", async () => {
    const results = await evaluateTenantFilterCases();
    const safeCase = results.find((result) => result.id === "filtro-correto");

    expect(safeCase).toMatchObject({
      expectedAllowed: true,
      validatorAccepted: true,
      falseAcceptance: false,
      decisionMatchesExpectation: true,
    });
  });

  it("documenta os quatro falsos aceites do validador atual", async () => {
    const results = await evaluateTenantFilterCases();
    const falseAcceptances = results.filter(
      (result) => result.falseAcceptance,
    );

    expect(falseAcceptances.map((result) => result.id)).toEqual([
      "filtro-com-or",
      "empresa-desconectada",
      "empresa-em-exists",
      "union-outra-empresa",
    ]);
  });
});
