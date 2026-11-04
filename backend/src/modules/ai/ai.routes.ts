import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { generateQueryDto } from "./dto/generate-query.dto.js";
import { executeQuery, generateQuery } from "./query-generation.controller.js";

export const aiRouter = Router();

aiRouter.use(authMiddleware);
aiRouter.post("/query", validate(generateQueryDto), executeQuery);
aiRouter.post("/query/generate", validate(generateQueryDto), generateQuery);
