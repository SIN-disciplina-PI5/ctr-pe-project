import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import { findAll, findById, create, update, resetPassword, remove } from "./usuarios.controller.js";

export const usuariosRouter = Router();

usuariosRouter.use(authMiddleware);

usuariosRouter.get("/", requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]), findAll);
usuariosRouter.get("/:id", findById);
usuariosRouter.post("/", requireRole(["ADMIN"]), create);
usuariosRouter.patch("/:id", requireRole(["ADMIN"]), update);
usuariosRouter.patch("/:id/password", requireRole(["ADMIN"]), resetPassword);
usuariosRouter.delete("/:id", requireRole(["ADMIN"]), remove);