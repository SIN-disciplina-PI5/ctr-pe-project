import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { findById, update, encerrar, remove } from "./apontamentos-os.controller.js";

export const apontamentosOSRouter = Router();

apontamentosOSRouter.use(authMiddleware);

apontamentosOSRouter.get("/:id", findById);
apontamentosOSRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), update);
apontamentosOSRouter.patch("/:id/encerrar", requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]), encerrar);
apontamentosOSRouter.delete("/:id", requireRole(["ADMIN", "SUPERVISOR"]), remove);