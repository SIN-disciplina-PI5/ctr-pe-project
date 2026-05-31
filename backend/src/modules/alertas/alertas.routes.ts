import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createAlertaDto } from "./dto/create-alerta.dto.js";
import { listAlertasDto } from "./dto/list-alertas.dto.js";
import {
  create,
  findAll,
  findById,
  findMe,
  ignorar,
  marcarLido,
  resolver,
} from "./alertas.controller.js";

export const alertasRouter = Router();

alertasRouter.use(authMiddleware);

alertasRouter.get("/", validate(listAlertasDto, "query"), findAll);
alertasRouter.get("/me", findMe);
alertasRouter.get("/:id", findById);
alertasRouter.post(
  "/",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  validate(createAlertaDto),
  create,
);
alertasRouter.patch("/:id/lido", marcarLido);
alertasRouter.patch(
  "/:id/resolver",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  resolver,
);
alertasRouter.patch(
  "/:id/ignorar",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  ignorar,
);
