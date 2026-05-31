import type { Request, Response, NextFunction } from "express";
import { AtivosService } from "./ativos.service.js";
import type { TipoAtivo, StatusAtivo, Criticidade } from "@prisma/client";

const ativosService = new AtivosService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, localizacaoId, status, tipo, criticidade, search } = req.query as {
      empresaId?: string;
      localizacaoId?: string;
      status?: StatusAtivo;
      tipo?: TipoAtivo;
      criticidade?: Criticidade;
      search?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(localizacaoId !== undefined && { localizacaoId }),
      ...(status !== undefined && { status }),
      ...(tipo !== undefined && { tipo }),
      ...(criticidade !== undefined && { criticidade }),
      ...(search !== undefined && { search }),
    };

    const result = await ativosService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await ativosService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ativosService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await ativosService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: StatusAtivo };
    const result = await ativosService.updateStatus(id, status);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await ativosService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}