import { createRequire } from "node:module";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

const require = createRequire(import.meta.url);
const rateLimit: typeof import("express-rate-limit").default = require("express-rate-limit");

export const AI_CHAT_RATE_LIMIT = 20;
export const AI_CHAT_RATE_WINDOW_MS = 60_000;

export const aiChatRateLimiter = rateLimit({
  windowMs: AI_CHAT_RATE_WINDOW_MS,
  limit: AI_CHAT_RATE_LIMIT,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: Request) =>
    req.user
      ? `${req.user.id}:${req.user.empresaId ?? "sem-empresa"}`
      : `nao-autenticado:${req.ip ?? "desconhecido"}`,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: "Limite de mensagens excedido. Tente novamente em instantes.",
        statusCode: 429,
        errorCode: ErrorCode.TOO_MANY_REQUESTS,
      }),
    );
  },
});
