import type { Request, Response, NextFunction } from "express";
import { OrdensServicoMateriaisService } from "./ordens-servico-materiais.service.js";

const service = new OrdensServicoMateriaisService();

export async function findByOrdemServico(req: Request, res: Response, next: NextFunction) {
  try {
    const { ordemServicoId } = req.params as { ordemServicoId: string };
    const result = await service.findByOrdemServico(ordemServicoId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await service.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { ordemServicoId } = req.params as { ordemServicoId: string };
    const result = await service.create(ordemServicoId, req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await service.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function consumir(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { quantidade } = req.body as { quantidade?: number };
    const result = await service.consumir(id, quantidade);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function devolver(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { quantidade } = req.body as { quantidade?: number };
    const result = await service.devolver(id, quantidade);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await service.cancelar(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}