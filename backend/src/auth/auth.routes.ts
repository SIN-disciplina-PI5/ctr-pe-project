import { Router } from "express";
import { signIn, me, changePassword } from "./auth.controller.js";
import { authMiddleware } from "../common/middlewares/auth.middleware.js";


export const authRouter = Router();


authRouter.post("/sign-in", signIn);
authRouter.get("/me", authMiddleware, me);
authRouter.patch("/me/password", authMiddleware, changePassword);