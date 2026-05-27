import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      traceId: req.traceId ?? null,
      details: err.details ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: "Erro interno do servidor.",
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
    statusCode: 500,
    timestamp: new Date().toISOString(),
    traceId: req.traceId ?? null,
  });
}
