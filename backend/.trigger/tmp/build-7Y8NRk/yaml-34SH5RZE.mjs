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

// node_modules/confbox/dist/_chunks/libs/js-yaml.mjs
function e(e2) {
  return e2 == null;
}
function t(e2) {
  return typeof e2 == `object` && !!e2;
}
function n(t2) {
  return Array.isArray(t2) ? t2 : e(t2) ? [] : [t2];
}
function r(e2, t2) {
  var n2, r2, i3, a4;
  if (t2) for (a4 = Object.keys(t2), n2 = 0, r2 = a4.length; n2 < r2; n2 += 1) i3 = a4[n2], e2[i3] = t2[i3];
  return e2;
}
function i(e2, t2) {
  var n2 = ``, r2;
  for (r2 = 0; r2 < t2; r2 += 1) n2 += e2;
  return n2;
}
function a2(e2) {
  return e2 === 0 && 1 / e2 == -1 / 0;
}
function s(e2, t2) {
  var n2 = ``, r2 = e2.reason || `(unknown reason)`;
  return e2.mark ? (e2.mark.name && (n2 += `in "` + e2.mark.name + `" `), n2 += `(` + (e2.mark.line + 1) + `:` + (e2.mark.column + 1) + `)`, !t2 && e2.mark.snippet && (n2 += `

` + e2.mark.snippet), r2 + ` ` + n2) : r2;
}
function c(e2, t2) {
  Error.call(this), this.name = `YAMLException`, this.reason = e2, this.mark = t2, this.message = s(this, false), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = Error().stack || ``;
}
function u(e2, t2, n2, r2, i3) {
  var a4 = ``, o3 = ``, s2 = Math.floor(i3 / 2) - 1;
  return r2 - t2 > s2 && (a4 = ` ... `, t2 = r2 - s2 + a4.length), n2 - r2 > s2 && (o3 = ` ...`, n2 = r2 + s2 - o3.length), { str: a4 + e2.slice(t2, n2).replace(/\t/g, `→`) + o3, pos: r2 - t2 + a4.length };
}
function d(e2, t2) {
  return o2.repeat(` `, t2 - e2.length) + e2;
}
function f(e2, t2) {
  if (t2 = Object.create(t2 || null), !e2.buffer) return null;
  t2.maxLength ||= 79, typeof t2.indent != `number` && (t2.indent = 1), typeof t2.linesBefore != `number` && (t2.linesBefore = 3), typeof t2.linesAfter != `number` && (t2.linesAfter = 2);
  for (var n2 = /\r?\n|\r|\0/g, r2 = [0], i3 = [], a4, s2 = -1; a4 = n2.exec(e2.buffer); ) i3.push(a4.index), r2.push(a4.index + a4[0].length), e2.position <= a4.index && s2 < 0 && (s2 = r2.length - 2);
  s2 < 0 && (s2 = r2.length - 1);
  var c2 = ``, l2, f2, p2 = Math.min(e2.line + t2.linesAfter, i3.length).toString().length, m2 = t2.maxLength - (t2.indent + p2 + 3);
  for (l2 = 1; l2 <= t2.linesBefore && !(s2 - l2 < 0); l2++) f2 = u(e2.buffer, r2[s2 - l2], i3[s2 - l2], e2.position - (r2[s2] - r2[s2 - l2]), m2), c2 = o2.repeat(` `, t2.indent) + d((e2.line - l2 + 1).toString(), p2) + ` | ` + f2.str + `
` + c2;
  for (f2 = u(e2.buffer, r2[s2], i3[s2], e2.position, m2), c2 += o2.repeat(` `, t2.indent) + d((e2.line + 1).toString(), p2) + ` | ` + f2.str + `
`, c2 += o2.repeat(`-`, t2.indent + p2 + 3 + f2.pos) + `^
`, l2 = 1; l2 <= t2.linesAfter && !(s2 + l2 >= i3.length); l2++) f2 = u(e2.buffer, r2[s2 + l2], i3[s2 + l2], e2.position - (r2[s2] - r2[s2 + l2]), m2), c2 += o2.repeat(` `, t2.indent) + d((e2.line + l2 + 1).toString(), p2) + ` | ` + f2.str + `
`;
  return c2.replace(/\n$/, ``);
}
function g(e2) {
  var t2 = {};
  return e2 !== null && Object.keys(e2).forEach(function(n2) {
    e2[n2].forEach(function(e3) {
      t2[String(e3)] = n2;
    });
  }), t2;
}
function _(e2, t2) {
  if (t2 ||= {}, Object.keys(t2).forEach(function(t3) {
    if (m.indexOf(t3) === -1) throw new l(`Unknown option "` + t3 + `" is met in definition of "` + e2 + `" YAML type.`);
  }), this.options = t2, this.tag = e2, this.kind = t2.kind || null, this.resolve = t2.resolve || function() {
    return true;
  }, this.construct = t2.construct || function(e3) {
    return e3;
  }, this.instanceOf = t2.instanceOf || null, this.predicate = t2.predicate || null, this.represent = t2.represent || null, this.representName = t2.representName || null, this.defaultStyle = t2.defaultStyle || null, this.multi = t2.multi || false, this.styleAliases = g(t2.styleAliases || null), h.indexOf(this.kind) === -1) throw new l(`Unknown kind "` + this.kind + `" is specified for "` + e2 + `" YAML type.`);
}
function ee(e2, t2) {
  var n2 = [];
  return e2[t2].forEach(function(e3) {
    var t3 = n2.length;
    n2.forEach(function(n3, r2) {
      n3.tag === e3.tag && n3.kind === e3.kind && n3.multi === e3.multi && (t3 = r2);
    }), n2[t3] = e3;
  }), n2;
}
function te() {
  var e2 = { scalar: {}, sequence: {}, mapping: {}, fallback: {}, multi: { scalar: [], sequence: [], mapping: [], fallback: [] } }, t2, n2;
  function r2(t3) {
    t3.multi ? (e2.multi[t3.kind].push(t3), e2.multi.fallback.push(t3)) : e2[t3.kind][t3.tag] = e2.fallback[t3.tag] = t3;
  }
  __name(r2, "r");
  for (t2 = 0, n2 = arguments.length; t2 < n2; t2 += 1) arguments[t2].forEach(r2);
  return e2;
}
function y(e2) {
  return this.extend(e2);
}
function re(e2) {
  if (e2 === null) return true;
  var t2 = e2.length;
  return t2 === 1 && e2 === `~` || t2 === 4 && (e2 === `null` || e2 === `Null` || e2 === `NULL`);
}
function ie() {
  return null;
}
function ae(e2) {
  return e2 === null;
}
function se(e2) {
  if (e2 === null) return false;
  var t2 = e2.length;
  return t2 === 4 && (e2 === `true` || e2 === `True` || e2 === `TRUE`) || t2 === 5 && (e2 === `false` || e2 === `False` || e2 === `FALSE`);
}
function ce(e2) {
  return e2 === `true` || e2 === `True` || e2 === `TRUE`;
}
function le(e2) {
  return Object.prototype.toString.call(e2) === `[object Boolean]`;
}
function de(e2) {
  return 48 <= e2 && e2 <= 57 || 65 <= e2 && e2 <= 70 || 97 <= e2 && e2 <= 102;
}
function fe(e2) {
  return 48 <= e2 && e2 <= 55;
}
function pe(e2) {
  return 48 <= e2 && e2 <= 57;
}
function me(e2) {
  if (e2 === null) return false;
  var t2 = e2.length, n2 = 0, r2 = false, i3;
  if (!t2) return false;
  if (i3 = e2[n2], (i3 === `-` || i3 === `+`) && (i3 = e2[++n2]), i3 === `0`) {
    if (n2 + 1 === t2) return true;
    if (i3 = e2[++n2], i3 === `b`) {
      for (n2++; n2 < t2; n2++) if (i3 = e2[n2], i3 !== `_`) {
        if (i3 !== `0` && i3 !== `1`) return false;
        r2 = true;
      }
      return r2 && i3 !== `_`;
    }
    if (i3 === `x`) {
      for (n2++; n2 < t2; n2++) if (i3 = e2[n2], i3 !== `_`) {
        if (!de(e2.charCodeAt(n2))) return false;
        r2 = true;
      }
      return r2 && i3 !== `_`;
    }
    if (i3 === `o`) {
      for (n2++; n2 < t2; n2++) if (i3 = e2[n2], i3 !== `_`) {
        if (!fe(e2.charCodeAt(n2))) return false;
        r2 = true;
      }
      return r2 && i3 !== `_`;
    }
  }
  if (i3 === `_`) return false;
  for (; n2 < t2; n2++) if (i3 = e2[n2], i3 !== `_`) {
    if (!pe(e2.charCodeAt(n2))) return false;
    r2 = true;
  }
  return !(!r2 || i3 === `_`);
}
function he(e2) {
  var t2 = e2, n2 = 1, r2;
  if (t2.indexOf(`_`) !== -1 && (t2 = t2.replace(/_/g, ``)), r2 = t2[0], (r2 === `-` || r2 === `+`) && (r2 === `-` && (n2 = -1), t2 = t2.slice(1), r2 = t2[0]), t2 === `0`) return 0;
  if (r2 === `0`) {
    if (t2[1] === `b`) return n2 * parseInt(t2.slice(2), 2);
    if (t2[1] === `x`) return n2 * parseInt(t2.slice(2), 16);
    if (t2[1] === `o`) return n2 * parseInt(t2.slice(2), 8);
  }
  return n2 * parseInt(t2, 10);
}
function ge(e2) {
  return Object.prototype.toString.call(e2) === `[object Number]` && e2 % 1 == 0 && !o2.isNegativeZero(e2);
}
function ye(e2) {
  return !(e2 === null || !ve.test(e2) || e2[e2.length - 1] === `_`);
}
function be(e2) {
  var t2 = e2.replace(/_/g, ``).toLowerCase(), n2 = t2[0] === `-` ? -1 : 1;
  return `+-`.indexOf(t2[0]) >= 0 && (t2 = t2.slice(1)), t2 === `.inf` ? n2 === 1 ? 1 / 0 : -1 / 0 : t2 === `.nan` ? NaN : n2 * parseFloat(t2, 10);
}
function Se(e2, t2) {
  var n2;
  if (isNaN(e2)) switch (t2) {
    case `lowercase`:
      return `.nan`;
    case `uppercase`:
      return `.NAN`;
    case `camelcase`:
      return `.NaN`;
  }
  else if (e2 === 1 / 0) switch (t2) {
    case `lowercase`:
      return `.inf`;
    case `uppercase`:
      return `.INF`;
    case `camelcase`:
      return `.Inf`;
  }
  else if (e2 === -1 / 0) switch (t2) {
    case `lowercase`:
      return `-.inf`;
    case `uppercase`:
      return `-.INF`;
    case `camelcase`:
      return `-.Inf`;
  }
  else if (o2.isNegativeZero(e2)) return `-0.0`;
  return n2 = e2.toString(10), xe.test(n2) ? n2.replace(`e`, `.e`) : n2;
}
function Ce(e2) {
  return Object.prototype.toString.call(e2) === `[object Number]` && (e2 % 1 != 0 || o2.isNegativeZero(e2));
}
function Oe(e2) {
  return e2 === null ? false : Ee.exec(e2) !== null || De.exec(e2) !== null;
}
function ke(e2) {
  var t2, n2, r2, i3, a4, o3, s2, c2 = 0, l2 = null, u2, d2, f2;
  if (t2 = Ee.exec(e2), t2 === null && (t2 = De.exec(e2)), t2 === null) throw Error(`Date resolve error`);
  if (n2 = +t2[1], r2 = t2[2] - 1, i3 = +t2[3], !t2[4]) return new Date(Date.UTC(n2, r2, i3));
  if (a4 = +t2[4], o3 = +t2[5], s2 = +t2[6], t2[7]) {
    for (c2 = t2[7].slice(0, 3); c2.length < 3; ) c2 += `0`;
    c2 = +c2;
  }
  return t2[9] && (u2 = +t2[10], d2 = +(t2[11] || 0), l2 = (u2 * 60 + d2) * 6e4, t2[9] === `-` && (l2 = -l2)), f2 = new Date(Date.UTC(n2, r2, i3, a4, o3, s2, c2)), l2 && f2.setTime(f2.getTime() - l2), f2;
}
function Ae(e2) {
  return e2.toISOString();
}
function Me(e2) {
  return e2 === `<<` || e2 === null;
}
function Pe(e2) {
  if (e2 === null) return false;
  var t2, n2, r2 = 0, i3 = e2.length, a4 = b;
  for (n2 = 0; n2 < i3; n2++) if (t2 = a4.indexOf(e2.charAt(n2)), !(t2 > 64)) {
    if (t2 < 0) return false;
    r2 += 6;
  }
  return r2 % 8 == 0;
}
function Fe(e2) {
  var t2, n2, r2 = e2.replace(/[\r\n=]/g, ``), i3 = r2.length, a4 = b, o3 = 0, s2 = [];
  for (t2 = 0; t2 < i3; t2++) t2 % 4 == 0 && t2 && (s2.push(o3 >> 16 & 255), s2.push(o3 >> 8 & 255), s2.push(o3 & 255)), o3 = o3 << 6 | a4.indexOf(r2.charAt(t2));
  return n2 = i3 % 4 * 6, n2 === 0 ? (s2.push(o3 >> 16 & 255), s2.push(o3 >> 8 & 255), s2.push(o3 & 255)) : n2 === 18 ? (s2.push(o3 >> 10 & 255), s2.push(o3 >> 2 & 255)) : n2 === 12 && s2.push(o3 >> 4 & 255), new Uint8Array(s2);
}
function Ie(e2) {
  var t2 = ``, n2 = 0, r2, i3, a4 = e2.length, o3 = b;
  for (r2 = 0; r2 < a4; r2++) r2 % 3 == 0 && r2 && (t2 += o3[n2 >> 18 & 63], t2 += o3[n2 >> 12 & 63], t2 += o3[n2 >> 6 & 63], t2 += o3[n2 & 63]), n2 = (n2 << 8) + e2[r2];
  return i3 = a4 % 3, i3 === 0 ? (t2 += o3[n2 >> 18 & 63], t2 += o3[n2 >> 12 & 63], t2 += o3[n2 >> 6 & 63], t2 += o3[n2 & 63]) : i3 === 2 ? (t2 += o3[n2 >> 10 & 63], t2 += o3[n2 >> 4 & 63], t2 += o3[n2 << 2 & 63], t2 += o3[64]) : i3 === 1 && (t2 += o3[n2 >> 2 & 63], t2 += o3[n2 << 4 & 63], t2 += o3[64], t2 += o3[64]), t2;
}
function Le(e2) {
  return Object.prototype.toString.call(e2) === `[object Uint8Array]`;
}
function Ve(e2) {
  if (e2 === null) return true;
  var t2 = [], n2, r2, i3, a4, o3, s2 = e2;
  for (n2 = 0, r2 = s2.length; n2 < r2; n2 += 1) {
    if (i3 = s2[n2], o3 = false, Be.call(i3) !== `[object Object]`) return false;
    for (a4 in i3) if (ze.call(i3, a4)) if (!o3) o3 = true;
    else return false;
    if (!o3) return false;
    if (t2.indexOf(a4) === -1) t2.push(a4);
    else return false;
  }
  return true;
}
function He(e2) {
  return e2 === null ? [] : e2;
}
function Ge(e2) {
  if (e2 === null) return true;
  var t2, n2, r2, i3, a4, o3 = e2;
  for (a4 = Array(o3.length), t2 = 0, n2 = o3.length; t2 < n2; t2 += 1) {
    if (r2 = o3[t2], We.call(r2) !== `[object Object]` || (i3 = Object.keys(r2), i3.length !== 1)) return false;
    a4[t2] = [i3[0], r2[i3[0]]];
  }
  return true;
}
function Ke(e2) {
  if (e2 === null) return [];
  var t2, n2, r2, i3, a4, o3 = e2;
  for (a4 = Array(o3.length), t2 = 0, n2 = o3.length; t2 < n2; t2 += 1) r2 = o3[t2], i3 = Object.keys(r2), a4[t2] = [i3[0], r2[i3[0]]];
  return a4;
}
function Ye(e2) {
  if (e2 === null) return true;
  var t2, n2 = e2;
  for (t2 in n2) if (Je.call(n2, t2) && n2[t2] !== null) return false;
  return true;
}
function Xe(e2) {
  return e2 === null ? {} : e2;
}
function ct(e2) {
  return Object.prototype.toString.call(e2);
}
function T(e2) {
  return e2 === 10 || e2 === 13;
}
function E(e2) {
  return e2 === 9 || e2 === 32;
}
function D(e2) {
  return e2 === 9 || e2 === 32 || e2 === 10 || e2 === 13;
}
function O(e2) {
  return e2 === 44 || e2 === 91 || e2 === 93 || e2 === 123 || e2 === 125;
}
function lt(e2) {
  var t2;
  return 48 <= e2 && e2 <= 57 ? e2 - 48 : (t2 = e2 | 32, 97 <= t2 && t2 <= 102 ? t2 - 97 + 10 : -1);
}
function ut(e2) {
  return e2 === 120 ? 2 : e2 === 117 ? 4 : e2 === 85 ? 8 : 0;
}
function dt(e2) {
  return 48 <= e2 && e2 <= 57 ? e2 - 48 : -1;
}
function ft(e2) {
  return e2 === 48 ? `\0` : e2 === 97 ? `\x07` : e2 === 98 ? `\b` : e2 === 116 || e2 === 9 ? `	` : e2 === 110 ? `
` : e2 === 118 ? `\v` : e2 === 102 ? `\f` : e2 === 114 ? `\r` : e2 === 101 ? `\x1B` : e2 === 32 ? ` ` : e2 === 34 ? `"` : e2 === 47 ? `/` : e2 === 92 ? `\\` : e2 === 78 ? `` : e2 === 95 ? ` ` : e2 === 76 ? `\u2028` : e2 === 80 ? `\u2029` : ``;
}
function pt(e2) {
  return e2 <= 65535 ? String.fromCharCode(e2) : String.fromCharCode((e2 - 65536 >> 10) + 55296, (e2 - 65536 & 1023) + 56320);
}
function mt(e2, t2, n2) {
  t2 === `__proto__` ? Object.defineProperty(e2, t2, { configurable: true, enumerable: true, writable: true, value: n2 }) : e2[t2] = n2;
}
function _t(e2, t2) {
  this.input = e2, this.filename = t2.filename || null, this.schema = t2.schema || Qe, this.onWarning = t2.onWarning || null, this.legacy = t2.legacy || false, this.json = t2.json || false, this.listener = t2.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e2.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function vt(e2, t2) {
  var n2 = { name: e2.filename, buffer: e2.input.slice(0, -1), position: e2.position, line: e2.line, column: e2.position - e2.lineStart };
  return n2.snippet = p(n2), new l(t2, n2);
}
function A(e2, t2) {
  throw vt(e2, t2);
}
function j(e2, t2) {
  e2.onWarning && e2.onWarning.call(null, vt(e2, t2));
}
function M(e2, t2, n2, r2) {
  var i3, a4, o3, s2;
  if (t2 < n2) {
    if (s2 = e2.input.slice(t2, n2), r2) for (i3 = 0, a4 = s2.length; i3 < a4; i3 += 1) o3 = s2.charCodeAt(i3), o3 === 9 || 32 <= o3 && o3 <= 1114111 || A(e2, `expected valid JSON character`);
    else rt.test(s2) && A(e2, `the stream contains non-printable characters`);
    e2.result += s2;
  }
}
function bt(e2, t2, n2, r2) {
  var i3, a4, s2, c2;
  for (o2.isObject(n2) || A(e2, `cannot merge mappings; the provided source object is unacceptable`), i3 = Object.keys(n2), s2 = 0, c2 = i3.length; s2 < c2; s2 += 1) a4 = i3[s2], x.call(t2, a4) || (mt(t2, a4, n2[a4]), r2[a4] = true);
}
function N(e2, t2, n2, r2, i3, a4, o3, s2, c2) {
  var l2, u2;
  if (Array.isArray(i3)) for (i3 = Array.prototype.slice.call(i3), l2 = 0, u2 = i3.length; l2 < u2; l2 += 1) Array.isArray(i3[l2]) && A(e2, `nested arrays are not supported inside keys`), typeof i3 == `object` && ct(i3[l2]) === `[object Object]` && (i3[l2] = `[object Object]`);
  if (typeof i3 == `object` && ct(i3) === `[object Object]` && (i3 = `[object Object]`), i3 = String(i3), t2 === null && (t2 = {}), r2 === `tag:yaml.org,2002:merge`) if (Array.isArray(a4)) for (l2 = 0, u2 = a4.length; l2 < u2; l2 += 1) bt(e2, t2, a4[l2], n2);
  else bt(e2, t2, a4, n2);
  else !e2.json && !x.call(n2, i3) && x.call(t2, i3) && (e2.line = o3 || e2.line, e2.lineStart = s2 || e2.lineStart, e2.position = c2 || e2.position, A(e2, `duplicated mapping key`)), mt(t2, i3, a4), delete n2[i3];
  return t2;
}
function P(e2) {
  var t2 = e2.input.charCodeAt(e2.position);
  t2 === 10 ? e2.position++ : t2 === 13 ? (e2.position++, e2.input.charCodeAt(e2.position) === 10 && e2.position++) : A(e2, `a line break is expected`), e2.line += 1, e2.lineStart = e2.position, e2.firstTabInLine = -1;
}
function F(e2, t2, n2) {
  for (var r2 = 0, i3 = e2.input.charCodeAt(e2.position); i3 !== 0; ) {
    for (; E(i3); ) i3 === 9 && e2.firstTabInLine === -1 && (e2.firstTabInLine = e2.position), i3 = e2.input.charCodeAt(++e2.position);
    if (t2 && i3 === 35) do
      i3 = e2.input.charCodeAt(++e2.position);
    while (i3 !== 10 && i3 !== 13 && i3 !== 0);
    if (T(i3)) for (P(e2), i3 = e2.input.charCodeAt(e2.position), r2++, e2.lineIndent = 0; i3 === 32; ) e2.lineIndent++, i3 = e2.input.charCodeAt(++e2.position);
    else break;
  }
  return n2 !== -1 && r2 !== 0 && e2.lineIndent < n2 && j(e2, `deficient indentation`), r2;
}
function I(e2) {
  var t2 = e2.position, n2 = e2.input.charCodeAt(t2);
  return !!((n2 === 45 || n2 === 46) && n2 === e2.input.charCodeAt(t2 + 1) && n2 === e2.input.charCodeAt(t2 + 2) && (t2 += 3, n2 = e2.input.charCodeAt(t2), n2 === 0 || D(n2)));
}
function L(e2, t2) {
  t2 === 1 ? e2.result += ` ` : t2 > 1 && (e2.result += o2.repeat(`
`, t2 - 1));
}
function xt(e2, t2, n2) {
  var r2, i3, a4, o3, s2, c2, l2, u2, d2 = e2.kind, f2 = e2.result, p2 = e2.input.charCodeAt(e2.position);
  if (D(p2) || O(p2) || p2 === 35 || p2 === 38 || p2 === 42 || p2 === 33 || p2 === 124 || p2 === 62 || p2 === 39 || p2 === 34 || p2 === 37 || p2 === 64 || p2 === 96 || (p2 === 63 || p2 === 45) && (i3 = e2.input.charCodeAt(e2.position + 1), D(i3) || n2 && O(i3))) return false;
  for (e2.kind = `scalar`, e2.result = ``, a4 = o3 = e2.position, s2 = false; p2 !== 0; ) {
    if (p2 === 58) {
      if (i3 = e2.input.charCodeAt(e2.position + 1), D(i3) || n2 && O(i3)) break;
    } else if (p2 === 35) {
      if (r2 = e2.input.charCodeAt(e2.position - 1), D(r2)) break;
    } else if (e2.position === e2.lineStart && I(e2) || n2 && O(p2)) break;
    else if (T(p2)) if (c2 = e2.line, l2 = e2.lineStart, u2 = e2.lineIndent, F(e2, false, -1), e2.lineIndent >= t2) {
      s2 = true, p2 = e2.input.charCodeAt(e2.position);
      continue;
    } else {
      e2.position = o3, e2.line = c2, e2.lineStart = l2, e2.lineIndent = u2;
      break;
    }
    s2 &&= (M(e2, a4, o3, false), L(e2, e2.line - c2), a4 = o3 = e2.position, false), E(p2) || (o3 = e2.position + 1), p2 = e2.input.charCodeAt(++e2.position);
  }
  return M(e2, a4, o3, false), e2.result ? true : (e2.kind = d2, e2.result = f2, false);
}
function St(e2, t2) {
  var n2 = e2.input.charCodeAt(e2.position), r2, i3;
  if (n2 !== 39) return false;
  for (e2.kind = `scalar`, e2.result = ``, e2.position++, r2 = i3 = e2.position; (n2 = e2.input.charCodeAt(e2.position)) !== 0; ) if (n2 === 39) if (M(e2, r2, e2.position, true), n2 = e2.input.charCodeAt(++e2.position), n2 === 39) r2 = e2.position, e2.position++, i3 = e2.position;
  else return true;
  else T(n2) ? (M(e2, r2, i3, true), L(e2, F(e2, false, t2)), r2 = i3 = e2.position) : e2.position === e2.lineStart && I(e2) ? A(e2, `unexpected end of the document within a single quoted scalar`) : (e2.position++, i3 = e2.position);
  A(e2, `unexpected end of the stream within a single quoted scalar`);
}
function Ct(e2, t2) {
  var n2, r2, i3, a4, o3, s2 = e2.input.charCodeAt(e2.position);
  if (s2 !== 34) return false;
  for (e2.kind = `scalar`, e2.result = ``, e2.position++, n2 = r2 = e2.position; (s2 = e2.input.charCodeAt(e2.position)) !== 0; ) if (s2 === 34) return M(e2, n2, e2.position, true), e2.position++, true;
  else if (s2 === 92) {
    if (M(e2, n2, e2.position, true), s2 = e2.input.charCodeAt(++e2.position), T(s2)) F(e2, false, t2);
    else if (s2 < 256 && ht[s2]) e2.result += gt[s2], e2.position++;
    else if ((o3 = ut(s2)) > 0) {
      for (i3 = o3, a4 = 0; i3 > 0; i3--) s2 = e2.input.charCodeAt(++e2.position), (o3 = lt(s2)) >= 0 ? a4 = (a4 << 4) + o3 : A(e2, `expected hexadecimal character`);
      e2.result += pt(a4), e2.position++;
    } else A(e2, `unknown escape sequence`);
    n2 = r2 = e2.position;
  } else T(s2) ? (M(e2, n2, r2, true), L(e2, F(e2, false, t2)), n2 = r2 = e2.position) : e2.position === e2.lineStart && I(e2) ? A(e2, `unexpected end of the document within a double quoted scalar`) : (e2.position++, r2 = e2.position);
  A(e2, `unexpected end of the stream within a double quoted scalar`);
}
function wt(e2, t2) {
  var n2 = true, r2, i3, a4, o3 = e2.tag, s2, c2 = e2.anchor, l2, u2, d2, f2, p2, m2 = /* @__PURE__ */ Object.create(null), h2, g2, _2, v2 = e2.input.charCodeAt(e2.position);
  if (v2 === 91) u2 = 93, p2 = false, s2 = [];
  else if (v2 === 123) u2 = 125, p2 = true, s2 = {};
  else return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = s2), v2 = e2.input.charCodeAt(++e2.position); v2 !== 0; ) {
    if (F(e2, true, t2), v2 = e2.input.charCodeAt(e2.position), v2 === u2) return e2.position++, e2.tag = o3, e2.anchor = c2, e2.kind = p2 ? `mapping` : `sequence`, e2.result = s2, true;
    n2 ? v2 === 44 && A(e2, `expected the node content, but found ','`) : A(e2, `missed comma between flow collection entries`), g2 = h2 = _2 = null, d2 = f2 = false, v2 === 63 && (l2 = e2.input.charCodeAt(e2.position + 1), D(l2) && (d2 = f2 = true, e2.position++, F(e2, true, t2))), r2 = e2.line, i3 = e2.lineStart, a4 = e2.position, R(e2, t2, S, false, true), g2 = e2.tag, h2 = e2.result, F(e2, true, t2), v2 = e2.input.charCodeAt(e2.position), (f2 || e2.line === r2) && v2 === 58 && (d2 = true, v2 = e2.input.charCodeAt(++e2.position), F(e2, true, t2), R(e2, t2, S, false, true), _2 = e2.result), p2 ? N(e2, s2, m2, g2, h2, _2, r2, i3, a4) : d2 ? s2.push(N(e2, null, m2, g2, h2, _2, r2, i3, a4)) : s2.push(h2), F(e2, true, t2), v2 = e2.input.charCodeAt(e2.position), v2 === 44 ? (n2 = true, v2 = e2.input.charCodeAt(++e2.position)) : n2 = false;
  }
  A(e2, `unexpected end of the stream within a flow collection`);
}
function Tt(e2, t2) {
  var n2, r2, i3 = w, a4 = false, s2 = false, c2 = t2, l2 = 0, u2 = false, d2, f2 = e2.input.charCodeAt(e2.position);
  if (f2 === 124) r2 = false;
  else if (f2 === 62) r2 = true;
  else return false;
  for (e2.kind = `scalar`, e2.result = ``; f2 !== 0; ) if (f2 = e2.input.charCodeAt(++e2.position), f2 === 43 || f2 === 45) w === i3 ? i3 = f2 === 43 ? nt : tt : A(e2, `repeat of a chomping mode identifier`);
  else if ((d2 = dt(f2)) >= 0) d2 === 0 ? A(e2, `bad explicit indentation width of a block scalar; it cannot be less than one`) : s2 ? A(e2, `repeat of an indentation width identifier`) : (c2 = t2 + d2 - 1, s2 = true);
  else break;
  if (E(f2)) {
    do
      f2 = e2.input.charCodeAt(++e2.position);
    while (E(f2));
    if (f2 === 35) do
      f2 = e2.input.charCodeAt(++e2.position);
    while (!T(f2) && f2 !== 0);
  }
  for (; f2 !== 0; ) {
    for (P(e2), e2.lineIndent = 0, f2 = e2.input.charCodeAt(e2.position); (!s2 || e2.lineIndent < c2) && f2 === 32; ) e2.lineIndent++, f2 = e2.input.charCodeAt(++e2.position);
    if (!s2 && e2.lineIndent > c2 && (c2 = e2.lineIndent), T(f2)) {
      l2++;
      continue;
    }
    if (e2.lineIndent < c2) {
      i3 === nt ? e2.result += o2.repeat(`
`, a4 ? 1 + l2 : l2) : i3 === w && a4 && (e2.result += `
`);
      break;
    }
    for (r2 ? E(f2) ? (u2 = true, e2.result += o2.repeat(`
`, a4 ? 1 + l2 : l2)) : u2 ? (u2 = false, e2.result += o2.repeat(`
`, l2 + 1)) : l2 === 0 ? a4 && (e2.result += ` `) : e2.result += o2.repeat(`
`, l2) : e2.result += o2.repeat(`
`, a4 ? 1 + l2 : l2), a4 = true, s2 = true, l2 = 0, n2 = e2.position; !T(f2) && f2 !== 0; ) f2 = e2.input.charCodeAt(++e2.position);
    M(e2, n2, e2.position, false);
  }
  return true;
}
function Et(e2, t2) {
  var n2, r2 = e2.tag, i3 = e2.anchor, a4 = [], o3, s2 = false, c2;
  if (e2.firstTabInLine !== -1) return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = a4), c2 = e2.input.charCodeAt(e2.position); c2 !== 0 && (e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, A(e2, `tab characters must not be used in indentation`)), !(c2 !== 45 || (o3 = e2.input.charCodeAt(e2.position + 1), !D(o3)))); ) {
    if (s2 = true, e2.position++, F(e2, true, -1) && e2.lineIndent <= t2) {
      a4.push(null), c2 = e2.input.charCodeAt(e2.position);
      continue;
    }
    if (n2 = e2.line, R(e2, t2, et, false, true), a4.push(e2.result), F(e2, true, -1), c2 = e2.input.charCodeAt(e2.position), (e2.line === n2 || e2.lineIndent > t2) && c2 !== 0) A(e2, `bad indentation of a sequence entry`);
    else if (e2.lineIndent < t2) break;
  }
  return s2 ? (e2.tag = r2, e2.anchor = i3, e2.kind = `sequence`, e2.result = a4, true) : false;
}
function Dt(e2, t2, n2) {
  var r2, i3, a4, o3, s2, c2, l2 = e2.tag, u2 = e2.anchor, d2 = {}, f2 = /* @__PURE__ */ Object.create(null), p2 = null, m2 = null, h2 = null, g2 = false, _2 = false, v2;
  if (e2.firstTabInLine !== -1) return false;
  for (e2.anchor !== null && (e2.anchorMap[e2.anchor] = d2), v2 = e2.input.charCodeAt(e2.position); v2 !== 0; ) {
    if (!g2 && e2.firstTabInLine !== -1 && (e2.position = e2.firstTabInLine, A(e2, `tab characters must not be used in indentation`)), r2 = e2.input.charCodeAt(e2.position + 1), a4 = e2.line, (v2 === 63 || v2 === 58) && D(r2)) v2 === 63 ? (g2 && (N(e2, d2, f2, p2, m2, null, o3, s2, c2), p2 = m2 = h2 = null), _2 = true, g2 = true, i3 = true) : g2 ? (g2 = false, i3 = true) : A(e2, `incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line`), e2.position += 1, v2 = r2;
    else {
      if (o3 = e2.line, s2 = e2.lineStart, c2 = e2.position, !R(e2, n2, $e, false, true)) break;
      if (e2.line === a4) {
        for (v2 = e2.input.charCodeAt(e2.position); E(v2); ) v2 = e2.input.charCodeAt(++e2.position);
        if (v2 === 58) v2 = e2.input.charCodeAt(++e2.position), D(v2) || A(e2, `a whitespace character is expected after the key-value separator within a block mapping`), g2 && (N(e2, d2, f2, p2, m2, null, o3, s2, c2), p2 = m2 = h2 = null), _2 = true, g2 = false, i3 = false, p2 = e2.tag, m2 = e2.result;
        else if (_2) A(e2, `can not read an implicit mapping pair; a colon is missed`);
        else return e2.tag = l2, e2.anchor = u2, true;
      } else if (_2) A(e2, `can not read a block mapping entry; a multiline key may not be an implicit key`);
      else return e2.tag = l2, e2.anchor = u2, true;
    }
    if ((e2.line === a4 || e2.lineIndent > t2) && (g2 && (o3 = e2.line, s2 = e2.lineStart, c2 = e2.position), R(e2, t2, C, true, i3) && (g2 ? m2 = e2.result : h2 = e2.result), g2 || (N(e2, d2, f2, p2, m2, h2, o3, s2, c2), p2 = m2 = h2 = null), F(e2, true, -1), v2 = e2.input.charCodeAt(e2.position)), (e2.line === a4 || e2.lineIndent > t2) && v2 !== 0) A(e2, `bad indentation of a mapping entry`);
    else if (e2.lineIndent < t2) break;
  }
  return g2 && N(e2, d2, f2, p2, m2, null, o3, s2, c2), _2 && (e2.tag = l2, e2.anchor = u2, e2.kind = `mapping`, e2.result = d2), _2;
}
function Ot(e2) {
  var t2, n2 = false, r2 = false, i3, a4, o3 = e2.input.charCodeAt(e2.position);
  if (o3 !== 33) return false;
  if (e2.tag !== null && A(e2, `duplication of a tag property`), o3 = e2.input.charCodeAt(++e2.position), o3 === 60 ? (n2 = true, o3 = e2.input.charCodeAt(++e2.position)) : o3 === 33 ? (r2 = true, i3 = `!!`, o3 = e2.input.charCodeAt(++e2.position)) : i3 = `!`, t2 = e2.position, n2) {
    do
      o3 = e2.input.charCodeAt(++e2.position);
    while (o3 !== 0 && o3 !== 62);
    e2.position < e2.length ? (a4 = e2.input.slice(t2, e2.position), o3 = e2.input.charCodeAt(++e2.position)) : A(e2, `unexpected end of the stream within a verbatim tag`);
  } else {
    for (; o3 !== 0 && !D(o3); ) o3 === 33 && (r2 ? A(e2, `tag suffix cannot contain exclamation marks`) : (i3 = e2.input.slice(t2 - 1, e2.position + 1), ot.test(i3) || A(e2, `named tag handle cannot contain such characters`), r2 = true, t2 = e2.position + 1)), o3 = e2.input.charCodeAt(++e2.position);
    a4 = e2.input.slice(t2, e2.position), at.test(a4) && A(e2, `tag suffix cannot contain flow indicator characters`);
  }
  a4 && !st.test(a4) && A(e2, `tag name cannot contain such characters: ` + a4);
  try {
    a4 = decodeURIComponent(a4);
  } catch {
    A(e2, `tag name is malformed: ` + a4);
  }
  return n2 ? e2.tag = a4 : x.call(e2.tagMap, i3) ? e2.tag = e2.tagMap[i3] + a4 : i3 === `!` ? e2.tag = `!` + a4 : i3 === `!!` ? e2.tag = `tag:yaml.org,2002:` + a4 : A(e2, `undeclared tag handle "` + i3 + `"`), true;
}
function kt(e2) {
  var t2, n2 = e2.input.charCodeAt(e2.position);
  if (n2 !== 38) return false;
  for (e2.anchor !== null && A(e2, `duplication of an anchor property`), n2 = e2.input.charCodeAt(++e2.position), t2 = e2.position; n2 !== 0 && !D(n2) && !O(n2); ) n2 = e2.input.charCodeAt(++e2.position);
  return e2.position === t2 && A(e2, `name of an anchor node must contain at least one character`), e2.anchor = e2.input.slice(t2, e2.position), true;
}
function At(e2) {
  var t2, n2, r2 = e2.input.charCodeAt(e2.position);
  if (r2 !== 42) return false;
  for (r2 = e2.input.charCodeAt(++e2.position), t2 = e2.position; r2 !== 0 && !D(r2) && !O(r2); ) r2 = e2.input.charCodeAt(++e2.position);
  return e2.position === t2 && A(e2, `name of an alias node must contain at least one character`), n2 = e2.input.slice(t2, e2.position), x.call(e2.anchorMap, n2) || A(e2, `unidentified alias "` + n2 + `"`), e2.result = e2.anchorMap[n2], F(e2, true, -1), true;
}
function R(e2, t2, n2, r2, i3) {
  var a4, o3, s2, c2 = 1, l2 = false, u2 = false, d2, f2, p2, m2, h2, g2;
  if (e2.listener !== null && e2.listener(`open`, e2), e2.tag = null, e2.anchor = null, e2.kind = null, e2.result = null, a4 = o3 = s2 = C === n2 || et === n2, r2 && F(e2, true, -1) && (l2 = true, e2.lineIndent > t2 ? c2 = 1 : e2.lineIndent === t2 ? c2 = 0 : e2.lineIndent < t2 && (c2 = -1)), c2 === 1) for (; Ot(e2) || kt(e2); ) F(e2, true, -1) ? (l2 = true, s2 = a4, e2.lineIndent > t2 ? c2 = 1 : e2.lineIndent === t2 ? c2 = 0 : e2.lineIndent < t2 && (c2 = -1)) : s2 = false;
  if (s2 &&= l2 || i3, (c2 === 1 || C === n2) && (h2 = S === n2 || $e === n2 ? t2 : t2 + 1, g2 = e2.position - e2.lineStart, c2 === 1 ? s2 && (Et(e2, g2) || Dt(e2, g2, h2)) || wt(e2, h2) ? u2 = true : (o3 && Tt(e2, h2) || St(e2, h2) || Ct(e2, h2) ? u2 = true : At(e2) ? (u2 = true, (e2.tag !== null || e2.anchor !== null) && A(e2, `alias node should not have any properties`)) : xt(e2, h2, S === n2) && (u2 = true, e2.tag === null && (e2.tag = `?`)), e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result)) : c2 === 0 && (u2 = s2 && Et(e2, g2))), e2.tag === null) e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result);
  else if (e2.tag === `?`) {
    for (e2.result !== null && e2.kind !== `scalar` && A(e2, `unacceptable node kind for !<?> tag; it should be "scalar", not "` + e2.kind + `"`), d2 = 0, f2 = e2.implicitTypes.length; d2 < f2; d2 += 1) if (m2 = e2.implicitTypes[d2], m2.resolve(e2.result)) {
      e2.result = m2.construct(e2.result), e2.tag = m2.tag, e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result);
      break;
    }
  } else if (e2.tag !== `!`) {
    if (x.call(e2.typeMap[e2.kind || `fallback`], e2.tag)) m2 = e2.typeMap[e2.kind || `fallback`][e2.tag];
    else for (m2 = null, p2 = e2.typeMap.multi[e2.kind || `fallback`], d2 = 0, f2 = p2.length; d2 < f2; d2 += 1) if (e2.tag.slice(0, p2[d2].tag.length) === p2[d2].tag) {
      m2 = p2[d2];
      break;
    }
    m2 || A(e2, `unknown tag !<` + e2.tag + `>`), e2.result !== null && m2.kind !== e2.kind && A(e2, `unacceptable node kind for !<` + e2.tag + `> tag; it should be "` + m2.kind + `", not "` + e2.kind + `"`), m2.resolve(e2.result, e2.tag) ? (e2.result = m2.construct(e2.result, e2.tag), e2.anchor !== null && (e2.anchorMap[e2.anchor] = e2.result)) : A(e2, `cannot resolve a node with !<` + e2.tag + `> explicit tag`);
  }
  return e2.listener !== null && e2.listener(`close`, e2), e2.tag !== null || e2.anchor !== null || u2;
}
function jt(e2) {
  var t2 = e2.position, n2, r2, i3, a4 = false, o3;
  for (e2.version = null, e2.checkLineBreaks = e2.legacy, e2.tagMap = /* @__PURE__ */ Object.create(null), e2.anchorMap = /* @__PURE__ */ Object.create(null); (o3 = e2.input.charCodeAt(e2.position)) !== 0 && (F(e2, true, -1), o3 = e2.input.charCodeAt(e2.position), !(e2.lineIndent > 0 || o3 !== 37)); ) {
    for (a4 = true, o3 = e2.input.charCodeAt(++e2.position), n2 = e2.position; o3 !== 0 && !D(o3); ) o3 = e2.input.charCodeAt(++e2.position);
    for (r2 = e2.input.slice(n2, e2.position), i3 = [], r2.length < 1 && A(e2, `directive name must not be less than one character in length`); o3 !== 0; ) {
      for (; E(o3); ) o3 = e2.input.charCodeAt(++e2.position);
      if (o3 === 35) {
        do
          o3 = e2.input.charCodeAt(++e2.position);
        while (o3 !== 0 && !T(o3));
        break;
      }
      if (T(o3)) break;
      for (n2 = e2.position; o3 !== 0 && !D(o3); ) o3 = e2.input.charCodeAt(++e2.position);
      i3.push(e2.input.slice(n2, e2.position));
    }
    o3 !== 0 && P(e2), x.call(yt, r2) ? yt[r2](e2, r2, i3) : j(e2, `unknown document directive "` + r2 + `"`);
  }
  if (F(e2, true, -1), e2.lineIndent === 0 && e2.input.charCodeAt(e2.position) === 45 && e2.input.charCodeAt(e2.position + 1) === 45 && e2.input.charCodeAt(e2.position + 2) === 45 ? (e2.position += 3, F(e2, true, -1)) : a4 && A(e2, `directives end mark is expected`), R(e2, e2.lineIndent - 1, C, false, true), F(e2, true, -1), e2.checkLineBreaks && it.test(e2.input.slice(t2, e2.position)) && j(e2, `non-ASCII line breaks are interpreted as content`), e2.documents.push(e2.result), e2.position === e2.lineStart && I(e2)) {
    e2.input.charCodeAt(e2.position) === 46 && (e2.position += 3, F(e2, true, -1));
    return;
  }
  if (e2.position < e2.length - 1) A(e2, `end of the stream or a document separator is expected`);
  else return;
}
function Mt(e2, t2) {
  e2 = String(e2), t2 ||= {}, e2.length !== 0 && (e2.charCodeAt(e2.length - 1) !== 10 && e2.charCodeAt(e2.length - 1) !== 13 && (e2 += `
`), e2.charCodeAt(0) === 65279 && (e2 = e2.slice(1)));
  var n2 = new _t(e2, t2), r2 = e2.indexOf(`\0`);
  for (r2 !== -1 && (n2.position = r2, A(n2, `null byte is not allowed in input`)), n2.input += `\0`; n2.input.charCodeAt(n2.position) === 32; ) n2.lineIndent += 1, n2.position += 1;
  for (; n2.position < n2.length - 1; ) jt(n2);
  return n2.documents;
}
function Nt(e2, t2, n2) {
  typeof t2 == `object` && t2 && n2 === void 0 && (n2 = t2, t2 = null);
  var r2 = Mt(e2, n2);
  if (typeof t2 != `function`) return r2;
  for (var i3 = 0, a4 = r2.length; i3 < a4; i3 += 1) t2(r2[i3]);
}
function Pt(e2, t2) {
  var n2 = Mt(e2, t2);
  if (n2.length !== 0) {
    if (n2.length === 1) return n2[0];
    throw new l(`expected a single document in the stream, but found more`);
  }
}
function cn(e2, t2) {
  var n2, r2, i3, a4, o3, s2, c2;
  if (t2 === null) return {};
  for (n2 = {}, r2 = Object.keys(t2), i3 = 0, a4 = r2.length; i3 < a4; i3 += 1) o3 = r2[i3], s2 = String(t2[o3]), o3.slice(0, 2) === `!!` && (o3 = `tag:yaml.org,2002:` + o3.slice(2)), c2 = e2.compiledTypeMap.fallback[o3], c2 && Lt.call(c2.styleAliases, s2) && (s2 = c2.styleAliases[s2]), n2[o3] = s2;
  return n2;
}
function ln(e2) {
  var t2 = e2.toString(16).toUpperCase(), n2, r2;
  if (e2 <= 255) n2 = `x`, r2 = 2;
  else if (e2 <= 65535) n2 = `u`, r2 = 4;
  else if (e2 <= 4294967295) n2 = `U`, r2 = 8;
  else throw new l(`code point within a string may not be greater than 0xFFFFFFFF`);
  return `\\` + n2 + o2.repeat(`0`, r2 - t2.length) + t2;
}
function dn(e2) {
  this.schema = e2.schema || Qe, this.indent = Math.max(1, e2.indent || 2), this.noArrayIndent = e2.noArrayIndent || false, this.skipInvalid = e2.skipInvalid || false, this.flowLevel = o2.isNothing(e2.flowLevel) ? -1 : e2.flowLevel, this.styleMap = cn(this.schema, e2.styles || null), this.sortKeys = e2.sortKeys || false, this.lineWidth = e2.lineWidth || 80, this.noRefs = e2.noRefs || false, this.noCompatMode = e2.noCompatMode || false, this.condenseFlow = e2.condenseFlow || false, this.quotingType = e2.quotingType === `"` ? W : un, this.forceQuotes = e2.forceQuotes || false, this.replacer = typeof e2.replacer == `function` ? e2.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = ``, this.duplicates = [], this.usedDuplicates = null;
}
function fn(e2, t2) {
  for (var n2 = o2.repeat(` `, t2), r2 = 0, i3 = -1, a4 = ``, s2, c2 = e2.length; r2 < c2; ) i3 = e2.indexOf(`
`, r2), i3 === -1 ? (s2 = e2.slice(r2), r2 = c2) : (s2 = e2.slice(r2, i3 + 1), r2 = i3 + 1), s2.length && s2 !== `
` && (a4 += n2), a4 += s2;
  return a4;
}
function G(e2, t2) {
  return `
` + o2.repeat(` `, e2.indent * t2);
}
function pn(e2, t2) {
  var n2, r2, i3;
  for (n2 = 0, r2 = e2.implicitTypes.length; n2 < r2; n2 += 1) if (i3 = e2.implicitTypes[n2], i3.resolve(t2)) return true;
  return false;
}
function K(e2) {
  return e2 === Bt || e2 === Rt;
}
function q(e2) {
  return 32 <= e2 && e2 <= 126 || 161 <= e2 && e2 <= 55295 && e2 !== 8232 && e2 !== 8233 || 57344 <= e2 && e2 <= 65533 && e2 !== z || 65536 <= e2 && e2 <= 1114111;
}
function mn(e2) {
  return q(e2) && e2 !== z && e2 !== zt && e2 !== B;
}
function hn(e2, t2, n2) {
  var r2 = mn(e2), i3 = r2 && !K(e2);
  return (n2 ? r2 : r2 && e2 !== qt && e2 !== $t && e2 !== en && e2 !== nn && e2 !== an) && e2 !== V && !(t2 === H && !i3) || mn(t2) && !K(t2) && e2 === V || t2 === H && i3;
}
function gn(e2) {
  return q(e2) && e2 !== z && !K(e2) && e2 !== Jt && e2 !== Zt && e2 !== H && e2 !== qt && e2 !== $t && e2 !== en && e2 !== nn && e2 !== an && e2 !== V && e2 !== Wt && e2 !== Kt && e2 !== Vt && e2 !== rn && e2 !== Yt && e2 !== Xt && e2 !== Gt && e2 !== Ht && e2 !== Ut && e2 !== Qt && e2 !== tn;
}
function _n(e2) {
  return !K(e2) && e2 !== H;
}
function J(e2, t2) {
  var n2 = e2.charCodeAt(t2), r2;
  return n2 >= 55296 && n2 <= 56319 && t2 + 1 < e2.length && (r2 = e2.charCodeAt(t2 + 1), r2 >= 56320 && r2 <= 57343) ? (n2 - 55296) * 1024 + r2 - 56320 + 65536 : n2;
}
function vn(e2) {
  return /^\n* /.test(e2);
}
function Sn(e2, t2, n2, r2, i3, a4, o3, s2) {
  var c2, l2 = 0, u2 = null, d2 = false, f2 = false, p2 = r2 !== -1, m2 = -1, h2 = gn(J(e2, 0)) && _n(J(e2, e2.length - 1));
  if (t2 || o3) for (c2 = 0; c2 < e2.length; l2 >= 65536 ? c2 += 2 : c2++) {
    if (l2 = J(e2, c2), !q(l2)) return X;
    h2 &&= hn(l2, u2, s2), u2 = l2;
  }
  else {
    for (c2 = 0; c2 < e2.length; l2 >= 65536 ? c2 += 2 : c2++) {
      if (l2 = J(e2, c2), l2 === B) d2 = true, p2 && (f2 ||= c2 - m2 - 1 > r2 && e2[m2 + 1] !== ` `, m2 = c2);
      else if (!q(l2)) return X;
      h2 &&= hn(l2, u2, s2), u2 = l2;
    }
    f2 ||= p2 && c2 - m2 - 1 > r2 && e2[m2 + 1] !== ` `;
  }
  return !d2 && !f2 ? h2 && !o3 && !i3(e2) ? yn : a4 === W ? X : Y : n2 > 9 && vn(e2) ? X : o3 ? a4 === W ? X : Y : f2 ? xn : bn;
}
function Cn(e2, t2, n2, r2, i3) {
  e2.dump = function() {
    if (t2.length === 0) return e2.quotingType === W ? `""` : `''`;
    if (!e2.noCompatMode && (on.indexOf(t2) !== -1 || sn.test(t2))) return e2.quotingType === W ? `"` + t2 + `"` : `'` + t2 + `'`;
    var a4 = e2.indent * Math.max(1, n2), o3 = e2.lineWidth === -1 ? -1 : Math.max(Math.min(e2.lineWidth, 40), e2.lineWidth - a4), s2 = r2 || e2.flowLevel > -1 && n2 >= e2.flowLevel;
    function c2(t3) {
      return pn(e2, t3);
    }
    __name(c2, "c");
    switch (Sn(t2, s2, e2.indent, o3, c2, e2.quotingType, e2.forceQuotes && !r2, i3)) {
      case yn:
        return t2;
      case Y:
        return `'` + t2.replace(/'/g, `''`) + `'`;
      case bn:
        return `|` + wn(t2, e2.indent) + Tn(fn(t2, a4));
      case xn:
        return `>` + wn(t2, e2.indent) + Tn(fn(En(t2, o3), a4));
      case X:
        return `"` + Dn(t2) + `"`;
      default:
        throw new l(`impossible error: invalid scalar style`);
    }
  }();
}
function wn(e2, t2) {
  var n2 = vn(e2) ? String(t2) : ``, r2 = e2[e2.length - 1] === `
`;
  return n2 + (r2 && (e2[e2.length - 2] === `
` || e2 === `
`) ? `+` : r2 ? `` : `-`) + `
`;
}
function Tn(e2) {
  return e2[e2.length - 1] === `
` ? e2.slice(0, -1) : e2;
}
function En(e2, t2) {
  for (var n2 = /(\n+)([^\n]*)/g, r2 = function() {
    var r3 = e2.indexOf(`
`);
    return r3 = r3 === -1 ? e2.length : r3, n2.lastIndex = r3, Z(e2.slice(0, r3), t2);
  }(), i3 = e2[0] === `
` || e2[0] === ` `, a4, o3; o3 = n2.exec(e2); ) {
    var s2 = o3[1], c2 = o3[2];
    a4 = c2[0] === ` `, r2 += s2 + (!i3 && !a4 && c2 !== `` ? `
` : ``) + Z(c2, t2), i3 = a4;
  }
  return r2;
}
function Z(e2, t2) {
  if (e2 === `` || e2[0] === ` `) return e2;
  for (var n2 = / [^ ]/g, r2, i3 = 0, a4, o3 = 0, s2 = 0, c2 = ``; r2 = n2.exec(e2); ) s2 = r2.index, s2 - i3 > t2 && (a4 = o3 > i3 ? o3 : s2, c2 += `
` + e2.slice(i3, a4), i3 = a4 + 1), o3 = s2;
  return c2 += `
`, e2.length - i3 > t2 && o3 > i3 ? c2 += e2.slice(i3, o3) + `
` + e2.slice(o3 + 1) : c2 += e2.slice(i3), c2.slice(1);
}
function Dn(e2) {
  for (var t2 = ``, n2 = 0, r2, i3 = 0; i3 < e2.length; n2 >= 65536 ? i3 += 2 : i3++) n2 = J(e2, i3), r2 = U[n2], !r2 && q(n2) ? (t2 += e2[i3], n2 >= 65536 && (t2 += e2[i3 + 1])) : t2 += r2 || ln(n2);
  return t2;
}
function On(e2, t2, n2) {
  var r2 = ``, i3 = e2.tag, a4, o3, s2;
  for (a4 = 0, o3 = n2.length; a4 < o3; a4 += 1) s2 = n2[a4], e2.replacer && (s2 = e2.replacer.call(n2, String(a4), s2)), (Q(e2, t2, s2, false, false) || s2 === void 0 && Q(e2, t2, null, false, false)) && (r2 !== `` && (r2 += `,` + (e2.condenseFlow ? `` : ` `)), r2 += e2.dump);
  e2.tag = i3, e2.dump = `[` + r2 + `]`;
}
function kn(e2, t2, n2, r2) {
  var i3 = ``, a4 = e2.tag, o3, s2, c2;
  for (o3 = 0, s2 = n2.length; o3 < s2; o3 += 1) c2 = n2[o3], e2.replacer && (c2 = e2.replacer.call(n2, String(o3), c2)), (Q(e2, t2 + 1, c2, true, true, false, true) || c2 === void 0 && Q(e2, t2 + 1, null, true, true, false, true)) && ((!r2 || i3 !== ``) && (i3 += G(e2, t2)), e2.dump && B === e2.dump.charCodeAt(0) ? i3 += `-` : i3 += `- `, i3 += e2.dump);
  e2.tag = a4, e2.dump = i3 || `[]`;
}
function An(e2, t2, n2) {
  var r2 = ``, i3 = e2.tag, a4 = Object.keys(n2), o3, s2, c2, l2, u2;
  for (o3 = 0, s2 = a4.length; o3 < s2; o3 += 1) u2 = ``, r2 !== `` && (u2 += `, `), e2.condenseFlow && (u2 += `"`), c2 = a4[o3], l2 = n2[c2], e2.replacer && (l2 = e2.replacer.call(n2, c2, l2)), Q(e2, t2, c2, false, false) && (e2.dump.length > 1024 && (u2 += `? `), u2 += e2.dump + (e2.condenseFlow ? `"` : ``) + `:` + (e2.condenseFlow ? `` : ` `), Q(e2, t2, l2, false, false) && (u2 += e2.dump, r2 += u2));
  e2.tag = i3, e2.dump = `{` + r2 + `}`;
}
function jn(e2, t2, n2, r2) {
  var i3 = ``, a4 = e2.tag, o3 = Object.keys(n2), s2, c2, u2, d2, f2, p2;
  if (e2.sortKeys === true) o3.sort();
  else if (typeof e2.sortKeys == `function`) o3.sort(e2.sortKeys);
  else if (e2.sortKeys) throw new l(`sortKeys must be a boolean or a function`);
  for (s2 = 0, c2 = o3.length; s2 < c2; s2 += 1) p2 = ``, (!r2 || i3 !== ``) && (p2 += G(e2, t2)), u2 = o3[s2], d2 = n2[u2], e2.replacer && (d2 = e2.replacer.call(n2, u2, d2)), Q(e2, t2 + 1, u2, true, true, true) && (f2 = e2.tag !== null && e2.tag !== `?` || e2.dump && e2.dump.length > 1024, f2 && (e2.dump && B === e2.dump.charCodeAt(0) ? p2 += `?` : p2 += `? `), p2 += e2.dump, f2 && (p2 += G(e2, t2)), Q(e2, t2 + 1, d2, true, f2) && (e2.dump && B === e2.dump.charCodeAt(0) ? p2 += `:` : p2 += `: `, p2 += e2.dump, i3 += p2));
  e2.tag = a4, e2.dump = i3 || `{}`;
}
function Mn(e2, t2, n2) {
  var r2, i3 = n2 ? e2.explicitTypes : e2.implicitTypes, a4, o3, s2, c2;
  for (a4 = 0, o3 = i3.length; a4 < o3; a4 += 1) if (s2 = i3[a4], (s2.instanceOf || s2.predicate) && (!s2.instanceOf || typeof t2 == `object` && t2 instanceof s2.instanceOf) && (!s2.predicate || s2.predicate(t2))) {
    if (n2 ? s2.multi && s2.representName ? e2.tag = s2.representName(t2) : e2.tag = s2.tag : e2.tag = `?`, s2.represent) {
      if (c2 = e2.styleMap[s2.tag] || s2.defaultStyle, It.call(s2.represent) === `[object Function]`) r2 = s2.represent(t2, c2);
      else if (Lt.call(s2.represent, c2)) r2 = s2.represent[c2](t2, c2);
      else throw new l(`!<` + s2.tag + `> tag resolver accepts not "` + c2 + `" style`);
      e2.dump = r2;
    }
    return true;
  }
  return false;
}
function Q(e2, t2, n2, r2, i3, a4, o3) {
  e2.tag = null, e2.dump = n2, Mn(e2, n2, false) || Mn(e2, n2, true);
  var s2 = It.call(e2.dump), c2 = r2, u2;
  r2 &&= e2.flowLevel < 0 || e2.flowLevel > t2;
  var d2 = s2 === `[object Object]` || s2 === `[object Array]`, f2, p2;
  if (d2 && (f2 = e2.duplicates.indexOf(n2), p2 = f2 !== -1), (e2.tag !== null && e2.tag !== `?` || p2 || e2.indent !== 2 && t2 > 0) && (i3 = false), p2 && e2.usedDuplicates[f2]) e2.dump = `*ref_` + f2;
  else {
    if (d2 && p2 && !e2.usedDuplicates[f2] && (e2.usedDuplicates[f2] = true), s2 === `[object Object]`) r2 && Object.keys(e2.dump).length !== 0 ? (jn(e2, t2, e2.dump, i3), p2 && (e2.dump = `&ref_` + f2 + e2.dump)) : (An(e2, t2, e2.dump), p2 && (e2.dump = `&ref_` + f2 + ` ` + e2.dump));
    else if (s2 === `[object Array]`) r2 && e2.dump.length !== 0 ? (e2.noArrayIndent && !o3 && t2 > 0 ? kn(e2, t2 - 1, e2.dump, i3) : kn(e2, t2, e2.dump, i3), p2 && (e2.dump = `&ref_` + f2 + e2.dump)) : (On(e2, t2, e2.dump), p2 && (e2.dump = `&ref_` + f2 + ` ` + e2.dump));
    else if (s2 === `[object String]`) e2.tag !== `?` && Cn(e2, e2.dump, t2, a4, c2);
    else if (s2 === `[object Undefined]`) return false;
    else {
      if (e2.skipInvalid) return false;
      throw new l(`unacceptable kind of an object to dump ` + s2);
    }
    e2.tag !== null && e2.tag !== `?` && (u2 = encodeURI(e2.tag[0] === `!` ? e2.tag.slice(1) : e2.tag).replace(/!/g, `%21`), u2 = e2.tag[0] === `!` ? `!` + u2 : u2.slice(0, 18) === `tag:yaml.org,2002:` ? `!!` + u2.slice(18) : `!<` + u2 + `>`, e2.dump = u2 + ` ` + e2.dump);
  }
  return true;
}
function Nn(e2, t2) {
  var n2 = [], r2 = [], i3, a4;
  for ($(e2, n2, r2), i3 = 0, a4 = r2.length; i3 < a4; i3 += 1) t2.duplicates.push(n2[r2[i3]]);
  t2.usedDuplicates = Array(a4);
}
function $(e2, t2, n2) {
  var r2, i3, a4;
  if (typeof e2 == `object` && e2) if (i3 = t2.indexOf(e2), i3 !== -1) n2.indexOf(i3) === -1 && n2.push(i3);
  else if (t2.push(e2), Array.isArray(e2)) for (i3 = 0, a4 = e2.length; i3 < a4; i3 += 1) $(e2[i3], t2, n2);
  else for (r2 = Object.keys(e2), i3 = 0, a4 = r2.length; i3 < a4; i3 += 1) $(e2[r2[i3]], t2, n2);
}
function Pn(e2, t2) {
  t2 ||= {};
  var n2 = new dn(t2);
  n2.noRefs || Nn(e2, n2);
  var r2 = e2;
  return n2.replacer && (r2 = n2.replacer.call({ "": r2 }, ``, r2)), Q(n2, 0, r2, true, true) ? n2.dump + `
` : ``;
}
var o2, l, p, m, h, v, ne, oe, ue, _e, ve, xe, we, Te, Ee, De, je, Ne, b, Re, ze, Be, Ue, We, qe, Je, Ze, Qe, x, S, $e, et, C, w, tt, nt, rt, it, at, ot, st, ht, gt, k, yt, Ft, It, Lt, z, Rt, B, zt, Bt, Vt, Ht, V, Ut, Wt, Gt, Kt, qt, Jt, H, Yt, Xt, Zt, Qt, $t, en, tn, nn, rn, an, U, on, sn, un, W, yn, Y, bn, xn, X, Fn, In, Ln;
var init_js_yaml = __esm({
  "node_modules/confbox/dist/_chunks/libs/js-yaml.mjs"() {
    init_esm();
    __name(e, "e");
    __name(t, "t");
    __name(n, "n");
    __name(r, "r");
    __name(i, "i");
    __name(a2, "a");
    o2 = { isNothing: e, isObject: t, toArray: n, repeat: i, isNegativeZero: a2, extend: r };
    __name(s, "s");
    __name(c, "c");
    c.prototype = Object.create(Error.prototype), c.prototype.constructor = c, c.prototype.toString = function(e2) {
      return this.name + `: ` + s(this, e2);
    };
    l = c;
    __name(u, "u");
    __name(d, "d");
    __name(f, "f");
    p = f;
    m = [`kind`, `multi`, `resolve`, `construct`, `instanceOf`, `predicate`, `represent`, `representName`, `defaultStyle`, `styleAliases`];
    h = [`scalar`, `sequence`, `mapping`];
    __name(g, "g");
    __name(_, "_");
    v = _;
    __name(ee, "ee");
    __name(te, "te");
    __name(y, "y");
    y.prototype.extend = function(e2) {
      var t2 = [], n2 = [];
      if (e2 instanceof v) n2.push(e2);
      else if (Array.isArray(e2)) n2 = n2.concat(e2);
      else if (e2 && (Array.isArray(e2.implicit) || Array.isArray(e2.explicit))) e2.implicit && (t2 = t2.concat(e2.implicit)), e2.explicit && (n2 = n2.concat(e2.explicit));
      else throw new l(`Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })`);
      t2.forEach(function(e3) {
        if (!(e3 instanceof v)) throw new l(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);
        if (e3.loadKind && e3.loadKind !== `scalar`) throw new l(`There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.`);
        if (e3.multi) throw new l(`There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.`);
      }), n2.forEach(function(e3) {
        if (!(e3 instanceof v)) throw new l(`Specified list of YAML types (or a single Type object) contains a non-Type object.`);
      });
      var r2 = Object.create(y.prototype);
      return r2.implicit = (this.implicit || []).concat(t2), r2.explicit = (this.explicit || []).concat(n2), r2.compiledImplicit = ee(r2, `implicit`), r2.compiledExplicit = ee(r2, `explicit`), r2.compiledTypeMap = te(r2.compiledImplicit, r2.compiledExplicit), r2;
    };
    ne = new y({ explicit: [new v(`tag:yaml.org,2002:str`, { kind: `scalar`, construct: /* @__PURE__ */ __name(function(e2) {
      return e2 === null ? `` : e2;
    }, "construct") }), new v(`tag:yaml.org,2002:seq`, { kind: `sequence`, construct: /* @__PURE__ */ __name(function(e2) {
      return e2 === null ? [] : e2;
    }, "construct") }), new v(`tag:yaml.org,2002:map`, { kind: `mapping`, construct: /* @__PURE__ */ __name(function(e2) {
      return e2 === null ? {} : e2;
    }, "construct") })] });
    __name(re, "re");
    __name(ie, "ie");
    __name(ae, "ae");
    oe = new v(`tag:yaml.org,2002:null`, { kind: `scalar`, resolve: re, construct: ie, predicate: ae, represent: { canonical: /* @__PURE__ */ __name(function() {
      return `~`;
    }, "canonical"), lowercase: /* @__PURE__ */ __name(function() {
      return `null`;
    }, "lowercase"), uppercase: /* @__PURE__ */ __name(function() {
      return `NULL`;
    }, "uppercase"), camelcase: /* @__PURE__ */ __name(function() {
      return `Null`;
    }, "camelcase"), empty: /* @__PURE__ */ __name(function() {
      return ``;
    }, "empty") }, defaultStyle: `lowercase` });
    __name(se, "se");
    __name(ce, "ce");
    __name(le, "le");
    ue = new v(`tag:yaml.org,2002:bool`, { kind: `scalar`, resolve: se, construct: ce, predicate: le, represent: { lowercase: /* @__PURE__ */ __name(function(e2) {
      return e2 ? `true` : `false`;
    }, "lowercase"), uppercase: /* @__PURE__ */ __name(function(e2) {
      return e2 ? `TRUE` : `FALSE`;
    }, "uppercase"), camelcase: /* @__PURE__ */ __name(function(e2) {
      return e2 ? `True` : `False`;
    }, "camelcase") }, defaultStyle: `lowercase` });
    __name(de, "de");
    __name(fe, "fe");
    __name(pe, "pe");
    __name(me, "me");
    __name(he, "he");
    __name(ge, "ge");
    _e = new v(`tag:yaml.org,2002:int`, { kind: `scalar`, resolve: me, construct: he, predicate: ge, represent: { binary: /* @__PURE__ */ __name(function(e2) {
      return e2 >= 0 ? `0b` + e2.toString(2) : `-0b` + e2.toString(2).slice(1);
    }, "binary"), octal: /* @__PURE__ */ __name(function(e2) {
      return e2 >= 0 ? `0o` + e2.toString(8) : `-0o` + e2.toString(8).slice(1);
    }, "octal"), decimal: /* @__PURE__ */ __name(function(e2) {
      return e2.toString(10);
    }, "decimal"), hexadecimal: /* @__PURE__ */ __name(function(e2) {
      return e2 >= 0 ? `0x` + e2.toString(16).toUpperCase() : `-0x` + e2.toString(16).toUpperCase().slice(1);
    }, "hexadecimal") }, defaultStyle: `decimal`, styleAliases: { binary: [2, `bin`], octal: [8, `oct`], decimal: [10, `dec`], hexadecimal: [16, `hex`] } });
    ve = RegExp(`^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    __name(ye, "ye");
    __name(be, "be");
    xe = /^[-+]?[0-9]+e/;
    __name(Se, "Se");
    __name(Ce, "Ce");
    we = new v(`tag:yaml.org,2002:float`, { kind: `scalar`, resolve: ye, construct: be, predicate: Ce, represent: Se, defaultStyle: `lowercase` });
    Te = ne.extend({ implicit: [oe, ue, _e, we] });
    Ee = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`);
    De = RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);
    __name(Oe, "Oe");
    __name(ke, "ke");
    __name(Ae, "Ae");
    je = new v(`tag:yaml.org,2002:timestamp`, { kind: `scalar`, resolve: Oe, construct: ke, instanceOf: Date, represent: Ae });
    __name(Me, "Me");
    Ne = new v(`tag:yaml.org,2002:merge`, { kind: `scalar`, resolve: Me });
    b = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
    __name(Pe, "Pe");
    __name(Fe, "Fe");
    __name(Ie, "Ie");
    __name(Le, "Le");
    Re = new v(`tag:yaml.org,2002:binary`, { kind: `scalar`, resolve: Pe, construct: Fe, predicate: Le, represent: Ie });
    ze = Object.prototype.hasOwnProperty;
    Be = Object.prototype.toString;
    __name(Ve, "Ve");
    __name(He, "He");
    Ue = new v(`tag:yaml.org,2002:omap`, { kind: `sequence`, resolve: Ve, construct: He });
    We = Object.prototype.toString;
    __name(Ge, "Ge");
    __name(Ke, "Ke");
    qe = new v(`tag:yaml.org,2002:pairs`, { kind: `sequence`, resolve: Ge, construct: Ke });
    Je = Object.prototype.hasOwnProperty;
    __name(Ye, "Ye");
    __name(Xe, "Xe");
    Ze = new v(`tag:yaml.org,2002:set`, { kind: `mapping`, resolve: Ye, construct: Xe });
    Qe = Te.extend({ implicit: [je, Ne], explicit: [Re, Ue, qe, Ze] });
    x = Object.prototype.hasOwnProperty;
    S = 1;
    $e = 2;
    et = 3;
    C = 4;
    w = 1;
    tt = 2;
    nt = 3;
    rt = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    it = /[\x85\u2028\u2029]/;
    at = /[,\[\]\{\}]/;
    ot = /^(?:!|!!|![a-z\-]+!)$/i;
    st = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    __name(ct, "ct");
    __name(T, "T");
    __name(E, "E");
    __name(D, "D");
    __name(O, "O");
    __name(lt, "lt");
    __name(ut, "ut");
    __name(dt, "dt");
    __name(ft, "ft");
    __name(pt, "pt");
    __name(mt, "mt");
    for (ht = Array(256), gt = Array(256), k = 0; k < 256; k++) ht[k] = ft(k) ? 1 : 0, gt[k] = ft(k);
    __name(_t, "_t");
    __name(vt, "vt");
    __name(A, "A");
    __name(j, "j");
    yt = { YAML: /* @__PURE__ */ __name(function(e2, t2, n2) {
      var r2, i3, a4;
      e2.version !== null && A(e2, `duplication of %YAML directive`), n2.length !== 1 && A(e2, `YAML directive accepts exactly one argument`), r2 = /^([0-9]+)\.([0-9]+)$/.exec(n2[0]), r2 === null && A(e2, `ill-formed argument of the YAML directive`), i3 = parseInt(r2[1], 10), a4 = parseInt(r2[2], 10), i3 !== 1 && A(e2, `unacceptable YAML version of the document`), e2.version = n2[0], e2.checkLineBreaks = a4 < 2, a4 !== 1 && a4 !== 2 && j(e2, `unsupported YAML version of the document`);
    }, "YAML"), TAG: /* @__PURE__ */ __name(function(e2, t2, n2) {
      var r2, i3;
      n2.length !== 2 && A(e2, `TAG directive accepts exactly two arguments`), r2 = n2[0], i3 = n2[1], ot.test(r2) || A(e2, `ill-formed tag handle (first argument) of the TAG directive`), x.call(e2.tagMap, r2) && A(e2, `there is a previously declared suffix for "` + r2 + `" tag handle`), st.test(i3) || A(e2, `ill-formed tag prefix (second argument) of the TAG directive`);
      try {
        i3 = decodeURIComponent(i3);
      } catch {
        A(e2, `tag prefix is malformed: ` + i3);
      }
      e2.tagMap[r2] = i3;
    }, "TAG") };
    __name(M, "M");
    __name(bt, "bt");
    __name(N, "N");
    __name(P, "P");
    __name(F, "F");
    __name(I, "I");
    __name(L, "L");
    __name(xt, "xt");
    __name(St, "St");
    __name(Ct, "Ct");
    __name(wt, "wt");
    __name(Tt, "Tt");
    __name(Et, "Et");
    __name(Dt, "Dt");
    __name(Ot, "Ot");
    __name(kt, "kt");
    __name(At, "At");
    __name(R, "R");
    __name(jt, "jt");
    __name(Mt, "Mt");
    __name(Nt, "Nt");
    __name(Pt, "Pt");
    Ft = { loadAll: Nt, load: Pt };
    It = Object.prototype.toString;
    Lt = Object.prototype.hasOwnProperty;
    z = 65279;
    Rt = 9;
    B = 10;
    zt = 13;
    Bt = 32;
    Vt = 33;
    Ht = 34;
    V = 35;
    Ut = 37;
    Wt = 38;
    Gt = 39;
    Kt = 42;
    qt = 44;
    Jt = 45;
    H = 58;
    Yt = 61;
    Xt = 62;
    Zt = 63;
    Qt = 64;
    $t = 91;
    en = 93;
    tn = 96;
    nn = 123;
    rn = 124;
    an = 125;
    U = {};
    U[0] = `\\0`, U[7] = `\\a`, U[8] = `\\b`, U[9] = `\\t`, U[10] = `\\n`, U[11] = `\\v`, U[12] = `\\f`, U[13] = `\\r`, U[27] = `\\e`, U[34] = `\\"`, U[92] = `\\\\`, U[133] = `\\N`, U[160] = `\\_`, U[8232] = `\\L`, U[8233] = `\\P`;
    on = [`y`, `Y`, `yes`, `Yes`, `YES`, `on`, `On`, `ON`, `n`, `N`, `no`, `No`, `NO`, `off`, `Off`, `OFF`];
    sn = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
    __name(cn, "cn");
    __name(ln, "ln");
    un = 1;
    W = 2;
    __name(dn, "dn");
    __name(fn, "fn");
    __name(G, "G");
    __name(pn, "pn");
    __name(K, "K");
    __name(q, "q");
    __name(mn, "mn");
    __name(hn, "hn");
    __name(gn, "gn");
    __name(_n, "_n");
    __name(J, "J");
    __name(vn, "vn");
    yn = 1;
    Y = 2;
    bn = 3;
    xn = 4;
    X = 5;
    __name(Sn, "Sn");
    __name(Cn, "Cn");
    __name(wn, "wn");
    __name(Tn, "Tn");
    __name(En, "En");
    __name(Z, "Z");
    __name(Dn, "Dn");
    __name(On, "On");
    __name(kn, "kn");
    __name(An, "An");
    __name(jn, "jn");
    __name(Mn, "Mn");
    __name(Q, "Q");
    __name(Nn, "Nn");
    __name($, "$");
    __name(Pn, "Pn");
    Fn = { dump: Pn };
    In = Ft.load;
    Ft.loadAll;
    Ln = Fn.dump;
  }
});

// node_modules/confbox/dist/yaml.mjs
function i2(t2, r2) {
  let i3 = In(t2, r2);
  return a(t2, i3, r2), i3;
}
function a3(e2, n2) {
  let i3 = o(e2, { preserveIndentation: false }), a4 = Ln(e2, { indent: typeof i3.indent == `string` ? i3.indent.length : i3.indent, ...n2 });
  return i3.whitespace.start + a4.trim() + i3.whitespace.end;
}
var init_yaml = __esm({
  "node_modules/confbox/dist/yaml.mjs"() {
    init_esm();
    init_format();
    init_js_yaml();
    __name(i2, "i");
    __name(a3, "a");
  }
});
init_yaml();
export {
  i2 as parseYAML,
  a3 as stringifyYAML
};
/*! Bundled license information:

confbox/dist/_chunks/libs/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=yaml-34SH5RZE.mjs.map
