import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { requireRole } from "../../common/middlewares/require-role.middleware.js";
import {
  getResumo,
  getAtivos,
  getOrdensServico,
  getMateriais,
  getCustos,
} from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/resumo", requireRole(["ADMIN", "GESTOR", "SUPERVISOR", "CONSULTA"]), getResumo);
dashboardRoutes.get("/ativos", requireRole(["ADMIN", "GESTOR", "SUPERVISOR", "CONSULTA"]), getAtivos);
dashboardRoutes.get("/ordens-servico", requireRole(["ADMIN", "GESTOR", "SUPERVISOR", "CONSULTA"]), getOrdensServico);
dashboardRoutes.get("/materiais", requireRole(["ADMIN", "GESTOR", "SUPERVISOR", "CONSULTA"]), getMateriais);
dashboardRoutes.get("/custos", requireRole(["ADMIN", "GESTOR", "SUPERVISOR"]), getCustos);
