import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import {
  createPlanoManutencaoDto,
  listPlanosManutencaoDto,
  updatePlanoManutencaoDto,
} from "./dto/planos-manutencao.dto.js";
import {
  createPlano,
  findAllPlanos,
  findPlanoById,
  gerarOSDoPlano,
  processarPlanosVencidos,
  removePlano,
  updatePlano,
} from "./planos-manutencao.controller.js";

export const planosManutencaoRouter = Router();

planosManutencaoRouter.use(authMiddleware);

planosManutencaoRouter.get(
  "/",
  validate(listPlanosManutencaoDto, "query"),
  findAllPlanos,
);
planosManutencaoRouter.get("/:id", findPlanoById);
planosManutencaoRouter.post(
  "/",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  validate(createPlanoManutencaoDto),
  createPlano,
);
planosManutencaoRouter.post(
  "/processar-vencidos",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  processarPlanosVencidos,
);
planosManutencaoRouter.post(
  "/:id/gerar-os",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO"]),
  gerarOSDoPlano,
);
planosManutencaoRouter.patch(
  "/:id",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  validate(updatePlanoManutencaoDto),
  updatePlano,
);
planosManutencaoRouter.delete(
  "/:id",
  requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]),
  removePlano,
);
