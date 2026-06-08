import rateLimit from "express-rate-limit";

import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/error-code.js";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      new AppError({
        message: "Muitas tentativas de autenticação. Tente novamente mais tarde.",
        statusCode: 429,
        errorCode: ErrorCode.VALIDATION_ERROR,
      }),
    );
  },
});