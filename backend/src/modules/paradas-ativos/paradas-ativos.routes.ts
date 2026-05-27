import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { findAll, findById, create, update, encerrar, cancelar } from "./paradas-ativos.controller.js";

export const paradasAtivosRouter = Router();

paradasAtivosRouter.use(authMiddleware);

paradasAtivosRouter.get("/", findAll);
paradasAtivosRouter.get("/:id", findById);
paradasAtivosRouter.post("/", requireRole(["ADMIN", "SUPERVISOR"]), create);
paradasAtivosRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR"]), update);
paradasAtivosRouter.patch("/:id/encerrar", requireRole(["ADMIN", "SUPERVISOR"]), encerrar);
paradasAtivosRouter.patch("/:id/cancelar", requireRole(["ADMIN", "SUPERVISOR"]), cancelar);