import type { NextFunction, Request, Response } from "express";
import { LocalizacoesService } from "./localizacoes.service.js";

const localizacoesService = new LocalizacoesService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, search, ativa } = req.query as {
      empresaId?: string;
      search?: string;
      ativa?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(search !== undefined && { search }),
      ...(ativa !== undefined && { ativa: ativa === "true" }),
    };

    const result = await localizacoesService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await localizacoesService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await localizacoesService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await localizacoesService.update(id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    await localizacoesService.delete(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}