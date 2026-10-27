import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export class Banco {
  static criarCliente(url: string): PrismaClient {
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  }
}
