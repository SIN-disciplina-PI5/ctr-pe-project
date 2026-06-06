import type { NextFunction, Request, Response } from "express";

import { getCurrentUser } from "../common/utils/get-current-user.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const result = await authService.signIn(email, password);

    return res.status(200).json(result);
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
    const { currentPassword, newPassword, confirmNewPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    };

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