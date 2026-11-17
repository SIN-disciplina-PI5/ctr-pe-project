import {
  AppendAck,
  DEFAULT_USER_AGENT,
  FifoQueue,
  RangeNotSatisfiableError,
  ReadBatch,
  RetryAppendSession,
  RetryReadSession,
  S2Error,
  S2_ENCRYPTION_KEY_HEADER,
  bigintToSafeNumber,
  convertProtoRecord,
  encodeProtoAppendInput,
  err,
  errClose,
  fromAPIStreamPosition,
  makeAppendPreconditionError,
  makeServerError,
  ok,
  okClose,
  require_src,
  s2Error,
  value
} from "./chunk-KIVH2MKR.mjs";
import {
  __name,
  __toESM,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/index.js
init_esm();
var import_debug2 = __toESM(require_src(), 1);

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/compression.js
init_esm();

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/framing.js
init_esm();
var FLAG_TOTAL_SIZE = 1;
var STATUS_CODE_SIZE = 2;
var MAX_FRAME_BYTES = 2 * 1024 * 1024;
var MAX_FRAME_PAYLOAD_BYTES = MAX_FRAME_BYTES - FLAG_TOTAL_SIZE;
var MAX_DECOMPRESSED_PAYLOAD_BYTES = MAX_FRAME_PAYLOAD_BYTES;
function frameMessage(opts) {
  const compression = opts.terminal ? "none" : opts.compression ?? "none";
  let flag = 0;
  if (opts.terminal) {
    flag |= 128;
  }
  if (compression === "zstd") {
    flag |= 32;
  } else if (compression === "gzip") {
    flag |= 64;
  }
  let body = opts.body;
  if (opts.terminal && opts.statusCode !== void 0) {
    const statusBytes = new Uint8Array(2);
    statusBytes[0] = opts.statusCode >> 8 & 255;
    statusBytes[1] = opts.statusCode & 255;
    body = new Uint8Array(statusBytes.length + opts.body.length);
    body.set(statusBytes, 0);
    body.set(opts.body, statusBytes.length);
  }
  const length = 1 + body.length;
  if (length > MAX_FRAME_BYTES) {
    throw new Error(`Message too large: ${length} bytes (max ${MAX_FRAME_BYTES} bytes)`);
  }
  const frame = new Uint8Array(3 + length);
  frame[0] = length >> 16 & 255;
  frame[1] = length >> 8 & 255;
  frame[2] = length & 255;
  frame[3] = flag;
  frame.set(body, 4);
  return frame;
}
__name(frameMessage, "frameMessage");
var S2SFrameParser = class {
  static {
    __name(this, "S2SFrameParser");
  }
  buffer = new Uint8Array(0);
  /**
   * Add data to the parser buffer
   */
  push(data) {
    const newBuffer = new Uint8Array(this.buffer.length + data.length);
    newBuffer.set(this.buffer, 0);
    newBuffer.set(data, this.buffer.length);
    this.buffer = newBuffer;
  }
  /**
   * Try to parse the next frame from the buffer
   * Returns null if not enough data available
   */
  parseFrame() {
    if (this.buffer.length < 4) {
      return null;
    }
    const length = this.buffer[0] << 16 | this.buffer[1] << 8 | this.buffer[2];
    if (length > MAX_FRAME_BYTES) {
      throw new Error("frame exceeds decode limit");
    }
    if (length < 1) {
      throw new Error(`Invalid S2S frame: length prefix is 0, but the flag byte is mandatory (minimum length is 1)`);
    }
    if (this.buffer.length < 3 + length) {
      return null;
    }
    const flag = this.buffer[3];
    const terminal = (flag & 128) !== 0;
    const compressionBits = (flag & 96) >> 5;
    let compression;
    switch (compressionBits) {
      case 0:
        compression = "none";
        break;
      case 1:
        compression = "zstd";
        break;
      case 2:
        compression = "gzip";
        break;
      default:
        throw new Error("unknown compression algorithm");
    }
    let body = this.buffer.slice(4, 4 + length - 1);
    let statusCode;
    if (terminal) {
      if (body.length < STATUS_CODE_SIZE) {
        throw new Error("terminal message missing status code");
      }
      statusCode = body[0] << 8 | body[1];
      body = body.slice(STATUS_CODE_SIZE);
    }
    this.buffer = this.buffer.slice(3 + length);
    return {
      terminal,
      compression,
      body,
      statusCode
    };
  }
  /**
   * Check if parser has any buffered data
   */
  hasData() {
    return this.buffer.length > 0;
  }
};

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/compression.js
var nodeZlibSpecifier = "node:zlib";
var zlibModule;
var zlibPromise;
async function loadZlib() {
  if (!zlibPromise) {
    zlibPromise = import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      nodeZlibSpecifier
    ).then((mod) => {
      zlibModule = mod;
      return zlibModule;
    });
  }
  return zlibPromise;
}
__name(loadZlib, "loadZlib");
function getLoadedZlib(type) {
  if (!zlibModule) {
    throw new Error(`received unexpected ${type}-compressed frame: compression was not negotiated`);
  }
  return zlibModule;
}
__name(getLoadedZlib, "getLoadedZlib");
async function assertCompressionSupported(type) {
  if (type === "none") {
    return;
  }
  const z = await loadZlib();
  if (type === "zstd" && (!z.zstdCompressSync || !z.zstdDecompressSync)) {
    throw new Error("zstd compression requires Node.js v22.15+ (zlib zstd APIs are unavailable in this runtime)");
  }
}
__name(assertCompressionSupported, "assertCompressionSupported");
function acceptEncodingHeader(compression) {
  if (compression === "none") {
    return Promise.resolve(void 0);
  }
  return Promise.resolve(compression);
}
__name(acceptEncodingHeader, "acceptEncodingHeader");
function assertDecompressedPayloadSize(body) {
  if (body.byteLength > MAX_DECOMPRESSED_PAYLOAD_BYTES) {
    throw new Error("payload exceeds decompressed limit");
  }
}
__name(assertDecompressedPayloadSize, "assertDecompressedPayloadSize");
function assertCompressedPayloadSize(body) {
  if (body.byteLength > MAX_FRAME_PAYLOAD_BYTES) {
    throw new Error("compressed payload exceeds frame limit");
  }
}
__name(assertCompressedPayloadSize, "assertCompressedPayloadSize");
async function compressFrameBody(body, type) {
  assertDecompressedPayloadSize(body);
  switch (type) {
    case "none":
      return body;
    case "gzip":
      return assertAndReturnCompressed((await loadZlib()).gzipSync(body));
    case "zstd": {
      const z = await loadZlib();
      if (!z.zstdCompressSync) {
        throw new Error("zstd compression requires Node.js v22.15+");
      }
      return assertAndReturnCompressed(z.zstdCompressSync(body));
    }
  }
}
__name(compressFrameBody, "compressFrameBody");
function assertAndReturnCompressed(body) {
  assertCompressedPayloadSize(body);
  return body;
}
__name(assertAndReturnCompressed, "assertAndReturnCompressed");
function decompressFrameBody(body, type) {
  switch (type) {
    case "none": {
      assertDecompressedPayloadSize(body);
      return body;
    }
    case "gzip":
      return getLoadedZlib(type).gunzipSync(body, {
        maxOutputLength: MAX_DECOMPRESSED_PAYLOAD_BYTES
      });
    case "zstd": {
      const z = getLoadedZlib(type);
      if (!z.zstdDecompressSync) {
        throw new Error("zstd decompression requires Node.js v22.15+");
      }
      return z.zstdDecompressSync(body, {
        maxOutputLength: MAX_DECOMPRESSED_PAYLOAD_BYTES
      });
    }
  }
}
__name(decompressFrameBody, "decompressFrameBody");

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/pool.js
init_esm();
var import_debug = __toESM(require_src(), 1);
var debug = (0, import_debug.default)("s2:s2s:pool");
var MAX_CONCURRENT_STREAMS_PER_CONNECTION = 100;
var DEFAULT_CONNECTION_TIMEOUT_MS = 3e3;
var DEFAULT_WINDOW_SIZE = 10 * 1024 * 1024;
var MIN_WINDOW_SIZE = 65535;
var MAX_WINDOW_SIZE = 2 ** 31 - 1;
function validateWindowSize(name, value2) {
  if (!Number.isInteger(value2) || value2 < MIN_WINDOW_SIZE || value2 > MAX_WINDOW_SIZE) {
    throw new S2Error({
      message: `http2.${name} must be an integer between ${MIN_WINDOW_SIZE} and ${MAX_WINDOW_SIZE}, got ${value2}`,
      status: 400,
      origin: "sdk"
    });
  }
}
__name(validateWindowSize, "validateWindowSize");
function resolveHttp2Settings(settings) {
  const initialStreamWindowSize = settings?.initialStreamWindowSize ?? DEFAULT_WINDOW_SIZE;
  const connectionWindowSize = settings?.connectionWindowSize ?? DEFAULT_WINDOW_SIZE;
  validateWindowSize("initialStreamWindowSize", initialStreamWindowSize);
  validateWindowSize("connectionWindowSize", connectionWindowSize);
  return { initialStreamWindowSize, connectionWindowSize };
}
__name(resolveHttp2Settings, "resolveHttp2Settings");
function endpointKey(origin, settings) {
  return `${origin}|isw=${settings.initialStreamWindowSize}|cw=${settings.connectionWindowSize}`;
}
__name(endpointKey, "endpointKey");
var http2ModulePromise;
async function loadHttp2() {
  if (!http2ModulePromise) {
    http2ModulePromise = import(
      /* webpackIgnore: true */
      /* @vite-ignore */
      "node:http2"
    );
  }
  return http2ModulePromise;
}
__name(loadHttp2, "loadHttp2");
var Http2ConnectionPool = class {
  static {
    __name(this, "Http2ConnectionPool");
  }
  endpoints = /* @__PURE__ */ new Map();
  maxStreamsPerConnection;
  constructor(options) {
    this.maxStreamsPerConnection = options?.maxConcurrentStreamsPerConnection ?? MAX_CONCURRENT_STREAMS_PER_CONNECTION;
  }
  /**
   * Register as a user of an endpoint. Must be paired with a `detach` call
   * with the same settings; connections are shared by all users attached
   * with equal settings and closed on last detach.
   */
  attach(origin, http2) {
    const settings = resolveHttp2Settings(http2);
    const key = endpointKey(origin, settings);
    const endpoint = this.endpoints.get(key);
    if (endpoint) {
      endpoint.refCount += 1;
    } else {
      this.endpoints.set(key, {
        refCount: 1,
        connections: [],
        pending: [],
        origin,
        settings
      });
    }
  }
  /**
   * The inverse of `attach`. When the last user detaches, all connections
   * to the endpoint are closed gracefully.
   */
  async detach(origin, http2) {
    const key = endpointKey(origin, resolveHttp2Settings(http2));
    const endpoint = this.endpoints.get(key);
    if (!endpoint) {
      debug("detach for unknown endpoint %s", key);
      return;
    }
    endpoint.refCount -= 1;
    if (endpoint.refCount > 0) {
      return;
    }
    this.endpoints.delete(key);
    await Promise.all(endpoint.pending.map((p) => p.promise.catch(() => void 0)));
    debug("closing %d connection(s) to %s", endpoint.connections.length, origin);
    await Promise.all(endpoint.connections.map((connection) => {
      const { session } = connection;
      if (session.closed || session.destroyed) {
        return void 0;
      }
      return new Promise((resolve) => {
        session.close(() => resolve());
      });
    }));
  }
  /**
   * Open a new HTTP/2 stream to the endpoint, reusing a pooled connection
   * with spare capacity or opening a new one. Requires a prior `attach`.
   */
  async request(origin, headers, options) {
    const key = endpointKey(origin, resolveHttp2Settings(options?.http2));
    for (let attempt = 0; attempt < 3; attempt++) {
      const endpoint = this.endpoints.get(key);
      if (!endpoint) {
        throw new S2Error({
          message: `HTTP/2 connection pool is not attached to ${origin}`,
          status: 500,
          origin: "sdk"
        });
      }
      const usable = endpoint.connections.find((c) => !c.dead && c.activeStreams < this.maxStreamsPerConnection);
      if (usable) {
        return this.openStream(usable, headers);
      }
      let pending = endpoint.pending.find((p) => p.reservations < this.maxStreamsPerConnection);
      if (!pending) {
        pending = this.startConnect(key, endpoint, options);
      }
      pending.reservations += 1;
      const connection = await pending.promise;
      if (connection.dead) {
        continue;
      }
      return this.openStream(connection, headers, { reserved: true });
    }
    throw new S2Error({
      message: `HTTP/2 connections to ${origin} closed repeatedly before use`,
      status: 500,
      origin: "sdk"
    });
  }
  /** Number of live pooled connections to an endpoint. */
  connectionCount(origin, http2) {
    const key = endpointKey(origin, resolveHttp2Settings(http2));
    return this.endpoints.get(key)?.connections.length ?? 0;
  }
  openStream(connection, headers, opts) {
    let stream;
    try {
      stream = connection.session.request(headers);
    } catch (err2) {
      if (opts?.reserved) {
        connection.activeStreams -= 1;
      }
      throw err2;
    }
    if (!opts?.reserved) {
      connection.activeStreams += 1;
    }
    stream.once("close", () => {
      connection.activeStreams -= 1;
    });
    return stream;
  }
  startConnect(key, endpoint, options) {
    const connectPromise = this.connect(key, endpoint, options);
    const pending = {
      reservations: 0,
      promise: connectPromise
    };
    pending.promise = (async () => {
      try {
        const connection = await connectPromise;
        connection.activeStreams = pending.reservations;
        if (!connection.dead) {
          endpoint.connections.push(connection);
        }
        return connection;
      } finally {
        removeFrom(endpoint.pending, pending);
      }
    })();
    endpoint.pending.push(pending);
    return pending;
  }
  async connect(key, endpoint, options) {
    const { origin, settings } = endpoint;
    debug("connecting to %s", origin);
    const http2 = await loadHttp2();
    const session = http2.connect(origin, {
      // Headroom above the flow-control windows so Node's session memory
      // cap (default 10 MB) does not refuse streams when windows are raised.
      // This is just a heuristic to avoid memory issues in case.
      // Deno and Bun dont support this setting.
      maxSessionMemory: Math.max(
        10,
        // default maxSessionMemory
        Math.ceil((settings.connectionWindowSize + settings.initialStreamWindowSize) / 2 ** 20) + 8
      ),
      settings: {
        initialWindowSize: settings.initialStreamWindowSize
      }
    });
    try {
      session.setMaxListeners(0);
    } catch {
    }
    const connection = {
      session,
      activeStreams: 0,
      dead: false
    };
    const connectPromise = new Promise((resolve, reject) => {
      session.once("connect", () => {
        if (session.destroyed)
          return;
        try {
          session.setLocalWindowSize(settings.connectionWindowSize);
        } catch {
        }
        resolve(connection);
      });
      session.once("error", (err2) => {
        reject(err2);
      });
    });
    session.on("goaway", () => this.evict(key, connection));
    session.on("close", () => this.evict(key, connection));
    session.on("error", () => this.evict(key, connection));
    const connectionTimeout = options?.connectionTimeoutMillis ?? DEFAULT_CONNECTION_TIMEOUT_MS;
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        if (!session.closed && !session.destroyed) {
          session.destroy();
        }
        reject(new S2Error({
          message: `Connection timeout after ${connectionTimeout}ms`,
          status: 408,
          code: "CONNECTION_TIMEOUT",
          origin: "sdk"
        }));
      }, connectionTimeout);
    });
    try {
      return await Promise.race([connectPromise, timeoutPromise]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
  evict(key, connection) {
    connection.dead = true;
    const endpoint = this.endpoints.get(key);
    if (endpoint) {
      removeFrom(endpoint.connections, connection);
    }
    const { session } = connection;
    if (!session.closed && !session.destroyed) {
      session.close();
    }
  }
};
function removeFrom(list, item) {
  const index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
}
__name(removeFrom, "removeFrom");
var sharedConnectionPool = new Http2ConnectionPool();

// ../../../../AppData/Local/npm-cache/_npx/f51a09bd0abf5f10/node_modules/@trigger.dev/core/node_modules/@s2-dev/streamstore/dist/esm/lib/stream/transport/s2s/index.js
var debug2 = (0, import_debug2.default)("s2:s2s");
var COMPRESSION_THRESHOLD_BYTES = 1024;
var S2STransport = class {
  static {
    __name(this, "S2STransport");
  }
  transportConfig;
  compression;
  endpointOrigin;
  attached = false;
  closed = false;
  closingPromise;
  constructor(config) {
    this.transportConfig = config;
    this.compression = config.compression ?? "none";
    this.endpointOrigin = new URL(config.baseUrl).origin;
  }
  async makeAppendSession(stream, sessionOptions, requestOptions) {
    await assertCompressionSupported(this.compression);
    return RetryAppendSession.create((myOptions) => {
      return S2SAppendSession.create(this.transportConfig.baseUrl, this.transportConfig.accessToken, stream, (headers) => this.openH2Stream(headers), this.transportConfig.basinName, this.transportConfig.encryptionKey, this.compression, myOptions, requestOptions);
    }, sessionOptions, this.transportConfig.retry, stream);
  }
  async makeReadSession(stream, args, options) {
    await assertCompressionSupported(this.compression);
    return RetryReadSession.create((myArgs) => {
      return S2SReadSession.create(this.transportConfig.baseUrl, this.transportConfig.accessToken, stream, myArgs, options, (headers) => this.openH2Stream(headers), this.transportConfig.basinName, this.transportConfig.encryptionKey, this.compression);
    }, args, this.transportConfig.retry);
  }
  /** Open an HTTP/2 stream through the shared connection pool. */
  openH2Stream(headers) {
    if (this.closed) {
      throw new S2Error({
        message: "S2STransport is closed",
        status: 400,
        origin: "sdk"
      });
    }
    if (!this.attached) {
      sharedConnectionPool.attach(this.endpointOrigin, this.transportConfig.http2);
      this.attached = true;
    }
    return sharedConnectionPool.request(this.endpointOrigin, headers, {
      connectionTimeoutMillis: this.transportConfig.connectionTimeoutMillis,
      http2: this.transportConfig.http2
    });
  }
  async close() {
    this.closed = true;
    if (this.closingPromise) {
      return this.closingPromise;
    }
    this.closingPromise = (async () => {
      if (this.attached) {
        this.attached = false;
        await sharedConnectionPool.detach(this.endpointOrigin, this.transportConfig.http2);
      }
    })();
    try {
      await this.closingPromise;
    } finally {
      this.closingPromise = void 0;
    }
  }
};
var S2SReadSession = class _S2SReadSession extends ReadableStream {
  static {
    __name(this, "S2SReadSession");
  }
  streamName;
  args;
  authToken;
  url;
  options;
  openH2Stream;
  basinName;
  encryptionKey;
  compression;
  http2Stream;
  _lastObservedTail;
  parser = new S2SFrameParser();
  static async create(baseUrl, bearerToken, streamName, args, options, openH2Stream, basinName, encryptionKey, compression = "none") {
    const url = new URL(baseUrl);
    return new _S2SReadSession(streamName, args, bearerToken, url, options, openH2Stream, basinName, encryptionKey, compression);
  }
  constructor(streamName, args, authToken, url, options, openH2Stream, basinName, encryptionKey, compression = "none") {
    const parser = new S2SFrameParser();
    const textDecoder = new TextDecoder();
    let http2Stream;
    const TAIL_TIMEOUT_MS = 2e4;
    let timeoutTimer;
    super({
      start: /* @__PURE__ */ __name(async (controller) => {
        let controllerClosed = false;
        let responseCode;
        let pendingChunks;
        let abortHandler;
        let goawayHandler;
        let sessionConnection;
        const cleanupListeners = /* @__PURE__ */ __name(() => {
          if (abortHandler && options?.signal) {
            options.signal.removeEventListener("abort", abortHandler);
          }
          abortHandler = void 0;
          if (goawayHandler && sessionConnection) {
            sessionConnection.removeListener("goaway", goawayHandler);
          }
          goawayHandler = void 0;
          sessionConnection = void 0;
        }, "cleanupListeners");
        const safeClose = /* @__PURE__ */ __name(() => {
          if (!controllerClosed) {
            controllerClosed = true;
            cleanupListeners();
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
              timeoutTimer = void 0;
            }
            try {
              controller.close();
            } catch {
            }
          }
        }, "safeClose");
        const safeError = /* @__PURE__ */ __name((err2) => {
          if (!controllerClosed) {
            controllerClosed = true;
            cleanupListeners();
            if (timeoutTimer) {
              clearTimeout(timeoutTimer);
              timeoutTimer = void 0;
            }
            controller.enqueue({ ok: false, error: s2Error(err2) });
            controller.close();
          }
        }, "safeError");
        const resetTimeoutTimer = /* @__PURE__ */ __name(() => {
          if (timeoutTimer) {
            clearTimeout(timeoutTimer);
          }
          timeoutTimer = setTimeout(() => {
            const timeoutError = new S2Error({
              message: `No tail received for ${TAIL_TIMEOUT_MS / 1e3}s`,
              status: 408,
              // Request Timeout
              code: "TIMEOUT"
            });
            debug2("tail timeout detected");
            safeError(timeoutError);
          }, TAIL_TIMEOUT_MS);
        }, "resetTimeoutTimer");
        try {
          resetTimeoutTimer();
          const queryParams = new URLSearchParams();
          const { as, ...readParams } = args ?? {};
          if (readParams.seq_num !== void 0)
            queryParams.set("seq_num", readParams.seq_num.toString());
          if (readParams.timestamp !== void 0)
            queryParams.set("timestamp", readParams.timestamp.toString());
          if (readParams.tail_offset !== void 0)
            queryParams.set("tail_offset", readParams.tail_offset.toString());
          if (readParams.count !== void 0)
            queryParams.set("count", readParams.count.toString());
          if (readParams.bytes !== void 0)
            queryParams.set("bytes", readParams.bytes.toString());
          if (readParams.wait !== void 0)
            queryParams.set("wait", readParams.wait.toString());
          if (typeof readParams.until === "number") {
            queryParams.set("until", readParams.until.toString());
          }
          const queryString = queryParams.toString();
          const path = `${url.pathname}/streams/${encodeURIComponent(streamName)}/records${queryString ? `?${queryString}` : ""}`;
          const acceptEncoding = await acceptEncodingHeader(compression);
          const stream = await openH2Stream({
            ":method": "GET",
            ":path": path,
            ":scheme": url.protocol.slice(0, -1),
            ":authority": url.host,
            "user-agent": DEFAULT_USER_AGENT,
            authorization: `Bearer ${value(authToken)}`,
            accept: "application/protobuf",
            "content-type": "s2s/proto",
            ...acceptEncoding ? { "accept-encoding": acceptEncoding } : {},
            ...basinName ? { "s2-basin": basinName } : {},
            ...encryptionKey ? {
              [S2_ENCRYPTION_KEY_HEADER]: value(encryptionKey)
            } : {}
          });
          http2Stream = stream;
          abortHandler = /* @__PURE__ */ __name(() => {
            if (!stream.closed) {
              stream.close();
            }
          }, "abortHandler");
          options?.signal?.addEventListener("abort", abortHandler);
          stream.on("response", (headers) => {
            responseCode = headers[":status"] ?? 500;
            if (pendingChunks) {
              const buffered = pendingChunks;
              pendingChunks = void 0;
              for (const chunk of buffered) {
                processChunk(chunk);
              }
            }
          });
          sessionConnection = stream.session;
          goawayHandler = /* @__PURE__ */ __name((errorCode, lastStreamID, opaqueData) => {
            debug2("received GOAWAY from server");
          }, "goawayHandler");
          sessionConnection?.on("goaway", goawayHandler);
          stream.on("error", (err2) => {
            safeError(err2);
          });
          const processChunk = /* @__PURE__ */ __name((chunk) => {
            try {
              const status = responseCode ?? 500;
              if (status >= 400) {
                const errorText = textDecoder.decode(chunk);
                debug2("error response: status=%d body=%s", status, errorText);
                if (status === 416) {
                  try {
                    const errorJson = JSON.parse(errorText);
                    safeError(new RangeNotSatisfiableError({
                      status,
                      code: errorJson.code,
                      tail: errorJson.tail ? fromAPIStreamPosition(errorJson.tail) : void 0
                    }));
                  } catch {
                    safeError(new RangeNotSatisfiableError({ status }));
                  }
                  return;
                }
                try {
                  const errorJson = JSON.parse(errorText);
                  safeError(new S2Error({
                    message: errorJson.message ?? "Unknown error",
                    code: errorJson.code,
                    status,
                    origin: "server"
                  }));
                } catch {
                  safeError(new S2Error({
                    message: errorText || "Unknown error",
                    status,
                    origin: "server"
                  }));
                }
                return;
              }
              parser.push(chunk);
              let frame = parser.parseFrame();
              while (frame) {
                if (frame.terminal) {
                  if (frame.statusCode && frame.statusCode >= 400) {
                    const errorText = textDecoder.decode(frame.body);
                    try {
                      const errorJson = JSON.parse(errorText);
                      const status2 = frame.statusCode ?? 500;
                      if (status2 === 416) {
                        safeError(new RangeNotSatisfiableError({
                          status: status2,
                          code: errorJson.code,
                          tail: errorJson.tail ? fromAPIStreamPosition(errorJson.tail) : void 0
                        }));
                      } else {
                        safeError(makeServerError({ status: status2, statusText: void 0 }, errorJson));
                      }
                    } catch {
                      safeError(makeServerError({
                        status: frame.statusCode ?? 500,
                        statusText: void 0
                      }, errorText));
                    }
                  } else {
                    safeClose();
                  }
                  stream.close();
                } else {
                  try {
                    const batchBytes = frame.compression === "none" ? frame.body : decompressFrameBody(frame.body, frame.compression);
                    const protoBatch = ReadBatch.fromBinary(batchBytes);
                    resetTimeoutTimer();
                    let tail;
                    if (protoBatch.tail) {
                      tail = convertStreamPosition(protoBatch.tail);
                      this._lastObservedTail = tail;
                      debug2("received tail");
                    }
                    const records = protoBatch.records.map((record) => {
                      const converted = this.convertRecord(record, as ?? "string", textDecoder);
                      return converted;
                    });
                    controller.enqueue({
                      ok: true,
                      batch: { records, ...tail ? { tail } : {} }
                    });
                  } catch (err2) {
                    safeError(new S2Error({
                      message: `Failed to parse ReadBatch: ${err2}`,
                      status: 500,
                      origin: "sdk"
                    }));
                  }
                }
                frame = parser.parseFrame();
              }
            } catch (error) {
              safeError(error instanceof S2Error ? error : new S2Error({
                message: `Failed to process read data: ${error}`,
                status: 500,
                origin: "sdk"
              }));
            }
          }, "processChunk");
          stream.on("data", (chunk) => {
            if (responseCode === void 0) {
              (pendingChunks ??= []).push(chunk);
              return;
            }
            processChunk(chunk);
          });
          stream.on("end", () => {
            if (stream.rstCode != 0) {
              debug2("stream reset code=%d", stream.rstCode);
              safeError(new S2Error({
                message: `Stream ended with error: ${stream.rstCode}`,
                status: 500,
                code: "stream reset",
                origin: "sdk"
              }));
            }
          });
          stream.on("close", () => {
            if (pendingChunks || parser.hasData()) {
              safeError(new S2Error({
                message: "Stream closed with unparsed data remaining",
                status: 500,
                code: "STREAM_CLOSED_PREMATURELY",
                origin: "sdk"
              }));
            } else {
              safeClose();
            }
          });
        } catch (err2) {
          safeError(err2);
        }
      }, "start"),
      cancel: /* @__PURE__ */ __name(async () => {
        if (http2Stream && !http2Stream.closed) {
          http2Stream.close();
        }
      }, "cancel")
    });
    this.streamName = streamName;
    this.args = args;
    this.authToken = authToken;
    this.url = url;
    this.options = options;
    this.openH2Stream = openH2Stream;
    this.basinName = basinName;
    this.encryptionKey = encryptionKey;
    this.compression = compression;
    this.parser = parser;
    this.http2Stream = http2Stream;
  }
  /**
   * Convert a protobuf SequencedRecord to the requested format
   */
  convertRecord(record, format, textDecoder) {
    return convertProtoRecord(record, format, textDecoder);
  }
  async [Symbol.asyncDispose]() {
    await this.cancel("disposed");
  }
  // Polyfill for older browsers / Node.js environments
  [Symbol.asyncIterator]() {
    const proto = ReadableStream.prototype;
    const fn = proto[Symbol.asyncIterator];
    if (typeof fn === "function") {
      try {
        return fn.call(this);
      } catch {
      }
    }
    const reader = this.getReader();
    return {
      next: /* @__PURE__ */ __name(async () => {
        const r = await reader.read();
        if (r.done) {
          reader.releaseLock();
          return { done: true, value: void 0 };
        }
        return { done: false, value: r.value };
      }, "next"),
      throw: /* @__PURE__ */ __name(async (e) => {
        try {
          await reader.cancel(e);
        } catch (err2) {
          if (err2?.code !== "ERR_INVALID_STATE")
            throw err2;
        }
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "throw"),
      return: /* @__PURE__ */ __name(async () => {
        try {
          await reader.cancel("done");
        } catch (err2) {
          if (err2?.code !== "ERR_INVALID_STATE")
            throw err2;
        }
        reader.releaseLock();
        return { done: true, value: void 0 };
      }, "return"),
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  lastObservedTail() {
    return this._lastObservedTail;
  }
};
var S2SAppendSession = class _S2SAppendSession {
  static {
    __name(this, "S2SAppendSession");
  }
  baseUrl;
  authToken;
  streamName;
  openH2Stream;
  basinName;
  encryptionKey;
  compression;
  options;
  http2Stream;
  parser = new S2SFrameParser();
  closed = false;
  pendingAcks = new FifoQueue();
  initPromise;
  _effectSignalled = false;
  abortHandler;
  static async create(baseUrl, bearerToken, streamName, openH2Stream, basinName, encryptionKey, compression, sessionOptions, requestOptions) {
    return new _S2SAppendSession(baseUrl, bearerToken, streamName, openH2Stream, basinName, encryptionKey, compression, sessionOptions, requestOptions);
  }
  constructor(baseUrl, authToken, streamName, openH2Stream, basinName, encryptionKey, compression, sessionOptions, options) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
    this.streamName = streamName;
    this.openH2Stream = openH2Stream;
    this.basinName = basinName;
    this.encryptionKey = encryptionKey;
    this.compression = compression;
    this.options = options;
  }
  async initializeStream() {
    const url = new URL(this.baseUrl);
    const path = `${url.pathname}/streams/${encodeURIComponent(this.streamName)}/records`;
    const acceptEncoding = await acceptEncodingHeader(this.compression);
    const stream = await this.openH2Stream({
      ":method": "POST",
      ":path": path,
      ":scheme": url.protocol.slice(0, -1),
      ":authority": url.host,
      "user-agent": DEFAULT_USER_AGENT,
      authorization: `Bearer ${value(this.authToken)}`,
      "content-type": "s2s/proto",
      accept: "application/protobuf",
      ...acceptEncoding ? { "accept-encoding": acceptEncoding } : {},
      ...this.basinName ? { "s2-basin": this.basinName } : {},
      ...this.encryptionKey ? {
        [S2_ENCRYPTION_KEY_HEADER]: value(this.encryptionKey)
      } : {}
    });
    this.http2Stream = stream;
    this.abortHandler = () => {
      if (!stream.closed) {
        stream.close();
      }
    };
    this.options?.signal?.addEventListener("abort", this.abortHandler);
    const textDecoder = new TextDecoder();
    let responseCode;
    let pendingChunks;
    const safeError = /* @__PURE__ */ __name((error) => {
      for (const pending of this.pendingAcks) {
        pending.resolve(err(s2Error(error)));
      }
      this.pendingAcks.clear();
    }, "safeError");
    stream.on("response", (headers) => {
      responseCode = headers[":status"] ?? 500;
      if (pendingChunks) {
        const buffered = pendingChunks;
        pendingChunks = void 0;
        for (const chunk of buffered) {
          processChunk(chunk);
        }
      }
    });
    const processChunk = /* @__PURE__ */ __name((chunk) => {
      try {
        if ((responseCode ?? 200) >= 400) {
          const errorText = textDecoder.decode(chunk);
          try {
            const errorJson = JSON.parse(errorText);
            safeError(new S2Error({
              message: errorJson.message ?? "Unknown error",
              code: errorJson.code,
              status: responseCode,
              origin: "server"
            }));
          } catch {
            safeError(new S2Error({
              message: errorText || "Unknown error",
              status: responseCode,
              origin: "server"
            }));
          }
          return;
        }
        this.parser.push(chunk);
        let frame = this.parser.parseFrame();
        while (frame) {
          if (frame.terminal) {
            if (frame.statusCode && frame.statusCode >= 400) {
              const errorText = textDecoder.decode(frame.body);
              const status = frame.statusCode ?? 500;
              try {
                const errorJson = JSON.parse(errorText);
                const err2 = status === 412 ? makeAppendPreconditionError(status, errorJson) : makeServerError({ status, statusText: void 0 }, errorJson);
                queueMicrotask(() => safeError(err2));
              } catch {
                const err2 = makeServerError({ status, statusText: void 0 }, errorText);
                queueMicrotask(() => safeError(err2));
              }
            }
            stream.close();
          } else {
            try {
              const ackBytes = frame.compression === "none" ? frame.body : decompressFrameBody(frame.body, frame.compression);
              const protoAck = AppendAck.fromBinary(ackBytes);
              const ack = convertAppendAck(protoAck);
              const pending = this.pendingAcks.shift();
              if (pending) {
                pending.resolve(ok(ack));
              }
              if (this.pendingAcks.length === 0) {
                this._effectSignalled = false;
              }
            } catch (parseErr) {
              queueMicrotask(() => safeError(new S2Error({
                message: `Failed to parse AppendAck: ${parseErr}`,
                status: 500
              })));
            }
          }
          frame = this.parser.parseFrame();
        }
      } catch (error) {
        queueMicrotask(() => safeError(error));
      }
    }, "processChunk");
    stream.on("data", (chunk) => {
      if (responseCode === void 0) {
        (pendingChunks ??= []).push(chunk);
        return;
      }
      processChunk(chunk);
    });
    stream.on("error", (streamErr) => {
      queueMicrotask(() => safeError(streamErr));
    });
    stream.on("close", () => {
      this.removeAbortListener();
      if (this.pendingAcks.length > 0) {
        queueMicrotask(() => safeError(new S2Error({
          message: "Stream closed with pending acks",
          status: 502,
          code: "BAD_GATEWAY"
        })));
      }
    });
  }
  /**
   * Send a batch and wait for ack. Returns AppendResult (never throws).
   * Pipelined: multiple sends can be in-flight; acks resolve FIFO.
   */
  async sendBatch(input) {
    if (!this.http2Stream || this.http2Stream.closed) {
      return Promise.resolve(err(new S2Error({ message: "HTTP/2 stream is not open", status: 502 })));
    }
    const protoBytes = encodeProtoAppendInput(input);
    const shouldCompress = this.compression !== "none" && protoBytes.byteLength >= COMPRESSION_THRESHOLD_BYTES;
    const frameCompression = shouldCompress ? this.compression : "none";
    const bodyBytes = shouldCompress ? await compressFrameBody(protoBytes, this.compression) : protoBytes;
    const frame = frameMessage({
      terminal: false,
      compression: frameCompression,
      body: bodyBytes
    });
    return new Promise((resolve) => {
      this.pendingAcks.push({
        resolve,
        batchSize: input.meteredBytes
      });
      this._effectSignalled = true;
      this.http2Stream.write(frame, (writeErr) => {
        if (writeErr) {
          this.pendingAcks.removeFirst((p) => p.resolve === resolve);
          resolve(err(s2Error(writeErr)));
        }
      });
    });
  }
  /**
   * Returns true if data may have been written to the HTTP/2 stream
   * since the last time pendingAcks was empty (dormant).
   */
  effectSignalled() {
    return this._effectSignalled;
  }
  /** Remove the abort listener from the caller-provided signal, if attached. */
  removeAbortListener() {
    if (this.abortHandler && this.options?.signal) {
      this.options.signal.removeEventListener("abort", this.abortHandler);
    }
    this.abortHandler = void 0;
  }
  /**
   * Close the append session.
   * Waits for all pending appends to complete before resolving.
   * Never throws - returns CloseResult.
   */
  async close() {
    try {
      this.closed = true;
      if (this.initPromise) {
        await this.initPromise.catch(() => {
        });
      }
      this.removeAbortListener();
      while (this.pendingAcks.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      if (this.http2Stream && !this.http2Stream.closed) {
        this.http2Stream.end();
      }
      return okClose();
    } catch (error) {
      return errClose(s2Error(error));
    }
  }
  /**
   * Submit an append request to the session.
   * Returns AppendResult (never throws).
   * Pipelined: multiple submits can be in-flight; acks resolve FIFO.
   */
  async submit(input) {
    if (this.closed) {
      return err(new S2Error({ message: "AppendSession is closed", status: 400 }));
    }
    if (!this.initPromise) {
      this.initPromise = this.initializeStream();
    }
    try {
      await this.initPromise;
    } catch (initErr) {
      return err(s2Error(initErr));
    }
    const recordsArray = Array.from(input.records);
    if (recordsArray.length > 1e3) {
      return err(new S2Error({
        message: `Batch of ${recordsArray.length} exceeds maximum batch size of 1000 records`,
        status: 400,
        code: "INVALID_ARGUMENT"
      }));
    }
    if (input.meteredBytes > 1024 * 1024) {
      return err(new S2Error({
        message: `Batch size ${input.meteredBytes} bytes exceeds maximum of 1 MiB (1048576 bytes)`,
        status: 400,
        code: "INVALID_ARGUMENT"
      }));
    }
    return this.sendBatch(input);
  }
};
function convertStreamPosition(proto) {
  return {
    seq_num: bigintToSafeNumber(proto.seqNum, "StreamPosition.seqNum"),
    timestamp: bigintToSafeNumber(proto.timestamp, "StreamPosition.timestamp")
  };
}
__name(convertStreamPosition, "convertStreamPosition");
function toSDKStreamPosition(pos) {
  return {
    seqNum: pos.seq_num,
    timestamp: new Date(pos.timestamp)
  };
}
__name(toSDKStreamPosition, "toSDKStreamPosition");
function convertAppendAck(proto) {
  if (!proto.start || !proto.end || !proto.tail) {
    throw new Error("Invariant violation: AppendAck is missing required fields");
  }
  return {
    start: toSDKStreamPosition(convertStreamPosition(proto.start)),
    end: toSDKStreamPosition(convertStreamPosition(proto.end)),
    tail: toSDKStreamPosition(convertStreamPosition(proto.tail))
  };
}
__name(convertAppendAck, "convertAppendAck");
export {
  S2STransport
};
//# sourceMappingURL=s2s-CLBJ32NW.mjs.map
