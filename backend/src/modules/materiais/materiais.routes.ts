import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createMaterialDto } from "./dto/create-material.dto.js";
import { listMateriaisDto } from "./dto/list-materiais.dto.js";
import { updateEstoqueMaterialDto, updateMaterialDto } from "./dto/update-material.dto.js";
import { create, findAll, findById, remove, update, updateEstoque } from "./materiais.controller.js";

export const materiaisRouter = Router();

materiaisRouter.use(authMiddleware);

materiaisRouter.get("/", validate(listMateriaisDto, "query"), findAll);
materiaisRouter.get("/:id", findById);
materiaisRouter.post("/", requireRole(["ADMIN", "SUPERVISOR"]), validate(createMaterialDto), create);
materiaisRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateMaterialDto), update);
materiaisRouter.patch("/:id/estoque", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateEstoqueMaterialDto), updateEstoque);
materiaisRouter.delete("/:id", requireRole(["ADMIN"]), remove);