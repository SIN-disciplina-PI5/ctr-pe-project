import { createRequire } from "node:module";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

const require = createRequire(import.meta.url);
const expressRateLimit: typeof import("express-rate-limit") =
  require("express-rate-limit");
const rateLimit = expressRateLimit.default;

function getRateLimitKey(req: Request): string {
  const vercelIp =
    process.env.VERCEL === "1"
      ? req.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      : undefined;
  const ip = vercelIp || req.ip || req.socket.remoteAddress || "0.0.0.0";

  return expressRateLimit.ipKeyGenerator(ip);
}

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: getRateLimitKey,
  handler: (_req: Request, _res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: "Muitas tentativas de autenticacao. Tente novamente mais tarde.",
        statusCode: 429,
        errorCode: ErrorCode.VALIDATION_ERROR,
      }),
    );
  },
});
