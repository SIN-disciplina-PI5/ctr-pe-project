import { FLAG_FORCE } from "./config.js";

const HOST_DESCONHECIDO = "desconhecido";

export interface AmbienteValidado {
  url: string;
  host: string;
}

export class AmbienteGuard {
  static validar(): AmbienteValidado {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Recusado: NODE_ENV=production.");
    }

    if (!process.argv.includes(FLAG_FORCE)) {
      throw new Error(
        `Este script APAGA todos os dados. Rode com ${FLAG_FORCE} para confirmar:\n  npm run db:reset-synthetic -- ${FLAG_FORCE}`,
      );
    }

        const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL não definida.");
    }

    const host = AmbienteGuard.extrairHost(url);
    const hostPermitido = process.env.SYNTHETIC_DATABASE_ALLOWED_HOST
      ?.trim()
      .toLowerCase();

    if (!hostPermitido) {
      throw new Error(
        "SYNTHETIC_DATABASE_ALLOWED_HOST não definido. O reset foi recusado.",
      );
    }

    if (host === HOST_DESCONHECIDO || host !== hostPermitido) {
      throw new Error(
        `Banco não autorizado. Host recebido: ${host}. Host permitido: ${hostPermitido}.`,
      );
    }

    return { url, host };
  }

  private static extrairHost(url: string): string {
    try {
      return new URL(url).hostname || HOST_DESCONHECIDO;
    } catch {
      return HOST_DESCONHECIDO;
    }
  }
}
