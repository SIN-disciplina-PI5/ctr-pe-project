import {
  require_dist,
  require_token_error,
  require_token_util
} from "./chunk-XJYKV2TK.mjs";
import {
  __commonJS,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/@vercel/oidc/dist/token.js
var require_token = __commonJS({
  "node_modules/@vercel/oidc/dist/token.js"(exports, module) {
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var token_exports = {};
    __export(token_exports, {
      refreshToken: /* @__PURE__ */ __name(() => refreshToken, "refreshToken")
    });
    module.exports = __toCommonJS(token_exports);
    var import_cli_config = require_dist();
    var import_token_error = require_token_error();
    var import_token_util = require_token_util();
    async function refreshToken(options) {
      let projectId = options?.project;
      let teamId = options?.team;
      if (!projectId && !teamId) {
        const projectInfo = (0, import_token_util.findProjectInfo)();
        projectId = projectInfo.projectId;
        teamId = projectInfo.teamId;
      } else if (!projectId || !teamId) {
        const projectInfo = (0, import_token_util.findProjectInfo)();
        projectId = projectId ?? projectInfo.projectId;
        teamId = teamId ?? projectInfo.teamId;
      }
      if (!projectId) {
        throw new import_token_error.VercelOidcTokenError(
          "Failed to refresh OIDC token: No project specified. Try re-linking your project with `vc link`"
        );
      }
      let maybeToken = (0, import_token_util.loadToken)(projectId);
      if (!maybeToken || (0, import_token_util.isExpired)((0, import_token_util.getTokenPayload)(maybeToken.token), options?.expirationBufferMs)) {
        const configDir = (0, import_cli_config.getGlobalPathConfig)();
        if ((0, import_cli_config.getLikelyEffectiveCredStorage)(configDir) === "keyring") {
          maybeToken = await (0, import_token_util.getVercelOidcTokenFromCli)(projectId, teamId);
        } else {
          const authToken = await (0, import_token_util.getVercelToken)({
            expirationBufferMs: options?.expirationBufferMs
          });
          maybeToken = await (0, import_token_util.getVercelOidcToken)(authToken, projectId, teamId);
        }
        if (!maybeToken) {
          throw new import_token_error.VercelOidcTokenError("Failed to refresh OIDC token");
        }
        (0, import_token_util.saveToken)(maybeToken, projectId);
      }
      process.env.VERCEL_OIDC_TOKEN = maybeToken.token;
      return;
    }
    __name(refreshToken, "refreshToken");
  }
});
export default require_token();
//# sourceMappingURL=token-RNGFM33P.mjs.map
