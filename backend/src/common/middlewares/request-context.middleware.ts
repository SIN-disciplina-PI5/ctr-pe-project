import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export function requestContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const traceId = randomUUID();

  req.traceId = traceId;
  res.setHeader("X-Trace-Id", traceId);

  next();
}
