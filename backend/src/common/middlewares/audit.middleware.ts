import type { NextFunction, Request, Response } from "express";
import type { TipoAcaoAuditoria } from "@prisma/client";
import { AuditoriaService } from "../../modules/auditoria/auditoria.service.js";

const auditoriaService = new AuditoriaService();

const METODOS_AUDITAVEIS = ["POST", "PUT", "PATCH", "DELETE"];

const ROTAS_IGNORADAS = ["/api/auth", "/api/auditoria"];

function resolverAcao(method: string, path: string): TipoAcaoAuditoria | null {
  if (path.endsWith("/encerrar")) return "ENCERRAMENTO_OS";
  if (path.endsWith("/cancelar")) return "CANCELAMENTO_OS";

  switch (method) {
    case "POST":
      return "CRIACAO";
    case "PUT":
    case "PATCH":
      return "ALTERACAO";
    case "DELETE":
      return "EXCLUSAO";
    default:
      return null;
  }
}

function resolverEntidade(baseUrl: string, originalUrl: string): string {
  if (originalUrl.startsWith("/api/ai/chat")) return "conversa_ia";

  const segmentos = baseUrl.split("/").filter(Boolean);
  return segmentos[segmentos.length - 1] ?? "desconhecida";
}

function sanitizarRespostaAuditada(
  originalUrl: string,
  corpo: Record<string, unknown> | undefined,
): unknown {
  if (!originalUrl.startsWith("/api/ai/chat")) return corpo;

  return {
    conversationId: corpo?.["conversationId"] ?? null,
    status: corpo?.["status"] ?? null,
    intent: corpo?.["intent"] ?? null,
  };
}

export function auditMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!METODOS_AUDITAVEIS.includes(req.method)) {
    return next();
  }

  let corpoResposta: unknown;
  const jsonOriginal = res.json.bind(res);
  res.json = (body?: unknown) => {
    corpoResposta = body;
    return jsonOriginal(body);
  };

  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    const baseUrl = req.baseUrl || req.originalUrl;
    if (ROTAS_IGNORADAS.some((rota) => baseUrl.startsWith(rota))) return;

    const acao = resolverAcao(req.method, req.path);
    if (!acao) return;

    const corpo =
      corpoResposta && typeof corpoResposta === "object"
        ? (corpoResposta as Record<string, unknown>)
        : undefined;

    const entidade = resolverEntidade(baseUrl, req.originalUrl);
    const entidadeId = String(
      corpo?.["conversationId"] ??
        corpo?.["id"] ??
        req.params?.["id"] ??
        "desconhecido",
    );

    const empresaIdResposta = corpo?.["empresaId"];
    const empresaId =
      (typeof empresaIdResposta === "string" ? empresaIdResposta : undefined) ??
      req.user?.empresaId ??
      null;
    const usuarioId = req.user?.id ?? null;

    auditoriaService
      .registrar({
        entidade,
        entidadeId,
        acao,
        empresaId,
        usuarioId,
        ...(corpoResposta !== undefined && {
          depois: sanitizarRespostaAuditada(req.originalUrl, corpo),
        }),
      })
      .catch((error) => {
        console.error("[auditoria] falha ao registrar log:", error);
      });
  });

  next();
}
