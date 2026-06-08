import { Router } from "express";

import { authMiddleware } from "../common/middlewares/auth.middleware.js";
import { authRateLimiter } from "../common/middlewares/auth-rate-limit.middleware.js";
import { validate } from "../common/middlewares/validate.middleware.js";
import {
  changePassword,
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

authRouter.post("/sign-up", authRateLimiter, validate(signUpSchema), signUp);
authRouter.post("/sign-in", authRateLimiter, validate(signInSchema), signIn);
authRouter.post("/refresh", authRateLimiter, validate(refreshTokenSchema), refresh);
authRouter.delete("/logout", validate(refreshTokenSchema), logout);

authRouter.get("/me", authMiddleware, me);
authRouter.patch(
  "/me/password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);