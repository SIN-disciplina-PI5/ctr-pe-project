import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: err.message,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      traceId: req.traceId ?? null,
      details: err.details ?? null,
    });
  }

  if (err?.code === "P2002") {
    return res.status(409).json({
      message: "Conflito: registro já existente.",
      error: "Conflito: registro já existente.",
      errorCode: ErrorCode.CONFLICT,
      statusCode: 409,
      timestamp: new Date().toISOString(),
      traceId: req.traceId ?? null,
      details: err.meta ?? null,
    });
  }

  if (err?.name === "ZodError" || err?.issues) {
    return res.status(400).json({
      message: "Dados de requisição inválidos.",
      error: "Dados de requisição inválidos.",
      errorCode: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      timestamp: new Date().toISOString(),
      traceId: req.traceId ?? null,
      details: err.issues ?? err.errors ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Erro interno do servidor.",
    error: "Erro interno do servidor.",
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: 500,
    timestamp: new Date().toISOString(),
    traceId: req.traceId ?? null,
  });
}