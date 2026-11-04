import type { NextFunction, Request, Response } from "express";
import { getCurrentUser } from "../../common/utils/get-current-user.js";
import type { GenerateQueryDto } from "./dto/generate-query.dto.js";
import { createLlmProvider } from "./llm-config.js";
import { QueryAgentService } from "./query-agent.service.js";
import { createQueryExecutor } from "./query-executor.js";
import { QueryGenerationService } from "./query-generation.service.js";

let service: QueryGenerationService | undefined;
let agentService: QueryAgentService | undefined;

function getService(): QueryGenerationService {
  service ??= new QueryGenerationService(createLlmProvider());
  return service;
}

function getAgentService(): QueryAgentService {
  agentService ??= new QueryAgentService(
    new QueryGenerationService(createLlmProvider()),
    createQueryExecutor(),
  );
  return agentService;
}

export async function generateQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getCurrentUser(req);
    const { question } = req.body as GenerateQueryDto;
    const result = await getService().generate({
      question,
      empresaId: user.empresaId,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function executeQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = getCurrentUser(req);
    const { question } = req.body as GenerateQueryDto;
    const result = await getAgentService().query({
      question,
      empresaId: user.empresaId,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
