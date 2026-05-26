import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createOrdemServicoDto } from "./dto/create-ordem-servico.dto.js";
import { listOrdensServicoDto } from "./dto/list-ordens-servico.dto.js";
import { updateOrdemServicoDto } from "./dto/update-ordem-servico.dto.js";
import { create, findAll, findById, update, iniciar, aguardarPeca, retomar, encerrar, cancelar } from "./ordens-servico.controller.js";
import { findByOrdemServico as findMateriaisByOrdemServico, create as createMaterial } from "../ordens-servico-materiais/ordens-servico-materiais.controller.js";
import { findByOrdemServico as findApontamentosByOrdemServico, create as createApontamento } from "../apontamentos-os/apontamentos-os.controller.js";

export const ordensServicoRouter = Router();

ordensServicoRouter.use(authMiddleware);

ordensServicoRouter.get("/:ordemServicoId/materiais", findMateriaisByOrdemServico);
ordensServicoRouter.get("/:ordemServicoId/apontamentos", findApontamentosByOrdemServico);
ordensServicoRouter.get("/", validate(listOrdensServicoDto, "query"), findAll);
ordensServicoRouter.get("/:id", findById);

ordensServicoRouter.post(
  "/",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  validate(createOrdemServicoDto),
  create
);

ordensServicoRouter.post(
  "/:ordemServicoId/materiais",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  createMaterial
);

ordensServicoRouter.post(
  "/:ordemServicoId/apontamentos",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  createApontamento
);

ordensServicoRouter.patch(
  "/:id",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  validate(updateOrdemServicoDto),
  update
);

ordensServicoRouter.patch(
  "/:id/iniciar",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  iniciar
);

ordensServicoRouter.patch(
  "/:id/aguardar-peca",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  aguardarPeca
);

ordensServicoRouter.patch(
  "/:id/retomar",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  retomar
);

ordensServicoRouter.patch(
  "/:id/encerrar",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  encerrar
);

ordensServicoRouter.patch(
  "/:id/cancelar",
  requireRole(["ADMIN", "SUPERVISOR"]),
  cancelar
);