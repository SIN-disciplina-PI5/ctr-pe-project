import { describe, expect, it } from "@jest/globals";
import type { ZodType } from "zod";
import { createAlertaDto } from "../../modules/alertas/dto/create-alerta.dto.js";
import { listAlertasDto } from "../../modules/alertas/dto/list-alertas.dto.js";
import { listAuditoriaDto } from "../../modules/auditoria/dto/list-auditoria.dto.js";
import { createAtivoDto } from "../../modules/ativos/dto/create-ativo.dto.js";
import { listAtivosDto } from "../../modules/ativos/dto/list-ativos.dto.js";
import { updateAtivoDto } from "../../modules/ativos/dto/update-ativo.dto.js";
import { listLocalizacoesDto } from "../../modules/localizacoes/dto/list-localizacoes.dto.js";
import { createMaterialDto } from "../../modules/materiais/dto/create-material.dto.js";
import { listMateriaisDto } from "../../modules/materiais/dto/list-materiais.dto.js";
import { createOrdemServicoDto } from "../../modules/ordens-servico/dto/create-ordem-servico.dto.js";
import { listOrdensServicoDto } from "../../modules/ordens-servico/dto/list-ordens-servico.dto.js";
import { updateOrdemServicoDto } from "../../modules/ordens-servico/dto/update-ordem-servico.dto.js";
import { entityIdSchema } from "./entity-id.schema.js";

const ids = {
  empresa: "emp_000001",
  localizacao: "loc_000001",
  ativo: "atv_000001",
  usuario: "usr_000001",
  ordem: "os_000001",
};

describe("entityIdSchema", () => {
  it.each([
    "emp_000001",
    "cmph1bzxt0000u68mgs97sqmr",
    "550e8400-e29b-41d4-a716-446655440000",
  ])("aceita o identificador opaco %s", (id) => {
    expect(entityIdSchema.parse(id)).toBe(id);
  });

  it("normaliza espaços nas extremidades", () => {
    expect(entityIdSchema.parse("  emp_000001  ")).toBe("emp_000001");
  });

  it.each(["", "   ", "x".repeat(65)])(
    "rejeita identificador inválido",
    (id) => {
      expect(entityIdSchema.safeParse(id).success).toBe(false);
    },
  );

  it.each<Array<{ name: string; schema: ZodType; payload: unknown }>>([
    {
      name: "criação de ativo",
      schema: createAtivoDto,
      payload: {
        empresaId: ids.empresa,
        localizacaoId: ids.localizacao,
        codigo: "AT-01",
        nome: "Ativo",
        tipo: "EQUIPAMENTO",
      },
    },
    {
      name: "filtros de ativo",
      schema: listAtivosDto,
      payload: { empresaId: ids.empresa, localizacaoId: ids.localizacao },
    },
    {
      name: "atualização de ativo",
      schema: updateAtivoDto,
      payload: { localizacaoId: ids.localizacao },
    },
    {
      name: "criação de material",
      schema: createMaterialDto,
      payload: {
        empresaId: ids.empresa,
        codigo: "MAT-01",
        nome: "Material",
        unidade: "UN",
      },
    },
    {
      name: "filtros de material",
      schema: listMateriaisDto,
      payload: { empresaId: ids.empresa },
    },
    {
      name: "filtros de localização",
      schema: listLocalizacoesDto,
      payload: { empresaId: ids.empresa },
    },
    {
      name: "criação de ordem de serviço",
      schema: createOrdemServicoDto,
      payload: {
        empresaId: ids.empresa,
        localizacaoId: ids.localizacao,
        ativoId: ids.ativo,
        solicitanteId: ids.usuario,
        responsavelId: ids.usuario,
        titulo: "Ordem",
        descricao: "Descrição",
      },
    },
    {
      name: "filtros de ordem de serviço",
      schema: listOrdensServicoDto,
      payload: {
        empresaId: ids.empresa,
        ativoId: ids.ativo,
        responsavelId: ids.usuario,
      },
    },
    {
      name: "atualização de ordem de serviço",
      schema: updateOrdemServicoDto,
      payload: {
        localizacaoId: ids.localizacao,
        solicitanteId: ids.usuario,
        responsavelId: ids.usuario,
      },
    },
    {
      name: "criação de alerta",
      schema: createAlertaDto,
      payload: {
        empresaId: ids.empresa,
        tipo: "ATIVO_PARADO",
        titulo: "Alerta",
        mensagem: "Ativo parado",
        ativoId: ids.ativo,
        ordemServicoId: ids.ordem,
        usuarioId: ids.usuario,
      },
    },
    {
      name: "filtros de alerta",
      schema: listAlertasDto,
      payload: { empresaId: ids.empresa, usuarioId: ids.usuario },
    },
    {
      name: "filtros de auditoria",
      schema: listAuditoriaDto,
      payload: { empresaId: ids.empresa, usuarioId: ids.usuario },
    },
  ])("aceita IDs sintéticos em $name", ({ schema, payload }) => {
    expect(schema.safeParse(payload).success).toBe(true);
  });
});
