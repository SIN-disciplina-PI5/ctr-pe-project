import { Router } from "express";

import { authMiddleware } from "../common/middlewares/auth.middleware.js";
import { authRateLimiter } from "../common/middlewares/auth-rate-limit.middleware.js";
import { validate } from "../common/middlewares/validate.middleware.js";
import { AppError } from "../common/errors/AppError.js";
import { ErrorCode } from "../common/errors/error-code.js";
import {
  changePassword,
  listSignupEmpresas,
  logout,
  me,
  refresh,
  signIn,
  signUp,
} from "./auth.controller.js";
import { changePasswordSchema } from "./dto/change-password.dto.js";
import { refreshTokenSchema } from "./dto/refresh-token.dto.js";
import { signInSchema } from "./dto/sign-in.dto.js";
import { signUpSchema } from "./dto/sign-up.dto.js";

export const authRouter = Router();

authRouter.get("/sign-up/empresas", listSignupEmpresas);
authRouter.post("/sign-up", authRateLimiter, validate(signUpSchema), signUp);

authRouter.post("/sign-up-testing", (_req, _res, next) => {
  next(
    new AppError({
      message: "Endpoint desativado por motivos de segurança.",
      statusCode: 403,
      errorCode: ErrorCode.FORBIDDEN,
    }),
  );
});

authRouter.post("/sign-in", authRateLimiter, validate(signInSchema), signIn);

authRouter.post("/login", authRateLimiter, (req, res, next) => {
  const { email, password, senha } = req.body || {};
  if (!email || (!password && !senha)) {
    return res.status(401).json({
      message: "Credenciais inválidas.",
      error: "Credenciais inválidas.",
      statusCode: 401,
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }
  return signIn(req, res, next);
});

authRouter.post("/refresh", authRateLimiter, validate(refreshTokenSchema), refresh);
authRouter.delete("/logout", validate(refreshTokenSchema), logout);

authRouter.get("/me", authMiddleware, me);
authRouter.patch(
  "/me/password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);