import type { Request, Response, NextFunction } from "express";
import { MateriaisService } from "./materiais.service.js";

const materiaisService = new MateriaisService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, search, ativo, estoqueBaixo } = req.query as {
      empresaId?: string;
      search?: string;
      ativo?: string;
      estoqueBaixo?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(search !== undefined && { search }),
      ...(ativo !== undefined && { ativo: ativo === "true" }),
      ...(estoqueBaixo !== undefined && { estoqueBaixo: estoqueBaixo === "true" }),
    };

    const result = await materiaisService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await materiaisService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await materiaisService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await materiaisService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateEstoque(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await materiaisService.updateEstoque(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await materiaisService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}