import type { NextFunction, Request, Response } from "express";
import { getCurrentUser } from "../../common/utils/get-current-user.js";
import type { ChatDto } from "./dto/chat.dto.js";
import { ChatService } from "./chat.service.js";
import { ConversationRepository } from "./conversation.repository.js";
import { createOrchestratorService } from "./orchestrator.factory.js";

let service: ChatService | undefined;

function getService(): ChatService {
  service ??= new ChatService(
    new ConversationRepository(),
    createOrchestratorService(),
  );
  return service;
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const actor = getCurrentUser(req);
    const { message, conversationId } = req.body as ChatDto;
    const result = await getService().chat({
      actor,
      message,
      ...(conversationId === undefined ? {} : { conversationId }),
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
