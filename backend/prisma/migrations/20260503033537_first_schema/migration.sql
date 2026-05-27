-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'GESTOR', 'SUPERVISOR', 'TECNICO', 'CONSULTA');

-- CreateEnum
CREATE TYPE "TipoAtivo" AS ENUM ('MAQUINA', 'CAMINHAO', 'EQUIPAMENTO', 'COMPONENTE', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusAtivo" AS ENUM ('DISPONIVEL', 'EM_USO', 'PARADO', 'EM_MANUTENCAO', 'AGUARDANDO_PECA', 'DESATIVADO');

-- CreateEnum
CREATE TYPE "Criticidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TipoOS" AS ENUM ('CORRETIVA', 'PREVENTIVA', 'INSPECAO', 'OUTRA');

-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('ABERTA', 'EM_EXECUCAO', 'AGUARDANDO_PECA', 'ENCERRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "StatusParada" AS ENUM ('ABERTA', 'ENCERRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusMaterialOS" AS ENUM ('SOLICITADO', 'CONSUMIDO', 'DEVOLVIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('ATIVO_PARADO', 'OS_ATRASADA', 'AGUARDANDO_PECA', 'ESTOQUE_BAIXO', 'CUSTO_ALTO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Severidade" AS ENUM ('INFO', 'BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "StatusAlerta" AS ENUM ('ABERTO', 'LIDO', 'RESOLVIDO', 'IGNORADO');

-- CreateEnum
CREATE TYPE "TipoAcaoAuditoria" AS ENUM ('CRIACAO', 'ALTERACAO', 'EXCLUSAO', 'LOGIN', 'LOGOUT', 'ENCERRAMENTO_OS', 'CANCELAMENTO_OS');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localizacao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT,
    "nome" TEXT NOT NULL,
    "tipo" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoLoginEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ativo" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "localizacaoId" TEXT,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TipoAtivo" NOT NULL,
    "status" "StatusAtivo" NOT NULL DEFAULT 'DISPONIVEL',
    "criticidade" "Criticidade" NOT NULL DEFAULT 'MEDIA',
    "marca" TEXT,
    "modelo" TEXT,
    "numeroSerie" TEXT,
    "placa" TEXT,
    "horimetroAtual" DECIMAL(65,30),
    "odometroAtual" DECIMAL(65,30),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ativo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "localizacaoId" TEXT,
    "ativoId" TEXT NOT NULL,
    "solicitanteId" TEXT,
    "responsavelId" TEXT,
    "numero" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoOS" NOT NULL DEFAULT 'CORRETIVA',
    "status" "StatusOS" NOT NULL DEFAULT 'ABERTA',
    "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA',
    "impactaDisponibilidade" BOOLEAN NOT NULL DEFAULT true,
    "abertaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "iniciadaEm" TIMESTAMP(3),
    "encerradaEm" TIMESTAMP(3),
    "canceladaEm" TIMESTAMP(3),
    "prazoEm" TIMESTAMP(3),
    "aguardandoPecaDesde" TIMESTAMP(3),
    "tempoAguardandoPecaMinutos" INTEGER,
    "tempoParadoMinutos" INTEGER,
    "tempoExecucaoMinutos" INTEGER,
    "custoMateriais" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "custoMaoObra" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "custoTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "diagnostico" TEXT,
    "solucao" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParadaAtivo" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "ativoId" TEXT NOT NULL,
    "ordemServicoId" TEXT,
    "status" "StatusParada" NOT NULL DEFAULT 'ABERTA',
    "inicioEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fimEm" TIMESTAMP(3),
    "duracaoMinutos" INTEGER,
    "motivo" TEXT,
    "programada" BOOLEAN NOT NULL DEFAULT false,
    "impactaDisponibilidade" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParadaAtivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "unidade" TEXT NOT NULL DEFAULT 'UN',
    "estoqueAtual" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estoqueMinimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "custoMedio" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServicoMaterial" (
    "id" TEXT NOT NULL,
    "ordemServicoId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "custoUnitario" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "custoTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "StatusMaterialOS" NOT NULL DEFAULT 'SOLICITADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServicoMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApontamentoOS" (
    "id" TEXT NOT NULL,
    "ordemServicoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "inicioEm" TIMESTAMP(3) NOT NULL,
    "fimEm" TIMESTAMP(3),
    "duracaoMinutos" INTEGER,
    "descricao" TEXT,
    "custoHora" DECIMAL(65,30),
    "custoTotal" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApontamentoOS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "ativoId" TEXT,
    "ordemServicoId" TEXT,
    "usuarioId" TEXT,
    "tipo" "TipoAlerta" NOT NULL,
    "severidade" "Severidade" NOT NULL DEFAULT 'MEDIA',
    "status" "StatusAlerta" NOT NULL DEFAULT 'ABERTO',
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "geradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lidoEm" TIMESTAMP(3),
    "resolvidoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alerta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "usuarioId" TEXT,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT NOT NULL,
    "acao" "TipoAcaoAuditoria" NOT NULL,
    "antes" JSONB,
    "depois" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_codigo_key" ON "Empresa"("codigo");

-- CreateIndex
CREATE INDEX "Empresa_nome_idx" ON "Empresa"("nome");

-- CreateIndex
CREATE INDEX "Localizacao_empresaId_nome_idx" ON "Localizacao"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Localizacao_empresaId_codigo_key" ON "Localizacao"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_empresaId_idx" ON "Usuario"("empresaId");

-- CreateIndex
CREATE INDEX "Usuario_perfil_idx" ON "Usuario"("perfil");

-- CreateIndex
CREATE INDEX "Ativo_empresaId_status_idx" ON "Ativo"("empresaId", "status");

-- CreateIndex
CREATE INDEX "Ativo_empresaId_tipo_idx" ON "Ativo"("empresaId", "tipo");

-- CreateIndex
CREATE INDEX "Ativo_localizacaoId_idx" ON "Ativo"("localizacaoId");

-- CreateIndex
CREATE INDEX "Ativo_criticidade_idx" ON "Ativo"("criticidade");

-- CreateIndex
CREATE UNIQUE INDEX "Ativo_empresaId_codigo_key" ON "Ativo"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "OrdemServico_empresaId_status_idx" ON "OrdemServico"("empresaId", "status");

-- CreateIndex
CREATE INDEX "OrdemServico_ativoId_abertaEm_idx" ON "OrdemServico"("ativoId", "abertaEm");

-- CreateIndex
CREATE INDEX "OrdemServico_status_prioridade_idx" ON "OrdemServico"("status", "prioridade");

-- CreateIndex
CREATE INDEX "OrdemServico_prazoEm_idx" ON "OrdemServico"("prazoEm");

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_empresaId_numero_key" ON "OrdemServico"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "ParadaAtivo_empresaId_inicioEm_idx" ON "ParadaAtivo"("empresaId", "inicioEm");

-- CreateIndex
CREATE INDEX "ParadaAtivo_ativoId_status_idx" ON "ParadaAtivo"("ativoId", "status");

-- CreateIndex
CREATE INDEX "ParadaAtivo_ordemServicoId_idx" ON "ParadaAtivo"("ordemServicoId");

-- CreateIndex
CREATE INDEX "Material_empresaId_nome_idx" ON "Material"("empresaId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Material_empresaId_codigo_key" ON "Material"("empresaId", "codigo");

-- CreateIndex
CREATE INDEX "OrdemServicoMaterial_ordemServicoId_idx" ON "OrdemServicoMaterial"("ordemServicoId");

-- CreateIndex
CREATE INDEX "OrdemServicoMaterial_materialId_idx" ON "OrdemServicoMaterial"("materialId");

-- CreateIndex
CREATE INDEX "ApontamentoOS_ordemServicoId_idx" ON "ApontamentoOS"("ordemServicoId");

-- CreateIndex
CREATE INDEX "ApontamentoOS_usuarioId_idx" ON "ApontamentoOS"("usuarioId");

-- CreateIndex
CREATE INDEX "Alerta_empresaId_status_idx" ON "Alerta"("empresaId", "status");

-- CreateIndex
CREATE INDEX "Alerta_tipo_severidade_idx" ON "Alerta"("tipo", "severidade");

-- CreateIndex
CREATE INDEX "Alerta_ativoId_idx" ON "Alerta"("ativoId");

-- CreateIndex
CREATE INDEX "Alerta_ordemServicoId_idx" ON "Alerta"("ordemServicoId");

-- CreateIndex
CREATE INDEX "LogAuditoria_empresaId_idx" ON "LogAuditoria"("empresaId");

-- CreateIndex
CREATE INDEX "LogAuditoria_usuarioId_idx" ON "LogAuditoria"("usuarioId");

-- CreateIndex
CREATE INDEX "LogAuditoria_entidade_entidadeId_idx" ON "LogAuditoria"("entidade", "entidadeId");

-- AddForeignKey
ALTER TABLE "Localizacao" ADD CONSTRAINT "Localizacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ativo" ADD CONSTRAINT "Ativo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ativo" ADD CONSTRAINT "Ativo_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "Ativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParadaAtivo" ADD CONSTRAINT "ParadaAtivo_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParadaAtivo" ADD CONSTRAINT "ParadaAtivo_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "Ativo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParadaAtivo" ADD CONSTRAINT "ParadaAtivo_ordemServicoId_fkey" FOREIGN KEY ("ordemServicoId") REFERENCES "OrdemServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServicoMaterial" ADD CONSTRAINT "OrdemServicoMaterial_ordemServicoId_fkey" FOREIGN KEY ("ordemServicoId") REFERENCES "OrdemServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServicoMaterial" ADD CONSTRAINT "OrdemServicoMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApontamentoOS" ADD CONSTRAINT "ApontamentoOS_ordemServicoId_fkey" FOREIGN KEY ("ordemServicoId") REFERENCES "OrdemServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApontamentoOS" ADD CONSTRAINT "ApontamentoOS_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_ativoId_fkey" FOREIGN KEY ("ativoId") REFERENCES "Ativo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_ordemServicoId_fkey" FOREIGN KEY ("ordemServicoId") REFERENCES "OrdemServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerta" ADD CONSTRAINT "Alerta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
