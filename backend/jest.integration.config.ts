import type { Config } from "jest";

import baseConfig from "./jest.config.ts";

const config: Config = {
  ...baseConfig,
  testMatch: [
    "<rootDir>/tests/e2e/**/*spec.ts",
    "<rootDir>/tests/spikes/**/*spec.ts",
    "<rootDir>/src/auth/tests/**/*spec.ts",
    "<rootDir>/src/modules/empresas/tests/empresas.routes.spec.ts",
    "<rootDir>/src/modules/localizacoes/tests/localizacoes.routes.spec.ts",
  ],
};

export default config;
