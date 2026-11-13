-- Camada de consulta da IA: views seguras com nomenclatura Prisma.
-- A role de execução não acessa tabelas públicas nem possui privilégios de escrita.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'ctrpe_ai_view_owner'
  ) THEN
    CREATE ROLE ctrpe_ai_view_owner
      NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'ctrpe_ai_readonly'
  ) THEN
    CREATE ROLE ctrpe_ai_readonly
      LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END
$$;

ALTER ROLE ctrpe_ai_readonly SET statement_timeout = '3s';
ALTER ROLE ctrpe_ai_readonly SET lock_timeout = '1s';
ALTER ROLE ctrpe_ai_readonly SET idle_in_transaction_session_timeout = '5s';
ALTER ROLE ctrpe_ai_readonly SET search_path = ai, pg_catalog;

DO $$
BEGIN
  EXECUTE format(
    'GRANT CONNECT ON DATABASE %I TO ctrpe_ai_readonly',
    current_database()
  );
END
$$;

CREATE SCHEMA IF NOT EXISTS ai;

REVOKE ALL ON SCHEMA ai FROM PUBLIC;
GRANT USAGE ON SCHEMA ai TO ctrpe_ai_readonly;
GRANT USAGE ON SCHEMA public TO ctrpe_ai_view_owner;

DO $$
BEGIN
  EXECUTE format('GRANT ctrpe_ai_view_owner TO %I', current_user);
END
$$;

DROP VIEW IF EXISTS ai.apontamentos_os;
DROP VIEW IF EXISTS ai.alertas;
DROP VIEW IF EXISTS ai.os_materiais;
DROP VIEW IF EXISTS ai.materiais;
DROP VIEW IF EXISTS ai.paradas;
DROP VIEW IF EXISTS ai.ordens_servico;
DROP VIEW IF EXISTS ai.ativos;
DROP FUNCTION IF EXISTS ai.max_rows();

GRANT CREATE ON SCHEMA ai TO ctrpe_ai_view_owner;

GRANT SELECT ON
  public."Empresa",
  public."Localizacao",
  public."Usuario",
  public."Ativo",
  public."OrdemServico",
  public."ParadaAtivo",
  public."Material",
  public."OrdemServicoMaterial",
  public."ApontamentoOS",
  public."Alerta"
TO ctrpe_ai_view_owner;

REVOKE ALL ON
  public."Empresa",
  public."Localizacao",
  public."Usuario",
  public."RefreshToken",
  public."Ativo",
  public."OrdemServico",
  public."ParadaAtivo",
  public."Material",
  public."OrdemServicoMaterial",
  public."ApontamentoOS",
  public."Alerta",
  public."LogAuditoria"
FROM ctrpe_ai_readonly;

ALTER TABLE public."Empresa" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Localizacao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Usuario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Ativo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrdemServico" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ParadaAtivo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Material" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrdemServicoMaterial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ApontamentoOS" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Alerta" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS ai_tenant_select ON public."Empresa";
CREATE POLICY ai_tenant_select
ON public."Empresa"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "id" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."Localizacao";
CREATE POLICY ai_tenant_select
ON public."Localizacao"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."Usuario";
CREATE POLICY ai_tenant_select
ON public."Usuario"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."Ativo";
CREATE POLICY ai_tenant_select
ON public."Ativo"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."OrdemServico";
CREATE POLICY ai_tenant_select
ON public."OrdemServico"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."ParadaAtivo";
CREATE POLICY ai_tenant_select
ON public."ParadaAtivo"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."Material";
CREATE POLICY ai_tenant_select
ON public."Material"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

DROP POLICY IF EXISTS ai_tenant_select ON public."OrdemServicoMaterial";
CREATE POLICY ai_tenant_select
ON public."OrdemServicoMaterial"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  EXISTS (
    SELECT 1
    FROM public."OrdemServico" ordem
    WHERE ordem."id" = "ordemServicoId"
      AND ordem."empresaId" = NULLIF(
        current_setting('ctrpe.current_empresa_id', true),
        ''
      )
  )
);

DROP POLICY IF EXISTS ai_tenant_select ON public."ApontamentoOS";
CREATE POLICY ai_tenant_select
ON public."ApontamentoOS"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  EXISTS (
    SELECT 1
    FROM public."OrdemServico" ordem
    WHERE ordem."id" = "ordemServicoId"
      AND ordem."empresaId" = NULLIF(
        current_setting('ctrpe.current_empresa_id', true),
        ''
      )
  )
);

DROP POLICY IF EXISTS ai_tenant_select ON public."Alerta";
CREATE POLICY ai_tenant_select
ON public."Alerta"
FOR SELECT
TO ctrpe_ai_view_owner
USING (
  "empresaId" = NULLIF(current_setting('ctrpe.current_empresa_id', true), '')
);

CREATE OR REPLACE VIEW ai."Empresa"
WITH (security_barrier = true)
AS
SELECT
  empresa."id",
  empresa."codigo",
  empresa."nome",
  empresa."ativa",
  empresa."createdAt",
  empresa."updatedAt"
FROM public."Empresa" empresa;

CREATE OR REPLACE VIEW ai."Localizacao"
WITH (security_barrier = true)
AS
SELECT
  localizacao."id",
  localizacao."empresaId",
  localizacao."codigo",
  localizacao."nome",
  localizacao."tipo",
  localizacao."ativa",
  localizacao."createdAt",
  localizacao."updatedAt"
FROM public."Localizacao" localizacao;

CREATE OR REPLACE VIEW ai."Ativo"
WITH (security_barrier = true)
AS
SELECT
  ativo."id",
  ativo."empresaId",
  ativo."localizacaoId",
  ativo."codigo",
  ativo."nome",
  ativo."descricao",
  ativo."tipo",
  ativo."status",
  ativo."criticidade",
  ativo."marca",
  ativo."modelo",
  ativo."numeroSerie",
  ativo."placa",
  ativo."horimetroAtual",
  ativo."odometroAtual",
  ativo."ativo",
  ativo."createdAt",
  ativo."updatedAt"
FROM public."Ativo" ativo;

CREATE OR REPLACE VIEW ai."OrdemServico"
WITH (security_barrier = true)
AS
SELECT
  ordem."id",
  ordem."empresaId",
  ordem."localizacaoId",
  ordem."ativoId",
  ordem."solicitanteId",
  solicitante."nome" AS "solicitanteNome",
  ordem."responsavelId",
  responsavel."nome" AS "responsavelNome",
  ordem."numero",
  ordem."titulo",
  ordem."descricao",
  ordem."tipo",
  ordem."status",
  ordem."prioridade",
  ordem."impactaDisponibilidade",
  ordem."abertaEm",
  ordem."iniciadaEm",
  ordem."encerradaEm",
  ordem."canceladaEm",
  ordem."prazoEm",
  ordem."aguardandoPecaDesde",
  ordem."tempoAguardandoPecaMinutos",
  ordem."tempoParadoMinutos",
  ordem."tempoExecucaoMinutos",
  ordem."custoMateriais",
  ordem."custoMaoObra",
  ordem."custoTotal",
  ordem."diagnostico",
  ordem."solucao",
  ordem."observacao",
  ordem."createdAt",
  ordem."updatedAt"
FROM public."OrdemServico" ordem
LEFT JOIN public."Usuario" solicitante
  ON solicitante."id" = ordem."solicitanteId"
LEFT JOIN public."Usuario" responsavel
  ON responsavel."id" = ordem."responsavelId";

CREATE OR REPLACE VIEW ai."ParadaAtivo"
WITH (security_barrier = true)
AS
SELECT
  parada."id",
  parada."empresaId",
  parada."ativoId",
  parada."ordemServicoId",
  parada."status",
  parada."inicioEm",
  parada."fimEm",
  parada."duracaoMinutos",
  parada."motivo",
  parada."programada",
  parada."impactaDisponibilidade",
  parada."createdAt",
  parada."updatedAt"
FROM public."ParadaAtivo" parada;

CREATE OR REPLACE VIEW ai."Material"
WITH (security_barrier = true)
AS
SELECT
  material."id",
  material."empresaId",
  material."codigo",
  material."nome",
  material."descricao",
  material."unidade",
  material."estoqueAtual",
  material."estoqueMinimo",
  material."custoMedio",
  material."ativo",
  material."createdAt",
  material."updatedAt"
FROM public."Material" material;

CREATE OR REPLACE VIEW ai."OrdemServicoMaterial"
WITH (security_barrier = true)
AS
SELECT
  item."id",
  ordem."empresaId",
  item."ordemServicoId",
  item."materialId",
  item."quantidade",
  item."custoUnitario",
  item."custoTotal",
  item."status",
  item."createdAt",
  item."updatedAt"
FROM public."OrdemServicoMaterial" item
JOIN public."OrdemServico" ordem
  ON ordem."id" = item."ordemServicoId";

CREATE OR REPLACE VIEW ai."ApontamentoOS"
WITH (security_barrier = true)
AS
SELECT
  apontamento."id",
  ordem."empresaId",
  apontamento."ordemServicoId",
  apontamento."usuarioId",
  tecnico."nome" AS "tecnicoNome",
  apontamento."inicioEm",
  apontamento."fimEm",
  apontamento."duracaoMinutos",
  apontamento."descricao",
  apontamento."custoHora",
  apontamento."custoTotal",
  apontamento."createdAt",
  apontamento."updatedAt"
FROM public."ApontamentoOS" apontamento
JOIN public."OrdemServico" ordem
  ON ordem."id" = apontamento."ordemServicoId"
JOIN public."Usuario" tecnico
  ON tecnico."id" = apontamento."usuarioId";

CREATE OR REPLACE VIEW ai."Alerta"
WITH (security_barrier = true)
AS
SELECT
  alerta."id",
  alerta."empresaId",
  alerta."ativoId",
  alerta."ordemServicoId",
  alerta."tipo",
  alerta."severidade",
  alerta."status",
  alerta."titulo",
  alerta."mensagem",
  alerta."geradoEm",
  alerta."lidoEm",
  alerta."resolvidoEm",
  alerta."createdAt",
  alerta."updatedAt"
FROM public."Alerta" alerta;

COMMENT ON VIEW ai."Empresa" IS
  'Empresas visíveis para a consulta da IA. Uma linha por empresa.';
COMMENT ON VIEW ai."Localizacao" IS
  'Localizações operacionais da empresa da sessão.';
COMMENT ON VIEW ai."Ativo" IS
  'Ativos da empresa da sessão, com nomenclatura equivalente ao Prisma.';
COMMENT ON VIEW ai."OrdemServico" IS
  'Ordens de serviço da empresa da sessão, sem credenciais de usuários.';
COMMENT ON VIEW ai."ParadaAtivo" IS
  'Paradas de ativos da empresa da sessão.';
COMMENT ON VIEW ai."Material" IS
  'Materiais e estoque da empresa da sessão.';
COMMENT ON VIEW ai."OrdemServicoMaterial" IS
  'Materiais relacionados às ordens de serviço da empresa da sessão.';
COMMENT ON VIEW ai."ApontamentoOS" IS
  'Apontamentos de trabalho da empresa da sessão, sem credenciais.';
COMMENT ON VIEW ai."Alerta" IS
  'Alertas operacionais da empresa da sessão.';

ALTER VIEW ai."Empresa" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."Localizacao" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."Ativo" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."OrdemServico" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."ParadaAtivo" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."Material" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."OrdemServicoMaterial" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."ApontamentoOS" OWNER TO ctrpe_ai_view_owner;
ALTER VIEW ai."Alerta" OWNER TO ctrpe_ai_view_owner;

REVOKE ALL ON ALL TABLES IN SCHEMA ai FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA ai FROM ctrpe_ai_readonly;

GRANT SELECT ON
  ai."Empresa",
  ai."Localizacao",
  ai."Ativo",
  ai."OrdemServico",
  ai."ParadaAtivo",
  ai."Material",
  ai."OrdemServicoMaterial",
  ai."ApontamentoOS",
  ai."Alerta"
TO ctrpe_ai_readonly;

REVOKE CREATE ON SCHEMA ai FROM ctrpe_ai_view_owner;

DO $$
BEGIN
  EXECUTE format('REVOKE ctrpe_ai_view_owner FROM %I', current_user);
END
$$;

REVOKE ctrpe_ai_view_owner FROM ctrpe_ai_readonly;
