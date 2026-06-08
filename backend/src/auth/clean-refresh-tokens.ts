import "dotenv/config";

import { AuthService } from "./auth.service.js";
import { prisma } from "../prisma/prisma.client.js";

async function main() {
  const authService = new AuthService();
  const result = await authService.cleanExpiredOrRevokedRefreshTokens();
  console.log(`Refresh tokens removidos: ${result.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });