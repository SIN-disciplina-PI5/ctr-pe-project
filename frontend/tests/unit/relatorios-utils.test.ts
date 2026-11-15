import { reportFormSchema } from "@/features/relatorios/relatorios.schemas";
import {
  apiErrorMessage,
  brDateToIso,
  buildCreateReportInput,
  newIdempotencyKey,
  presetPeriod,
  reportsPollingInterval,
  type ReportFormValues,
} from "@/features/relatorios/relatorios.utils";

const today = new Date(2026, 10, 15); // 15/11/2026

const base: ReportFormValues = {
  tipo: "monthly_maintenance",
  periodo: "last_month",
  inicio: "",
  fim: "",
  pedido: "",
};

describe("relatorios.utils", () => {
  it("calcula os períodos prontos a partir da data de hoje", () => {
    expect(presetPeriod("last_month", today)).toEqual({
      start: "2026-10-01",
      end: "2026-10-31",
    });
    expect(presetPeriod("current_month", today)).toEqual({
      start: "2026-11-01",
      end: "2026-11-15",
    });
    expect(presetPeriod("last_90_days", today)).toEqual({
      start: "2026-08-18",
      end: "2026-11-15",
    });
  });

  it("trata a virada de ano no mês anterior", () => {
    expect(presetPeriod("last_month", new Date(2027, 0, 10))).toEqual({
      start: "2026-12-01",
      end: "2026-12-31",
    });
  });

  it("converte datas dd/mm/aaaa e recusa datas inexistentes", () => {
    expect(brDateToIso("05/03/2026")).toBe("2026-03-05");
    expect(brDateToIso("31/02/2026")).toBeNull();
    expect(brDateToIso("2026-03-05")).toBeNull();
  });

  it("monta o corpo com tipo, período e texto", () => {
    expect(
      buildCreateReportInput({ ...base, pedido: "  Destaque atrasos  " }, today),
    ).toEqual({
      reportType: "monthly_maintenance",
      period: { start: "2026-10-01", end: "2026-10-31" },
      request: "Destaque atrasos",
    });
  });

  it("omite tipo no personalizado e período quando não há", () => {
    expect(
      buildCreateReportInput(
        { ...base, tipo: "custom", periodo: "none", pedido: "OS por ativo" },
        today,
      ),
    ).toEqual({ request: "OS por ativo" });
  });

  it("usa o período personalizado convertido", () => {
    expect(
      buildCreateReportInput(
        { ...base, periodo: "custom", inicio: "01/09/2026", fim: "30/09/2026" },
        today,
      ),
    ).toEqual({
      reportType: "monthly_maintenance",
      period: { start: "2026-09-01", end: "2026-09-30" },
    });
  });

  it("só faz polling enquanto houver relatório ativo", () => {
    expect(reportsPollingInterval(undefined)).toBe(false);
    expect(
      reportsPollingInterval({ items: [], total: 0, page: 1, pageSize: 10, hasActiveJobs: false }),
    ).toBe(false);
    expect(
      reportsPollingInterval({ items: [], total: 1, page: 1, pageSize: 10, hasActiveJobs: true }),
    ).toBe(5_000);
  });

  it("gera chave de idempotência aceita pelo backend e única", () => {
    const first = newIdempotencyKey();
    expect(first).toMatch(/^[A-Za-z0-9._:-]{8,128}$/);
    expect(newIdempotencyKey()).not.toBe(first);
  });

  it("traduz o limite de solicitações e usa a mensagem do backend", () => {
    expect(apiErrorMessage({ response: { status: 429 } }, "padrão")).toMatch(/limite/);
    expect(
      apiErrorMessage({ response: { status: 404, data: { error: "Relatório não encontrado." } } }, "padrão"),
    ).toBe("Relatório não encontrado.");
    expect(apiErrorMessage(new Error("rede"), "padrão")).toBe("padrão");
  });
});

describe("reportFormSchema", () => {
  it("aceita o formulário padrão", () => {
    expect(reportFormSchema.safeParse(base).success).toBe(true);
  });

  it("exige descrição no relatório personalizado", () => {
    const result = reportFormSchema.safeParse({ ...base, tipo: "custom" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["pedido"]);
  });

  it.each([
    ["data inválida", { inicio: "31/02/2026", fim: "10/03/2026" }, "inicio"],
    ["período invertido", { inicio: "10/10/2026", fim: "01/10/2026" }, "fim"],
    ["período longo", { inicio: "01/01/2025", fim: "01/06/2026" }, "fim"],
  ])("valida o período personalizado: %s", (_label, datas, campo) => {
    const result = reportFormSchema.safeParse({ ...base, periodo: "custom", ...datas });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue) => issue.path[0] === campo)).toBe(true);
  });
});
