import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createAtivoDto } from "./dto/create-ativo.dto.js";
import { updateAtivoDto } from "./dto/update-ativo.dto.js";
import { listAtivosDto } from "./dto/list-ativos.dto.js";
import { updateStatusAtivoDto } from "./dto/update-ativo.dto.js";
import { findAll, findById, create, update, updateStatus, remove } from "./ativos.controller.js";

export const ativosRouter = Router();

ativosRouter.use(authMiddleware);

ativosRouter.get("/", validate(listAtivosDto, "query"), findAll);
ativosRouter.get("/:id", findById);
ativosRouter.post("/", requireRole(["ADMIN", "SUPERVISOR"]), validate(createAtivoDto), create);
ativosRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateAtivoDto), update);
ativosRouter.patch("/:id/status", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateStatusAtivoDto), updateStatus);
ativosRouter.delete("/:id", requireRole(["ADMIN"]), remove);