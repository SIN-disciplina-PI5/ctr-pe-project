import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { findAll, findById, create, update, remove } from "./empresas.controller.js";

export const empresasRouter = Router();

empresasRouter.use(authMiddleware);

empresasRouter.get("/", findAll);
empresasRouter.get("/:id", findById);
empresasRouter.post("/", create);
empresasRouter.patch("/:id", update);
empresasRouter.delete("/:id", remove);