import type { Request, Response, NextFunction } from "express";
import { EmpresasService } from "./empresas.service.js";

const empresasService = new EmpresasService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, ativa } = req.query as { search?: string; ativa?: string };

    const filters = {
      ...(search !== undefined && { search }),
      ...(ativa !== undefined && { ativa: ativa === "true" }),
    };

    const result = await empresasService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await empresasService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await empresasService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await empresasService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await empresasService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}