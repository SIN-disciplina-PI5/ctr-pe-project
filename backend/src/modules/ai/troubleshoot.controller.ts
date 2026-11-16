import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCode } from "../../common/errors/error-code.js";
import { getCurrentUser } from "../../common/utils/get-current-user.js";
import type { TroubleshootDto } from "./dto/troubleshoot.dto.js";
import { ConsoleLlmObserver } from "./llm-console-observer.js";
import { createLlmProvider, loadLlmConfig } from "./llm-config.js";
import { TroubleshootAgentService } from "./troubleshoot-agent.service.js";

let service: TroubleshootAgentService | undefined;
const llmObserver = new ConsoleLlmObserver();

function getService(): TroubleshootAgentService {
  service ??= new TroubleshootAgentService(
    createLlmProvider(loadLlmConfig(), llmObserver),
  );
  return service;
}

export async function troubleshootAsset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getCurrentUser(req);
    if (!user.empresaId) {
      throw new AppError({
        message: "Usuário sem empresa vinculada.",
        statusCode: 403,
        errorCode: ErrorCode.FORBIDDEN,
      });
    }

    const { ordemServicoId, ativoId, sintoma } = req.body as TroubleshootDto;

    const result = await getService().troubleshoot({
      empresaId: user.empresaId,
      ...(ordemServicoId === undefined ? {} : { ordemServicoId }),
      ...(ativoId === undefined ? {} : { ativoId }),
      ...(sintoma === undefined ? {} : { sintoma }),
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
