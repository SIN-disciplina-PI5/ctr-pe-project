import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createLocalizacaoDto } from "./dto/create-localizacao.dto.js";
import { listLocalizacoesDto } from "./dto/list-localizacoes.dto.js";
import { updateLocalizacaoDto } from "./dto/update-localizacao.dto.js";
import { create, findAll, findById, remove, update } from "./localizacoes.controller.js";

export const localizacoesRouter = Router();

localizacoesRouter.use(authMiddleware);

localizacoesRouter.get("/", validate(listLocalizacoesDto, "query"), findAll);
localizacoesRouter.get("/:id", findById);
localizacoesRouter.post(
  "/",
  requireRole(["ADMIN", "SUPERVISOR"]),
  validate(createLocalizacaoDto),
  create,
);
localizacoesRouter.patch(
  "/:id",
  requireRole(["ADMIN", "SUPERVISOR"]),
  validate(updateLocalizacaoDto),
  update,
);
localizacoesRouter.delete("/:id", requireRole(["ADMIN", "SUPERVISOR"]), remove);