import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { findAll } from "./alertas.controller.js";

export const alertasRouter = Router();

alertasRouter.use(authMiddleware);

alertasRouter.get("/", findAll);