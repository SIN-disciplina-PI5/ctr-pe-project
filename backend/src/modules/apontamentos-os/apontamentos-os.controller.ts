import type { Request, Response, NextFunction } from "express";
import { ApontamentosOSService } from "./apontamentos-os.service.js";

const service = new ApontamentosOSService();

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
    const usuarioId = req.user!.userId;
    const result = await service.create({
      ordemServicoId,
      usuarioId,
      inicioEm: new Date(req.body.inicioEm),
      ...(req.body.descricao !== undefined && { descricao: req.body.descricao }),
      ...(req.body.custoHora !== undefined && { custoHora: req.body.custoHora }),
    });
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

export async function encerrar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await service.encerrar(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await service.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}