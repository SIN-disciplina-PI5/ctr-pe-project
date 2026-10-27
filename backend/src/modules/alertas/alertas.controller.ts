import type { NextFunction, Request, Response } from "express";
import type { StatusAlerta, TipoAlerta } from "@prisma/client";
import { AlertasService } from "./alertas.service.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";

const alertasService = new AlertasService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { status, tipo, usuarioId } = req.query as {
      status?: string;
      tipo?: string;
      usuarioId?: string;
    };

    const filters = {
      empresaId: currentUser.empresaId, // Força a empresa do usuário autenticado
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
    const currentUser = getCurrentUser(req);
    const { status, tipo } = req.query as {
      status?: string;
      tipo?: string;
    };

    const filters = {
      empresaId: currentUser.empresaId, // Força a empresa do usuário autenticado
      ...(status !== undefined && { status: status as StatusAlerta }),
      ...(tipo !== undefined && { tipo: tipo as TipoAlerta }),
    };

    const result = await alertasService.findByUsuario(currentUser.id, filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await alertasService.findById(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { empresaId: _, ...bodyData } = req.body; // Remove empresaId vindo do body se existir

    const result = await alertasService.create({
      ...bodyData,
      empresaId: currentUser.empresaId, // Força a empresa do usuário autenticado
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function marcarLido(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await alertasService.marcarComoLido(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resolver(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await alertasService.resolver(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function ignorar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await alertasService.ignorar(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}