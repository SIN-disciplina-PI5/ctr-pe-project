import type { NextFunction, Request, Response } from "express";
import { OrdensServicoService } from "./ordens-servico.service.js";
import { canIniciarOS, canAguardarPecaOS, canRetomarOS, canEncerrarOS, canCancelarOS } from "./ordens-servico.policy.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";

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
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { iniciadaEm } = req.body as { iniciadaEm?: string };

    const os = await ordensServicoService.findById(id);

    if (!canIniciarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para iniciar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.iniciar(id, iniciadaEm);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function aguardarPeca(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { observacao } = req.body as { observacao?: string };

    const os = await ordensServicoService.findById(id);

    if (!canAguardarPecaOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para esta ação.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.aguardarPeca(id, observacao);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function retomar(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { observacao } = req.body as { observacao?: string };

    const os = await ordensServicoService.findById(id);

    if (!canRetomarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para esta ação.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.retomar(id, observacao);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function encerrar(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { diagnostico, solucao, observacao, encerradaEm } = req.body as {
      diagnostico?: string;
      solucao?: string;
      observacao?: string;
      encerradaEm?: string;
    };

    const os = await ordensServicoService.findById(id);

    if (!canEncerrarOS(actor, os)) {
      throw new AppError({ message: "Sem permissão para encerrar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.encerrar(id, {
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
    const actor = req.user!;
    const { id } = req.params as { id: string };
    const { motivo, canceladaEm } = req.body as {
      motivo?: string;
      canceladaEm?: string;
    };

    if (!canCancelarOS(actor)) {
      throw new AppError({ message: "Sem permissão para cancelar esta O.S.", statusCode: 403, errorCode: ErrorCode.FORBIDDEN });
    }

    const result = await ordensServicoService.cancelar(id, {
      ...(motivo !== undefined && { motivo }),
      ...(canceladaEm !== undefined && { canceladaEm }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}