import {
  a,
  init_format,
  o
} from "./chunk-LI3D3BLA.mjs";
import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/confbox/dist/_chunks/libs/smol-toml.mjs
function e(e3, t2) {
  let n2 = e3.slice(0, t2).split(/\r\n|\n|\r/g);
  return [n2.length, n2.pop().length + 1];
}
function t(e3, t2, n2) {
  let r2 = e3.split(/\r\n|\n|\r/g), i3 = ``, a4 = (Math.log10(t2 + 1) | 0) + 1;
  for (let e4 = t2 - 1; e4 <= t2 + 1; e4++) {
    let o3 = r2[e4 - 1];
    o3 && (i3 += e4.toString().padEnd(a4, ` `), i3 += `:  `, i3 += o3, i3 += `
`, e4 === t2 && (i3 += ` `.repeat(a4 + n2 + 2), i3 += `^
`));
  }
  return i3;
}
function r(e3, t2) {
  let n2 = 0;
  for (; e3[t2 - ++n2] === `\\`; ) ;
  return --n2 && n2 % 2;
}
function i(e3, t2 = 0, n2 = e3.length) {
  let r2 = e3.indexOf(`
`, t2);
  return e3[r2 - 1] === `\r` && r2--, r2 <= n2 ? r2 : -1;
}
function a2(e3, t2) {
  for (let r2 = t2; r2 < e3.length; r2++) {
    let i3 = e3[r2];
    if (i3 === `
`) return r2;
    if (i3 === `\r` && e3[r2 + 1] === `
`) return r2 + 1;
    if (i3 < ` ` && i3 !== `	` || i3 === ``) throw new n(`control characters are not allowed in comments`, { toml: e3, ptr: t2 });
  }
  return e3.length;
}
function o2(e3, t2, n2, r2) {
  let i3;
  for (; (i3 = e3[t2]) === ` ` || i3 === `	` || !n2 && (i3 === `
` || i3 === `\r` && e3[t2 + 1] === `
`); ) t2++;
  return r2 || i3 !== `#` ? t2 : o2(e3, a2(e3, t2), n2);
}
function s(e3, t2, r2, a4, o3 = false) {
  if (!a4) return t2 = i(e3, t2), t2 < 0 ? e3.length : t2;
  for (let n2 = t2; n2 < e3.length; n2++) {
    let t3 = e3[n2];
    if (t3 === `#`) n2 = i(e3, n2);
    else if (t3 === r2) return n2 + 1;
    else if (t3 === a4 || o3 && (t3 === `
` || t3 === `\r` && e3[n2 + 1] === `
`)) return n2;
  }
  throw new n(`cannot find end of structure`, { toml: e3, ptr: t2 });
}
function c(e3, t2) {
  let n2 = e3[t2], i3 = n2 === e3[t2 + 1] && e3[t2 + 1] === e3[t2 + 2] ? e3.slice(t2, t2 + 3) : n2;
  t2 += i3.length - 1;
  do
    t2 = e3.indexOf(i3, ++t2);
  while (t2 > -1 && n2 !== `'` && r(e3, t2));
  return t2 > -1 && (t2 += i3.length, i3.length > 1 && (e3[t2] === n2 && t2++, e3[t2] === n2 && t2++)), t2;
}
function g(e3, t2 = 0, r2 = e3.length) {
  let i3 = e3[t2] === `'`, a4 = e3[t2++] === e3[t2] && e3[t2] === e3[t2 + 1];
  a4 && (r2 -= 2, e3[t2 += 2] === `\r` && t2++, e3[t2] === `
` && t2++);
  let s2 = 0, c2, l2 = ``, u2 = t2;
  for (; t2 < r2 - 1; ) {
    let r3 = e3[t2++];
    if (r3 === `
` || r3 === `\r` && e3[t2] === `
`) {
      if (!a4) throw new n(`newlines are not allowed in strings`, { toml: e3, ptr: t2 - 1 });
    } else if (r3 < ` ` && r3 !== `	` || r3 === ``) throw new n(`control characters are not allowed in strings`, { toml: e3, ptr: t2 - 1 });
    if (c2) {
      if (c2 = false, r3 === `x` || r3 === `u` || r3 === `U`) {
        let i4 = e3.slice(t2, t2 += r3 === `x` ? 2 : r3 === `u` ? 4 : 8);
        if (!m.test(i4)) throw new n(`invalid unicode escape`, { toml: e3, ptr: s2 });
        try {
          l2 += String.fromCodePoint(parseInt(i4, 16));
        } catch {
          throw new n(`invalid unicode escape`, { toml: e3, ptr: s2 });
        }
      } else if (a4 && (r3 === `
` || r3 === ` ` || r3 === `	` || r3 === `\r`)) {
        if (t2 = o2(e3, t2 - 1, true), e3[t2] !== `
` && e3[t2] !== `\r`) throw new n(`invalid escape: only line-ending whitespace may be escaped`, { toml: e3, ptr: s2 });
        t2 = o2(e3, t2);
      } else if (r3 in h) l2 += h[r3];
      else throw new n(`unrecognized escape sequence`, { toml: e3, ptr: s2 });
      u2 = t2;
    } else !i3 && r3 === `\\` && (s2 = t2 - 1, c2 = true, l2 += e3.slice(u2, s2));
  }
  return l2 + e3.slice(u2, r2 - 1);
}
function _(e3, t2, r2, i3) {
  if (e3 === `true`) return true;
  if (e3 === `false`) return false;
  if (e3 === `-inf`) return -1 / 0;
  if (e3 === `inf` || e3 === `+inf`) return 1 / 0;
  if (e3 === `nan` || e3 === `+nan` || e3 === `-nan`) return NaN;
  if (e3 === `-0`) return i3 ? 0n : 0;
  let a4 = d.test(e3);
  if (a4 || f.test(e3)) {
    if (p.test(e3)) throw new n(`leading zeroes are not allowed`, { toml: t2, ptr: r2 });
    e3 = e3.replace(/_/g, ``);
    let o4 = +e3;
    if (isNaN(o4)) throw new n(`invalid number`, { toml: t2, ptr: r2 });
    if (a4) {
      if ((a4 = !Number.isSafeInteger(o4)) && !i3) throw new n(`integer value cannot be represented losslessly`, { toml: t2, ptr: r2 });
      (a4 || i3 === true) && (o4 = BigInt(e3));
    }
    return o4;
  }
  let o3 = new u(e3);
  if (!o3.isValid()) throw new n(`invalid value`, { toml: t2, ptr: r2 });
  return o3;
}
function v(e3, t2, n2) {
  let r2 = e3.slice(t2, n2), i3 = r2.indexOf(`#`);
  return i3 > -1 && (a2(e3, i3), r2 = r2.slice(0, i3)), [r2.trimEnd(), i3];
}
function y(e3, t2, r2, i3, a4) {
  if (i3 === 0) throw new n(`document contains excessively nested structures. aborting.`, { toml: e3, ptr: t2 });
  let l2 = e3[t2];
  if (l2 === `[` || l2 === `{`) {
    let [s2, c2] = l2 === `[` ? C(e3, t2, i3, a4) : S(e3, t2, i3, a4);
    if (r2) {
      if (c2 = o2(e3, c2), e3[c2] === `,`) c2++;
      else if (e3[c2] !== r2) throw new n(`expected comma or end of structure`, { toml: e3, ptr: c2 });
    }
    return [s2, c2];
  }
  let u2;
  if (l2 === `"` || l2 === `'`) {
    u2 = c(e3, t2);
    let i4 = g(e3, t2, u2);
    if (r2) {
      if (u2 = o2(e3, u2), e3[u2] && e3[u2] !== `,` && e3[u2] !== r2 && e3[u2] !== `
` && e3[u2] !== `\r`) throw new n(`unexpected character encountered`, { toml: e3, ptr: u2 });
      u2 += +(e3[u2] === `,`);
    }
    return [i4, u2];
  }
  u2 = s(e3, t2, `,`, r2);
  let d2 = v(e3, t2, u2 - +(e3[u2 - 1] === `,`));
  if (!d2[0]) throw new n(`incomplete key-value declaration: no value specified`, { toml: e3, ptr: t2 });
  return r2 && d2[1] > -1 && (u2 = o2(e3, t2 + d2[1]), u2 += +(e3[u2] === `,`)), [_(d2[0], e3, t2, a4), u2];
}
function x(e3, t2, r2 = `=`) {
  let a4 = t2 - 1, s2 = [], l2 = e3.indexOf(r2, t2);
  if (l2 < 0) throw new n(`incomplete key-value: cannot find end of key`, { toml: e3, ptr: t2 });
  do {
    let o3 = e3[t2 = ++a4];
    if (o3 !== ` ` && o3 !== `	`) if (o3 === `"` || o3 === `'`) {
      if (o3 === e3[t2 + 1] && o3 === e3[t2 + 2]) throw new n(`multiline strings are not allowed in keys`, { toml: e3, ptr: t2 });
      let u2 = c(e3, t2);
      if (u2 < 0) throw new n(`unfinished string encountered`, { toml: e3, ptr: t2 });
      a4 = e3.indexOf(`.`, u2);
      let d2 = e3.slice(u2, a4 < 0 || a4 > l2 ? l2 : a4), f2 = i(d2);
      if (f2 > -1) throw new n(`newlines are not allowed in keys`, { toml: e3, ptr: t2 + a4 + f2 });
      if (d2.trimStart()) throw new n(`found extra tokens after the string part`, { toml: e3, ptr: u2 });
      if (l2 < u2 && (l2 = e3.indexOf(r2, u2), l2 < 0)) throw new n(`incomplete key-value: cannot find end of key`, { toml: e3, ptr: t2 });
      s2.push(g(e3, t2, u2));
    } else {
      a4 = e3.indexOf(`.`, t2);
      let r3 = e3.slice(t2, a4 < 0 || a4 > l2 ? l2 : a4);
      if (!b.test(r3)) throw new n(`only letter, numbers, dashes and underscores are allowed in keys`, { toml: e3, ptr: t2 });
      s2.push(r3.trimEnd());
    }
  } while (a4 + 1 && a4 < l2);
  return [s2, o2(e3, l2 + 1, true, true)];
}
function S(e3, t2, r2, i3) {
  let o3 = {}, s2 = /* @__PURE__ */ new Set(), c2;
  for (t2++; (c2 = e3[t2++]) !== `}` && c2; ) if (c2 === `,`) throw new n(`expected value, found comma`, { toml: e3, ptr: t2 - 1 });
  else if (c2 === `#`) t2 = a2(e3, t2);
  else if (c2 !== ` ` && c2 !== `	` && c2 !== `
` && c2 !== `\r`) {
    let a4, c3 = o3, l2 = false, [u2, d2] = x(e3, t2 - 1);
    for (let r3 = 0; r3 < u2.length; r3++) {
      if (r3 && (c3 = l2 ? c3[a4] : c3[a4] = {}), a4 = u2[r3], (l2 = Object.hasOwn(c3, a4)) && (typeof c3[a4] != `object` || s2.has(c3[a4]))) throw new n(`trying to redefine an already defined value`, { toml: e3, ptr: t2 });
      !l2 && a4 === `__proto__` && Object.defineProperty(c3, a4, { enumerable: true, configurable: true, writable: true });
    }
    if (l2) throw new n(`trying to redefine an already defined value`, { toml: e3, ptr: t2 });
    let [f2, p2] = y(e3, d2, `}`, r2 - 1, i3);
    s2.add(f2), c3[a4] = f2, t2 = p2;
  }
  if (!c2) throw new n(`unfinished table encountered`, { toml: e3, ptr: t2 });
  return [o3, t2];
}
function C(e3, t2, r2, i3) {
  let o3 = [], s2;
  for (t2++; (s2 = e3[t2++]) !== `]` && s2; ) if (s2 === `,`) throw new n(`expected value, found comma`, { toml: e3, ptr: t2 - 1 });
  else if (s2 === `#`) t2 = a2(e3, t2);
  else if (s2 !== ` ` && s2 !== `	` && s2 !== `
` && s2 !== `\r`) {
    let n2 = y(e3, t2 - 1, `]`, r2 - 1, i3);
    o3.push(n2[0]), t2 = n2[1];
  }
  if (!s2) throw new n(`unfinished array encountered`, { toml: e3, ptr: t2 });
  return [o3, t2];
}
function w(e3, t2, n2, r2) {
  let i3 = t2, a4 = n2, o3, s2 = false, c2;
  for (let t3 = 0; t3 < e3.length; t3++) {
    if (t3) {
      if (i3 = s2 ? i3[o3] : i3[o3] = {}, a4 = (c2 = a4[o3]).c, r2 === 0 && (c2.t === 1 || c2.t === 2)) return null;
      if (c2.t === 2) {
        let e4 = i3.length - 1;
        i3 = i3[e4], a4 = a4[e4].c;
      }
    }
    if (o3 = e3[t3], (s2 = Object.hasOwn(i3, o3)) && a4[o3]?.t === 0 && a4[o3]?.d) return null;
    s2 || (o3 === `__proto__` && (Object.defineProperty(i3, o3, { enumerable: true, configurable: true, writable: true }), Object.defineProperty(a4, o3, { enumerable: true, configurable: true, writable: true })), a4[o3] = { t: t3 < e3.length - 1 && r2 === 2 ? 3 : r2, d: false, i: 0, c: {} });
  }
  if (c2 = a4[o3], c2.t !== r2 && !(r2 === 1 && c2.t === 3) || (r2 === 2 && (c2.d || (c2.d = true, i3[o3] = []), i3[o3].push(i3 = {}), c2.c[c2.i++] = c2 = { t: 1, d: false, i: 0, c: {} }), c2.d)) return null;
  if (c2.d = true, r2 === 1) i3 = s2 ? i3[o3] : i3[o3] = {};
  else if (r2 === 0 && s2) return null;
  return [o3, i3, c2.c];
}
function T(e3, { maxDepth: t2 = 1e3, integersAsBigInt: r2 } = {}) {
  let i3 = {}, a4 = {}, s2 = i3, c2 = a4;
  for (let l2 = o2(e3, 0); l2 < e3.length; ) {
    if (e3[l2] === `[`) {
      let t3 = e3[++l2] === `[`, r3 = x(e3, l2 += +t3, `]`);
      if (t3) {
        if (e3[r3[1] - 1] !== `]`) throw new n(`expected end of table declaration`, { toml: e3, ptr: r3[1] - 1 });
        r3[1]++;
      }
      let o3 = w(r3[0], i3, a4, t3 ? 2 : 1);
      if (!o3) throw new n(`trying to redefine an already defined table or value`, { toml: e3, ptr: l2 });
      c2 = o3[2], s2 = o3[1], l2 = r3[1];
    } else {
      let i4 = x(e3, l2), a5 = w(i4[0], s2, c2, 0);
      if (!a5) throw new n(`trying to redefine an already defined table or value`, { toml: e3, ptr: l2 });
      let o3 = y(e3, i4[1], void 0, t2, r2);
      a5[1][a5[0]] = o3[0], l2 = o3[1];
    }
    if (l2 = o2(e3, l2, true), e3[l2] && e3[l2] !== `
` && e3[l2] !== `\r`) throw new n(`each key-value declaration must be followed by an end-of-line`, { toml: e3, ptr: l2 });
    l2 = o2(e3, l2);
  }
  return i3;
}
function D(e3) {
  let t2 = typeof e3;
  if (t2 === `object`) {
    if (Array.isArray(e3)) return `array`;
    if (e3 instanceof Date) return `date`;
  }
  return t2;
}
function O(e3) {
  for (let t2 = 0; t2 < e3.length; t2++) if (D(e3[t2]) !== `object`) return false;
  return e3.length != 0;
}
function k(e3) {
  return JSON.stringify(e3).replace(/\x7f/g, `\\u007f`);
}
function A(e3, t2, n2, r2) {
  if (n2 === 0) throw Error(`Could not stringify the object: maximum object depth exceeded`);
  if (t2 === `number`) return isNaN(e3) ? `nan` : e3 === 1 / 0 ? `inf` : e3 === -1 / 0 ? `-inf` : r2 && Number.isInteger(e3) ? e3.toFixed(1) : e3.toString();
  if (t2 === `bigint` || t2 === `boolean`) return e3.toString();
  if (t2 === `string`) return k(e3);
  if (t2 === `date`) {
    if (isNaN(e3.getTime())) throw TypeError(`cannot serialize invalid date`);
    return e3.toISOString();
  }
  if (t2 === `object`) return j(e3, n2, r2);
  if (t2 === `array`) return M(e3, n2, r2);
}
function j(e3, t2, n2) {
  let r2 = Object.keys(e3);
  if (r2.length === 0) return `{}`;
  let i3 = `{ `;
  for (let a4 = 0; a4 < r2.length; a4++) {
    let o3 = r2[a4];
    a4 && (i3 += `, `), i3 += E.test(o3) ? o3 : k(o3), i3 += ` = `, i3 += A(e3[o3], D(e3[o3]), t2 - 1, n2);
  }
  return i3 + ` }`;
}
function M(e3, t2, n2) {
  if (e3.length === 0) return `[]`;
  let r2 = `[ `;
  for (let i3 = 0; i3 < e3.length; i3++) {
    if (i3 && (r2 += `, `), e3[i3] === null || e3[i3] === void 0) throw TypeError(`arrays cannot contain null or undefined values`);
    r2 += A(e3[i3], D(e3[i3]), t2 - 1, n2);
  }
  return r2 + ` ]`;
}
function N(e3, t2, n2, r2) {
  if (n2 === 0) throw Error(`Could not stringify the object: maximum object depth exceeded`);
  let i3 = ``;
  for (let a4 = 0; a4 < e3.length; a4++) i3 += `${i3 && `
`}[[${t2}]]
`, i3 += P(0, e3[a4], t2, n2, r2);
  return i3;
}
function P(e3, t2, n2, r2, i3) {
  if (r2 === 0) throw Error(`Could not stringify the object: maximum object depth exceeded`);
  let a4 = ``, o3 = ``, s2 = Object.keys(t2);
  for (let e4 = 0; e4 < s2.length; e4++) {
    let c2 = s2[e4];
    if (t2[c2] !== null && t2[c2] !== void 0) {
      let e5 = D(t2[c2]);
      if (e5 === `symbol` || e5 === `function`) throw TypeError(`cannot serialize values of type '${e5}'`);
      let s3 = E.test(c2) ? c2 : k(c2);
      if (e5 === `array` && O(t2[c2])) o3 += (o3 && `
`) + N(t2[c2], n2 ? `${n2}.${s3}` : s3, r2 - 1, i3);
      else if (e5 === `object`) {
        let e6 = n2 ? `${n2}.${s3}` : s3;
        o3 += (o3 && `
`) + P(e6, t2[c2], e6, r2 - 1, i3);
      } else a4 += s3, a4 += ` = `, a4 += A(t2[c2], e5, r2, i3), a4 += `
`;
    }
  }
  return e3 && (a4 || !o3) && (a4 = a4 ? `[${e3}]
${a4}` : `[${e3}]`), a4 && o3 ? `${a4}
${o3}` : a4 || o3;
}
function F(e3, { maxDepth: t2 = 1e3, numbersAsFloat: n2 = false } = {}) {
  if (D(e3) !== `object`) throw TypeError(`stringify can only be called with an object`);
  let r2 = P(0, e3, ``, t2, n2);
  return r2[r2.length - 1] === `
` ? r2 : r2 + `
`;
}
var n, l, u, d, f, p, m, h, b, E;
var init_smol_toml = __esm({
  "node_modules/confbox/dist/_chunks/libs/smol-toml.mjs"() {
    init_esm();
    __name(e, "e");
    __name(t, "t");
    n = class extends Error {
      static {
        __name(this, "n");
      }
      line;
      column;
      codeblock;
      constructor(n2, r2) {
        let [i3, a4] = e(r2.toml, r2.ptr), o3 = t(r2.toml, i3, a4);
        super(`Invalid TOML document: ${n2}

${o3}`, r2), this.line = i3, this.column = a4, this.codeblock = o3;
      }
    };
    __name(r, "r");
    __name(i, "i");
    __name(a2, "a");
    __name(o2, "o");
    __name(s, "s");
    __name(c, "c");
    l = /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i;
    u = class e2 extends Date {
      static {
        __name(this, "e");
      }
      #e = false;
      #t = false;
      #n = null;
      constructor(e3) {
        let t2 = true, n2 = true, r2 = `Z`;
        if (typeof e3 == `string`) {
          let i3 = e3.match(l);
          i3 ? (i3[1] || (t2 = false, e3 = `0000-01-01T${e3}`), n2 = !!i3[2], n2 && e3[10] === ` ` && (e3 = e3.replace(` `, `T`)), i3[2] && +i3[2] > 23 ? e3 = `` : (r2 = i3[3] || null, e3 = e3.toUpperCase(), !r2 && n2 && (e3 += `Z`))) : e3 = ``;
        }
        super(e3), isNaN(this.getTime()) || (this.#e = t2, this.#t = n2, this.#n = r2);
      }
      isDateTime() {
        return this.#e && this.#t;
      }
      isLocal() {
        return !this.#e || !this.#t || !this.#n;
      }
      isDate() {
        return this.#e && !this.#t;
      }
      isTime() {
        return this.#t && !this.#e;
      }
      isValid() {
        return this.#e || this.#t;
      }
      toISOString() {
        let e3 = super.toISOString();
        if (this.isDate()) return e3.slice(0, 10);
        if (this.isTime()) return e3.slice(11, 23);
        if (this.#n === null) return e3.slice(0, -1);
        if (this.#n === `Z`) return e3;
        let t2 = this.#n.slice(1, 3) * 60 + +this.#n.slice(4, 6);
        return t2 = this.#n[0] === `-` ? t2 : -t2, new Date(this.getTime() - t2 * 6e4).toISOString().slice(0, -1) + this.#n;
      }
      static wrapAsOffsetDateTime(t2, n2 = `Z`) {
        let r2 = new e2(t2);
        return r2.#n = n2, r2;
      }
      static wrapAsLocalDateTime(t2) {
        let n2 = new e2(t2);
        return n2.#n = null, n2;
      }
      static wrapAsLocalDate(t2) {
        let n2 = new e2(t2);
        return n2.#t = false, n2.#n = null, n2;
      }
      static wrapAsLocalTime(t2) {
        let n2 = new e2(t2);
        return n2.#e = false, n2.#n = null, n2;
      }
    };
    d = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
    f = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
    p = /^[+-]?0[0-9_]/;
    m = /^[0-9a-f]{2,8}$/i;
    h = { b: `\b`, t: `	`, n: `
`, f: `\f`, r: `\r`, e: `\x1B`, '"': `"`, "\\": `\\` };
    __name(g, "g");
    __name(_, "_");
    __name(v, "v");
    __name(y, "y");
    b = /^[a-zA-Z0-9-_]+[ \t]*$/;
    __name(x, "x");
    __name(S, "S");
    __name(C, "C");
    __name(w, "w");
    __name(T, "T");
    E = /^[a-z0-9-_]+$/i;
    __name(D, "D");
    __name(O, "O");
    __name(k, "k");
    __name(A, "A");
    __name(j, "j");
    __name(M, "M");
    __name(N, "N");
    __name(P, "P");
    __name(F, "F");
  }
});

// node_modules/confbox/dist/toml.mjs
function i2(t2) {
  let r2 = T(t2);
  return a(t2, r2, { preserveIndentation: false }), r2;
}
function a3(e3) {
  let n2 = o(e3, { preserveIndentation: false }), i3 = F(e3);
  return n2.whitespace.start + i3 + n2.whitespace.end;
}
var init_toml = __esm({
  "node_modules/confbox/dist/toml.mjs"() {
    init_esm();
    init_format();
    init_smol_toml();
    __name(i2, "i");
    __name(a3, "a");
  }
});
init_toml();
export {
  i2 as parseTOML,
  a3 as stringifyTOML
};
/*! Bundled license information:

confbox/dist/_chunks/libs/smol-toml.mjs:
  (*!
  * Copyright (c) Squirrel Chat et al., All rights reserved.
  * SPDX-License-Identifier: BSD-3-Clause
  *
  * Redistribution and use in source and binary forms, with or without
  * modification, are permitted provided that the following conditions are met:
  *
  * 1. Redistributions of source code must retain the above copyright notice, this
  *    list of conditions and the following disclaimer.
  * 2. Redistributions in binary form must reproduce the above copyright notice,
  *    this list of conditions and the following disclaimer in the
  *    documentation and/or other materials provided with the distribution.
  * 3. Neither the name of the copyright holder nor the names of its contributors
  *    may be used to endorse or promote products derived from this software without
  *    specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *)
*/
//# sourceMappingURL=toml-PU6R72XG.mjs.map
