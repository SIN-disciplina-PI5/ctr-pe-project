import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import {
  findAll,
  findById,
  create,
  update,
  remove,
} from "./localizacoes.controller.js";
import { createLocalizacaoDto } from "./dto/create-localizacao.dto.js";
import { updateLocalizacaoDto } from "./dto/update-localizacao.dto.js";
import { listLocalizacoesDto } from "./dto/list-localizacoes.dto.js";

export const localizacoesRouter = Router();

localizacoesRouter.use(authMiddleware);

localizacoesRouter.get("/", validate(listLocalizacoesDto, "query"), findAll);
localizacoesRouter.get("/:id", findById);
localizacoesRouter.post("/", validate(createLocalizacaoDto), create);
localizacoesRouter.patch("/:id", validate(updateLocalizacaoDto), update);
localizacoesRouter.delete("/:id", remove);
