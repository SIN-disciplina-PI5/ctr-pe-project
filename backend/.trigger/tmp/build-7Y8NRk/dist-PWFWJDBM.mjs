import {
  init_ohash_D_AXeF1,
  isEqual,
  serialize
} from "./chunk-RAZF55Y6.mjs";
import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/ohash/dist/crypto/node/index.mjs
import { createHash } from "node:crypto";
function digest(t) {
  if (e) return e(r, t, s);
  const o = createHash(r).update(t);
  return globalThis.process?.versions?.webcontainer ? o.digest().toString(s) : o.digest(s);
}
var e, r, s;
var init_node = __esm({
  "node_modules/ohash/dist/crypto/node/index.mjs"() {
    init_esm();
    e = globalThis.process?.getBuiltinModule?.("crypto")?.hash;
    r = "sha256";
    s = "base64url";
    __name(digest, "digest");
  }
});

// node_modules/ohash/dist/index.mjs
function hash(input) {
  return digest(serialize(input));
}
var init_dist = __esm({
  "node_modules/ohash/dist/index.mjs"() {
    init_esm();
    init_ohash_D_AXeF1();
    init_ohash_D_AXeF1();
    init_node();
    init_node();
    __name(hash, "hash");
  }
});
init_dist();
export {
  digest,
  hash,
  isEqual,
  serialize
};
//# sourceMappingURL=dist-PWFWJDBM.mjs.map
