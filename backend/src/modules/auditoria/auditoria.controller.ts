import type { NextFunction, Request, Response } from "express";
import type { TipoAcaoAuditoria } from "@prisma/client";
import { AuditoriaService } from "./auditoria.service.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";

const auditoriaService = new AuditoriaService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { usuarioId, entidade, entidadeId, acao, limit } =
      req.query as {
        usuarioId?: string;
        entidade?: string;
        entidadeId?: string;
        acao?: string;
        limit?: string;
      };

    const filters = {
      empresaId: currentUser.empresaId, // Força a empresa do usuário autenticado
      ...(usuarioId !== undefined && { usuarioId }),
      ...(entidade !== undefined && { entidade }),
      ...(entidadeId !== undefined && { entidadeId }),
      ...(acao !== undefined && { acao: acao as TipoAcaoAuditoria }),
      ...(limit !== undefined && { limit: Number(limit) }),
    };

    const result = await auditoriaService.findAll(filters);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await auditoriaService.findById(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}