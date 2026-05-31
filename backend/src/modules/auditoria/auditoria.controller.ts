import type { NextFunction, Request, Response } from "express";
import type { TipoAcaoAuditoria } from "@prisma/client";
import { AuditoriaService } from "./auditoria.service.js";

const auditoriaService = new AuditoriaService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, usuarioId, entidade, entidadeId, acao, limit } =
      req.query as {
        empresaId?: string;
        usuarioId?: string;
        entidade?: string;
        entidadeId?: string;
        acao?: string;
        limit?: string;
      };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
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
    const { id } = req.params as { id: string };
    const result = await auditoriaService.findById(id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
