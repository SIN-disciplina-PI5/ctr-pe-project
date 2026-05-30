import { Router } from "express";
import { DashboardController } from "./dashboard.controller";

const router = Router();
const controller = new DashboardController();

router.get("/resumo", controller.getResumo);
router.get("/ativos", controller.getAtivos);
router.get("/ordens-servico", controller.getOrdensServico);
router.get("/materiais", controller.getMateriais);
router.get("/custos", controller.getCustos);

export const dashboardRoutes = router;