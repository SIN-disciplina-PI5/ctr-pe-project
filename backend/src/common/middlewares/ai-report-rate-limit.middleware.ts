import { createRequire } from "node:module";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";
import { aiChatRateLimitKey } from "./ai-chat-rate-limit.middleware.js";

const require = createRequire(import.meta.url);
const expressRateLimit: typeof import("express-rate-limit") = require("express-rate-limit");
const rateLimit = expressRateLimit.default;

/** Cada relatório dispara várias chamadas ao LLM; o limite é bem menor que o do chat. */
export const AI_REPORT_RATE_LIMIT = 5;
export const AI_REPORT_RATE_WINDOW_MS = 10 * 60_000;

export const aiReportRateLimiter = rateLimit({
  windowMs: AI_REPORT_RATE_WINDOW_MS,
  limit: AI_REPORT_RATE_LIMIT,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: aiChatRateLimitKey,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(
      new AppError({
        message:
          "Limite de solicitações de relatório excedido. Tente novamente mais tarde.",
        statusCode: 429,
        errorCode: ErrorCode.TOO_MANY_REQUESTS,
      }),
    );
  },
});
