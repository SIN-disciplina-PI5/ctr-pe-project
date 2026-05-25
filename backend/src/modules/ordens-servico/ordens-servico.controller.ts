import type { NextFunction, Request, Response } from "express";
import { OrdensServicoService } from "./ordens-servico.service.js";

const ordensServicoService = new OrdensServicoService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { empresaId, ativoId, responsavelId, status, prioridade, search } =
      req.query as {
        empresaId?: string;
        ativoId?: string;
        responsavelId?: string;
        status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
        prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
        search?: string;
      };

    const filters = {
      ...(empresaId !== undefined && { empresaId }),
      ...(ativoId !== undefined && { ativoId }),
      ...(responsavelId !== undefined && { responsavelId }),
      ...(status !== undefined && { status }),
      ...(prioridade !== undefined && { prioridade }),
      ...(search !== undefined && { search }),
    };

    const result = await ordensServicoService.findAll(filters);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };

    const result = await ordensServicoService.findById(id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ordensServicoService.create(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };

    const result = await ordensServicoService.update(id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function iniciar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { iniciadaEm } = req.body as { iniciadaEm?: string };

    const result = await ordensServicoService.iniciar(id, iniciadaEm);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function aguardarPeca(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string };
    const { observacao } = req.body as { observacao?: string };

    const result = await ordensServicoService.aguardarPeca(id, observacao);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}