import type { Request, Response, NextFunction } from "express";
import { LocalizacoesService } from "./localizacoes.service.js";

const localizacoesService = new LocalizacoesService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { search, ativa, empresaId } = req.query as {
      search?: string;
      ativa?: string;
      empresaId?: string;
    };

    const filters = {
      ...(search !== undefined && { search }),
      ...(ativa !== undefined && { ativa: ativa === "true" }),
      ...(empresaId !== undefined && { empresaId }),
    };

    const result = await localizacoesService.findAll(filters, actor);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const result = await localizacoesService.findById(id, actor);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const result = await localizacoesService.create(req.body, actor);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const result = await localizacoesService.update(id, req.body, actor);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    await localizacoesService.delete(id, actor);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
