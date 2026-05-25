import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createOrdemServicoDto } from "./dto/create-ordem-servico.dto.js";
import { listOrdensServicoDto } from "./dto/list-ordens-servico.dto.js";
import { updateOrdemServicoDto } from "./dto/update-ordem-servico.dto.js";
import { create, findAll, findById, update, iniciar, aguardarPeca  } from "./ordens-servico.controller.js";



export const ordensServicoRouter = Router();

ordensServicoRouter.use(authMiddleware);

ordensServicoRouter.get("/", validate(listOrdensServicoDto, "query"), findAll);
ordensServicoRouter.get("/:id", findById);
ordensServicoRouter.post(
  "/",
  requireRole(["ADMIN", "SUPERVISOR", "TECNICO"]),
  validate(createOrdemServicoDto),
  create
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