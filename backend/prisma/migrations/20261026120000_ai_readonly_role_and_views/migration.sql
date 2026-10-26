-- =============================================================================
-- Camada de IA: role somente leitura + views seguras
--
-- O agente de consulta executa SQL gerado por LLM. Este migration garante que
-- esse SQL só consiga LER as views do schema "ai" e nada mais:
--
--   * role "ctrpe_ai_readonly": CONNECT + USAGE no schema "ai" + SELECT nas views
--   * nenhuma permissão nas tabelas base (public."Usuario", "RefreshToken",
--     "LogAuditoria" etc. ficam inacessíveis)
--   * views em snake_case, com nomes de colunas legíveis para o negócio
--   * toda view expõe empresa_id (o filtro por empresa NÃO é feito aqui; é
--     decidido no spike de text-to-SQL)
--   * statement_timeout e limite de linhas configurados no próprio role
--
-- A senha do role NÃO fica no repositório. Defina-a depois do deploy com:
--   npm run ai-role:set-password
--
-- Observações:
--   * Views rodam com as permissões do dono (comportamento padrão do Postgres),
--     por isso o role consegue ler as views sem ter acesso às tabelas base.
--   * Ao recriar uma view com DROP + CREATE os GRANTs se perdem; prefira
--     CREATE OR REPLACE VIEW.
--   * Rollback manual:
--       DROP SCHEMA ai CASCADE;
--       REVOKE CONNECT ON DATABASE <banco> FROM ctrpe_ai_readonly;
--       DROP ROLE ctrpe_ai_readonly;
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Role (idempotente: roles são globais no cluster e o shadow database do
--    Prisma reaplica as migrations)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ctrpe_ai_readonly') THEN
    CREATE ROLE ctrpe_ai_readonly
      LOGIN
      NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
  END IF;
END
$$;

-- Limites do role. O Postgres não possui um "row limit" nativo por role:
-- "ai.max_rows" é o valor oficial do limite, lido pelo executor de consultas
-- da camada de IA (SELECT current_setting('ai.max_rows')) para forçar o LIMIT.
ALTER ROLE ctrpe_ai_readonly SET statement_timeout = '10s';
ALTER ROLE ctrpe_ai_readonly SET idle_in_transaction_session_timeout = '30s';
ALTER ROLE ctrpe_ai_readonly SET ai.max_rows = '500';
ALTER ROLE ctrpe_ai_readonly SET search_path = ai;

-- CONNECT no banco atual (o nome do banco varia por ambiente)
DO $$
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO ctrpe_ai_readonly', current_database());
END
$$;


-- -----------------------------------------------------------------------------
-- 2. Schema isolado para as views da IA
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS ai;

REVOKE ALL ON SCHEMA ai FROM PUBLIC;
GRANT USAGE ON SCHEMA ai TO ctrpe_ai_readonly;

-- Garantia explícita: nada direto nas tabelas base
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM ctrpe_ai_readonly;


-- -----------------------------------------------------------------------------
-- 3. Views
--    Não expõem: Usuario (e-mail, senhaHash, perfil), RefreshToken, LogAuditoria.
--    Nomes de pessoas aparecem apenas como *_nome (solicitante, responsável,
--    técnico), nunca e-mail ou credenciais.
-- -----------------------------------------------------------------------------

-- Ativos (máquinas, caminhões, equipamentos, componentes)
CREATE OR REPLACE VIEW ai.ativos AS
SELECT
  a."id"              AS id,
  a."empresaId"       AS empresa_id,
  a."codigo"          AS codigo,
  a."nome"            AS nome,
  a."descricao"       AS descricao,
  a."tipo"            AS tipo,
  a."status"          AS status,
  a."criticidade"     AS criticidade,
  a."marca"           AS marca,
  a."modelo"          AS modelo,
  a."numeroSerie"     AS numero_serie,
  a."placa"           AS placa,
  a."horimetroAtual"  AS horimetro_atual,
  a."odometroAtual"   AS odometro_atual,
  a."ativo"           AS esta_ativo,
  a."localizacaoId"   AS localizacao_id,
  l."nome"            AS localizacao_nome,
  l."tipo"            AS localizacao_tipo,
  a."createdAt"       AS criado_em,
  a."updatedAt"       AS atualizado_em
FROM public."Ativo" a
LEFT JOIN public."Localizacao" l ON l."id" = a."localizacaoId";

-- Ordens de serviço (O.S.)
CREATE OR REPLACE VIEW ai.ordens_servico AS
SELECT
  os."id"                           AS id,
  os."empresaId"                    AS empresa_id,
  os."numero"                       AS numero,
  os."titulo"                       AS titulo,
  os."descricao"                    AS descricao,
  os."tipo"                         AS tipo,
  os."status"                       AS status,
  os."prioridade"                   AS prioridade,
  os."impactaDisponibilidade"       AS impacta_disponibilidade,
  os."ativoId"                      AS ativo_id,
  a."codigo"                        AS ativo_codigo,
  a."nome"                          AS ativo_nome,
  os."localizacaoId"                AS localizacao_id,
  l."nome"                          AS localizacao_nome,
  os."solicitanteId"                AS solicitante_id,
  us."nome"                         AS solicitante_nome,
  os."responsavelId"                AS responsavel_id,
  ur."nome"                         AS responsavel_nome,
  os."abertaEm"                     AS aberta_em,
  os."iniciadaEm"                   AS iniciada_em,
  os."encerradaEm"                  AS encerrada_em,
  os."canceladaEm"                  AS cancelada_em,
  os."prazoEm"                      AS prazo_em,
  os."aguardandoPecaDesde"          AS aguardando_peca_desde,
  os."tempoAguardandoPecaMinutos"   AS tempo_aguardando_peca_minutos,
  os."tempoParadoMinutos"           AS tempo_parado_minutos,
  os."tempoExecucaoMinutos"         AS tempo_execucao_minutos,
  os."custoMateriais"               AS custo_materiais,
  os."custoMaoObra"                 AS custo_mao_obra,
  os."custoTotal"                   AS custo_total,
  os."diagnostico"                  AS diagnostico,
  os."solucao"                      AS solucao,
  os."observacao"                   AS observacao,
  -- Regra: O.S. aberta = status diferente de ENCERRADA e CANCELADA
  (os."status" NOT IN ('ENCERRADA', 'CANCELADA'))  AS esta_aberta,
  -- Regra: O.S. atrasada = aberta e prazo vencido. As datas são gravadas em UTC
  -- (timestamp sem fuso), então "agora" também é convertido para UTC.
  (
    os."prazoEm" IS NOT NULL
    AND os."prazoEm" < (now() AT TIME ZONE 'UTC')
    AND os."status" NOT IN ('ENCERRADA', 'CANCELADA')
  )                                 AS esta_atrasada,
  os."createdAt"                    AS criado_em,
  os."updatedAt"                    AS atualizado_em
FROM public."OrdemServico" os
JOIN public."Ativo" a             ON a."id"  = os."ativoId"
LEFT JOIN public."Localizacao" l  ON l."id"  = os."localizacaoId"
LEFT JOIN public."Usuario" us      ON us."id" = os."solicitanteId"
LEFT JOIN public."Usuario" ur      ON ur."id" = os."responsavelId";

-- Paradas de ativos
CREATE OR REPLACE VIEW ai.paradas AS
SELECT
  p."id"                      AS id,
  p."empresaId"               AS empresa_id,
  p."ativoId"                 AS ativo_id,
  a."codigo"                  AS ativo_codigo,
  a."nome"                    AS ativo_nome,
  p."ordemServicoId"          AS ordem_servico_id,
  os."numero"                 AS os_numero,
  p."status"                  AS status,
  p."inicioEm"                AS inicio_em,
  p."fimEm"                   AS fim_em,
  p."duracaoMinutos"          AS duracao_minutos,
  p."motivo"                  AS motivo,
  p."programada"              AS programada,
  p."impactaDisponibilidade"  AS impacta_disponibilidade,
  -- Regra: parada aberta = status ABERTA. Atenção: fim_em IS NULL NÃO serve,
  -- pois paradas CANCELADAS também ficam com fim_em nulo.
  (p."status" = 'ABERTA')     AS esta_aberta,
  p."createdAt"               AS criado_em,
  p."updatedAt"               AS atualizado_em
FROM public."ParadaAtivo" p
JOIN public."Ativo" a                ON a."id"  = p."ativoId"
LEFT JOIN public."OrdemServico" os   ON os."id" = p."ordemServicoId";

-- Materiais (cadastro e estoque)
CREATE OR REPLACE VIEW ai.materiais AS
SELECT
  m."id"             AS id,
  m."empresaId"      AS empresa_id,
  m."codigo"         AS codigo,
  m."nome"           AS nome,
  m."descricao"      AS descricao,
  m."unidade"        AS unidade,
  m."estoqueAtual"   AS estoque_atual,
  m."estoqueMinimo"  AS estoque_minimo,
  m."custoMedio"     AS custo_medio,
  m."ativo"          AS esta_ativo,
  -- Regra: estoque baixo = estoque atual <= estoque mínimo
  (m."estoqueAtual" <= m."estoqueMinimo")  AS estoque_baixo,
  m."createdAt"      AS criado_em,
  m."updatedAt"      AS atualizado_em
FROM public."Material" m;

-- Materiais solicitados/consumidos em cada O.S.
CREATE OR REPLACE VIEW ai.os_materiais AS
SELECT
  osm."id"              AS id,
  os."empresaId"        AS empresa_id,
  osm."ordemServicoId"  AS ordem_servico_id,
  os."numero"           AS os_numero,
  os."ativoId"          AS ativo_id,
  osm."materialId"      AS material_id,
  m."codigo"            AS material_codigo,
  m."nome"              AS material_nome,
  m."unidade"           AS unidade,
  osm."quantidade"      AS quantidade,
  osm."custoUnitario"   AS custo_unitario,
  osm."custoTotal"      AS custo_total,
  osm."status"          AS status,
  osm."createdAt"       AS criado_em,
  osm."updatedAt"       AS atualizado_em
FROM public."OrdemServicoMaterial" osm
JOIN public."OrdemServico" os ON os."id" = osm."ordemServicoId"
JOIN public."Material" m      ON m."id"  = osm."materialId";

-- Alertas
CREATE OR REPLACE VIEW ai.alertas AS
SELECT
  al."id"              AS id,
  al."empresaId"       AS empresa_id,
  al."tipo"            AS tipo,
  al."severidade"      AS severidade,
  al."status"          AS status,
  al."titulo"          AS titulo,
  al."mensagem"        AS mensagem,
  al."ativoId"         AS ativo_id,
  a."codigo"           AS ativo_codigo,
  a."nome"             AS ativo_nome,
  al."ordemServicoId"  AS ordem_servico_id,
  os."numero"          AS os_numero,
  al."geradoEm"        AS gerado_em,
  al."lidoEm"          AS lido_em,
  al."resolvidoEm"     AS resolvido_em,
  al."createdAt"       AS criado_em,
  al."updatedAt"       AS atualizado_em
FROM public."Alerta" al
LEFT JOIN public."Ativo" a           ON a."id"  = al."ativoId"
LEFT JOIN public."OrdemServico" os   ON os."id" = al."ordemServicoId";

-- Apontamentos de tempo (timesheets) dos técnicos nas O.S.
CREATE OR REPLACE VIEW ai.apontamentos_os AS
SELECT
  ap."id"              AS id,
  os."empresaId"       AS empresa_id,
  ap."ordemServicoId"  AS ordem_servico_id,
  os."numero"          AS os_numero,
  os."ativoId"         AS ativo_id,
  ap."usuarioId"       AS tecnico_id,
  u."nome"             AS tecnico_nome,
  ap."inicioEm"        AS inicio_em,
  ap."fimEm"           AS fim_em,
  ap."duracaoMinutos"  AS duracao_minutos,
  ap."descricao"       AS descricao,
  ap."custoHora"       AS custo_hora,
  ap."custoTotal"      AS custo_total,
  ap."createdAt"       AS criado_em,
  ap."updatedAt"       AS atualizado_em
FROM public."ApontamentoOS" ap
JOIN public."OrdemServico" os ON os."id" = ap."ordemServicoId"
JOIN public."Usuario" u       ON u."id"  = ap."usuarioId";


-- -----------------------------------------------------------------------------
-- 4. Descrições das views (visíveis via pg_description)
-- -----------------------------------------------------------------------------
COMMENT ON VIEW ai.ativos IS 'Máquinas, caminhões, equipamentos e componentes, com localização. Uma linha por ativo.';
COMMENT ON VIEW ai.ordens_servico IS 'Ordens de serviço (O.S.) de manutenção, com ativo, responsável, prazos, tempos e custos. Uma linha por O.S.';
COMMENT ON VIEW ai.paradas IS 'Paradas de ativos (indisponibilidade). Parada aberta = esta_aberta (status ABERTA). Uma linha por parada.';
COMMENT ON VIEW ai.materiais IS 'Cadastro de materiais e peças com estoque atual, mínimo e custo médio. Uma linha por material.';
COMMENT ON VIEW ai.os_materiais IS 'Materiais solicitados, consumidos, devolvidos ou cancelados em cada O.S., com quantidade e custo. Uma linha por material em O.S.';
COMMENT ON VIEW ai.alertas IS 'Alertas do sistema (ativo parado, O.S. atrasada, aguardando peça, estoque baixo, custo alto). Uma linha por alerta.';
COMMENT ON VIEW ai.apontamentos_os IS 'Apontamentos de tempo dos técnicos nas O.S., com duração e custo de mão de obra. Uma linha por apontamento.';


-- -----------------------------------------------------------------------------
-- 5. Permissões: somente SELECT nas views da IA
-- -----------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA ai FROM PUBLIC;
GRANT SELECT ON
  ai.ativos,
  ai.ordens_servico,
  ai.paradas,
  ai.materiais,
  ai.os_materiais,
  ai.alertas,
  ai.apontamentos_os
TO ctrpe_ai_readonly;
