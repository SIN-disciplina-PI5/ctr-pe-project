-- CreateEnum
CREATE TYPE "PapelMensagemConversaIA" AS ENUM ('USUARIO', 'ASSISTENTE');

-- CreateTable
CREATE TABLE "ConversaIA" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversaIA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensagemConversaIA" (
    "id" TEXT NOT NULL,
    "conversaId" TEXT NOT NULL,
    "papel" "PapelMensagemConversaIA" NOT NULL,
    "conteudo" TEXT NOT NULL,
    "intencao" TEXT,
    "metadados" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MensagemConversaIA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversaIA_empresaId_usuarioId_updatedAt_idx" ON "ConversaIA"("empresaId", "usuarioId", "updatedAt");

-- CreateIndex
CREATE INDEX "MensagemConversaIA_conversaId_createdAt_idx" ON "MensagemConversaIA"("conversaId", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversaIA" ADD CONSTRAINT "ConversaIA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversaIA" ADD CONSTRAINT "ConversaIA_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensagemConversaIA" ADD CONSTRAINT "MensagemConversaIA_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "ConversaIA"("id") ON DELETE CASCADE ON UPDATE CASCADE;
