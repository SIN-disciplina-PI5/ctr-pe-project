import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { listAuditoriaDto } from "./dto/list-auditoria.dto.js";
import { findAll, findById } from "./auditoria.controller.js";

export const auditoriaRouter = Router();

auditoriaRouter.use(authMiddleware);

auditoriaRouter.get(
  "/",
  requireRole(["ADMIN", "GESTOR"]),
  validate(listAuditoriaDto, "query"),
  findAll,
);
auditoriaRouter.get("/:id", requireRole(["ADMIN", "GESTOR"]), findById);
