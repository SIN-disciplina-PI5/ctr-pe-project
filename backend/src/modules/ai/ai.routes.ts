import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { aiChatRateLimiter } from "../../common/middlewares/ai-chat-rate-limit.middleware.js";
import { aiReportRateLimiter } from "../../common/middlewares/ai-report-rate-limit.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { chat } from "./chat.controller.js";
import { chatDto } from "./dto/chat.dto.js";
import { generateQueryDto } from "./dto/generate-query.dto.js";
import {
  createReportDto,
  listReportsQueryDto,
  reportIdParamsDto,
} from "./dto/report.dto.js";
import { executeQuery, generateQuery } from "./query-generation.controller.js";
import {
  createReport,
  downloadReport,
  getReport,
  listReports,
} from "./report.controller.js";

export const aiRouter = Router();

aiRouter.use(authMiddleware);
aiRouter.post("/chat", aiChatRateLimiter, validate(chatDto), chat);
aiRouter.post("/query", validate(generateQueryDto), executeQuery);
aiRouter.post("/query/generate", validate(generateQueryDto), generateQuery);

aiRouter.post(
  "/reports",
  aiReportRateLimiter,
  validate(createReportDto),
  createReport,
);
aiRouter.get("/reports", validate(listReportsQueryDto, "query"), listReports);
aiRouter.get("/reports/:id", validate(reportIdParamsDto, "params"), getReport);
aiRouter.get(
  "/reports/:id/download",
  validate(reportIdParamsDto, "params"),
  downloadReport,
);
