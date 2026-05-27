import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { findByOrdemServico, findById, create, update, consumir, devolver, cancelar } from "./ordens-servico-materiais.controller.js";

export const ordensServicoMateriaisRouter = Router();

ordensServicoMateriaisRouter.use(authMiddleware);

ordensServicoMateriaisRouter.get("/:id", findById);
ordensServicoMateriaisRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), update);
ordensServicoMateriaisRouter.patch("/:id/consumir", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), consumir);
ordensServicoMateriaisRouter.patch("/:id/devolver", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), devolver);
ordensServicoMateriaisRouter.patch("/:id/cancelar", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), cancelar);