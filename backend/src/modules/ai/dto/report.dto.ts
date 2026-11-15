import { z } from "zod";
import { entityIdSchema } from "../../../common/schemas/entity-id.schema.js";

const MAX_PERIOD_DAYS = 366;
const DAY_MS = 86_400_000;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
    );
  }, "Data inválida.");

export const reportTypeSchema = z.enum([
  "monthly_maintenance",
  "asset_costs",
  "availability",
]);

export const createReportDto = z
  .object({
    request: z.string().trim().min(3).max(1_500).optional(),
    reportType: reportTypeSchema.optional(),
    period: z
      .object({ start: isoDate, end: isoDate })
      .strict()
      .refine((period) => period.start <= period.end, {
        message: "A data inicial deve ser anterior ou igual à final.",
        path: ["end"],
      })
      .refine(
        (period) =>
          (Date.parse(period.end) - Date.parse(period.start)) / DAY_MS <=
          MAX_PERIOD_DAYS,
        {
          message: `O período deve ter no máximo ${MAX_PERIOD_DAYS} dias.`,
          path: ["end"],
        },
      )
      .optional(),
  })
  .strict()
  .refine((body) => body.request !== undefined || body.reportType !== undefined, {
    message: "Informe o tipo de relatório ou descreva o pedido.",
    path: ["request"],
  });

export type CreateReportDto = z.infer<typeof createReportDto>;

export const listReportsQueryDto = z
  .object({
    status: z.enum(["queued", "running", "done", "failed"]).optional(),
    page: z.coerce.number().int().min(1).max(1_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict();

export type ListReportsQueryDto = z.infer<typeof listReportsQueryDto>;

export const reportIdParamsDto = z.object({ id: entityIdSchema }).strict();

/** Cabeçalho opcional; sem ele o servidor gera uma chave por requisição. */
export const idempotencyKeyHeaderSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9._:-]{8,128}$/, "Idempotency-Key inválida.")
  .optional();
