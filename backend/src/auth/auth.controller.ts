import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { signInSchema } from "./dto/sign-in.dto.js";
import { signUpSchema } from "./dto/sign-up.dto.js";
import { signUpTestingSchema } from "./dto/sign-up-testing.dto.js";
import { changePasswordSchema } from "./dto/change-password.dto.js";
import { refreshTokenSchema } from "./dto/refresh-token.dto.js";

const authService = new AuthService();

export async function listSignupEmpresas(_req: Request, res: Response) {
  const empresas = await authService.listSignupEmpresas();
  return res.status(200).json(empresas);
}

export async function signUp(req: Request, res: Response) {
  const data = signUpSchema.parse(req.body);
  const result = await authService.signUp(data);
  return res.status(201).json(result);
}

export async function signUpTesting(req: Request, res: Response) {
  const data = signUpTestingSchema.parse(req.body);
  const result = await authService.signUpTesting(data);
  return res.status(201).json(result);
}

export async function signIn(req: Request, res: Response) {
  const data = signInSchema.parse(req.body);
  const userAgent = req.headers["user-agent"];
  const userIpAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress;

  const result = await authService.signIn(
    data.email,
    data.password,
    data.recaptchaToken,
    data.recaptchaPlatform,
    userAgent,
    userIpAddress,
  );

  return res.status(200).json(result);
}

export async function me(req: Request, res: Response) {
  const userId = req.user!.id;
  const user = await authService.me(userId);
  return res.status(200).json(user);
}

export async function changePassword(req: Request, res: Response) {
  const userId = req.user!.id;
  const data = changePasswordSchema.parse(req.body);

  const result = await authService.changePassword(
    userId,
    data.currentPassword,
    data.newPassword,
    data.confirmNewPassword,
  );

  return res.status(200).json(result);
}

export async function refresh(req: Request, res: Response) {
  const data = refreshTokenSchema.parse(req.body);
  const result = await authService.refresh(data.refreshToken);
  return res.status(200).json(result);
}

export async function logout(req: Request, res: Response) {
  const data = refreshTokenSchema.parse(req.body);
  await authService.logout(data.refreshToken);
  return res.status(204).send();
}

export class AuthController {
  listSignupEmpresas = listSignupEmpresas;
  signUp = signUp;
  signUpTesting = signUpTesting;
  signIn = signIn;
  me = me;
  changePassword = changePassword;
  refresh = refresh;
  logout = logout;
}

export const authController = new AuthController();