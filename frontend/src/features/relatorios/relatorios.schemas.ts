import { z } from "zod";

import { brDateToIso } from "./relatorios.utils";

const MAX_PERIOD_DAYS = 366;

export const reportFormSchema = z
  .object({
    tipo: z.enum(["monthly_maintenance", "asset_costs", "availability", "custom"]),
    periodo: z.enum(["none", "current_month", "last_month", "last_90_days", "custom"]),
    inicio: z.string(),
    fim: z.string(),
    pedido: z.string().trim().max(1500, "Use no máximo 1.500 caracteres."),
  })
  .superRefine((values, ctx) => {
    if (values.tipo === "custom" && values.pedido.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["pedido"],
        message: "Descreva o relatório que você precisa.",
      });
    }
    if (values.pedido.length > 0 && values.pedido.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["pedido"],
        message: "Escreva pelo menos 3 caracteres.",
      });
    }
    if (values.periodo !== "custom") return;

    const inicio = brDateToIso(values.inicio);
    const fim = brDateToIso(values.fim);
    if (!inicio) {
      ctx.addIssue({ code: "custom", path: ["inicio"], message: "Data inválida (dd/mm/aaaa)." });
    }
    if (!fim) {
      ctx.addIssue({ code: "custom", path: ["fim"], message: "Data inválida (dd/mm/aaaa)." });
    }
    if (!inicio || !fim) return;
    if (inicio > fim) {
      ctx.addIssue({
        code: "custom",
        path: ["fim"],
        message: "A data final deve ser igual ou posterior à inicial.",
      });
      return;
    }
    const days = (Date.parse(fim) - Date.parse(inicio)) / 86_400_000;
    if (days > MAX_PERIOD_DAYS) {
      ctx.addIssue({
        code: "custom",
        path: ["fim"],
        message: `O período deve ter no máximo ${MAX_PERIOD_DAYS} dias.`,
      });
    }
  });

export type ReportFormInput = z.infer<typeof reportFormSchema>;
