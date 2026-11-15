import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { createMaterialDto } from "./dto/create-material.dto.js";
import { listMateriaisDto } from "./dto/list-materiais.dto.js";
import { updateEstoqueMaterialDto, updateMaterialDto } from "./dto/update-material.dto.js";
import { create, findAll, findById, getPrevisaoRupturaEmpresa, getPrevisaoRupturaMaterial, remove, update, updateEstoque, verificarPrevisaoRupturaEmpresa } from "./materiais.controller.js";

export const materiaisRouter = Router();

materiaisRouter.use(authMiddleware);

materiaisRouter.get("/", validate(listMateriaisDto, "query"), findAll);
materiaisRouter.get("/previsao-ruptura", getPrevisaoRupturaEmpresa);
materiaisRouter.post("/previsao-ruptura/verificar", requireRole(["ADMIN", "SUPERVISOR"]), verificarPrevisaoRupturaEmpresa);
materiaisRouter.get("/:id/previsao-ruptura", getPrevisaoRupturaMaterial);
materiaisRouter.get("/previsao-ruptura", getPrevisaoRupturaEmpresa);
materiaisRouter.post("/previsao-ruptura/verificar", requireRole(["ADMIN", "SUPERVISOR"]), verificarPrevisaoRupturaEmpresa);
materiaisRouter.get("/:id/previsao-ruptura", getPrevisaoRupturaMaterial);
materiaisRouter.get("/:id", findById);
materiaisRouter.post("/", requireRole(["ADMIN", "SUPERVISOR"]), validate(createMaterialDto), create);
materiaisRouter.patch("/:id", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateMaterialDto), update);
materiaisRouter.patch("/:id/estoque", requireRole(["ADMIN", "SUPERVISOR"]), validate(updateEstoqueMaterialDto), updateEstoque);
materiaisRouter.delete("/:id", requireRole(["ADMIN"]), remove);