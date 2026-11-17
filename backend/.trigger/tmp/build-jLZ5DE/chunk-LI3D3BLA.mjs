import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/confbox/dist/_chunks/libs/detect-indent.mjs
function n(e2, n3, r3) {
  return e2 && n3 === t && r3 === 1;
}
function r(r3, a3) {
  let o3 = /* @__PURE__ */ new Map(), s2 = 0, c2, l;
  for (let u of r3.split(/\n/g)) {
    if (!u) continue;
    let r4 = u.match(e);
    if (r4 === null) s2 = 0, c2 = ``;
    else {
      let e2 = r4[0].length, u2 = r4[1] ? t : `tab`;
      if (n(a3, u2, e2)) continue;
      u2 !== c2 && (s2 = 0), c2 = u2;
      let d = 1, f = 0, p = e2 - s2;
      if (s2 = e2, p === 0) d = 0, f = 1;
      else {
        let e3 = Math.abs(p);
        if (n(a3, u2, e3)) continue;
        l = i(u2, e3);
      }
      let m = o3.get(l);
      o3.set(l, m === void 0 ? [1, 0] : [m[0] + d, m[1] + f]);
    }
  }
  return o3;
}
function i(e2, n3) {
  return (e2 === t ? `s` : `t`) + String(n3);
}
function a(e2) {
  return { type: e2[0] === `s` ? t : `tab`, amount: Number(e2.slice(1)) };
}
function o(e2) {
  let t3, n3 = 0, r3 = 0;
  for (let [i3, [a3, o3]] of e2) (a3 > n3 || a3 === n3 && o3 > r3) && (n3 = a3, r3 = o3, t3 = i3);
  return t3;
}
function s(e2, n3) {
  return (e2 === t ? ` ` : `	`).repeat(n3);
}
function c(e2) {
  if (typeof e2 != `string`) throw TypeError(`Expected a string`);
  let t3 = r(e2, true);
  t3.size === 0 && (t3 = r(e2, false));
  let n3 = o(t3), i3, c2 = 0, l = ``;
  return n3 !== void 0 && ({ type: i3, amount: c2 } = a(n3), l = s(i3, c2)), { amount: c2, type: i3, indent: l };
}
var e, t;
var init_detect_indent = __esm({
  "node_modules/confbox/dist/_chunks/libs/detect-indent.mjs"() {
    init_esm();
    e = /^(?:( )+|\t+)/;
    t = `space`;
    __name(n, "n");
    __name(r, "r");
    __name(i, "i");
    __name(a, "a");
    __name(o, "o");
    __name(s, "s");
    __name(c, "c");
  }
});

// node_modules/confbox/dist/_chunks/_format.mjs
function i2(e2, t3 = {}) {
  return { sample: t3.indent === void 0 && t3.preserveIndentation !== false && e2.slice(0, t3?.sampleSize || 1024), whiteSpace: t3.preserveWhitespace === false ? void 0 : { start: n2.exec(e2)?.[0] || ``, end: r2.exec(e2)?.[0] || `` } };
}
function a2(e2, n3, r3) {
  !n3 || typeof n3 != `object` || Object.defineProperty(n3, t2, { enumerable: false, configurable: true, writable: true, value: i2(e2, r3) });
}
function o2(n3, r3) {
  if (!n3 || typeof n3 != `object` || !(t2 in n3)) return { indent: r3?.indent ?? 2, whitespace: { start: ``, end: `` } };
  let i3 = n3[t2];
  return { indent: r3?.indent || c(i3.sample || ``).indent, whitespace: i3.whiteSpace || { start: ``, end: `` } };
}
var t2, n2, r2;
var init_format = __esm({
  "node_modules/confbox/dist/_chunks/_format.mjs"() {
    init_esm();
    init_detect_indent();
    t2 = Symbol.for(`__confbox_fmt__`);
    n2 = /^(\s+)/;
    r2 = /(\s+)$/;
    __name(i2, "i");
    __name(a2, "a");
    __name(o2, "o");
  }
});

export {
  a2 as a,
  o2 as o,
  init_format
};
//# sourceMappingURL=chunk-LI3D3BLA.mjs.map
