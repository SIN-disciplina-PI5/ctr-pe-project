import { FLAG_FORCE } from "./config";

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

    return { url, host: AmbienteGuard.extrairHost(url) };
  }

  private static extrairHost(url: string): string {
    try {
      return new URL(url).hostname || HOST_DESCONHECIDO;
    } catch {
      return HOST_DESCONHECIDO;
    }
  }
}
