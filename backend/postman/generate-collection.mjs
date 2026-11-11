import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));

export const protectedRoutes = [
  ["GET", "/api/auth/me"],
  ["PATCH", "/api/auth/me/password"],
  ["GET", "/api/usuarios"],
  ["GET", "/api/usuarios/{{missing_id}}"],
  ["POST", "/api/usuarios"],
  ["PATCH", "/api/usuarios/{{missing_id}}"],
  ["PATCH", "/api/usuarios/{{missing_id}}/password"],
  ["DELETE", "/api/usuarios/{{missing_id}}"],
  ["GET", "/api/empresas"],
  ["GET", "/api/empresas/{{missing_id}}"],
  ["POST", "/api/empresas"],
  ["PATCH", "/api/empresas/{{missing_id}}"],
  ["DELETE", "/api/empresas/{{missing_id}}"],
  ["GET", "/api/ativos"],
  ["GET", "/api/ativos/{{missing_id}}"],
  ["POST", "/api/ativos"],
  ["PATCH", "/api/ativos/{{missing_id}}"],
  ["PATCH", "/api/ativos/{{missing_id}}/status"],
  ["DELETE", "/api/ativos/{{missing_id}}"],
  ["GET", "/api/materiais"],
  ["GET", "/api/materiais/{{missing_id}}"],
  ["POST", "/api/materiais"],
  ["PATCH", "/api/materiais/{{missing_id}}"],
  ["PATCH", "/api/materiais/{{missing_id}}/estoque"],
  ["DELETE", "/api/materiais/{{missing_id}}"],
  ["GET", "/api/alertas"],
  ["GET", "/api/alertas/me"],
  ["GET", "/api/alertas/{{missing_id}}"],
  ["POST", "/api/alertas"],
  ["PATCH", "/api/alertas/{{missing_id}}/lido"],
  ["PATCH", "/api/alertas/{{missing_id}}/resolver"],
  ["PATCH", "/api/alertas/{{missing_id}}/ignorar"],
  ["GET", "/api/ordens-servico"],
  ["GET", "/api/ordens-servico/{{missing_id}}"],
  ["GET", "/api/ordens-servico/{{missing_id}}/materiais"],
  ["GET", "/api/ordens-servico/{{missing_id}}/apontamentos"],
  ["POST", "/api/ordens-servico"],
  ["POST", "/api/ordens-servico/{{missing_id}}/materiais"],
  ["POST", "/api/ordens-servico/{{missing_id}}/apontamentos"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}/iniciar"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}/aguardar-peca"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}/retomar"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}/encerrar"],
  ["PATCH", "/api/ordens-servico/{{missing_id}}/cancelar"],
  ["GET", "/api/paradas-ativos"],
  ["GET", "/api/paradas-ativos/{{missing_id}}"],
  ["POST", "/api/paradas-ativos"],
  ["PATCH", "/api/paradas-ativos/{{missing_id}}"],
  ["PATCH", "/api/paradas-ativos/{{missing_id}}/encerrar"],
  ["PATCH", "/api/paradas-ativos/{{missing_id}}/cancelar"],
  ["GET", "/api/ordens-servico-materiais/{{missing_id}}"],
  ["PATCH", "/api/ordens-servico-materiais/{{missing_id}}"],
  ["PATCH", "/api/ordens-servico-materiais/{{missing_id}}/consumir"],
  ["PATCH", "/api/ordens-servico-materiais/{{missing_id}}/devolver"],
  ["PATCH", "/api/ordens-servico-materiais/{{missing_id}}/cancelar"],
  ["GET", "/api/apontamentos-os/{{missing_id}}"],
  ["PATCH", "/api/apontamentos-os/{{missing_id}}"],
  ["PATCH", "/api/apontamentos-os/{{missing_id}}/encerrar"],
  ["DELETE", "/api/apontamentos-os/{{missing_id}}"],
  ["GET", "/api/dashboard/resumo"],
  ["GET", "/api/dashboard/ativos"],
  ["GET", "/api/dashboard/ordens-servico"],
  ["GET", "/api/dashboard/materiais"],
  ["GET", "/api/dashboard/custos"],
  ["GET", "/api/auditoria"],
  ["GET", "/api/auditoria/{{missing_id}}"],
  ["GET", "/api/localizacoes"],
  ["GET", "/api/localizacoes/{{missing_id}}"],
  ["POST", "/api/localizacoes"],
  ["PATCH", "/api/localizacoes/{{missing_id}}"],
  ["DELETE", "/api/localizacoes/{{missing_id}}"],
  ["POST", "/api/ai/chat"],
  ["POST", "/api/ai/query"],
  ["POST", "/api/ai/query/generate"],
];

const jsonHeader = { key: "Content-Type", value: "application/json" };

function testScript(expected, capture) {
  const allowed = Array.isArray(expected) ? expected : [expected];
  const lines = [
    `pm.test('status ${allowed.join(" ou ")}', () => pm.expect(${JSON.stringify(allowed)}).to.include(pm.response.code));`,
    "pm.test('não expõe stack trace', () => pm.expect(pm.response.text().toLowerCase()).not.to.include('at process.'));",
  ];
  if (capture) {
    lines.push(
      "if (pm.response.code >= 200 && pm.response.code < 300) {",
      "  const data = pm.response.json();",
      `  pm.environment.set('${capture}', data.id);`,
      "}",
    );
  }
  return [{ listen: "test", script: { type: "text/javascript", exec: lines } }];
}

function request({
  name,
  method,
  path,
  token,
  body,
  expected,
  capture,
  tests,
}) {
  const header = [];
  if (token)
    header.push({ key: "Authorization", value: `Bearer {{${token}}}` });
  if (body !== undefined) header.push(jsonHeader);

  return {
    name: name ?? `${method} ${path}`,
    request: {
      method,
      header,
      ...(body === undefined
        ? {}
        : { body: { mode: "raw", raw: JSON.stringify(body, null, 2) } }),
      url: `{{baseUrl}}${path}`,
    },
    event: tests ?? testScript(expected, capture),
  };
}

function signIn(name, emailVariable, tokenVariable, refreshVariable) {
  return request({
    name: `Autenticar ${name}`,
    method: "POST",
    path: "/api/auth/sign-in",
    body: { email: `{{${emailVariable}}}`, password: "{{auth_password}}" },
    expected: 200,
    tests: [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('autenticação responde 200', () => pm.response.to.have.status(200));",
            "const data = pm.response.json();",
            "pm.expect(data.accessToken).to.be.a('string').and.not.empty;",
            "pm.expect(data.refreshToken).to.be.a('string').and.not.empty;",
            `pm.environment.set('${tokenVariable}', data.accessToken);`,
            `pm.environment.set('${refreshVariable}', data.refreshToken);`,
            "pm.test('não expõe senha ou hash', () => {",
            "  const text = pm.response.text();",
            "  pm.expect(text).not.to.include('senhaHash');",
            "  pm.expect(text).not.to.include('passwordHash');",
            "});",
          ],
        },
      },
    ],
  });
}

function listAndCapture(name, path, token, variable) {
  return request({
    name,
    method: "GET",
    path,
    token,
    expected: 200,
    tests: [
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            "pm.test('listagem responde 200', () => pm.response.to.have.status(200));",
            "const payload = pm.response.json();",
            "const rows = Array.isArray(payload) ? payload : (payload.data || payload.items || []);",
            "pm.expect(rows).to.be.an('array');",
            `if (rows.length > 0) pm.environment.set('${variable}', rows[0].id);`,
          ],
        },
      },
    ],
  });
}

const collection = {
  info: {
    name: "CTR-PE API - Contract and Security Suite",
    _postman_id: "ctr-pe-api-contract-security-v2",
    description:
      "Contrato executável das rotas atuais. Usa dados sintéticos, captura tokens e IDs e não contém segredos.",
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "00. Health e contratos públicos",
      item: [
        request({
          name: "Health",
          method: "GET",
          path: "/health",
          expected: 200,
        }),
        request({
          name: "Empresas disponíveis no cadastro",
          method: "GET",
          path: "/api/auth/sign-up/empresas",
          expected: 200,
        }),
        request({
          name: "Cadastro público inválido",
          method: "POST",
          path: "/api/auth/sign-up",
          body: {},
          expected: 400,
        }),
        request({
          name: "Login inválido",
          method: "POST",
          path: "/api/auth/sign-in",
          body: {},
          expected: 400,
        }),
        request({
          name: "Refresh inválido",
          method: "POST",
          path: "/api/auth/refresh",
          body: {},
          expected: 400,
        }),
        request({
          name: "Logout inválido",
          method: "DELETE",
          path: "/api/auth/logout",
          body: {},
          expected: 400,
        }),
      ],
    },
    {
      name: "01. Autenticação dos dois tenants",
      item: [
        signIn(
          "ADMIN Alpha International",
          "admin_email_a",
          "token_admin_a",
          "refresh_admin_a",
        ),
        signIn(
          "ADMIN Alpha Brazilian",
          "admin_email_b",
          "token_admin_b",
          "refresh_admin_b",
        ),
        signIn(
          "GESTOR Alpha International",
          "gestor_email_a",
          "token_gestor_a",
          "refresh_gestor_a",
        ),
        signIn(
          "CONSULTA Alpha International",
          "consulta_email_a",
          "token_consulta_a",
          "refresh_consulta_a",
        ),
        request({
          name: "Identidade do tenant A",
          method: "GET",
          path: "/api/auth/me",
          token: "token_admin_a",
          expected: 200,
          tests: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: [
                  "pm.test('identidade responde 200', () => pm.response.to.have.status(200));",
                  "const user = pm.response.json();",
                  "pm.expect(user.empresaId).to.be.a('string').and.not.empty;",
                  "pm.environment.set('empresa_id_a', user.empresaId);",
                  "pm.environment.set('usuario_id_a', user.id);",
                ],
              },
            },
          ],
        }),
        request({
          name: "Identidade do tenant B",
          method: "GET",
          path: "/api/auth/me",
          token: "token_admin_b",
          expected: 200,
          tests: [
            {
              listen: "test",
              script: {
                type: "text/javascript",
                exec: [
                  "pm.test('identidade responde 200', () => pm.response.to.have.status(200));",
                  "const user = pm.response.json();",
                  "pm.environment.set('empresa_id_b', user.empresaId);",
                ],
              },
            },
          ],
        }),
        request({
          name: "Rotação de refresh token",
          method: "POST",
          path: "/api/auth/refresh",
          body: { refreshToken: "{{refresh_admin_a}}" },
          expected: 200,
        }),
      ],
    },
    {
      name: "02. Superfície protegida exige autenticação",
      item: protectedRoutes.map(([method, path]) =>
        request({
          method,
          path,
          body: ["POST", "PATCH"].includes(method) ? {} : undefined,
          expected: 401,
        }),
      ),
    },
    {
      name: "03. Leitura autenticada e captura de IDs",
      item: [
        listAndCapture(
          "Usuários",
          "/api/usuarios",
          "token_gestor_a",
          "usuario_listado_id",
        ),
        listAndCapture(
          "Empresas",
          "/api/empresas",
          "token_admin_a",
          "empresa_listada_id",
        ),
        listAndCapture(
          "Ativos do tenant A",
          "/api/ativos",
          "token_admin_a",
          "ativo_id_a",
        ),
        listAndCapture(
          "Materiais",
          "/api/materiais",
          "token_admin_a",
          "material_id_a",
        ),
        listAndCapture(
          "Alertas",
          "/api/alertas",
          "token_admin_a",
          "alerta_id_a",
        ),
        listAndCapture(
          "Ordens de serviço",
          "/api/ordens-servico",
          "token_admin_a",
          "ordem_id_a",
        ),
        listAndCapture(
          "Paradas",
          "/api/paradas-ativos",
          "token_admin_a",
          "parada_id_a",
        ),
        listAndCapture(
          "Localizações",
          "/api/localizacoes",
          "token_admin_a",
          "localizacao_id_a",
        ),
        listAndCapture(
          "Ativos do tenant B",
          "/api/ativos",
          "token_admin_b",
          "ativo_id_b",
        ),
        request({
          name: "Dashboard resumo",
          method: "GET",
          path: "/api/dashboard/resumo",
          token: "token_gestor_a",
          expected: 200,
        }),
        request({
          name: "Dashboard ativos",
          method: "GET",
          path: "/api/dashboard/ativos",
          token: "token_gestor_a",
          expected: 200,
        }),
        request({
          name: "Dashboard ordens",
          method: "GET",
          path: "/api/dashboard/ordens-servico",
          token: "token_gestor_a",
          expected: 200,
        }),
        request({
          name: "Dashboard materiais",
          method: "GET",
          path: "/api/dashboard/materiais",
          token: "token_gestor_a",
          expected: 200,
        }),
        request({
          name: "Dashboard custos",
          method: "GET",
          path: "/api/dashboard/custos",
          token: "token_gestor_a",
          expected: 200,
        }),
        request({
          name: "Auditoria",
          method: "GET",
          path: "/api/auditoria",
          token: "token_gestor_a",
          expected: 200,
        }),
      ],
    },
    {
      name: "04. Isolamento, RBAC e IA",
      item: [
        request({
          name: "Tenant A não lê ativo do tenant B",
          method: "GET",
          path: "/api/ativos/{{ativo_id_b}}",
          token: "token_admin_a",
          expected: [403, 404],
        }),
        request({
          name: "CONSULTA não cria ativo",
          method: "POST",
          path: "/api/ativos",
          token: "token_consulta_a",
          body: {},
          expected: 403,
        }),
        request({
          name: "Chat valida payload antes do provedor",
          method: "POST",
          path: "/api/ai/chat",
          token: "token_consulta_a",
          body: { message: "" },
          expected: 400,
        }),
        request({
          name: "Query valida payload antes do provedor",
          method: "POST",
          path: "/api/ai/query",
          token: "token_consulta_a",
          body: { question: "" },
          expected: 400,
        }),
        request({
          name: "Geração SQL valida payload antes do provedor",
          method: "POST",
          path: "/api/ai/query/generate",
          token: "token_consulta_a",
          body: { question: "" },
          expected: 400,
        }),
      ],
    },
    {
      name: "05. Workflow controlado de ordem de serviço",
      item: [
        request({
          name: "Criar localização",
          method: "POST",
          path: "/api/localizacoes",
          token: "token_admin_a",
          body: {
            codigo: "PM-LOC-{{$timestamp}}",
            nome: "Local Postman {{$timestamp}}",
            tipo: "TESTE",
          },
          expected: 201,
          capture: "created_localizacao_id",
        }),
        request({
          name: "Criar ativo",
          method: "POST",
          path: "/api/ativos",
          token: "token_admin_a",
          body: {
            empresaId: "{{empresa_id_a}}",
            localizacaoId: "{{created_localizacao_id}}",
            codigo: "PM-AT-{{$timestamp}}",
            nome: "Ativo Postman {{$timestamp}}",
            tipo: "EQUIPAMENTO",
            criticidade: "MEDIA",
          },
          expected: 201,
          capture: "created_ativo_id",
        }),
        request({
          name: "Criar material",
          method: "POST",
          path: "/api/materiais",
          token: "token_admin_a",
          body: {
            empresaId: "{{empresa_id_a}}",
            codigo: "PM-MAT-{{$timestamp}}",
            nome: "Material Postman {{$timestamp}}",
            unidade: "UN",
            estoqueAtual: 10,
            estoqueMinimo: 2,
            custoMedio: 5,
          },
          expected: 201,
          capture: "created_material_id",
        }),
        request({
          name: "Criar ordem",
          method: "POST",
          path: "/api/ordens-servico",
          token: "token_admin_a",
          body: {
            empresaId: "{{empresa_id_a}}",
            localizacaoId: "{{created_localizacao_id}}",
            ativoId: "{{created_ativo_id}}",
            titulo: "Ordem Postman {{$timestamp}}",
            descricao: "Fluxo automatizado da coleção Postman.",
            tipo: "CORRETIVA",
            prioridade: "MEDIA",
            impactaDisponibilidade: true,
          },
          expected: 201,
          capture: "created_ordem_id",
        }),
        request({
          name: "Iniciar ordem",
          method: "PATCH",
          path: "/api/ordens-servico/{{created_ordem_id}}/iniciar",
          token: "token_admin_a",
          body: {},
          expected: 200,
        }),
        request({
          name: "Aguardar peça",
          method: "PATCH",
          path: "/api/ordens-servico/{{created_ordem_id}}/aguardar-peca",
          token: "token_admin_a",
          body: { observacao: "Aguardando peça do teste." },
          expected: 200,
        }),
        request({
          name: "Retomar ordem",
          method: "PATCH",
          path: "/api/ordens-servico/{{created_ordem_id}}/retomar",
          token: "token_admin_a",
          body: { observacao: "Peça recebida." },
          expected: 200,
        }),
        request({
          name: "Encerrar ordem",
          method: "PATCH",
          path: "/api/ordens-servico/{{created_ordem_id}}/encerrar",
          token: "token_admin_a",
          body: {
            diagnostico: "Diagnóstico do teste.",
            solucao: "Solução do teste.",
          },
          expected: 200,
        }),
      ],
    },
  ],
};

const environmentKeys = [
  ["baseUrl", "http://localhost:3000", "default"],
  ["auth_password", "", "secret"],
  ["admin_email_a", "international-admin@alpha-international.com", "default"],
  ["admin_email_b", "brazilian-admin@alpha-brazilian.com", "default"],
  ["gestor_email_a", "gestor1@alpha-international.com", "default"],
  ["consulta_email_a", "consulta1@alpha-international.com", "default"],
  ["missing_id", "cmissing00000000000000000", "default"],
  ...[
    "token_admin_a",
    "token_admin_b",
    "token_gestor_a",
    "token_consulta_a",
    "refresh_admin_a",
    "refresh_admin_b",
    "refresh_gestor_a",
    "refresh_consulta_a",
    "empresa_id_a",
    "empresa_id_b",
    "usuario_id_a",
    "ativo_id_b",
    "created_localizacao_id",
    "created_ativo_id",
    "created_material_id",
    "created_ordem_id",
  ].map((key) => [
    key,
    "",
    key.startsWith("token_") || key.startsWith("refresh_")
      ? "secret"
      : "default",
  ]),
];

const environment = {
  id: "ctr-pe-local-contract-environment",
  name: "CTR-PE Local Contract Environment",
  values: environmentKeys.map(([key, value, type]) => ({
    key,
    value,
    type,
    enabled: true,
  })),
  _postman_variable_scope: "environment",
};

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, "ctr-pe.collection.json"),
    `${JSON.stringify(collection, null, 2)}\n`,
  );
  await writeFile(
    join(directory, "ctr-pe.environment.json"),
    `${JSON.stringify(environment, null, 2)}\n`,
  );
}
