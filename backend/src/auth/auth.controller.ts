import type { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const result = await authService.signIn(email, password);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }  
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await authService.me(userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword, confirmNewPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    };

    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword,
      confirmNewPassword,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}