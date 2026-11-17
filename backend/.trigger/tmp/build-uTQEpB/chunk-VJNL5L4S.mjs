import {
  __esm,
  __name,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/pathe/dist/shared/pathe.M-eThtNZ.mjs
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
var _DRIVE_LETTER_START_RE, _UNC_REGEX, _IS_ABSOLUTE_RE, _DRIVE_LETTER_RE, _ROOT_FOLDER_RE, _EXTNAME_RE, normalize, join, resolve, isAbsolute, extname, relative, dirname, basename;
var init_pathe_M_eThtNZ = __esm({
  "node_modules/pathe/dist/shared/pathe.M-eThtNZ.mjs"() {
    init_esm();
    _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
    __name(normalizeWindowsPath, "normalizeWindowsPath");
    _UNC_REGEX = /^[/\\]{2}/;
    _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
    _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
    _ROOT_FOLDER_RE = /^\/([A-Za-z]:)?$/;
    _EXTNAME_RE = /.(\.[^./]+|\.)$/;
    normalize = /* @__PURE__ */ __name(function(path) {
      if (path.length === 0) {
        return ".";
      }
      path = normalizeWindowsPath(path);
      const isUNCPath = path.match(_UNC_REGEX);
      const isPathAbsolute = isAbsolute(path);
      const trailingSeparator = path[path.length - 1] === "/";
      path = normalizeString(path, !isPathAbsolute);
      if (path.length === 0) {
        if (isPathAbsolute) {
          return "/";
        }
        return trailingSeparator ? "./" : ".";
      }
      if (trailingSeparator) {
        path += "/";
      }
      if (_DRIVE_LETTER_RE.test(path)) {
        path += "/";
      }
      if (isUNCPath) {
        if (!isPathAbsolute) {
          return `//./${path}`;
        }
        return `//${path}`;
      }
      return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
    }, "normalize");
    join = /* @__PURE__ */ __name(function(...segments) {
      let path = "";
      for (const seg of segments) {
        if (!seg) {
          continue;
        }
        if (path.length > 0) {
          const pathTrailing = path[path.length - 1] === "/";
          const segLeading = seg[0] === "/";
          const both = pathTrailing && segLeading;
          if (both) {
            path += seg.slice(1);
          } else {
            path += pathTrailing || segLeading ? seg : `/${seg}`;
          }
        } else {
          path += seg;
        }
      }
      return normalize(path);
    }, "join");
    __name(cwd, "cwd");
    resolve = /* @__PURE__ */ __name(function(...arguments_) {
      arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
        const path = index >= 0 ? arguments_[index] : cwd();
        if (!path || path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = isAbsolute(path);
      }
      resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
      if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
        return `/${resolvedPath}`;
      }
      return resolvedPath.length > 0 ? resolvedPath : ".";
    }, "resolve");
    __name(normalizeString, "normalizeString");
    isAbsolute = /* @__PURE__ */ __name(function(p) {
      return _IS_ABSOLUTE_RE.test(p);
    }, "isAbsolute");
    extname = /* @__PURE__ */ __name(function(p) {
      if (p === "..") return "";
      const match = _EXTNAME_RE.exec(normalizeWindowsPath(p));
      return match && match[1] || "";
    }, "extname");
    relative = /* @__PURE__ */ __name(function(from, to) {
      const _from = resolve(from).replace(_ROOT_FOLDER_RE, "$1").split("/");
      const _to = resolve(to).replace(_ROOT_FOLDER_RE, "$1").split("/");
      if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
        return _to.join("/");
      }
      const _fromCopy = [..._from];
      for (const segment of _fromCopy) {
        if (_to[0] !== segment) {
          break;
        }
        _from.shift();
        _to.shift();
      }
      return [..._from.map(() => ".."), ..._to].join("/");
    }, "relative");
    dirname = /* @__PURE__ */ __name(function(p) {
      const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
      if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
        segments[0] += "/";
      }
      return segments.join("/") || (isAbsolute(p) ? "/" : ".");
    }, "dirname");
    basename = /* @__PURE__ */ __name(function(p, extension) {
      const segments = normalizeWindowsPath(p).split("/");
      let lastSegment = "";
      for (let i = segments.length - 1; i >= 0; i--) {
        const val = segments[i];
        if (val) {
          lastSegment = val;
          break;
        }
      }
      return extension && lastSegment.endsWith(extension) ? lastSegment.slice(0, -extension.length) : lastSegment;
    }, "basename");
  }
});

// node_modules/pathe/dist/index.mjs
var init_dist = __esm({
  "node_modules/pathe/dist/index.mjs"() {
    init_esm();
    init_pathe_M_eThtNZ();
  }
});

// node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
var defu, defuFn, defuArrayFn;
var init_defu = __esm({
  "node_modules/defu/dist/defu.mjs"() {
    init_esm();
    __name(isPlainObject, "isPlainObject");
    __name(_defu, "_defu");
    __name(createDefu, "createDefu");
    defu = createDefu();
    defuFn = createDefu((object, key, currentValue) => {
      if (object[key] !== void 0 && typeof currentValue === "function") {
        object[key] = currentValue(object[key]);
        return true;
      }
    });
    defuArrayFn = createDefu((object, key, currentValue) => {
      if (Array.isArray(object[key]) && typeof currentValue === "function") {
        object[key] = currentValue(object[key]);
        return true;
      }
    });
  }
});

export {
  normalize,
  join,
  resolve,
  isAbsolute,
  extname,
  relative,
  dirname,
  basename,
  init_dist,
  defu,
  init_defu
};
//# sourceMappingURL=chunk-VJNL5L4S.mjs.map
