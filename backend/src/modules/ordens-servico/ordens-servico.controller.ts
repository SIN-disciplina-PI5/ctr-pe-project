import type { NextFunction, Request, Response } from "express";
import { OrdensServicoService } from "./ordens-servico.service.js";
import { canIniciarOS, canAguardarPecaOS, canRetomarOS, canEncerrarOS, canCancelarOS } from "./ordens-servico.policy.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";

const ordensServicoService = new OrdensServicoService();

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { ativoId, responsavelId, status, prioridade, search } =
      req.query as {
        ativoId?: string;
        responsavelId?: string;
        status?: "ABERTA" | "EM_EXECUCAO" | "AGUARDANDO_PECA" | "ENCERRADA" | "CANCELADA";
        prioridade?: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
        search?: string;
      };

    const filters = {
      empresaId: currentUser.empresaId, // Always use authenticated company ID
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
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const result = await ordensServicoService.findById(id, currentUser.empresaId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { empresaId: _, ...bodyData } = req.body; // Remove company ID from body if present

    const result = await ordensServicoService.create({
      ...bodyData,
      empresaId: currentUser.empresaId, // Force authenticated user company ID
    });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const { empresaId: _, ...bodyData } = req.body;

    const result = await ordensServicoService.update(id, currentUser.empresaId, bodyData);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function iniciar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { iniciadaEm } = (req.body ?? {}) as { iniciadaEm?: string };

    const os = await ordensServicoService.findById(id, currentUser.empresaId);

    if (!canIniciarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para iniciar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.iniciar(id, currentUser.empresaId, iniciadaEm);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function aguardarPeca(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { observacao } = req.body as { observacao?: string };

    const os = await ordensServicoService.findById(id, currentUser.empresaId);

    if (!canAguardarPecaOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para esta ação.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.aguardarPeca(id, currentUser.empresaId, observacao);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function retomar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { observacao } = req.body as { observacao?: string };

    const os = await ordensServicoService.findById(id, currentUser.empresaId);

    if (!canRetomarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para esta ação.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.retomar(id, currentUser.empresaId, observacao);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function encerrar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { diagnostico, solucao, observacao, encerradaEm } = req.body as {
      diagnostico?: string;
      solucao?: string;
      observacao?: string;
      encerradaEm?: string;
    };

    const os = await ordensServicoService.findById(id, currentUser.empresaId);

    if (!canEncerrarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para encerrar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.encerrar(id, currentUser.empresaId, {
      ...(diagnostico !== undefined && { diagnostico }),
      ...(solucao !== undefined && { solucao }),
      ...(observacao !== undefined && { observacao }),
      ...(encerradaEm !== undefined && { encerradaEm }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function cancelar(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUser = getCurrentUser(req);
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { motivo, canceladaEm } = req.body as {
      motivo?: string;
      canceladaEm?: string;
    };

    await ordensServicoService.findById(id, currentUser.empresaId);

    if (!canCancelarOS(actor)) {
      throw new AppError({ message: "Sem permissão para cancelar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.cancelar(id, currentUser.empresaId, {
      ...(motivo !== undefined && { motivo }),
      ...(canceladaEm !== undefined && { canceladaEm }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}