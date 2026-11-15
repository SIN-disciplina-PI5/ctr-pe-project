import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { pipeline } from "node:stream/promises";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { getCurrentCompanyUser } from "../../common/utils/get-current-user.js";
import {
  idempotencyKeyHeaderSchema,
  listReportsQueryDto,
  type CreateReportDto,
} from "./dto/report.dto.js";
import { createReportJobService } from "./report-job.factory.js";
import type { ReportJobService } from "./report-job.service.js";
import { REPORTS_BASE_PATH } from "./report-job.types.js";

let service: ReportJobService | undefined;

function getService(): ReportJobService {
  service ??= createReportJobService();
  return service;
}

/** Permite substituir o serviço em testes de rota. */
export function setReportJobServiceForTests(
  replacement: ReportJobService | undefined,
): void {
  service = replacement;
}

function scopeOf(req: Request) {
  const user = getCurrentCompanyUser(req);
  return { empresaId: user.empresaId, usuarioId: user.id };
}

function idempotencyKeyOf(req: Request): string {
  const parsed = idempotencyKeyHeaderSchema.safeParse(
    req.get("Idempotency-Key"),
  );
  if (!parsed.success) {
    throw new AppError({
      message: "Dados inválidos.",
      statusCode: 400,
      errorCode: ErrorCode.VALIDATION_ERROR,
      details: { fieldErrors: { "Idempotency-Key": ["Idempotency-Key inválida."] } },
    });
  }
  return parsed.data ?? randomUUID();
}

function attachmentHeader(filename: string): string {
  const safe = filename.replace(/[^A-Za-z0-9._-]+/g, "-") || "relatorio.pdf";
  return `attachment; filename="${safe}"`;
}

export async function createReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const scope = scopeOf(req);
    const body = req.body as CreateReportDto;
    const { job, created } = await getService().enqueue({
      ...scope,
      idempotencyKey: idempotencyKeyOf(req),
      ...(body.request === undefined ? {} : { request: body.request }),
      ...(body.reportType === undefined ? {} : { reportType: body.reportType }),
      ...(body.period === undefined ? {} : { period: body.period }),
    });

    if (!created) {
      // Repetição da mesma requisição: não gera novo registro de auditoria.
      res.locals["skipAudit"] = true;
      res.setHeader("Idempotent-Replayed", "true");
    }
    res.setHeader("Location", `${REPORTS_BASE_PATH}/${job.id}`);
    return res.status(202).json(job);
  } catch (error) {
    next(error);
  }
}

export async function listReports(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const scope = scopeOf(req);
    const query = listReportsQueryDto.parse(req.query);
    const result = await getService().listOwned(scope, {
      page: query.page,
      pageSize: query.pageSize,
      ...(query.status === undefined ? {} : { status: query.status }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const job = await getService().getOwned(String(req.params["id"]), scopeOf(req));
    return res.status(200).json(job);
  } catch (error) {
    next(error);
  }
}

export async function downloadReport(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const scope = scopeOf(req);
    const jobId = String(req.params["id"]);
    const { metadata, content } = await getService().getDownload(jobId, scope);

    console.info(
      JSON.stringify({
        component: "ai.reports",
        event: "report_downloaded",
        jobId,
        arquivoId: metadata.id,
        empresaId: scope.empresaId,
        usuarioId: scope.usuarioId,
        traceId: req.traceId ?? null,
      }),
    );

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", attachmentHeader(metadata.nomeArquivo));
    res.setHeader("Cache-Control", "private, no-store");
    if (content.size !== null) {
      res.setHeader("Content-Length", String(content.size));
    }
    await pipeline(
      Readable.fromWeb(content.stream as NodeReadableStream<Uint8Array>),
      res,
    );
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error instanceof Error ? error : undefined);
      return;
    }
    next(error);
  }
}
