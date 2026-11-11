import type { Request, Response, NextFunction } from "express";
import { ParadasAtivosService } from "./paradas-ativos.service.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";

const paradasAtivosService = new ParadasAtivosService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { ativoId, status, from, to } = req.query as {
      ativoId?: string;
      status?: "ABERTA" | "ENCERRADA" | "CANCELADA";
      from?: string;
      to?: string;
    };

    const filters = {
      empresaId: currentUser.empresaId,
      ...(ativoId !== undefined && { ativoId }),
      ...(status !== undefined && { status }),
      ...(from !== undefined && { from }),
      ...(to !== undefined && { to }),
    };

    const result = await paradasAtivosService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await paradasAtivosService.findById(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { empresaId: _, ...bodyData } = req.body;

    const result = await paradasAtivosService.create({
      ...bodyData,
      empresaId: currentUser.empresaId,
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };

    const result = await paradasAtivosService.update(id, currentUser.empresaId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function encerrar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const { fimEm } = req.body as { fimEm?: string };

    const result = await paradasAtivosService.encerrar(id, currentUser.empresaId, fimEm);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const { motivo } = req.body as { motivo?: string };

    const result = await paradasAtivosService.cancelar(id, currentUser.empresaId, motivo);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}