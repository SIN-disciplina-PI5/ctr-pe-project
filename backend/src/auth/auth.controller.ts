import type { NextFunction, Request, Response } from "express";

import { getCurrentUser } from "../common/utils/get-current-user.js";
import { AuthService } from "./auth.service.js";
import type { ChangePasswordInput } from "./dto/change-password.dto.js";
import type { RefreshTokenInput } from "./dto/refresh-token.dto.js";
import type { SignInInput } from "./dto/sign-in.dto.js";
import type { SignUpInput } from "./dto/sign-up.dto.js";
import type { SignUpTestingInput } from "./dto/sign-up-testing.dto.js";

const authService = new AuthService();

export async function listSignupEmpresas(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.listSignupEmpresas();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.signUp(req.body as SignUpInput);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function signUpTesting(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.signUpTesting(req.body as SignUpTestingInput);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as SignInInput;
    const result = await authService.signIn(email, password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refresh(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    await authService.logout(refreshToken);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const result = await authService.me(currentUser.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUser = getCurrentUser(req);
    const { currentPassword, newPassword, confirmNewPassword } =
      req.body as ChangePasswordInput;

    const result = await authService.changePassword(
      currentUser.id,
      currentPassword,
      newPassword,
      confirmNewPassword,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}