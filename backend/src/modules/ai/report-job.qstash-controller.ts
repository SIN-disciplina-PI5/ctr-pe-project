import { Receiver, SignatureError } from "@upstash/qstash";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { createReportJobProcessor } from "./report-job.factory.js";
import { loadQStashReceiverConfig } from "./report-job.qstash-config.js";
import type { ReportJobProcessor } from "./report-job.processor.js";

const reportJobPayload = z.object({ jobId: z.string().trim().min(1).max(100) }).strict();

let processor: ReportJobProcessor | undefined;

function getProcessor(): ReportJobProcessor {
  processor ??= createReportJobProcessor();
  return processor;
}

function rawBody(req: Request): string {
  if (!Buffer.isBuffer(req.body)) {
    throw new Error("O endpoint do QStash deve receber o corpo bruto da requisição.");
  }
  return req.body.toString("utf8");
}

function rejectMessage(res: Response, message: string) {
  res.setHeader("Upstash-NonRetryable-Error", "true");
  return res.status(489).json({ error: message });
}

async function verifyRequest(req: Request, expectedUrl: string): Promise<string> {
  const signature = req.get("Upstash-Signature");
  if (!signature) throw new SignatureError("Assinatura ausente.");

  const config = loadQStashReceiverConfig();
  const body = rawBody(req);
  const receiver = new Receiver({
    currentSigningKey: config.currentSigningKey,
    nextSigningKey: config.nextSigningKey,
    devMode: false,
  });
  const region = req.get("Upstash-Region");

  await receiver.verify({
    body,
    signature,
    url: expectedUrl,
    ...(region ? { upstashRegion: region } : {}),
  });
  return body;
}

export async function runQStashReportJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const config = loadQStashReceiverConfig();
    const body = await verifyRequest(req, config.reportJobUrl);
    const payload = reportJobPayload.safeParse(JSON.parse(body));
    if (!payload.success) return rejectMessage(res, "Payload do job inválido.");

    const outcome = await getProcessor().runJob(payload.data.jobId);
    return res.status(200).json(outcome);
  } catch (error) {
    if (error instanceof SignatureError || error instanceof SyntaxError) {
      return rejectMessage(res, "Mensagem do QStash inválida.");
    }
    return next(error);
  }
}

export async function sweepQStashReportJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const config = loadQStashReceiverConfig();
    await verifyRequest(req, config.sweepUrl);
    const summary = await getProcessor().dispatchAvailable();
    return res.status(200).json(summary);
  } catch (error) {
    if (error instanceof SignatureError) {
      return rejectMessage(res, "Mensagem do QStash inválida.");
    }
    return next(error);
  }
}
