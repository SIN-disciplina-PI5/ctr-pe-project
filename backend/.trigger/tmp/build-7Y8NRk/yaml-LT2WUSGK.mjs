import {
  c,
  i,
  init_format,
  s
} from "./chunk-2LE3WOGE.mjs";
import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/_chunks/libs/js-yaml.mjs
function t(e3, t3) {
  return { tagName: e3, nodeKind: `scalar`, implicit: t3.implicit ?? false, matchByTagPrefix: t3.matchByTagPrefix ?? false, implicitFirstChars: t3.implicitFirstChars ?? null, resolve: t3.resolve, identify: t3.identify, represent: t3.represent ?? ((e4) => String(e4)), representTagName: t3.representTagName ?? (() => e3) };
}
function n(e3, t3) {
  let n2 = t3.finalize === void 0;
  return { tagName: e3, nodeKind: `sequence`, implicit: false, matchByTagPrefix: t3.matchByTagPrefix ?? false, create: t3.create, addItem: t3.addItem, finalize: t3.finalize ?? ((e4) => e4), carrierIsResult: n2, identify: t3.identify, represent: t3.represent ?? ((e4) => e4), representTagName: t3.representTagName ?? (() => e3) };
}
function r(e3, t3) {
  let n2 = t3.finalize === void 0;
  return { tagName: e3, nodeKind: `mapping`, implicit: false, matchByTagPrefix: t3.matchByTagPrefix ?? false, create: t3.create, addPair: t3.addPair, has: t3.has, keys: t3.keys, get: t3.get, finalize: t3.finalize ?? ((e4) => e4), carrierIsResult: n2, identify: t3.identify, represent: t3.represent ?? ((e4) => e4), representTagName: t3.representTagName ?? (() => e3) };
}
function ae(e3) {
  let t3 = e3, n2 = 1;
  return (t3[0] === `-` || t3[0] === `+`) && (t3[0] === `-` && (n2 = -1), t3 = t3.slice(1)), t3.startsWith(`0b`) ? n2 * parseInt(t3.slice(2), 2) : t3.startsWith(`0o`) ? n2 * parseInt(t3.slice(2), 8) : t3.startsWith(`0x`) ? n2 * parseInt(t3.slice(2), 16) : n2 * parseInt(t3, 10);
}
function oe(t3, n2) {
  if (n2) {
    if (!ie.test(t3)) return e;
  } else if (!re.test(t3)) return e;
  let r2 = ae(t3);
  return Number.isFinite(r2) ? r2 : e;
}
function ue(e3) {
  let t3 = e3, n2 = 1;
  return (t3[0] === `-` || t3[0] === `+`) && (t3[0] === `-` && (n2 = -1), t3 = t3.slice(1)), t3.startsWith(`0b`) ? n2 * parseInt(t3.slice(2), 2) : t3.startsWith(`0o`) ? n2 * parseInt(t3.slice(2), 8) : t3.startsWith(`0x`) ? n2 * parseInt(t3.slice(2), 16) : n2 * parseInt(t3, 10);
}
function de(t3, n2) {
  if (n2) {
    if (!le.test(t3)) return e;
  } else if (!ce.test(t3)) return e;
  let r2 = ue(t3);
  return Number.isFinite(r2) ? r2 : e;
}
function me(e3) {
  let t3 = e3.replace(/_/g, ``), n2 = 1;
  if ((t3[0] === `-` || t3[0] === `+`) && (t3[0] === `-` && (n2 = -1), t3 = t3.slice(1)), t3.startsWith(`0b`)) return n2 * parseInt(t3.slice(2), 2);
  if (t3.startsWith(`0x`)) return n2 * parseInt(t3.slice(2), 16);
  if (t3.includes(`:`)) {
    let e4 = 0;
    for (let n3 of t3.split(`:`)) e4 = e4 * 60 + Number(n3);
    return n2 * e4;
  }
  return t3 !== `0` && t3[0] === `0` ? n2 * parseInt(t3, 8) : n2 * parseInt(t3, 10);
}
function he(t3) {
  if (!pe.test(t3)) return e;
  let n2 = me(t3);
  return Number.isFinite(n2) ? n2 : e;
}
function ye(t3) {
  if (!_e.test(t3)) return e;
  let n2 = t3.toLowerCase(), r2 = n2[0] === `-` ? -1 : 1;
  if (`+-`.includes(n2[0]) && (n2 = n2.slice(1)), n2 === `.inf`) return r2 === 1 ? 1 / 0 : -1 / 0;
  if (n2 === `.nan`) return NaN;
  let i3 = r2 * parseFloat(n2);
  return Number.isFinite(i3) || ve.test(t3) ? i3 : e;
}
function be(e3) {
  if (isNaN(e3)) return `.nan`;
  if (e3 === 1 / 0) return `.inf`;
  if (e3 === -1 / 0) return `-.inf`;
  if (Object.is(e3, -0)) return `-0.0`;
  let t3 = e3.toString(10);
  return /^[-+]?[0-9]+e/.test(t3) ? t3.replace(`e`, `.e`) : t3;
}
function we(t3, n2) {
  if (n2) {
    if (!Ce.test(t3)) return e;
    let n3 = t3.toLowerCase(), r3 = n3[0] === `-` ? -1 : 1;
    if (`+-`.includes(n3[0]) && (n3 = n3.slice(1)), n3 === `.inf`) return r3 === 1 ? 1 / 0 : -1 / 0;
    if (n3 === `.nan`) return NaN;
    let i3 = r3 * parseFloat(n3);
    return Number.isFinite(i3) ? i3 : e;
  }
  if (!Se.test(t3)) return e;
  let r2 = Number(t3);
  return Number.isFinite(r2) ? r2 : e;
}
function Te(e3) {
  if (isNaN(e3)) return `.nan`;
  if (e3 === 1 / 0) return `.inf`;
  if (e3 === -1 / 0) return `-.inf`;
  if (Object.is(e3, -0)) return `-0.0`;
  let t3 = e3.toString(10);
  return /^[-+]?[0-9]+e/.test(t3) ? t3.replace(`e`, `.e`) : t3;
}
function ke(t3) {
  if (!De.test(t3)) return e;
  let n2 = t3.toLowerCase().replace(/_/g, ``), r2 = n2[0] === `-` ? -1 : 1;
  if (`+-`.includes(n2[0]) && (n2 = n2.slice(1)), n2 === `.inf`) return r2 === 1 ? 1 / 0 : -1 / 0;
  if (n2 === `.nan`) return NaN;
  let i3 = 0;
  if (n2.includes(`:`)) {
    for (let e3 of n2.split(`:`)) i3 = i3 * 60 + Number(e3);
    i3 *= r2;
  } else i3 = r2 * parseFloat(n2);
  return Number.isFinite(i3) || Oe.test(t3) ? i3 : e;
}
function Ae(e3) {
  if (isNaN(e3)) return `.nan`;
  if (e3 === 1 / 0) return `.inf`;
  if (e3 === -1 / 0) return `-.inf`;
  if (Object.is(e3, -0)) return `-0.0`;
  let t3 = e3.toString(10);
  return /^[-+]?[0-9]+e/.test(t3) ? t3.replace(`e`, `.e`) : t3;
}
function Pe(t3) {
  let n2 = t3.replace(/\s/g, ``);
  if (n2.length % 4 != 0 || !Ne.test(n2)) return e;
  let r2 = atob(n2), i3 = new Uint8Array(r2.length);
  for (let e3 = 0; e3 < r2.length; e3++) i3[e3] = r2.charCodeAt(e3);
  return i3;
}
function Fe(e3) {
  let t3 = ``;
  for (let n2 = 0; n2 < e3.length; n2++) t3 += String.fromCharCode(e3[n2]);
  return btoa(t3);
}
function ze(e3, t3, n2, r2 = 0, i3 = 0, a2 = 0, o3 = 0) {
  let s4 = new Date(Date.UTC(e3, t3, n2, r2, i3, a2, o3));
  return s4.setUTCFullYear(e3, t3, n2), s4;
}
function Be(t3) {
  let n2 = Le.exec(t3);
  if (n2 === null && (n2 = Re.exec(t3)), n2 === null) return e;
  let r2 = +n2[1], i3 = n2[2] - 1, a2 = +n2[3];
  if (!n2[4]) {
    let t4 = ze(r2, i3, a2);
    return t4.getUTCFullYear() !== r2 || t4.getUTCMonth() !== i3 || t4.getUTCDate() !== a2 ? e : t4;
  }
  let o3 = +n2[4], s4 = +n2[5], c3 = +n2[6], l2 = 0;
  if (o3 > 23 || s4 > 59 || c3 > 59) return e;
  if (n2[7]) {
    let e3 = n2[7].slice(0, 3);
    for (; e3.length < 3; ) e3 += `0`;
    l2 = +e3;
  }
  let u2 = ze(r2, i3, a2, o3, s4, c3, l2);
  if (u2.getUTCFullYear() !== r2 || u2.getUTCMonth() !== i3 || u2.getUTCDate() !== a2) return e;
  if (n2[9]) {
    let t4 = +n2[10], r3 = +(n2[11] || 0);
    if (t4 > 23 || r3 > 59) return e;
    let i4 = (t4 * 60 + r3) * 6e4;
    u2.setTime(u2.getTime() - (n2[9] === `-` ? -i4 : i4));
  }
  return u2;
}
function g(e3) {
  if (typeof e3 != `object` || !e3 || Array.isArray(e3)) return false;
  let t3 = Object.getPrototypeOf(e3);
  return t3 === null || t3 === Object.prototype;
}
function Ue(e3, t3) {
  let n2 = {};
  for (let r2 of t3) e3[r2] !== void 0 && (n2[r2] = e3[r2]);
  return n2;
}
function Je() {
  return { scalar: /* @__PURE__ */ Object.create(null), sequence: /* @__PURE__ */ Object.create(null), mapping: /* @__PURE__ */ Object.create(null) };
}
function Ye() {
  return { scalar: [], sequence: [], mapping: [] };
}
function Xe(e3) {
  let t3 = [];
  for (let n2 of e3) {
    let e4 = t3.length;
    for (let r2 = 0; r2 < t3.length; r2++) {
      let i3 = t3[r2];
      if (i3.nodeKind === n2.nodeKind && i3.tagName === n2.tagName && i3.matchByTagPrefix === n2.matchByTagPrefix) {
        e4 = r2;
        break;
      }
    }
    t3[e4] = n2;
  }
  return t3;
}
function et(e3) {
  if (Array.isArray(e3)) {
    let t3 = Array.prototype.slice.call(e3);
    for (let e4 = 0; e4 < t3.length; e4++) {
      if (Array.isArray(t3[e4])) return null;
      typeof t3[e4] == `object` && Object.prototype.toString.call(t3[e4]) === `[object Object]` && (t3[e4] = `[object Object]`);
    }
    return String(t3);
  }
  return typeof e3 == `object` && Object.prototype.toString.call(e3) === `[object Object]` ? `[object Object]` : String(e3);
}
function nt(e3, t3, n2, r2, i3) {
  let a2 = ``, o3 = ``, s4 = Math.floor(i3 / 2) - 1;
  return r2 - t3 > s4 && (a2 = ` ... `, t3 = r2 - s4 + a2.length), n2 - r2 > s4 && (o3 = ` ...`, n2 = r2 + s4 - o3.length), { str: a2 + e3.slice(t3, n2).replace(/\t/g, `→`) + o3, pos: r2 - t3 + a2.length };
}
function rt(e3, t3) {
  return ` `.repeat(Math.max(t3 - e3.length, 0)) + e3;
}
function it(e3, t3) {
  if (!e3.buffer) return null;
  let n2 = { ...tt, ...t3 }, r2 = /\r?\n|\r|\0/g, i3 = [0], a2 = [], o3, s4 = -1;
  for (; o3 = r2.exec(e3.buffer); ) a2.push(o3.index), i3.push(o3.index + o3[0].length), e3.position <= o3.index && s4 < 0 && (s4 = i3.length - 2);
  s4 < 0 && (s4 = i3.length - 1);
  let c3 = ``, l2 = Math.min(e3.line + n2.linesAfter, a2.length).toString().length, u2 = n2.maxLength - (n2.indent + l2 + 3);
  for (let t4 = 1; t4 <= n2.linesBefore && !(s4 - t4 < 0); t4++) {
    let r3 = nt(e3.buffer, i3[s4 - t4], a2[s4 - t4], e3.position - (i3[s4] - i3[s4 - t4]), u2);
    c3 = `${` `.repeat(n2.indent)}${rt((e3.line - t4 + 1).toString(), l2)} | ${r3.str}
${c3}`;
  }
  let d2 = nt(e3.buffer, i3[s4], a2[s4], e3.position, u2);
  c3 += `${` `.repeat(n2.indent)}${rt((e3.line + 1).toString(), l2)} | ${d2.str}
`, c3 += `${`-`.repeat(n2.indent + l2 + 3 + d2.pos)}^
`;
  for (let t4 = 1; t4 <= n2.linesAfter && !(s4 + t4 >= a2.length); t4++) {
    let r3 = nt(e3.buffer, i3[s4 + t4], a2[s4 + t4], e3.position - (i3[s4] - i3[s4 + t4]), u2);
    c3 += `${` `.repeat(n2.indent)}${rt((e3.line + t4 + 1).toString(), l2)} | ${r3.str}
`;
  }
  return c3.replace(/\n$/, ``);
}
function at(e3, t3) {
  let n2 = ``;
  return e3.mark ? (e3.mark.name && (n2 += `in "${e3.mark.name}" `), n2 += `(${e3.mark.line + 1}:${e3.mark.column + 1})`, !t3 && e3.mark.snippet && (n2 += `

${e3.mark.snippet}`), `${e3.reason} ${n2}`) : e3.reason;
}
function st(e3) {
  switch (e3) {
    case 48:
      return `\0`;
    case 97:
      return `\x07`;
    case 98:
      return `\b`;
    case 116:
      return `	`;
    case 9:
      return `	`;
    case 110:
      return `
`;
    case 118:
      return `\v`;
    case 102:
      return `\f`;
    case 114:
      return `\r`;
    case 101:
      return `\x1B`;
    case 32:
      return ` `;
    case 34:
      return `"`;
    case 47:
      return `/`;
    case 92:
      return `\\`;
    case 78:
      return ``;
    case 95:
      return ` `;
    case 76:
      return `\u2028`;
    case 80:
      return `\u2029`;
    default:
      return ``;
  }
}
function ut(e3) {
  return e3 <= 65535 ? String.fromCharCode(e3) : String.fromCharCode((e3 - 65536 >> 10) + 55296, (e3 - 65536 & 1023) + 56320);
}
function dt(e3) {
  return e3 >= 48 && e3 <= 57 ? e3 - 48 : (e3 | 32) - 97 + 10;
}
function ft(e3) {
  return e3 === 120 ? 2 : e3 === 117 ? 4 : 8;
}
function C(e3, t3, n2) {
  let r2 = 0;
  for (; t3 < n2; ) {
    let n3 = e3.charCodeAt(t3);
    if (n3 === 10) r2++, t3++;
    else if (n3 === 13) r2++, t3++, e3.charCodeAt(t3) === 10 && t3++;
    else if (n3 === 32 || n3 === 9) t3++;
    else break;
  }
  return { position: t3, breaks: r2 };
}
function pt(e3) {
  return e3 === 1 ? ` ` : `
`.repeat(e3 - 1);
}
function mt(e3, t3, n2) {
  let r2 = ``, i3 = t3, a2 = t3, o3 = t3;
  for (; i3 < n2; ) {
    let t4 = e3.charCodeAt(i3);
    if (t4 === 10 || t4 === 13) {
      r2 += e3.slice(a2, o3);
      let t5 = C(e3, i3, n2);
      r2 += pt(t5.breaks), i3 = a2 = o3 = t5.position;
    } else i3++, t4 !== 32 && t4 !== 9 && (o3 = i3);
  }
  return r2 + e3.slice(a2, o3);
}
function ht(e3, t3, n2) {
  let r2 = ``, i3 = t3, a2 = t3, o3 = t3;
  for (; i3 < n2; ) {
    let t4 = e3.charCodeAt(i3);
    if (t4 === 39) r2 += e3.slice(a2, i3) + `'`, i3 += 2, a2 = o3 = i3;
    else if (t4 === 10 || t4 === 13) {
      r2 += e3.slice(a2, o3);
      let t5 = C(e3, i3, n2);
      r2 += pt(t5.breaks), i3 = a2 = o3 = t5.position;
    } else i3++, t4 !== 32 && t4 !== 9 && (o3 = i3);
  }
  return r2 + e3.slice(a2, n2);
}
function gt(e3, t3, n2) {
  let r2 = ``, i3 = t3, a2 = t3, o3 = t3;
  for (; i3 < n2; ) {
    let t4 = e3.charCodeAt(i3);
    if (t4 === 92) {
      r2 += e3.slice(a2, i3), i3++;
      let t5 = e3.charCodeAt(i3);
      if (t5 === 10 || t5 === 13) i3 = C(e3, i3, n2).position;
      else if (t5 < 256 && ct[t5]) r2 += lt[t5], i3++;
      else {
        let n3 = ft(t5), a3 = 0;
        for (; n3 > 0; n3--) {
          i3++;
          let t6 = dt(e3.charCodeAt(i3));
          a3 = (a3 << 4) + t6;
        }
        r2 += ut(a3), i3++;
      }
      a2 = o3 = i3;
    } else if (t4 === 10 || t4 === 13) {
      r2 += e3.slice(a2, o3);
      let t5 = C(e3, i3, n2);
      r2 += pt(t5.breaks), i3 = a2 = o3 = t5.position;
    } else i3++, t4 !== 32 && t4 !== 9 && (o3 = i3);
  }
  return r2 + e3.slice(a2, n2);
}
function _t(e3, t3, n2, r2, i3, a2) {
  let o3 = r2 < 0 ? 0 : r2, s4 = e3.slice(t3, n2).replace(/\r\n?/g, `
`), c3 = s4 === `` ? [] : (s4.endsWith(`
`) ? s4.slice(0, -1) : s4).split(`
`), l2 = ``, u2 = false, d2 = 0, f2 = false;
  for (let e4 of c3) {
    let t4 = 0;
    for (; t4 < o3 && e4.charCodeAt(t4) === 32; ) t4++;
    if (r2 < 0 || t4 >= e4.length) {
      d2++;
      continue;
    }
    let n3 = e4.slice(o3), i4 = n3.charCodeAt(0);
    a2 ? i4 === 32 || i4 === 9 ? (f2 = true, l2 += `
`.repeat(u2 ? 1 + d2 : d2)) : f2 ? (f2 = false, l2 += `
`.repeat(d2 + 1)) : d2 === 0 ? u2 && (l2 += ` `) : l2 += `
`.repeat(d2) : l2 += `
`.repeat(u2 ? 1 + d2 : d2), l2 += n3, u2 = true, d2 = 0;
  }
  return i3 === S.KEEP ? l2 += `
`.repeat(u2 ? 1 + d2 : d2) : i3 !== S.STRIP && u2 && (l2 += `
`), l2;
}
function vt(e3, t3) {
  if (t3.valueStart === ot) return ``;
  let { valueStart: n2, valueEnd: r2 } = t3;
  if (t3.fast) return e3.slice(n2, r2);
  switch (t3.style) {
    case b.SINGLE_QUOTED:
      return ht(e3, n2, r2);
    case b.DOUBLE_QUOTED:
      return gt(e3, n2, r2);
    case b.LITERAL_BLOCK:
      return _t(e3, n2, r2, t3.indent, t3.chomping, false);
    case b.FOLDED_BLOCK:
      return _t(e3, n2, r2, t3.indent, t3.chomping, true);
    default:
      return mt(e3, n2, r2);
  }
}
function w(e3) {
  return `%` + St[e3 >> 4] + St[e3 & 15];
}
function Ct(e3, t3) {
  let n2 = t3 ? bt : xt, r2 = ``;
  for (let t4 = 0; t4 < e3.length; t4++) {
    let i3 = e3.charCodeAt(t4);
    i3 >= 48 && i3 <= 57 || i3 >= 65 && i3 <= 90 || i3 >= 97 && i3 <= 122 || n2.includes(e3[t4]) ? r2 += e3[t4] : (i3 >= 55296 && i3 <= 56319 && (i3 = 65536 + ((i3 & 1023) << 10) + (e3.charCodeAt(++t4) & 1023)), r2 += i3 < 128 ? w(i3) : i3 < 2048 ? w(192 | i3 >> 6) + w(128 | i3 & 63) : i3 < 65536 ? w(224 | i3 >> 12) + w(128 | i3 >> 6 & 63) + w(128 | i3 & 63) : w(240 | i3 >> 18) + w(128 | i3 >> 12 & 63) + w(128 | i3 >> 6 & 63) + w(128 | i3 & 63));
  }
  return r2;
}
function wt(e3) {
  let t3 = ``, n2 = 0;
  for (; n2 < e3.length; ) {
    if (e3.charCodeAt(n2) !== 37) {
      t3 += e3[n2++];
      continue;
    }
    let r2 = parseInt(e3.slice(n2 + 1, n2 + 3), 16);
    if (n2 += 3, r2 >= 192) {
      let t4 = r2 < 224 ? 1 : r2 < 240 ? 2 : 3;
      for (r2 &= (1 << 6 - t4) - 1; t4-- > 0; ) r2 = r2 << 6 | parseInt(e3.slice(n2 + 1, n2 + 3), 16) & 63, n2 += 3;
    }
    r2 < 65536 ? t3 += String.fromCharCode(r2) : (r2 -= 65536, t3 += String.fromCharCode(55296 | r2 >> 10, 56320 | r2 & 1023));
  }
  return t3;
}
function Tt(e3, t3) {
  if (e3.startsWith(`!<`) && e3.endsWith(`>`)) return wt(e3.slice(2, -1));
  let n2 = e3.indexOf(`!`, 1), r2 = n2 === -1 ? `!` : e3.slice(0, n2 + 1);
  return wt(t3?.[r2] ?? yt[r2] ?? r2) + wt(e3.slice(r2.length));
}
function Et(e3) {
  let t3 = e3;
  return t3.charCodeAt(0) === 33 ? (t3 = t3.slice(1), `!${Ct(t3, true)}`) : t3.slice(0, 18) === `tag:yaml.org,2002:` ? `!!${Ct(t3.slice(18), true)}` : `!<${Ct(t3, false)}>`;
}
function kt(e3) {
  return `tagStart` in e3 && e3.tagStart !== T ? e3.tagStart : `anchorStart` in e3 && e3.anchorStart !== T ? e3.anchorStart : `valueStart` in e3 && e3.valueStart !== T ? e3.valueStart : `start` in e3 ? e3.start : 0;
}
function E(e3, t3) {
  v.throwAt(e3.source, e3.position, t3, e3.filename);
}
function At(e3, t3, n2, r2) {
  try {
    return n2.finalize(r2);
  } catch (n3) {
    if (n3 instanceof v) throw n3;
    v.throwAt(e3.source, t3, n3 instanceof Error ? n3.message : String(n3), e3.filename);
  }
}
function jt(t3, n2) {
  let r2 = vt(t3.source, n2), i3 = n2.tagStart === T ? `` : t3.source.slice(n2.tagStart, n2.tagEnd), a2 = t3.schema.defaultScalarTag;
  if (i3 !== ``) {
    if (i3 === `!`) return { value: r2, tag: a2 };
    let n3 = Tt(i3, t3.tagHandlers), o3 = t3.schema.lookupScalarTag(n3);
    if (o3) {
      let i4 = o3.resolve(r2, true, n3);
      return i4 === e && E(t3, `cannot resolve a node with !<${n3}> explicit tag`), { value: i4, tag: o3 };
    }
    let s4 = t3.schema.lookupMappingTag(n3) ?? t3.schema.lookupSequenceTag(n3);
    if (s4) {
      r2 !== `` && E(t3, `cannot resolve a node with !<${n3}> explicit tag`);
      let e3 = s4.create(n3);
      return { value: s4.carrierIsResult ? e3 : At(t3, t3.position, s4, e3), tag: s4 };
    }
    E(t3, `unknown scalar tag !<${n3}>`);
  }
  return n2.style === b.PLAIN ? t3.schema.resolveImplicitScalarTag(r2) : { value: a2.resolve(r2, false, a2.tagName), tag: a2 };
}
function Mt(e3, t3, n2) {
  let r2 = t3.tagStart === T ? `` : e3.source.slice(t3.tagStart, t3.tagEnd);
  return r2 === `` || r2 === `!` ? n2 : Tt(r2, e3.tagHandlers);
}
function Nt(e3) {
  return e3.nodeKind === `mapping`;
}
function Pt(e3) {
  e3.totalMergeKeys++, e3.maxTotalMergeKeys !== -1 && e3.totalMergeKeys > e3.maxTotalMergeKeys && E(e3, `merge keys exceeded maxTotalMergeKeys (${e3.maxTotalMergeKeys})`);
}
function Ft(e3, t3, n2, r2) {
  Pt(e3);
  for (let i3 of r2.keys(n2)) {
    if (Pt(e3), t3.tag.has(t3.value, i3)) continue;
    let a2 = t3.tag.addPair(t3.value, i3, r2.get(n2, i3));
    a2 && E(e3, a2), t3.overridable ??= /* @__PURE__ */ new Set(), t3.overridable.add(i3);
  }
}
function It(e3, t3, n2, r2) {
  if (e3.position = t3.keyPosition, Nt(r2)) Ft(e3, t3, n2, r2);
  else if (r2.nodeKind === `sequence` && Array.isArray(n2)) {
    n2.length > 100 && E(e3, `abnormal merge sequence size`);
    for (let r3 of n2) {
      let n3 = e3.nodeTags.get(r3);
      n3 || E(e3, `cannot merge mappings; the provided source object is unacceptable`), Ft(e3, t3, r3, n3);
    }
  } else E(e3, `cannot merge mappings; the provided source object is unacceptable`);
}
function Lt(e3, t3, n2, r2, i3) {
  if (e3.position = t3.keyPosition, t3.keyIsMerge) {
    It(e3, t3, r2, i3);
    return;
  }
  !e3.json && t3.tag.has(t3.value, n2) && !t3.overridable?.has(n2) && E(e3, `duplicated mapping key`);
  let a2 = t3.tag.addPair(t3.value, n2, r2);
  a2 && E(e3, a2), t3.overridable?.delete(n2);
}
function Rt(e3, t3, n2) {
  let r2 = e3.frames[e3.frames.length - 1];
  if (r2.kind === `document`) r2.value = t3, r2.hasValue = true;
  else if (r2.kind === `sequence`) {
    Nt(n2) && e3.nodeTags.set(t3, n2);
    let i3 = r2.tag.addItem(r2.value, t3, r2.index++);
    i3 && E(e3, i3);
  } else if (r2.hasKey) {
    let i3 = r2.key;
    r2.key = void 0, r2.hasKey = false, Lt(e3, r2, i3, t3, n2);
  } else r2.key = t3, r2.keyPosition = e3.position, r2.hasKey = true, r2.keyIsMerge = n2.tagName === Dt;
}
function zt(e3, t3, n2, r2, i3) {
  if (t3.anchorStart !== T) {
    let a2 = { value: n2, tag: r2, isValueFinal: i3 };
    return e3.anchors.set(e3.source.slice(t3.anchorStart, t3.anchorEnd), a2), a2;
  }
  return null;
}
function Bt(e3, t3) {
  let n2 = { ...Ot, ...t3, events: e3, documents: [], eventIndex: 0, position: 0, frames: [], anchors: /* @__PURE__ */ new Map(), nodeTags: /* @__PURE__ */ new Map(), tagHandlers: /* @__PURE__ */ Object.create(null), totalMergeKeys: 0, aliasCount: 0 };
  for (; n2.eventIndex < n2.events.length; ) {
    let e4 = n2.events[n2.eventIndex++];
    switch (n2.position = kt(e4), e4.type) {
      case y.DOCUMENT:
        n2.anchors = /* @__PURE__ */ new Map(), n2.nodeTags = /* @__PURE__ */ new Map(), n2.aliasCount = 0, n2.tagHandlers = /* @__PURE__ */ Object.create(null);
        for (let t4 of e4.directives) t4.kind === `tag` && (n2.tagHandlers[t4.handle] = t4.prefix);
        n2.frames.push({ kind: `document`, position: n2.position, value: void 0, hasValue: false });
        break;
      case y.SCALAR: {
        let { value: t4, tag: r2 } = jt(n2, e4);
        zt(n2, e4, t4, r2, true), Rt(n2, t4, r2);
        break;
      }
      case y.SEQUENCE: {
        let t4 = Mt(n2, e4, `tag:yaml.org,2002:seq`), r2 = n2.schema.lookupSequenceTag(t4);
        r2 || E(n2, `unknown sequence tag !<${t4}>`);
        let i3 = r2.create(t4), a2 = zt(n2, e4, i3, r2, r2.carrierIsResult);
        n2.frames.push({ kind: `sequence`, position: n2.position, value: i3, tag: r2, anchor: a2, index: 0 });
        break;
      }
      case y.MAPPING: {
        let t4 = Mt(n2, e4, `tag:yaml.org,2002:map`), r2 = n2.schema.lookupMappingTag(t4);
        r2 || E(n2, `unknown mapping tag !<${t4}>`);
        let i3 = r2.create(t4), a2 = zt(n2, e4, i3, r2, r2.carrierIsResult);
        n2.frames.push({ kind: `mapping`, position: n2.position, value: i3, tag: r2, anchor: a2, key: void 0, keyPosition: n2.position, hasKey: false, keyIsMerge: false, overridable: null });
        break;
      }
      case y.ALIAS: {
        n2.maxAliases !== -1 && ++n2.aliasCount > n2.maxAliases && E(n2, `aliases exceeded maxAliases (${n2.maxAliases})`);
        let t4 = n2.source.slice(e4.anchorStart, e4.anchorEnd), r2 = n2.anchors.get(t4);
        r2 || E(n2, `unidentified alias "${t4}"`), r2.isValueFinal || E(n2, `recursive alias "${t4}" is not supported for tag ${r2.tag.tagName} because it uses finalize()`), Rt(n2, r2.value, r2.tag);
        break;
      }
      case y.POP: {
        let e5 = n2.frames.pop();
        if (e5.kind === `mapping` && e5.hasKey && (n2.position = e5.keyPosition, E(n2, `incomplete mapping pair in event stream`)), e5.kind === `document`) n2.documents.push(e5.value);
        else {
          let t4 = e5.tag.carrierIsResult ? e5.value : At(n2, e5.position, e5.tag, e5.value);
          e5.anchor && (e5.anchor.value = t4, e5.anchor.isValueFinal = true), Rt(n2, t4, e5.tag);
        }
        break;
      }
    }
  }
  return n2.documents;
}
function $t(e3, t3, n2) {
  e3.events.push({ type: y.DOCUMENT, explicitStart: t3, explicitEnd: n2, directives: e3.directives });
}
function en(e3, t3, n2, r2, i3, a2, o3) {
  e3.events.push({ type: y.SEQUENCE, start: t3, anchorStart: n2, anchorEnd: r2, tagStart: i3, tagEnd: a2, style: o3 });
}
function tn(e3, t3, n2, r2, i3, a2, o3) {
  e3.events.push({ type: y.MAPPING, start: t3, anchorStart: n2, anchorEnd: r2, tagStart: i3, tagEnd: a2, style: o3 });
}
function nn(e3, t3) {
  e3.events.splice(t3.eventsLength, 0, { type: y.MAPPING, start: t3.position, anchorStart: D, anchorEnd: D, tagStart: D, tagEnd: D, style: x.FLOW });
}
function A(e3, t3, n2, r2, i3, a2, o3, s4, c3 = S.CLIP, l2 = -1, u2 = false) {
  e3.events.push({ type: y.SCALAR, valueStart: t3, valueEnd: n2, anchorStart: r2, anchorEnd: i3, tagStart: a2, tagEnd: o3, style: s4, chomping: c3, indent: l2, fast: u2 });
}
function rn(e3, t3, n2) {
  e3.events.push({ type: y.ALIAS, anchorStart: t3, anchorEnd: n2 });
}
function j(e3) {
  e3.events.push({ type: y.POP });
}
function M(e3) {
  A(e3, D, D, D, D, D, D, b.PLAIN);
}
function an() {
  return { anchorStart: D, anchorEnd: D, tagStart: D, tagEnd: D };
}
function N(e3) {
  return { position: e3.position, line: e3.line, lineStart: e3.lineStart, lineIndent: e3.lineIndent, firstTabInLine: e3.firstTabInLine, eventsLength: e3.events.length };
}
function P(e3, t3) {
  e3.position = t3.position, e3.line = t3.line, e3.lineStart = t3.lineStart, e3.lineIndent = t3.lineIndent, e3.firstTabInLine = t3.firstTabInLine, e3.events.length = t3.eventsLength;
}
function F(e3, t3) {
  v.throwAt(e3.input.slice(0, e3.length), e3.position, t3, e3.filename);
}
function I(e3) {
  return e3 === 10 || e3 === 13;
}
function L(e3) {
  return e3 === 9 || e3 === 32;
}
function R(e3) {
  return L(e3) || I(e3);
}
function z(e3) {
  return e3 === 0 || R(e3);
}
function B(e3) {
  return e3 === 44 || e3 === 91 || e3 === 93 || e3 === 123 || e3 === 125;
}
function on(e3) {
  return e3 >= 48 && e3 <= 57 ? e3 - 48 : -1;
}
function sn(e3) {
  if (e3 >= 48 && e3 <= 57) return e3 - 48;
  let t3 = e3 | 32;
  return t3 >= 97 && t3 <= 102 ? t3 - 97 + 10 : -1;
}
function cn(e3) {
  return e3 === 120 ? 2 : e3 === 117 ? 4 : e3 === 85 ? 8 : 0;
}
function ln(e3) {
  return e3 === 48 || e3 === 97 || e3 === 98 || e3 === 116 || e3 === 9 || e3 === 110 || e3 === 118 || e3 === 102 || e3 === 114 || e3 === 101 || e3 === 32 || e3 === 34 || e3 === 47 || e3 === 92 || e3 === 78 || e3 === 95 || e3 === 76 || e3 === 80;
}
function V(e3) {
  e3.input.charCodeAt(e3.position) === 10 ? e3.position++ : (e3.position++, e3.input.charCodeAt(e3.position) === 10 && e3.position++), e3.line++, e3.lineStart = e3.position, e3.lineIndent = 0, e3.firstTabInLine = -1;
}
function H(e3, t3) {
  let n2 = 0, r2 = e3.input.charCodeAt(e3.position), i3 = e3.position === e3.lineStart || R(e3.input.charCodeAt(e3.position - 1));
  for (; r2 !== 0; ) {
    for (; L(r2); ) i3 = true, r2 === 9 && e3.firstTabInLine === -1 && (e3.firstTabInLine = e3.position), r2 = e3.input.charCodeAt(++e3.position);
    if (t3 && i3 && r2 === 35) do
      r2 = e3.input.charCodeAt(++e3.position);
    while (!I(r2) && r2 !== 0);
    if (!I(r2)) break;
    for (V(e3), n2++, i3 = true, r2 = e3.input.charCodeAt(e3.position); r2 === 32; ) e3.lineIndent++, r2 = e3.input.charCodeAt(++e3.position);
  }
  return n2;
}
function U(e3, t3 = e3.position) {
  let n2 = e3.input.charCodeAt(t3);
  if ((n2 === 45 || n2 === 46) && n2 === e3.input.charCodeAt(t3 + 1) && n2 === e3.input.charCodeAt(t3 + 2)) {
    let n3 = e3.input.charCodeAt(t3 + 3);
    return n3 === 0 || R(n3);
  }
  return false;
}
function un(e3) {
  e3.position === e3.lineStart && e3.input.charCodeAt(e3.position) === 65279 && (e3.position++, e3.lineStart = e3.position);
}
function dn(e3) {
  if (e3.position !== e3.lineStart) return false;
  if (U(e3)) return true;
  if (e3.input.charCodeAt(e3.position) !== 65279) return false;
  let t3 = N(e3);
  un(e3), H(e3, true);
  let n2 = e3.input.charCodeAt(e3.position), r2 = e3.position === e3.lineStart && (n2 === 37 || n2 === 45 && U(e3));
  return P(e3, t3), r2;
}
function fn(e3) {
  let t3 = e3.input.charCodeAt(e3.position);
  for (; t3 !== 0 && !I(t3); ) t3 = e3.input.charCodeAt(++e3.position);
}
function pn(e3, t3, n2) {
  let r2 = Wt.exec(e3.input.slice(t3, n2));
  r2 !== null && (e3.position = t3 + r2.index + r2[0].length - 1, F(e3, `the stream contains non-printable characters`));
}
function mn(e3, t3, n2) {
  if (e3.input.charCodeAt(e3.position) !== 33) return false;
  t3.tagStart !== D && F(e3, `duplication of a tag property`);
  let r2 = e3.position, i3 = false, a2 = false, o3 = `!`, s4 = e3.input.charCodeAt(++e3.position);
  s4 === 60 ? (i3 = true, s4 = e3.input.charCodeAt(++e3.position)) : s4 === 33 && (a2 = true, o3 = `!!`, s4 = e3.input.charCodeAt(++e3.position));
  let c3 = e3.position, l2;
  if (i3) {
    for (; s4 !== 0 && s4 !== 62; ) s4 = e3.input.charCodeAt(++e3.position);
    s4 !== 62 && F(e3, `unexpected end of the stream within a verbatim tag`), l2 = e3.input.slice(c3, e3.position), e3.position++;
  } else {
    for (; s4 !== 0 && !R(s4) && !(n2 && B(s4)); ) s4 === 33 && (a2 ? F(e3, `tag suffix cannot contain exclamation marks`) : (o3 = e3.input.slice(c3 - 1, e3.position + 1), Kt.test(o3) || F(e3, `named tag handle cannot contain such characters`), a2 = true, c3 = e3.position + 1)), s4 = e3.input.charCodeAt(++e3.position);
    l2 = e3.input.slice(c3, e3.position), Gt.test(l2) && F(e3, `tag suffix cannot contain flow indicator characters`);
  }
  return l2 && !(i3 ? Yt.test(l2) : Xt.test(l2)) && F(e3, `tag name cannot contain such characters: ${l2}`), !i3 && o3 !== `!` && o3 !== `!!` && !Vt.call(e3.tagHandlers, o3) && F(e3, `undeclared tag handle "${o3}"`), t3.tagStart = r2, t3.tagEnd = e3.position, true;
}
function hn(e3, t3) {
  if (e3.input.charCodeAt(e3.position) !== 38) return false;
  t3.anchorStart !== D && F(e3, `duplication of an anchor property`), e3.position++;
  let n2 = e3.position;
  for (; e3.input.charCodeAt(e3.position) !== 0 && !R(e3.input.charCodeAt(e3.position)) && !B(e3.input.charCodeAt(e3.position)); ) e3.position++;
  return e3.position === n2 && F(e3, `name of an anchor node must contain at least one character`), t3.anchorStart = n2, t3.anchorEnd = e3.position, true;
}
function gn(e3, t3) {
  if (e3.input.charCodeAt(e3.position) !== 42) return false;
  (t3.anchorStart !== D || t3.tagStart !== D) && F(e3, `alias node should not have any properties`), e3.position++;
  let n2 = e3.position;
  for (; e3.input.charCodeAt(e3.position) !== 0 && !R(e3.input.charCodeAt(e3.position)) && !B(e3.input.charCodeAt(e3.position)); ) e3.position++;
  return e3.position === n2 && F(e3, `name of an alias node must contain at least one character`), rn(e3, n2, e3.position), true;
}
function _n(e3, t3) {
  H(e3, false), e3.lineIndent < t3 && F(e3, `deficient indentation`);
}
function vn(e3, t3, n2) {
  if (e3.input.charCodeAt(e3.position) !== 39) return false;
  e3.position++;
  let r2 = e3.position, i3 = true;
  for (; e3.input.charCodeAt(e3.position) !== 0; ) {
    let a2 = e3.input.charCodeAt(e3.position);
    if (a2 === 39) {
      if (e3.input.charCodeAt(e3.position + 1) === 39) {
        i3 = false, e3.position += 2;
        continue;
      }
      let t4 = e3.position;
      return e3.position++, A(e3, r2, t4, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, b.SINGLE_QUOTED, S.CLIP, -1, i3), true;
    }
    I(a2) ? (i3 = false, _n(e3, t3)) : e3.position === e3.lineStart && U(e3) ? F(e3, `unexpected end of the document within a single quoted scalar`) : a2 !== 9 && a2 < 32 ? F(e3, `expected valid JSON character`) : e3.position++;
  }
  F(e3, `unexpected end of the stream within a single quoted scalar`);
}
function yn(e3, t3, n2) {
  if (e3.input.charCodeAt(e3.position) !== 34) return false;
  e3.position++;
  let r2 = e3.position, i3 = true;
  for (; e3.input.charCodeAt(e3.position) !== 0; ) {
    let a2 = e3.input.charCodeAt(e3.position);
    if (a2 === 34) {
      let t4 = e3.position;
      return e3.position++, A(e3, r2, t4, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, b.DOUBLE_QUOTED, S.CLIP, -1, i3), true;
    }
    if (a2 === 92) {
      i3 = false;
      let n3 = e3.input.charCodeAt(++e3.position);
      if (I(n3)) _n(e3, t3);
      else if (ln(n3)) e3.position++;
      else {
        let t4 = cn(n3);
        for (t4 === 0 && F(e3, `unknown escape sequence`); t4-- > 0; ) e3.position++, sn(e3.input.charCodeAt(e3.position)) < 0 && F(e3, `expected hexadecimal character`);
        e3.position++;
      }
    } else I(a2) ? (i3 = false, _n(e3, t3)) : e3.position === e3.lineStart && U(e3) ? F(e3, `unexpected end of the document within a double quoted scalar`) : a2 !== 9 && a2 < 32 ? F(e3, `expected valid JSON character`) : e3.position++;
  }
  F(e3, `unexpected end of the stream within a double quoted scalar`);
}
function bn(e3, t3, n2) {
  let r2 = e3.input.charCodeAt(e3.position), i3 = S.CLIP, a2 = -1, o3 = false;
  if (r2 !== 124 && r2 !== 62) return false;
  let s4 = r2 === 124 ? b.LITERAL_BLOCK : b.FOLDED_BLOCK;
  for (e3.position++; e3.input.charCodeAt(e3.position) !== 0; ) {
    let n3 = e3.input.charCodeAt(e3.position), r3 = on(n3);
    if (n3 === 43 || n3 === 45) i3 !== S.CLIP && F(e3, `repeat of a chomping mode identifier`), i3 = n3 === 43 ? S.KEEP : S.STRIP, e3.position++;
    else if (r3 >= 0) r3 === 0 && F(e3, `bad explicit indentation width of a block scalar; it cannot be less than one`), o3 && F(e3, `repeat of an indentation width identifier`), a2 = t3 + r3 - 1, o3 = true, e3.position++;
    else break;
  }
  let c3 = false;
  for (; L(e3.input.charCodeAt(e3.position)); ) c3 = true, e3.position++;
  c3 && e3.input.charCodeAt(e3.position) === 35 && fn(e3), I(e3.input.charCodeAt(e3.position)) ? V(e3) : e3.input.charCodeAt(e3.position) !== 0 && F(e3, `a line break is expected`);
  let l2 = o3 ? a2 : -1, u2 = 0, d2 = e3.position, f2 = e3.position;
  for (; e3.input.charCodeAt(e3.position) !== 0; ) {
    let n3 = e3.position, r3 = 0;
    for (; e3.input.charCodeAt(n3 + r3) === 32; ) r3++;
    let i4 = e3.input.charCodeAt(n3 + r3);
    if (i4 === 0) {
      l2 >= 0 ? r3 > l2 && (f2 = n3 + r3) : r3 > 0 && (f2 = n3 + r3);
      break;
    }
    if (dn(e3)) break;
    if (!o3 && l2 === -1 && I(i4) && (u2 = Math.max(u2, r3)), !o3 && l2 === -1 && !I(i4) && (i4 === 9 && r3 < t3 && (e3.position = n3 + r3, F(e3, `tab characters must not be used in indentation`)), r3 >= t3 && r3 < u2 && (e3.position = n3 + r3, F(e3, `bad indentation of a mapping entry`))), l2 === -1 && i4 !== 0 && !I(i4) && r3 < t3) {
      e3.lineIndent = r3, e3.position = n3 + r3;
      break;
    }
    !o3 && i4 !== 0 && !I(i4) && l2 === -1 && (l2 = r3);
    let a3 = l2 === -1 ? t3 + 1 : l2;
    if (i4 !== 0 && !I(i4) && r3 < a3) {
      e3.lineIndent = r3, e3.position = n3 + r3;
      break;
    }
    fn(e3), f2 = e3.position, I(e3.input.charCodeAt(e3.position)) && (V(e3), f2 = e3.position);
  }
  return pn(e3, d2, f2), A(e3, d2, f2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, s4, i3, l2), true;
}
function xn(e3, t3) {
  let n2 = e3.input.charCodeAt(e3.position), r2 = t3 === O;
  if (n2 === 0 || R(n2) || n2 === 35 || n2 === 38 || n2 === 42 || n2 === 33 || n2 === 124 || n2 === 62 || n2 === 39 || n2 === 34 || n2 === 37 || n2 === 64 || n2 === 96 || B(n2)) return false;
  if (n2 === 63 || n2 === 45) {
    let t4 = e3.input.charCodeAt(e3.position + 1);
    if (z(t4) || r2 && B(t4)) return false;
  }
  return true;
}
function Sn(e3, t3, n2, r2) {
  if (!xn(e3, n2)) return false;
  let i3 = e3.position, a2 = e3.position, o3 = e3.input.charCodeAt(e3.position), s4 = n2 === O, c3 = false;
  for (; o3 !== 0 && !dn(e3); ) {
    if (o3 === 58) {
      let t4 = e3.input.charCodeAt(e3.position + 1);
      if (z(t4) || s4 && B(t4)) break;
    } else if (o3 === 35) {
      if (R(e3.input.charCodeAt(e3.position - 1))) break;
    } else if (s4 && B(o3)) break;
    else if (I(o3)) {
      let n3 = e3.position, r3 = e3.line, i4 = e3.lineStart, a3 = e3.lineIndent;
      if (H(e3, false), e3.lineIndent >= t3) {
        c3 = true, o3 = e3.input.charCodeAt(e3.position);
        continue;
      }
      e3.position = n3, e3.line = r3, e3.lineStart = i4, e3.lineIndent = a3;
      break;
    }
    L(o3) || (a2 = e3.position + 1), o3 = e3.input.charCodeAt(++e3.position);
  }
  return a2 !== i3 && (pn(e3, i3, a2), A(e3, i3, a2, r2.anchorStart, r2.anchorEnd, r2.tagStart, r2.tagEnd, b.PLAIN, S.CLIP, -1, !c3), true);
}
function W(e3, t3) {
  let n2 = e3.line;
  H(e3, true), (e3.line > n2 && e3.lineIndent < t3 || e3.firstTabInLine !== -1 && e3.lineIndent < t3) && F(e3, `deficient indentation`);
}
function Cn(e3, t3, n2) {
  let r2 = e3.input.charCodeAt(e3.position), i3 = r2 === 123, a2 = e3.position, o3 = true;
  if (r2 !== 91 && r2 !== 123) return false;
  let s4 = i3 ? 125 : 93;
  for (i3 ? tn(e3, a2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, x.FLOW) : en(e3, a2, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, x.FLOW), e3.position++; e3.input.charCodeAt(e3.position) !== 0; ) {
    W(e3, t3);
    let n3 = e3.input.charCodeAt(e3.position);
    if (n3 === s4) return e3.position++, j(e3), true;
    o3 ? n3 === 44 && F(e3, `expected the node content, but found ','`) : F(e3, `missed comma between flow collection entries`);
    let r3 = false, a3 = false;
    n3 === 63 && R(e3.input.charCodeAt(e3.position + 1)) && (r3 = a3 = true, e3.position += 1, W(e3, t3));
    let c3 = e3.line, l2 = N(e3), u2 = G(e3, t3, O, false, true);
    W(e3, t3), n3 = e3.input.charCodeAt(e3.position), (i3 || a3 || e3.line === c3) && n3 === 58 ? (r3 = true, e3.position++, W(e3, t3), i3 || nn(e3, l2), u2 || M(e3), G(e3, t3, O, false, true) || M(e3), W(e3, t3), i3 || j(e3)) : i3 && r3 ? (u2 || M(e3), M(e3)) : i3 ? M(e3) : r3 && (nn(e3, l2), u2 || M(e3), M(e3), j(e3)), n3 = e3.input.charCodeAt(e3.position), n3 === 44 ? (o3 = true, e3.position++) : o3 = false;
  }
  F(e3, `unexpected end of the stream within a flow collection`);
}
function wn(e3, t3, n2) {
  if (e3.firstTabInLine !== -1 || e3.input.charCodeAt(e3.position) !== 45 || !z(e3.input.charCodeAt(e3.position + 1))) return false;
  for (en(e3, e3.position, n2.anchorStart, n2.anchorEnd, n2.tagStart, n2.tagEnd, x.BLOCK); e3.input.charCodeAt(e3.position) === 45 && z(e3.input.charCodeAt(e3.position + 1)); ) {
    e3.firstTabInLine !== -1 && (e3.position = e3.firstTabInLine, F(e3, `tab characters must not be used in indentation`));
    let n3 = e3.line;
    e3.position++;
    let r2 = H(e3, true) > 0;
    if (e3.firstTabInLine !== -1 && e3.input.charCodeAt(e3.position) === 45 && z(e3.input.charCodeAt(e3.position + 1)) && F(e3, `bad indentation of a sequence entry`), r2 && e3.lineIndent <= t3 ? M(e3) : G(e3, t3, Ut, false, true), H(e3, true), e3.lineIndent < t3 || e3.position >= e3.length) break;
    e3.lineIndent > t3 && F(e3, `bad indentation of a sequence entry`), e3.line === n3 && e3.input.charCodeAt(e3.position) === 45 && z(e3.input.charCodeAt(e3.position + 1)) && F(e3, `bad indentation of a sequence entry`);
  }
  return j(e3), true;
}
function Tn(e3, t3, n2, r2) {
  let i3 = false, a2 = false, o3 = false, s4 = false;
  if (e3.firstTabInLine !== -1) return false;
  let c3 = e3.input.charCodeAt(e3.position);
  for (; c3 !== 0; ) {
    !i3 && e3.firstTabInLine !== -1 && (e3.position = e3.firstTabInLine, F(e3, `tab characters must not be used in indentation`));
    let l2 = e3.input.charCodeAt(e3.position + 1), u2 = e3.line;
    if ((c3 === 63 || c3 === 58) && z(l2)) o3 ||= (tn(e3, e3.position, r2.anchorStart, r2.anchorEnd, r2.tagStart, r2.tagEnd, x.BLOCK), true), c3 === 63 ? (i3 && M(e3), a2 = true, i3 = true) : (i3 || (M(e3), a2 = true), i3 = false), e3.position += 1, s4 = true;
    else {
      i3 &&= (M(e3), false);
      let t4 = N(e3);
      if (!G(e3, n2, Ht, false, true)) break;
      if (e3.line === u2) {
        for (c3 = e3.input.charCodeAt(e3.position); L(c3); ) c3 = e3.input.charCodeAt(++e3.position);
        if (c3 === 58) c3 = e3.input.charCodeAt(++e3.position), z(c3) || F(e3, `a whitespace character is expected after the key-value separator within a block mapping`), o3 ||= (e3.events.splice(t4.eventsLength, 0, { type: y.MAPPING, start: t4.position, anchorStart: r2.anchorStart, anchorEnd: r2.anchorEnd, tagStart: r2.tagStart, tagEnd: r2.tagEnd, style: x.BLOCK }), true), a2 = true, i3 = false, s4 = false;
        else if (a2) F(e3, `expected ':' after a mapping key`);
        else return r2.anchorStart !== D || r2.tagStart !== D ? (P(e3, t4), false) : true;
      } else if (a2) F(e3, `can not read a block mapping entry; a multiline key may not be an implicit key`);
      else return r2.anchorStart !== D || r2.tagStart !== D ? (P(e3, t4), false) : true;
    }
    if (G(e3, t3, k, true, s4) && (s4 = false), i3 || (s4 &&= (M(e3), false)), H(e3, true), c3 = e3.input.charCodeAt(e3.position), (e3.line === u2 || e3.lineIndent > t3) && c3 !== 0) F(e3, `bad indentation of a mapping entry`);
    else if (e3.lineIndent < t3) break;
  }
  return a2 ? (i3 && M(e3), o3 && j(e3), true) : false;
}
function G(e3, t3, n2, r2, i3, a2 = true) {
  e3.depth >= e3.maxDepth && F(e3, `nesting exceeded maxDepth (${e3.maxDepth})`), e3.depth++;
  let o3 = 1, s4 = false, c3 = false, l2 = null, u2 = an(), d2 = n2 === k || n2 === Ut, f2 = d2, p2 = d2;
  if (r2 && H(e3, true) && (s4 = true, o3 = e3.lineIndent > t3 ? 1 : e3.lineIndent === t3 ? 0 : -1), o3 === 1) for (; ; ) {
    let r3 = e3.input.charCodeAt(e3.position), i4 = N(e3);
    if (s4 && o3 !== 1 && (r3 === 33 || r3 === 38)) break;
    if (s4 && p2 && (u2.tagStart !== D || u2.anchorStart !== D) && (r3 === 33 || r3 === 38)) {
      let n3 = N(e3), r4 = t3 + 1;
      if (Tn(e3, e3.position - e3.lineStart, r4, u2) && e3.events[n3.eventsLength]?.type === y.MAPPING) return e3.depth--, true;
      P(e3, n3);
    }
    if (s4 && (r3 === 33 && u2.tagStart !== D || r3 === 38 && u2.anchorStart !== D) || !mn(e3, u2, n2 === O) && !hn(e3, u2)) break;
    l2 === null && (l2 = i4), H(e3, true) ? (s4 = true, f2 = p2, o3 = e3.lineIndent > t3 ? 1 : e3.lineIndent === t3 ? 0 : -1) : f2 = false;
  }
  if (f2 &&= s4 || i3, o3 === 1 || n2 === k) {
    let r3 = n2 === O || n2 === Ht ? t3 : t3 + 1, i4 = e3.position - e3.lineStart;
    if (o3 === 1) {
      if (f2 && (wn(e3, i4, u2) || Tn(e3, i4, r3, u2)) || Cn(e3, r3, u2)) c3 = true;
      else {
        let t4 = e3.input.charCodeAt(e3.position);
        if (l2 !== null && a2 && p2 && !f2 && t4 !== 124 && t4 !== 62) {
          let t5 = N(e3), n3 = l2.position - l2.lineStart;
          P(e3, l2), Tn(e3, n3, r3, an()) && e3.events[t5.eventsLength]?.type === y.MAPPING ? c3 = true : P(e3, t5);
        }
        !c3 && (d2 && bn(e3, r3, u2) || vn(e3, r3, u2) || yn(e3, r3, u2) || gn(e3, u2) || Sn(e3, r3, n2, u2)) && (c3 = true);
      }
    } else o3 === 0 && (c3 = f2 && wn(e3, i4, u2));
  }
  return d2 &&= !c3, !c3 && (u2.anchorStart !== D || u2.tagStart !== D || d2) && (A(e3, D, D, u2.anchorStart, u2.anchorEnd, u2.tagStart, u2.tagEnd, b.PLAIN), c3 = true), e3.depth--, c3 || u2.anchorStart !== D || u2.tagStart !== D;
}
function En(e3) {
  if (e3.lineIndent > 0 || e3.input.charCodeAt(e3.position) !== 37) return false;
  e3.position++;
  let t3 = e3.position;
  for (; e3.input.charCodeAt(e3.position) !== 0 && !R(e3.input.charCodeAt(e3.position)); ) e3.position++;
  let n2 = e3.input.slice(t3, e3.position), r2 = [];
  for (n2.length === 0 && F(e3, `directive name must not be less than one character in length`); e3.input.charCodeAt(e3.position) !== 0 && !I(e3.input.charCodeAt(e3.position)); ) {
    for (; L(e3.input.charCodeAt(e3.position)); ) e3.position++;
    if (e3.input.charCodeAt(e3.position) === 35 || I(e3.input.charCodeAt(e3.position)) || e3.input.charCodeAt(e3.position) === 0) break;
    let t4 = e3.position;
    for (; e3.input.charCodeAt(e3.position) !== 0 && !R(e3.input.charCodeAt(e3.position)); ) e3.position++;
    r2.push(e3.input.slice(t4, e3.position));
  }
  if (I(e3.input.charCodeAt(e3.position)) && V(e3), n2 === `YAML`) {
    e3.directives.some((e4) => e4.kind === `yaml`) && F(e3, `duplication of %YAML directive`), r2.length !== 1 && F(e3, `YAML directive accepts exactly one argument`);
    let t4 = /^([0-9]+)\.([0-9]+)$/.exec(r2[0]);
    t4 === null && F(e3, `ill-formed argument of the YAML directive`), parseInt(t4[1], 10) !== 1 && F(e3, `unacceptable YAML version of the document`), e3.directives.push({ kind: `yaml`, version: r2[0] });
  } else if (n2 === `TAG`) {
    r2.length !== 2 && F(e3, `TAG directive accepts exactly two arguments`);
    let [t4, n3] = r2;
    Kt.test(t4) || F(e3, `ill-formed tag handle (first argument) of the TAG directive`), Vt.call(e3.tagHandlers, t4) && F(e3, `there is a previously declared suffix for "${t4}" tag handle`), Zt.test(n3) || F(e3, `ill-formed tag prefix (second argument) of the TAG directive`), e3.tagHandlers[t4] = n3, e3.directives.push({ kind: `tag`, handle: t4, prefix: n3 });
  }
  return true;
}
function Dn(e3) {
  e3.directives = [], e3.tagHandlers = /* @__PURE__ */ Object.create(null);
  let t3 = false;
  for (H(e3, true); En(e3); ) t3 = true, H(e3, true);
  let n2 = false, r2 = false, i3 = true;
  if (e3.lineIndent === 0 && e3.input.charCodeAt(e3.position) === 45 && e3.input.charCodeAt(e3.position + 1) === 45 && e3.input.charCodeAt(e3.position + 2) === 45 && z(e3.input.charCodeAt(e3.position + 3))) {
    n2 = true;
    let t4 = e3.line;
    e3.position += 3, H(e3, true), i3 = e3.line > t4;
  } else t3 && F(e3, `directives end mark is expected`);
  let a2 = e3.events.length;
  if (!n2 && e3.position === e3.lineStart && e3.input.charCodeAt(e3.position) === 46 && U(e3)) {
    e3.position += 3, H(e3, true);
    return;
  }
  if ($t(e3, n2, false), G(e3, e3.lineIndent - 1, k, false, i3, i3) || M(e3), H(e3, true), e3.position === e3.lineStart && U(e3) && (r2 = e3.input.charCodeAt(e3.position) === 46, r2)) {
    let t4 = e3.line;
    e3.position += 3, H(e3, true), e3.line === t4 && e3.position < e3.length && F(e3, `end of the stream or a document separator is expected`);
  }
  let o3 = e3.events[a2];
  o3?.type === y.DOCUMENT && (o3.explicitEnd = r2), j(e3), !r2 && e3.position < e3.length && !dn(e3) && F(e3, `end of the stream or a document separator is expected`);
}
function On(e3, t3) {
  let n2 = e3.length, r2 = { ...Qt, ...t3, input: `${e3}\0`, length: n2, position: 0, line: 0, lineStart: 0, lineIndent: 0, firstTabInLine: -1, depth: 0, directives: [], tagHandlers: /* @__PURE__ */ Object.create(null), events: [] }, i3 = e3.indexOf(`\0`);
  for (i3 !== -1 && v.throwAt(e3, i3, `null byte is not allowed in input`, r2.filename); r2.position < r2.length && (un(r2), H(r2, true), !(r2.position >= r2.length)); ) {
    let e4 = r2.position;
    Dn(r2), r2.position === e4 && F(r2, `can not read a document`);
  }
  return r2.events;
}
function An(e3, t3 = {}) {
  let n2 = { ...kn, ...t3 }, r2 = String(e3), i3 = Object.keys(Qt), a2 = Object.keys(Ot);
  return Bt(On(r2, Ue(n2, i3)), { ...Ue(n2, a2), source: r2 });
}
function jn(e3, t3) {
  let n2 = An(e3, t3);
  if (n2.length === 0) throw new v(`expected a document, but the input is empty`);
  if (n2.length === 1) return n2[0];
  throw new v(`expected a single document in the stream, but found more`);
}
function Mn(e3) {
  let t3 = new Set([e3.defaultScalarTag, e3.defaultSequenceTag, e3.defaultMappingTag].filter((e4) => e4 !== void 0)), n2 = e3.implicitScalarTags, r2 = e3.tags.filter((e4) => !(e4.nodeKind === `scalar` && e4.implicit) && !t3.has(e4)), i3 = e3.tags.filter((e4) => t3.has(e4));
  return [...n2.map((e4) => ({ tag: e4, implicitTag: true })), ...r2.map((e4) => ({ tag: e4, implicitTag: false })), ...i3.map((e4) => ({ tag: e4, implicitTag: true }))];
}
function Nn(e3, t3) {
  for (let n2 = 0, r2 = e3.representTypes.length; n2 < r2; n2 += 1) {
    let { tag: r3, implicitTag: i3 } = e3.representTypes[n2];
    if (r3.identify(t3)) {
      let e4;
      return e4 = r3.matchByTagPrefix ? r3.representTagName(t3) : r3.tagName, { tag: r3, tagName: e4, implicitTag: i3 };
    }
  }
  return null;
}
function q(e3, t3) {
  if (!e3.noRefs && typeof t3 == `object` && t3) {
    let n3 = e3.refs.get(t3);
    if (n3) return n3.anchor === void 0 && (n3.anchor = `ref_${e3.refCounter++}`), { kind: `alias`, anchor: n3.anchor };
  }
  let n2 = Nn(e3, t3);
  if (!n2) {
    if (t3 === void 0 || e3.skipInvalid) return K;
    throw new v(`unacceptable kind of an object to dump ${Object.prototype.toString.call(t3)}`);
  }
  let { tag: r2, tagName: i3, implicitTag: a2 } = n2, o3 = a2 ? i3 : Et(i3);
  if (r2.nodeKind === `scalar`) return { kind: `scalar`, tag: o3, tagged: !a2, style: b.PLAIN, value: r2.represent(t3) };
  if (r2.nodeKind === `sequence`) {
    let n3 = r2.represent(t3), i4 = { kind: `sequence`, tag: o3, tagged: !a2, style: x.BLOCK, items: [] };
    e3.noRefs || e3.refs.set(t3, i4);
    for (let t4 = 0, r3 = n3.length; t4 < r3; t4 += 1) {
      let r4 = q(e3, n3[t4]);
      r4 === K && n3[t4] === void 0 && (r4 = q(e3, null)), r4 !== K && i4.items.push(r4);
    }
    return i4;
  }
  let s4 = r2.represent(t3), c3 = { kind: `mapping`, tag: o3, tagged: !a2, style: x.BLOCK, items: [] };
  e3.noRefs || e3.refs.set(t3, c3);
  for (let [t4, n3] of s4) {
    let r3 = q(e3, t4);
    if (r3 === K) continue;
    let i4 = q(e3, n3);
    i4 !== K && c3.items.push({ key: r3, value: i4 });
  }
  return c3;
}
function Pn(e3, t3, n2 = {}) {
  let r2 = q({ representTypes: Mn(t3), noRefs: n2.noRefs ?? false, skipInvalid: n2.skipInvalid ?? false, refs: /* @__PURE__ */ new Map(), refCounter: 0 }, e3);
  return [{ contents: r2 === K ? null : r2, directives: [] }];
}
function J(e3, t3, n2) {
  let r2 = t3(e3, n2);
  if (r2 === Fn) return true;
  if (r2 === In) return false;
  let i3 = n2.depth + 1;
  switch (e3.kind) {
    case `sequence`:
      for (let n3 of e3.items) if (J(n3, t3, { depth: i3, parent: e3, isKey: false })) return true;
      break;
    case `mapping`:
      for (let { key: n3, value: r3 } of e3.items) if (J(n3, t3, { depth: i3, parent: e3, isKey: true }) || J(r3, t3, { depth: i3, parent: e3, isKey: false })) return true;
  }
  return false;
}
function Ln(e3, t3) {
  for (let n2 of e3) if (n2.contents && J(n2.contents, t3, { depth: 0, parent: null, isKey: false })) return;
}
function Y(e3, t3) {
  return !!(e3 & 1 << t3);
}
function zn(e3) {
  return e3.presenterOptions.quoteStyle === `single` && Y(e3.allowedStylesMask, b.SINGLE_QUOTED) ? b.SINGLE_QUOTED : b.DOUBLE_QUOTED;
}
function Bn(e3) {
  e3.presenterOptions.quoteFlowKeys && e3.isKey && e3.flowOnly && e3.style === b.PLAIN && (e3.style = b.DOUBLE_QUOTED);
}
function Vn(e3) {
  e3.style === b.PLAIN && /[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e3.node.value) && (e3.style = b.DOUBLE_QUOTED);
}
function Hn(e3) {
  e3.style === b.PLAIN && /^\s+$/.test(e3.node.value) && (e3.style = b.DOUBLE_QUOTED);
}
function Un(e3) {
  e3.presenterOptions.forceQuotes && (e3.isKey || e3.style !== b.PLAIN || e3.node.tag === e3.presenterOptions.schema.defaultScalarTag.tagName && (e3.style = e3.node.value.includes(`
`) ? b.DOUBLE_QUOTED : zn(e3)));
}
function Wn(e3) {
  if (e3.style !== b.PLAIN || e3.isKey) return;
  let t3 = e3.node.value, n2 = t3.indexOf(`
`) !== -1;
  if (!Y(e3.allowedStylesMask, b.LITERAL_BLOCK)) {
    n2 && (e3.style = b.DOUBLE_QUOTED);
    return;
  }
  let r2 = e3.presenterOptions.lineWidth;
  if (r2 === -1) {
    n2 && (e3.style = b.LITERAL_BLOCK);
    return;
  }
  let i3 = Math.max(Math.min(r2, 40), r2 - e3.shiftOfContent), a2 = 0, o3 = false;
  for (; a2 <= t3.length; ) {
    let e4 = t3.length, n3 = t3.indexOf(`
`, a2);
    n3 !== -1 && (e4 = n3);
    let r3 = t3.slice(a2, e4);
    if (r3.length > i3 && r3[0] !== ` ` && / [^ \t]/.test(r3) && (o3 = true), n3 === -1) break;
    a2 = n3 + 1;
  }
  o3 ? e3.style = b.FOLDED_BLOCK : n2 && (e3.style = b.LITERAL_BLOCK);
}
function Gn(e3) {
  e3.style === b.PLAIN && !Y(e3.allowedStylesMask, b.PLAIN) && (e3.style = zn(e3));
}
function Kn(e3) {
  Y(e3.allowedStylesMask, e3.style) || (e3.style = b.DOUBLE_QUOTED);
}
function X(e3, t3) {
  return e3 | 1 << t3;
}
function Er(e3) {
  let t3 = e3.node.value;
  if (t3 !== ``) {
    if (!(e3.isKey ? e3.flowOnly ? br : yr : e3.flowOnly ? vr : _r).test(t3) || e3.shiftOfFirstLine === 0 && wr.test(t3)) return false;
    if (e3.shiftOfContent === 0) {
      let e4 = t3.indexOf(`
`);
      if (e4 !== -1) {
        let n3 = t3.slice(e4 + 1);
        if (Tr.test(n3)) return false;
      }
    }
  }
  let n2 = e3.presenterOptions.schema.resolveImplicitScalarTag(t3).tag.tagName;
  return !(!e3.node.tagged && n2 !== e3.node.tag || !e3.node.tagged && t3 === `=` && n2 === e3.presenterOptions.schema.defaultScalarTag.tagName);
}
function Dr(e3) {
  let t3 = e3.node.value;
  if (!(e3.isKey ? xr : Sr).test(t3) || /[ \t]\n|\n[ \t]/.test(t3)) return false;
  if (!e3.isKey && e3.shiftOfContent === 0) {
    let e4 = t3.indexOf(`
`);
    if (e4 !== -1 && Tr.test(t3.slice(e4 + 1))) return false;
  }
  return true;
}
function Or(e3) {
  if (e3.flowOnly || !Cr.test(e3.node.value)) return false;
  let t3 = e3.shiftOfContent - e3.shiftOfParent;
  return !(t3 < 1 || t3 > 9 && /^\n* /.test(e3.node.value) || e3.shiftOfContent === 0 && Tr.test(e3.node.value));
}
function kr(e3) {
  let t3 = X(0, b.DOUBLE_QUOTED);
  Er(e3) && (t3 = X(t3, b.PLAIN)), Dr(e3) && (t3 = X(t3, b.SINGLE_QUOTED)), Or(e3) && (t3 = X(X(t3, b.LITERAL_BLOCK), b.FOLDED_BLOCK)), e3.allowedStylesMask = t3;
}
function Ar(e3) {
  switch (e3.style) {
    case b.PLAIN:
      return jr(e3);
    case b.SINGLE_QUOTED:
      return Mr(e3);
    case b.LITERAL_BLOCK:
      return Nr(e3);
    case b.FOLDED_BLOCK:
      return Pr(e3);
    case b.DOUBLE_QUOTED:
      return Fr(e3);
  }
}
function jr(e3) {
  return Ir(e3.node.value, e3.shiftOfContent);
}
function Mr(e3) {
  return `'${Ir(e3.node.value, e3.shiftOfContent).replace(/'/g, `''`)}'`;
}
function Nr(e3) {
  let t3 = e3.node.value;
  return `|` + zr(t3, e3.shiftOfParent, e3.shiftOfContent) + Br(Lr(t3, e3.shiftOfContent));
}
function Pr(e3) {
  let t3 = e3.node.value, n2 = e3.presenterOptions.lineWidth, r2 = 1 / 0;
  return n2 !== -1 && (r2 = Math.max(Math.min(n2, 40), n2 - e3.shiftOfContent)), `>` + zr(t3, e3.shiftOfParent, e3.shiftOfContent) + Br(Lr(Ur(t3, r2), e3.shiftOfContent));
}
function Fr(e3) {
  return `"${Kr(e3.node.value)}"`;
}
function Ir(e3, t3) {
  let n2 = e3.indexOf(`
`);
  if (n2 === -1) return e3;
  let r2 = ` `.repeat(t3), i3 = e3.slice(0, n2), a2 = /(\n+)([^\n]*)/g;
  a2.lastIndex = n2;
  let o3;
  for (; o3 = a2.exec(e3); ) {
    let e4 = o3[1].length, t4 = o3[2];
    i3 += `
`.repeat(e4 + 1) + r2 + t4;
  }
  return i3;
}
function Lr(e3, t3) {
  let n2 = ` `.repeat(t3), r2 = 0, i3 = ``, a2 = e3.length;
  for (; r2 < a2; ) {
    let t4, o3 = e3.indexOf(`
`, r2);
    o3 === -1 ? (t4 = e3.slice(r2), r2 = a2) : (t4 = e3.slice(r2, o3 + 1), r2 = o3 + 1), t4.length && t4 !== `
` && (i3 += n2), i3 += t4;
  }
  return i3;
}
function Rr(e3) {
  return /^\n* /.test(e3);
}
function zr(e3, t3, n2) {
  let r2 = Rr(e3) ? String(n2 - t3) : ``, i3 = e3[e3.length - 1] === `
`;
  return `${r2}${i3 && (e3[e3.length - 2] === `
` || e3 === `
`) ? `+` : i3 ? `` : `-`}
`;
}
function Br(e3) {
  return e3[e3.length - 1] === `
` ? e3.slice(0, -1) : e3;
}
function Vr(e3) {
  return e3 === ` ` || e3 === `	`;
}
function Hr(e3, t3) {
  if (e3 === `` || Vr(e3[0])) return e3;
  let n2 = / [^ \t]/g, r2, i3 = 0, a2, o3 = 0, s4 = 0, c3 = ``;
  for (; r2 = n2.exec(e3); ) s4 = r2.index, s4 - i3 > t3 && (a2 = o3 > i3 ? o3 : s4, c3 += `
${e3.slice(i3, a2)}`, i3 = a2 + 1), o3 = s4;
  return c3 += `
`, e3.length - i3 > t3 && o3 > i3 ? c3 += `${e3.slice(i3, o3)}
${e3.slice(o3 + 1)}` : c3 += e3.slice(i3), c3.slice(1);
}
function Ur(e3, t3) {
  let n2 = /(\n+)([^\n]*)/g, r2 = e3.indexOf(`
`);
  r2 === -1 && (r2 = e3.length), n2.lastIndex = r2;
  let i3 = Hr(e3.slice(0, r2), t3), a2 = e3[0] === `
` || Vr(e3[0]), o3, s4;
  for (; s4 = n2.exec(e3); ) {
    let e4 = s4[1], n3 = s4[2];
    o3 = n3 !== `` && Vr(n3[0]), i3 += e4 + (!a2 && !o3 && n3 !== `` ? `
` : ``) + Hr(n3, t3), a2 = o3;
  }
  return i3;
}
function Gr(e3) {
  switch (e3) {
    case `\0`:
      return `\\0`;
    case `\x07`:
      return `\\a`;
    case `\b`:
      return `\\b`;
    case `	`:
      return `\\t`;
    case `
`:
      return `\\n`;
    case `\v`:
      return `\\v`;
    case `\f`:
      return `\\f`;
    case `\r`:
      return `\\r`;
    case `\x1B`:
      return `\\e`;
    case `"`:
      return `\\"`;
    case `\\`:
      return `\\\\`;
    case ``:
      return `\\N`;
    case ` `:
      return `\\_`;
    case `\u2028`:
      return `\\L`;
    case `\u2029`:
      return `\\P`;
  }
  let t3 = e3.charCodeAt(0), n2 = t3.toString(16).toUpperCase();
  return t3 <= 255 ? `\\x${`0`.repeat(2 - n2.length)}${n2}` : `\\u${`0`.repeat(4 - n2.length)}${n2}`;
}
function Kr(e3) {
  return e3.replace(Wr, Gr);
}
function Jr(e3) {
  return e3.tagged ? e3.tag : Et(e3.tag);
}
function Yr(e3) {
  let t3 = { ...qr, ...e3 };
  return t3.flowSkipColonSpace && (t3.quoteFlowKeys = true), { ...t3, defaultScalarTagName: t3.schema.defaultScalarTag.tagName, openEnded: false };
}
function Xr(e3, t3) {
  return `
${` `.repeat(e3.indent * t3)}`;
}
function Zr(e3, t3, n2, r2, i3, a2) {
  return { node: t3, parent: n2, level: r2, isKey: i3, flowOnly: a2, shiftOfParent: r2 === 0 ? -1 : e3.indent * (r2 - 1), shiftOfContent: e3.indent * Math.max(1, r2), shiftOfFirstLine: r2 === 0 ? 0 : e3.indent * r2, presenterOptions: e3, allowedStylesMask: 0, style: t3.style };
}
function Qr(e3, t3, n2) {
  let r2 = ``;
  for (let i4 = 0, a2 = n2.items.length; i4 < a2; i4 += 1) {
    let a3 = $(e3, t3, n2.items[i4], n2, {}).text;
    i4 > 0 && (r2 += `,${e3.flowSkipCommaSpace ? `` : ` `}`), r2 += a3;
  }
  let i3 = e3.flowBracketPadding && n2.items.length > 0 ? ` ` : ``;
  return `[${i3}${r2}${i3}]`;
}
function $r(e3, t3, n2, r2) {
  let i3 = ``;
  for (let a2 = 0, o3 = n2.items.length; a2 < o3; a2 += 1) {
    let o4 = $(e3, t3 + 1, n2.items[a2], n2, { block: true, compact: e3.seqInlineFirst, isblockseq: true }).text;
    r2 && i3 === `` || (i3 += Xr(e3, t3)), o4 === `` || Q === o4.charCodeAt(0) ? i3 += `-` : i3 += `- `, i3 += o4;
  }
  return i3;
}
function ei(e3, t3, n2) {
  let r2 = ``;
  for (let { key: i4, value: a2 } of n2.items) {
    let o3 = ``;
    r2 !== `` && (o3 += `,${e3.flowSkipCommaSpace ? `` : ` `}`);
    let s4 = $(e3, t3, i4, n2, { iskey: true }), c3 = s4.text, l2 = $(e3, t3, a2, n2, {}).text, u2 = e3.flowSkipColonSpace || l2 === `` ? `` : ` `, d2 = i4.kind === `scalar` && s4.noBody && (i4.tagged || i4.anchor !== void 0), f2 = i4.kind === `alias` || d2 ? ` ` : ``;
    o3 += `${c3}${f2}:${u2}${l2}`, r2 += o3;
  }
  let i3 = e3.flowBracketPadding && r2 !== `` ? ` ` : ``;
  return `{${i3}${r2}${i3}}`;
}
function ti(e3, t3, n2, r2) {
  let i3 = ``;
  for (let a2 = 0, o3 = n2.items.length; a2 < o3; a2 += 1) {
    let o4 = ``;
    r2 && i3 === `` || (o4 += Xr(e3, t3));
    let { key: s4, value: c3 } = n2.items[a2], l2 = (s4.kind === `mapping` || s4.kind === `sequence`) && s4.style === x.BLOCK && s4.items.length !== 0 || s4.kind === `scalar` && (s4.style === b.LITERAL_BLOCK || s4.style === b.FOLDED_BLOCK), u2 = l2 ? $(e3, t3 + 1, s4, n2, { block: true, compact: true, isblockseq: !ni(e3, s4, t3 + 1) }) : $(e3, t3 + 1, s4, n2, { block: true, compact: true, iskey: true }), d2 = u2.text, f2 = s4.kind === `scalar` && s4.value.indexOf(`
`) !== -1, p2 = d2.length > 1024 && /^[\s\S]{1025}/u.test(d2), m2 = l2 || f2 || p2;
    m2 && (d2 && Q === d2.charCodeAt(0) ? o4 += `?` : o4 += `? `), o4 += d2, m2 && (o4 += Xr(e3, t3));
    let h2 = $(e3, t3 + 1, c3, n2, { block: true, compact: m2, isblockseq: m2 && !ni(e3, c3, t3 + 1) }).text, ee2 = s4.kind === `scalar` && u2.noBody && (s4.tagged || s4.anchor !== void 0), te2 = !m2 && (s4.kind === `alias` || ee2) ? ` ` : ``;
    h2 === `` || Q === h2.charCodeAt(0) ? o4 += `${te2}:` : o4 += `${te2}: `, o4 += h2, i3 += o4;
  }
  return i3;
}
function ni(e3, t3, n2) {
  return t3.kind === `alias` || t3.tagged || t3.anchor !== void 0 || e3.indent < 2 && n2 > 0;
}
function $(e3, t3, n2, r2, i3) {
  if (n2.kind === `alias`) return e3.openEnded = false, { text: `*${n2.anchor}`, noBody: false };
  let { block: a2 = false, iskey: o3 = false, isblockseq: s4 = false } = i3, c3 = i3.compact ?? false, l2 = n2.anchor !== void 0;
  ni(e3, n2, t3) && (c3 = false);
  let u2, d2 = n2.tagged, f2 = a2 && (n2.kind === `mapping` || n2.kind === `sequence`) && n2.style === x.BLOCK && n2.items.length !== 0;
  if (n2.kind === `mapping`) u2 = f2 ? ti(e3, t3, n2, c3) : ei(e3, t3, n2);
  else if (n2.kind === `sequence`) u2 = f2 ? e3.seqNoIndent && !s4 && t3 > 0 ? $r(e3, t3 - 1, n2, c3) : $r(e3, t3, n2, c3) : Qr(e3, t3, n2);
  else {
    let i4 = Zr(e3, n2, r2, t3, o3, !a2);
    kr(i4);
    for (let t4 of e3.scalarStyleRules) t4(i4);
    u2 = Ar(i4), e3.openEnded = (i4.style === b.LITERAL_BLOCK || i4.style === b.FOLDED_BLOCK) && (n2.value === `
` || n2.value.endsWith(`

`)), d2 = n2.tagged || u2 === `` && i4.flowOnly && r2?.kind === `sequence` && !l2 || i4.style !== b.PLAIN && n2.tag !== e3.defaultScalarTagName;
  }
  n2.kind !== `mapping` && n2.kind !== `sequence` || f2 || (e3.openEnded = false), f2 && c3 && t3 > 0 && e3.indent > 2 && (u2 = `${` `.repeat(e3.indent - 2)}${u2}`);
  let p2 = u2 === ``, m2 = u2;
  if (d2 || l2) {
    let t4 = [], r3 = d2 ? Jr(n2) : null, i4 = l2 ? `&${n2.anchor}` : null;
    e3.tagBeforeAnchor ? (r3 !== null && t4.push(r3), i4 !== null && t4.push(i4)) : (i4 !== null && t4.push(i4), r3 !== null && t4.push(r3));
    let a3 = u2 === `` || u2.charCodeAt(0) === Q ? `` : ` `;
    m2 = `${t4.join(` `)}${a3}${u2}`;
  }
  return { text: m2, noBody: p2 };
}
function ri(e3) {
  return (e3.kind === `sequence` || e3.kind === `mapping`) && e3.style === x.BLOCK && e3.items.length !== 0 && !e3.tagged && e3.anchor === void 0;
}
function ii(e3) {
  let t3 = ``;
  for (let n2 of e3.directives) {
    if (n2.kind === `yaml`) {
      t3 += `%YAML ${n2.version}
`;
      continue;
    }
    let { handle: e4, prefix: r2 } = n2;
    t3 += `%TAG ${e4} ${r2}
`;
  }
  return t3;
}
function ai(e3, t3) {
  let n2 = Yr(t3), r2 = ``, i3 = false;
  for (let t4 = 0; t4 < e3.length; t4 += 1) {
    let a2 = e3[t4];
    n2.openEnded = false;
    let o3 = ii(a2), s4 = o3 !== ``, c3 = a2.explicitStart || s4 || t4 > 0 && !i3;
    if (r2 += o3, a2.contents === null) c3 && (r2 += `---
`);
    else if (c3) {
      let e4 = $(n2, 0, a2.contents, null, { block: true, compact: true }).text, t5 = e4 === `` ? `` : s4 || ri(a2.contents) ? `
` : ` `;
      r2 += `---${t5}${e4}
`;
    } else r2 += $(n2, 0, a2.contents, null, { block: true, compact: true }).text + `
`;
    i3 = a2.explicitEnd || n2.openEnded, i3 && (r2 += `...
`);
  }
  return r2;
}
function si(e3, t3) {
  let n2 = String(e3), r2 = String(t3);
  return n2 < r2 ? -1 : +(n2 > r2);
}
function ci(e3, t3 = {}) {
  let n2 = { ...oi, ...t3 }, r2 = Pn(e3, n2.schema, { noRefs: n2.noRefs, skipInvalid: n2.skipInvalid });
  if (n2.flowLevel >= 0 && Ln(r2, (e4, t4) => {
    if (!(t4.depth < n2.flowLevel)) return (e4.kind === `sequence` || e4.kind === `mapping`) && (e4.style = x.FLOW), In;
  }), n2.sortKeys) {
    let e4 = n2.sortKeys === true ? si : n2.sortKeys;
    Ln(r2, (t4) => {
      t4.kind === `mapping` && t4.items.sort((t5, n3) => e4(t5.key.kind === `scalar` ? t5.key.value : ``, n3.key.kind === `scalar` ? n3.key.value : ``));
    });
  }
  return n2.transform(r2), ai(r2, { ...Ue(n2, Object.keys(qr)), schema: n2.schema });
}
var e, i2, a, o, s2, c2, l, u, d, f, p, m, h, ee, te, ne, re, ie, se, ce, le, fe, pe, ge, _e, ve, xe, Se, Ce, Ee, De, Oe, je, Me, Ne, Ie, Le, Re, Ve, He, We, Ge, Ke, qe, _, Ze, Qe, $e, tt, v, y, b, x, S, ot, ct, lt, yt, bt, xt, St, T, Dt, Ot, D, Vt, O, Ht, Ut, k, Wt, Gt, Kt, qt, Jt, Yt, Xt, Zt, Qt, kn, K, Fn, In, Rn, qn, Jn, Yn, Xn, Zn, Z, Qn, $n, er, tr, nr, rr, ir, ar, or, sr, cr, lr, ur, dr, fr, pr, mr, hr, gr, _r, vr, yr, br, xr, Sr, Cr, wr, Tr, Wr, Q, qr, oi;
var init_js_yaml = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/_chunks/libs/js-yaml.mjs"() {
    init_esm();
    e = Symbol(`NOT_RESOLVED`);
    __name(t, "t");
    __name(n, "n");
    __name(r, "r");
    i2 = t(`tag:yaml.org,2002:str`, { resolve: /* @__PURE__ */ __name((e3) => e3, "resolve"), identify: /* @__PURE__ */ __name((e3) => typeof e3 == `string`, "identify") });
    a = [``, `~`, `null`, `Null`, `NULL`];
    o = t(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [``, `~`, `n`, `N`], resolve: /* @__PURE__ */ __name((t3) => a.indexOf(t3) === -1 ? e : null, "resolve"), identify: /* @__PURE__ */ __name((e3) => e3 === null, "identify"), represent: /* @__PURE__ */ __name(() => `null`, "represent") });
    s2 = t(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [`n`], resolve: /* @__PURE__ */ __name((t3, n2) => t3 === `null` || n2 && t3 === `` ? null : e, "resolve"), identify: /* @__PURE__ */ __name((e3) => e3 === null, "identify"), represent: /* @__PURE__ */ __name(() => `null`, "represent") });
    c2 = [``, `~`, `null`, `Null`, `NULL`];
    l = t(`tag:yaml.org,2002:null`, { implicit: true, implicitFirstChars: [``, `~`, `n`, `N`], resolve: /* @__PURE__ */ __name((t3) => c2.indexOf(t3) === -1 ? e : null, "resolve"), identify: /* @__PURE__ */ __name((e3) => e3 === null, "identify"), represent: /* @__PURE__ */ __name(() => `null`, "represent") });
    u = [`true`, `True`, `TRUE`];
    d = [`false`, `False`, `FALSE`];
    f = t(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`t`, `T`, `f`, `F`], resolve: /* @__PURE__ */ __name((t3) => u.indexOf(t3) !== -1 || d.indexOf(t3) === -1 && e, "resolve"), identify: /* @__PURE__ */ __name((e3) => Object.prototype.toString.call(e3) === `[object Boolean]`, "identify"), represent: /* @__PURE__ */ __name((e3) => e3 ? `true` : `false`, "represent") });
    p = [`true`];
    m = [`false`];
    h = t(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`t`, `f`], resolve: /* @__PURE__ */ __name((t3) => p.indexOf(t3) !== -1 || m.indexOf(t3) === -1 && e, "resolve"), identify: /* @__PURE__ */ __name((e3) => Object.prototype.toString.call(e3) === `[object Boolean]`, "identify"), represent: /* @__PURE__ */ __name((e3) => e3 ? `true` : `false`, "represent") });
    ee = [`true`, `True`, `TRUE`, `y`, `Y`, `yes`, `Yes`, `YES`, `on`, `On`, `ON`];
    te = [`false`, `False`, `FALSE`, `n`, `N`, `no`, `No`, `NO`, `off`, `Off`, `OFF`];
    ne = t(`tag:yaml.org,2002:bool`, { implicit: true, implicitFirstChars: [`y`, `Y`, `n`, `N`, `t`, `T`, `f`, `F`, `o`, `O`], resolve: /* @__PURE__ */ __name((t3) => ee.indexOf(t3) !== -1 || te.indexOf(t3) === -1 && e, "resolve"), identify: /* @__PURE__ */ __name((e3) => Object.prototype.toString.call(e3) === `[object Boolean]`, "identify"), represent: /* @__PURE__ */ __name((e3) => e3 ? `true` : `false`, "represent") });
    re = /* @__PURE__ */ RegExp(`^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$`);
    ie = /* @__PURE__ */ RegExp(`^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$`);
    __name(ae, "ae");
    __name(oe, "oe");
    se = t(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, `+`, ...`0123456789`], resolve: oe, identify: /* @__PURE__ */ __name((e3) => Number.isInteger(e3) && !Object.is(e3, -0) && e3.toString(10).indexOf(`e`) < 0, "identify"), represent: /* @__PURE__ */ __name((e3) => e3.toString(10), "represent") });
    ce = /* @__PURE__ */ RegExp(`^-?(?:0|[1-9][0-9]*)$`);
    le = /* @__PURE__ */ RegExp(`^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$`);
    __name(ue, "ue");
    __name(de, "de");
    fe = t(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, ...`0123456789`], resolve: de, identify: /* @__PURE__ */ __name((e3) => Number.isInteger(e3) && !Object.is(e3, -0) && e3.toString(10).indexOf(`e`) < 0, "identify"), represent: /* @__PURE__ */ __name((e3) => e3.toString(10), "represent") });
    pe = /* @__PURE__ */ RegExp(`^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$`);
    __name(me, "me");
    __name(he, "he");
    ge = t(`tag:yaml.org,2002:int`, { implicit: true, implicitFirstChars: [`-`, `+`, ...`0123456789`], resolve: he, identify: /* @__PURE__ */ __name((e3) => Number.isInteger(e3) && !Object.is(e3, -0) && e3.toString(10).indexOf(`e`) < 0, "identify"), represent: /* @__PURE__ */ __name((e3) => e3.toString(10), "represent") });
    _e = /* @__PURE__ */ RegExp(`^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    ve = /* @__PURE__ */ RegExp(`^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    __name(ye, "ye");
    __name(be, "be");
    xe = t(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, `+`, `.`, ...`0123456789`], resolve: ye, identify: /* @__PURE__ */ __name((e3) => typeof e3 == `number` && (!Number.isInteger(e3) || Object.is(e3, -0) || e3.toString(10).indexOf(`e`) >= 0), "identify"), represent: be });
    Se = /* @__PURE__ */ RegExp(`^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$`);
    Ce = /* @__PURE__ */ RegExp(`^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    __name(we, "we");
    __name(Te, "Te");
    Ee = t(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, ...`0123456789`], resolve: we, identify: /* @__PURE__ */ __name((e3) => typeof e3 == `number` && (!Number.isInteger(e3) || Object.is(e3, -0) || e3.toString(10).indexOf(`e`) >= 0), "identify"), represent: Te });
    De = /* @__PURE__ */ RegExp(`^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    Oe = /* @__PURE__ */ RegExp(`^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$`);
    __name(ke, "ke");
    __name(Ae, "Ae");
    je = t(`tag:yaml.org,2002:float`, { implicit: true, implicitFirstChars: [`-`, `+`, `.`, ...`0123456789`], resolve: ke, identify: /* @__PURE__ */ __name((e3) => typeof e3 == `number` && (!Number.isInteger(e3) || Object.is(e3, -0) || e3.toString(10).indexOf(`e`) >= 0), "identify"), represent: Ae });
    Me = t(`tag:yaml.org,2002:merge`, { implicit: true, implicitFirstChars: [`<`], resolve: /* @__PURE__ */ __name((t3, n2) => t3 === `<<` || n2 && t3 === `` ? `<<` : e, "resolve"), identify: /* @__PURE__ */ __name(() => false, "identify") });
    Ne = /^[A-Za-z0-9+/]*={0,2}$/;
    __name(Pe, "Pe");
    __name(Fe, "Fe");
    Ie = t(`tag:yaml.org,2002:binary`, { resolve: Pe, identify: /* @__PURE__ */ __name((e3) => Object.prototype.toString.call(e3) === `[object Uint8Array]`, "identify"), represent: Fe });
    Le = /* @__PURE__ */ RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$`);
    Re = /* @__PURE__ */ RegExp(`^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$`);
    __name(ze, "ze");
    __name(Be, "Be");
    Ve = t(`tag:yaml.org,2002:timestamp`, { implicit: true, implicitFirstChars: [...`0123456789`], resolve: Be, identify: /* @__PURE__ */ __name((e3) => e3 instanceof Date, "identify"), represent: /* @__PURE__ */ __name((e3) => e3.toISOString(), "represent") });
    He = n(`tag:yaml.org,2002:seq`, { create: /* @__PURE__ */ __name(() => [], "create"), addItem: /* @__PURE__ */ __name((e3, t3) => {
      e3.push(t3);
    }, "addItem"), identify: Array.isArray });
    __name(g, "g");
    __name(Ue, "Ue");
    We = n(`tag:yaml.org,2002:omap`, { create: /* @__PURE__ */ __name(() => ({ list: [], seen: /* @__PURE__ */ new Set() }), "create"), addItem: /* @__PURE__ */ __name((e3, t3) => {
      let n2;
      if (t3 instanceof Map) {
        if (t3.size !== 1) return `cannot resolve an ordered map item`;
        n2 = t3.keys().next().value;
      } else if (g(t3)) {
        let e4 = Object.keys(t3);
        if (e4.length !== 1) return `cannot resolve an ordered map item`;
        n2 = e4[0];
      } else return `cannot resolve an ordered map item`;
      return e3.seen.has(n2) ? `duplicate key in ordered map` : (e3.seen.add(n2), e3.list.push(t3), ``);
    }, "addItem"), finalize: /* @__PURE__ */ __name((e3) => e3.list, "finalize"), identify: /* @__PURE__ */ __name(() => false, "identify") });
    Ge = n(`tag:yaml.org,2002:pairs`, { create: /* @__PURE__ */ __name(() => [], "create"), addItem: /* @__PURE__ */ __name((e3, t3) => {
      if (t3 instanceof Map) return t3.size === 1 ? (e3.push(t3.entries().next().value), ``) : `cannot resolve a pairs item`;
      if (Object.prototype.toString.call(t3) !== `[object Object]`) return `cannot resolve a pairs item`;
      let n2 = t3, r2 = Object.keys(n2);
      return r2.length === 1 ? (e3.push([r2[0], n2[r2[0]]]), ``) : `cannot resolve a pairs item`;
    }, "addItem"), identify: /* @__PURE__ */ __name(() => false, "identify") });
    Ke = r(`tag:yaml.org,2002:map`, { create: /* @__PURE__ */ __name(() => ({}), "create"), identify: g, represent: /* @__PURE__ */ __name((e3) => {
      let t3 = /* @__PURE__ */ new Map();
      for (let n2 of Object.keys(e3)) t3.set(n2, e3[n2]);
      return t3;
    }, "represent"), addPair: /* @__PURE__ */ __name((e3, t3, n2) => {
      if (typeof t3 == `object` && t3) return `object-based map does not support complex keys`;
      let r2 = String(t3);
      return r2 === `__proto__` ? Object.defineProperty(e3, r2, { value: n2, enumerable: true, configurable: true, writable: true }) : e3[r2] = n2, ``;
    }, "addPair"), has: /* @__PURE__ */ __name((e3, t3) => typeof t3 == `object` && t3 ? false : Object.prototype.hasOwnProperty.call(e3, String(t3)), "has"), keys: /* @__PURE__ */ __name((e3) => Object.keys(e3), "keys"), get: /* @__PURE__ */ __name((e3, t3) => {
      let n2 = String(t3);
      return Object.prototype.hasOwnProperty.call(e3, n2) ? e3[n2] : null;
    }, "get") });
    qe = r(`tag:yaml.org,2002:set`, { create: /* @__PURE__ */ __name(() => /* @__PURE__ */ new Set(), "create"), identify: /* @__PURE__ */ __name((e3) => e3 instanceof Set, "identify"), represent: /* @__PURE__ */ __name((e3) => {
      let t3 = /* @__PURE__ */ new Map();
      for (let n2 of e3) t3.set(n2, null);
      return t3;
    }, "represent"), addPair: /* @__PURE__ */ __name((e3, t3, n2) => n2 === null ? (e3.add(t3), ``) : `cannot resolve a set item`, "addPair"), has: /* @__PURE__ */ __name((e3, t3) => e3.has(t3), "has"), keys: /* @__PURE__ */ __name((e3) => e3.keys(), "keys"), get: /* @__PURE__ */ __name(() => null, "get") });
    __name(Je, "Je");
    __name(Ye, "Ye");
    __name(Xe, "Xe");
    _ = class t2 {
      static {
        __name(this, "t");
      }
      tags;
      implicitScalarTags;
      implicitScalarByFirstChar;
      implicitScalarAnyFirstChar;
      defaultScalarTag;
      defaultSequenceTag;
      defaultMappingTag;
      exact;
      prefix;
      constructor(e3) {
        let t3 = Xe(e3), n2 = [], r2 = Je(), i3 = Ye();
        for (let e4 of t3) {
          if (e4.nodeKind === `scalar` && e4.implicit) {
            if (e4.matchByTagPrefix) throw Error(`Implicit scalar tags cannot match by tag prefix`);
            n2.push(e4);
          }
          switch (e4.nodeKind) {
            case `scalar`:
              e4.matchByTagPrefix ? i3.scalar.push(e4) : r2.scalar[e4.tagName] = e4;
              break;
            case `sequence`:
              e4.matchByTagPrefix ? i3.sequence.push(e4) : r2.sequence[e4.tagName] = e4;
              break;
            case `mapping`:
              e4.matchByTagPrefix ? i3.mapping.push(e4) : r2.mapping[e4.tagName] = e4;
          }
        }
        let a2 = n2.filter((e4) => e4.implicitFirstChars === null), o3 = /* @__PURE__ */ new Set();
        for (let e4 of n2) if (e4.implicitFirstChars !== null) for (let t4 of e4.implicitFirstChars) o3.add(t4);
        let s4 = /* @__PURE__ */ new Map();
        for (let e4 of o3) s4.set(e4, n2.filter((t4) => t4.implicitFirstChars === null || t4.implicitFirstChars.indexOf(e4) !== -1));
        let c3 = r2.scalar[`tag:yaml.org,2002:str`];
        if (!c3) throw Error(`schema does not define the default scalar tag (tag:yaml.org,2002:str)`);
        this.tags = t3, this.implicitScalarTags = n2, this.implicitScalarByFirstChar = s4, this.implicitScalarAnyFirstChar = a2, this.defaultScalarTag = c3, this.defaultSequenceTag = r2.sequence[`tag:yaml.org,2002:seq`], this.defaultMappingTag = r2.mapping[`tag:yaml.org,2002:map`], this.exact = r2, this.prefix = i3;
      }
      lookupScalarTag(e3) {
        let t3 = this.exact.scalar[e3];
        if (t3) return t3;
        for (let t4 of this.prefix.scalar) if (e3.startsWith(t4.tagName)) return t4;
      }
      lookupSequenceTag(e3) {
        let t3 = this.exact.sequence[e3];
        if (t3) return t3;
        for (let t4 of this.prefix.sequence) if (e3.startsWith(t4.tagName)) return t4;
      }
      lookupMappingTag(e3) {
        let t3 = this.exact.mapping[e3];
        if (t3) return t3;
        for (let t4 of this.prefix.mapping) if (e3.startsWith(t4.tagName)) return t4;
      }
      resolveImplicitScalarTag(t3) {
        let n2 = this.implicitScalarByFirstChar.get(t3.charAt(0)) ?? this.implicitScalarAnyFirstChar;
        for (let r3 of n2) {
          let n3 = r3.resolve(t3, false, r3.tagName);
          if (n3 !== e) return { value: n3, tag: r3 };
        }
        let r2 = this.defaultScalarTag;
        return { value: r2.resolve(t3, false, r2.tagName), tag: r2 };
      }
      withTags(...e3) {
        let n2 = [];
        for (let t3 of e3) n2 = n2.concat(t3);
        return new t2([...this.tags, ...n2]);
      }
    };
    Ze = new _([i2, He, Ke]);
    new _([...Ze.tags, s2, h, fe, Ee]);
    Qe = new _([...Ze.tags, o, f, se, xe]);
    $e = new _([...Ze.tags, l, ne, ge, je, Ve, Me, Ie, We, Ge, qe]).withTags({ ...ge, resolve: /* @__PURE__ */ __name((t3, n2, r2) => {
      let i3 = ge.resolve(t3, n2, r2);
      return i3 === e ? se.resolve(t3, n2, r2) : i3;
    }, "resolve") }, { ...je, resolve: /* @__PURE__ */ __name((t3, n2, r2) => {
      let i3 = je.resolve(t3, n2, r2);
      return i3 === e ? xe.resolve(t3, n2, r2) : i3;
    }, "resolve") });
    r(`tag:yaml.org,2002:map`, { create: /* @__PURE__ */ __name(() => /* @__PURE__ */ new Map(), "create"), addPair: /* @__PURE__ */ __name((e3, t3, n2) => (e3.set(t3, n2), ``), "addPair"), has: /* @__PURE__ */ __name((e3, t3) => e3.has(t3), "has"), keys: /* @__PURE__ */ __name((e3) => e3.keys(), "keys"), get: /* @__PURE__ */ __name((e3, t3) => e3.get(t3), "get"), identify: /* @__PURE__ */ __name((e3) => e3 instanceof Map || g(e3), "identify"), represent: /* @__PURE__ */ __name((e3) => {
      if (e3 instanceof Map) return e3;
      let t3 = /* @__PURE__ */ new Map(), n2 = e3;
      for (let e4 of Object.keys(n2)) t3.set(e4, n2[e4]);
      return t3;
    }, "represent") });
    __name(et, "et");
    r(`tag:yaml.org,2002:map`, { create: /* @__PURE__ */ __name(() => ({}), "create"), identify: g, represent: /* @__PURE__ */ __name((e3) => {
      let t3 = /* @__PURE__ */ new Map();
      for (let n2 of Object.keys(e3)) t3.set(n2, e3[n2]);
      return t3;
    }, "represent"), addPair: /* @__PURE__ */ __name((e3, t3, n2) => {
      let r2 = et(t3);
      return r2 === null ? `nested arrays are not supported inside keys` : (r2 === `__proto__` ? Object.defineProperty(e3, r2, { value: n2, enumerable: true, configurable: true, writable: true }) : e3[r2] = n2, ``);
    }, "addPair"), has: /* @__PURE__ */ __name((e3, t3) => {
      let n2 = et(t3);
      return n2 !== null && Object.prototype.hasOwnProperty.call(e3, n2);
    }, "has"), keys: /* @__PURE__ */ __name((e3) => Object.keys(e3), "keys"), get: /* @__PURE__ */ __name((e3, t3) => {
      let n2 = String(t3);
      return Object.prototype.hasOwnProperty.call(e3, n2) ? e3[n2] : null;
    }, "get") });
    tt = { maxLength: 79, indent: 1, linesBefore: 3, linesAfter: 2 };
    __name(nt, "nt");
    __name(rt, "rt");
    __name(it, "it");
    __name(at, "at");
    v = class e2 extends Error {
      static {
        __name(this, "e");
      }
      reason;
      mark;
      constructor(e3, t3) {
        super(), this.name = `YAMLException`, this.reason = e3, this.mark = t3, this.message = at(this, false), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
      }
      toString(e3) {
        return `${this.name}: ${at(this, e3)}`;
      }
      static throwAt(t3, n2, r2, i3 = ``) {
        let a2 = 0, o3 = 0;
        for (let e3 = 0; e3 < n2; e3++) {
          let n3 = t3.charCodeAt(e3);
          n3 === 10 ? (a2++, o3 = e3 + 1) : n3 === 13 && (a2++, t3.charCodeAt(e3 + 1) === 10 && e3++, o3 = e3 + 1);
        }
        let s4 = { name: i3, buffer: t3, position: n2, line: a2, column: n2 - o3 };
        throw s4.snippet = it(s4), new e2(r2, s4);
      }
    };
    y = { DOCUMENT: 1, SEQUENCE: 2, MAPPING: 3, SCALAR: 4, ALIAS: 5, POP: 6 };
    b = { PLAIN: 1, SINGLE_QUOTED: 2, DOUBLE_QUOTED: 3, LITERAL_BLOCK: 4, FOLDED_BLOCK: 5 };
    x = { BLOCK: 1, FLOW: 2 };
    S = { CLIP: 1, STRIP: 2, KEEP: 3 };
    ot = -1;
    __name(st, "st");
    ct = Array(256);
    lt = Array(256);
    for (let e3 = 0; e3 < 256; e3++) ct[e3] = +!!st(e3), lt[e3] = st(e3);
    __name(ut, "ut");
    __name(dt, "dt");
    __name(ft, "ft");
    __name(C, "C");
    __name(pt, "pt");
    __name(mt, "mt");
    __name(ht, "ht");
    __name(gt, "gt");
    __name(_t, "_t");
    __name(vt, "vt");
    yt = Object.assign(/* @__PURE__ */ Object.create(null), { "!": `!`, "!!": `tag:yaml.org,2002:` });
    bt = `-#;/?:@&=+$_.~*'()`;
    xt = bt + `!,[]`;
    St = `0123456789ABCDEF`;
    __name(w, "w");
    __name(Ct, "Ct");
    __name(wt, "wt");
    __name(Tt, "Tt");
    __name(Et, "Et");
    T = -1;
    Dt = `tag:yaml.org,2002:merge`;
    Ot = { filename: ``, schema: Qe, json: false, maxTotalMergeKeys: 1e4, maxAliases: -1 };
    __name(kt, "kt");
    __name(E, "E");
    __name(At, "At");
    __name(jt, "jt");
    __name(Mt, "Mt");
    __name(Nt, "Nt");
    __name(Pt, "Pt");
    __name(Ft, "Ft");
    __name(It, "It");
    __name(Lt, "Lt");
    __name(Rt, "Rt");
    __name(zt, "zt");
    __name(Bt, "Bt");
    D = -1;
    Vt = Object.prototype.hasOwnProperty;
    O = 1;
    Ht = 2;
    Ut = 3;
    k = 4;
    Wt = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    Gt = /[,\[\]{}]/;
    Kt = /^(?:!|!!|![0-9A-Za-z-]+!)$/;
    qt = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`;
    Jt = String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;
    Yt = RegExp(`^(?:${qt})*$`);
    Xt = RegExp(`^(?:${Jt})+$`);
    Zt = RegExp(`^(?:!(?:${qt})*|${Jt}(?:${qt})*)$`);
    Qt = { filename: ``, maxDepth: 100 };
    __name($t, "$t");
    __name(en, "en");
    __name(tn, "tn");
    __name(nn, "nn");
    __name(A, "A");
    __name(rn, "rn");
    __name(j, "j");
    __name(M, "M");
    __name(an, "an");
    __name(N, "N");
    __name(P, "P");
    __name(F, "F");
    __name(I, "I");
    __name(L, "L");
    __name(R, "R");
    __name(z, "z");
    __name(B, "B");
    __name(on, "on");
    __name(sn, "sn");
    __name(cn, "cn");
    __name(ln, "ln");
    __name(V, "V");
    __name(H, "H");
    __name(U, "U");
    __name(un, "un");
    __name(dn, "dn");
    __name(fn, "fn");
    __name(pn, "pn");
    __name(mn, "mn");
    __name(hn, "hn");
    __name(gn, "gn");
    __name(_n, "_n");
    __name(vn, "vn");
    __name(yn, "yn");
    __name(bn, "bn");
    __name(xn, "xn");
    __name(Sn, "Sn");
    __name(W, "W");
    __name(Cn, "Cn");
    __name(wn, "wn");
    __name(Tn, "Tn");
    __name(G, "G");
    __name(En, "En");
    __name(Dn, "Dn");
    __name(On, "On");
    kn = { ...Qt, ...Ot };
    __name(An, "An");
    __name(jn, "jn");
    K = Symbol(`INVALID`);
    __name(Mn, "Mn");
    __name(Nn, "Nn");
    __name(q, "q");
    __name(Pn, "Pn");
    Fn = Symbol(`visit:break`);
    In = Symbol(`visit:skip`);
    __name(J, "J");
    __name(Ln, "Ln");
    __name(Y, "Y");
    Rn = { applyQuoteFlowKeysOption: Bn, doubleQuoteForInvisibles: Vn, doubleQuoteWhitespaceOnly: Hn, applyForceQuotesOption: Un, tryLongOrMultilineAsBlock: Wn, quoteInvalidPlain: Gn, fallbackToDoubleQuoted: Kn };
    __name(zn, "zn");
    __name(Bn, "Bn");
    __name(Vn, "Vn");
    __name(Hn, "Hn");
    __name(Un, "Un");
    __name(Wn, "Wn");
    __name(Gn, "Gn");
    __name(Kn, "Kn");
    __name(X, "X");
    qn = `[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}]`;
    Jn = `[\\n\\r]`;
    Yn = `\\uFEFF`;
    Xn = `[ \\t]`;
    Zn = `(?:(?!(?:${Jn}|${Yn}))${qn})`;
    Z = `(?:(?!${Xn})${Zn})`;
    Qn = `[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]`;
    $n = `[-?:,\\[\\]{}#&*!|>'"%@\`]`;
    er = `[,\\[\\]{}]`;
    tr = Z;
    nr = `(?:(?!${er})${Z})`;
    rr = `(?:(?:(?!${$n})${Z})|[?:-](?=${tr}))`;
    ir = `(?:(?:(?!${$n})${Z})|[?:-](?=${nr}))`;
    ar = `(?:(?:(?![:#])${tr})|:(?=${tr}))#*`;
    or = `(?:(?:(?![:#])${nr})|:(?=${nr}))#*`;
    sr = `(?:${Xn}*${ar})*`;
    cr = `(?:${Xn}*${or})*`;
    lr = `${rr}#*${sr}`;
    ur = `${ir}#*${cr}`;
    dr = lr;
    fr = ur;
    pr = `\\n+${ar}${sr}`;
    mr = `\\n+${or}${cr}`;
    hr = `${lr}(?:${pr})*`;
    gr = `${ur}(?:${mr})*`;
    _r = RegExp(`^(?:${hr})$`, `u`);
    vr = RegExp(`^(?:${gr})$`, `u`);
    yr = RegExp(`^(?:${dr})$`, `u`);
    br = RegExp(`^(?:${fr})$`, `u`);
    xr = RegExp(`^(?:${Qn})*$`, `u`);
    Sr = RegExp(`^(?:${Qn}|\\n)*$`, `u`);
    Cr = RegExp(`^(?:${Zn}|\\n)*$`, `u`);
    wr = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/;
    Tr = /^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;
    __name(Er, "Er");
    __name(Dr, "Dr");
    __name(Or, "Or");
    __name(kr, "kr");
    __name(Ar, "Ar");
    __name(jr, "jr");
    __name(Mr, "Mr");
    __name(Nr, "Nr");
    __name(Pr, "Pr");
    __name(Fr, "Fr");
    __name(Ir, "Ir");
    __name(Lr, "Lr");
    __name(Rr, "Rr");
    __name(zr, "zr");
    __name(Br, "Br");
    __name(Vr, "Vr");
    __name(Hr, "Hr");
    __name(Ur, "Ur");
    Wr = /["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;
    __name(Gr, "Gr");
    __name(Kr, "Kr");
    Q = 10;
    qr = { indent: 2, seqNoIndent: false, seqInlineFirst: true, lineWidth: 80, flowBracketPadding: false, flowSkipCommaSpace: false, flowSkipColonSpace: false, quoteFlowKeys: false, quoteStyle: `single`, forceQuotes: false, scalarStyleRules: Object.keys(Rn).map((e3) => Reflect.get(Rn, e3)), tagBeforeAnchor: false };
    __name(Jr, "Jr");
    __name(Yr, "Yr");
    __name(Xr, "Xr");
    __name(Zr, "Zr");
    __name(Qr, "Qr");
    __name($r, "$r");
    __name(ei, "ei");
    __name(ti, "ti");
    __name(ni, "ni");
    __name($, "$");
    __name(ri, "ri");
    __name(ii, "ii");
    __name(ai, "ai");
    oi = { ...qr, schema: $e, skipInvalid: false, noRefs: false, flowLevel: -1, sortKeys: false, transform: /* @__PURE__ */ __name(() => {
    }, "transform") };
    __name(si, "si");
    __name(ci, "ci");
    y.DOCUMENT, y.SEQUENCE, y.MAPPING, y.SCALAR, y.ALIAS, y.POP, b.PLAIN, b.SINGLE_QUOTED, b.DOUBLE_QUOTED, b.LITERAL_BLOCK, b.FOLDED_BLOCK, x.BLOCK, x.FLOW, S.CLIP, S.STRIP, S.KEEP;
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/yaml.mjs
function o2(e3, r2) {
  let i3 = jn(i(e3), r2);
  return s(e3, i3, r2), i3;
}
function s3(t3, n2) {
  let r2 = c(t3, { preserveIndentation: false }), a2 = typeof r2.indent == `string` ? r2.indent.length : r2.indent, o3 = ci(t3, { ...n2, indent: n2?.indent || a2 || 2 });
  return r2.whitespace.start + o3.trim() + r2.whitespace.end;
}
var init_yaml = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/yaml.mjs"() {
    init_esm();
    init_format();
    init_js_yaml();
    __name(o2, "o");
    __name(s3, "s");
  }
});
init_yaml();
export {
  v as YAMLException,
  o2 as parseYAML,
  s3 as stringifyYAML
};
//# sourceMappingURL=yaml-LT2WUSGK.mjs.map
