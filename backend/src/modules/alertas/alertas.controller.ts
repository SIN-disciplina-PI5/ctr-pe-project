import type { NextFunction, Request, Response } from "express";
import type { StatusAlerta, TipoAlerta } from "@prisma/client";
import { AlertasService } from "./alertas.service.js";

const alertasService = new AlertasService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, status, tipo, usuarioId } = req.query as {
      empresaId?: string;
      status?: string;
      tipo?: string;
      usuarioId?: string;
    };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(status !== undefined && { status: status as StatusAlerta }),
      ...(tipo !== undefined && { tipo: tipo as TipoAlerta }),
      ...(usuarioId !== undefined && { usuarioId }),
    };

    const result = await alertasService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findMe(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(200).json([]);
    }

    const { status, tipo } = req.query as {
      status?: string;
      tipo?: string;
    };

    const filters = {
      ...(status !== undefined && { status: status as StatusAlerta }),
      ...(tipo !== undefined && { tipo: tipo as TipoAlerta }),
    };

    const result = await alertasService.findByUsuario(usuarioId, filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await alertasService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await alertasService.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function marcarLido(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await alertasService.marcarComoLido(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resolver(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await alertasService.resolver(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function ignorar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const result = await alertasService.ignorar(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
