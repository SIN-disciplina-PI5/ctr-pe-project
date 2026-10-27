import type { PrismaClient } from "@prisma/client";
import { TABELAS } from "./config.js";

export class ResetBanco {
  constructor(private readonly prisma: PrismaClient) {}

  async executar(): Promise<void> {
    const lista = TABELAS.map((tabela) => `"${tabela}"`).join(", ");
    await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${lista} RESTART IDENTITY CASCADE`);
  }
}
