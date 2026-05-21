import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/prisma/prisma.client.js";

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      nome: "Admin Teste",
      email: "admin@teste.com",
      senhaHash,
      perfil: "ADMIN",
      ativo: true,
    },
  });

  console.log("Seed concluído. Usuário admin:", usuario.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());