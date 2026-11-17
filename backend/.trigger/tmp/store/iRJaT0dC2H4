import {
  __commonJS,
  __name,
  __require,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/node-fetch-native/dist/shared/node-fetch-native.DhEqb06g.cjs
var require_node_fetch_native_DhEqb06g = __commonJS({
  "node_modules/node-fetch-native/dist/shared/node-fetch-native.DhEqb06g.cjs"(exports) {
    "use strict";
    init_esm();
    var l = Object.defineProperty;
    var o = /* @__PURE__ */ __name((e, t) => l(e, "name", { value: t, configurable: true }), "o");
    var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
    function getDefaultExportFromCjs(e) {
      return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
    __name(getDefaultExportFromCjs, "getDefaultExportFromCjs");
    o(getDefaultExportFromCjs, "getDefaultExportFromCjs"), exports.commonjsGlobal = commonjsGlobal, exports.getDefaultExportFromCjs = getDefaultExportFromCjs;
  }
});

// node_modules/node-fetch-native/dist/node.cjs
var require_node = __commonJS({
  "node_modules/node-fetch-native/dist/node.cjs"(exports) {
    "use strict";
    init_esm();
    var ys = Object.defineProperty;
    var Po = /* @__PURE__ */ __name((c) => {
      throw TypeError(c);
    }, "Po");
    var u = /* @__PURE__ */ __name((c, l) => ys(c, "name", { value: l, configurable: true }), "u");
    var vo = /* @__PURE__ */ __name((c, l, d) => l.has(c) || Po("Cannot " + d), "vo");
    var D = /* @__PURE__ */ __name((c, l, d) => (vo(c, l, "read from private field"), d ? d.call(c) : l.get(c)), "D");
    var ye = /* @__PURE__ */ __name((c, l, d) => l.has(c) ? Po("Cannot add the same private member more than once") : l instanceof WeakSet ? l.add(c) : l.set(c, d), "ye");
    var ne = /* @__PURE__ */ __name((c, l, d, g) => (vo(c, l, "write to private field"), g ? g.call(c, d) : l.set(c, d), d), "ne");
    var Pe;
    var gt;
    var ot;
    var Zt;
    var Oe;
    var _t;
    var St;
    var it;
    var oe;
    var st;
    var xe;
    var Ue;
    var at;
    Object.defineProperty(exports, "__esModule", { value: true });
    var http = __require("node:http");
    var https = __require("node:https");
    var zlib = __require("node:zlib");
    var Stream = __require("node:stream");
    var require$$0 = __require("node:buffer");
    var require$$0$1 = __require("node:util");
    var _commonjsHelpers = require_node_fetch_native_DhEqb06g();
    var require$$1 = __require("node:url");
    var require$$0$2 = __require("node:net");
    var node_fs = __require("node:fs");
    var node_path = __require("node:path");
    function _interopDefaultCompat(c) {
      return c && typeof c == "object" && "default" in c ? c.default : c;
    }
    __name(_interopDefaultCompat, "_interopDefaultCompat");
    u(_interopDefaultCompat, "_interopDefaultCompat");
    var http__default = _interopDefaultCompat(http);
    var https__default = _interopDefaultCompat(https);
    var zlib__default = _interopDefaultCompat(zlib);
    var Stream__default = _interopDefaultCompat(Stream);
    function dataUriToBuffer(c) {
      if (!/^data:/i.test(c)) throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
      c = c.replace(/\r?\n/g, "");
      const l = c.indexOf(",");
      if (l === -1 || l <= 4) throw new TypeError("malformed data: URI");
      const d = c.substring(5, l).split(";");
      let g = "", b = false;
      const R = d[0] || "text/plain";
      let w = R;
      for (let I = 1; I < d.length; I++) d[I] === "base64" ? b = true : d[I] && (w += `;${d[I]}`, d[I].indexOf("charset=") === 0 && (g = d[I].substring(8)));
      !d[0] && !g.length && (w += ";charset=US-ASCII", g = "US-ASCII");
      const A = b ? "base64" : "ascii", z = unescape(c.substring(l + 1)), B = Buffer.from(z, A);
      return B.type = R, B.typeFull = w, B.charset = g, B;
    }
    __name(dataUriToBuffer, "dataUriToBuffer");
    u(dataUriToBuffer, "dataUriToBuffer");
    var streams = {};
    var ponyfill_es2018$1 = { exports: {} };
    var ponyfill_es2018 = ponyfill_es2018$1.exports;
    var hasRequiredPonyfill_es2018;
    function requirePonyfill_es2018() {
      return hasRequiredPonyfill_es2018 || (hasRequiredPonyfill_es2018 = 1, function(c, l) {
        (function(d, g) {
          g(l);
        })(ponyfill_es2018, function(d) {
          function g() {
          }
          __name(g, "g");
          u(g, "noop");
          function b(n) {
            return typeof n == "object" && n !== null || typeof n == "function";
          }
          __name(b, "b");
          u(b, "typeIsObject");
          const R = g;
          function w(n, o) {
            try {
              Object.defineProperty(n, "name", { value: o, configurable: true });
            } catch {
            }
          }
          __name(w, "w");
          u(w, "setFunctionName");
          const A = Promise, z = Promise.prototype.then, B = Promise.reject.bind(A);
          function I(n) {
            return new A(n);
          }
          __name(I, "I");
          u(I, "newPromise");
          function k(n) {
            return I((o) => o(n));
          }
          __name(k, "k");
          u(k, "promiseResolvedWith");
          function T(n) {
            return B(n);
          }
          __name(T, "T");
          u(T, "promiseRejectedWith");
          function $(n, o, a) {
            return z.call(n, o, a);
          }
          __name($, "$");
          u($, "PerformPromiseThen");
          function v(n, o, a) {
            $($(n, o, a), void 0, R);
          }
          __name(v, "v");
          u(v, "uponPromise");
          function K(n, o) {
            v(n, o);
          }
          __name(K, "K");
          u(K, "uponFulfillment");
          function U(n, o) {
            v(n, void 0, o);
          }
          __name(U, "U");
          u(U, "uponRejection");
          function N(n, o, a) {
            return $(n, o, a);
          }
          __name(N, "N");
          u(N, "transformPromiseWith");
          function J(n) {
            $(n, void 0, R);
          }
          __name(J, "J");
          u(J, "setPromiseIsHandledToTrue");
          let ge = u((n) => {
            if (typeof queueMicrotask == "function") ge = queueMicrotask;
            else {
              const o = k(void 0);
              ge = u((a) => $(o, a), "_queueMicrotask");
            }
            return ge(n);
          }, "_queueMicrotask");
          function M(n, o, a) {
            if (typeof n != "function") throw new TypeError("Argument is not a function");
            return Function.prototype.apply.call(n, o, a);
          }
          __name(M, "M");
          u(M, "reflectCall");
          function H(n, o, a) {
            try {
              return k(M(n, o, a));
            } catch (p) {
              return T(p);
            }
          }
          __name(H, "H");
          u(H, "promiseCall");
          const Y = 16384, Dr = class Dr {
            static {
              __name(this, "Dr");
            }
            constructor() {
              this._cursor = 0, this._size = 0, this._front = { _elements: [], _next: void 0 }, this._back = this._front, this._cursor = 0, this._size = 0;
            }
            get length() {
              return this._size;
            }
            push(o) {
              const a = this._back;
              let p = a;
              a._elements.length === Y - 1 && (p = { _elements: [], _next: void 0 }), a._elements.push(o), p !== a && (this._back = p, a._next = p), ++this._size;
            }
            shift() {
              const o = this._front;
              let a = o;
              const p = this._cursor;
              let y = p + 1;
              const _ = o._elements, S = _[p];
              return y === Y && (a = o._next, y = 0), --this._size, this._cursor = y, o !== a && (this._front = a), _[p] = void 0, S;
            }
            forEach(o) {
              let a = this._cursor, p = this._front, y = p._elements;
              for (; (a !== y.length || p._next !== void 0) && !(a === y.length && (p = p._next, y = p._elements, a = 0, y.length === 0)); ) o(y[a]), ++a;
            }
            peek() {
              const o = this._front, a = this._cursor;
              return o._elements[a];
            }
          };
          u(Dr, "SimpleQueue");
          let Q = Dr;
          const wt = Symbol("[[AbortSteps]]"), un = Symbol("[[ErrorSteps]]"), er = Symbol("[[CancelSteps]]"), tr = Symbol("[[PullSteps]]"), rr = Symbol("[[ReleaseSteps]]");
          function ln(n, o) {
            n._ownerReadableStream = o, o._reader = n, o._state === "readable" ? or(n) : o._state === "closed" ? Eo(n) : fn(n, o._storedError);
          }
          __name(ln, "ln");
          u(ln, "ReadableStreamReaderGenericInitialize");
          function nr(n, o) {
            const a = n._ownerReadableStream;
            return le(a, o);
          }
          __name(nr, "nr");
          u(nr, "ReadableStreamReaderGenericCancel");
          function _e(n) {
            const o = n._ownerReadableStream;
            o._state === "readable" ? ir(n, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Ao(n, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), o._readableStreamController[rr](), o._reader = void 0, n._ownerReadableStream = void 0;
          }
          __name(_e, "_e");
          u(_e, "ReadableStreamReaderGenericRelease");
          function Rt(n) {
            return new TypeError("Cannot " + n + " a stream using a released reader");
          }
          __name(Rt, "Rt");
          u(Rt, "readerLockException");
          function or(n) {
            n._closedPromise = I((o, a) => {
              n._closedPromise_resolve = o, n._closedPromise_reject = a;
            });
          }
          __name(or, "or");
          u(or, "defaultReaderClosedPromiseInitialize");
          function fn(n, o) {
            or(n), ir(n, o);
          }
          __name(fn, "fn");
          u(fn, "defaultReaderClosedPromiseInitializeAsRejected");
          function Eo(n) {
            or(n), cn(n);
          }
          __name(Eo, "Eo");
          u(Eo, "defaultReaderClosedPromiseInitializeAsResolved");
          function ir(n, o) {
            n._closedPromise_reject !== void 0 && (J(n._closedPromise), n._closedPromise_reject(o), n._closedPromise_resolve = void 0, n._closedPromise_reject = void 0);
          }
          __name(ir, "ir");
          u(ir, "defaultReaderClosedPromiseReject");
          function Ao(n, o) {
            fn(n, o);
          }
          __name(Ao, "Ao");
          u(Ao, "defaultReaderClosedPromiseResetToRejected");
          function cn(n) {
            n._closedPromise_resolve !== void 0 && (n._closedPromise_resolve(void 0), n._closedPromise_resolve = void 0, n._closedPromise_reject = void 0);
          }
          __name(cn, "cn");
          u(cn, "defaultReaderClosedPromiseResolve");
          const dn = Number.isFinite || function(n) {
            return typeof n == "number" && isFinite(n);
          }, Bo = Math.trunc || function(n) {
            return n < 0 ? Math.ceil(n) : Math.floor(n);
          };
          function qo(n) {
            return typeof n == "object" || typeof n == "function";
          }
          __name(qo, "qo");
          u(qo, "isDictionary");
          function ce(n, o) {
            if (n !== void 0 && !qo(n)) throw new TypeError(`${o} is not an object.`);
          }
          __name(ce, "ce");
          u(ce, "assertDictionary");
          function ee(n, o) {
            if (typeof n != "function") throw new TypeError(`${o} is not a function.`);
          }
          __name(ee, "ee");
          u(ee, "assertFunction");
          function ko(n) {
            return typeof n == "object" && n !== null || typeof n == "function";
          }
          __name(ko, "ko");
          u(ko, "isObject");
          function hn(n, o) {
            if (!ko(n)) throw new TypeError(`${o} is not an object.`);
          }
          __name(hn, "hn");
          u(hn, "assertObject");
          function Se(n, o, a) {
            if (n === void 0) throw new TypeError(`Parameter ${o} is required in '${a}'.`);
          }
          __name(Se, "Se");
          u(Se, "assertRequiredArgument");
          function sr(n, o, a) {
            if (n === void 0) throw new TypeError(`${o} is required in '${a}'.`);
          }
          __name(sr, "sr");
          u(sr, "assertRequiredField");
          function ar(n) {
            return Number(n);
          }
          __name(ar, "ar");
          u(ar, "convertUnrestrictedDouble");
          function pn(n) {
            return n === 0 ? 0 : n;
          }
          __name(pn, "pn");
          u(pn, "censorNegativeZero");
          function Wo(n) {
            return pn(Bo(n));
          }
          __name(Wo, "Wo");
          u(Wo, "integerPart");
          function ur(n, o) {
            const p = Number.MAX_SAFE_INTEGER;
            let y = Number(n);
            if (y = pn(y), !dn(y)) throw new TypeError(`${o} is not a finite number`);
            if (y = Wo(y), y < 0 || y > p) throw new TypeError(`${o} is outside the accepted range of 0 to ${p}, inclusive`);
            return !dn(y) || y === 0 ? 0 : y;
          }
          __name(ur, "ur");
          u(ur, "convertUnsignedLongLongWithEnforceRange");
          function lr(n, o) {
            if (!qe(n)) throw new TypeError(`${o} is not a ReadableStream.`);
          }
          __name(lr, "lr");
          u(lr, "assertReadableStream");
          function Ne(n) {
            return new de(n);
          }
          __name(Ne, "Ne");
          u(Ne, "AcquireReadableStreamDefaultReader");
          function bn(n, o) {
            n._reader._readRequests.push(o);
          }
          __name(bn, "bn");
          u(bn, "ReadableStreamAddReadRequest");
          function fr(n, o, a) {
            const y = n._reader._readRequests.shift();
            a ? y._closeSteps() : y._chunkSteps(o);
          }
          __name(fr, "fr");
          u(fr, "ReadableStreamFulfillReadRequest");
          function Tt(n) {
            return n._reader._readRequests.length;
          }
          __name(Tt, "Tt");
          u(Tt, "ReadableStreamGetNumReadRequests");
          function mn(n) {
            const o = n._reader;
            return !(o === void 0 || !ve(o));
          }
          __name(mn, "mn");
          u(mn, "ReadableStreamHasDefaultReader");
          const Mr = class Mr {
            static {
              __name(this, "Mr");
            }
            constructor(o) {
              if (Se(o, 1, "ReadableStreamDefaultReader"), lr(o, "First parameter"), ke(o)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
              ln(this, o), this._readRequests = new Q();
            }
            get closed() {
              return ve(this) ? this._closedPromise : T(Ct("closed"));
            }
            cancel(o = void 0) {
              return ve(this) ? this._ownerReadableStream === void 0 ? T(Rt("cancel")) : nr(this, o) : T(Ct("cancel"));
            }
            read() {
              if (!ve(this)) return T(Ct("read"));
              if (this._ownerReadableStream === void 0) return T(Rt("read from"));
              let o, a;
              const p = I((_, S) => {
                o = _, a = S;
              });
              return ut(this, { _chunkSteps: u((_) => o({ value: _, done: false }), "_chunkSteps"), _closeSteps: u(() => o({ value: void 0, done: true }), "_closeSteps"), _errorSteps: u((_) => a(_), "_errorSteps") }), p;
            }
            releaseLock() {
              if (!ve(this)) throw Ct("releaseLock");
              this._ownerReadableStream !== void 0 && Oo(this);
            }
          };
          u(Mr, "ReadableStreamDefaultReader");
          let de = Mr;
          Object.defineProperties(de.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), w(de.prototype.cancel, "cancel"), w(de.prototype.read, "read"), w(de.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(de.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultReader", configurable: true });
          function ve(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_readRequests") ? false : n instanceof de;
          }
          __name(ve, "ve");
          u(ve, "IsReadableStreamDefaultReader");
          function ut(n, o) {
            const a = n._ownerReadableStream;
            a._disturbed = true, a._state === "closed" ? o._closeSteps() : a._state === "errored" ? o._errorSteps(a._storedError) : a._readableStreamController[tr](o);
          }
          __name(ut, "ut");
          u(ut, "ReadableStreamDefaultReaderRead");
          function Oo(n) {
            _e(n);
            const o = new TypeError("Reader was released");
            yn(n, o);
          }
          __name(Oo, "Oo");
          u(Oo, "ReadableStreamDefaultReaderRelease");
          function yn(n, o) {
            const a = n._readRequests;
            n._readRequests = new Q(), a.forEach((p) => {
              p._errorSteps(o);
            });
          }
          __name(yn, "yn");
          u(yn, "ReadableStreamDefaultReaderErrorReadRequests");
          function Ct(n) {
            return new TypeError(`ReadableStreamDefaultReader.prototype.${n} can only be used on a ReadableStreamDefaultReader`);
          }
          __name(Ct, "Ct");
          u(Ct, "defaultReaderBrandCheckException");
          const zo = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
          }).prototype), xr = class xr {
            static {
              __name(this, "xr");
            }
            constructor(o, a) {
              this._ongoingPromise = void 0, this._isFinished = false, this._reader = o, this._preventCancel = a;
            }
            next() {
              const o = u(() => this._nextSteps(), "nextSteps");
              return this._ongoingPromise = this._ongoingPromise ? N(this._ongoingPromise, o, o) : o(), this._ongoingPromise;
            }
            return(o) {
              const a = u(() => this._returnSteps(o), "returnSteps");
              return this._ongoingPromise ? N(this._ongoingPromise, a, a) : a();
            }
            _nextSteps() {
              if (this._isFinished) return Promise.resolve({ value: void 0, done: true });
              const o = this._reader;
              let a, p;
              const y = I((S, C) => {
                a = S, p = C;
              });
              return ut(o, { _chunkSteps: u((S) => {
                this._ongoingPromise = void 0, ge(() => a({ value: S, done: false }));
              }, "_chunkSteps"), _closeSteps: u(() => {
                this._ongoingPromise = void 0, this._isFinished = true, _e(o), a({ value: void 0, done: true });
              }, "_closeSteps"), _errorSteps: u((S) => {
                this._ongoingPromise = void 0, this._isFinished = true, _e(o), p(S);
              }, "_errorSteps") }), y;
            }
            _returnSteps(o) {
              if (this._isFinished) return Promise.resolve({ value: o, done: true });
              this._isFinished = true;
              const a = this._reader;
              if (!this._preventCancel) {
                const p = nr(a, o);
                return _e(a), N(p, () => ({ value: o, done: true }));
              }
              return _e(a), k({ value: o, done: true });
            }
          };
          u(xr, "ReadableStreamAsyncIteratorImpl");
          let Pt = xr;
          const gn = { next() {
            return _n(this) ? this._asyncIteratorImpl.next() : T(Sn("next"));
          }, return(n) {
            return _n(this) ? this._asyncIteratorImpl.return(n) : T(Sn("return"));
          } };
          Object.setPrototypeOf(gn, zo);
          function Fo(n, o) {
            const a = Ne(n), p = new Pt(a, o), y = Object.create(gn);
            return y._asyncIteratorImpl = p, y;
          }
          __name(Fo, "Fo");
          u(Fo, "AcquireReadableStreamAsyncIterator");
          function _n(n) {
            if (!b(n) || !Object.prototype.hasOwnProperty.call(n, "_asyncIteratorImpl")) return false;
            try {
              return n._asyncIteratorImpl instanceof Pt;
            } catch {
              return false;
            }
          }
          __name(_n, "_n");
          u(_n, "IsReadableStreamAsyncIterator");
          function Sn(n) {
            return new TypeError(`ReadableStreamAsyncIterator.${n} can only be used on a ReadableSteamAsyncIterator`);
          }
          __name(Sn, "Sn");
          u(Sn, "streamAsyncIteratorBrandCheckException");
          const wn = Number.isNaN || function(n) {
            return n !== n;
          };
          var cr, dr, hr;
          function lt(n) {
            return n.slice();
          }
          __name(lt, "lt");
          u(lt, "CreateArrayFromList");
          function Rn(n, o, a, p, y) {
            new Uint8Array(n).set(new Uint8Array(a, p, y), o);
          }
          __name(Rn, "Rn");
          u(Rn, "CopyDataBlockBytes");
          let we = u((n) => (typeof n.transfer == "function" ? we = u((o) => o.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? we = u((o) => structuredClone(o, { transfer: [o] }), "TransferArrayBuffer") : we = u((o) => o, "TransferArrayBuffer"), we(n)), "TransferArrayBuffer"), Ee = u((n) => (typeof n.detached == "boolean" ? Ee = u((o) => o.detached, "IsDetachedBuffer") : Ee = u((o) => o.byteLength === 0, "IsDetachedBuffer"), Ee(n)), "IsDetachedBuffer");
          function Tn(n, o, a) {
            if (n.slice) return n.slice(o, a);
            const p = a - o, y = new ArrayBuffer(p);
            return Rn(y, 0, n, o, p), y;
          }
          __name(Tn, "Tn");
          u(Tn, "ArrayBufferSlice");
          function vt(n, o) {
            const a = n[o];
            if (a != null) {
              if (typeof a != "function") throw new TypeError(`${String(o)} is not a function`);
              return a;
            }
          }
          __name(vt, "vt");
          u(vt, "GetMethod");
          function Io(n) {
            const o = { [Symbol.iterator]: () => n.iterator }, a = async function* () {
              return yield* o;
            }(), p = a.next;
            return { iterator: a, nextMethod: p, done: false };
          }
          __name(Io, "Io");
          u(Io, "CreateAsyncFromSyncIterator");
          const pr = (hr = (cr = Symbol.asyncIterator) !== null && cr !== void 0 ? cr : (dr = Symbol.for) === null || dr === void 0 ? void 0 : dr.call(Symbol, "Symbol.asyncIterator")) !== null && hr !== void 0 ? hr : "@@asyncIterator";
          function Cn(n, o = "sync", a) {
            if (a === void 0) if (o === "async") {
              if (a = vt(n, pr), a === void 0) {
                const _ = vt(n, Symbol.iterator), S = Cn(n, "sync", _);
                return Io(S);
              }
            } else a = vt(n, Symbol.iterator);
            if (a === void 0) throw new TypeError("The object is not iterable");
            const p = M(a, n, []);
            if (!b(p)) throw new TypeError("The iterator method must return an object");
            const y = p.next;
            return { iterator: p, nextMethod: y, done: false };
          }
          __name(Cn, "Cn");
          u(Cn, "GetIterator");
          function jo(n) {
            const o = M(n.nextMethod, n.iterator, []);
            if (!b(o)) throw new TypeError("The iterator.next() method must return an object");
            return o;
          }
          __name(jo, "jo");
          u(jo, "IteratorNext");
          function Lo(n) {
            return !!n.done;
          }
          __name(Lo, "Lo");
          u(Lo, "IteratorComplete");
          function $o(n) {
            return n.value;
          }
          __name($o, "$o");
          u($o, "IteratorValue");
          function Do(n) {
            return !(typeof n != "number" || wn(n) || n < 0);
          }
          __name(Do, "Do");
          u(Do, "IsNonNegativeNumber");
          function Pn(n) {
            const o = Tn(n.buffer, n.byteOffset, n.byteOffset + n.byteLength);
            return new Uint8Array(o);
          }
          __name(Pn, "Pn");
          u(Pn, "CloneAsUint8Array");
          function br(n) {
            const o = n._queue.shift();
            return n._queueTotalSize -= o.size, n._queueTotalSize < 0 && (n._queueTotalSize = 0), o.value;
          }
          __name(br, "br");
          u(br, "DequeueValue");
          function mr(n, o, a) {
            if (!Do(a) || a === 1 / 0) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
            n._queue.push({ value: o, size: a }), n._queueTotalSize += a;
          }
          __name(mr, "mr");
          u(mr, "EnqueueValueWithSize");
          function Mo(n) {
            return n._queue.peek().value;
          }
          __name(Mo, "Mo");
          u(Mo, "PeekQueueValue");
          function Ae(n) {
            n._queue = new Q(), n._queueTotalSize = 0;
          }
          __name(Ae, "Ae");
          u(Ae, "ResetQueue");
          function vn(n) {
            return n === DataView;
          }
          __name(vn, "vn");
          u(vn, "isDataViewConstructor");
          function xo(n) {
            return vn(n.constructor);
          }
          __name(xo, "xo");
          u(xo, "isDataView");
          function Uo(n) {
            return vn(n) ? 1 : n.BYTES_PER_ELEMENT;
          }
          __name(Uo, "Uo");
          u(Uo, "arrayBufferViewElementSize");
          const Ur = class Ur {
            static {
              __name(this, "Ur");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            get view() {
              if (!yr(this)) throw Rr("view");
              return this._view;
            }
            respond(o) {
              if (!yr(this)) throw Rr("respond");
              if (Se(o, 1, "respond"), o = ur(o, "First parameter"), this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
              if (Ee(this._view.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
              qt(this._associatedReadableByteStreamController, o);
            }
            respondWithNewView(o) {
              if (!yr(this)) throw Rr("respondWithNewView");
              if (Se(o, 1, "respondWithNewView"), !ArrayBuffer.isView(o)) throw new TypeError("You can only respond with array buffer views");
              if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
              if (Ee(o.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
              kt(this._associatedReadableByteStreamController, o);
            }
          };
          u(Ur, "ReadableStreamBYOBRequest");
          let Re = Ur;
          Object.defineProperties(Re.prototype, { respond: { enumerable: true }, respondWithNewView: { enumerable: true }, view: { enumerable: true } }), w(Re.prototype.respond, "respond"), w(Re.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Re.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBRequest", configurable: true });
          const Nr = class Nr {
            static {
              __name(this, "Nr");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            get byobRequest() {
              if (!ze(this)) throw ct("byobRequest");
              return wr(this);
            }
            get desiredSize() {
              if (!ze(this)) throw ct("desiredSize");
              return In(this);
            }
            close() {
              if (!ze(this)) throw ct("close");
              if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
              const o = this._controlledReadableByteStream._state;
              if (o !== "readable") throw new TypeError(`The stream (in ${o} state) is not in the readable state and cannot be closed`);
              ft(this);
            }
            enqueue(o) {
              if (!ze(this)) throw ct("enqueue");
              if (Se(o, 1, "enqueue"), !ArrayBuffer.isView(o)) throw new TypeError("chunk must be an array buffer view");
              if (o.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
              if (o.buffer.byteLength === 0) throw new TypeError("chunk's buffer must have non-zero byteLength");
              if (this._closeRequested) throw new TypeError("stream is closed or draining");
              const a = this._controlledReadableByteStream._state;
              if (a !== "readable") throw new TypeError(`The stream (in ${a} state) is not in the readable state and cannot be enqueued to`);
              Bt(this, o);
            }
            error(o = void 0) {
              if (!ze(this)) throw ct("error");
              te(this, o);
            }
            [er](o) {
              En(this), Ae(this);
              const a = this._cancelAlgorithm(o);
              return At(this), a;
            }
            [tr](o) {
              const a = this._controlledReadableByteStream;
              if (this._queueTotalSize > 0) {
                Fn(this, o);
                return;
              }
              const p = this._autoAllocateChunkSize;
              if (p !== void 0) {
                let y;
                try {
                  y = new ArrayBuffer(p);
                } catch (S) {
                  o._errorSteps(S);
                  return;
                }
                const _ = { buffer: y, bufferByteLength: p, byteOffset: 0, byteLength: p, bytesFilled: 0, minimumFill: 1, elementSize: 1, viewConstructor: Uint8Array, readerType: "default" };
                this._pendingPullIntos.push(_);
              }
              bn(a, o), Fe(this);
            }
            [rr]() {
              if (this._pendingPullIntos.length > 0) {
                const o = this._pendingPullIntos.peek();
                o.readerType = "none", this._pendingPullIntos = new Q(), this._pendingPullIntos.push(o);
              }
            }
          };
          u(Nr, "ReadableByteStreamController");
          let ie = Nr;
          Object.defineProperties(ie.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, byobRequest: { enumerable: true }, desiredSize: { enumerable: true } }), w(ie.prototype.close, "close"), w(ie.prototype.enqueue, "enqueue"), w(ie.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ie.prototype, Symbol.toStringTag, { value: "ReadableByteStreamController", configurable: true });
          function ze(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_controlledReadableByteStream") ? false : n instanceof ie;
          }
          __name(ze, "ze");
          u(ze, "IsReadableByteStreamController");
          function yr(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_associatedReadableByteStreamController") ? false : n instanceof Re;
          }
          __name(yr, "yr");
          u(yr, "IsReadableStreamBYOBRequest");
          function Fe(n) {
            if (!Yo(n)) return;
            if (n._pulling) {
              n._pullAgain = true;
              return;
            }
            n._pulling = true;
            const a = n._pullAlgorithm();
            v(a, () => (n._pulling = false, n._pullAgain && (n._pullAgain = false, Fe(n)), null), (p) => (te(n, p), null));
          }
          __name(Fe, "Fe");
          u(Fe, "ReadableByteStreamControllerCallPullIfNeeded");
          function En(n) {
            _r(n), n._pendingPullIntos = new Q();
          }
          __name(En, "En");
          u(En, "ReadableByteStreamControllerClearPendingPullIntos");
          function gr(n, o) {
            let a = false;
            n._state === "closed" && (a = true);
            const p = An(o);
            o.readerType === "default" ? fr(n, p, a) : ei(n, p, a);
          }
          __name(gr, "gr");
          u(gr, "ReadableByteStreamControllerCommitPullIntoDescriptor");
          function An(n) {
            const o = n.bytesFilled, a = n.elementSize;
            return new n.viewConstructor(n.buffer, n.byteOffset, o / a);
          }
          __name(An, "An");
          u(An, "ReadableByteStreamControllerConvertPullIntoDescriptor");
          function Et(n, o, a, p) {
            n._queue.push({ buffer: o, byteOffset: a, byteLength: p }), n._queueTotalSize += p;
          }
          __name(Et, "Et");
          u(Et, "ReadableByteStreamControllerEnqueueChunkToQueue");
          function Bn(n, o, a, p) {
            let y;
            try {
              y = Tn(o, a, a + p);
            } catch (_) {
              throw te(n, _), _;
            }
            Et(n, y, 0, p);
          }
          __name(Bn, "Bn");
          u(Bn, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
          function qn(n, o) {
            o.bytesFilled > 0 && Bn(n, o.buffer, o.byteOffset, o.bytesFilled), He(n);
          }
          __name(qn, "qn");
          u(qn, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
          function kn(n, o) {
            const a = Math.min(n._queueTotalSize, o.byteLength - o.bytesFilled), p = o.bytesFilled + a;
            let y = a, _ = false;
            const S = p % o.elementSize, C = p - S;
            C >= o.minimumFill && (y = C - o.bytesFilled, _ = true);
            const q = n._queue;
            for (; y > 0; ) {
              const P = q.peek(), W = Math.min(y, P.byteLength), O = o.byteOffset + o.bytesFilled;
              Rn(o.buffer, O, P.buffer, P.byteOffset, W), P.byteLength === W ? q.shift() : (P.byteOffset += W, P.byteLength -= W), n._queueTotalSize -= W, Wn(n, W, o), y -= W;
            }
            return _;
          }
          __name(kn, "kn");
          u(kn, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
          function Wn(n, o, a) {
            a.bytesFilled += o;
          }
          __name(Wn, "Wn");
          u(Wn, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
          function On(n) {
            n._queueTotalSize === 0 && n._closeRequested ? (At(n), yt(n._controlledReadableByteStream)) : Fe(n);
          }
          __name(On, "On");
          u(On, "ReadableByteStreamControllerHandleQueueDrain");
          function _r(n) {
            n._byobRequest !== null && (n._byobRequest._associatedReadableByteStreamController = void 0, n._byobRequest._view = null, n._byobRequest = null);
          }
          __name(_r, "_r");
          u(_r, "ReadableByteStreamControllerInvalidateBYOBRequest");
          function Sr(n) {
            for (; n._pendingPullIntos.length > 0; ) {
              if (n._queueTotalSize === 0) return;
              const o = n._pendingPullIntos.peek();
              kn(n, o) && (He(n), gr(n._controlledReadableByteStream, o));
            }
          }
          __name(Sr, "Sr");
          u(Sr, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
          function No(n) {
            const o = n._controlledReadableByteStream._reader;
            for (; o._readRequests.length > 0; ) {
              if (n._queueTotalSize === 0) return;
              const a = o._readRequests.shift();
              Fn(n, a);
            }
          }
          __name(No, "No");
          u(No, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
          function Ho(n, o, a, p) {
            const y = n._controlledReadableByteStream, _ = o.constructor, S = Uo(_), { byteOffset: C, byteLength: q } = o, P = a * S;
            let W;
            try {
              W = we(o.buffer);
            } catch (j) {
              p._errorSteps(j);
              return;
            }
            const O = { buffer: W, bufferByteLength: W.byteLength, byteOffset: C, byteLength: q, bytesFilled: 0, minimumFill: P, elementSize: S, viewConstructor: _, readerType: "byob" };
            if (n._pendingPullIntos.length > 0) {
              n._pendingPullIntos.push(O), $n(y, p);
              return;
            }
            if (y._state === "closed") {
              const j = new _(O.buffer, O.byteOffset, 0);
              p._closeSteps(j);
              return;
            }
            if (n._queueTotalSize > 0) {
              if (kn(n, O)) {
                const j = An(O);
                On(n), p._chunkSteps(j);
                return;
              }
              if (n._closeRequested) {
                const j = new TypeError("Insufficient bytes to fill elements in the given buffer");
                te(n, j), p._errorSteps(j);
                return;
              }
            }
            n._pendingPullIntos.push(O), $n(y, p), Fe(n);
          }
          __name(Ho, "Ho");
          u(Ho, "ReadableByteStreamControllerPullInto");
          function Vo(n, o) {
            o.readerType === "none" && He(n);
            const a = n._controlledReadableByteStream;
            if (Tr(a)) for (; Dn(a) > 0; ) {
              const p = He(n);
              gr(a, p);
            }
          }
          __name(Vo, "Vo");
          u(Vo, "ReadableByteStreamControllerRespondInClosedState");
          function Qo(n, o, a) {
            if (Wn(n, o, a), a.readerType === "none") {
              qn(n, a), Sr(n);
              return;
            }
            if (a.bytesFilled < a.minimumFill) return;
            He(n);
            const p = a.bytesFilled % a.elementSize;
            if (p > 0) {
              const y = a.byteOffset + a.bytesFilled;
              Bn(n, a.buffer, y - p, p);
            }
            a.bytesFilled -= p, gr(n._controlledReadableByteStream, a), Sr(n);
          }
          __name(Qo, "Qo");
          u(Qo, "ReadableByteStreamControllerRespondInReadableState");
          function zn(n, o) {
            const a = n._pendingPullIntos.peek();
            _r(n), n._controlledReadableByteStream._state === "closed" ? Vo(n, a) : Qo(n, o, a), Fe(n);
          }
          __name(zn, "zn");
          u(zn, "ReadableByteStreamControllerRespondInternal");
          function He(n) {
            return n._pendingPullIntos.shift();
          }
          __name(He, "He");
          u(He, "ReadableByteStreamControllerShiftPendingPullInto");
          function Yo(n) {
            const o = n._controlledReadableByteStream;
            return o._state !== "readable" || n._closeRequested || !n._started ? false : !!(mn(o) && Tt(o) > 0 || Tr(o) && Dn(o) > 0 || In(n) > 0);
          }
          __name(Yo, "Yo");
          u(Yo, "ReadableByteStreamControllerShouldCallPull");
          function At(n) {
            n._pullAlgorithm = void 0, n._cancelAlgorithm = void 0;
          }
          __name(At, "At");
          u(At, "ReadableByteStreamControllerClearAlgorithms");
          function ft(n) {
            const o = n._controlledReadableByteStream;
            if (!(n._closeRequested || o._state !== "readable")) {
              if (n._queueTotalSize > 0) {
                n._closeRequested = true;
                return;
              }
              if (n._pendingPullIntos.length > 0) {
                const a = n._pendingPullIntos.peek();
                if (a.bytesFilled % a.elementSize !== 0) {
                  const p = new TypeError("Insufficient bytes to fill elements in the given buffer");
                  throw te(n, p), p;
                }
              }
              At(n), yt(o);
            }
          }
          __name(ft, "ft");
          u(ft, "ReadableByteStreamControllerClose");
          function Bt(n, o) {
            const a = n._controlledReadableByteStream;
            if (n._closeRequested || a._state !== "readable") return;
            const { buffer: p, byteOffset: y, byteLength: _ } = o;
            if (Ee(p)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
            const S = we(p);
            if (n._pendingPullIntos.length > 0) {
              const C = n._pendingPullIntos.peek();
              if (Ee(C.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
              _r(n), C.buffer = we(C.buffer), C.readerType === "none" && qn(n, C);
            }
            if (mn(a)) if (No(n), Tt(a) === 0) Et(n, S, y, _);
            else {
              n._pendingPullIntos.length > 0 && He(n);
              const C = new Uint8Array(S, y, _);
              fr(a, C, false);
            }
            else Tr(a) ? (Et(n, S, y, _), Sr(n)) : Et(n, S, y, _);
            Fe(n);
          }
          __name(Bt, "Bt");
          u(Bt, "ReadableByteStreamControllerEnqueue");
          function te(n, o) {
            const a = n._controlledReadableByteStream;
            a._state === "readable" && (En(n), Ae(n), At(n), fo(a, o));
          }
          __name(te, "te");
          u(te, "ReadableByteStreamControllerError");
          function Fn(n, o) {
            const a = n._queue.shift();
            n._queueTotalSize -= a.byteLength, On(n);
            const p = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
            o._chunkSteps(p);
          }
          __name(Fn, "Fn");
          u(Fn, "ReadableByteStreamControllerFillReadRequestFromQueue");
          function wr(n) {
            if (n._byobRequest === null && n._pendingPullIntos.length > 0) {
              const o = n._pendingPullIntos.peek(), a = new Uint8Array(o.buffer, o.byteOffset + o.bytesFilled, o.byteLength - o.bytesFilled), p = Object.create(Re.prototype);
              Zo(p, n, a), n._byobRequest = p;
            }
            return n._byobRequest;
          }
          __name(wr, "wr");
          u(wr, "ReadableByteStreamControllerGetBYOBRequest");
          function In(n) {
            const o = n._controlledReadableByteStream._state;
            return o === "errored" ? null : o === "closed" ? 0 : n._strategyHWM - n._queueTotalSize;
          }
          __name(In, "In");
          u(In, "ReadableByteStreamControllerGetDesiredSize");
          function qt(n, o) {
            const a = n._pendingPullIntos.peek();
            if (n._controlledReadableByteStream._state === "closed") {
              if (o !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            } else {
              if (o === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
              if (a.bytesFilled + o > a.byteLength) throw new RangeError("bytesWritten out of range");
            }
            a.buffer = we(a.buffer), zn(n, o);
          }
          __name(qt, "qt");
          u(qt, "ReadableByteStreamControllerRespond");
          function kt(n, o) {
            const a = n._pendingPullIntos.peek();
            if (n._controlledReadableByteStream._state === "closed") {
              if (o.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            } else if (o.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            if (a.byteOffset + a.bytesFilled !== o.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
            if (a.bufferByteLength !== o.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
            if (a.bytesFilled + o.byteLength > a.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
            const y = o.byteLength;
            a.buffer = we(o.buffer), zn(n, y);
          }
          __name(kt, "kt");
          u(kt, "ReadableByteStreamControllerRespondWithNewView");
          function jn(n, o, a, p, y, _, S) {
            o._controlledReadableByteStream = n, o._pullAgain = false, o._pulling = false, o._byobRequest = null, o._queue = o._queueTotalSize = void 0, Ae(o), o._closeRequested = false, o._started = false, o._strategyHWM = _, o._pullAlgorithm = p, o._cancelAlgorithm = y, o._autoAllocateChunkSize = S, o._pendingPullIntos = new Q(), n._readableStreamController = o;
            const C = a();
            v(k(C), () => (o._started = true, Fe(o), null), (q) => (te(o, q), null));
          }
          __name(jn, "jn");
          u(jn, "SetUpReadableByteStreamController");
          function Go(n, o, a) {
            const p = Object.create(ie.prototype);
            let y, _, S;
            o.start !== void 0 ? y = u(() => o.start(p), "startAlgorithm") : y = u(() => {
            }, "startAlgorithm"), o.pull !== void 0 ? _ = u(() => o.pull(p), "pullAlgorithm") : _ = u(() => k(void 0), "pullAlgorithm"), o.cancel !== void 0 ? S = u((q) => o.cancel(q), "cancelAlgorithm") : S = u(() => k(void 0), "cancelAlgorithm");
            const C = o.autoAllocateChunkSize;
            if (C === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
            jn(n, p, y, _, S, a, C);
          }
          __name(Go, "Go");
          u(Go, "SetUpReadableByteStreamControllerFromUnderlyingSource");
          function Zo(n, o, a) {
            n._associatedReadableByteStreamController = o, n._view = a;
          }
          __name(Zo, "Zo");
          u(Zo, "SetUpReadableStreamBYOBRequest");
          function Rr(n) {
            return new TypeError(`ReadableStreamBYOBRequest.prototype.${n} can only be used on a ReadableStreamBYOBRequest`);
          }
          __name(Rr, "Rr");
          u(Rr, "byobRequestBrandCheckException");
          function ct(n) {
            return new TypeError(`ReadableByteStreamController.prototype.${n} can only be used on a ReadableByteStreamController`);
          }
          __name(ct, "ct");
          u(ct, "byteStreamControllerBrandCheckException");
          function Ko(n, o) {
            ce(n, o);
            const a = n?.mode;
            return { mode: a === void 0 ? void 0 : Jo(a, `${o} has member 'mode' that`) };
          }
          __name(Ko, "Ko");
          u(Ko, "convertReaderOptions");
          function Jo(n, o) {
            if (n = `${n}`, n !== "byob") throw new TypeError(`${o} '${n}' is not a valid enumeration value for ReadableStreamReaderMode`);
            return n;
          }
          __name(Jo, "Jo");
          u(Jo, "convertReadableStreamReaderMode");
          function Xo(n, o) {
            var a;
            ce(n, o);
            const p = (a = n?.min) !== null && a !== void 0 ? a : 1;
            return { min: ur(p, `${o} has member 'min' that`) };
          }
          __name(Xo, "Xo");
          u(Xo, "convertByobReadOptions");
          function Ln(n) {
            return new he(n);
          }
          __name(Ln, "Ln");
          u(Ln, "AcquireReadableStreamBYOBReader");
          function $n(n, o) {
            n._reader._readIntoRequests.push(o);
          }
          __name($n, "$n");
          u($n, "ReadableStreamAddReadIntoRequest");
          function ei(n, o, a) {
            const y = n._reader._readIntoRequests.shift();
            a ? y._closeSteps(o) : y._chunkSteps(o);
          }
          __name(ei, "ei");
          u(ei, "ReadableStreamFulfillReadIntoRequest");
          function Dn(n) {
            return n._reader._readIntoRequests.length;
          }
          __name(Dn, "Dn");
          u(Dn, "ReadableStreamGetNumReadIntoRequests");
          function Tr(n) {
            const o = n._reader;
            return !(o === void 0 || !Ie(o));
          }
          __name(Tr, "Tr");
          u(Tr, "ReadableStreamHasBYOBReader");
          const Hr = class Hr {
            static {
              __name(this, "Hr");
            }
            constructor(o) {
              if (Se(o, 1, "ReadableStreamBYOBReader"), lr(o, "First parameter"), ke(o)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
              if (!ze(o._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
              ln(this, o), this._readIntoRequests = new Q();
            }
            get closed() {
              return Ie(this) ? this._closedPromise : T(Wt("closed"));
            }
            cancel(o = void 0) {
              return Ie(this) ? this._ownerReadableStream === void 0 ? T(Rt("cancel")) : nr(this, o) : T(Wt("cancel"));
            }
            read(o, a = {}) {
              if (!Ie(this)) return T(Wt("read"));
              if (!ArrayBuffer.isView(o)) return T(new TypeError("view must be an array buffer view"));
              if (o.byteLength === 0) return T(new TypeError("view must have non-zero byteLength"));
              if (o.buffer.byteLength === 0) return T(new TypeError("view's buffer must have non-zero byteLength"));
              if (Ee(o.buffer)) return T(new TypeError("view's buffer has been detached"));
              let p;
              try {
                p = Xo(a, "options");
              } catch (P) {
                return T(P);
              }
              const y = p.min;
              if (y === 0) return T(new TypeError("options.min must be greater than 0"));
              if (xo(o)) {
                if (y > o.byteLength) return T(new RangeError("options.min must be less than or equal to view's byteLength"));
              } else if (y > o.length) return T(new RangeError("options.min must be less than or equal to view's length"));
              if (this._ownerReadableStream === void 0) return T(Rt("read from"));
              let _, S;
              const C = I((P, W) => {
                _ = P, S = W;
              });
              return Mn(this, o, y, { _chunkSteps: u((P) => _({ value: P, done: false }), "_chunkSteps"), _closeSteps: u((P) => _({ value: P, done: true }), "_closeSteps"), _errorSteps: u((P) => S(P), "_errorSteps") }), C;
            }
            releaseLock() {
              if (!Ie(this)) throw Wt("releaseLock");
              this._ownerReadableStream !== void 0 && ti(this);
            }
          };
          u(Hr, "ReadableStreamBYOBReader");
          let he = Hr;
          Object.defineProperties(he.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), w(he.prototype.cancel, "cancel"), w(he.prototype.read, "read"), w(he.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(he.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBReader", configurable: true });
          function Ie(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_readIntoRequests") ? false : n instanceof he;
          }
          __name(Ie, "Ie");
          u(Ie, "IsReadableStreamBYOBReader");
          function Mn(n, o, a, p) {
            const y = n._ownerReadableStream;
            y._disturbed = true, y._state === "errored" ? p._errorSteps(y._storedError) : Ho(y._readableStreamController, o, a, p);
          }
          __name(Mn, "Mn");
          u(Mn, "ReadableStreamBYOBReaderRead");
          function ti(n) {
            _e(n);
            const o = new TypeError("Reader was released");
            xn(n, o);
          }
          __name(ti, "ti");
          u(ti, "ReadableStreamBYOBReaderRelease");
          function xn(n, o) {
            const a = n._readIntoRequests;
            n._readIntoRequests = new Q(), a.forEach((p) => {
              p._errorSteps(o);
            });
          }
          __name(xn, "xn");
          u(xn, "ReadableStreamBYOBReaderErrorReadIntoRequests");
          function Wt(n) {
            return new TypeError(`ReadableStreamBYOBReader.prototype.${n} can only be used on a ReadableStreamBYOBReader`);
          }
          __name(Wt, "Wt");
          u(Wt, "byobReaderBrandCheckException");
          function dt(n, o) {
            const { highWaterMark: a } = n;
            if (a === void 0) return o;
            if (wn(a) || a < 0) throw new RangeError("Invalid highWaterMark");
            return a;
          }
          __name(dt, "dt");
          u(dt, "ExtractHighWaterMark");
          function Ot(n) {
            const { size: o } = n;
            return o || (() => 1);
          }
          __name(Ot, "Ot");
          u(Ot, "ExtractSizeAlgorithm");
          function zt(n, o) {
            ce(n, o);
            const a = n?.highWaterMark, p = n?.size;
            return { highWaterMark: a === void 0 ? void 0 : ar(a), size: p === void 0 ? void 0 : ri(p, `${o} has member 'size' that`) };
          }
          __name(zt, "zt");
          u(zt, "convertQueuingStrategy");
          function ri(n, o) {
            return ee(n, o), (a) => ar(n(a));
          }
          __name(ri, "ri");
          u(ri, "convertQueuingStrategySize");
          function ni(n, o) {
            ce(n, o);
            const a = n?.abort, p = n?.close, y = n?.start, _ = n?.type, S = n?.write;
            return { abort: a === void 0 ? void 0 : oi(a, n, `${o} has member 'abort' that`), close: p === void 0 ? void 0 : ii(p, n, `${o} has member 'close' that`), start: y === void 0 ? void 0 : si(y, n, `${o} has member 'start' that`), write: S === void 0 ? void 0 : ai(S, n, `${o} has member 'write' that`), type: _ };
          }
          __name(ni, "ni");
          u(ni, "convertUnderlyingSink");
          function oi(n, o, a) {
            return ee(n, a), (p) => H(n, o, [p]);
          }
          __name(oi, "oi");
          u(oi, "convertUnderlyingSinkAbortCallback");
          function ii(n, o, a) {
            return ee(n, a), () => H(n, o, []);
          }
          __name(ii, "ii");
          u(ii, "convertUnderlyingSinkCloseCallback");
          function si(n, o, a) {
            return ee(n, a), (p) => M(n, o, [p]);
          }
          __name(si, "si");
          u(si, "convertUnderlyingSinkStartCallback");
          function ai(n, o, a) {
            return ee(n, a), (p, y) => H(n, o, [p, y]);
          }
          __name(ai, "ai");
          u(ai, "convertUnderlyingSinkWriteCallback");
          function Un(n, o) {
            if (!Ve(n)) throw new TypeError(`${o} is not a WritableStream.`);
          }
          __name(Un, "Un");
          u(Un, "assertWritableStream");
          function ui(n) {
            if (typeof n != "object" || n === null) return false;
            try {
              return typeof n.aborted == "boolean";
            } catch {
              return false;
            }
          }
          __name(ui, "ui");
          u(ui, "isAbortSignal");
          const li = typeof AbortController == "function";
          function fi() {
            if (li) return new AbortController();
          }
          __name(fi, "fi");
          u(fi, "createAbortController");
          const Vr = class Vr {
            static {
              __name(this, "Vr");
            }
            constructor(o = {}, a = {}) {
              o === void 0 ? o = null : hn(o, "First parameter");
              const p = zt(a, "Second parameter"), y = ni(o, "First parameter");
              if (Hn(this), y.type !== void 0) throw new RangeError("Invalid type is specified");
              const S = Ot(p), C = dt(p, 1);
              Ci(this, y, C, S);
            }
            get locked() {
              if (!Ve(this)) throw $t("locked");
              return Qe(this);
            }
            abort(o = void 0) {
              return Ve(this) ? Qe(this) ? T(new TypeError("Cannot abort a stream that already has a writer")) : Ft(this, o) : T($t("abort"));
            }
            close() {
              return Ve(this) ? Qe(this) ? T(new TypeError("Cannot close a stream that already has a writer")) : be(this) ? T(new TypeError("Cannot close an already-closing stream")) : Vn(this) : T($t("close"));
            }
            getWriter() {
              if (!Ve(this)) throw $t("getWriter");
              return Nn(this);
            }
          };
          u(Vr, "WritableStream");
          let pe = Vr;
          Object.defineProperties(pe.prototype, { abort: { enumerable: true }, close: { enumerable: true }, getWriter: { enumerable: true }, locked: { enumerable: true } }), w(pe.prototype.abort, "abort"), w(pe.prototype.close, "close"), w(pe.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, { value: "WritableStream", configurable: true });
          function Nn(n) {
            return new se(n);
          }
          __name(Nn, "Nn");
          u(Nn, "AcquireWritableStreamDefaultWriter");
          function ci(n, o, a, p, y = 1, _ = () => 1) {
            const S = Object.create(pe.prototype);
            Hn(S);
            const C = Object.create(Be.prototype);
            return Jn(S, C, n, o, a, p, y, _), S;
          }
          __name(ci, "ci");
          u(ci, "CreateWritableStream");
          function Hn(n) {
            n._state = "writable", n._storedError = void 0, n._writer = void 0, n._writableStreamController = void 0, n._writeRequests = new Q(), n._inFlightWriteRequest = void 0, n._closeRequest = void 0, n._inFlightCloseRequest = void 0, n._pendingAbortRequest = void 0, n._backpressure = false;
          }
          __name(Hn, "Hn");
          u(Hn, "InitializeWritableStream");
          function Ve(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_writableStreamController") ? false : n instanceof pe;
          }
          __name(Ve, "Ve");
          u(Ve, "IsWritableStream");
          function Qe(n) {
            return n._writer !== void 0;
          }
          __name(Qe, "Qe");
          u(Qe, "IsWritableStreamLocked");
          function Ft(n, o) {
            var a;
            if (n._state === "closed" || n._state === "errored") return k(void 0);
            n._writableStreamController._abortReason = o, (a = n._writableStreamController._abortController) === null || a === void 0 || a.abort(o);
            const p = n._state;
            if (p === "closed" || p === "errored") return k(void 0);
            if (n._pendingAbortRequest !== void 0) return n._pendingAbortRequest._promise;
            let y = false;
            p === "erroring" && (y = true, o = void 0);
            const _ = I((S, C) => {
              n._pendingAbortRequest = { _promise: void 0, _resolve: S, _reject: C, _reason: o, _wasAlreadyErroring: y };
            });
            return n._pendingAbortRequest._promise = _, y || Pr(n, o), _;
          }
          __name(Ft, "Ft");
          u(Ft, "WritableStreamAbort");
          function Vn(n) {
            const o = n._state;
            if (o === "closed" || o === "errored") return T(new TypeError(`The stream (in ${o} state) is not in the writable state and cannot be closed`));
            const a = I((y, _) => {
              const S = { _resolve: y, _reject: _ };
              n._closeRequest = S;
            }), p = n._writer;
            return p !== void 0 && n._backpressure && o === "writable" && Or(p), Pi(n._writableStreamController), a;
          }
          __name(Vn, "Vn");
          u(Vn, "WritableStreamClose");
          function di(n) {
            return I((a, p) => {
              const y = { _resolve: a, _reject: p };
              n._writeRequests.push(y);
            });
          }
          __name(di, "di");
          u(di, "WritableStreamAddWriteRequest");
          function Cr(n, o) {
            if (n._state === "writable") {
              Pr(n, o);
              return;
            }
            vr(n);
          }
          __name(Cr, "Cr");
          u(Cr, "WritableStreamDealWithRejection");
          function Pr(n, o) {
            const a = n._writableStreamController;
            n._state = "erroring", n._storedError = o;
            const p = n._writer;
            p !== void 0 && Yn(p, o), !yi(n) && a._started && vr(n);
          }
          __name(Pr, "Pr");
          u(Pr, "WritableStreamStartErroring");
          function vr(n) {
            n._state = "errored", n._writableStreamController[un]();
            const o = n._storedError;
            if (n._writeRequests.forEach((y) => {
              y._reject(o);
            }), n._writeRequests = new Q(), n._pendingAbortRequest === void 0) {
              It(n);
              return;
            }
            const a = n._pendingAbortRequest;
            if (n._pendingAbortRequest = void 0, a._wasAlreadyErroring) {
              a._reject(o), It(n);
              return;
            }
            const p = n._writableStreamController[wt](a._reason);
            v(p, () => (a._resolve(), It(n), null), (y) => (a._reject(y), It(n), null));
          }
          __name(vr, "vr");
          u(vr, "WritableStreamFinishErroring");
          function hi(n) {
            n._inFlightWriteRequest._resolve(void 0), n._inFlightWriteRequest = void 0;
          }
          __name(hi, "hi");
          u(hi, "WritableStreamFinishInFlightWrite");
          function pi(n, o) {
            n._inFlightWriteRequest._reject(o), n._inFlightWriteRequest = void 0, Cr(n, o);
          }
          __name(pi, "pi");
          u(pi, "WritableStreamFinishInFlightWriteWithError");
          function bi(n) {
            n._inFlightCloseRequest._resolve(void 0), n._inFlightCloseRequest = void 0, n._state === "erroring" && (n._storedError = void 0, n._pendingAbortRequest !== void 0 && (n._pendingAbortRequest._resolve(), n._pendingAbortRequest = void 0)), n._state = "closed";
            const a = n._writer;
            a !== void 0 && ro(a);
          }
          __name(bi, "bi");
          u(bi, "WritableStreamFinishInFlightClose");
          function mi(n, o) {
            n._inFlightCloseRequest._reject(o), n._inFlightCloseRequest = void 0, n._pendingAbortRequest !== void 0 && (n._pendingAbortRequest._reject(o), n._pendingAbortRequest = void 0), Cr(n, o);
          }
          __name(mi, "mi");
          u(mi, "WritableStreamFinishInFlightCloseWithError");
          function be(n) {
            return !(n._closeRequest === void 0 && n._inFlightCloseRequest === void 0);
          }
          __name(be, "be");
          u(be, "WritableStreamCloseQueuedOrInFlight");
          function yi(n) {
            return !(n._inFlightWriteRequest === void 0 && n._inFlightCloseRequest === void 0);
          }
          __name(yi, "yi");
          u(yi, "WritableStreamHasOperationMarkedInFlight");
          function gi(n) {
            n._inFlightCloseRequest = n._closeRequest, n._closeRequest = void 0;
          }
          __name(gi, "gi");
          u(gi, "WritableStreamMarkCloseRequestInFlight");
          function _i(n) {
            n._inFlightWriteRequest = n._writeRequests.shift();
          }
          __name(_i, "_i");
          u(_i, "WritableStreamMarkFirstWriteRequestInFlight");
          function It(n) {
            n._closeRequest !== void 0 && (n._closeRequest._reject(n._storedError), n._closeRequest = void 0);
            const o = n._writer;
            o !== void 0 && kr(o, n._storedError);
          }
          __name(It, "It");
          u(It, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
          function Er(n, o) {
            const a = n._writer;
            a !== void 0 && o !== n._backpressure && (o ? Wi(a) : Or(a)), n._backpressure = o;
          }
          __name(Er, "Er");
          u(Er, "WritableStreamUpdateBackpressure");
          const Qr = class Qr {
            static {
              __name(this, "Qr");
            }
            constructor(o) {
              if (Se(o, 1, "WritableStreamDefaultWriter"), Un(o, "First parameter"), Qe(o)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
              this._ownerWritableStream = o, o._writer = this;
              const a = o._state;
              if (a === "writable") !be(o) && o._backpressure ? Mt(this) : no(this), Dt(this);
              else if (a === "erroring") Wr(this, o._storedError), Dt(this);
              else if (a === "closed") no(this), qi(this);
              else {
                const p = o._storedError;
                Wr(this, p), to(this, p);
              }
            }
            get closed() {
              return je(this) ? this._closedPromise : T(Le("closed"));
            }
            get desiredSize() {
              if (!je(this)) throw Le("desiredSize");
              if (this._ownerWritableStream === void 0) throw pt("desiredSize");
              return Ti(this);
            }
            get ready() {
              return je(this) ? this._readyPromise : T(Le("ready"));
            }
            abort(o = void 0) {
              return je(this) ? this._ownerWritableStream === void 0 ? T(pt("abort")) : Si(this, o) : T(Le("abort"));
            }
            close() {
              if (!je(this)) return T(Le("close"));
              const o = this._ownerWritableStream;
              return o === void 0 ? T(pt("close")) : be(o) ? T(new TypeError("Cannot close an already-closing stream")) : Qn(this);
            }
            releaseLock() {
              if (!je(this)) throw Le("releaseLock");
              this._ownerWritableStream !== void 0 && Gn(this);
            }
            write(o = void 0) {
              return je(this) ? this._ownerWritableStream === void 0 ? T(pt("write to")) : Zn(this, o) : T(Le("write"));
            }
          };
          u(Qr, "WritableStreamDefaultWriter");
          let se = Qr;
          Object.defineProperties(se.prototype, { abort: { enumerable: true }, close: { enumerable: true }, releaseLock: { enumerable: true }, write: { enumerable: true }, closed: { enumerable: true }, desiredSize: { enumerable: true }, ready: { enumerable: true } }), w(se.prototype.abort, "abort"), w(se.prototype.close, "close"), w(se.prototype.releaseLock, "releaseLock"), w(se.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(se.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultWriter", configurable: true });
          function je(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_ownerWritableStream") ? false : n instanceof se;
          }
          __name(je, "je");
          u(je, "IsWritableStreamDefaultWriter");
          function Si(n, o) {
            const a = n._ownerWritableStream;
            return Ft(a, o);
          }
          __name(Si, "Si");
          u(Si, "WritableStreamDefaultWriterAbort");
          function Qn(n) {
            const o = n._ownerWritableStream;
            return Vn(o);
          }
          __name(Qn, "Qn");
          u(Qn, "WritableStreamDefaultWriterClose");
          function wi(n) {
            const o = n._ownerWritableStream, a = o._state;
            return be(o) || a === "closed" ? k(void 0) : a === "errored" ? T(o._storedError) : Qn(n);
          }
          __name(wi, "wi");
          u(wi, "WritableStreamDefaultWriterCloseWithErrorPropagation");
          function Ri(n, o) {
            n._closedPromiseState === "pending" ? kr(n, o) : ki(n, o);
          }
          __name(Ri, "Ri");
          u(Ri, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
          function Yn(n, o) {
            n._readyPromiseState === "pending" ? oo(n, o) : Oi(n, o);
          }
          __name(Yn, "Yn");
          u(Yn, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
          function Ti(n) {
            const o = n._ownerWritableStream, a = o._state;
            return a === "errored" || a === "erroring" ? null : a === "closed" ? 0 : Xn(o._writableStreamController);
          }
          __name(Ti, "Ti");
          u(Ti, "WritableStreamDefaultWriterGetDesiredSize");
          function Gn(n) {
            const o = n._ownerWritableStream, a = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
            Yn(n, a), Ri(n, a), o._writer = void 0, n._ownerWritableStream = void 0;
          }
          __name(Gn, "Gn");
          u(Gn, "WritableStreamDefaultWriterRelease");
          function Zn(n, o) {
            const a = n._ownerWritableStream, p = a._writableStreamController, y = vi(p, o);
            if (a !== n._ownerWritableStream) return T(pt("write to"));
            const _ = a._state;
            if (_ === "errored") return T(a._storedError);
            if (be(a) || _ === "closed") return T(new TypeError("The stream is closing or closed and cannot be written to"));
            if (_ === "erroring") return T(a._storedError);
            const S = di(a);
            return Ei(p, o, y), S;
          }
          __name(Zn, "Zn");
          u(Zn, "WritableStreamDefaultWriterWrite");
          const Kn = {}, Yr = class Yr {
            static {
              __name(this, "Yr");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            get abortReason() {
              if (!Ar(this)) throw qr("abortReason");
              return this._abortReason;
            }
            get signal() {
              if (!Ar(this)) throw qr("signal");
              if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
              return this._abortController.signal;
            }
            error(o = void 0) {
              if (!Ar(this)) throw qr("error");
              this._controlledWritableStream._state === "writable" && eo(this, o);
            }
            [wt](o) {
              const a = this._abortAlgorithm(o);
              return jt(this), a;
            }
            [un]() {
              Ae(this);
            }
          };
          u(Yr, "WritableStreamDefaultController");
          let Be = Yr;
          Object.defineProperties(Be.prototype, { abortReason: { enumerable: true }, signal: { enumerable: true }, error: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Be.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultController", configurable: true });
          function Ar(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_controlledWritableStream") ? false : n instanceof Be;
          }
          __name(Ar, "Ar");
          u(Ar, "IsWritableStreamDefaultController");
          function Jn(n, o, a, p, y, _, S, C) {
            o._controlledWritableStream = n, n._writableStreamController = o, o._queue = void 0, o._queueTotalSize = void 0, Ae(o), o._abortReason = void 0, o._abortController = fi(), o._started = false, o._strategySizeAlgorithm = C, o._strategyHWM = S, o._writeAlgorithm = p, o._closeAlgorithm = y, o._abortAlgorithm = _;
            const q = Br(o);
            Er(n, q);
            const P = a(), W = k(P);
            v(W, () => (o._started = true, Lt(o), null), (O) => (o._started = true, Cr(n, O), null));
          }
          __name(Jn, "Jn");
          u(Jn, "SetUpWritableStreamDefaultController");
          function Ci(n, o, a, p) {
            const y = Object.create(Be.prototype);
            let _, S, C, q;
            o.start !== void 0 ? _ = u(() => o.start(y), "startAlgorithm") : _ = u(() => {
            }, "startAlgorithm"), o.write !== void 0 ? S = u((P) => o.write(P, y), "writeAlgorithm") : S = u(() => k(void 0), "writeAlgorithm"), o.close !== void 0 ? C = u(() => o.close(), "closeAlgorithm") : C = u(() => k(void 0), "closeAlgorithm"), o.abort !== void 0 ? q = u((P) => o.abort(P), "abortAlgorithm") : q = u(() => k(void 0), "abortAlgorithm"), Jn(n, y, _, S, C, q, a, p);
          }
          __name(Ci, "Ci");
          u(Ci, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
          function jt(n) {
            n._writeAlgorithm = void 0, n._closeAlgorithm = void 0, n._abortAlgorithm = void 0, n._strategySizeAlgorithm = void 0;
          }
          __name(jt, "jt");
          u(jt, "WritableStreamDefaultControllerClearAlgorithms");
          function Pi(n) {
            mr(n, Kn, 0), Lt(n);
          }
          __name(Pi, "Pi");
          u(Pi, "WritableStreamDefaultControllerClose");
          function vi(n, o) {
            try {
              return n._strategySizeAlgorithm(o);
            } catch (a) {
              return ht(n, a), 1;
            }
          }
          __name(vi, "vi");
          u(vi, "WritableStreamDefaultControllerGetChunkSize");
          function Xn(n) {
            return n._strategyHWM - n._queueTotalSize;
          }
          __name(Xn, "Xn");
          u(Xn, "WritableStreamDefaultControllerGetDesiredSize");
          function Ei(n, o, a) {
            try {
              mr(n, o, a);
            } catch (y) {
              ht(n, y);
              return;
            }
            const p = n._controlledWritableStream;
            if (!be(p) && p._state === "writable") {
              const y = Br(n);
              Er(p, y);
            }
            Lt(n);
          }
          __name(Ei, "Ei");
          u(Ei, "WritableStreamDefaultControllerWrite");
          function Lt(n) {
            const o = n._controlledWritableStream;
            if (!n._started || o._inFlightWriteRequest !== void 0) return;
            if (o._state === "erroring") {
              vr(o);
              return;
            }
            if (n._queue.length === 0) return;
            const p = Mo(n);
            p === Kn ? Ai(n) : Bi(n, p);
          }
          __name(Lt, "Lt");
          u(Lt, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
          function ht(n, o) {
            n._controlledWritableStream._state === "writable" && eo(n, o);
          }
          __name(ht, "ht");
          u(ht, "WritableStreamDefaultControllerErrorIfNeeded");
          function Ai(n) {
            const o = n._controlledWritableStream;
            gi(o), br(n);
            const a = n._closeAlgorithm();
            jt(n), v(a, () => (bi(o), null), (p) => (mi(o, p), null));
          }
          __name(Ai, "Ai");
          u(Ai, "WritableStreamDefaultControllerProcessClose");
          function Bi(n, o) {
            const a = n._controlledWritableStream;
            _i(a);
            const p = n._writeAlgorithm(o);
            v(p, () => {
              hi(a);
              const y = a._state;
              if (br(n), !be(a) && y === "writable") {
                const _ = Br(n);
                Er(a, _);
              }
              return Lt(n), null;
            }, (y) => (a._state === "writable" && jt(n), pi(a, y), null));
          }
          __name(Bi, "Bi");
          u(Bi, "WritableStreamDefaultControllerProcessWrite");
          function Br(n) {
            return Xn(n) <= 0;
          }
          __name(Br, "Br");
          u(Br, "WritableStreamDefaultControllerGetBackpressure");
          function eo(n, o) {
            const a = n._controlledWritableStream;
            jt(n), Pr(a, o);
          }
          __name(eo, "eo");
          u(eo, "WritableStreamDefaultControllerError");
          function $t(n) {
            return new TypeError(`WritableStream.prototype.${n} can only be used on a WritableStream`);
          }
          __name($t, "$t");
          u($t, "streamBrandCheckException$2");
          function qr(n) {
            return new TypeError(`WritableStreamDefaultController.prototype.${n} can only be used on a WritableStreamDefaultController`);
          }
          __name(qr, "qr");
          u(qr, "defaultControllerBrandCheckException$2");
          function Le(n) {
            return new TypeError(`WritableStreamDefaultWriter.prototype.${n} can only be used on a WritableStreamDefaultWriter`);
          }
          __name(Le, "Le");
          u(Le, "defaultWriterBrandCheckException");
          function pt(n) {
            return new TypeError("Cannot " + n + " a stream using a released writer");
          }
          __name(pt, "pt");
          u(pt, "defaultWriterLockException");
          function Dt(n) {
            n._closedPromise = I((o, a) => {
              n._closedPromise_resolve = o, n._closedPromise_reject = a, n._closedPromiseState = "pending";
            });
          }
          __name(Dt, "Dt");
          u(Dt, "defaultWriterClosedPromiseInitialize");
          function to(n, o) {
            Dt(n), kr(n, o);
          }
          __name(to, "to");
          u(to, "defaultWriterClosedPromiseInitializeAsRejected");
          function qi(n) {
            Dt(n), ro(n);
          }
          __name(qi, "qi");
          u(qi, "defaultWriterClosedPromiseInitializeAsResolved");
          function kr(n, o) {
            n._closedPromise_reject !== void 0 && (J(n._closedPromise), n._closedPromise_reject(o), n._closedPromise_resolve = void 0, n._closedPromise_reject = void 0, n._closedPromiseState = "rejected");
          }
          __name(kr, "kr");
          u(kr, "defaultWriterClosedPromiseReject");
          function ki(n, o) {
            to(n, o);
          }
          __name(ki, "ki");
          u(ki, "defaultWriterClosedPromiseResetToRejected");
          function ro(n) {
            n._closedPromise_resolve !== void 0 && (n._closedPromise_resolve(void 0), n._closedPromise_resolve = void 0, n._closedPromise_reject = void 0, n._closedPromiseState = "resolved");
          }
          __name(ro, "ro");
          u(ro, "defaultWriterClosedPromiseResolve");
          function Mt(n) {
            n._readyPromise = I((o, a) => {
              n._readyPromise_resolve = o, n._readyPromise_reject = a;
            }), n._readyPromiseState = "pending";
          }
          __name(Mt, "Mt");
          u(Mt, "defaultWriterReadyPromiseInitialize");
          function Wr(n, o) {
            Mt(n), oo(n, o);
          }
          __name(Wr, "Wr");
          u(Wr, "defaultWriterReadyPromiseInitializeAsRejected");
          function no(n) {
            Mt(n), Or(n);
          }
          __name(no, "no");
          u(no, "defaultWriterReadyPromiseInitializeAsResolved");
          function oo(n, o) {
            n._readyPromise_reject !== void 0 && (J(n._readyPromise), n._readyPromise_reject(o), n._readyPromise_resolve = void 0, n._readyPromise_reject = void 0, n._readyPromiseState = "rejected");
          }
          __name(oo, "oo");
          u(oo, "defaultWriterReadyPromiseReject");
          function Wi(n) {
            Mt(n);
          }
          __name(Wi, "Wi");
          u(Wi, "defaultWriterReadyPromiseReset");
          function Oi(n, o) {
            Wr(n, o);
          }
          __name(Oi, "Oi");
          u(Oi, "defaultWriterReadyPromiseResetToRejected");
          function Or(n) {
            n._readyPromise_resolve !== void 0 && (n._readyPromise_resolve(void 0), n._readyPromise_resolve = void 0, n._readyPromise_reject = void 0, n._readyPromiseState = "fulfilled");
          }
          __name(Or, "Or");
          u(Or, "defaultWriterReadyPromiseResolve");
          function zi() {
            if (typeof globalThis < "u") return globalThis;
            if (typeof self < "u") return self;
            if (typeof _commonjsHelpers.commonjsGlobal < "u") return _commonjsHelpers.commonjsGlobal;
          }
          __name(zi, "zi");
          u(zi, "getGlobals");
          const zr = zi();
          function Fi(n) {
            if (!(typeof n == "function" || typeof n == "object") || n.name !== "DOMException") return false;
            try {
              return new n(), true;
            } catch {
              return false;
            }
          }
          __name(Fi, "Fi");
          u(Fi, "isDOMExceptionConstructor");
          function Ii() {
            const n = zr?.DOMException;
            return Fi(n) ? n : void 0;
          }
          __name(Ii, "Ii");
          u(Ii, "getFromGlobal");
          function ji() {
            const n = u(function(a, p) {
              this.message = a || "", this.name = p || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
            }, "DOMException");
            return w(n, "DOMException"), n.prototype = Object.create(Error.prototype), Object.defineProperty(n.prototype, "constructor", { value: n, writable: true, configurable: true }), n;
          }
          __name(ji, "ji");
          u(ji, "createPolyfill");
          const Li = Ii() || ji();
          function io(n, o, a, p, y, _) {
            const S = Ne(n), C = Nn(o);
            n._disturbed = true;
            let q = false, P = k(void 0);
            return I((W, O) => {
              let j;
              if (_ !== void 0) {
                if (j = u(() => {
                  const E = _.reason !== void 0 ? _.reason : new Li("Aborted", "AbortError"), F = [];
                  p || F.push(() => o._state === "writable" ? Ft(o, E) : k(void 0)), y || F.push(() => n._state === "readable" ? le(n, E) : k(void 0)), Z(() => Promise.all(F.map((L) => L())), true, E);
                }, "abortAlgorithm"), _.aborted) {
                  j();
                  return;
                }
                _.addEventListener("abort", j);
              }
              function fe() {
                return I((E, F) => {
                  function L(X) {
                    X ? E() : $(et(), L, F);
                  }
                  __name(L, "L");
                  u(L, "next"), L(false);
                });
              }
              __name(fe, "fe");
              u(fe, "pipeLoop");
              function et() {
                return q ? k(true) : $(C._readyPromise, () => I((E, F) => {
                  ut(S, { _chunkSteps: u((L) => {
                    P = $(Zn(C, L), void 0, g), E(false);
                  }, "_chunkSteps"), _closeSteps: u(() => E(true), "_closeSteps"), _errorSteps: F });
                }));
              }
              __name(et, "et");
              if (u(et, "pipeStep"), Te(n, S._closedPromise, (E) => (p ? re(true, E) : Z(() => Ft(o, E), true, E), null)), Te(o, C._closedPromise, (E) => (y ? re(true, E) : Z(() => le(n, E), true, E), null)), G(n, S._closedPromise, () => (a ? re() : Z(() => wi(C)), null)), be(o) || o._state === "closed") {
                const E = new TypeError("the destination writable stream closed before all data could be piped to it");
                y ? re(true, E) : Z(() => le(n, E), true, E);
              }
              J(fe());
              function We() {
                const E = P;
                return $(P, () => E !== P ? We() : void 0);
              }
              __name(We, "We");
              u(We, "waitForWritesToFinish");
              function Te(E, F, L) {
                E._state === "errored" ? L(E._storedError) : U(F, L);
              }
              __name(Te, "Te");
              u(Te, "isOrBecomesErrored");
              function G(E, F, L) {
                E._state === "closed" ? L() : K(F, L);
              }
              __name(G, "G");
              u(G, "isOrBecomesClosed");
              function Z(E, F, L) {
                if (q) return;
                q = true, o._state === "writable" && !be(o) ? K(We(), X) : X();
                function X() {
                  return v(E(), () => Ce(F, L), (tt) => Ce(true, tt)), null;
                }
                __name(X, "X");
                u(X, "doTheRest");
              }
              __name(Z, "Z");
              u(Z, "shutdownWithAction");
              function re(E, F) {
                q || (q = true, o._state === "writable" && !be(o) ? K(We(), () => Ce(E, F)) : Ce(E, F));
              }
              __name(re, "re");
              u(re, "shutdown");
              function Ce(E, F) {
                return Gn(C), _e(S), _ !== void 0 && _.removeEventListener("abort", j), E ? O(F) : W(void 0), null;
              }
              __name(Ce, "Ce");
              u(Ce, "finalize");
            });
          }
          __name(io, "io");
          u(io, "ReadableStreamPipeTo");
          const Gr = class Gr {
            static {
              __name(this, "Gr");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            get desiredSize() {
              if (!xt(this)) throw Nt("desiredSize");
              return Fr(this);
            }
            close() {
              if (!xt(this)) throw Nt("close");
              if (!Ge(this)) throw new TypeError("The stream is not in a state that permits close");
              $e(this);
            }
            enqueue(o = void 0) {
              if (!xt(this)) throw Nt("enqueue");
              if (!Ge(this)) throw new TypeError("The stream is not in a state that permits enqueue");
              return Ye(this, o);
            }
            error(o = void 0) {
              if (!xt(this)) throw Nt("error");
              ue(this, o);
            }
            [er](o) {
              Ae(this);
              const a = this._cancelAlgorithm(o);
              return Ut(this), a;
            }
            [tr](o) {
              const a = this._controlledReadableStream;
              if (this._queue.length > 0) {
                const p = br(this);
                this._closeRequested && this._queue.length === 0 ? (Ut(this), yt(a)) : bt(this), o._chunkSteps(p);
              } else bn(a, o), bt(this);
            }
            [rr]() {
            }
          };
          u(Gr, "ReadableStreamDefaultController");
          let ae = Gr;
          Object.defineProperties(ae.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, desiredSize: { enumerable: true } }), w(ae.prototype.close, "close"), w(ae.prototype.enqueue, "enqueue"), w(ae.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ae.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultController", configurable: true });
          function xt(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_controlledReadableStream") ? false : n instanceof ae;
          }
          __name(xt, "xt");
          u(xt, "IsReadableStreamDefaultController");
          function bt(n) {
            if (!so(n)) return;
            if (n._pulling) {
              n._pullAgain = true;
              return;
            }
            n._pulling = true;
            const a = n._pullAlgorithm();
            v(a, () => (n._pulling = false, n._pullAgain && (n._pullAgain = false, bt(n)), null), (p) => (ue(n, p), null));
          }
          __name(bt, "bt");
          u(bt, "ReadableStreamDefaultControllerCallPullIfNeeded");
          function so(n) {
            const o = n._controlledReadableStream;
            return !Ge(n) || !n._started ? false : !!(ke(o) && Tt(o) > 0 || Fr(n) > 0);
          }
          __name(so, "so");
          u(so, "ReadableStreamDefaultControllerShouldCallPull");
          function Ut(n) {
            n._pullAlgorithm = void 0, n._cancelAlgorithm = void 0, n._strategySizeAlgorithm = void 0;
          }
          __name(Ut, "Ut");
          u(Ut, "ReadableStreamDefaultControllerClearAlgorithms");
          function $e(n) {
            if (!Ge(n)) return;
            const o = n._controlledReadableStream;
            n._closeRequested = true, n._queue.length === 0 && (Ut(n), yt(o));
          }
          __name($e, "$e");
          u($e, "ReadableStreamDefaultControllerClose");
          function Ye(n, o) {
            if (!Ge(n)) return;
            const a = n._controlledReadableStream;
            if (ke(a) && Tt(a) > 0) fr(a, o, false);
            else {
              let p;
              try {
                p = n._strategySizeAlgorithm(o);
              } catch (y) {
                throw ue(n, y), y;
              }
              try {
                mr(n, o, p);
              } catch (y) {
                throw ue(n, y), y;
              }
            }
            bt(n);
          }
          __name(Ye, "Ye");
          u(Ye, "ReadableStreamDefaultControllerEnqueue");
          function ue(n, o) {
            const a = n._controlledReadableStream;
            a._state === "readable" && (Ae(n), Ut(n), fo(a, o));
          }
          __name(ue, "ue");
          u(ue, "ReadableStreamDefaultControllerError");
          function Fr(n) {
            const o = n._controlledReadableStream._state;
            return o === "errored" ? null : o === "closed" ? 0 : n._strategyHWM - n._queueTotalSize;
          }
          __name(Fr, "Fr");
          u(Fr, "ReadableStreamDefaultControllerGetDesiredSize");
          function $i(n) {
            return !so(n);
          }
          __name($i, "$i");
          u($i, "ReadableStreamDefaultControllerHasBackpressure");
          function Ge(n) {
            const o = n._controlledReadableStream._state;
            return !n._closeRequested && o === "readable";
          }
          __name(Ge, "Ge");
          u(Ge, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
          function ao(n, o, a, p, y, _, S) {
            o._controlledReadableStream = n, o._queue = void 0, o._queueTotalSize = void 0, Ae(o), o._started = false, o._closeRequested = false, o._pullAgain = false, o._pulling = false, o._strategySizeAlgorithm = S, o._strategyHWM = _, o._pullAlgorithm = p, o._cancelAlgorithm = y, n._readableStreamController = o;
            const C = a();
            v(k(C), () => (o._started = true, bt(o), null), (q) => (ue(o, q), null));
          }
          __name(ao, "ao");
          u(ao, "SetUpReadableStreamDefaultController");
          function Di(n, o, a, p) {
            const y = Object.create(ae.prototype);
            let _, S, C;
            o.start !== void 0 ? _ = u(() => o.start(y), "startAlgorithm") : _ = u(() => {
            }, "startAlgorithm"), o.pull !== void 0 ? S = u(() => o.pull(y), "pullAlgorithm") : S = u(() => k(void 0), "pullAlgorithm"), o.cancel !== void 0 ? C = u((q) => o.cancel(q), "cancelAlgorithm") : C = u(() => k(void 0), "cancelAlgorithm"), ao(n, y, _, S, C, a, p);
          }
          __name(Di, "Di");
          u(Di, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
          function Nt(n) {
            return new TypeError(`ReadableStreamDefaultController.prototype.${n} can only be used on a ReadableStreamDefaultController`);
          }
          __name(Nt, "Nt");
          u(Nt, "defaultControllerBrandCheckException$1");
          function Mi(n, o) {
            return ze(n._readableStreamController) ? Ui(n) : xi(n);
          }
          __name(Mi, "Mi");
          u(Mi, "ReadableStreamTee");
          function xi(n, o) {
            const a = Ne(n);
            let p = false, y = false, _ = false, S = false, C, q, P, W, O;
            const j = I((G) => {
              O = G;
            });
            function fe() {
              return p ? (y = true, k(void 0)) : (p = true, ut(a, { _chunkSteps: u((Z) => {
                ge(() => {
                  y = false;
                  const re = Z, Ce = Z;
                  _ || Ye(P._readableStreamController, re), S || Ye(W._readableStreamController, Ce), p = false, y && fe();
                });
              }, "_chunkSteps"), _closeSteps: u(() => {
                p = false, _ || $e(P._readableStreamController), S || $e(W._readableStreamController), (!_ || !S) && O(void 0);
              }, "_closeSteps"), _errorSteps: u(() => {
                p = false;
              }, "_errorSteps") }), k(void 0));
            }
            __name(fe, "fe");
            u(fe, "pullAlgorithm");
            function et(G) {
              if (_ = true, C = G, S) {
                const Z = lt([C, q]), re = le(n, Z);
                O(re);
              }
              return j;
            }
            __name(et, "et");
            u(et, "cancel1Algorithm");
            function We(G) {
              if (S = true, q = G, _) {
                const Z = lt([C, q]), re = le(n, Z);
                O(re);
              }
              return j;
            }
            __name(We, "We");
            u(We, "cancel2Algorithm");
            function Te() {
            }
            __name(Te, "Te");
            return u(Te, "startAlgorithm"), P = mt(Te, fe, et), W = mt(Te, fe, We), U(a._closedPromise, (G) => (ue(P._readableStreamController, G), ue(W._readableStreamController, G), (!_ || !S) && O(void 0), null)), [P, W];
          }
          __name(xi, "xi");
          u(xi, "ReadableStreamDefaultTee");
          function Ui(n) {
            let o = Ne(n), a = false, p = false, y = false, _ = false, S = false, C, q, P, W, O;
            const j = I((E) => {
              O = E;
            });
            function fe(E) {
              U(E._closedPromise, (F) => (E !== o || (te(P._readableStreamController, F), te(W._readableStreamController, F), (!_ || !S) && O(void 0)), null));
            }
            __name(fe, "fe");
            u(fe, "forwardReaderError");
            function et() {
              Ie(o) && (_e(o), o = Ne(n), fe(o)), ut(o, { _chunkSteps: u((F) => {
                ge(() => {
                  p = false, y = false;
                  const L = F;
                  let X = F;
                  if (!_ && !S) try {
                    X = Pn(F);
                  } catch (tt) {
                    te(P._readableStreamController, tt), te(W._readableStreamController, tt), O(le(n, tt));
                    return;
                  }
                  _ || Bt(P._readableStreamController, L), S || Bt(W._readableStreamController, X), a = false, p ? Te() : y && G();
                });
              }, "_chunkSteps"), _closeSteps: u(() => {
                a = false, _ || ft(P._readableStreamController), S || ft(W._readableStreamController), P._readableStreamController._pendingPullIntos.length > 0 && qt(P._readableStreamController, 0), W._readableStreamController._pendingPullIntos.length > 0 && qt(W._readableStreamController, 0), (!_ || !S) && O(void 0);
              }, "_closeSteps"), _errorSteps: u(() => {
                a = false;
              }, "_errorSteps") });
            }
            __name(et, "et");
            u(et, "pullWithDefaultReader");
            function We(E, F) {
              ve(o) && (_e(o), o = Ln(n), fe(o));
              const L = F ? W : P, X = F ? P : W;
              Mn(o, E, 1, { _chunkSteps: u((rt) => {
                ge(() => {
                  p = false, y = false;
                  const nt = F ? S : _;
                  if (F ? _ : S) nt || kt(L._readableStreamController, rt);
                  else {
                    let Co;
                    try {
                      Co = Pn(rt);
                    } catch (tn) {
                      te(L._readableStreamController, tn), te(X._readableStreamController, tn), O(le(n, tn));
                      return;
                    }
                    nt || kt(L._readableStreamController, rt), Bt(X._readableStreamController, Co);
                  }
                  a = false, p ? Te() : y && G();
                });
              }, "_chunkSteps"), _closeSteps: u((rt) => {
                a = false;
                const nt = F ? S : _, Gt = F ? _ : S;
                nt || ft(L._readableStreamController), Gt || ft(X._readableStreamController), rt !== void 0 && (nt || kt(L._readableStreamController, rt), !Gt && X._readableStreamController._pendingPullIntos.length > 0 && qt(X._readableStreamController, 0)), (!nt || !Gt) && O(void 0);
              }, "_closeSteps"), _errorSteps: u(() => {
                a = false;
              }, "_errorSteps") });
            }
            __name(We, "We");
            u(We, "pullWithBYOBReader");
            function Te() {
              if (a) return p = true, k(void 0);
              a = true;
              const E = wr(P._readableStreamController);
              return E === null ? et() : We(E._view, false), k(void 0);
            }
            __name(Te, "Te");
            u(Te, "pull1Algorithm");
            function G() {
              if (a) return y = true, k(void 0);
              a = true;
              const E = wr(W._readableStreamController);
              return E === null ? et() : We(E._view, true), k(void 0);
            }
            __name(G, "G");
            u(G, "pull2Algorithm");
            function Z(E) {
              if (_ = true, C = E, S) {
                const F = lt([C, q]), L = le(n, F);
                O(L);
              }
              return j;
            }
            __name(Z, "Z");
            u(Z, "cancel1Algorithm");
            function re(E) {
              if (S = true, q = E, _) {
                const F = lt([C, q]), L = le(n, F);
                O(L);
              }
              return j;
            }
            __name(re, "re");
            u(re, "cancel2Algorithm");
            function Ce() {
            }
            __name(Ce, "Ce");
            return u(Ce, "startAlgorithm"), P = lo(Ce, Te, Z), W = lo(Ce, G, re), fe(o), [P, W];
          }
          __name(Ui, "Ui");
          u(Ui, "ReadableByteStreamTee");
          function Ni(n) {
            return b(n) && typeof n.getReader < "u";
          }
          __name(Ni, "Ni");
          u(Ni, "isReadableStreamLike");
          function Hi(n) {
            return Ni(n) ? Qi(n.getReader()) : Vi(n);
          }
          __name(Hi, "Hi");
          u(Hi, "ReadableStreamFrom");
          function Vi(n) {
            let o;
            const a = Cn(n, "async"), p = g;
            function y() {
              let S;
              try {
                S = jo(a);
              } catch (q) {
                return T(q);
              }
              const C = k(S);
              return N(C, (q) => {
                if (!b(q)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
                if (Lo(q)) $e(o._readableStreamController);
                else {
                  const W = $o(q);
                  Ye(o._readableStreamController, W);
                }
              });
            }
            __name(y, "y");
            u(y, "pullAlgorithm");
            function _(S) {
              const C = a.iterator;
              let q;
              try {
                q = vt(C, "return");
              } catch (O) {
                return T(O);
              }
              if (q === void 0) return k(void 0);
              let P;
              try {
                P = M(q, C, [S]);
              } catch (O) {
                return T(O);
              }
              const W = k(P);
              return N(W, (O) => {
                if (!b(O)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
              });
            }
            __name(_, "_");
            return u(_, "cancelAlgorithm"), o = mt(p, y, _, 0), o;
          }
          __name(Vi, "Vi");
          u(Vi, "ReadableStreamFromIterable");
          function Qi(n) {
            let o;
            const a = g;
            function p() {
              let _;
              try {
                _ = n.read();
              } catch (S) {
                return T(S);
              }
              return N(_, (S) => {
                if (!b(S)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
                if (S.done) $e(o._readableStreamController);
                else {
                  const C = S.value;
                  Ye(o._readableStreamController, C);
                }
              });
            }
            __name(p, "p");
            u(p, "pullAlgorithm");
            function y(_) {
              try {
                return k(n.cancel(_));
              } catch (S) {
                return T(S);
              }
            }
            __name(y, "y");
            return u(y, "cancelAlgorithm"), o = mt(a, p, y, 0), o;
          }
          __name(Qi, "Qi");
          u(Qi, "ReadableStreamFromDefaultReader");
          function Yi(n, o) {
            ce(n, o);
            const a = n, p = a?.autoAllocateChunkSize, y = a?.cancel, _ = a?.pull, S = a?.start, C = a?.type;
            return { autoAllocateChunkSize: p === void 0 ? void 0 : ur(p, `${o} has member 'autoAllocateChunkSize' that`), cancel: y === void 0 ? void 0 : Gi(y, a, `${o} has member 'cancel' that`), pull: _ === void 0 ? void 0 : Zi(_, a, `${o} has member 'pull' that`), start: S === void 0 ? void 0 : Ki(S, a, `${o} has member 'start' that`), type: C === void 0 ? void 0 : Ji(C, `${o} has member 'type' that`) };
          }
          __name(Yi, "Yi");
          u(Yi, "convertUnderlyingDefaultOrByteSource");
          function Gi(n, o, a) {
            return ee(n, a), (p) => H(n, o, [p]);
          }
          __name(Gi, "Gi");
          u(Gi, "convertUnderlyingSourceCancelCallback");
          function Zi(n, o, a) {
            return ee(n, a), (p) => H(n, o, [p]);
          }
          __name(Zi, "Zi");
          u(Zi, "convertUnderlyingSourcePullCallback");
          function Ki(n, o, a) {
            return ee(n, a), (p) => M(n, o, [p]);
          }
          __name(Ki, "Ki");
          u(Ki, "convertUnderlyingSourceStartCallback");
          function Ji(n, o) {
            if (n = `${n}`, n !== "bytes") throw new TypeError(`${o} '${n}' is not a valid enumeration value for ReadableStreamType`);
            return n;
          }
          __name(Ji, "Ji");
          u(Ji, "convertReadableStreamType");
          function Xi(n, o) {
            return ce(n, o), { preventCancel: !!n?.preventCancel };
          }
          __name(Xi, "Xi");
          u(Xi, "convertIteratorOptions");
          function uo(n, o) {
            ce(n, o);
            const a = n?.preventAbort, p = n?.preventCancel, y = n?.preventClose, _ = n?.signal;
            return _ !== void 0 && es(_, `${o} has member 'signal' that`), { preventAbort: !!a, preventCancel: !!p, preventClose: !!y, signal: _ };
          }
          __name(uo, "uo");
          u(uo, "convertPipeOptions");
          function es(n, o) {
            if (!ui(n)) throw new TypeError(`${o} is not an AbortSignal.`);
          }
          __name(es, "es");
          u(es, "assertAbortSignal");
          function ts(n, o) {
            ce(n, o);
            const a = n?.readable;
            sr(a, "readable", "ReadableWritablePair"), lr(a, `${o} has member 'readable' that`);
            const p = n?.writable;
            return sr(p, "writable", "ReadableWritablePair"), Un(p, `${o} has member 'writable' that`), { readable: a, writable: p };
          }
          __name(ts, "ts");
          u(ts, "convertReadableWritablePair");
          const Zr = class Zr {
            static {
              __name(this, "Zr");
            }
            constructor(o = {}, a = {}) {
              o === void 0 ? o = null : hn(o, "First parameter");
              const p = zt(a, "Second parameter"), y = Yi(o, "First parameter");
              if (Ir(this), y.type === "bytes") {
                if (p.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
                const _ = dt(p, 0);
                Go(this, y, _);
              } else {
                const _ = Ot(p), S = dt(p, 1);
                Di(this, y, S, _);
              }
            }
            get locked() {
              if (!qe(this)) throw De("locked");
              return ke(this);
            }
            cancel(o = void 0) {
              return qe(this) ? ke(this) ? T(new TypeError("Cannot cancel a stream that already has a reader")) : le(this, o) : T(De("cancel"));
            }
            getReader(o = void 0) {
              if (!qe(this)) throw De("getReader");
              return Ko(o, "First parameter").mode === void 0 ? Ne(this) : Ln(this);
            }
            pipeThrough(o, a = {}) {
              if (!qe(this)) throw De("pipeThrough");
              Se(o, 1, "pipeThrough");
              const p = ts(o, "First parameter"), y = uo(a, "Second parameter");
              if (ke(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
              if (Qe(p.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
              const _ = io(this, p.writable, y.preventClose, y.preventAbort, y.preventCancel, y.signal);
              return J(_), p.readable;
            }
            pipeTo(o, a = {}) {
              if (!qe(this)) return T(De("pipeTo"));
              if (o === void 0) return T("Parameter 1 is required in 'pipeTo'.");
              if (!Ve(o)) return T(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
              let p;
              try {
                p = uo(a, "Second parameter");
              } catch (y) {
                return T(y);
              }
              return ke(this) ? T(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Qe(o) ? T(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : io(this, o, p.preventClose, p.preventAbort, p.preventCancel, p.signal);
            }
            tee() {
              if (!qe(this)) throw De("tee");
              const o = Mi(this);
              return lt(o);
            }
            values(o = void 0) {
              if (!qe(this)) throw De("values");
              const a = Xi(o, "First parameter");
              return Fo(this, a.preventCancel);
            }
            [pr](o) {
              return this.values(o);
            }
            static from(o) {
              return Hi(o);
            }
          };
          u(Zr, "ReadableStream");
          let V = Zr;
          Object.defineProperties(V, { from: { enumerable: true } }), Object.defineProperties(V.prototype, { cancel: { enumerable: true }, getReader: { enumerable: true }, pipeThrough: { enumerable: true }, pipeTo: { enumerable: true }, tee: { enumerable: true }, values: { enumerable: true }, locked: { enumerable: true } }), w(V.from, "from"), w(V.prototype.cancel, "cancel"), w(V.prototype.getReader, "getReader"), w(V.prototype.pipeThrough, "pipeThrough"), w(V.prototype.pipeTo, "pipeTo"), w(V.prototype.tee, "tee"), w(V.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(V.prototype, Symbol.toStringTag, { value: "ReadableStream", configurable: true }), Object.defineProperty(V.prototype, pr, { value: V.prototype.values, writable: true, configurable: true });
          function mt(n, o, a, p = 1, y = () => 1) {
            const _ = Object.create(V.prototype);
            Ir(_);
            const S = Object.create(ae.prototype);
            return ao(_, S, n, o, a, p, y), _;
          }
          __name(mt, "mt");
          u(mt, "CreateReadableStream");
          function lo(n, o, a) {
            const p = Object.create(V.prototype);
            Ir(p);
            const y = Object.create(ie.prototype);
            return jn(p, y, n, o, a, 0, void 0), p;
          }
          __name(lo, "lo");
          u(lo, "CreateReadableByteStream");
          function Ir(n) {
            n._state = "readable", n._reader = void 0, n._storedError = void 0, n._disturbed = false;
          }
          __name(Ir, "Ir");
          u(Ir, "InitializeReadableStream");
          function qe(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_readableStreamController") ? false : n instanceof V;
          }
          __name(qe, "qe");
          u(qe, "IsReadableStream");
          function ke(n) {
            return n._reader !== void 0;
          }
          __name(ke, "ke");
          u(ke, "IsReadableStreamLocked");
          function le(n, o) {
            if (n._disturbed = true, n._state === "closed") return k(void 0);
            if (n._state === "errored") return T(n._storedError);
            yt(n);
            const a = n._reader;
            if (a !== void 0 && Ie(a)) {
              const y = a._readIntoRequests;
              a._readIntoRequests = new Q(), y.forEach((_) => {
                _._closeSteps(void 0);
              });
            }
            const p = n._readableStreamController[er](o);
            return N(p, g);
          }
          __name(le, "le");
          u(le, "ReadableStreamCancel");
          function yt(n) {
            n._state = "closed";
            const o = n._reader;
            if (o !== void 0 && (cn(o), ve(o))) {
              const a = o._readRequests;
              o._readRequests = new Q(), a.forEach((p) => {
                p._closeSteps();
              });
            }
          }
          __name(yt, "yt");
          u(yt, "ReadableStreamClose");
          function fo(n, o) {
            n._state = "errored", n._storedError = o;
            const a = n._reader;
            a !== void 0 && (ir(a, o), ve(a) ? yn(a, o) : xn(a, o));
          }
          __name(fo, "fo");
          u(fo, "ReadableStreamError");
          function De(n) {
            return new TypeError(`ReadableStream.prototype.${n} can only be used on a ReadableStream`);
          }
          __name(De, "De");
          u(De, "streamBrandCheckException$1");
          function co(n, o) {
            ce(n, o);
            const a = n?.highWaterMark;
            return sr(a, "highWaterMark", "QueuingStrategyInit"), { highWaterMark: ar(a) };
          }
          __name(co, "co");
          u(co, "convertQueuingStrategyInit");
          const ho = u((n) => n.byteLength, "byteLengthSizeFunction");
          w(ho, "size");
          const Kr = class Kr {
            static {
              __name(this, "Kr");
            }
            constructor(o) {
              Se(o, 1, "ByteLengthQueuingStrategy"), o = co(o, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = o.highWaterMark;
            }
            get highWaterMark() {
              if (!bo(this)) throw po("highWaterMark");
              return this._byteLengthQueuingStrategyHighWaterMark;
            }
            get size() {
              if (!bo(this)) throw po("size");
              return ho;
            }
          };
          u(Kr, "ByteLengthQueuingStrategy");
          let Ze = Kr;
          Object.defineProperties(Ze.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ze.prototype, Symbol.toStringTag, { value: "ByteLengthQueuingStrategy", configurable: true });
          function po(n) {
            return new TypeError(`ByteLengthQueuingStrategy.prototype.${n} can only be used on a ByteLengthQueuingStrategy`);
          }
          __name(po, "po");
          u(po, "byteLengthBrandCheckException");
          function bo(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_byteLengthQueuingStrategyHighWaterMark") ? false : n instanceof Ze;
          }
          __name(bo, "bo");
          u(bo, "IsByteLengthQueuingStrategy");
          const mo = u(() => 1, "countSizeFunction");
          w(mo, "size");
          const Jr = class Jr {
            static {
              __name(this, "Jr");
            }
            constructor(o) {
              Se(o, 1, "CountQueuingStrategy"), o = co(o, "First parameter"), this._countQueuingStrategyHighWaterMark = o.highWaterMark;
            }
            get highWaterMark() {
              if (!go(this)) throw yo("highWaterMark");
              return this._countQueuingStrategyHighWaterMark;
            }
            get size() {
              if (!go(this)) throw yo("size");
              return mo;
            }
          };
          u(Jr, "CountQueuingStrategy");
          let Ke = Jr;
          Object.defineProperties(Ke.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Ke.prototype, Symbol.toStringTag, { value: "CountQueuingStrategy", configurable: true });
          function yo(n) {
            return new TypeError(`CountQueuingStrategy.prototype.${n} can only be used on a CountQueuingStrategy`);
          }
          __name(yo, "yo");
          u(yo, "countBrandCheckException");
          function go(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_countQueuingStrategyHighWaterMark") ? false : n instanceof Ke;
          }
          __name(go, "go");
          u(go, "IsCountQueuingStrategy");
          function rs(n, o) {
            ce(n, o);
            const a = n?.cancel, p = n?.flush, y = n?.readableType, _ = n?.start, S = n?.transform, C = n?.writableType;
            return { cancel: a === void 0 ? void 0 : ss(a, n, `${o} has member 'cancel' that`), flush: p === void 0 ? void 0 : ns(p, n, `${o} has member 'flush' that`), readableType: y, start: _ === void 0 ? void 0 : os(_, n, `${o} has member 'start' that`), transform: S === void 0 ? void 0 : is(S, n, `${o} has member 'transform' that`), writableType: C };
          }
          __name(rs, "rs");
          u(rs, "convertTransformer");
          function ns(n, o, a) {
            return ee(n, a), (p) => H(n, o, [p]);
          }
          __name(ns, "ns");
          u(ns, "convertTransformerFlushCallback");
          function os(n, o, a) {
            return ee(n, a), (p) => M(n, o, [p]);
          }
          __name(os, "os");
          u(os, "convertTransformerStartCallback");
          function is(n, o, a) {
            return ee(n, a), (p, y) => H(n, o, [p, y]);
          }
          __name(is, "is");
          u(is, "convertTransformerTransformCallback");
          function ss(n, o, a) {
            return ee(n, a), (p) => H(n, o, [p]);
          }
          __name(ss, "ss");
          u(ss, "convertTransformerCancelCallback");
          const Xr = class Xr {
            static {
              __name(this, "Xr");
            }
            constructor(o = {}, a = {}, p = {}) {
              o === void 0 && (o = null);
              const y = zt(a, "Second parameter"), _ = zt(p, "Third parameter"), S = rs(o, "First parameter");
              if (S.readableType !== void 0) throw new RangeError("Invalid readableType specified");
              if (S.writableType !== void 0) throw new RangeError("Invalid writableType specified");
              const C = dt(_, 0), q = Ot(_), P = dt(y, 1), W = Ot(y);
              let O;
              const j = I((fe) => {
                O = fe;
              });
              as(this, j, P, W, C, q), ls(this, S), S.start !== void 0 ? O(S.start(this._transformStreamController)) : O(void 0);
            }
            get readable() {
              if (!_o(this)) throw To("readable");
              return this._readable;
            }
            get writable() {
              if (!_o(this)) throw To("writable");
              return this._writable;
            }
          };
          u(Xr, "TransformStream");
          let Je = Xr;
          Object.defineProperties(Je.prototype, { readable: { enumerable: true }, writable: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Je.prototype, Symbol.toStringTag, { value: "TransformStream", configurable: true });
          function as(n, o, a, p, y, _) {
            function S() {
              return o;
            }
            __name(S, "S");
            u(S, "startAlgorithm");
            function C(j) {
              return ds(n, j);
            }
            __name(C, "C");
            u(C, "writeAlgorithm");
            function q(j) {
              return hs(n, j);
            }
            __name(q, "q");
            u(q, "abortAlgorithm");
            function P() {
              return ps(n);
            }
            __name(P, "P");
            u(P, "closeAlgorithm"), n._writable = ci(S, C, P, q, a, p);
            function W() {
              return bs(n);
            }
            __name(W, "W");
            u(W, "pullAlgorithm");
            function O(j) {
              return ms(n, j);
            }
            __name(O, "O");
            u(O, "cancelAlgorithm"), n._readable = mt(S, W, O, y, _), n._backpressure = void 0, n._backpressureChangePromise = void 0, n._backpressureChangePromise_resolve = void 0, Ht(n, true), n._transformStreamController = void 0;
          }
          __name(as, "as");
          u(as, "InitializeTransformStream");
          function _o(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_transformStreamController") ? false : n instanceof Je;
          }
          __name(_o, "_o");
          u(_o, "IsTransformStream");
          function So(n, o) {
            ue(n._readable._readableStreamController, o), jr(n, o);
          }
          __name(So, "So");
          u(So, "TransformStreamError");
          function jr(n, o) {
            Qt(n._transformStreamController), ht(n._writable._writableStreamController, o), Lr(n);
          }
          __name(jr, "jr");
          u(jr, "TransformStreamErrorWritableAndUnblockWrite");
          function Lr(n) {
            n._backpressure && Ht(n, false);
          }
          __name(Lr, "Lr");
          u(Lr, "TransformStreamUnblockWrite");
          function Ht(n, o) {
            n._backpressureChangePromise !== void 0 && n._backpressureChangePromise_resolve(), n._backpressureChangePromise = I((a) => {
              n._backpressureChangePromise_resolve = a;
            }), n._backpressure = o;
          }
          __name(Ht, "Ht");
          u(Ht, "TransformStreamSetBackpressure");
          const en = class en {
            static {
              __name(this, "en");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            get desiredSize() {
              if (!Vt(this)) throw Yt("desiredSize");
              const o = this._controlledTransformStream._readable._readableStreamController;
              return Fr(o);
            }
            enqueue(o = void 0) {
              if (!Vt(this)) throw Yt("enqueue");
              wo(this, o);
            }
            error(o = void 0) {
              if (!Vt(this)) throw Yt("error");
              fs(this, o);
            }
            terminate() {
              if (!Vt(this)) throw Yt("terminate");
              cs(this);
            }
          };
          u(en, "TransformStreamDefaultController");
          let me = en;
          Object.defineProperties(me.prototype, { enqueue: { enumerable: true }, error: { enumerable: true }, terminate: { enumerable: true }, desiredSize: { enumerable: true } }), w(me.prototype.enqueue, "enqueue"), w(me.prototype.error, "error"), w(me.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(me.prototype, Symbol.toStringTag, { value: "TransformStreamDefaultController", configurable: true });
          function Vt(n) {
            return !b(n) || !Object.prototype.hasOwnProperty.call(n, "_controlledTransformStream") ? false : n instanceof me;
          }
          __name(Vt, "Vt");
          u(Vt, "IsTransformStreamDefaultController");
          function us(n, o, a, p, y) {
            o._controlledTransformStream = n, n._transformStreamController = o, o._transformAlgorithm = a, o._flushAlgorithm = p, o._cancelAlgorithm = y, o._finishPromise = void 0, o._finishPromise_resolve = void 0, o._finishPromise_reject = void 0;
          }
          __name(us, "us");
          u(us, "SetUpTransformStreamDefaultController");
          function ls(n, o) {
            const a = Object.create(me.prototype);
            let p, y, _;
            o.transform !== void 0 ? p = u((S) => o.transform(S, a), "transformAlgorithm") : p = u((S) => {
              try {
                return wo(a, S), k(void 0);
              } catch (C) {
                return T(C);
              }
            }, "transformAlgorithm"), o.flush !== void 0 ? y = u(() => o.flush(a), "flushAlgorithm") : y = u(() => k(void 0), "flushAlgorithm"), o.cancel !== void 0 ? _ = u((S) => o.cancel(S), "cancelAlgorithm") : _ = u(() => k(void 0), "cancelAlgorithm"), us(n, a, p, y, _);
          }
          __name(ls, "ls");
          u(ls, "SetUpTransformStreamDefaultControllerFromTransformer");
          function Qt(n) {
            n._transformAlgorithm = void 0, n._flushAlgorithm = void 0, n._cancelAlgorithm = void 0;
          }
          __name(Qt, "Qt");
          u(Qt, "TransformStreamDefaultControllerClearAlgorithms");
          function wo(n, o) {
            const a = n._controlledTransformStream, p = a._readable._readableStreamController;
            if (!Ge(p)) throw new TypeError("Readable side is not in a state that permits enqueue");
            try {
              Ye(p, o);
            } catch (_) {
              throw jr(a, _), a._readable._storedError;
            }
            $i(p) !== a._backpressure && Ht(a, true);
          }
          __name(wo, "wo");
          u(wo, "TransformStreamDefaultControllerEnqueue");
          function fs(n, o) {
            So(n._controlledTransformStream, o);
          }
          __name(fs, "fs");
          u(fs, "TransformStreamDefaultControllerError");
          function Ro(n, o) {
            const a = n._transformAlgorithm(o);
            return N(a, void 0, (p) => {
              throw So(n._controlledTransformStream, p), p;
            });
          }
          __name(Ro, "Ro");
          u(Ro, "TransformStreamDefaultControllerPerformTransform");
          function cs(n) {
            const o = n._controlledTransformStream, a = o._readable._readableStreamController;
            $e(a);
            const p = new TypeError("TransformStream terminated");
            jr(o, p);
          }
          __name(cs, "cs");
          u(cs, "TransformStreamDefaultControllerTerminate");
          function ds(n, o) {
            const a = n._transformStreamController;
            if (n._backpressure) {
              const p = n._backpressureChangePromise;
              return N(p, () => {
                const y = n._writable;
                if (y._state === "erroring") throw y._storedError;
                return Ro(a, o);
              });
            }
            return Ro(a, o);
          }
          __name(ds, "ds");
          u(ds, "TransformStreamDefaultSinkWriteAlgorithm");
          function hs(n, o) {
            const a = n._transformStreamController;
            if (a._finishPromise !== void 0) return a._finishPromise;
            const p = n._readable;
            a._finishPromise = I((_, S) => {
              a._finishPromise_resolve = _, a._finishPromise_reject = S;
            });
            const y = a._cancelAlgorithm(o);
            return Qt(a), v(y, () => (p._state === "errored" ? Xe(a, p._storedError) : (ue(p._readableStreamController, o), $r(a)), null), (_) => (ue(p._readableStreamController, _), Xe(a, _), null)), a._finishPromise;
          }
          __name(hs, "hs");
          u(hs, "TransformStreamDefaultSinkAbortAlgorithm");
          function ps(n) {
            const o = n._transformStreamController;
            if (o._finishPromise !== void 0) return o._finishPromise;
            const a = n._readable;
            o._finishPromise = I((y, _) => {
              o._finishPromise_resolve = y, o._finishPromise_reject = _;
            });
            const p = o._flushAlgorithm();
            return Qt(o), v(p, () => (a._state === "errored" ? Xe(o, a._storedError) : ($e(a._readableStreamController), $r(o)), null), (y) => (ue(a._readableStreamController, y), Xe(o, y), null)), o._finishPromise;
          }
          __name(ps, "ps");
          u(ps, "TransformStreamDefaultSinkCloseAlgorithm");
          function bs(n) {
            return Ht(n, false), n._backpressureChangePromise;
          }
          __name(bs, "bs");
          u(bs, "TransformStreamDefaultSourcePullAlgorithm");
          function ms(n, o) {
            const a = n._transformStreamController;
            if (a._finishPromise !== void 0) return a._finishPromise;
            const p = n._writable;
            a._finishPromise = I((_, S) => {
              a._finishPromise_resolve = _, a._finishPromise_reject = S;
            });
            const y = a._cancelAlgorithm(o);
            return Qt(a), v(y, () => (p._state === "errored" ? Xe(a, p._storedError) : (ht(p._writableStreamController, o), Lr(n), $r(a)), null), (_) => (ht(p._writableStreamController, _), Lr(n), Xe(a, _), null)), a._finishPromise;
          }
          __name(ms, "ms");
          u(ms, "TransformStreamDefaultSourceCancelAlgorithm");
          function Yt(n) {
            return new TypeError(`TransformStreamDefaultController.prototype.${n} can only be used on a TransformStreamDefaultController`);
          }
          __name(Yt, "Yt");
          u(Yt, "defaultControllerBrandCheckException");
          function $r(n) {
            n._finishPromise_resolve !== void 0 && (n._finishPromise_resolve(), n._finishPromise_resolve = void 0, n._finishPromise_reject = void 0);
          }
          __name($r, "$r");
          u($r, "defaultControllerFinishPromiseResolve");
          function Xe(n, o) {
            n._finishPromise_reject !== void 0 && (J(n._finishPromise), n._finishPromise_reject(o), n._finishPromise_resolve = void 0, n._finishPromise_reject = void 0);
          }
          __name(Xe, "Xe");
          u(Xe, "defaultControllerFinishPromiseReject");
          function To(n) {
            return new TypeError(`TransformStream.prototype.${n} can only be used on a TransformStream`);
          }
          __name(To, "To");
          u(To, "streamBrandCheckException"), d.ByteLengthQueuingStrategy = Ze, d.CountQueuingStrategy = Ke, d.ReadableByteStreamController = ie, d.ReadableStream = V, d.ReadableStreamBYOBReader = he, d.ReadableStreamBYOBRequest = Re, d.ReadableStreamDefaultController = ae, d.ReadableStreamDefaultReader = de, d.TransformStream = Je, d.TransformStreamDefaultController = me, d.WritableStream = pe, d.WritableStreamDefaultController = Be, d.WritableStreamDefaultWriter = se;
        });
      }(ponyfill_es2018$1, ponyfill_es2018$1.exports)), ponyfill_es2018$1.exports;
    }
    __name(requirePonyfill_es2018, "requirePonyfill_es2018");
    u(requirePonyfill_es2018, "requirePonyfill_es2018");
    var hasRequiredStreams;
    function requireStreams() {
      if (hasRequiredStreams) return streams;
      hasRequiredStreams = 1;
      const c = 65536;
      if (!globalThis.ReadableStream) try {
        const l = __require("node:process"), { emitWarning: d } = l;
        try {
          l.emitWarning = () => {
          }, Object.assign(globalThis, __require("node:stream/web")), l.emitWarning = d;
        } catch (g) {
          throw l.emitWarning = d, g;
        }
      } catch {
        Object.assign(globalThis, requirePonyfill_es2018());
      }
      try {
        const { Blob: l } = __require("buffer");
        l && !l.prototype.stream && (l.prototype.stream = u(function(g) {
          let b = 0;
          const R = this;
          return new ReadableStream({ type: "bytes", async pull(w) {
            const z = await R.slice(b, Math.min(R.size, b + c)).arrayBuffer();
            b += z.byteLength, w.enqueue(new Uint8Array(z)), b === R.size && w.close();
          } });
        }, "name"));
      } catch {
      }
      return streams;
    }
    __name(requireStreams, "requireStreams");
    u(requireStreams, "requireStreams"), requireStreams();
    var POOL_SIZE = 65536;
    async function* toIterator(c, l = true) {
      for (const d of c) if ("stream" in d) yield* d.stream();
      else if (ArrayBuffer.isView(d)) if (l) {
        let g = d.byteOffset;
        const b = d.byteOffset + d.byteLength;
        for (; g !== b; ) {
          const R = Math.min(b - g, POOL_SIZE), w = d.buffer.slice(g, g + R);
          g += w.byteLength, yield new Uint8Array(w);
        }
      } else yield d;
      else {
        let g = 0, b = d;
        for (; g !== b.size; ) {
          const w = await b.slice(g, Math.min(b.size, g + POOL_SIZE)).arrayBuffer();
          g += w.byteLength, yield new Uint8Array(w);
        }
      }
    }
    __name(toIterator, "toIterator");
    u(toIterator, "toIterator");
    var _Blob = (Oe = class {
      static {
        __name(this, "Oe");
      }
      constructor(l = [], d = {}) {
        ye(this, Pe, []);
        ye(this, gt, "");
        ye(this, ot, 0);
        ye(this, Zt, "transparent");
        if (typeof l != "object" || l === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        if (typeof l[Symbol.iterator] != "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        if (typeof d != "object" && typeof d != "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        d === null && (d = {});
        const g = new TextEncoder();
        for (const R of l) {
          let w;
          ArrayBuffer.isView(R) ? w = new Uint8Array(R.buffer.slice(R.byteOffset, R.byteOffset + R.byteLength)) : R instanceof ArrayBuffer ? w = new Uint8Array(R.slice(0)) : R instanceof Oe ? w = R : w = g.encode(`${R}`), ne(this, ot, D(this, ot) + (ArrayBuffer.isView(w) ? w.byteLength : w.size)), D(this, Pe).push(w);
        }
        ne(this, Zt, `${d.endings === void 0 ? "transparent" : d.endings}`);
        const b = d.type === void 0 ? "" : String(d.type);
        ne(this, gt, /^[\x20-\x7E]*$/.test(b) ? b : "");
      }
      get size() {
        return D(this, ot);
      }
      get type() {
        return D(this, gt);
      }
      async text() {
        const l = new TextDecoder();
        let d = "";
        for await (const g of toIterator(D(this, Pe), false)) d += l.decode(g, { stream: true });
        return d += l.decode(), d;
      }
      async arrayBuffer() {
        const l = new Uint8Array(this.size);
        let d = 0;
        for await (const g of toIterator(D(this, Pe), false)) l.set(g, d), d += g.length;
        return l.buffer;
      }
      stream() {
        const l = toIterator(D(this, Pe), true);
        return new globalThis.ReadableStream({ type: "bytes", async pull(d) {
          const g = await l.next();
          g.done ? d.close() : d.enqueue(g.value);
        }, async cancel() {
          await l.return();
        } });
      }
      slice(l = 0, d = this.size, g = "") {
        const { size: b } = this;
        let R = l < 0 ? Math.max(b + l, 0) : Math.min(l, b), w = d < 0 ? Math.max(b + d, 0) : Math.min(d, b);
        const A = Math.max(w - R, 0), z = D(this, Pe), B = [];
        let I = 0;
        for (const T of z) {
          if (I >= A) break;
          const $ = ArrayBuffer.isView(T) ? T.byteLength : T.size;
          if (R && $ <= R) R -= $, w -= $;
          else {
            let v;
            ArrayBuffer.isView(T) ? (v = T.subarray(R, Math.min($, w)), I += v.byteLength) : (v = T.slice(R, Math.min($, w)), I += v.size), w -= $, B.push(v), R = 0;
          }
        }
        const k = new Oe([], { type: String(g).toLowerCase() });
        return ne(k, ot, A), ne(k, Pe, B), k;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](l) {
        return l && typeof l == "object" && typeof l.constructor == "function" && (typeof l.stream == "function" || typeof l.arrayBuffer == "function") && /^(Blob|File)$/.test(l[Symbol.toStringTag]);
      }
    }, Pe = /* @__PURE__ */ new WeakMap(), gt = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ new WeakMap(), u(Oe, "Blob"), Oe);
    Object.defineProperties(_Blob.prototype, { size: { enumerable: true }, type: { enumerable: true }, slice: { enumerable: true } });
    var Blob = _Blob;
    var _File = (it = class extends Blob {
      static {
        __name(this, "it");
      }
      constructor(d, g, b = {}) {
        if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        super(d, b);
        ye(this, _t, 0);
        ye(this, St, "");
        b === null && (b = {});
        const R = b.lastModified === void 0 ? Date.now() : Number(b.lastModified);
        Number.isNaN(R) || ne(this, _t, R), ne(this, St, String(g));
      }
      get name() {
        return D(this, St);
      }
      get lastModified() {
        return D(this, _t);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](d) {
        return !!d && d instanceof Blob && /^(File)$/.test(d[Symbol.toStringTag]);
      }
    }, _t = /* @__PURE__ */ new WeakMap(), St = /* @__PURE__ */ new WeakMap(), u(it, "File"), it);
    var File = _File;
    var { toStringTag: t$1, iterator: i, hasInstance: h } = Symbol;
    var r = Math.random;
    var m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    var f = u((c, l, d) => (c += "", /^(Blob|File)$/.test(l && l[t$1]) ? [(d = d !== void 0 ? d + "" : l[t$1] == "File" ? l.name : "blob", c), l.name !== d || l[t$1] == "blob" ? new File([l], d, l) : l] : [c, l + ""]), "f");
    var e$1 = u((c, l) => (l ? c : c.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e$1");
    var x = u((c, l, d) => {
      if (l.length < d) throw new TypeError(`Failed to execute '${c}' on 'FormData': ${d} arguments required, but only ${l.length} present.`);
    }, "x");
    var FormData = (st = class {
      static {
        __name(this, "st");
      }
      constructor(...l) {
        ye(this, oe, []);
        if (l.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
      }
      get [t$1]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](l) {
        return l && typeof l == "object" && l[t$1] === "FormData" && !m.some((d) => typeof l[d] != "function");
      }
      append(...l) {
        x("append", arguments, 2), D(this, oe).push(f(...l));
      }
      delete(l) {
        x("delete", arguments, 1), l += "", ne(this, oe, D(this, oe).filter(([d]) => d !== l));
      }
      get(l) {
        x("get", arguments, 1), l += "";
        for (var d = D(this, oe), g = d.length, b = 0; b < g; b++) if (d[b][0] === l) return d[b][1];
        return null;
      }
      getAll(l, d) {
        return x("getAll", arguments, 1), d = [], l += "", D(this, oe).forEach((g) => g[0] === l && d.push(g[1])), d;
      }
      has(l) {
        return x("has", arguments, 1), l += "", D(this, oe).some((d) => d[0] === l);
      }
      forEach(l, d) {
        x("forEach", arguments, 1);
        for (var [g, b] of this) l.call(d, b, g, this);
      }
      set(...l) {
        x("set", arguments, 2);
        var d = [], g = true;
        l = f(...l), D(this, oe).forEach((b) => {
          b[0] === l[0] ? g && (g = !d.push(l)) : d.push(b);
        }), g && d.push(l), ne(this, oe, d);
      }
      *entries() {
        yield* D(this, oe);
      }
      *keys() {
        for (var [l] of this) yield l;
      }
      *values() {
        for (var [, l] of this) yield l;
      }
    }, oe = /* @__PURE__ */ new WeakMap(), u(st, "FormData"), st);
    function formDataToBlob(c, l = Blob) {
      var d = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), g = [], b = `--${d}\r
Content-Disposition: form-data; name="`;
      return c.forEach((R, w) => typeof R == "string" ? g.push(b + e$1(w) + `"\r
\r
${R.replace(/\r(?!\n)|(?<!\r)\n/g, `\r
`)}\r
`) : g.push(b + e$1(w) + `"; filename="${e$1(R.name, 1)}"\r
Content-Type: ${R.type || "application/octet-stream"}\r
\r
`, R, `\r
`)), g.push(`--${d}--`), new l(g, { type: "multipart/form-data; boundary=" + d });
    }
    __name(formDataToBlob, "formDataToBlob");
    u(formDataToBlob, "formDataToBlob");
    var rn = class rn extends Error {
      static {
        __name(this, "rn");
      }
      constructor(l, d) {
        super(l), Error.captureStackTrace(this, this.constructor), this.type = d;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    u(rn, "FetchBaseError");
    var FetchBaseError = rn;
    var nn = class nn extends FetchBaseError {
      static {
        __name(this, "nn");
      }
      constructor(l, d, g) {
        super(l, d), g && (this.code = this.errno = g.code, this.erroredSysCall = g.syscall);
      }
    };
    u(nn, "FetchError");
    var FetchError = nn;
    var NAME = Symbol.toStringTag;
    var isURLSearchParameters = u((c) => typeof c == "object" && typeof c.append == "function" && typeof c.delete == "function" && typeof c.get == "function" && typeof c.getAll == "function" && typeof c.has == "function" && typeof c.set == "function" && typeof c.sort == "function" && c[NAME] === "URLSearchParams", "isURLSearchParameters");
    var isBlob = u((c) => c && typeof c == "object" && typeof c.arrayBuffer == "function" && typeof c.type == "string" && typeof c.stream == "function" && typeof c.constructor == "function" && /^(Blob|File)$/.test(c[NAME]), "isBlob");
    var isAbortSignal = u((c) => typeof c == "object" && (c[NAME] === "AbortSignal" || c[NAME] === "EventTarget"), "isAbortSignal");
    var isDomainOrSubdomain = u((c, l) => {
      const d = new URL(l).hostname, g = new URL(c).hostname;
      return d === g || d.endsWith(`.${g}`);
    }, "isDomainOrSubdomain");
    var isSameProtocol = u((c, l) => {
      const d = new URL(l).protocol, g = new URL(c).protocol;
      return d === g;
    }, "isSameProtocol");
    var pipeline = require$$0$1.promisify(Stream__default.pipeline);
    var INTERNALS$2 = Symbol("Body internals");
    var on = class on {
      static {
        __name(this, "on");
      }
      constructor(l, { size: d = 0 } = {}) {
        let g = null;
        l === null ? l = null : isURLSearchParameters(l) ? l = require$$0.Buffer.from(l.toString()) : isBlob(l) || require$$0.Buffer.isBuffer(l) || (require$$0$1.types.isAnyArrayBuffer(l) ? l = require$$0.Buffer.from(l) : ArrayBuffer.isView(l) ? l = require$$0.Buffer.from(l.buffer, l.byteOffset, l.byteLength) : l instanceof Stream__default || (l instanceof FormData ? (l = formDataToBlob(l), g = l.type.split("=")[1]) : l = require$$0.Buffer.from(String(l))));
        let b = l;
        require$$0.Buffer.isBuffer(l) ? b = Stream__default.Readable.from(l) : isBlob(l) && (b = Stream__default.Readable.from(l.stream())), this[INTERNALS$2] = { body: l, stream: b, boundary: g, disturbed: false, error: null }, this.size = d, l instanceof Stream__default && l.on("error", (R) => {
          const w = R instanceof FetchBaseError ? R : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${R.message}`, "system", R);
          this[INTERNALS$2].error = w;
        });
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer: l, byteOffset: d, byteLength: g } = await consumeBody(this);
        return l.slice(d, d + g);
      }
      async formData() {
        const l = this.headers.get("content-type");
        if (l.startsWith("application/x-www-form-urlencoded")) {
          const g = new FormData(), b = new URLSearchParams(await this.text());
          for (const [R, w] of b) g.append(R, w);
          return g;
        }
        const { toFormData: d } = await import("./multipart-parser-A5RMPCPX.mjs");
        return d(this.body, l);
      }
      async blob() {
        const l = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "", d = await this.arrayBuffer();
        return new Blob([d], { type: l });
      }
      async json() {
        const l = await this.text();
        return JSON.parse(l);
      }
      async text() {
        const l = await consumeBody(this);
        return new TextDecoder().decode(l);
      }
      buffer() {
        return consumeBody(this);
      }
    };
    u(on, "Body");
    var Body = on;
    Body.prototype.buffer = require$$0$1.deprecate(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer"), Object.defineProperties(Body.prototype, { body: { enumerable: true }, bodyUsed: { enumerable: true }, arrayBuffer: { enumerable: true }, blob: { enumerable: true }, json: { enumerable: true }, text: { enumerable: true }, data: { get: require$$0$1.deprecate(() => {
    }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") } });
    async function consumeBody(c) {
      if (c[INTERNALS$2].disturbed) throw new TypeError(`body used already for: ${c.url}`);
      if (c[INTERNALS$2].disturbed = true, c[INTERNALS$2].error) throw c[INTERNALS$2].error;
      const { body: l } = c;
      if (l === null || !(l instanceof Stream__default)) return require$$0.Buffer.alloc(0);
      const d = [];
      let g = 0;
      try {
        for await (const b of l) {
          if (c.size > 0 && g + b.length > c.size) {
            const R = new FetchError(`content size at ${c.url} over limit: ${c.size}`, "max-size");
            throw l.destroy(R), R;
          }
          g += b.length, d.push(b);
        }
      } catch (b) {
        throw b instanceof FetchBaseError ? b : new FetchError(`Invalid response body while trying to fetch ${c.url}: ${b.message}`, "system", b);
      }
      if (l.readableEnded === true || l._readableState.ended === true) try {
        return d.every((b) => typeof b == "string") ? require$$0.Buffer.from(d.join("")) : require$$0.Buffer.concat(d, g);
      } catch (b) {
        throw new FetchError(`Could not create Buffer from response body for ${c.url}: ${b.message}`, "system", b);
      }
      else throw new FetchError(`Premature close of server response while trying to fetch ${c.url}`);
    }
    __name(consumeBody, "consumeBody");
    u(consumeBody, "consumeBody");
    var clone = u((c, l) => {
      let d, g, { body: b } = c[INTERNALS$2];
      if (c.bodyUsed) throw new Error("cannot clone body after it is used");
      return b instanceof Stream__default && typeof b.getBoundary != "function" && (d = new Stream.PassThrough({ highWaterMark: l }), g = new Stream.PassThrough({ highWaterMark: l }), b.pipe(d), b.pipe(g), c[INTERNALS$2].stream = d, b = g), b;
    }, "clone");
    var getNonSpecFormDataBoundary = require$$0$1.deprecate((c) => c.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    var extractContentType = u((c, l) => c === null ? null : typeof c == "string" ? "text/plain;charset=UTF-8" : isURLSearchParameters(c) ? "application/x-www-form-urlencoded;charset=UTF-8" : isBlob(c) ? c.type || null : require$$0.Buffer.isBuffer(c) || require$$0$1.types.isAnyArrayBuffer(c) || ArrayBuffer.isView(c) ? null : c instanceof FormData ? `multipart/form-data; boundary=${l[INTERNALS$2].boundary}` : c && typeof c.getBoundary == "function" ? `multipart/form-data;boundary=${getNonSpecFormDataBoundary(c)}` : c instanceof Stream__default ? null : "text/plain;charset=UTF-8", "extractContentType");
    var getTotalBytes = u((c) => {
      const { body: l } = c[INTERNALS$2];
      return l === null ? 0 : isBlob(l) ? l.size : require$$0.Buffer.isBuffer(l) ? l.length : l && typeof l.getLengthSync == "function" && l.hasKnownLength && l.hasKnownLength() ? l.getLengthSync() : null;
    }, "getTotalBytes");
    var writeToStream = u(async (c, { body: l }) => {
      l === null ? c.end() : await pipeline(l, c);
    }, "writeToStream");
    var validateHeaderName = typeof http__default.validateHeaderName == "function" ? http__default.validateHeaderName : (c) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(c)) {
        const l = new TypeError(`Header name must be a valid HTTP token [${c}]`);
        throw Object.defineProperty(l, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), l;
      }
    };
    var validateHeaderValue = typeof http__default.validateHeaderValue == "function" ? http__default.validateHeaderValue : (c, l) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(l)) {
        const d = new TypeError(`Invalid character in header content ["${c}"]`);
        throw Object.defineProperty(d, "code", { value: "ERR_INVALID_CHAR" }), d;
      }
    };
    var Kt = class Kt2 extends URLSearchParams {
      static {
        __name(this, "Kt");
      }
      constructor(l) {
        let d = [];
        if (l instanceof Kt2) {
          const g = l.raw();
          for (const [b, R] of Object.entries(g)) d.push(...R.map((w) => [b, w]));
        } else if (l != null) if (typeof l == "object" && !require$$0$1.types.isBoxedPrimitive(l)) {
          const g = l[Symbol.iterator];
          if (g == null) d.push(...Object.entries(l));
          else {
            if (typeof g != "function") throw new TypeError("Header pairs must be iterable");
            d = [...l].map((b) => {
              if (typeof b != "object" || require$$0$1.types.isBoxedPrimitive(b)) throw new TypeError("Each header pair must be an iterable object");
              return [...b];
            }).map((b) => {
              if (b.length !== 2) throw new TypeError("Each header pair must be a name/value tuple");
              return [...b];
            });
          }
        } else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        return d = d.length > 0 ? d.map(([g, b]) => (validateHeaderName(g), validateHeaderValue(g, String(b)), [String(g).toLowerCase(), String(b)])) : void 0, super(d), new Proxy(this, { get(g, b, R) {
          switch (b) {
            case "append":
            case "set":
              return (w, A) => (validateHeaderName(w), validateHeaderValue(w, String(A)), URLSearchParams.prototype[b].call(g, String(w).toLowerCase(), String(A)));
            case "delete":
            case "has":
            case "getAll":
              return (w) => (validateHeaderName(w), URLSearchParams.prototype[b].call(g, String(w).toLowerCase()));
            case "keys":
              return () => (g.sort(), new Set(URLSearchParams.prototype.keys.call(g)).keys());
            default:
              return Reflect.get(g, b, R);
          }
        } });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(l) {
        const d = this.getAll(l);
        if (d.length === 0) return null;
        let g = d.join(", ");
        return /^content-encoding$/i.test(l) && (g = g.toLowerCase()), g;
      }
      forEach(l, d = void 0) {
        for (const g of this.keys()) Reflect.apply(l, d, [this.get(g), g, this]);
      }
      *values() {
        for (const l of this.keys()) yield this.get(l);
      }
      *entries() {
        for (const l of this.keys()) yield [l, this.get(l)];
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((l, d) => (l[d] = this.getAll(d), l), {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((l, d) => {
          const g = this.getAll(d);
          return d === "host" ? l[d] = g[0] : l[d] = g.length > 1 ? g : g[0], l;
        }, {});
      }
    };
    u(Kt, "Headers");
    var Headers = Kt;
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((c, l) => (c[l] = { enumerable: true }, c), {}));
    function fromRawHeaders(c = []) {
      return new Headers(c.reduce((l, d, g, b) => (g % 2 === 0 && l.push(b.slice(g, g + 2)), l), []).filter(([l, d]) => {
        try {
          return validateHeaderName(l), validateHeaderValue(l, String(d)), true;
        } catch {
          return false;
        }
      }));
    }
    __name(fromRawHeaders, "fromRawHeaders");
    u(fromRawHeaders, "fromRawHeaders");
    var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    var isRedirect = u((c) => redirectStatus.has(c), "isRedirect");
    var INTERNALS$1 = Symbol("Response internals");
    var Me = class Me2 extends Body {
      static {
        __name(this, "Me");
      }
      constructor(l = null, d = {}) {
        super(l, d);
        const g = d.status != null ? d.status : 200, b = new Headers(d.headers);
        if (l !== null && !b.has("Content-Type")) {
          const R = extractContentType(l, this);
          R && b.append("Content-Type", R);
        }
        this[INTERNALS$1] = { type: "default", url: d.url, status: g, statusText: d.statusText || "", headers: b, counter: d.counter, highWaterMark: d.highWaterMark };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Me2(clone(this, this.highWaterMark), { type: this.type, url: this.url, status: this.status, statusText: this.statusText, headers: this.headers, ok: this.ok, redirected: this.redirected, size: this.size, highWaterMark: this.highWaterMark });
      }
      static redirect(l, d = 302) {
        if (!isRedirect(d)) throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        return new Me2(null, { headers: { location: new URL(l).toString() }, status: d });
      }
      static error() {
        const l = new Me2(null, { status: 0, statusText: "" });
        return l[INTERNALS$1].type = "error", l;
      }
      static json(l = void 0, d = {}) {
        const g = JSON.stringify(l);
        if (g === void 0) throw new TypeError("data is not JSON serializable");
        const b = new Headers(d && d.headers);
        return b.has("content-type") || b.set("content-type", "application/json"), new Me2(g, { ...d, headers: b });
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    u(Me, "Response");
    var Response = Me;
    Object.defineProperties(Response.prototype, { type: { enumerable: true }, url: { enumerable: true }, status: { enumerable: true }, ok: { enumerable: true }, redirected: { enumerable: true }, statusText: { enumerable: true }, headers: { enumerable: true }, clone: { enumerable: true } });
    var getSearch = u((c) => {
      if (c.search) return c.search;
      const l = c.href.length - 1, d = c.hash || (c.href[l] === "#" ? "#" : "");
      return c.href[l - d.length] === "?" ? "?" : "";
    }, "getSearch");
    function stripURLForUseAsAReferrer(c, l = false) {
      return c == null || (c = new URL(c), /^(about|blob|data):$/.test(c.protocol)) ? "no-referrer" : (c.username = "", c.password = "", c.hash = "", l && (c.pathname = "", c.search = ""), c);
    }
    __name(stripURLForUseAsAReferrer, "stripURLForUseAsAReferrer");
    u(stripURLForUseAsAReferrer, "stripURLForUseAsAReferrer");
    var ReferrerPolicy = /* @__PURE__ */ new Set(["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"]);
    var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    function validateReferrerPolicy(c) {
      if (!ReferrerPolicy.has(c)) throw new TypeError(`Invalid referrerPolicy: ${c}`);
      return c;
    }
    __name(validateReferrerPolicy, "validateReferrerPolicy");
    u(validateReferrerPolicy, "validateReferrerPolicy");
    function isOriginPotentiallyTrustworthy(c) {
      if (/^(http|ws)s:$/.test(c.protocol)) return true;
      const l = c.host.replace(/(^\[)|(]$)/g, ""), d = require$$0$2.isIP(l);
      return d === 4 && /^127\./.test(l) || d === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(l) ? true : c.host === "localhost" || c.host.endsWith(".localhost") ? false : c.protocol === "file:";
    }
    __name(isOriginPotentiallyTrustworthy, "isOriginPotentiallyTrustworthy");
    u(isOriginPotentiallyTrustworthy, "isOriginPotentiallyTrustworthy");
    function isUrlPotentiallyTrustworthy(c) {
      return /^about:(blank|srcdoc)$/.test(c) || c.protocol === "data:" || /^(blob|filesystem):$/.test(c.protocol) ? true : isOriginPotentiallyTrustworthy(c);
    }
    __name(isUrlPotentiallyTrustworthy, "isUrlPotentiallyTrustworthy");
    u(isUrlPotentiallyTrustworthy, "isUrlPotentiallyTrustworthy");
    function determineRequestsReferrer(c, { referrerURLCallback: l, referrerOriginCallback: d } = {}) {
      if (c.referrer === "no-referrer" || c.referrerPolicy === "") return null;
      const g = c.referrerPolicy;
      if (c.referrer === "about:client") return "no-referrer";
      const b = c.referrer;
      let R = stripURLForUseAsAReferrer(b), w = stripURLForUseAsAReferrer(b, true);
      R.toString().length > 4096 && (R = w), l && (R = l(R)), d && (w = d(w));
      const A = new URL(c.url);
      switch (g) {
        case "no-referrer":
          return "no-referrer";
        case "origin":
          return w;
        case "unsafe-url":
          return R;
        case "strict-origin":
          return isUrlPotentiallyTrustworthy(R) && !isUrlPotentiallyTrustworthy(A) ? "no-referrer" : w.toString();
        case "strict-origin-when-cross-origin":
          return R.origin === A.origin ? R : isUrlPotentiallyTrustworthy(R) && !isUrlPotentiallyTrustworthy(A) ? "no-referrer" : w;
        case "same-origin":
          return R.origin === A.origin ? R : "no-referrer";
        case "origin-when-cross-origin":
          return R.origin === A.origin ? R : w;
        case "no-referrer-when-downgrade":
          return isUrlPotentiallyTrustworthy(R) && !isUrlPotentiallyTrustworthy(A) ? "no-referrer" : R;
        default:
          throw new TypeError(`Invalid referrerPolicy: ${g}`);
      }
    }
    __name(determineRequestsReferrer, "determineRequestsReferrer");
    u(determineRequestsReferrer, "determineRequestsReferrer");
    function parseReferrerPolicyFromHeader(c) {
      const l = (c.get("referrer-policy") || "").split(/[,\s]+/);
      let d = "";
      for (const g of l) g && ReferrerPolicy.has(g) && (d = g);
      return d;
    }
    __name(parseReferrerPolicyFromHeader, "parseReferrerPolicyFromHeader");
    u(parseReferrerPolicyFromHeader, "parseReferrerPolicyFromHeader");
    var INTERNALS = Symbol("Request internals");
    var isRequest = u((c) => typeof c == "object" && typeof c[INTERNALS] == "object", "isRequest");
    var doBadDataWarn = require$$0$1.deprecate(() => {
    }, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
    var Jt = class Jt2 extends Body {
      static {
        __name(this, "Jt");
      }
      constructor(l, d = {}) {
        let g;
        if (isRequest(l) ? g = new URL(l.url) : (g = new URL(l), l = {}), g.username !== "" || g.password !== "") throw new TypeError(`${g} is an url with embedded credentials.`);
        let b = d.method || l.method || "GET";
        if (/^(delete|get|head|options|post|put)$/i.test(b) && (b = b.toUpperCase()), !isRequest(d) && "data" in d && doBadDataWarn(), (d.body != null || isRequest(l) && l.body !== null) && (b === "GET" || b === "HEAD")) throw new TypeError("Request with GET/HEAD method cannot have body");
        const R = d.body ? d.body : isRequest(l) && l.body !== null ? clone(l) : null;
        super(R, { size: d.size || l.size || 0 });
        const w = new Headers(d.headers || l.headers || {});
        if (R !== null && !w.has("Content-Type")) {
          const B = extractContentType(R, this);
          B && w.set("Content-Type", B);
        }
        let A = isRequest(l) ? l.signal : null;
        if ("signal" in d && (A = d.signal), A != null && !isAbortSignal(A)) throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        let z = d.referrer == null ? l.referrer : d.referrer;
        if (z === "") z = "no-referrer";
        else if (z) {
          const B = new URL(z);
          z = /^about:(\/\/)?client$/.test(B) ? "client" : B;
        } else z = void 0;
        this[INTERNALS] = { method: b, redirect: d.redirect || l.redirect || "follow", headers: w, parsedURL: g, signal: A, referrer: z }, this.follow = d.follow === void 0 ? l.follow === void 0 ? 20 : l.follow : d.follow, this.compress = d.compress === void 0 ? l.compress === void 0 ? true : l.compress : d.compress, this.counter = d.counter || l.counter || 0, this.agent = d.agent || l.agent, this.highWaterMark = d.highWaterMark || l.highWaterMark || 16384, this.insecureHTTPParser = d.insecureHTTPParser || l.insecureHTTPParser || false, this.referrerPolicy = d.referrerPolicy || l.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return require$$1.format(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") return "";
        if (this[INTERNALS].referrer === "client") return "about:client";
        if (this[INTERNALS].referrer) return this[INTERNALS].referrer.toString();
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(l) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(l);
      }
      clone() {
        return new Jt2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    u(Jt, "Request");
    var Request = Jt;
    Object.defineProperties(Request.prototype, { method: { enumerable: true }, url: { enumerable: true }, headers: { enumerable: true }, redirect: { enumerable: true }, clone: { enumerable: true }, signal: { enumerable: true }, referrer: { enumerable: true }, referrerPolicy: { enumerable: true } });
    var getNodeRequestOptions = u((c) => {
      const { parsedURL: l } = c[INTERNALS], d = new Headers(c[INTERNALS].headers);
      d.has("Accept") || d.set("Accept", "*/*");
      let g = null;
      if (c.body === null && /^(post|put)$/i.test(c.method) && (g = "0"), c.body !== null) {
        const A = getTotalBytes(c);
        typeof A == "number" && !Number.isNaN(A) && (g = String(A));
      }
      g && d.set("Content-Length", g), c.referrerPolicy === "" && (c.referrerPolicy = DEFAULT_REFERRER_POLICY), c.referrer && c.referrer !== "no-referrer" ? c[INTERNALS].referrer = determineRequestsReferrer(c) : c[INTERNALS].referrer = "no-referrer", c[INTERNALS].referrer instanceof URL && d.set("Referer", c.referrer), d.has("User-Agent") || d.set("User-Agent", "node-fetch"), c.compress && !d.has("Accept-Encoding") && d.set("Accept-Encoding", "gzip, deflate, br");
      let { agent: b } = c;
      typeof b == "function" && (b = b(l));
      const R = getSearch(l), w = { path: l.pathname + R, method: c.method, headers: d[Symbol.for("nodejs.util.inspect.custom")](), insecureHTTPParser: c.insecureHTTPParser, agent: b };
      return { parsedURL: l, options: w };
    }, "getNodeRequestOptions");
    var sn = class sn extends FetchBaseError {
      static {
        __name(this, "sn");
      }
      constructor(l, d = "aborted") {
        super(l, d);
      }
    };
    u(sn, "AbortError");
    var AbortError = sn;
    var nodeDomexception;
    var hasRequiredNodeDomexception;
    function requireNodeDomexception() {
      if (hasRequiredNodeDomexception) return nodeDomexception;
      if (hasRequiredNodeDomexception = 1, !globalThis.DOMException) try {
        const { MessageChannel: c } = __require("worker_threads"), l = new c().port1, d = new ArrayBuffer();
        l.postMessage(d, [d, d]);
      } catch (c) {
        c.constructor.name === "DOMException" && (globalThis.DOMException = c.constructor);
      }
      return nodeDomexception = globalThis.DOMException, nodeDomexception;
    }
    __name(requireNodeDomexception, "requireNodeDomexception");
    u(requireNodeDomexception, "requireNodeDomexception");
    var nodeDomexceptionExports = requireNodeDomexception();
    var DOMException = _commonjsHelpers.getDefaultExportFromCjs(nodeDomexceptionExports);
    var { stat } = node_fs.promises;
    var blobFromSync = u((c, l) => fromBlob(node_fs.statSync(c), c, l), "blobFromSync");
    var blobFrom = u((c, l) => stat(c).then((d) => fromBlob(d, c, l)), "blobFrom");
    var fileFrom = u((c, l) => stat(c).then((d) => fromFile(d, c, l)), "fileFrom");
    var fileFromSync = u((c, l) => fromFile(node_fs.statSync(c), c, l), "fileFromSync");
    var fromBlob = u((c, l, d = "") => new Blob([new BlobDataItem({ path: l, size: c.size, lastModified: c.mtimeMs, start: 0 })], { type: d }), "fromBlob");
    var fromFile = u((c, l, d = "") => new File([new BlobDataItem({ path: l, size: c.size, lastModified: c.mtimeMs, start: 0 })], node_path.basename(l), { type: d, lastModified: c.mtimeMs }), "fromFile");
    var Xt = class Xt2 {
      static {
        __name(this, "Xt");
      }
      constructor(l) {
        ye(this, xe);
        ye(this, Ue);
        ne(this, xe, l.path), ne(this, Ue, l.start), this.size = l.size, this.lastModified = l.lastModified;
      }
      slice(l, d) {
        return new Xt2({ path: D(this, xe), lastModified: this.lastModified, size: d - l, start: D(this, Ue) + l });
      }
      async *stream() {
        const { mtimeMs: l } = await stat(D(this, xe));
        if (l > this.lastModified) throw new DOMException("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
        yield* node_fs.createReadStream(D(this, xe), { start: D(this, Ue), end: D(this, Ue) + this.size - 1 });
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
    };
    xe = /* @__PURE__ */ new WeakMap(), Ue = /* @__PURE__ */ new WeakMap(), u(Xt, "BlobDataItem");
    var BlobDataItem = Xt;
    var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
    async function fetch$1(c, l) {
      return new Promise((d, g) => {
        const b = new Request(c, l), { parsedURL: R, options: w } = getNodeRequestOptions(b);
        if (!supportedSchemas.has(R.protocol)) throw new TypeError(`node-fetch cannot load ${c}. URL scheme "${R.protocol.replace(/:$/, "")}" is not supported.`);
        if (R.protocol === "data:") {
          const v = dataUriToBuffer(b.url), K = new Response(v, { headers: { "Content-Type": v.typeFull } });
          d(K);
          return;
        }
        const A = (R.protocol === "https:" ? https__default : http__default).request, { signal: z } = b;
        let B = null;
        const I = u(() => {
          const v = new AbortError("The operation was aborted.");
          g(v), b.body && b.body instanceof Stream__default.Readable && b.body.destroy(v), !(!B || !B.body) && B.body.emit("error", v);
        }, "abort");
        if (z && z.aborted) {
          I();
          return;
        }
        const k = u(() => {
          I(), $();
        }, "abortAndFinalize"), T = A(R.toString(), w);
        z && z.addEventListener("abort", k);
        const $ = u(() => {
          T.abort(), z && z.removeEventListener("abort", k);
        }, "finalize");
        T.on("error", (v) => {
          g(new FetchError(`request to ${b.url} failed, reason: ${v.message}`, "system", v)), $();
        }), fixResponseChunkedTransferBadEnding(T, (v) => {
          B && B.body && B.body.destroy(v);
        }), process.version < "v14" && T.on("socket", (v) => {
          let K;
          v.prependListener("end", () => {
            K = v._eventsCount;
          }), v.prependListener("close", (U) => {
            if (B && K < v._eventsCount && !U) {
              const N = new Error("Premature close");
              N.code = "ERR_STREAM_PREMATURE_CLOSE", B.body.emit("error", N);
            }
          });
        }), T.on("response", (v) => {
          T.setTimeout(0);
          const K = fromRawHeaders(v.rawHeaders);
          if (isRedirect(v.statusCode)) {
            const M = K.get("Location");
            let H = null;
            try {
              H = M === null ? null : new URL(M, b.url);
            } catch {
              if (b.redirect !== "manual") {
                g(new FetchError(`uri requested responds with an invalid redirect URL: ${M}`, "invalid-redirect")), $();
                return;
              }
            }
            switch (b.redirect) {
              case "error":
                g(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${b.url}`, "no-redirect")), $();
                return;
              case "manual":
                break;
              case "follow": {
                if (H === null) break;
                if (b.counter >= b.follow) {
                  g(new FetchError(`maximum redirect reached at: ${b.url}`, "max-redirect")), $();
                  return;
                }
                const Y = { headers: new Headers(b.headers), follow: b.follow, counter: b.counter + 1, agent: b.agent, compress: b.compress, method: b.method, body: clone(b), signal: b.signal, size: b.size, referrer: b.referrer, referrerPolicy: b.referrerPolicy };
                if (!isDomainOrSubdomain(b.url, H) || !isSameProtocol(b.url, H)) for (const wt of ["authorization", "www-authenticate", "cookie", "cookie2"]) Y.headers.delete(wt);
                if (v.statusCode !== 303 && b.body && l.body instanceof Stream__default.Readable) {
                  g(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), $();
                  return;
                }
                (v.statusCode === 303 || (v.statusCode === 301 || v.statusCode === 302) && b.method === "POST") && (Y.method = "GET", Y.body = void 0, Y.headers.delete("content-length"));
                const Q = parseReferrerPolicyFromHeader(K);
                Q && (Y.referrerPolicy = Q), d(fetch$1(new Request(H, Y))), $();
                return;
              }
              default:
                return g(new TypeError(`Redirect option '${b.redirect}' is not a valid value of RequestRedirect`));
            }
          }
          z && v.once("end", () => {
            z.removeEventListener("abort", k);
          });
          let U = Stream.pipeline(v, new Stream.PassThrough(), (M) => {
            M && g(M);
          });
          process.version < "v12.10" && v.on("aborted", k);
          const N = { url: b.url, status: v.statusCode, statusText: v.statusMessage, headers: K, size: b.size, counter: b.counter, highWaterMark: b.highWaterMark }, J = K.get("Content-Encoding");
          if (!b.compress || b.method === "HEAD" || J === null || v.statusCode === 204 || v.statusCode === 304) {
            B = new Response(U, N), d(B);
            return;
          }
          const ge = { flush: zlib__default.Z_SYNC_FLUSH, finishFlush: zlib__default.Z_SYNC_FLUSH };
          if (J === "gzip" || J === "x-gzip") {
            U = Stream.pipeline(U, zlib__default.createGunzip(ge), (M) => {
              M && g(M);
            }), B = new Response(U, N), d(B);
            return;
          }
          if (J === "deflate" || J === "x-deflate") {
            const M = Stream.pipeline(v, new Stream.PassThrough(), (H) => {
              H && g(H);
            });
            M.once("data", (H) => {
              (H[0] & 15) === 8 ? U = Stream.pipeline(U, zlib__default.createInflate(), (Y) => {
                Y && g(Y);
              }) : U = Stream.pipeline(U, zlib__default.createInflateRaw(), (Y) => {
                Y && g(Y);
              }), B = new Response(U, N), d(B);
            }), M.once("end", () => {
              B || (B = new Response(U, N), d(B));
            });
            return;
          }
          if (J === "br") {
            U = Stream.pipeline(U, zlib__default.createBrotliDecompress(), (M) => {
              M && g(M);
            }), B = new Response(U, N), d(B);
            return;
          }
          B = new Response(U, N), d(B);
        }), writeToStream(T, b).catch(g);
      });
    }
    __name(fetch$1, "fetch$1");
    u(fetch$1, "fetch$1");
    function fixResponseChunkedTransferBadEnding(c, l) {
      const d = require$$0.Buffer.from(`0\r
\r
`);
      let g = false, b = false, R;
      c.on("response", (w) => {
        const { headers: A } = w;
        g = A["transfer-encoding"] === "chunked" && !A["content-length"];
      }), c.on("socket", (w) => {
        const A = u(() => {
          if (g && !b) {
            const B = new Error("Premature close");
            B.code = "ERR_STREAM_PREMATURE_CLOSE", l(B);
          }
        }, "onSocketClose"), z = u((B) => {
          b = require$$0.Buffer.compare(B.slice(-5), d) === 0, !b && R && (b = require$$0.Buffer.compare(R.slice(-3), d.slice(0, 3)) === 0 && require$$0.Buffer.compare(B.slice(-2), d.slice(3)) === 0), R = B;
        }, "onData");
        w.prependListener("close", A), w.on("data", z), c.on("close", () => {
          w.removeListener("close", A), w.removeListener("data", z);
        });
      });
    }
    __name(fixResponseChunkedTransferBadEnding, "fixResponseChunkedTransferBadEnding");
    u(fixResponseChunkedTransferBadEnding, "fixResponseChunkedTransferBadEnding");
    var privateData = /* @__PURE__ */ new WeakMap();
    var wrappers = /* @__PURE__ */ new WeakMap();
    function pd(c) {
      const l = privateData.get(c);
      return console.assert(l != null, "'this' is expected an Event object, but got", c), l;
    }
    __name(pd, "pd");
    u(pd, "pd");
    function setCancelFlag(c) {
      if (c.passiveListener != null) {
        typeof console < "u" && typeof console.error == "function" && console.error("Unable to preventDefault inside passive event listener invocation.", c.passiveListener);
        return;
      }
      c.event.cancelable && (c.canceled = true, typeof c.event.preventDefault == "function" && c.event.preventDefault());
    }
    __name(setCancelFlag, "setCancelFlag");
    u(setCancelFlag, "setCancelFlag");
    function Event(c, l) {
      privateData.set(this, { eventTarget: c, event: l, eventPhase: 2, currentTarget: c, canceled: false, stopped: false, immediateStopped: false, passiveListener: null, timeStamp: l.timeStamp || Date.now() }), Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
      const d = Object.keys(l);
      for (let g = 0; g < d.length; ++g) {
        const b = d[g];
        b in this || Object.defineProperty(this, b, defineRedirectDescriptor(b));
      }
    }
    __name(Event, "Event");
    u(Event, "Event"), Event.prototype = { get type() {
      return pd(this).event.type;
    }, get target() {
      return pd(this).eventTarget;
    }, get currentTarget() {
      return pd(this).currentTarget;
    }, composedPath() {
      const c = pd(this).currentTarget;
      return c == null ? [] : [c];
    }, get NONE() {
      return 0;
    }, get CAPTURING_PHASE() {
      return 1;
    }, get AT_TARGET() {
      return 2;
    }, get BUBBLING_PHASE() {
      return 3;
    }, get eventPhase() {
      return pd(this).eventPhase;
    }, stopPropagation() {
      const c = pd(this);
      c.stopped = true, typeof c.event.stopPropagation == "function" && c.event.stopPropagation();
    }, stopImmediatePropagation() {
      const c = pd(this);
      c.stopped = true, c.immediateStopped = true, typeof c.event.stopImmediatePropagation == "function" && c.event.stopImmediatePropagation();
    }, get bubbles() {
      return !!pd(this).event.bubbles;
    }, get cancelable() {
      return !!pd(this).event.cancelable;
    }, preventDefault() {
      setCancelFlag(pd(this));
    }, get defaultPrevented() {
      return pd(this).canceled;
    }, get composed() {
      return !!pd(this).event.composed;
    }, get timeStamp() {
      return pd(this).timeStamp;
    }, get srcElement() {
      return pd(this).eventTarget;
    }, get cancelBubble() {
      return pd(this).stopped;
    }, set cancelBubble(c) {
      if (!c) return;
      const l = pd(this);
      l.stopped = true, typeof l.event.cancelBubble == "boolean" && (l.event.cancelBubble = true);
    }, get returnValue() {
      return !pd(this).canceled;
    }, set returnValue(c) {
      c || setCancelFlag(pd(this));
    }, initEvent() {
    } }, Object.defineProperty(Event.prototype, "constructor", { value: Event, configurable: true, writable: true }), typeof window < "u" && typeof window.Event < "u" && (Object.setPrototypeOf(Event.prototype, window.Event.prototype), wrappers.set(window.Event.prototype, Event));
    function defineRedirectDescriptor(c) {
      return { get() {
        return pd(this).event[c];
      }, set(l) {
        pd(this).event[c] = l;
      }, configurable: true, enumerable: true };
    }
    __name(defineRedirectDescriptor, "defineRedirectDescriptor");
    u(defineRedirectDescriptor, "defineRedirectDescriptor");
    function defineCallDescriptor(c) {
      return { value() {
        const l = pd(this).event;
        return l[c].apply(l, arguments);
      }, configurable: true, enumerable: true };
    }
    __name(defineCallDescriptor, "defineCallDescriptor");
    u(defineCallDescriptor, "defineCallDescriptor");
    function defineWrapper(c, l) {
      const d = Object.keys(l);
      if (d.length === 0) return c;
      function g(b, R) {
        c.call(this, b, R);
      }
      __name(g, "g");
      u(g, "CustomEvent"), g.prototype = Object.create(c.prototype, { constructor: { value: g, configurable: true, writable: true } });
      for (let b = 0; b < d.length; ++b) {
        const R = d[b];
        if (!(R in c.prototype)) {
          const A = typeof Object.getOwnPropertyDescriptor(l, R).value == "function";
          Object.defineProperty(g.prototype, R, A ? defineCallDescriptor(R) : defineRedirectDescriptor(R));
        }
      }
      return g;
    }
    __name(defineWrapper, "defineWrapper");
    u(defineWrapper, "defineWrapper");
    function getWrapper(c) {
      if (c == null || c === Object.prototype) return Event;
      let l = wrappers.get(c);
      return l == null && (l = defineWrapper(getWrapper(Object.getPrototypeOf(c)), c), wrappers.set(c, l)), l;
    }
    __name(getWrapper, "getWrapper");
    u(getWrapper, "getWrapper");
    function wrapEvent(c, l) {
      const d = getWrapper(Object.getPrototypeOf(l));
      return new d(c, l);
    }
    __name(wrapEvent, "wrapEvent");
    u(wrapEvent, "wrapEvent");
    function isStopped(c) {
      return pd(c).immediateStopped;
    }
    __name(isStopped, "isStopped");
    u(isStopped, "isStopped");
    function setEventPhase(c, l) {
      pd(c).eventPhase = l;
    }
    __name(setEventPhase, "setEventPhase");
    u(setEventPhase, "setEventPhase");
    function setCurrentTarget(c, l) {
      pd(c).currentTarget = l;
    }
    __name(setCurrentTarget, "setCurrentTarget");
    u(setCurrentTarget, "setCurrentTarget");
    function setPassiveListener(c, l) {
      pd(c).passiveListener = l;
    }
    __name(setPassiveListener, "setPassiveListener");
    u(setPassiveListener, "setPassiveListener");
    var listenersMap = /* @__PURE__ */ new WeakMap();
    var CAPTURE = 1;
    var BUBBLE = 2;
    var ATTRIBUTE = 3;
    function isObject(c) {
      return c !== null && typeof c == "object";
    }
    __name(isObject, "isObject");
    u(isObject, "isObject");
    function getListeners(c) {
      const l = listenersMap.get(c);
      if (l == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
      return l;
    }
    __name(getListeners, "getListeners");
    u(getListeners, "getListeners");
    function defineEventAttributeDescriptor(c) {
      return { get() {
        let d = getListeners(this).get(c);
        for (; d != null; ) {
          if (d.listenerType === ATTRIBUTE) return d.listener;
          d = d.next;
        }
        return null;
      }, set(l) {
        typeof l != "function" && !isObject(l) && (l = null);
        const d = getListeners(this);
        let g = null, b = d.get(c);
        for (; b != null; ) b.listenerType === ATTRIBUTE ? g !== null ? g.next = b.next : b.next !== null ? d.set(c, b.next) : d.delete(c) : g = b, b = b.next;
        if (l !== null) {
          const R = { listener: l, listenerType: ATTRIBUTE, passive: false, once: false, next: null };
          g === null ? d.set(c, R) : g.next = R;
        }
      }, configurable: true, enumerable: true };
    }
    __name(defineEventAttributeDescriptor, "defineEventAttributeDescriptor");
    u(defineEventAttributeDescriptor, "defineEventAttributeDescriptor");
    function defineEventAttribute(c, l) {
      Object.defineProperty(c, `on${l}`, defineEventAttributeDescriptor(l));
    }
    __name(defineEventAttribute, "defineEventAttribute");
    u(defineEventAttribute, "defineEventAttribute");
    function defineCustomEventTarget(c) {
      function l() {
        EventTarget.call(this);
      }
      __name(l, "l");
      u(l, "CustomEventTarget"), l.prototype = Object.create(EventTarget.prototype, { constructor: { value: l, configurable: true, writable: true } });
      for (let d = 0; d < c.length; ++d) defineEventAttribute(l.prototype, c[d]);
      return l;
    }
    __name(defineCustomEventTarget, "defineCustomEventTarget");
    u(defineCustomEventTarget, "defineCustomEventTarget");
    function EventTarget() {
      if (this instanceof EventTarget) {
        listenersMap.set(this, /* @__PURE__ */ new Map());
        return;
      }
      if (arguments.length === 1 && Array.isArray(arguments[0])) return defineCustomEventTarget(arguments[0]);
      if (arguments.length > 0) {
        const c = new Array(arguments.length);
        for (let l = 0; l < arguments.length; ++l) c[l] = arguments[l];
        return defineCustomEventTarget(c);
      }
      throw new TypeError("Cannot call a class as a function");
    }
    __name(EventTarget, "EventTarget");
    u(EventTarget, "EventTarget"), EventTarget.prototype = { addEventListener(c, l, d) {
      if (l == null) return;
      if (typeof l != "function" && !isObject(l)) throw new TypeError("'listener' should be a function or an object.");
      const g = getListeners(this), b = isObject(d), w = (b ? !!d.capture : !!d) ? CAPTURE : BUBBLE, A = { listener: l, listenerType: w, passive: b && !!d.passive, once: b && !!d.once, next: null };
      let z = g.get(c);
      if (z === void 0) {
        g.set(c, A);
        return;
      }
      let B = null;
      for (; z != null; ) {
        if (z.listener === l && z.listenerType === w) return;
        B = z, z = z.next;
      }
      B.next = A;
    }, removeEventListener(c, l, d) {
      if (l == null) return;
      const g = getListeners(this), R = (isObject(d) ? !!d.capture : !!d) ? CAPTURE : BUBBLE;
      let w = null, A = g.get(c);
      for (; A != null; ) {
        if (A.listener === l && A.listenerType === R) {
          w !== null ? w.next = A.next : A.next !== null ? g.set(c, A.next) : g.delete(c);
          return;
        }
        w = A, A = A.next;
      }
    }, dispatchEvent(c) {
      if (c == null || typeof c.type != "string") throw new TypeError('"event.type" should be a string.');
      const l = getListeners(this), d = c.type;
      let g = l.get(d);
      if (g == null) return true;
      const b = wrapEvent(this, c);
      let R = null;
      for (; g != null; ) {
        if (g.once ? R !== null ? R.next = g.next : g.next !== null ? l.set(d, g.next) : l.delete(d) : R = g, setPassiveListener(b, g.passive ? g.listener : null), typeof g.listener == "function") try {
          g.listener.call(this, b);
        } catch (w) {
          typeof console < "u" && typeof console.error == "function" && console.error(w);
        }
        else g.listenerType !== ATTRIBUTE && typeof g.listener.handleEvent == "function" && g.listener.handleEvent(b);
        if (isStopped(b)) break;
        g = g.next;
      }
      return setPassiveListener(b, null), setEventPhase(b, 0), setCurrentTarget(b, null), !b.defaultPrevented;
    } }, Object.defineProperty(EventTarget.prototype, "constructor", { value: EventTarget, configurable: true, writable: true }), typeof window < "u" && typeof window.EventTarget < "u" && Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
    var an = class an extends EventTarget {
      static {
        __name(this, "an");
      }
      constructor() {
        throw super(), new TypeError("AbortSignal cannot be constructed directly");
      }
      get aborted() {
        const l = abortedFlags.get(this);
        if (typeof l != "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        return l;
      }
    };
    u(an, "AbortSignal");
    var AbortSignal = an;
    defineEventAttribute(AbortSignal.prototype, "abort");
    function createAbortSignal() {
      const c = Object.create(AbortSignal.prototype);
      return EventTarget.call(c), abortedFlags.set(c, false), c;
    }
    __name(createAbortSignal, "createAbortSignal");
    u(createAbortSignal, "createAbortSignal");
    function abortSignal(c) {
      abortedFlags.get(c) === false && (abortedFlags.set(c, true), c.dispatchEvent({ type: "abort" }));
    }
    __name(abortSignal, "abortSignal");
    u(abortSignal, "abortSignal");
    var abortedFlags = /* @__PURE__ */ new WeakMap();
    Object.defineProperties(AbortSignal.prototype, { aborted: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, { configurable: true, value: "AbortSignal" });
    var AbortController$1 = (at = class {
      static {
        __name(this, "at");
      }
      constructor() {
        signals.set(this, createAbortSignal());
      }
      get signal() {
        return getSignal(this);
      }
      abort() {
        abortSignal(getSignal(this));
      }
    }, u(at, "AbortController"), at);
    var signals = /* @__PURE__ */ new WeakMap();
    function getSignal(c) {
      const l = signals.get(c);
      if (l == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${c === null ? "null" : typeof c}`);
      return l;
    }
    __name(getSignal, "getSignal");
    u(getSignal, "getSignal"), Object.defineProperties(AbortController$1.prototype, { signal: { enumerable: true }, abort: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(AbortController$1.prototype, Symbol.toStringTag, { configurable: true, value: "AbortController" });
    var t = Object.defineProperty;
    var e = u((c, l) => t(c, "name", { value: l, configurable: true }), "e");
    var fetch = fetch$1;
    s();
    function s() {
      !globalThis.process?.versions?.node && !globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN && console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");
    }
    __name(s, "s");
    u(s, "s"), e(s, "checkNodeEnvironment"), exports.AbortController = AbortController$1, exports.AbortError = AbortError, exports.Blob = Blob, exports.FetchError = FetchError, exports.File = File, exports.FormData = FormData, exports.Headers = Headers, exports.Request = Request, exports.Response = Response, exports.blobFrom = blobFrom, exports.blobFromSync = blobFromSync, exports.default = fetch, exports.fetch = fetch, exports.fileFrom = fileFrom, exports.fileFromSync = fileFromSync, exports.isRedirect = isRedirect;
  }
});

export {
  require_node_fetch_native_DhEqb06g,
  require_node
};
/*! Bundled license information:

node-fetch-native/dist/node.cjs:
  (**
  * @license
  * web-streams-polyfill v3.3.3
  * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
  * This code is released under the MIT license.
  * SPDX-License-Identifier: MIT
  *)
  (*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
  (*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
  (*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> *)
*/
//# sourceMappingURL=chunk-2HFDQSS3.mjs.map
