import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/prisma/prisma.client.js";

async function main() {
  const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";

  const senhaAdminHash = await bcrypt.hash("novaSenha123", 10);
  const senhaPadraoHash = await bcrypt.hash("123456", 10);

  const empresa = await prisma.empresa.upsert({
    where: { id: EMPRESA_ID },
    update: {
      codigo: "EMP-TESTE-FIXA",
      nome: "Empresa Teste",
      ativa: true,
    },
    create: {
      id: EMPRESA_ID,
      codigo: "EMP-TESTE-FIXA",
      nome: "Empresa Teste",
      ativa: true,
    },
  });

  const admin = await prisma.usuario.upsert({
    where: { email: "admin@teste.com" },
    update: {
      nome: "Admin Teste",
      senhaHash: senhaAdminHash,
      perfil: "ADMIN",
      ativo: true,
      empresaId: null,
    },
    create: {
      nome: "Admin Teste",
      email: "admin@teste.com",
      senhaHash: senhaAdminHash,
      perfil: "ADMIN",
      ativo: true,
      empresaId: null,
    },
  });

  const supervisor = await prisma.usuario.upsert({
    where: { email: "supervisor@teste.com" },
    update: {
      nome: "Supervisor Teste",
      senhaHash: senhaPadraoHash,
      perfil: "SUPERVISOR",
      ativo: true,
      empresaId: empresa.id,
    },
    create: {
      nome: "Supervisor Teste",
      email: "supervisor@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "SUPERVISOR",
      ativo: true,
      empresaId: empresa.id,
    },
  });

  const gestor = await prisma.usuario.upsert({
    where: { email: "gestor@teste.com" },
    update: {
      nome: "Gestor Teste",
      senhaHash: senhaPadraoHash,
      perfil: "GESTOR",
      ativo: true,
      empresaId: empresa.id,
    },
    create: {
      nome: "Gestor Teste",
      email: "gestor@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "GESTOR",
      ativo: true,
      empresaId: empresa.id,
    },
  });

  const tecnicoAtivo = await prisma.usuario.upsert({
    where: { email: "tecnico.ativo@teste.com" },
    update: {
      nome: "Técnico Ativo",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: true,
      empresaId: empresa.id,
    },
    create: {
      nome: "Técnico Ativo",
      email: "tecnico.ativo@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: true,
      empresaId: empresa.id,
    },
  });

  const tecnicoInativo = await prisma.usuario.upsert({
    where: { email: "tecnico@teste.com" },
    update: {
      nome: "Técnico Inativo",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: false,
      empresaId: empresa.id,
    },
    create: {
      nome: "Técnico Inativo",
      email: "tecnico@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: false,
      empresaId: empresa.id,
    },
  });

  const consulta = await prisma.usuario.upsert({
    where: { email: "consulta@teste.com" },
    update: {
      nome: "Consulta Teste",
      senhaHash: senhaPadraoHash,
      perfil: "CONSULTA",
      ativo: true,
      empresaId: empresa.id,
    },
    create: {
      nome: "Consulta Teste",
      email: "consulta@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "CONSULTA",
      ativo: true,
      empresaId: empresa.id,
    },
  });

  console.log("Seed concluído.");
  console.log("Empresa:", empresa.codigo, empresa.id);
  console.log("Admin:", admin.email);
  console.log("Supervisor:", supervisor.email);
  console.log("Gestor:", gestor.email);
  console.log("Técnico ativo:", tecnicoAtivo.email);
  console.log("Técnico inativo:", tecnicoInativo.email);
  console.log("Consulta:", consulta.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());