import type { Request, Response, NextFunction } from "express";
import { ParadasAtivosService } from "./paradas-ativos.service.js";

const paradasAtivosService = new ParadasAtivosService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, ativoId, status, from, to } = req.query as {
      empresaId?: string;
      ativoId?: string;
      status?: "ABERTA" | "ENCERRADA" | "CANCELADA";
      from?: string;
      to?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
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
    const { id } = req.params as { id: string };
    const result = await paradasAtivosService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paradasAtivosService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await paradasAtivosService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function encerrar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { fimEm } = req.body as { fimEm?: string };
    const result = await paradasAtivosService.encerrar(id, fimEm);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { motivo } = req.body as { motivo?: string };
    const result = await paradasAtivosService.cancelar(id, motivo);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}