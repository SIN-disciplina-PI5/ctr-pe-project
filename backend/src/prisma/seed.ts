import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/prisma/prisma.client.js";

async function main() {
  const EMPRESA_ID = "cmph1bzxt0000u68mgs97sqmr";
  const ATIVO_ID = "cmplnper80000ek8mr30wm4w3";

  const senhaAdminHash = await bcrypt.hash("novaSenha123", 10);
  const senhaPadraoHash = await bcrypt.hash("123456", 10);

  // ── Empresa ───────────────────────────────────────────────────────────────
  const empresa = await prisma.empresa.upsert({
    where: { id: EMPRESA_ID },
    update: { codigo: "CTR-PE", nome: "CTR Pernambuco", ativa: true },
    create: {
      id: EMPRESA_ID,
      codigo: "CTR-PE",
      nome: "CTR Pernambuco",
      ativa: true,
    },
  });

  // ── Localizações ──────────────────────────────────────────────────────────
  const oficina = await prisma.localizacao.upsert({
    where: { id: "loc-oficina-01" },
    update: { nome: "Oficina Central", codigo: "OFIC-01" },
    create: {
      id: "loc-oficina-01",
      empresaId: EMPRESA_ID,
      codigo: "OFIC-01",
      nome: "Oficina Central",
      tipo: "SETOR",
      ativa: true,
    },
  });

  const patio = await prisma.localizacao.upsert({
    where: { id: "loc-patio-01" },
    update: { nome: "Pátio de Veículos", codigo: "PATIO-01" },
    create: {
      id: "loc-patio-01",
      empresaId: EMPRESA_ID,
      codigo: "PATIO-01",
      nome: "Pátio de Veículos",
      tipo: "AREA_EXTERNA",
      ativa: true,
    },
  });

  // ── Ativo ─────────────────────────────────────────────────────────────────
  const ativo = await prisma.ativo.upsert({
    where: { id: ATIVO_ID },
    update: {
      nome: "Retroescavadeira JD 310",
      empresaId: EMPRESA_ID,
      ativo: true,
    },
    create: {
      id: ATIVO_ID,
      codigo: "RET-JD-310",
      nome: "Retroescavadeira JD 310",
      empresaId: EMPRESA_ID,
      localizacaoId: patio.id,
      tipo: "EQUIPAMENTO",
      criticidade: "ALTA",
      status: "OPERACIONAL",
      fabricante: "John Deere",
      modelo: "310SL",
      ativo: true,
    },
  });

  // ── Materiais ─────────────────────────────────────────────────────────────
  const filtroOleo = await prisma.material.upsert({
    where: { empresaId_codigo: { empresaId: EMPRESA_ID, codigo: "FLT-OLEO-01" } },
    update: { estoqueAtual: 15, custoMedio: 45.90 },
    create: {
      empresaId: EMPRESA_ID,
      codigo: "FLT-OLEO-01",
      nome: "Filtro de Óleo Motor",
      unidade: "UN",
      estoqueAtual: 15,
      estoqueMinimo: 5,
      custoMedio: 45.90,
      ativo: true,
    },
  });

  const oleoHidraulico = await prisma.material.upsert({
    where: { empresaId_codigo: { empresaId: EMPRESA_ID, codigo: "OLEO-HID-01" } },
    update: { estoqueAtual: 3, custoMedio: 189.00 },
    create: {
      empresaId: EMPRESA_ID,
      codigo: "OLEO-HID-01",
      nome: "Óleo Hidráulico 68 (20L)",
      unidade: "BALDE",
      estoqueAtual: 3,
      estoqueMinimo: 5,
      custoMedio: 189.00,
      ativo: true,
    },
  });

  const correia = await prisma.material.upsert({
    where: { empresaId_codigo: { empresaId: EMPRESA_ID, codigo: "COR-ALT-01" } },
    update: { estoqueAtual: 8, custoMedio: 92.50 },
    create: {
      empresaId: EMPRESA_ID,
      codigo: "COR-ALT-01",
      nome: "Correia do Alternador",
      unidade: "UN",
      estoqueAtual: 8,
      estoqueMinimo: 3,
      custoMedio: 92.50,
      ativo: true,
    },
  });

  // ── Usuários ──────────────────────────────────────────────────────────────
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@teste.com" },
    update: { senhaHash: senhaAdminHash, perfil: "ADMIN", ativo: true, empresaId: null },
    create: {
      nome: "Administrador",
      email: "admin@teste.com",
      senhaHash: senhaAdminHash,
      perfil: "ADMIN",
      ativo: true,
      empresaId: null,
    },
  });

  const supervisor = await prisma.usuario.upsert({
    where: { email: "supervisor@teste.com" },
    update: { senhaHash: senhaPadraoHash, perfil: "SUPERVISOR", ativo: true, empresaId: EMPRESA_ID },
    create: {
      nome: "Carlos Supervisor",
      email: "supervisor@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "SUPERVISOR",
      ativo: true,
      empresaId: EMPRESA_ID,
    },
  });

  const gestor = await prisma.usuario.upsert({
    where: { email: "gestor@teste.com" },
    update: { senhaHash: senhaPadraoHash, perfil: "GESTOR", ativo: true, empresaId: EMPRESA_ID },
    create: {
      nome: "Ana Gestora",
      email: "gestor@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "GESTOR",
      ativo: true,
      empresaId: EMPRESA_ID,
    },
  });

  const tecnicoAtivo = await prisma.usuario.upsert({
    where: { email: "tecnico.ativo@teste.com" },
    update: { senhaHash: senhaPadraoHash, perfil: "TECNICO", ativo: true, empresaId: EMPRESA_ID },
    create: {
      nome: "João Técnico",
      email: "tecnico.ativo@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: true,
      empresaId: EMPRESA_ID,
    },
  });

  const tecnicoInativo = await prisma.usuario.upsert({
    where: { email: "tecnico@teste.com" },
    update: { senhaHash: senhaPadraoHash, perfil: "TECNICO", ativo: false, empresaId: EMPRESA_ID },
    create: {
      nome: "Pedro Técnico (Inativo)",
      email: "tecnico@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "TECNICO",
      ativo: false,
      empresaId: EMPRESA_ID,
    },
  });

  const consulta = await prisma.usuario.upsert({
    where: { email: "consulta@teste.com" },
    update: { senhaHash: senhaPadraoHash, perfil: "CONSULTA", ativo: true, empresaId: EMPRESA_ID },
    create: {
      nome: "Maria Consulta",
      email: "consulta@teste.com",
      senhaHash: senhaPadraoHash,
      perfil: "CONSULTA",
      ativo: true,
      empresaId: EMPRESA_ID,
    },
  });

  console.log("✅ Seed concluído com dados demonstráveis.");
  console.log("");
  console.log("  🏢 Empresa:", empresa.nome, `(${empresa.id})`);
  console.log("  📍 Localizações:", oficina.nome, "|", patio.nome);
  console.log("  🚜 Ativo:", ativo.nome, `(${ativo.id})`);
  console.log("  🔧 Materiais:", filtroOleo.nome, "|", oleoHidraulico.nome, "|", correia.nome);
  console.log("");
  console.log("  👤 Usuários:");
  console.log("    ", admin.email, "→ ADMIN  (senha: novaSenha123)");
  console.log("    ", supervisor.email, "→ SUPERVISOR  (senha: 123456)");
  console.log("    ", gestor.email, "→ GESTOR  (senha: 123456)");
  console.log("    ", tecnicoAtivo.email, "→ TECNICO ativo  (senha: 123456)");
  console.log("    ", tecnicoInativo.email, "→ TECNICO inativo  (senha: 123456)");
  console.log("    ", consulta.email, "→ CONSULTA  (senha: 123456)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
