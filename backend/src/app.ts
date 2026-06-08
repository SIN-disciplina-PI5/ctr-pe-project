import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { AppError } from "./common/errors/AppError.js";
import { ErrorCode } from "./common/errors/error-code.js";
import { auditMiddleware } from "./common/middlewares/audit.middleware.js";
import { errorHandlerMiddleware } from "./common/middlewares/error-handler.middleware.js";
import { requestContextMiddleware } from "./common/middlewares/request-context.middleware.js";
import { authRouter } from "./auth/auth.routes.js";
import { usuariosRouter } from "./modules/usuarios/usuarios.routes.js";
import { empresasRouter } from "./modules/empresas/empresas.routes.js";
import { ativosRouter } from "./modules/ativos/ativos.routes.js";
import { materiaisRouter } from "./modules/materiais/materiais.routes.js";
import { alertasRouter } from "./modules/alertas/alertas.routes.js";
import { ordensServicoRouter } from "./modules/ordens-servico/ordens-servico.routes.js";
import { paradasAtivosRouter } from "./modules/paradas-ativos/paradas-ativos.routes.js";
import { ordensServicoMateriaisRouter } from "./modules/ordens-servico-materiais/ordens-servico-materiais.routes.js";
import { apontamentosOSRouter } from "./modules/apontamentos-os/apontamentos-os.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { auditoriaRouter } from "./modules/auditoria/auditoria.routes.js";
import { localizacoesRouter } from "./modules/localizacoes/localizacoes.routes.js";

const app = express();
export { app };
export default app;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(requestContextMiddleware);
app.use(express.json());
app.use(auditMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/empresas", empresasRouter);
app.use("/api/ativos", ativosRouter);
app.use("/api/materiais", materiaisRouter);
app.use("/api/alertas", alertasRouter);
app.use("/api/ordens-servico", ordensServicoRouter);
app.use("/api/paradas-ativos", paradasAtivosRouter);
app.use("/api/ordens-servico-materiais", ordensServicoMateriaisRouter);
app.use("/api/apontamentos-os", apontamentosOSRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auditoria", auditoriaRouter);
app.use("/api/localizacoes", localizacoesRouter);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "ctrpe-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/", (_req, _res, next) => {
  next(
    new AppError({
      message: "Rota não encontrada.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    }),
  );
});

app.use((_req, _res, next) => {
  next(
    new AppError({
      message: "Rota não encontrada.",
      statusCode: 404,
      errorCode: ErrorCode.NOT_FOUND,
    }),
  );
});

app.use(errorHandlerMiddleware);