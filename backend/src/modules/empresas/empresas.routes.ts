import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { findAll, findById, create, update, remove } from "./empresas.controller.js";
import { createEmpresaDto } from "./dto/create-empresa.dto.js";
import { updateEmpresaDto } from "./dto/update-empresa.dto.js";
import { listEmpresasDto } from "./dto/list-empresas.dto.js";

export const empresasRouter = Router();

empresasRouter.use(authMiddleware);

empresasRouter.get("/", validate(listEmpresasDto, "query"), findAll);
empresasRouter.get("/:id", findById);
empresasRouter.post("/", validate(createEmpresaDto), create);
empresasRouter.patch("/:id", validate(updateEmpresaDto), update);
empresasRouter.delete("/:id", remove);
