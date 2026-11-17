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

// node_modules/confbox/dist/_chunks/libs/jsonc-parser.mjs
function e(e2, i3 = false) {
  let a3 = e2.length, o3 = 0, s = ``, c = 0, l = 16, u = 0, d2 = 0, f2 = 0, p2 = 0, m2 = 0;
  function h2(t2, n2) {
    let r4 = 0, i4 = 0;
    for (; r4 < t2 || !n2; ) {
      let t3 = e2.charCodeAt(o3);
      if (t3 >= 48 && t3 <= 57) i4 = i4 * 16 + t3 - 48;
      else if (t3 >= 65 && t3 <= 70) i4 = i4 * 16 + t3 - 65 + 10;
      else if (t3 >= 97 && t3 <= 102) i4 = i4 * 16 + t3 - 97 + 10;
      else break;
      o3++, r4++;
    }
    return r4 < t2 && (i4 = -1), i4;
  }
  __name(h2, "h");
  function g(e3) {
    o3 = e3, s = ``, c = 0, l = 16, m2 = 0;
  }
  __name(g, "g");
  function _() {
    let t2 = o3;
    if (e2.charCodeAt(o3) === 48) o3++;
    else for (o3++; o3 < e2.length && r(e2.charCodeAt(o3)); ) o3++;
    if (o3 < e2.length && e2.charCodeAt(o3) === 46) if (o3++, o3 < e2.length && r(e2.charCodeAt(o3))) for (o3++; o3 < e2.length && r(e2.charCodeAt(o3)); ) o3++;
    else return m2 = 3, e2.substring(t2, o3);
    let n2 = o3;
    if (o3 < e2.length && (e2.charCodeAt(o3) === 69 || e2.charCodeAt(o3) === 101)) if (o3++, (o3 < e2.length && e2.charCodeAt(o3) === 43 || e2.charCodeAt(o3) === 45) && o3++, o3 < e2.length && r(e2.charCodeAt(o3))) {
      for (o3++; o3 < e2.length && r(e2.charCodeAt(o3)); ) o3++;
      n2 = o3;
    } else m2 = 3;
    return e2.substring(t2, n2);
  }
  __name(_, "_");
  function v() {
    let t2 = ``, r4 = o3;
    for (; ; ) {
      if (o3 >= a3) {
        t2 += e2.substring(r4, o3), m2 = 2;
        break;
      }
      let i4 = e2.charCodeAt(o3);
      if (i4 === 34) {
        t2 += e2.substring(r4, o3), o3++;
        break;
      }
      if (i4 === 92) {
        if (t2 += e2.substring(r4, o3), o3++, o3 >= a3) {
          m2 = 2;
          break;
        }
        switch (e2.charCodeAt(o3++)) {
          case 34:
            t2 += `"`;
            break;
          case 92:
            t2 += `\\`;
            break;
          case 47:
            t2 += `/`;
            break;
          case 98:
            t2 += `\b`;
            break;
          case 102:
            t2 += `\f`;
            break;
          case 110:
            t2 += `
`;
            break;
          case 114:
            t2 += `\r`;
            break;
          case 116:
            t2 += `	`;
            break;
          case 117:
            let e3 = h2(4, true);
            e3 >= 0 ? t2 += String.fromCharCode(e3) : m2 = 4;
            break;
          default:
            m2 = 5;
        }
        r4 = o3;
        continue;
      }
      if (i4 >= 0 && i4 <= 31) if (n(i4)) {
        t2 += e2.substring(r4, o3), m2 = 2;
        break;
      } else m2 = 6;
      o3++;
    }
    return t2;
  }
  __name(v, "v");
  function y() {
    if (s = ``, m2 = 0, c = o3, d2 = u, p2 = f2, o3 >= a3) return c = a3, l = 17;
    let i4 = e2.charCodeAt(o3);
    if (t(i4)) {
      do
        o3++, s += String.fromCharCode(i4), i4 = e2.charCodeAt(o3);
      while (t(i4));
      return l = 15;
    }
    if (n(i4)) return o3++, s += String.fromCharCode(i4), i4 === 13 && e2.charCodeAt(o3) === 10 && (o3++, s += `
`), u++, f2 = o3, l = 14;
    switch (i4) {
      case 123:
        return o3++, l = 1;
      case 125:
        return o3++, l = 2;
      case 91:
        return o3++, l = 3;
      case 93:
        return o3++, l = 4;
      case 58:
        return o3++, l = 6;
      case 44:
        return o3++, l = 5;
      case 34:
        return o3++, s = v(), l = 10;
      case 47:
        let t2 = o3 - 1;
        if (e2.charCodeAt(o3 + 1) === 47) {
          for (o3 += 2; o3 < a3 && !n(e2.charCodeAt(o3)); ) o3++;
          return s = e2.substring(t2, o3), l = 12;
        }
        if (e2.charCodeAt(o3 + 1) === 42) {
          o3 += 2;
          let r4 = a3 - 1, i5 = false;
          for (; o3 < r4; ) {
            let t3 = e2.charCodeAt(o3);
            if (t3 === 42 && e2.charCodeAt(o3 + 1) === 47) {
              o3 += 2, i5 = true;
              break;
            }
            o3++, n(t3) && (t3 === 13 && e2.charCodeAt(o3) === 10 && o3++, u++, f2 = o3);
          }
          return i5 || (o3++, m2 = 1), s = e2.substring(t2, o3), l = 13;
        }
        return s += String.fromCharCode(i4), o3++, l = 16;
      case 45:
        if (s += String.fromCharCode(i4), o3++, o3 === a3 || !r(e2.charCodeAt(o3))) return l = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return s += _(), l = 11;
      default:
        for (; o3 < a3 && b(i4); ) o3++, i4 = e2.charCodeAt(o3);
        if (c !== o3) {
          switch (s = e2.substring(c, o3), s) {
            case `true`:
              return l = 8;
            case `false`:
              return l = 9;
            case `null`:
              return l = 7;
          }
          return l = 16;
        }
        return s += String.fromCharCode(i4), o3++, l = 16;
    }
  }
  __name(y, "y");
  function b(e3) {
    if (t(e3) || n(e3)) return false;
    switch (e3) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  __name(b, "b");
  function x() {
    let e3;
    do
      e3 = y();
    while (e3 >= 12 && e3 <= 15);
    return e3;
  }
  __name(x, "x");
  return { setPosition: g, getPosition: /* @__PURE__ */ __name(() => o3, "getPosition"), scan: i3 ? x : y, getToken: /* @__PURE__ */ __name(() => l, "getToken"), getTokenValue: /* @__PURE__ */ __name(() => s, "getTokenValue"), getTokenOffset: /* @__PURE__ */ __name(() => c, "getTokenOffset"), getTokenLength: /* @__PURE__ */ __name(() => o3 - c, "getTokenLength"), getTokenStartLine: /* @__PURE__ */ __name(() => d2, "getTokenStartLine"), getTokenStartCharacter: /* @__PURE__ */ __name(() => c - p2, "getTokenStartCharacter"), getTokenError: /* @__PURE__ */ __name(() => m2, "getTokenError") };
}
function t(e2) {
  return e2 === 32 || e2 === 9;
}
function n(e2) {
  return e2 === 10 || e2 === 13;
}
function r(e2) {
  return e2 >= 48 && e2 <= 57;
}
function o2(e2, t2 = [], n2 = a2.DEFAULT) {
  let r4 = null, i3 = [], o3 = [];
  function s(e3) {
    Array.isArray(i3) ? i3.push(e3) : r4 !== null && (i3[r4] = e3);
  }
  __name(s, "s");
  return d(e2, { onObjectBegin: /* @__PURE__ */ __name(() => {
    let e3 = {};
    s(e3), o3.push(i3), i3 = e3, r4 = null;
  }, "onObjectBegin"), onObjectProperty: /* @__PURE__ */ __name((e3) => {
    r4 = e3;
  }, "onObjectProperty"), onObjectEnd: /* @__PURE__ */ __name(() => {
    i3 = o3.pop();
  }, "onObjectEnd"), onArrayBegin: /* @__PURE__ */ __name(() => {
    let e3 = [];
    s(e3), o3.push(i3), i3 = e3, r4 = null;
  }, "onArrayBegin"), onArrayEnd: /* @__PURE__ */ __name(() => {
    i3 = o3.pop();
  }, "onArrayEnd"), onLiteralValue: s, onError: /* @__PURE__ */ __name((e3, n3, r5) => {
    t2.push({ error: e3, offset: n3, length: r5 });
  }, "onError") }, n2), i3[0];
}
function d(t2, n2, r4 = a2.DEFAULT) {
  let i3 = e(t2, false), o3 = [], s = 0;
  function c(e2) {
    return e2 ? () => s === 0 && e2(i3.getTokenOffset(), i3.getTokenLength(), i3.getTokenStartLine(), i3.getTokenStartCharacter()) : () => true;
  }
  __name(c, "c");
  function l(e2) {
    return e2 ? (t3) => s === 0 && e2(t3, i3.getTokenOffset(), i3.getTokenLength(), i3.getTokenStartLine(), i3.getTokenStartCharacter()) : () => true;
  }
  __name(l, "l");
  function u(e2) {
    return e2 ? (t3) => s === 0 && e2(t3, i3.getTokenOffset(), i3.getTokenLength(), i3.getTokenStartLine(), i3.getTokenStartCharacter(), () => o3.slice()) : () => true;
  }
  __name(u, "u");
  function d2(e2) {
    return e2 ? () => {
      s > 0 ? s++ : e2(i3.getTokenOffset(), i3.getTokenLength(), i3.getTokenStartLine(), i3.getTokenStartCharacter(), () => o3.slice()) === false && (s = 1);
    } : () => true;
  }
  __name(d2, "d");
  function f2(e2) {
    return e2 ? () => {
      s > 0 && s--, s === 0 && e2(i3.getTokenOffset(), i3.getTokenLength(), i3.getTokenStartLine(), i3.getTokenStartCharacter());
    } : () => true;
  }
  __name(f2, "f");
  let p2 = d2(n2.onObjectBegin), m2 = u(n2.onObjectProperty), h2 = f2(n2.onObjectEnd), g = d2(n2.onArrayBegin), _ = f2(n2.onArrayEnd), v = u(n2.onLiteralValue), y = l(n2.onSeparator), b = c(n2.onComment), x = l(n2.onError), S = r4 && r4.disallowComments, C = r4 && r4.allowTrailingComma;
  function w() {
    for (; ; ) {
      let e2 = i3.scan();
      switch (i3.getTokenError()) {
        case 4:
          T(14);
          break;
        case 5:
          T(15);
          break;
        case 3:
          T(13);
          break;
        case 1:
          S || T(11);
          break;
        case 2:
          T(12);
          break;
        case 6:
          T(16);
          break;
      }
      switch (e2) {
        case 12:
        case 13:
          S ? T(10) : b();
          break;
        case 16:
          T(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return e2;
      }
    }
  }
  __name(w, "w");
  function T(e2, t3 = [], n3 = []) {
    if (x(e2), t3.length + n3.length > 0) {
      let e3 = i3.getToken();
      for (; e3 !== 17; ) {
        if (t3.indexOf(e3) !== -1) {
          w();
          break;
        } else if (n3.indexOf(e3) !== -1) break;
        e3 = w();
      }
    }
  }
  __name(T, "T");
  function E(e2) {
    let t3 = i3.getTokenValue();
    return e2 ? v(t3) : (m2(t3), o3.push(t3)), w(), true;
  }
  __name(E, "E");
  function D() {
    switch (i3.getToken()) {
      case 11:
        let e2 = i3.getTokenValue(), t3 = Number(e2);
        isNaN(t3) && (T(2), t3 = 0), v(t3);
        break;
      case 7:
        v(null);
        break;
      case 8:
        v(true);
        break;
      case 9:
        v(false);
        break;
      default:
        return false;
    }
    return w(), true;
  }
  __name(D, "D");
  function O() {
    return i3.getToken() === 10 ? (E(false), i3.getToken() === 6 ? (y(`:`), w(), j() || T(4, [], [2, 5])) : T(5, [], [2, 5]), o3.pop(), true) : (T(3, [], [2, 5]), false);
  }
  __name(O, "O");
  function k() {
    p2(), w();
    let e2 = false;
    for (; i3.getToken() !== 2 && i3.getToken() !== 17; ) {
      if (i3.getToken() === 5) {
        if (e2 || T(4, [], []), y(`,`), w(), i3.getToken() === 2 && C) break;
      } else e2 && T(6, [], []);
      O() || T(4, [], [2, 5]), e2 = true;
    }
    return h2(), i3.getToken() === 2 ? w() : T(7, [2], []), true;
  }
  __name(k, "k");
  function A() {
    g(), w();
    let e2 = true, t3 = false;
    for (; i3.getToken() !== 4 && i3.getToken() !== 17; ) {
      if (i3.getToken() === 5) {
        if (t3 || T(4, [], []), y(`,`), w(), i3.getToken() === 4 && C) break;
      } else t3 && T(6, [], []);
      e2 ? (o3.push(0), e2 = false) : o3[o3.length - 1]++, j() || T(4, [], [4, 5]), t3 = true;
    }
    return _(), e2 || o3.pop(), i3.getToken() === 4 ? w() : T(8, [4], []), true;
  }
  __name(A, "A");
  function j() {
    switch (i3.getToken()) {
      case 3:
        return A();
      case 1:
        return k();
      case 10:
        return E(true);
      default:
        return D();
    }
  }
  __name(j, "j");
  return w(), i3.getToken() === 17 ? r4.allowEmptyContent ? true : (T(4, [], []), false) : j() ? (i3.getToken() !== 17 && T(9, [], []), true) : (T(4, [], []), false);
}
var i, a2, f, p, m, h;
var init_jsonc_parser = __esm({
  "node_modules/confbox/dist/_chunks/libs/jsonc-parser.mjs"() {
    init_esm();
    __name(e, "e");
    __name(t, "t");
    __name(n, "n");
    __name(r, "r");
    (function(e2) {
      e2[e2.lineFeed = 10] = `lineFeed`, e2[e2.carriageReturn = 13] = `carriageReturn`, e2[e2.space = 32] = `space`, e2[e2._0 = 48] = `_0`, e2[e2._1 = 49] = `_1`, e2[e2._2 = 50] = `_2`, e2[e2._3 = 51] = `_3`, e2[e2._4 = 52] = `_4`, e2[e2._5 = 53] = `_5`, e2[e2._6 = 54] = `_6`, e2[e2._7 = 55] = `_7`, e2[e2._8 = 56] = `_8`, e2[e2._9 = 57] = `_9`, e2[e2.a = 97] = `a`, e2[e2.b = 98] = `b`, e2[e2.c = 99] = `c`, e2[e2.d = 100] = `d`, e2[e2.e = 101] = `e`, e2[e2.f = 102] = `f`, e2[e2.g = 103] = `g`, e2[e2.h = 104] = `h`, e2[e2.i = 105] = `i`, e2[e2.j = 106] = `j`, e2[e2.k = 107] = `k`, e2[e2.l = 108] = `l`, e2[e2.m = 109] = `m`, e2[e2.n = 110] = `n`, e2[e2.o = 111] = `o`, e2[e2.p = 112] = `p`, e2[e2.q = 113] = `q`, e2[e2.r = 114] = `r`, e2[e2.s = 115] = `s`, e2[e2.t = 116] = `t`, e2[e2.u = 117] = `u`, e2[e2.v = 118] = `v`, e2[e2.w = 119] = `w`, e2[e2.x = 120] = `x`, e2[e2.y = 121] = `y`, e2[e2.z = 122] = `z`, e2[e2.A = 65] = `A`, e2[e2.B = 66] = `B`, e2[e2.C = 67] = `C`, e2[e2.D = 68] = `D`, e2[e2.E = 69] = `E`, e2[e2.F = 70] = `F`, e2[e2.G = 71] = `G`, e2[e2.H = 72] = `H`, e2[e2.I = 73] = `I`, e2[e2.J = 74] = `J`, e2[e2.K = 75] = `K`, e2[e2.L = 76] = `L`, e2[e2.M = 77] = `M`, e2[e2.N = 78] = `N`, e2[e2.O = 79] = `O`, e2[e2.P = 80] = `P`, e2[e2.Q = 81] = `Q`, e2[e2.R = 82] = `R`, e2[e2.S = 83] = `S`, e2[e2.T = 84] = `T`, e2[e2.U = 85] = `U`, e2[e2.V = 86] = `V`, e2[e2.W = 87] = `W`, e2[e2.X = 88] = `X`, e2[e2.Y = 89] = `Y`, e2[e2.Z = 90] = `Z`, e2[e2.asterisk = 42] = `asterisk`, e2[e2.backslash = 92] = `backslash`, e2[e2.closeBrace = 125] = `closeBrace`, e2[e2.closeBracket = 93] = `closeBracket`, e2[e2.colon = 58] = `colon`, e2[e2.comma = 44] = `comma`, e2[e2.dot = 46] = `dot`, e2[e2.doubleQuote = 34] = `doubleQuote`, e2[e2.minus = 45] = `minus`, e2[e2.openBrace = 123] = `openBrace`, e2[e2.openBracket = 91] = `openBracket`, e2[e2.plus = 43] = `plus`, e2[e2.slash = 47] = `slash`, e2[e2.formFeed = 12] = `formFeed`, e2[e2.tab = 9] = `tab`;
    })(i ||= {}), Array(20).fill(0).map((e2, t2) => ` `.repeat(t2)), Array(200).fill(0).map((e2, t2) => `
` + ` `.repeat(t2)), Array(200).fill(0).map((e2, t2) => `\r` + ` `.repeat(t2)), Array(200).fill(0).map((e2, t2) => `\r
` + ` `.repeat(t2)), Array(200).fill(0).map((e2, t2) => `
` + `	`.repeat(t2)), Array(200).fill(0).map((e2, t2) => `\r` + `	`.repeat(t2)), Array(200).fill(0).map((e2, t2) => `\r
` + `	`.repeat(t2));
    (function(e2) {
      e2.DEFAULT = { allowTrailingComma: false };
    })(a2 ||= {});
    __name(o2, "o");
    __name(d, "d");
    (function(e2) {
      e2[e2.None = 0] = `None`, e2[e2.UnexpectedEndOfComment = 1] = `UnexpectedEndOfComment`, e2[e2.UnexpectedEndOfString = 2] = `UnexpectedEndOfString`, e2[e2.UnexpectedEndOfNumber = 3] = `UnexpectedEndOfNumber`, e2[e2.InvalidUnicode = 4] = `InvalidUnicode`, e2[e2.InvalidEscapeCharacter = 5] = `InvalidEscapeCharacter`, e2[e2.InvalidCharacter = 6] = `InvalidCharacter`;
    })(f ||= {});
    (function(e2) {
      e2[e2.OpenBraceToken = 1] = `OpenBraceToken`, e2[e2.CloseBraceToken = 2] = `CloseBraceToken`, e2[e2.OpenBracketToken = 3] = `OpenBracketToken`, e2[e2.CloseBracketToken = 4] = `CloseBracketToken`, e2[e2.CommaToken = 5] = `CommaToken`, e2[e2.ColonToken = 6] = `ColonToken`, e2[e2.NullKeyword = 7] = `NullKeyword`, e2[e2.TrueKeyword = 8] = `TrueKeyword`, e2[e2.FalseKeyword = 9] = `FalseKeyword`, e2[e2.StringLiteral = 10] = `StringLiteral`, e2[e2.NumericLiteral = 11] = `NumericLiteral`, e2[e2.LineCommentTrivia = 12] = `LineCommentTrivia`, e2[e2.BlockCommentTrivia = 13] = `BlockCommentTrivia`, e2[e2.LineBreakTrivia = 14] = `LineBreakTrivia`, e2[e2.Trivia = 15] = `Trivia`, e2[e2.Unknown = 16] = `Unknown`, e2[e2.EOF = 17] = `EOF`;
    })(p ||= {});
    m = o2;
    (function(e2) {
      e2[e2.InvalidSymbol = 1] = `InvalidSymbol`, e2[e2.InvalidNumberFormat = 2] = `InvalidNumberFormat`, e2[e2.PropertyNameExpected = 3] = `PropertyNameExpected`, e2[e2.ValueExpected = 4] = `ValueExpected`, e2[e2.ColonExpected = 5] = `ColonExpected`, e2[e2.CommaExpected = 6] = `CommaExpected`, e2[e2.CloseBraceExpected = 7] = `CloseBraceExpected`, e2[e2.CloseBracketExpected = 8] = `CloseBracketExpected`, e2[e2.EndOfFileExpected = 9] = `EndOfFileExpected`, e2[e2.InvalidCommentToken = 10] = `InvalidCommentToken`, e2[e2.UnexpectedEndOfComment = 11] = `UnexpectedEndOfComment`, e2[e2.UnexpectedEndOfString = 12] = `UnexpectedEndOfString`, e2[e2.UnexpectedEndOfNumber = 13] = `UnexpectedEndOfNumber`, e2[e2.InvalidUnicode = 14] = `InvalidUnicode`, e2[e2.InvalidEscapeCharacter = 15] = `InvalidEscapeCharacter`, e2[e2.InvalidCharacter = 16] = `InvalidCharacter`;
    })(h ||= {});
  }
});

// node_modules/confbox/dist/_chunks/json.mjs
function r2(e2, n2) {
  let r4 = o(e2, n2), i3 = JSON.stringify(e2, n2?.replacer, r4.indent);
  return r4.whitespace.start + i3 + r4.whitespace.end;
}
var init_json = __esm({
  "node_modules/confbox/dist/_chunks/json.mjs"() {
    init_esm();
    init_format();
    __name(r2, "r");
  }
});

// node_modules/confbox/dist/jsonc.mjs
function r3(n2, r4) {
  let i3 = m(n2, r4?.errors, r4);
  return a(n2, i3, r4), i3;
}
function i2(e2, t2) {
  return r2(e2, t2);
}
var init_jsonc = __esm({
  "node_modules/confbox/dist/jsonc.mjs"() {
    init_esm();
    init_format();
    init_jsonc_parser();
    init_json();
    __name(r3, "r");
    __name(i2, "i");
  }
});
init_jsonc();
export {
  r3 as parseJSONC,
  i2 as stringifyJSONC
};
//# sourceMappingURL=jsonc-EP22RVAB.mjs.map
