import { createRequire } from "node:module";
import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

const require = createRequire(import.meta.url);
const rateLimit: typeof import("express-rate-limit").default =
  require("express-rate-limit");

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
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