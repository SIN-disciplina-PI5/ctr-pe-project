import type { Config } from "jest";

import baseConfig from "./jest.config.ts";

const config: Config = {
  ...baseConfig,
  testPathIgnorePatterns: [
    "<rootDir>/tests/e2e/",
    "<rootDir>/tests/spikes/",
    "<rootDir>/src/auth/tests/",
    "<rootDir>/src/modules/empresas/tests/empresas.routes.spec.ts",
    "<rootDir>/src/modules/localizacoes/tests/localizacoes.routes.spec.ts",
  ],
};

export default config;
