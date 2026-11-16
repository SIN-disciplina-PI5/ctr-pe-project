import { defineConfig } from "@trigger.dev/sdk";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

export default defineConfig({
  project: "proj_tvlwaaavsmyxhuqzrqjp",
  runtime: "node-24",
  logLevel: "log",
  // Teto global; as tasks de relatório definem limites menores.
  maxDuration: 900,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 2,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
  build: {
    // O parser carrega um arquivo WASM ao lado do próprio pacote. Mantê-lo
    // externo preserva essa estrutura no runtime do Trigger.dev.
    external: ["pgsql-parser", "libpg-query"],
    // Prisma 7 com driver adapter (@prisma/adapter-pg): modo "modern".
    extensions: [prismaExtension({ mode: "modern" })],
  },
});
