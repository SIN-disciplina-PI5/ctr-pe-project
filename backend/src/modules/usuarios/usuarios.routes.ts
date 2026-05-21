import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { findAll, findById, create, update, remove } from "./usuarios.controller.js";

export const usuariosRouter = Router();

usuariosRouter.use(authMiddleware);

usuariosRouter.get("/", findAll);
usuariosRouter.get("/:id", findById);
usuariosRouter.post("/", create);
usuariosRouter.patch("/:id", update);
usuariosRouter.delete("/:id", remove);