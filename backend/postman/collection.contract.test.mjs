import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { protectedRoutes } from "./generate-collection.mjs";

const directory = dirname(fileURLToPath(import.meta.url));
const backend = join(directory, "..");
const collection = JSON.parse(
  await readFile(join(directory, "ctr-pe.collection.json"), "utf8"),
);
const environment = JSON.parse(
  await readFile(join(directory, "ctr-pe.environment.json"), "utf8"),
);

const routeFiles = [
  ["/api/auth", "src/auth/auth.routes.ts"],
  ["/api/usuarios", "src/modules/usuarios/usuarios.routes.ts"],
  ["/api/empresas", "src/modules/empresas/empresas.routes.ts"],
  ["/api/ativos", "src/modules/ativos/ativos.routes.ts"],
  ["/api/materiais", "src/modules/materiais/materiais.routes.ts"],
  ["/api/alertas", "src/modules/alertas/alertas.routes.ts"],
  [
    "/api/ordens-servico",
    "src/modules/ordens-servico/ordens-servico.routes.ts",
  ],
  [
    "/api/paradas-ativos",
    "src/modules/paradas-ativos/paradas-ativos.routes.ts",
  ],
  [
    "/api/ordens-servico-materiais",
    "src/modules/ordens-servico-materiais/ordens-servico-materiais.routes.ts",
  ],
  [
    "/api/apontamentos-os",
    "src/modules/apontamentos-os/apontamentos-os.routes.ts",
  ],
  ["/api/dashboard", "src/modules/dashboard/dashboard.routes.ts"],
  ["/api/auditoria", "src/modules/auditoria/auditoria.routes.ts"],
  ["/api/localizacoes", "src/modules/localizacoes/localizacoes.routes.ts"],
  ["/api/ai", "src/modules/ai/ai.routes.ts"],
];

const publicAuthRoutes = new Set([
  "GET /api/auth/sign-up/empresas",
  "POST /api/auth/sign-up",
  "POST /api/auth/sign-up-testing",
  "POST /api/auth/sign-in",
  "POST /api/auth/refresh",
  "DELETE /api/auth/logout",
]);

function normalizePath(path) {
  return path
    .replace("{{baseUrl}}", "")
    .replace(/{{[^}]+}}/g, ":id")
    .replace(/:[A-Za-z][A-Za-z0-9]*/g, ":id");
}

function routeKey(method, path) {
  return `${method.toUpperCase()} ${normalizePath(path)}`;
}

function allRequests(items) {
  return items.flatMap((item) =>
    item.request ? [item] : allRequests(item.item ?? []),
  );
}

async function routesFromSource() {
  const routes = [];
  for (const [mount, file] of routeFiles) {
    const source = await readFile(join(backend, file), "utf8");
    const expression = /\w+\.(get|post|patch|delete)\(\s*"([^"]+)"/g;
    for (const match of source.matchAll(expression)) {
      routes.push(
        routeKey(match[1], `${mount}${match[2] === "/" ? "" : match[2]}`),
      );
    }
  }
  return routes;
}

test("a superfície protegida acompanha todas as rotas Express atuais", async () => {
  const actual = (await routesFromSource())
    .filter((route) => !publicAuthRoutes.has(route))
    .sort();
  const expected = protectedRoutes
    .map(([method, path]) => routeKey(method, path))
    .sort();

  assert.deepEqual(expected, actual);
});

test("a coleção cobre o manifesto protegido e os contratos públicos", () => {
  const requests = allRequests(collection.item);
  const covered = new Set(
    requests.map((item) => routeKey(item.request.method, item.request.url)),
  );

  for (const [method, path] of protectedRoutes) {
    assert.ok(covered.has(routeKey(method, path)), `${method} ${path} ausente`);
  }
  assert.ok(covered.has("GET /health"));
  for (const route of publicAuthRoutes)
    assert.ok(covered.has(route), `${route} ausente`);
});

test("toda requisição possui asserção automatizada", () => {
  for (const item of allRequests(collection.item)) {
    assert.ok(
      item.event?.some(
        (event) => event.listen === "test" && event.script?.exec?.length > 0,
      ),
      `sem teste: ${item.name}`,
    );
  }
});

test("environment não versiona tokens, refresh tokens ou senha", () => {
  const sensitive = environment.values.filter(
    (entry) =>
      entry.type === "secret" || /(^|_)(token|password)(_|$)/i.test(entry.key),
  );
  assert.ok(sensitive.length > 0);
  for (const entry of sensitive) {
    assert.equal(entry.value, "", `${entry.key} deve permanecer vazio`);
  }
});

test("coleção captura recursos do workflow sem conter bearer token fixo", () => {
  const serialized = JSON.stringify(collection);
  for (const variable of [
    "created_localizacao_id",
    "created_ativo_id",
    "created_material_id",
    "created_ordem_id",
  ]) {
    assert.match(serialized, new RegExp(variable));
  }
  assert.doesNotMatch(serialized, /Bearer\s+(?!{{)[A-Za-z0-9_-]{20,}/);
});
