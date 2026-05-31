import type { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service.js";

const dashboardService = new DashboardService();

function getEmpresaId(req: Request): string {
  const actor = req.user;
  if (actor?.empresaId) return actor.empresaId;
  return String(req.query["empresaId"] ?? "");
}

export async function getResumo(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = getEmpresaId(req);
    const dados = await dashboardService.getResumo(empresaId);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}

export async function getAtivos(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = getEmpresaId(req);
    const dados = await dashboardService.getAtivos(empresaId);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}

export async function getOrdensServico(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = getEmpresaId(req);
    const dados = await dashboardService.getOrdensServico(empresaId);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}

export async function getMateriais(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = getEmpresaId(req);
    const dados = await dashboardService.getMateriais(empresaId);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}

export async function getCustos(req: Request, res: Response, next: NextFunction) {
  try {
    const empresaId = getEmpresaId(req);
    const dados = await dashboardService.getCustos(empresaId);
    return res.status(200).json(dados);
  } catch (error) {
    next(error);
  }
}
