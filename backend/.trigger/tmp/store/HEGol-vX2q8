import {
  basename,
  defu,
  dirname,
  extname,
  init_defu,
  init_dist,
  isAbsolute,
  join,
  normalize,
  resolve
} from "./chunk-VJNL5L4S.mjs";
import {
  i,
  init_format,
  s
} from "./chunk-2LE3WOGE.mjs";
import {
  __commonJS,
  __esm,
  __name,
  __require,
  __toESM,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/exsolve/dist/index.mjs
import fs, { realpathSync, statSync } from "node:fs";
import { URL as URL$1, fileURLToPath, pathToFileURL } from "node:url";
import path, { isAbsolute as isAbsolute2, resolve as resolve2, sep } from "node:path";
import assert from "node:assert";
import process$1 from "node:process";
import { format, inspect } from "node:util";
function formatList(array, type = "and") {
  switch (array.length) {
    case 0:
      return "";
    case 1:
      return `${array[0]}`;
    case 2:
      return `${array[0]} ${type} ${array[1]}`;
    case 3:
      return `${array[0]}, ${array[1]}, ${type} ${array[2]}`;
    default:
      return `${array.slice(0, -1).join(", ")}, ${type} ${array.at(-1)}`;
  }
}
function getExpectedArgumentLength(message) {
  let expectedLength = 0;
  const regex = /%[dfijoOs]/g;
  while (regex.exec(message) !== null) expectedLength++;
  return expectedLength;
}
function createError(sym, value, constructor) {
  messages.set(sym, value);
  return makeNodeErrorWithCode(constructor, sym);
}
function makeNodeErrorWithCode(Base, key) {
  const message = messages.get(key);
  const expectedLength = typeof message === "string" ? getExpectedArgumentLength(message) : -1;
  switch (expectedLength) {
    case 0: {
      class NodeError extends Base {
        static {
          __name(this, "NodeError");
        }
        code = key;
        constructor(...args) {
          assert.ok(args.length === 0, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`);
          super(message);
        }
        get ["constructor"]() {
          return Base;
        }
        get [kIsNodeError]() {
          return true;
        }
        toString() {
          return `${this.name} [${key}]: ${this.message}`;
        }
      }
      return NodeError;
    }
    case -1: {
      class NodeError extends Base {
        static {
          __name(this, "NodeError");
        }
        code = key;
        constructor(...args) {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage(key, args, this),
            enumerable: false,
            writable: true,
            configurable: true
          });
        }
        get ["constructor"]() {
          return Base;
        }
        get [kIsNodeError]() {
          return true;
        }
        toString() {
          return `${this.name} [${key}]: ${this.message}`;
        }
      }
      return NodeError;
    }
    default: {
      class NodeError extends Base {
        static {
          __name(this, "NodeError");
        }
        code = key;
        constructor(...args) {
          assert.ok(args.length === expectedLength, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`);
          args.unshift(message);
          super(Reflect.apply(format, null, args));
        }
        get ["constructor"]() {
          return Base;
        }
        get [kIsNodeError]() {
          return true;
        }
        toString() {
          return `${this.name} [${key}]: ${this.message}`;
        }
      }
      return NodeError;
    }
  }
}
function getMessage(key, parameters, self) {
  const message = messages.get(key);
  assert.ok(message !== void 0, "expected `message` to be found");
  if (typeof message === "function") {
    assert.ok(message.length <= parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${message.length}).`);
    return Reflect.apply(message, self, parameters);
  }
  const expectedLength = getExpectedArgumentLength(message);
  assert.ok(expectedLength === parameters.length, `Code: ${key}; The provided arguments length (${parameters.length}) does not match the required ones (${expectedLength}).`);
  if (parameters.length === 0) return message;
  parameters.unshift(message);
  return Reflect.apply(format, null, parameters);
}
function determineSpecificType(value) {
  if (value === null) return "null";
  else if (value === void 0) return "undefined";
  const type = typeof value;
  switch (type) {
    case "bigint":
      return `type bigint (${value}n)`;
    case "number":
      if (value === 0) return 1 / value === Number.NEGATIVE_INFINITY ? "type number (-0)" : "type number (0)";
      else if (Number.isNaN(value)) return "type number (NaN)";
      else if (value === Number.POSITIVE_INFINITY) return "type number (Infinity)";
      else if (value === Number.NEGATIVE_INFINITY) return "type number (-Infinity)";
      return `type number (${value})`;
    case "boolean":
      return value ? "type boolean (true)" : "type boolean (false)";
    case "symbol":
      return `type symbol (${String(value)})`;
    case "function":
      return `function ${value.name}`;
    case "object": {
      const name = value.constructor?.name;
      if (typeof name === "string" && name !== "") return `an instance of ${name}`;
      return `${inspect(value, { depth: -1 })}`;
    }
    case "string": {
      let string = value;
      if (string.length > 28) string = `${string.slice(0, 25)}...`;
      if (!string.includes("'")) return `type string ('${string}')`;
      return `type string (${JSON.stringify(string)})`;
    }
    default: {
      let inspected = inspect(value, { colors: false });
      if (inspected.length > 28) inspected = `${inspected.slice(0, 25)}...`;
      return `type ${type} (${inspected})`;
    }
  }
}
function setPackageJSONCache(newCache) {
  const previous = cache;
  cache = newCache;
  return previous;
}
function read(jsonPath, { base, specifier }) {
  const existing = cache.get(jsonPath);
  if (existing) return existing;
  let string;
  try {
    string = fs.readFileSync(path.toNamespacedPath(jsonPath), "utf8");
  } catch (error) {
    const exception = error;
    if (exception.code !== "ENOENT" && exception.code !== "ENOTDIR" && exception.code !== "EISDIR") {
      const error2 = new ERR_INVALID_PACKAGE_CONFIG(jsonPath, (base ? `"${specifier}" from ` : "") + fileURLToPath(base || specifier), `Cannot read package config: ${exception.message}`);
      error2.cause = exception;
      throw error2;
    }
  }
  const result = {
    exists: false,
    pjsonPath: jsonPath,
    main: void 0,
    name: void 0,
    type: "none",
    exports: void 0,
    imports: void 0
  };
  if (string !== void 0) {
    let parsed;
    try {
      parsed = JSON.parse(string);
    } catch (error_) {
      const error = new ERR_INVALID_PACKAGE_CONFIG(jsonPath, (base ? `"${specifier}" from ` : "") + fileURLToPath(base || specifier), error_.message);
      error.cause = error_;
      throw error;
    }
    result.exists = true;
    if (hasOwnProperty$1.call(parsed, "name") && typeof parsed.name === "string") result.name = parsed.name;
    if (hasOwnProperty$1.call(parsed, "main") && typeof parsed.main === "string") result.main = parsed.main;
    if (hasOwnProperty$1.call(parsed, "exports")) result.exports = parsed.exports;
    if (hasOwnProperty$1.call(parsed, "imports")) result.imports = parsed.imports;
    if (hasOwnProperty$1.call(parsed, "type") && (parsed.type === "commonjs" || parsed.type === "module")) result.type = parsed.type;
  }
  cache.set(jsonPath, result);
  return result;
}
function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL("package.json", resolved);
  while (true) {
    if (packageJSONUrl.pathname.endsWith("node_modules/package.json")) break;
    const packageConfig = read(fileURLToPath(packageJSONUrl), { specifier: resolved });
    if (packageConfig.exists) return packageConfig;
    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL("../package.json", packageJSONUrl);
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  return {
    pjsonPath: fileURLToPath(packageJSONUrl),
    exists: false,
    type: "none"
  };
}
function mimeToFormat(mime) {
  if (mime && /^\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?$/i.test(mime)) return "module";
  if (mime === "application/json") return "json";
  return null;
}
function getDataProtocolModuleFormat(parsed) {
  const { 1: mime } = /^([^/]+\/[^;,]+)(?:;[^,]*)?,/.exec(parsed.pathname) || [
    null,
    null,
    null
  ];
  return mimeToFormat(mime);
}
function extname2(url) {
  const pathname = url.pathname;
  for (let i5 = pathname.length - 1; i5 > 0; i5--) switch (pathname.charCodeAt(i5)) {
    case SLASH_CODE:
      return "";
    case DOT_CODE:
      return pathname.charCodeAt(i5 - 1) === SLASH_CODE ? "" : pathname.slice(i5);
  }
  return "";
}
function getFileProtocolModuleFormat(url, _context, ignoreErrors) {
  const ext = extname2(url);
  if (ext === ".js") {
    const { type: packageType } = getPackageScopeConfig(url);
    if (packageType !== "none") return packageType;
    return "commonjs";
  }
  if (ext === "") {
    const { type: packageType } = getPackageScopeConfig(url);
    if (packageType === "module") return "module";
    if (packageType !== "none") return packageType;
    return "commonjs";
  }
  const format2 = extensionFormatMap[ext];
  if (format2) return format2;
  if (ignoreErrors) return;
  const filepath = fileURLToPath(url);
  throw new ERR_UNKNOWN_FILE_EXTENSION(ext, filepath);
}
function defaultGetFormatWithoutErrors(url, context) {
  const protocol = url.protocol;
  if (!hasOwnProperty.call(protocolHandlers, protocol)) return null;
  return protocolHandlers[protocol](url, context, true) || null;
}
function emitInvalidSegmentDeprecation(target, request, match, packageJsonUrl, internal, base, isTarget) {
  if (process$1.noDeprecation) return;
  const pjsonPath = fileURLToPath(packageJsonUrl);
  const double = doubleSlashRegEx.exec(isTarget ? target : request) !== null;
  process$1.emitWarning(`Use of deprecated ${double ? "double slash" : "leading or trailing slash matching"} resolving "${target}" for module request "${request}" ${request === match ? "" : `matched to "${match}" `}in the "${internal ? "imports" : "exports"}" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}.`, "DeprecationWarning", "DEP0166");
}
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  if (process$1.noDeprecation) return;
  if (defaultGetFormatWithoutErrors(url, { parentURL: base.href }) !== "module") return;
  const urlPath = fileURLToPath(url.href);
  const packagePath = fileURLToPath(new URL$1(".", packageJsonUrl));
  const basePath = fileURLToPath(base);
  if (!main) process$1.emitWarning(`No "main" or "exports" field defined in the package.json for ${packagePath} resolving the main entry point "${urlPath.slice(packagePath.length)}", imported from ${basePath}.
Default "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
  else if (path.resolve(packagePath, main) !== urlPath) process$1.emitWarning(`Package ${packagePath} has a "main" field set to "${main}", excluding the full filename and extension to the resolved file at "${urlPath.slice(packagePath.length)}", imported from ${basePath}.
 Automatic extension resolution of the "main" field is deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
}
function tryStatSync(path2) {
  try {
    return statSync(path2, { throwIfNoEntry: false });
  } catch {
  }
}
function fileExists(url) {
  const stats = statSync(url, { throwIfNoEntry: false });
  const isFile = stats ? stats.isFile() : void 0;
  return isFile === null || isFile === void 0 ? false : isFile;
}
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== void 0) {
    guess = new URL$1(packageConfig.main, packageJsonUrl);
    if (fileExists(guess)) return guess;
    const tries2 = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i6 = -1;
    while (++i6 < tries2.length) {
      guess = new URL$1(tries2[i6], packageJsonUrl);
      if (fileExists(guess)) break;
      guess = void 0;
    }
    if (guess) {
      emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
      return guess;
    }
  }
  const tries = [
    "./index.js",
    "./index.json",
    "./index.node"
  ];
  let i5 = -1;
  while (++i5 < tries.length) {
    guess = new URL$1(tries[i5], packageJsonUrl);
    if (fileExists(guess)) break;
    guess = void 0;
  }
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess;
  }
  throw new ERR_MODULE_NOT_FOUND(fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
function finalizeResolution(resolved, base, preserveSymlinks) {
  if (encodedSeparatorRegEx.exec(resolved.pathname) !== null) throw new ERR_INVALID_MODULE_SPECIFIER(resolved.pathname, String.raw`must not include encoded "/" or "\" characters`, fileURLToPath(base));
  let filePath;
  try {
    filePath = fileURLToPath(resolved);
  } catch (error) {
    Object.defineProperty(error, "input", { value: String(resolved) });
    Object.defineProperty(error, "module", { value: String(base) });
    throw error;
  }
  const stats = tryStatSync(filePath);
  if (stats && stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(filePath, fileURLToPath(base));
    error.url = String(resolved);
    throw error;
  }
  if (!stats || !stats.isFile() || resolved.pathname.endsWith("/")) {
    const error = new ERR_MODULE_NOT_FOUND(filePath || resolved.pathname, base && fileURLToPath(base), true);
    error.url = String(resolved);
    throw error;
  }
  if (!preserveSymlinks) {
    const real = realpathSync(filePath);
    const { search, hash } = resolved;
    resolved = pathToFileURL(real);
    resolved.search = search;
    resolved.hash = hash;
  }
  return resolved;
}
function importNotDefined(specifier, packageJsonUrl, base) {
  return new ERR_PACKAGE_IMPORT_NOT_DEFINED(specifier, packageJsonUrl && fileURLToPath(new URL$1(".", packageJsonUrl)), fileURLToPath(base));
}
function exportsNotFound(subpath, packageJsonUrl, base) {
  return new ERR_PACKAGE_PATH_NOT_EXPORTED(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, base && fileURLToPath(base));
}
function throwInvalidSubpath(request, match, packageJsonUrl, internal, base) {
  const reason = `request is not a valid match in pattern "${match}" for the "${internal ? "imports" : "exports"}" resolution of ${fileURLToPath(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(request, reason, base && fileURLToPath(base));
}
function invalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
  return new ERR_INVALID_PACKAGE_TARGET(fileURLToPath(new URL$1(".", packageJsonUrl)), subpath, target, internal, base && fileURLToPath(base));
}
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, isPathMap, conditions) {
  if (subpath !== "" && !pattern && target.at(-1) !== "/") throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (!target.startsWith("./")) {
    if (internal && !target.startsWith("../") && !target.startsWith("/")) {
      let isURL = false;
      try {
        new URL$1(target);
        isURL = true;
      } catch {
      }
      if (!isURL) return packageResolve(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target + subpath, packageJsonUrl, conditions);
    }
    throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (invalidSegmentRegEx.exec(target.slice(2)) !== null) {
    if (deprecatedInvalidSegmentRegEx.exec(target.slice(2)) === null) {
      if (!isPathMap) {
        const request = pattern ? match.replace("*", () => subpath) : match + subpath;
        emitInvalidSegmentDeprecation(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, true);
      }
    } else throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  const resolved = new URL$1(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new URL$1(".", packageJsonUrl).pathname;
  if (!resolvedPath.startsWith(packagePath)) throw invalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (subpath === "") return resolved;
  if (invalidSegmentRegEx.exec(subpath) !== null) {
    const request = pattern ? match.replace("*", () => subpath) : match + subpath;
    if (deprecatedInvalidSegmentRegEx.exec(subpath) === null) {
      if (!isPathMap) emitInvalidSegmentDeprecation(pattern ? RegExpPrototypeSymbolReplace.call(patternRegEx, target, () => subpath) : target, request, match, packageJsonUrl, internal, base, false);
    } else throwInvalidSubpath(request, match, packageJsonUrl, internal, base);
  }
  if (pattern) return new URL$1(RegExpPrototypeSymbolReplace.call(patternRegEx, resolved.href, () => subpath));
  return new URL$1(subpath, resolved);
}
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key) return false;
  return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions) {
  if (typeof target === "string") return resolvePackageTargetString(target, subpath, packageSubpath, packageJsonUrl, base, pattern, internal, isPathMap, conditions);
  if (Array.isArray(target)) {
    const targetList = target;
    if (targetList.length === 0) return null;
    let lastException;
    let i5 = -1;
    while (++i5 < targetList.length) {
      const targetItem = targetList[i5];
      let resolveResult;
      try {
        resolveResult = resolvePackageTarget(packageJsonUrl, targetItem, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
      } catch (error) {
        const exception = error;
        lastException = exception;
        if (exception.code === "ERR_INVALID_PACKAGE_TARGET") continue;
        throw error;
      }
      if (resolveResult === void 0) continue;
      if (resolveResult === null) {
        lastException = null;
        continue;
      }
      return resolveResult;
    }
    if (lastException === void 0 || lastException === null) return lastException;
    throw lastException;
  }
  if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i5 = -1;
    while (++i5 < keys.length) {
      const key = keys[i5];
      if (isArrayIndex(key)) throw new ERR_INVALID_PACKAGE_CONFIG(fileURLToPath(packageJsonUrl), fileURLToPath(base), '"exports" cannot contain numeric property keys.');
    }
    i5 = -1;
    while (++i5 < keys.length) {
      const key = keys[i5];
      if (key === "default" || conditions && conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolveResult = resolvePackageTarget(packageJsonUrl, conditionalTarget, subpath, packageSubpath, base, pattern, internal, isPathMap, conditions);
        if (resolveResult === void 0) continue;
        return resolveResult;
      }
    }
    return;
  }
  if (target === null) return null;
  throw invalidPackageTarget(packageSubpath, target, packageJsonUrl, internal, base);
}
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === "string" || Array.isArray(exports)) return true;
  if (typeof exports !== "object" || exports === null) return false;
  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i5 = 0;
  let keyIndex = -1;
  while (++keyIndex < keys.length) {
    const key = keys[keyIndex];
    const currentIsConditionalSugar = key === "" || key[0] !== ".";
    if (i5++ === 0) isConditionalSugar = currentIsConditionalSugar;
    else if (isConditionalSugar !== currentIsConditionalSugar) throw new ERR_INVALID_PACKAGE_CONFIG(fileURLToPath(packageJsonUrl), fileURLToPath(base), `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`);
  }
  return isConditionalSugar;
}
function emitTrailingSlashPatternDeprecation(match, pjsonUrl, base) {
  if (process$1.noDeprecation) return;
  const pjsonPath = fileURLToPath(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + "|" + match)) return;
  emittedPackageWarnings.add(pjsonPath + "|" + match);
  process$1.emitWarning(`Use of deprecated trailing slash pattern mapping "${match}" in the "exports" field module resolution of the package at ${pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`, "DeprecationWarning", "DEP0155");
}
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base)) exports = { ".": exports };
  if (own.call(exports, packageSubpath) && !packageSubpath.includes("*") && !packageSubpath.endsWith("/")) {
    const target = exports[packageSubpath];
    const resolveResult = resolvePackageTarget(packageJsonUrl, target, "", packageSubpath, base, false, false, false, conditions);
    if (resolveResult === null || resolveResult === void 0) throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    return resolveResult;
  }
  let bestMatch = "";
  let bestMatchSubpath = "";
  const keys = Object.getOwnPropertyNames(exports);
  let i5 = -1;
  while (++i5 < keys.length) {
    const key = keys[i5];
    const patternIndex = key.indexOf("*");
    if (patternIndex !== -1 && packageSubpath.startsWith(key.slice(0, patternIndex))) {
      if (packageSubpath.endsWith("/")) emitTrailingSlashPatternDeprecation(packageSubpath, packageJsonUrl, base);
      const patternTrailer = key.slice(patternIndex + 1);
      if (packageSubpath.length >= key.length && packageSubpath.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
        bestMatch = key;
        bestMatchSubpath = packageSubpath.slice(patternIndex, packageSubpath.length - patternTrailer.length);
      }
    }
  }
  if (bestMatch) {
    const target = exports[bestMatch];
    const resolveResult = resolvePackageTarget(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, false, packageSubpath.endsWith("/"), conditions);
    if (resolveResult === null || resolveResult === void 0) throw exportsNotFound(packageSubpath, packageJsonUrl, base);
    return resolveResult;
  }
  throw exportsNotFound(packageSubpath, packageJsonUrl, base);
}
function patternKeyCompare(a3, b) {
  const aPatternIndex = a3.indexOf("*");
  const bPatternIndex = b.indexOf("*");
  const baseLengthA = aPatternIndex === -1 ? a3.length : aPatternIndex + 1;
  const baseLengthB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
  if (baseLengthA > baseLengthB) return -1;
  if (baseLengthB > baseLengthA) return 1;
  if (aPatternIndex === -1) return 1;
  if (bPatternIndex === -1) return -1;
  if (a3.length > b.length) return -1;
  if (b.length > a3.length) return 1;
  return 0;
}
function packageImportsResolve(name, base, conditions) {
  if (name === "#" || name.endsWith("/")) throw new ERR_INVALID_MODULE_SPECIFIER(name, "is not a valid internal imports specifier name", fileURLToPath(base));
  let packageJsonUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJsonUrl = pathToFileURL(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own.call(imports, name) && !name.includes("*")) {
        const resolveResult = resolvePackageTarget(packageJsonUrl, imports[name], "", name, base, false, true, false, conditions);
        if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
      } else {
        let bestMatch = "";
        let bestMatchSubpath = "";
        const keys = Object.getOwnPropertyNames(imports);
        let i5 = -1;
        while (++i5 < keys.length) {
          const key = keys[i5];
          const patternIndex = key.indexOf("*");
          if (patternIndex !== -1 && name.startsWith(key.slice(0, patternIndex))) {
            const patternTrailer = key.slice(patternIndex + 1);
            if (name.length >= key.length && name.endsWith(patternTrailer) && patternKeyCompare(bestMatch, key) === 1 && key.lastIndexOf("*") === patternIndex) {
              bestMatch = key;
              bestMatchSubpath = name.slice(patternIndex, name.length - patternTrailer.length);
            }
          }
        }
        if (bestMatch) {
          const target = imports[bestMatch];
          const resolveResult = resolvePackageTarget(packageJsonUrl, target, bestMatchSubpath, bestMatch, base, true, true, false, conditions);
          if (resolveResult !== null && resolveResult !== void 0) return resolveResult;
        }
      }
    }
  }
  throw importNotDefined(name, packageJsonUrl, base);
}
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf("/");
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === "@") {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) validPackageName = false;
    else separatorIndex = specifier.indexOf("/", separatorIndex + 1);
  }
  const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
  if (invalidPackageNameRegEx.exec(packageName) !== null) validPackageName = false;
  if (!validPackageName) throw new ERR_INVALID_MODULE_SPECIFIER(specifier, "is not a valid package name", fileURLToPath(base));
  return {
    packageName,
    packageSubpath: "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex)),
    isScoped
  };
}
function packageResolve(specifier, base, conditions) {
  if (nodeBuiltins.includes(specifier)) return new URL$1("node:" + specifier);
  const { packageName, packageSubpath, isScoped } = parsePackageName(specifier, base);
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists && packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) return packageExportsResolve(pathToFileURL(packageConfig.pjsonPath), packageSubpath, packageConfig, base, conditions);
  let packageJsonUrl = new URL$1("./node_modules/" + packageName + "/package.json", base);
  let packageJsonPath = fileURLToPath(packageJsonUrl);
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat || !stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new URL$1((isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json", packageJsonUrl);
      packageJsonPath = fileURLToPath(packageJsonUrl);
      continue;
    }
    const packageConfig2 = read(packageJsonPath, {
      base,
      specifier
    });
    if (packageConfig2.exports !== void 0 && packageConfig2.exports !== null) return packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig2, base, conditions);
    if (packageSubpath === ".") return legacyMainResolve(packageJsonUrl, packageConfig2, base);
    return new URL$1(packageSubpath, packageJsonUrl);
  } while (packageJsonPath.length !== lastPath.length);
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), false);
}
function isRelativeSpecifier(specifier) {
  if (specifier[0] === ".") {
    if (specifier.length === 1 || specifier[1] === "/") return true;
    if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) return true;
  }
  return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === "") return false;
  if (specifier[0] === "/") return true;
  return isRelativeSpecifier(specifier);
}
function moduleResolve(specifier, base, conditions, preserveSymlinks) {
  const protocol = base.protocol;
  const isData = protocol === "data:";
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) try {
    resolved = new URL$1(specifier, base);
  } catch (error_) {
    const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
    error.cause = error_;
    throw error;
  }
  else if (protocol === "file:" && specifier[0] === "#") resolved = packageImportsResolve(specifier, base, conditions);
  else try {
    resolved = new URL$1(specifier);
  } catch (error_) {
    if (isData && !nodeBuiltins.includes(specifier)) {
      const error = new ERR_UNSUPPORTED_RESOLVE_REQUEST(specifier, base);
      error.cause = error_;
      throw error;
    }
    resolved = packageResolve(specifier, base, conditions);
  }
  assert.ok(resolved !== void 0, "expected to be defined");
  if (resolved.protocol !== "file:") return resolved;
  return finalizeResolution(resolved, base, preserveSymlinks);
}
function resolveModuleURL(input, options) {
  const parsedInput = _parseInput(input);
  if ("external" in parsedInput) return parsedInput.external;
  const specifier = parsedInput.specifier;
  let url = parsedInput.url;
  const absolutePath = parsedInput.absolutePath;
  let cacheKey;
  let cacheObj;
  if (options?.cache !== false) {
    cacheKey = _cacheKey(url ? url.href : absolutePath || specifier, options, !!absolutePath);
    cacheObj = options?.cache && typeof options?.cache === "object" ? options.cache : globalCache;
  }
  if (cacheObj) {
    const cached = cacheObj.get(cacheKey);
    if (typeof cached === "string") return cached;
    if (cached instanceof Error) {
      if (options?.try) return;
      throw _copyError(cached);
    }
  }
  if (absolutePath) {
    url ||= pathToFileURL(absolutePath);
    try {
      if (statSync(absolutePath).isFile() && !url.pathname.endsWith("/")) {
        const realPath = options?.preserveSymlinks ? absolutePath : realpathSync(absolutePath);
        if (realPath !== absolutePath) {
          const { search, hash } = url;
          url = pathToFileURL(realPath);
          url.search = search;
          url.hash = hash;
        }
        if (cacheObj) cacheObj.set(cacheKey, url.href);
        return url.href;
      }
    } catch (error) {
      if (error?.code !== "ENOENT" && error?.code !== "ENOTDIR") {
        if (cacheObj) _cacheError(cacheObj, cacheKey, error);
        if (options?.try) return;
        throw error;
      }
    }
  }
  const conditionsSet = options?.conditions ? new Set(options.conditions) : DEFAULT_CONDITIONS_SET;
  let target = specifier;
  if (absolutePath) {
    const targetURL = new URL(url);
    targetURL.search = "";
    targetURL.hash = "";
    target = targetURL.href;
  }
  const bases = absolutePath ? [url] : _normalizeBases(options?.from);
  const suffixes = options?.suffixes || [""];
  const extensions = options?.extensions ? ["", ...options.extensions] : [""];
  let resolved;
  const previousPackageJSONCache = setPackageJSONCache(_packageJSONCache(cacheObj, cacheKey));
  for (const base of bases) {
    for (const suffix of suffixes) {
      let name = _join(target, suffix);
      if (name === ".") name += "/.";
      for (const extension of extensions) {
        resolved = _tryModuleResolve(name + extension, base, conditionsSet, options?.preserveSymlinks);
        if (resolved) break;
      }
      if (resolved) break;
    }
    if (resolved) break;
  }
  setPackageJSONCache(previousPackageJSONCache);
  if (!resolved) {
    const from = absolutePath ? _normalizeBases(options?.from) : bases;
    const error = /* @__PURE__ */ new Error(`Cannot resolve module "${input}" (from: ${from.map((u) => _fmtPath(u)).join(", ")})`);
    error.code = "ERR_MODULE_NOT_FOUND";
    if (cacheObj) _cacheError(cacheObj, cacheKey, error);
    if (options?.try) return;
    throw error;
  }
  if (absolutePath) {
    resolved.search = url.search;
    resolved.hash = url.hash;
  }
  if (cacheObj) cacheObj.set(cacheKey, resolved.href);
  return resolved.href;
}
function resolveModulePath(id, options) {
  const resolved = resolveModuleURL(id, options);
  if (!resolved) return;
  if (!resolved.startsWith("file://") && options?.try) return;
  const absolutePath = fileURLToPath(resolved);
  return isWindows ? _normalizeWinPath(absolutePath) : absolutePath;
}
function _tryModuleResolve(specifier, base, conditions, preserveSymlinks) {
  try {
    return moduleResolve(specifier, base, conditions, preserveSymlinks);
  } catch {
  }
}
function _normalizeBases(inputs) {
  const urls = (Array.isArray(inputs) ? inputs : [inputs]).flatMap((input) => _normalizeBase(input));
  if (urls.length === 0) return [pathToFileURL("./")];
  return urls;
}
function _normalizeBase(input) {
  if (!input) return [];
  if (_isURL(input)) return [input];
  if (typeof input !== "string") return [];
  if (/^(?:node|data|http|https|file):/.test(input)) return new URL(input);
  try {
    if (input.endsWith("/") || statSync(input).isDirectory()) return pathToFileURL(input + "/");
    return pathToFileURL(input);
  } catch {
    return [pathToFileURL(input + "/"), pathToFileURL(input)];
  }
}
function _fmtPath(input) {
  try {
    return fileURLToPath(input);
  } catch {
    return input;
  }
}
function _cacheError(cache2, key, error) {
  const copy = _copyError(error);
  copy.stack = error.stack;
  cache2.set(key, copy);
}
function _copyError(error) {
  const copy = /* @__PURE__ */ new Error();
  Object.setPrototypeOf(copy, Object.getPrototypeOf(error));
  for (const key of Reflect.ownKeys(error)) if (key !== "stack") Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(error, key));
  return copy;
}
function _packageJSONCache(cacheObj, key) {
  if (!cacheObj) return /* @__PURE__ */ new Map();
  let packageJSONCache = packageJSONCaches.get(cacheObj);
  if (!packageJSONCache || !cacheObj.has(packageJSONCache.key)) {
    packageJSONCache = {
      key,
      packages: /* @__PURE__ */ new Map()
    };
    packageJSONCaches.set(cacheObj, packageJSONCache);
  }
  return packageJSONCache.packages;
}
function _cacheKey(id, options, absolute) {
  let from;
  if (Array.isArray(options?.from)) from = options.from;
  else if (options?.from) from = [options.from];
  const cwd = !absolute && _usesCwd(from) ? [process.cwd()] : void 0;
  return _cacheKeyValues([id]) + _cacheKeyValues(cwd) + _conditionsKey(options?.conditions) + _cacheKeyValues(options?.extensions) + _cacheKeyValues(from) + _cacheKeyValues(options?.suffixes) + (options?.preserveSymlinks ? "1" : "0");
}
function _usesCwd(from) {
  let hasBase = false;
  for (const base of from || []) if (_isURL(base)) hasBase = true;
  else if (typeof base === "string" && base) {
    if (!(isWindows ? /^(?:[a-z]:[/\\]|[/\\]{2})/i.test(base) : isAbsolute2(base)) && !/^(?:node|data|http|https|file):/.test(base)) return true;
    hasBase = true;
  }
  return !hasBase;
}
function _conditionsKey(conditions) {
  if (!conditions) return DEFAULT_CONDITIONS_KEY;
  return _cacheKeyValues([...new Set(conditions)].sort());
}
function _cacheKeyValues(values) {
  if (!values) return "-";
  let key = `${values.length}:`;
  for (const value of values) {
    const stringValue = String(value);
    key += `${stringValue.length}:${stringValue}`;
  }
  return key;
}
function _join(a3, b) {
  if (!a3 || !b || b === "/") return a3;
  return (a3.endsWith("/") ? a3 : a3 + "/") + (b.startsWith("/") ? b.slice(1) : b);
}
function _normalizeWinPath(path2) {
  return path2.replace(/\\/g, "/").replace(/^[a-z]:\//, (r3) => r3.toUpperCase());
}
function _isURL(input) {
  return input instanceof URL || input?.constructor?.name === "URL";
}
function _normalizeAbsolutePath(input) {
  if (isWindows && input.startsWith("\\\\?\\")) return fileURLToPath(pathToFileURL(input));
  const path2 = resolve2(input);
  const last = input.at(-1);
  if ((last === "/" || isWindows && last === "\\") && !path2.endsWith(sep)) return path2 + sep;
  return path2;
}
function _parseInput(input) {
  if (typeof input === "string") {
    if (input.startsWith("file:")) {
      const url = new URL(input);
      return {
        url,
        absolutePath: fileURLToPath(url)
      };
    }
    if (isAbsolute2(input)) return { absolutePath: _normalizeAbsolutePath(input) };
    if (/^(?:node|data|http|https):/.test(input)) return { external: input };
    if (nodeBuiltins.includes(input) && !input.includes(":")) return { external: `node:${input}` };
    return { specifier: input };
  }
  if (_isURL(input)) {
    if (input.protocol === "file:") return {
      url: input,
      absolutePath: fileURLToPath(input)
    };
    return { external: input.href };
  }
  throw new TypeError("id must be a `string` or `URL`");
}
var nodeBuiltins, classRegExp, kTypes, messages, kIsNodeError, ERR_INVALID_MODULE_SPECIFIER, ERR_INVALID_PACKAGE_CONFIG, ERR_INVALID_PACKAGE_TARGET, ERR_MODULE_NOT_FOUND, ERR_PACKAGE_IMPORT_NOT_DEFINED, ERR_PACKAGE_PATH_NOT_EXPORTED, ERR_UNSUPPORTED_DIR_IMPORT, ERR_UNSUPPORTED_RESOLVE_REQUEST, ERR_UNKNOWN_FILE_EXTENSION, hasOwnProperty$1, cache, hasOwnProperty, extensionFormatMap, protocolHandlers, DOT_CODE, SLASH_CODE, RegExpPrototypeSymbolReplace, own, invalidSegmentRegEx, deprecatedInvalidSegmentRegEx, invalidPackageNameRegEx, patternRegEx, encodedSeparatorRegEx, emittedPackageWarnings, doubleSlashRegEx, DEFAULT_CONDITIONS_SET, DEFAULT_CONDITIONS_KEY, isWindows, globalCache, packageJSONCaches;
var init_dist2 = __esm({
  "node_modules/exsolve/dist/index.mjs"() {
    init_esm();
    nodeBuiltins = [
      "_http_agent",
      "_http_client",
      "_http_common",
      "_http_incoming",
      "_http_outgoing",
      "_http_server",
      "_stream_duplex",
      "_stream_passthrough",
      "_stream_readable",
      "_stream_transform",
      "_stream_wrap",
      "_stream_writable",
      "_tls_common",
      "_tls_wrap",
      "assert",
      "assert/strict",
      "async_hooks",
      "buffer",
      "child_process",
      "cluster",
      "console",
      "constants",
      "crypto",
      "dgram",
      "diagnostics_channel",
      "dns",
      "dns/promises",
      "domain",
      "events",
      "fs",
      "fs/promises",
      "http",
      "http2",
      "https",
      "inspector",
      "inspector/promises",
      "module",
      "net",
      "os",
      "path",
      "path/posix",
      "path/win32",
      "perf_hooks",
      "process",
      "punycode",
      "querystring",
      "readline",
      "readline/promises",
      "repl",
      "stream",
      "stream/consumers",
      "stream/promises",
      "stream/web",
      "string_decoder",
      "sys",
      "timers",
      "timers/promises",
      "tls",
      "trace_events",
      "tty",
      "url",
      "util",
      "util/types",
      "v8",
      "vm",
      "wasi",
      "worker_threads",
      "zlib"
    ];
    classRegExp = /^([A-Z][a-z\d]*)+$/;
    kTypes = /* @__PURE__ */ new Set([
      "string",
      "function",
      "number",
      "object",
      "Function",
      "Object",
      "boolean",
      "bigint",
      "symbol"
    ]);
    messages = /* @__PURE__ */ new Map();
    __name(formatList, "formatList");
    __name(getExpectedArgumentLength, "getExpectedArgumentLength");
    __name(createError, "createError");
    kIsNodeError = Symbol("kIsNodeError");
    __name(makeNodeErrorWithCode, "makeNodeErrorWithCode");
    __name(getMessage, "getMessage");
    __name(determineSpecificType, "determineSpecificType");
    createError("ERR_INVALID_ARG_TYPE", (name, expected, actual) => {
      assert.ok(typeof name === "string", "'name' must be a string");
      if (!Array.isArray(expected)) expected = [expected];
      let message = "The ";
      if (name.endsWith(" argument")) message += `${name} `;
      else {
        const type = name.includes(".") ? "property" : "argument";
        message += `"${name}" ${type} `;
      }
      message += "must be ";
      const types = [];
      const instances = [];
      const other = [];
      for (const value of expected) {
        assert.ok(typeof value === "string", "All expected entries have to be of type string");
        if (kTypes.has(value)) types.push(value.toLowerCase());
        else if (classRegExp.exec(value) === null) {
          assert.ok(value !== "object", 'The value "object" should be written as "Object"');
          other.push(value);
        } else instances.push(value);
      }
      if (instances.length > 0) {
        const pos = types.indexOf("object");
        if (pos !== -1) {
          types.splice(pos, 1);
          instances.push("Object");
        }
      }
      if (types.length > 0) {
        message += `${types.length > 1 ? "one of type" : "of type"} ${formatList(types, "or")}`;
        if (instances.length > 0 || other.length > 0) message += " or ";
      }
      if (instances.length > 0) {
        message += `an instance of ${formatList(instances, "or")}`;
        if (other.length > 0) message += " or ";
      }
      if (other.length > 0) {
        if (other.length > 1) message += `one of ${formatList(other, "or")}`;
        else {
          if (other[0]?.toLowerCase() !== other[0]) message += "an ";
          message += `${other[0]}`;
        }
      }
      message += `. Received ${determineSpecificType(actual)}`;
      return message;
    }, TypeError);
    ERR_INVALID_MODULE_SPECIFIER = createError("ERR_INVALID_MODULE_SPECIFIER", (request, reason, base) => {
      return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
    }, TypeError);
    ERR_INVALID_PACKAGE_CONFIG = createError("ERR_INVALID_PACKAGE_CONFIG", (path2, base, message) => {
      return `Invalid package config ${path2}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
    }, Error);
    ERR_INVALID_PACKAGE_TARGET = createError("ERR_INVALID_PACKAGE_TARGET", (packagePath, key, target, isImport = false, base) => {
      const relatedError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
      if (key === ".") {
        assert.ok(isImport === false);
        return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
      }
      return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(target)} defined for '${key}' in the package config ${packagePath}package.json${base ? ` imported from ${base}` : ""}${relatedError ? '; targets must start with "./"' : ""}`;
    }, Error);
    ERR_MODULE_NOT_FOUND = createError("ERR_MODULE_NOT_FOUND", function(path2, base, exactUrl = false) {
      if (exactUrl && typeof exactUrl === "string") this.url = `${exactUrl}`;
      return `Cannot find ${exactUrl ? "module" : "package"} '${path2}' imported from ${base}`;
    }, Error);
    ERR_PACKAGE_IMPORT_NOT_DEFINED = createError("ERR_PACKAGE_IMPORT_NOT_DEFINED", (specifier, packagePath, base) => {
      return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath || ""}package.json` : ""} imported from ${base}`;
    }, TypeError);
    ERR_PACKAGE_PATH_NOT_EXPORTED = createError("ERR_PACKAGE_PATH_NOT_EXPORTED", (packagePath, subpath, base) => {
      if (subpath === ".") return `No "exports" main defined in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
      return `Package subpath '${subpath}' is not defined by "exports" in ${packagePath}package.json${base ? ` imported from ${base}` : ""}`;
    }, Error);
    ERR_UNSUPPORTED_DIR_IMPORT = createError("ERR_UNSUPPORTED_DIR_IMPORT", function(path2, base, exactUrl = void 0) {
      this.url = exactUrl;
      return `Directory import '${path2}' is not supported resolving ES modules imported from ${base}`;
    }, Error);
    ERR_UNSUPPORTED_RESOLVE_REQUEST = createError("ERR_UNSUPPORTED_RESOLVE_REQUEST", 'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.', TypeError);
    ERR_UNKNOWN_FILE_EXTENSION = createError("ERR_UNKNOWN_FILE_EXTENSION", (extension, path2) => {
      return `Unknown file extension "${extension}" for ${path2}`;
    }, TypeError);
    createError("ERR_INVALID_ARG_VALUE", (name, value, reason = "is invalid") => {
      let inspected = inspect(value);
      if (inspected.length > 128) inspected = `${inspected.slice(0, 128)}...`;
      return `The ${name.includes(".") ? "property" : "argument"} '${name}' ${reason}. Received ${inspected}`;
    }, TypeError);
    hasOwnProperty$1 = {}.hasOwnProperty;
    cache = /* @__PURE__ */ new Map();
    __name(setPackageJSONCache, "setPackageJSONCache");
    __name(read, "read");
    __name(getPackageScopeConfig, "getPackageScopeConfig");
    hasOwnProperty = {}.hasOwnProperty;
    extensionFormatMap = {
      __proto__: null,
      ".json": "json",
      ".cjs": "commonjs",
      ".cts": "commonjs",
      ".js": "module",
      ".ts": "module",
      ".mts": "module",
      ".mjs": "module"
    };
    protocolHandlers = {
      __proto__: null,
      "data:": getDataProtocolModuleFormat,
      "file:": getFileProtocolModuleFormat,
      "node:": /* @__PURE__ */ __name(() => "builtin", "node:")
    };
    __name(mimeToFormat, "mimeToFormat");
    __name(getDataProtocolModuleFormat, "getDataProtocolModuleFormat");
    DOT_CODE = 46;
    SLASH_CODE = 47;
    __name(extname2, "extname");
    __name(getFileProtocolModuleFormat, "getFileProtocolModuleFormat");
    __name(defaultGetFormatWithoutErrors, "defaultGetFormatWithoutErrors");
    RegExpPrototypeSymbolReplace = RegExp.prototype[Symbol.replace];
    own = {}.hasOwnProperty;
    invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
    deprecatedInvalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
    invalidPackageNameRegEx = /^\.|%|\\/;
    patternRegEx = /\*/g;
    encodedSeparatorRegEx = /%2f|%5c/i;
    emittedPackageWarnings = /* @__PURE__ */ new Set();
    doubleSlashRegEx = /[/\\]{2}/;
    __name(emitInvalidSegmentDeprecation, "emitInvalidSegmentDeprecation");
    __name(emitLegacyIndexDeprecation, "emitLegacyIndexDeprecation");
    __name(tryStatSync, "tryStatSync");
    __name(fileExists, "fileExists");
    __name(legacyMainResolve, "legacyMainResolve");
    __name(finalizeResolution, "finalizeResolution");
    __name(importNotDefined, "importNotDefined");
    __name(exportsNotFound, "exportsNotFound");
    __name(throwInvalidSubpath, "throwInvalidSubpath");
    __name(invalidPackageTarget, "invalidPackageTarget");
    __name(resolvePackageTargetString, "resolvePackageTargetString");
    __name(isArrayIndex, "isArrayIndex");
    __name(resolvePackageTarget, "resolvePackageTarget");
    __name(isConditionalExportsMainSugar, "isConditionalExportsMainSugar");
    __name(emitTrailingSlashPatternDeprecation, "emitTrailingSlashPatternDeprecation");
    __name(packageExportsResolve, "packageExportsResolve");
    __name(patternKeyCompare, "patternKeyCompare");
    __name(packageImportsResolve, "packageImportsResolve");
    __name(parsePackageName, "parsePackageName");
    __name(packageResolve, "packageResolve");
    __name(isRelativeSpecifier, "isRelativeSpecifier");
    __name(shouldBeTreatedAsRelativeOrAbsolutePath, "shouldBeTreatedAsRelativeOrAbsolutePath");
    __name(moduleResolve, "moduleResolve");
    DEFAULT_CONDITIONS_SET = /* @__PURE__ */ new Set(["node", "import"]);
    DEFAULT_CONDITIONS_KEY = "2:6:import4:node";
    isWindows = /* @__PURE__ */ (() => process.platform === "win32")();
    globalCache = /* @__PURE__ */ (() => globalThis["__EXSOLVE_CACHE__"] ||= /* @__PURE__ */ new Map())();
    packageJSONCaches = /* @__PURE__ */ new WeakMap();
    __name(resolveModuleURL, "resolveModuleURL");
    __name(resolveModulePath, "resolveModulePath");
    __name(_tryModuleResolve, "_tryModuleResolve");
    __name(_normalizeBases, "_normalizeBases");
    __name(_normalizeBase, "_normalizeBase");
    __name(_fmtPath, "_fmtPath");
    __name(_cacheError, "_cacheError");
    __name(_copyError, "_copyError");
    __name(_packageJSONCache, "_packageJSONCache");
    __name(_cacheKey, "_cacheKey");
    __name(_usesCwd, "_usesCwd");
    __name(_conditionsKey, "_conditionsKey");
    __name(_cacheKeyValues, "_cacheKeyValues");
    __name(_join, "_join");
    __name(_normalizeWinPath, "_normalizeWinPath");
    __name(_isURL, "_isURL");
    __name(_normalizeAbsolutePath, "_normalizeAbsolutePath");
    __name(_parseInput, "_parseInput");
  }
});

// node_modules/jiti/dist/jiti.cjs
var require_jiti = __commonJS({
  "node_modules/jiti/dist/jiti.cjs"(exports, module) {
    init_esm();
    (() => {
      var e2 = { "./node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist lazy recursive": /* @__PURE__ */ __name(function(e3) {
        function webpackEmptyAsyncContext(e4) {
          return Promise.resolve().then(function() {
            var t3 = new Error("Cannot find module '" + e4 + "'");
            throw t3.code = "MODULE_NOT_FOUND", t3;
          });
        }
        __name(webpackEmptyAsyncContext, "webpackEmptyAsyncContext");
        webpackEmptyAsyncContext.keys = () => [], webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext, webpackEmptyAsyncContext.id = "./node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist lazy recursive", e3.exports = webpackEmptyAsyncContext;
      }, "./node_modules/.pnpm/mlly@1.8.0/node_modules/mlly/dist lazy recursive") }, t2 = {};
      function __webpack_require__(i6) {
        var s2 = t2[i6];
        if (void 0 !== s2) return s2.exports;
        var r3 = t2[i6] = { exports: {} };
        return e2[i6](r3, r3.exports, __webpack_require__), r3.exports;
      }
      __name(__webpack_require__, "__webpack_require__");
      __webpack_require__.n = (e3) => {
        var t3 = e3 && e3.__esModule ? () => e3.default : () => e3;
        return __webpack_require__.d(t3, { a: t3 }), t3;
      }, __webpack_require__.d = (e3, t3) => {
        for (var i6 in t3) __webpack_require__.o(t3, i6) && !__webpack_require__.o(e3, i6) && Object.defineProperty(e3, i6, { enumerable: true, get: t3[i6] });
      }, __webpack_require__.o = (e3, t3) => Object.prototype.hasOwnProperty.call(e3, t3);
      var i5 = {};
      (() => {
        "use strict";
        __webpack_require__.d(i5, { default: /* @__PURE__ */ __name(() => createJiti2, "default") });
        const e3 = __require("node:os");
        var t3 = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239], s2 = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191], r3 = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ", n2 = { 3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile", 5: "class enum extends super const export import", 6: "enum", strict: "implements interface let package private protected public static yield", strictBind: "eval arguments" }, a3 = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", o = { 5: a3, "5module": a3 + " export import", 6: a3 + " const class extends export import super" }, h = /^in(stanceof)?$/, c2 = new RegExp("[" + r3 + "]"), p = new RegExp("[" + r3 + "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･]");
        function isInAstralSet(e4, t4) {
          for (var i6 = 65536, s3 = 0; s3 < t4.length; s3 += 2) {
            if ((i6 += t4[s3]) > e4) return false;
            if ((i6 += t4[s3 + 1]) >= e4) return true;
          }
          return false;
        }
        __name(isInAstralSet, "isInAstralSet");
        function isIdentifierStart(e4, t4) {
          return e4 < 65 ? 36 === e4 : e4 < 91 || (e4 < 97 ? 95 === e4 : e4 < 123 || (e4 <= 65535 ? e4 >= 170 && c2.test(String.fromCharCode(e4)) : false !== t4 && isInAstralSet(e4, s2)));
        }
        __name(isIdentifierStart, "isIdentifierStart");
        function isIdentifierChar(e4, i6) {
          return e4 < 48 ? 36 === e4 : e4 < 58 || !(e4 < 65) && (e4 < 91 || (e4 < 97 ? 95 === e4 : e4 < 123 || (e4 <= 65535 ? e4 >= 170 && p.test(String.fromCharCode(e4)) : false !== i6 && (isInAstralSet(e4, s2) || isInAstralSet(e4, t3)))));
        }
        __name(isIdentifierChar, "isIdentifierChar");
        var acorn_TokenType = /* @__PURE__ */ __name(function(e4, t4) {
          void 0 === t4 && (t4 = {}), this.label = e4, this.keyword = t4.keyword, this.beforeExpr = !!t4.beforeExpr, this.startsExpr = !!t4.startsExpr, this.isLoop = !!t4.isLoop, this.isAssign = !!t4.isAssign, this.prefix = !!t4.prefix, this.postfix = !!t4.postfix, this.binop = t4.binop || null, this.updateContext = null;
        }, "acorn_TokenType");
        function binop(e4, t4) {
          return new acorn_TokenType(e4, { beforeExpr: true, binop: t4 });
        }
        __name(binop, "binop");
        var l = { beforeExpr: true }, u = { startsExpr: true }, d = {};
        function kw(e4, t4) {
          return void 0 === t4 && (t4 = {}), t4.keyword = e4, d[e4] = new acorn_TokenType(e4, t4);
        }
        __name(kw, "kw");
        var f = { num: new acorn_TokenType("num", u), regexp: new acorn_TokenType("regexp", u), string: new acorn_TokenType("string", u), name: new acorn_TokenType("name", u), privateId: new acorn_TokenType("privateId", u), eof: new acorn_TokenType("eof"), bracketL: new acorn_TokenType("[", { beforeExpr: true, startsExpr: true }), bracketR: new acorn_TokenType("]"), braceL: new acorn_TokenType("{", { beforeExpr: true, startsExpr: true }), braceR: new acorn_TokenType("}"), parenL: new acorn_TokenType("(", { beforeExpr: true, startsExpr: true }), parenR: new acorn_TokenType(")"), comma: new acorn_TokenType(",", l), semi: new acorn_TokenType(";", l), colon: new acorn_TokenType(":", l), dot: new acorn_TokenType("."), question: new acorn_TokenType("?", l), questionDot: new acorn_TokenType("?."), arrow: new acorn_TokenType("=>", l), template: new acorn_TokenType("template"), invalidTemplate: new acorn_TokenType("invalidTemplate"), ellipsis: new acorn_TokenType("...", l), backQuote: new acorn_TokenType("`", u), dollarBraceL: new acorn_TokenType("${", { beforeExpr: true, startsExpr: true }), eq: new acorn_TokenType("=", { beforeExpr: true, isAssign: true }), assign: new acorn_TokenType("_=", { beforeExpr: true, isAssign: true }), incDec: new acorn_TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }), prefix: new acorn_TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }), logicalOR: binop("||", 1), logicalAND: binop("&&", 2), bitwiseOR: binop("|", 3), bitwiseXOR: binop("^", 4), bitwiseAND: binop("&", 5), equality: binop("==/!=/===/!==", 6), relational: binop("</>/<=/>=", 7), bitShift: binop("<</>>/>>>", 8), plusMin: new acorn_TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }), modulo: binop("%", 10), star: binop("*", 10), slash: binop("/", 10), starstar: new acorn_TokenType("**", { beforeExpr: true }), coalesce: binop("??", 1), _break: kw("break"), _case: kw("case", l), _catch: kw("catch"), _continue: kw("continue"), _debugger: kw("debugger"), _default: kw("default", l), _do: kw("do", { isLoop: true, beforeExpr: true }), _else: kw("else", l), _finally: kw("finally"), _for: kw("for", { isLoop: true }), _function: kw("function", u), _if: kw("if"), _return: kw("return", l), _switch: kw("switch"), _throw: kw("throw", l), _try: kw("try"), _var: kw("var"), _const: kw("const"), _while: kw("while", { isLoop: true }), _with: kw("with"), _new: kw("new", { beforeExpr: true, startsExpr: true }), _this: kw("this", u), _super: kw("super", u), _class: kw("class", u), _extends: kw("extends", l), _export: kw("export"), _import: kw("import", u), _null: kw("null", u), _true: kw("true", u), _false: kw("false", u), _in: kw("in", { beforeExpr: true, binop: 7 }), _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }), _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }), _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }), _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true }) }, m = /\r\n?|\n|\u2028|\u2029/, g = new RegExp(m.source, "g");
        function isNewLine(e4) {
          return 10 === e4 || 13 === e4 || 8232 === e4 || 8233 === e4;
        }
        __name(isNewLine, "isNewLine");
        function nextLineBreak(e4, t4, i6) {
          void 0 === i6 && (i6 = e4.length);
          for (var s3 = t4; s3 < i6; s3++) {
            var r4 = e4.charCodeAt(s3);
            if (isNewLine(r4)) return s3 < i6 - 1 && 13 === r4 && 10 === e4.charCodeAt(s3 + 1) ? s3 + 2 : s3 + 1;
          }
          return -1;
        }
        __name(nextLineBreak, "nextLineBreak");
        var x = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, v = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, y = Object.prototype, _ = y.hasOwnProperty, E = y.toString, b = Object.hasOwn || function(e4, t4) {
          return _.call(e4, t4);
        }, S = Array.isArray || function(e4) {
          return "[object Array]" === E.call(e4);
        }, k = /* @__PURE__ */ Object.create(null);
        function wordsRegexp(e4) {
          return k[e4] || (k[e4] = new RegExp("^(?:" + e4.replace(/ /g, "|") + ")$"));
        }
        __name(wordsRegexp, "wordsRegexp");
        function codePointToString(e4) {
          return e4 <= 65535 ? String.fromCharCode(e4) : (e4 -= 65536, String.fromCharCode(55296 + (e4 >> 10), 56320 + (1023 & e4)));
        }
        __name(codePointToString, "codePointToString");
        var w = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/, acorn_Position = /* @__PURE__ */ __name(function(e4, t4) {
          this.line = e4, this.column = t4;
        }, "acorn_Position");
        acorn_Position.prototype.offset = function(e4) {
          return new acorn_Position(this.line, this.column + e4);
        };
        var acorn_SourceLocation = /* @__PURE__ */ __name(function(e4, t4, i6) {
          this.start = t4, this.end = i6, null !== e4.sourceFile && (this.source = e4.sourceFile);
        }, "acorn_SourceLocation");
        function getLineInfo(e4, t4) {
          for (var i6 = 1, s3 = 0; ; ) {
            var r4 = nextLineBreak(e4, s3, t4);
            if (r4 < 0) return new acorn_Position(i6, t4 - s3);
            ++i6, s3 = r4;
          }
        }
        __name(getLineInfo, "getLineInfo");
        var I = { ecmaVersion: null, sourceType: "script", onInsertedSemicolon: null, onTrailingComma: null, allowReserved: null, allowReturnOutsideFunction: false, allowImportExportEverywhere: false, allowAwaitOutsideFunction: null, allowSuperOutsideMethod: null, allowHashBang: false, checkPrivateFields: true, locations: false, onToken: null, onComment: null, ranges: false, program: null, sourceFile: null, directSourceFile: null, preserveParens: false }, C = false;
        function getOptions(e4) {
          var t4 = {};
          for (var i6 in I) t4[i6] = e4 && b(e4, i6) ? e4[i6] : I[i6];
          if ("latest" === t4.ecmaVersion ? t4.ecmaVersion = 1e8 : null == t4.ecmaVersion ? (!C && "object" == typeof console && console.warn && (C = true, console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.")), t4.ecmaVersion = 11) : t4.ecmaVersion >= 2015 && (t4.ecmaVersion -= 2009), null == t4.allowReserved && (t4.allowReserved = t4.ecmaVersion < 5), e4 && null != e4.allowHashBang || (t4.allowHashBang = t4.ecmaVersion >= 14), S(t4.onToken)) {
            var s3 = t4.onToken;
            t4.onToken = function(e5) {
              return s3.push(e5);
            };
          }
          return S(t4.onComment) && (t4.onComment = /* @__PURE__ */ function(e5, t5) {
            return function(i7, s4, r4, n3, a4, o2) {
              var h2 = { type: i7 ? "Block" : "Line", value: s4, start: r4, end: n3 };
              e5.locations && (h2.loc = new acorn_SourceLocation(this, a4, o2)), e5.ranges && (h2.range = [r4, n3]), t5.push(h2);
            };
          }(t4, t4.onComment)), t4;
        }
        __name(getOptions, "getOptions");
        var R = 256, P = 259;
        function functionFlags(e4, t4) {
          return 2 | (e4 ? 4 : 0) | (t4 ? 8 : 0);
        }
        __name(functionFlags, "functionFlags");
        var acorn_Parser = /* @__PURE__ */ __name(function(e4, t4, i6) {
          this.options = e4 = getOptions(e4), this.sourceFile = e4.sourceFile, this.keywords = wordsRegexp(o[e4.ecmaVersion >= 6 ? 6 : "module" === e4.sourceType ? "5module" : 5]);
          var s3 = "";
          true !== e4.allowReserved && (s3 = n2[e4.ecmaVersion >= 6 ? 6 : 5 === e4.ecmaVersion ? 5 : 3], "module" === e4.sourceType && (s3 += " await")), this.reservedWords = wordsRegexp(s3);
          var r4 = (s3 ? s3 + " " : "") + n2.strict;
          this.reservedWordsStrict = wordsRegexp(r4), this.reservedWordsStrictBind = wordsRegexp(r4 + " " + n2.strictBind), this.input = String(t4), this.containsEsc = false, i6 ? (this.pos = i6, this.lineStart = this.input.lastIndexOf("\n", i6 - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(m).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = f.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = true, this.inModule = "module" === e4.sourceType, this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.potentialArrowInForAwait = false, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = /* @__PURE__ */ Object.create(null), 0 === this.pos && e4.allowHashBang && "#!" === this.input.slice(0, 2) && this.skipLineComment(2), this.scopeStack = [], this.enterScope(1), this.regexpState = null, this.privateNameStack = [];
        }, "acorn_Parser"), T = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
        acorn_Parser.prototype.parse = function() {
          var e4 = this.options.program || this.startNode();
          return this.nextToken(), this.parseTopLevel(e4);
        }, T.inFunction.get = function() {
          return (2 & this.currentVarScope().flags) > 0;
        }, T.inGenerator.get = function() {
          return (8 & this.currentVarScope().flags) > 0;
        }, T.inAsync.get = function() {
          return (4 & this.currentVarScope().flags) > 0;
        }, T.canAwait.get = function() {
          for (var e4 = this.scopeStack.length - 1; e4 >= 0; e4--) {
            var t4 = this.scopeStack[e4].flags;
            if (768 & t4) return false;
            if (2 & t4) return (4 & t4) > 0;
          }
          return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
        }, T.allowSuper.get = function() {
          return (64 & this.currentThisScope().flags) > 0 || this.options.allowSuperOutsideMethod;
        }, T.allowDirectSuper.get = function() {
          return (128 & this.currentThisScope().flags) > 0;
        }, T.treatFunctionsAsVar.get = function() {
          return this.treatFunctionsAsVarInScope(this.currentScope());
        }, T.allowNewDotTarget.get = function() {
          for (var e4 = this.scopeStack.length - 1; e4 >= 0; e4--) {
            var t4 = this.scopeStack[e4].flags;
            if (768 & t4 || 2 & t4 && !(16 & t4)) return true;
          }
          return false;
        }, T.inClassStaticBlock.get = function() {
          return (this.currentVarScope().flags & R) > 0;
        }, acorn_Parser.extend = function() {
          for (var e4 = [], t4 = arguments.length; t4--; ) e4[t4] = arguments[t4];
          for (var i6 = this, s3 = 0; s3 < e4.length; s3++) i6 = e4[s3](i6);
          return i6;
        }, acorn_Parser.parse = function(e4, t4) {
          return new this(t4, e4).parse();
        }, acorn_Parser.parseExpressionAt = function(e4, t4, i6) {
          var s3 = new this(i6, e4, t4);
          return s3.nextToken(), s3.parseExpression();
        }, acorn_Parser.tokenizer = function(e4, t4) {
          return new this(t4, e4);
        }, Object.defineProperties(acorn_Parser.prototype, T);
        var A = acorn_Parser.prototype, N = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
        A.strictDirective = function(e4) {
          if (this.options.ecmaVersion < 5) return false;
          for (; ; ) {
            v.lastIndex = e4, e4 += v.exec(this.input)[0].length;
            var t4 = N.exec(this.input.slice(e4));
            if (!t4) return false;
            if ("use strict" === (t4[1] || t4[2])) {
              v.lastIndex = e4 + t4[0].length;
              var i6 = v.exec(this.input), s3 = i6.index + i6[0].length, r4 = this.input.charAt(s3);
              return ";" === r4 || "}" === r4 || m.test(i6[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(r4) || "!" === r4 && "=" === this.input.charAt(s3 + 1));
            }
            e4 += t4[0].length, v.lastIndex = e4, e4 += v.exec(this.input)[0].length, ";" === this.input[e4] && e4++;
          }
        }, A.eat = function(e4) {
          return this.type === e4 && (this.next(), true);
        }, A.isContextual = function(e4) {
          return this.type === f.name && this.value === e4 && !this.containsEsc;
        }, A.eatContextual = function(e4) {
          return !!this.isContextual(e4) && (this.next(), true);
        }, A.expectContextual = function(e4) {
          this.eatContextual(e4) || this.unexpected();
        }, A.canInsertSemicolon = function() {
          return this.type === f.eof || this.type === f.braceR || m.test(this.input.slice(this.lastTokEnd, this.start));
        }, A.insertSemicolon = function() {
          if (this.canInsertSemicolon()) return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), true;
        }, A.semicolon = function() {
          this.eat(f.semi) || this.insertSemicolon() || this.unexpected();
        }, A.afterTrailingComma = function(e4, t4) {
          if (this.type === e4) return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), t4 || this.next(), true;
        }, A.expect = function(e4) {
          this.eat(e4) || this.unexpected();
        }, A.unexpected = function(e4) {
          this.raise(null != e4 ? e4 : this.start, "Unexpected token");
        };
        var acorn_DestructuringErrors = /* @__PURE__ */ __name(function() {
          this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
        }, "acorn_DestructuringErrors");
        A.checkPatternErrors = function(e4, t4) {
          if (e4) {
            e4.trailingComma > -1 && this.raiseRecoverable(e4.trailingComma, "Comma is not permitted after the rest element");
            var i6 = t4 ? e4.parenthesizedAssign : e4.parenthesizedBind;
            i6 > -1 && this.raiseRecoverable(i6, t4 ? "Assigning to rvalue" : "Parenthesized pattern");
          }
        }, A.checkExpressionErrors = function(e4, t4) {
          if (!e4) return false;
          var i6 = e4.shorthandAssign, s3 = e4.doubleProto;
          if (!t4) return i6 >= 0 || s3 >= 0;
          i6 >= 0 && this.raise(i6, "Shorthand property assignments are valid only in destructuring patterns"), s3 >= 0 && this.raiseRecoverable(s3, "Redefinition of __proto__ property");
        }, A.checkYieldAwaitInDefaultParams = function() {
          this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
        }, A.isSimpleAssignTarget = function(e4) {
          return "ParenthesizedExpression" === e4.type ? this.isSimpleAssignTarget(e4.expression) : "Identifier" === e4.type || "MemberExpression" === e4.type;
        };
        var L = acorn_Parser.prototype;
        L.parseTopLevel = function(e4) {
          var t4 = /* @__PURE__ */ Object.create(null);
          for (e4.body || (e4.body = []); this.type !== f.eof; ) {
            var i6 = this.parseStatement(null, true, t4);
            e4.body.push(i6);
          }
          if (this.inModule) for (var s3 = 0, r4 = Object.keys(this.undefinedExports); s3 < r4.length; s3 += 1) {
            var n3 = r4[s3];
            this.raiseRecoverable(this.undefinedExports[n3].start, "Export '" + n3 + "' is not defined");
          }
          return this.adaptDirectivePrologue(e4.body), this.next(), e4.sourceType = this.options.sourceType, this.finishNode(e4, "Program");
        };
        var O = { kind: "loop" }, D = { kind: "switch" };
        L.isLet = function(e4) {
          if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return false;
          v.lastIndex = this.pos;
          var t4 = v.exec(this.input), i6 = this.pos + t4[0].length, s3 = this.input.charCodeAt(i6);
          if (91 === s3 || 92 === s3) return true;
          if (e4) return false;
          if (123 === s3 || s3 > 55295 && s3 < 56320) return true;
          if (isIdentifierStart(s3, true)) {
            for (var r4 = i6 + 1; isIdentifierChar(s3 = this.input.charCodeAt(r4), true); ) ++r4;
            if (92 === s3 || s3 > 55295 && s3 < 56320) return true;
            var n3 = this.input.slice(i6, r4);
            if (!h.test(n3)) return true;
          }
          return false;
        }, L.isAsyncFunction = function() {
          if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return false;
          v.lastIndex = this.pos;
          var e4, t4 = v.exec(this.input), i6 = this.pos + t4[0].length;
          return !(m.test(this.input.slice(this.pos, i6)) || "function" !== this.input.slice(i6, i6 + 8) || i6 + 8 !== this.input.length && (isIdentifierChar(e4 = this.input.charCodeAt(i6 + 8)) || e4 > 55295 && e4 < 56320));
        }, L.isUsingKeyword = function(e4, t4) {
          if (this.options.ecmaVersion < 17 || !this.isContextual(e4 ? "await" : "using")) return false;
          v.lastIndex = this.pos;
          var i6 = v.exec(this.input), s3 = this.pos + i6[0].length;
          if (m.test(this.input.slice(this.pos, s3))) return false;
          if (e4) {
            var r4, n3 = s3 + 5;
            if ("using" !== this.input.slice(s3, n3) || n3 === this.input.length || isIdentifierChar(r4 = this.input.charCodeAt(n3)) || r4 > 55295 && r4 < 56320) return false;
            v.lastIndex = n3;
            var a4 = v.exec(this.input);
            if (a4 && m.test(this.input.slice(n3, n3 + a4[0].length))) return false;
          }
          if (t4) {
            var o2, h2 = s3 + 2;
            if (!("of" !== this.input.slice(s3, h2) || h2 !== this.input.length && (isIdentifierChar(o2 = this.input.charCodeAt(h2)) || o2 > 55295 && o2 < 56320))) return false;
          }
          var c3 = this.input.charCodeAt(s3);
          return isIdentifierStart(c3, true) || 92 === c3;
        }, L.isAwaitUsing = function(e4) {
          return this.isUsingKeyword(true, e4);
        }, L.isUsing = function(e4) {
          return this.isUsingKeyword(false, e4);
        }, L.parseStatement = function(e4, t4, i6) {
          var s3, r4 = this.type, n3 = this.startNode();
          switch (this.isLet(e4) && (r4 = f._var, s3 = "let"), r4) {
            case f._break:
            case f._continue:
              return this.parseBreakContinueStatement(n3, r4.keyword);
            case f._debugger:
              return this.parseDebuggerStatement(n3);
            case f._do:
              return this.parseDoStatement(n3);
            case f._for:
              return this.parseForStatement(n3);
            case f._function:
              return e4 && (this.strict || "if" !== e4 && "label" !== e4) && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(n3, false, !e4);
            case f._class:
              return e4 && this.unexpected(), this.parseClass(n3, true);
            case f._if:
              return this.parseIfStatement(n3);
            case f._return:
              return this.parseReturnStatement(n3);
            case f._switch:
              return this.parseSwitchStatement(n3);
            case f._throw:
              return this.parseThrowStatement(n3);
            case f._try:
              return this.parseTryStatement(n3);
            case f._const:
            case f._var:
              return s3 = s3 || this.value, e4 && "var" !== s3 && this.unexpected(), this.parseVarStatement(n3, s3);
            case f._while:
              return this.parseWhileStatement(n3);
            case f._with:
              return this.parseWithStatement(n3);
            case f.braceL:
              return this.parseBlock(true, n3);
            case f.semi:
              return this.parseEmptyStatement(n3);
            case f._export:
            case f._import:
              if (this.options.ecmaVersion > 10 && r4 === f._import) {
                v.lastIndex = this.pos;
                var a4 = v.exec(this.input), o2 = this.pos + a4[0].length, h2 = this.input.charCodeAt(o2);
                if (40 === h2 || 46 === h2) return this.parseExpressionStatement(n3, this.parseExpression());
              }
              return this.options.allowImportExportEverywhere || (t4 || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), r4 === f._import ? this.parseImport(n3) : this.parseExport(n3, i6);
            default:
              if (this.isAsyncFunction()) return e4 && this.unexpected(), this.next(), this.parseFunctionStatement(n3, true, !e4);
              var c3 = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
              if (c3) return t4 && "script" === this.options.sourceType && this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script`"), "await using" === c3 && (this.canAwait || this.raise(this.start, "Await using cannot appear outside of async function"), this.next()), this.next(), this.parseVar(n3, false, c3), this.semicolon(), this.finishNode(n3, "VariableDeclaration");
              var p2 = this.value, l2 = this.parseExpression();
              return r4 === f.name && "Identifier" === l2.type && this.eat(f.colon) ? this.parseLabeledStatement(n3, p2, l2, e4) : this.parseExpressionStatement(n3, l2);
          }
        }, L.parseBreakContinueStatement = function(e4, t4) {
          var i6 = "break" === t4;
          this.next(), this.eat(f.semi) || this.insertSemicolon() ? e4.label = null : this.type !== f.name ? this.unexpected() : (e4.label = this.parseIdent(), this.semicolon());
          for (var s3 = 0; s3 < this.labels.length; ++s3) {
            var r4 = this.labels[s3];
            if (null == e4.label || r4.name === e4.label.name) {
              if (null != r4.kind && (i6 || "loop" === r4.kind)) break;
              if (e4.label && i6) break;
            }
          }
          return s3 === this.labels.length && this.raise(e4.start, "Unsyntactic " + t4), this.finishNode(e4, i6 ? "BreakStatement" : "ContinueStatement");
        }, L.parseDebuggerStatement = function(e4) {
          return this.next(), this.semicolon(), this.finishNode(e4, "DebuggerStatement");
        }, L.parseDoStatement = function(e4) {
          return this.next(), this.labels.push(O), e4.body = this.parseStatement("do"), this.labels.pop(), this.expect(f._while), e4.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(f.semi) : this.semicolon(), this.finishNode(e4, "DoWhileStatement");
        }, L.parseForStatement = function(e4) {
          this.next();
          var t4 = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
          if (this.labels.push(O), this.enterScope(0), this.expect(f.parenL), this.type === f.semi) return t4 > -1 && this.unexpected(t4), this.parseFor(e4, null);
          var i6 = this.isLet();
          if (this.type === f._var || this.type === f._const || i6) {
            var s3 = this.startNode(), r4 = i6 ? "let" : this.value;
            return this.next(), this.parseVar(s3, true, r4), this.finishNode(s3, "VariableDeclaration"), this.parseForAfterInit(e4, s3, t4);
          }
          var n3 = this.isContextual("let"), a4 = false, o2 = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
          if (o2) {
            var h2 = this.startNode();
            return this.next(), "await using" === o2 && this.next(), this.parseVar(h2, true, o2), this.finishNode(h2, "VariableDeclaration"), this.parseForAfterInit(e4, h2, t4);
          }
          var c3 = this.containsEsc, p2 = new acorn_DestructuringErrors(), l2 = this.start, u2 = t4 > -1 ? this.parseExprSubscripts(p2, "await") : this.parseExpression(true, p2);
          return this.type === f._in || (a4 = this.options.ecmaVersion >= 6 && this.isContextual("of")) ? (t4 > -1 ? (this.type === f._in && this.unexpected(t4), e4.await = true) : a4 && this.options.ecmaVersion >= 8 && (u2.start !== l2 || c3 || "Identifier" !== u2.type || "async" !== u2.name ? this.options.ecmaVersion >= 9 && (e4.await = false) : this.unexpected()), n3 && a4 && this.raise(u2.start, "The left-hand side of a for-of loop may not start with 'let'."), this.toAssignable(u2, false, p2), this.checkLValPattern(u2), this.parseForIn(e4, u2)) : (this.checkExpressionErrors(p2, true), t4 > -1 && this.unexpected(t4), this.parseFor(e4, u2));
        }, L.parseForAfterInit = function(e4, t4, i6) {
          return (this.type === f._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && 1 === t4.declarations.length ? (this.options.ecmaVersion >= 9 && (this.type === f._in ? i6 > -1 && this.unexpected(i6) : e4.await = i6 > -1), this.parseForIn(e4, t4)) : (i6 > -1 && this.unexpected(i6), this.parseFor(e4, t4));
        }, L.parseFunctionStatement = function(e4, t4, i6) {
          return this.next(), this.parseFunction(e4, U | (i6 ? 0 : M), false, t4);
        }, L.parseIfStatement = function(e4) {
          return this.next(), e4.test = this.parseParenExpression(), e4.consequent = this.parseStatement("if"), e4.alternate = this.eat(f._else) ? this.parseStatement("if") : null, this.finishNode(e4, "IfStatement");
        }, L.parseReturnStatement = function(e4) {
          return this.inFunction || this.options.allowReturnOutsideFunction || this.raise(this.start, "'return' outside of function"), this.next(), this.eat(f.semi) || this.insertSemicolon() ? e4.argument = null : (e4.argument = this.parseExpression(), this.semicolon()), this.finishNode(e4, "ReturnStatement");
        }, L.parseSwitchStatement = function(e4) {
          var t4;
          this.next(), e4.discriminant = this.parseParenExpression(), e4.cases = [], this.expect(f.braceL), this.labels.push(D), this.enterScope(0);
          for (var i6 = false; this.type !== f.braceR; ) if (this.type === f._case || this.type === f._default) {
            var s3 = this.type === f._case;
            t4 && this.finishNode(t4, "SwitchCase"), e4.cases.push(t4 = this.startNode()), t4.consequent = [], this.next(), s3 ? t4.test = this.parseExpression() : (i6 && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), i6 = true, t4.test = null), this.expect(f.colon);
          } else t4 || this.unexpected(), t4.consequent.push(this.parseStatement(null));
          return this.exitScope(), t4 && this.finishNode(t4, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e4, "SwitchStatement");
        }, L.parseThrowStatement = function(e4) {
          return this.next(), m.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e4.argument = this.parseExpression(), this.semicolon(), this.finishNode(e4, "ThrowStatement");
        };
        var V = [];
        L.parseCatchClauseParam = function() {
          var e4 = this.parseBindingAtom(), t4 = "Identifier" === e4.type;
          return this.enterScope(t4 ? 32 : 0), this.checkLValPattern(e4, t4 ? 4 : 2), this.expect(f.parenR), e4;
        }, L.parseTryStatement = function(e4) {
          if (this.next(), e4.block = this.parseBlock(), e4.handler = null, this.type === f._catch) {
            var t4 = this.startNode();
            this.next(), this.eat(f.parenL) ? t4.param = this.parseCatchClauseParam() : (this.options.ecmaVersion < 10 && this.unexpected(), t4.param = null, this.enterScope(0)), t4.body = this.parseBlock(false), this.exitScope(), e4.handler = this.finishNode(t4, "CatchClause");
          }
          return e4.finalizer = this.eat(f._finally) ? this.parseBlock() : null, e4.handler || e4.finalizer || this.raise(e4.start, "Missing catch or finally clause"), this.finishNode(e4, "TryStatement");
        }, L.parseVarStatement = function(e4, t4, i6) {
          return this.next(), this.parseVar(e4, false, t4, i6), this.semicolon(), this.finishNode(e4, "VariableDeclaration");
        }, L.parseWhileStatement = function(e4) {
          return this.next(), e4.test = this.parseParenExpression(), this.labels.push(O), e4.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e4, "WhileStatement");
        }, L.parseWithStatement = function(e4) {
          return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e4.object = this.parseParenExpression(), e4.body = this.parseStatement("with"), this.finishNode(e4, "WithStatement");
        }, L.parseEmptyStatement = function(e4) {
          return this.next(), this.finishNode(e4, "EmptyStatement");
        }, L.parseLabeledStatement = function(e4, t4, i6, s3) {
          for (var r4 = 0, n3 = this.labels; r4 < n3.length; r4 += 1) {
            n3[r4].name === t4 && this.raise(i6.start, "Label '" + t4 + "' is already declared");
          }
          for (var a4 = this.type.isLoop ? "loop" : this.type === f._switch ? "switch" : null, o2 = this.labels.length - 1; o2 >= 0; o2--) {
            var h2 = this.labels[o2];
            if (h2.statementStart !== e4.start) break;
            h2.statementStart = this.start, h2.kind = a4;
          }
          return this.labels.push({ name: t4, kind: a4, statementStart: this.start }), e4.body = this.parseStatement(s3 ? -1 === s3.indexOf("label") ? s3 + "label" : s3 : "label"), this.labels.pop(), e4.label = i6, this.finishNode(e4, "LabeledStatement");
        }, L.parseExpressionStatement = function(e4, t4) {
          return e4.expression = t4, this.semicolon(), this.finishNode(e4, "ExpressionStatement");
        }, L.parseBlock = function(e4, t4, i6) {
          for (void 0 === e4 && (e4 = true), void 0 === t4 && (t4 = this.startNode()), t4.body = [], this.expect(f.braceL), e4 && this.enterScope(0); this.type !== f.braceR; ) {
            var s3 = this.parseStatement(null);
            t4.body.push(s3);
          }
          return i6 && (this.strict = false), this.next(), e4 && this.exitScope(), this.finishNode(t4, "BlockStatement");
        }, L.parseFor = function(e4, t4) {
          return e4.init = t4, this.expect(f.semi), e4.test = this.type === f.semi ? null : this.parseExpression(), this.expect(f.semi), e4.update = this.type === f.parenR ? null : this.parseExpression(), this.expect(f.parenR), e4.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e4, "ForStatement");
        }, L.parseForIn = function(e4, t4) {
          var i6 = this.type === f._in;
          return this.next(), "VariableDeclaration" === t4.type && null != t4.declarations[0].init && (!i6 || this.options.ecmaVersion < 8 || this.strict || "var" !== t4.kind || "Identifier" !== t4.declarations[0].id.type) && this.raise(t4.start, (i6 ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"), e4.left = t4, e4.right = i6 ? this.parseExpression() : this.parseMaybeAssign(), this.expect(f.parenR), e4.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e4, i6 ? "ForInStatement" : "ForOfStatement");
        }, L.parseVar = function(e4, t4, i6, s3) {
          for (e4.declarations = [], e4.kind = i6; ; ) {
            var r4 = this.startNode();
            if (this.parseVarId(r4, i6), this.eat(f.eq) ? r4.init = this.parseMaybeAssign(t4) : s3 || "const" !== i6 || this.type === f._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? s3 || "using" !== i6 && "await using" !== i6 || !(this.options.ecmaVersion >= 17) || this.type === f._in || this.isContextual("of") ? s3 || "Identifier" === r4.id.type || t4 && (this.type === f._in || this.isContextual("of")) ? r4.init = null : this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : this.raise(this.lastTokEnd, "Missing initializer in " + i6 + " declaration") : this.unexpected(), e4.declarations.push(this.finishNode(r4, "VariableDeclarator")), !this.eat(f.comma)) break;
          }
          return e4;
        }, L.parseVarId = function(e4, t4) {
          e4.id = "using" === t4 || "await using" === t4 ? this.parseIdent() : this.parseBindingAtom(), this.checkLValPattern(e4.id, "var" === t4 ? 1 : 2, false);
        };
        var U = 1, M = 2;
        function isPrivateNameConflicted(e4, t4) {
          var i6 = t4.key.name, s3 = e4[i6], r4 = "true";
          return "MethodDefinition" !== t4.type || "get" !== t4.kind && "set" !== t4.kind || (r4 = (t4.static ? "s" : "i") + t4.kind), "iget" === s3 && "iset" === r4 || "iset" === s3 && "iget" === r4 || "sget" === s3 && "sset" === r4 || "sset" === s3 && "sget" === r4 ? (e4[i6] = "true", false) : !!s3 || (e4[i6] = r4, false);
        }
        __name(isPrivateNameConflicted, "isPrivateNameConflicted");
        function checkKeyName(e4, t4) {
          var i6 = e4.computed, s3 = e4.key;
          return !i6 && ("Identifier" === s3.type && s3.name === t4 || "Literal" === s3.type && s3.value === t4);
        }
        __name(checkKeyName, "checkKeyName");
        L.parseFunction = function(e4, t4, i6, s3, r4) {
          this.initFunction(e4), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !s3) && (this.type === f.star && t4 & M && this.unexpected(), e4.generator = this.eat(f.star)), this.options.ecmaVersion >= 8 && (e4.async = !!s3), t4 & U && (e4.id = 4 & t4 && this.type !== f.name ? null : this.parseIdent(), !e4.id || t4 & M || this.checkLValSimple(e4.id, this.strict || e4.generator || e4.async ? this.treatFunctionsAsVar ? 1 : 2 : 3));
          var n3 = this.yieldPos, a4 = this.awaitPos, o2 = this.awaitIdentPos;
          return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(functionFlags(e4.async, e4.generator)), t4 & U || (e4.id = this.type === f.name ? this.parseIdent() : null), this.parseFunctionParams(e4), this.parseFunctionBody(e4, i6, false, r4), this.yieldPos = n3, this.awaitPos = a4, this.awaitIdentPos = o2, this.finishNode(e4, t4 & U ? "FunctionDeclaration" : "FunctionExpression");
        }, L.parseFunctionParams = function(e4) {
          this.expect(f.parenL), e4.params = this.parseBindingList(f.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
        }, L.parseClass = function(e4, t4) {
          this.next();
          var i6 = this.strict;
          this.strict = true, this.parseClassId(e4, t4), this.parseClassSuper(e4);
          var s3 = this.enterClassBody(), r4 = this.startNode(), n3 = false;
          for (r4.body = [], this.expect(f.braceL); this.type !== f.braceR; ) {
            var a4 = this.parseClassElement(null !== e4.superClass);
            a4 && (r4.body.push(a4), "MethodDefinition" === a4.type && "constructor" === a4.kind ? (n3 && this.raiseRecoverable(a4.start, "Duplicate constructor in the same class"), n3 = true) : a4.key && "PrivateIdentifier" === a4.key.type && isPrivateNameConflicted(s3, a4) && this.raiseRecoverable(a4.key.start, "Identifier '#" + a4.key.name + "' has already been declared"));
          }
          return this.strict = i6, this.next(), e4.body = this.finishNode(r4, "ClassBody"), this.exitClassBody(), this.finishNode(e4, t4 ? "ClassDeclaration" : "ClassExpression");
        }, L.parseClassElement = function(e4) {
          if (this.eat(f.semi)) return null;
          var t4 = this.options.ecmaVersion, i6 = this.startNode(), s3 = "", r4 = false, n3 = false, a4 = "method", o2 = false;
          if (this.eatContextual("static")) {
            if (t4 >= 13 && this.eat(f.braceL)) return this.parseClassStaticBlock(i6), i6;
            this.isClassElementNameStart() || this.type === f.star ? o2 = true : s3 = "static";
          }
          if (i6.static = o2, !s3 && t4 >= 8 && this.eatContextual("async") && (!this.isClassElementNameStart() && this.type !== f.star || this.canInsertSemicolon() ? s3 = "async" : n3 = true), !s3 && (t4 >= 9 || !n3) && this.eat(f.star) && (r4 = true), !s3 && !n3 && !r4) {
            var h2 = this.value;
            (this.eatContextual("get") || this.eatContextual("set")) && (this.isClassElementNameStart() ? a4 = h2 : s3 = h2);
          }
          if (s3 ? (i6.computed = false, i6.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc), i6.key.name = s3, this.finishNode(i6.key, "Identifier")) : this.parseClassElementName(i6), t4 < 13 || this.type === f.parenL || "method" !== a4 || r4 || n3) {
            var c3 = !i6.static && checkKeyName(i6, "constructor"), p2 = c3 && e4;
            c3 && "method" !== a4 && this.raise(i6.key.start, "Constructor can't have get/set modifier"), i6.kind = c3 ? "constructor" : a4, this.parseClassMethod(i6, r4, n3, p2);
          } else this.parseClassField(i6);
          return i6;
        }, L.isClassElementNameStart = function() {
          return this.type === f.name || this.type === f.privateId || this.type === f.num || this.type === f.string || this.type === f.bracketL || this.type.keyword;
        }, L.parseClassElementName = function(e4) {
          this.type === f.privateId ? ("constructor" === this.value && this.raise(this.start, "Classes can't have an element named '#constructor'"), e4.computed = false, e4.key = this.parsePrivateIdent()) : this.parsePropertyName(e4);
        }, L.parseClassMethod = function(e4, t4, i6, s3) {
          var r4 = e4.key;
          "constructor" === e4.kind ? (t4 && this.raise(r4.start, "Constructor can't be a generator"), i6 && this.raise(r4.start, "Constructor can't be an async method")) : e4.static && checkKeyName(e4, "prototype") && this.raise(r4.start, "Classes may not have a static property named prototype");
          var n3 = e4.value = this.parseMethod(t4, i6, s3);
          return "get" === e4.kind && 0 !== n3.params.length && this.raiseRecoverable(n3.start, "getter should have no params"), "set" === e4.kind && 1 !== n3.params.length && this.raiseRecoverable(n3.start, "setter should have exactly one param"), "set" === e4.kind && "RestElement" === n3.params[0].type && this.raiseRecoverable(n3.params[0].start, "Setter cannot use rest params"), this.finishNode(e4, "MethodDefinition");
        }, L.parseClassField = function(e4) {
          return checkKeyName(e4, "constructor") ? this.raise(e4.key.start, "Classes can't have a field named 'constructor'") : e4.static && checkKeyName(e4, "prototype") && this.raise(e4.key.start, "Classes can't have a static field named 'prototype'"), this.eat(f.eq) ? (this.enterScope(576), e4.value = this.parseMaybeAssign(), this.exitScope()) : e4.value = null, this.semicolon(), this.finishNode(e4, "PropertyDefinition");
        }, L.parseClassStaticBlock = function(e4) {
          e4.body = [];
          var t4 = this.labels;
          for (this.labels = [], this.enterScope(320); this.type !== f.braceR; ) {
            var i6 = this.parseStatement(null);
            e4.body.push(i6);
          }
          return this.next(), this.exitScope(), this.labels = t4, this.finishNode(e4, "StaticBlock");
        }, L.parseClassId = function(e4, t4) {
          this.type === f.name ? (e4.id = this.parseIdent(), t4 && this.checkLValSimple(e4.id, 2, false)) : (true === t4 && this.unexpected(), e4.id = null);
        }, L.parseClassSuper = function(e4) {
          e4.superClass = this.eat(f._extends) ? this.parseExprSubscripts(null, false) : null;
        }, L.enterClassBody = function() {
          var e4 = { declared: /* @__PURE__ */ Object.create(null), used: [] };
          return this.privateNameStack.push(e4), e4.declared;
        }, L.exitClassBody = function() {
          var e4 = this.privateNameStack.pop(), t4 = e4.declared, i6 = e4.used;
          if (this.options.checkPrivateFields) for (var s3 = this.privateNameStack.length, r4 = 0 === s3 ? null : this.privateNameStack[s3 - 1], n3 = 0; n3 < i6.length; ++n3) {
            var a4 = i6[n3];
            b(t4, a4.name) || (r4 ? r4.used.push(a4) : this.raiseRecoverable(a4.start, "Private field '#" + a4.name + "' must be declared in an enclosing class"));
          }
        }, L.parseExportAllDeclaration = function(e4, t4) {
          return this.options.ecmaVersion >= 11 && (this.eatContextual("as") ? (e4.exported = this.parseModuleExportName(), this.checkExport(t4, e4.exported, this.lastTokStart)) : e4.exported = null), this.expectContextual("from"), this.type !== f.string && this.unexpected(), e4.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e4.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e4, "ExportAllDeclaration");
        }, L.parseExport = function(e4, t4) {
          if (this.next(), this.eat(f.star)) return this.parseExportAllDeclaration(e4, t4);
          if (this.eat(f._default)) return this.checkExport(t4, "default", this.lastTokStart), e4.declaration = this.parseExportDefaultDeclaration(), this.finishNode(e4, "ExportDefaultDeclaration");
          if (this.shouldParseExportStatement()) e4.declaration = this.parseExportDeclaration(e4), "VariableDeclaration" === e4.declaration.type ? this.checkVariableExport(t4, e4.declaration.declarations) : this.checkExport(t4, e4.declaration.id, e4.declaration.id.start), e4.specifiers = [], e4.source = null, this.options.ecmaVersion >= 16 && (e4.attributes = []);
          else {
            if (e4.declaration = null, e4.specifiers = this.parseExportSpecifiers(t4), this.eatContextual("from")) this.type !== f.string && this.unexpected(), e4.source = this.parseExprAtom(), this.options.ecmaVersion >= 16 && (e4.attributes = this.parseWithClause());
            else {
              for (var i6 = 0, s3 = e4.specifiers; i6 < s3.length; i6 += 1) {
                var r4 = s3[i6];
                this.checkUnreserved(r4.local), this.checkLocalExport(r4.local), "Literal" === r4.local.type && this.raise(r4.local.start, "A string literal cannot be used as an exported binding without `from`.");
              }
              e4.source = null, this.options.ecmaVersion >= 16 && (e4.attributes = []);
            }
            this.semicolon();
          }
          return this.finishNode(e4, "ExportNamedDeclaration");
        }, L.parseExportDeclaration = function(e4) {
          return this.parseStatement(null);
        }, L.parseExportDefaultDeclaration = function() {
          var e4;
          if (this.type === f._function || (e4 = this.isAsyncFunction())) {
            var t4 = this.startNode();
            return this.next(), e4 && this.next(), this.parseFunction(t4, 4 | U, false, e4);
          }
          if (this.type === f._class) {
            var i6 = this.startNode();
            return this.parseClass(i6, "nullableID");
          }
          var s3 = this.parseMaybeAssign();
          return this.semicolon(), s3;
        }, L.checkExport = function(e4, t4, i6) {
          e4 && ("string" != typeof t4 && (t4 = "Identifier" === t4.type ? t4.name : t4.value), b(e4, t4) && this.raiseRecoverable(i6, "Duplicate export '" + t4 + "'"), e4[t4] = true);
        }, L.checkPatternExport = function(e4, t4) {
          var i6 = t4.type;
          if ("Identifier" === i6) this.checkExport(e4, t4, t4.start);
          else if ("ObjectPattern" === i6) for (var s3 = 0, r4 = t4.properties; s3 < r4.length; s3 += 1) {
            var n3 = r4[s3];
            this.checkPatternExport(e4, n3);
          }
          else if ("ArrayPattern" === i6) for (var a4 = 0, o2 = t4.elements; a4 < o2.length; a4 += 1) {
            var h2 = o2[a4];
            h2 && this.checkPatternExport(e4, h2);
          }
          else "Property" === i6 ? this.checkPatternExport(e4, t4.value) : "AssignmentPattern" === i6 ? this.checkPatternExport(e4, t4.left) : "RestElement" === i6 && this.checkPatternExport(e4, t4.argument);
        }, L.checkVariableExport = function(e4, t4) {
          if (e4) for (var i6 = 0, s3 = t4; i6 < s3.length; i6 += 1) {
            var r4 = s3[i6];
            this.checkPatternExport(e4, r4.id);
          }
        }, L.shouldParseExportStatement = function() {
          return "var" === this.type.keyword || "const" === this.type.keyword || "class" === this.type.keyword || "function" === this.type.keyword || this.isLet() || this.isAsyncFunction();
        }, L.parseExportSpecifier = function(e4) {
          var t4 = this.startNode();
          return t4.local = this.parseModuleExportName(), t4.exported = this.eatContextual("as") ? this.parseModuleExportName() : t4.local, this.checkExport(e4, t4.exported, t4.exported.start), this.finishNode(t4, "ExportSpecifier");
        }, L.parseExportSpecifiers = function(e4) {
          var t4 = [], i6 = true;
          for (this.expect(f.braceL); !this.eat(f.braceR); ) {
            if (i6) i6 = false;
            else if (this.expect(f.comma), this.afterTrailingComma(f.braceR)) break;
            t4.push(this.parseExportSpecifier(e4));
          }
          return t4;
        }, L.parseImport = function(e4) {
          return this.next(), this.type === f.string ? (e4.specifiers = V, e4.source = this.parseExprAtom()) : (e4.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e4.source = this.type === f.string ? this.parseExprAtom() : this.unexpected()), this.options.ecmaVersion >= 16 && (e4.attributes = this.parseWithClause()), this.semicolon(), this.finishNode(e4, "ImportDeclaration");
        }, L.parseImportSpecifier = function() {
          var e4 = this.startNode();
          return e4.imported = this.parseModuleExportName(), this.eatContextual("as") ? e4.local = this.parseIdent() : (this.checkUnreserved(e4.imported), e4.local = e4.imported), this.checkLValSimple(e4.local, 2), this.finishNode(e4, "ImportSpecifier");
        }, L.parseImportDefaultSpecifier = function() {
          var e4 = this.startNode();
          return e4.local = this.parseIdent(), this.checkLValSimple(e4.local, 2), this.finishNode(e4, "ImportDefaultSpecifier");
        }, L.parseImportNamespaceSpecifier = function() {
          var e4 = this.startNode();
          return this.next(), this.expectContextual("as"), e4.local = this.parseIdent(), this.checkLValSimple(e4.local, 2), this.finishNode(e4, "ImportNamespaceSpecifier");
        }, L.parseImportSpecifiers = function() {
          var e4 = [], t4 = true;
          if (this.type === f.name && (e4.push(this.parseImportDefaultSpecifier()), !this.eat(f.comma))) return e4;
          if (this.type === f.star) return e4.push(this.parseImportNamespaceSpecifier()), e4;
          for (this.expect(f.braceL); !this.eat(f.braceR); ) {
            if (t4) t4 = false;
            else if (this.expect(f.comma), this.afterTrailingComma(f.braceR)) break;
            e4.push(this.parseImportSpecifier());
          }
          return e4;
        }, L.parseWithClause = function() {
          var e4 = [];
          if (!this.eat(f._with)) return e4;
          this.expect(f.braceL);
          for (var t4 = {}, i6 = true; !this.eat(f.braceR); ) {
            if (i6) i6 = false;
            else if (this.expect(f.comma), this.afterTrailingComma(f.braceR)) break;
            var s3 = this.parseImportAttribute(), r4 = "Identifier" === s3.key.type ? s3.key.name : s3.key.value;
            b(t4, r4) && this.raiseRecoverable(s3.key.start, "Duplicate attribute key '" + r4 + "'"), t4[r4] = true, e4.push(s3);
          }
          return e4;
        }, L.parseImportAttribute = function() {
          var e4 = this.startNode();
          return e4.key = this.type === f.string ? this.parseExprAtom() : this.parseIdent("never" !== this.options.allowReserved), this.expect(f.colon), this.type !== f.string && this.unexpected(), e4.value = this.parseExprAtom(), this.finishNode(e4, "ImportAttribute");
        }, L.parseModuleExportName = function() {
          if (this.options.ecmaVersion >= 13 && this.type === f.string) {
            var e4 = this.parseLiteral(this.value);
            return w.test(e4.value) && this.raise(e4.start, "An export name cannot include a lone surrogate."), e4;
          }
          return this.parseIdent(true);
        }, L.adaptDirectivePrologue = function(e4) {
          for (var t4 = 0; t4 < e4.length && this.isDirectiveCandidate(e4[t4]); ++t4) e4[t4].directive = e4[t4].expression.raw.slice(1, -1);
        }, L.isDirectiveCandidate = function(e4) {
          return this.options.ecmaVersion >= 5 && "ExpressionStatement" === e4.type && "Literal" === e4.expression.type && "string" == typeof e4.expression.value && ('"' === this.input[e4.start] || "'" === this.input[e4.start]);
        };
        var j = acorn_Parser.prototype;
        j.toAssignable = function(e4, t4, i6) {
          if (this.options.ecmaVersion >= 6 && e4) switch (e4.type) {
            case "Identifier":
              this.inAsync && "await" === e4.name && this.raise(e4.start, "Cannot use 'await' as identifier inside an async function");
              break;
            case "ObjectPattern":
            case "ArrayPattern":
            case "AssignmentPattern":
            case "RestElement":
              break;
            case "ObjectExpression":
              e4.type = "ObjectPattern", i6 && this.checkPatternErrors(i6, true);
              for (var s3 = 0, r4 = e4.properties; s3 < r4.length; s3 += 1) {
                var n3 = r4[s3];
                this.toAssignable(n3, t4), "RestElement" !== n3.type || "ArrayPattern" !== n3.argument.type && "ObjectPattern" !== n3.argument.type || this.raise(n3.argument.start, "Unexpected token");
              }
              break;
            case "Property":
              "init" !== e4.kind && this.raise(e4.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e4.value, t4);
              break;
            case "ArrayExpression":
              e4.type = "ArrayPattern", i6 && this.checkPatternErrors(i6, true), this.toAssignableList(e4.elements, t4);
              break;
            case "SpreadElement":
              e4.type = "RestElement", this.toAssignable(e4.argument, t4), "AssignmentPattern" === e4.argument.type && this.raise(e4.argument.start, "Rest elements cannot have a default value");
              break;
            case "AssignmentExpression":
              "=" !== e4.operator && this.raise(e4.left.end, "Only '=' operator can be used for specifying default value."), e4.type = "AssignmentPattern", delete e4.operator, this.toAssignable(e4.left, t4);
              break;
            case "ParenthesizedExpression":
              this.toAssignable(e4.expression, t4, i6);
              break;
            case "ChainExpression":
              this.raiseRecoverable(e4.start, "Optional chaining cannot appear in left-hand side");
              break;
            case "MemberExpression":
              if (!t4) break;
            default:
              this.raise(e4.start, "Assigning to rvalue");
          }
          else i6 && this.checkPatternErrors(i6, true);
          return e4;
        }, j.toAssignableList = function(e4, t4) {
          for (var i6 = e4.length, s3 = 0; s3 < i6; s3++) {
            var r4 = e4[s3];
            r4 && this.toAssignable(r4, t4);
          }
          if (i6) {
            var n3 = e4[i6 - 1];
            6 === this.options.ecmaVersion && t4 && n3 && "RestElement" === n3.type && "Identifier" !== n3.argument.type && this.unexpected(n3.argument.start);
          }
          return e4;
        }, j.parseSpread = function(e4) {
          var t4 = this.startNode();
          return this.next(), t4.argument = this.parseMaybeAssign(false, e4), this.finishNode(t4, "SpreadElement");
        }, j.parseRestBinding = function() {
          var e4 = this.startNode();
          return this.next(), 6 === this.options.ecmaVersion && this.type !== f.name && this.unexpected(), e4.argument = this.parseBindingAtom(), this.finishNode(e4, "RestElement");
        }, j.parseBindingAtom = function() {
          if (this.options.ecmaVersion >= 6) switch (this.type) {
            case f.bracketL:
              var e4 = this.startNode();
              return this.next(), e4.elements = this.parseBindingList(f.bracketR, true, true), this.finishNode(e4, "ArrayPattern");
            case f.braceL:
              return this.parseObj(true);
          }
          return this.parseIdent();
        }, j.parseBindingList = function(e4, t4, i6, s3) {
          for (var r4 = [], n3 = true; !this.eat(e4); ) if (n3 ? n3 = false : this.expect(f.comma), t4 && this.type === f.comma) r4.push(null);
          else {
            if (i6 && this.afterTrailingComma(e4)) break;
            if (this.type === f.ellipsis) {
              var a4 = this.parseRestBinding();
              this.parseBindingListItem(a4), r4.push(a4), this.type === f.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.expect(e4);
              break;
            }
            r4.push(this.parseAssignableListItem(s3));
          }
          return r4;
        }, j.parseAssignableListItem = function(e4) {
          var t4 = this.parseMaybeDefault(this.start, this.startLoc);
          return this.parseBindingListItem(t4), t4;
        }, j.parseBindingListItem = function(e4) {
          return e4;
        }, j.parseMaybeDefault = function(e4, t4, i6) {
          if (i6 = i6 || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(f.eq)) return i6;
          var s3 = this.startNodeAt(e4, t4);
          return s3.left = i6, s3.right = this.parseMaybeAssign(), this.finishNode(s3, "AssignmentPattern");
        }, j.checkLValSimple = function(e4, t4, i6) {
          void 0 === t4 && (t4 = 0);
          var s3 = 0 !== t4;
          switch (e4.type) {
            case "Identifier":
              this.strict && this.reservedWordsStrictBind.test(e4.name) && this.raiseRecoverable(e4.start, (s3 ? "Binding " : "Assigning to ") + e4.name + " in strict mode"), s3 && (2 === t4 && "let" === e4.name && this.raiseRecoverable(e4.start, "let is disallowed as a lexically bound name"), i6 && (b(i6, e4.name) && this.raiseRecoverable(e4.start, "Argument name clash"), i6[e4.name] = true), 5 !== t4 && this.declareName(e4.name, t4, e4.start));
              break;
            case "ChainExpression":
              this.raiseRecoverable(e4.start, "Optional chaining cannot appear in left-hand side");
              break;
            case "MemberExpression":
              s3 && this.raiseRecoverable(e4.start, "Binding member expression");
              break;
            case "ParenthesizedExpression":
              return s3 && this.raiseRecoverable(e4.start, "Binding parenthesized expression"), this.checkLValSimple(e4.expression, t4, i6);
            default:
              this.raise(e4.start, (s3 ? "Binding" : "Assigning to") + " rvalue");
          }
        }, j.checkLValPattern = function(e4, t4, i6) {
          switch (void 0 === t4 && (t4 = 0), e4.type) {
            case "ObjectPattern":
              for (var s3 = 0, r4 = e4.properties; s3 < r4.length; s3 += 1) {
                var n3 = r4[s3];
                this.checkLValInnerPattern(n3, t4, i6);
              }
              break;
            case "ArrayPattern":
              for (var a4 = 0, o2 = e4.elements; a4 < o2.length; a4 += 1) {
                var h2 = o2[a4];
                h2 && this.checkLValInnerPattern(h2, t4, i6);
              }
              break;
            default:
              this.checkLValSimple(e4, t4, i6);
          }
        }, j.checkLValInnerPattern = function(e4, t4, i6) {
          switch (void 0 === t4 && (t4 = 0), e4.type) {
            case "Property":
              this.checkLValInnerPattern(e4.value, t4, i6);
              break;
            case "AssignmentPattern":
              this.checkLValPattern(e4.left, t4, i6);
              break;
            case "RestElement":
              this.checkLValPattern(e4.argument, t4, i6);
              break;
            default:
              this.checkLValPattern(e4, t4, i6);
          }
        };
        var acorn_TokContext = /* @__PURE__ */ __name(function(e4, t4, i6, s3, r4) {
          this.token = e4, this.isExpr = !!t4, this.preserveSpace = !!i6, this.override = s3, this.generator = !!r4;
        }, "acorn_TokContext"), F = { b_stat: new acorn_TokContext("{", false), b_expr: new acorn_TokContext("{", true), b_tmpl: new acorn_TokContext("${", false), p_stat: new acorn_TokContext("(", false), p_expr: new acorn_TokContext("(", true), q_tmpl: new acorn_TokContext("`", true, true, function(e4) {
          return e4.tryReadTemplateToken();
        }), f_stat: new acorn_TokContext("function", false), f_expr: new acorn_TokContext("function", true), f_expr_gen: new acorn_TokContext("function", true, false, null, true), f_gen: new acorn_TokContext("function", false, false, null, true) }, B = acorn_Parser.prototype;
        B.initialContext = function() {
          return [F.b_stat];
        }, B.curContext = function() {
          return this.context[this.context.length - 1];
        }, B.braceIsBlock = function(e4) {
          var t4 = this.curContext();
          return t4 === F.f_expr || t4 === F.f_stat || (e4 !== f.colon || t4 !== F.b_stat && t4 !== F.b_expr ? e4 === f._return || e4 === f.name && this.exprAllowed ? m.test(this.input.slice(this.lastTokEnd, this.start)) : e4 === f._else || e4 === f.semi || e4 === f.eof || e4 === f.parenR || e4 === f.arrow || (e4 === f.braceL ? t4 === F.b_stat : e4 !== f._var && e4 !== f._const && e4 !== f.name && !this.exprAllowed) : !t4.isExpr);
        }, B.inGeneratorContext = function() {
          for (var e4 = this.context.length - 1; e4 >= 1; e4--) {
            var t4 = this.context[e4];
            if ("function" === t4.token) return t4.generator;
          }
          return false;
        }, B.updateContext = function(e4) {
          var t4, i6 = this.type;
          i6.keyword && e4 === f.dot ? this.exprAllowed = false : (t4 = i6.updateContext) ? t4.call(this, e4) : this.exprAllowed = i6.beforeExpr;
        }, B.overrideContext = function(e4) {
          this.curContext() !== e4 && (this.context[this.context.length - 1] = e4);
        }, f.parenR.updateContext = f.braceR.updateContext = function() {
          if (1 !== this.context.length) {
            var e4 = this.context.pop();
            e4 === F.b_stat && "function" === this.curContext().token && (e4 = this.context.pop()), this.exprAllowed = !e4.isExpr;
          } else this.exprAllowed = true;
        }, f.braceL.updateContext = function(e4) {
          this.context.push(this.braceIsBlock(e4) ? F.b_stat : F.b_expr), this.exprAllowed = true;
        }, f.dollarBraceL.updateContext = function() {
          this.context.push(F.b_tmpl), this.exprAllowed = true;
        }, f.parenL.updateContext = function(e4) {
          var t4 = e4 === f._if || e4 === f._for || e4 === f._with || e4 === f._while;
          this.context.push(t4 ? F.p_stat : F.p_expr), this.exprAllowed = true;
        }, f.incDec.updateContext = function() {
        }, f._function.updateContext = f._class.updateContext = function(e4) {
          !e4.beforeExpr || e4 === f._else || e4 === f.semi && this.curContext() !== F.p_stat || e4 === f._return && m.test(this.input.slice(this.lastTokEnd, this.start)) || (e4 === f.colon || e4 === f.braceL) && this.curContext() === F.b_stat ? this.context.push(F.f_stat) : this.context.push(F.f_expr), this.exprAllowed = false;
        }, f.colon.updateContext = function() {
          "function" === this.curContext().token && this.context.pop(), this.exprAllowed = true;
        }, f.backQuote.updateContext = function() {
          this.curContext() === F.q_tmpl ? this.context.pop() : this.context.push(F.q_tmpl), this.exprAllowed = false;
        }, f.star.updateContext = function(e4) {
          if (e4 === f._function) {
            var t4 = this.context.length - 1;
            this.context[t4] === F.f_expr ? this.context[t4] = F.f_expr_gen : this.context[t4] = F.f_gen;
          }
          this.exprAllowed = true;
        }, f.name.updateContext = function(e4) {
          var t4 = false;
          this.options.ecmaVersion >= 6 && e4 !== f.dot && ("of" === this.value && !this.exprAllowed || "yield" === this.value && this.inGeneratorContext()) && (t4 = true), this.exprAllowed = t4;
        };
        var $ = acorn_Parser.prototype;
        function isLocalVariableAccess(e4) {
          return "Identifier" === e4.type || "ParenthesizedExpression" === e4.type && isLocalVariableAccess(e4.expression);
        }
        __name(isLocalVariableAccess, "isLocalVariableAccess");
        function isPrivateFieldAccess(e4) {
          return "MemberExpression" === e4.type && "PrivateIdentifier" === e4.property.type || "ChainExpression" === e4.type && isPrivateFieldAccess(e4.expression) || "ParenthesizedExpression" === e4.type && isPrivateFieldAccess(e4.expression);
        }
        __name(isPrivateFieldAccess, "isPrivateFieldAccess");
        $.checkPropClash = function(e4, t4, i6) {
          if (!(this.options.ecmaVersion >= 9 && "SpreadElement" === e4.type || this.options.ecmaVersion >= 6 && (e4.computed || e4.method || e4.shorthand))) {
            var s3, r4 = e4.key;
            switch (r4.type) {
              case "Identifier":
                s3 = r4.name;
                break;
              case "Literal":
                s3 = String(r4.value);
                break;
              default:
                return;
            }
            var n3 = e4.kind;
            if (this.options.ecmaVersion >= 6) "__proto__" === s3 && "init" === n3 && (t4.proto && (i6 ? i6.doubleProto < 0 && (i6.doubleProto = r4.start) : this.raiseRecoverable(r4.start, "Redefinition of __proto__ property")), t4.proto = true);
            else {
              var a4 = t4[s3 = "$" + s3];
              if (a4) ("init" === n3 ? this.strict && a4.init || a4.get || a4.set : a4.init || a4[n3]) && this.raiseRecoverable(r4.start, "Redefinition of property");
              else a4 = t4[s3] = { init: false, get: false, set: false };
              a4[n3] = true;
            }
          }
        }, $.parseExpression = function(e4, t4) {
          var i6 = this.start, s3 = this.startLoc, r4 = this.parseMaybeAssign(e4, t4);
          if (this.type === f.comma) {
            var n3 = this.startNodeAt(i6, s3);
            for (n3.expressions = [r4]; this.eat(f.comma); ) n3.expressions.push(this.parseMaybeAssign(e4, t4));
            return this.finishNode(n3, "SequenceExpression");
          }
          return r4;
        }, $.parseMaybeAssign = function(e4, t4, i6) {
          if (this.isContextual("yield")) {
            if (this.inGenerator) return this.parseYield(e4);
            this.exprAllowed = false;
          }
          var s3 = false, r4 = -1, n3 = -1, a4 = -1;
          t4 ? (r4 = t4.parenthesizedAssign, n3 = t4.trailingComma, a4 = t4.doubleProto, t4.parenthesizedAssign = t4.trailingComma = -1) : (t4 = new acorn_DestructuringErrors(), s3 = true);
          var o2 = this.start, h2 = this.startLoc;
          this.type !== f.parenL && this.type !== f.name || (this.potentialArrowAt = this.start, this.potentialArrowInForAwait = "await" === e4);
          var c3 = this.parseMaybeConditional(e4, t4);
          if (i6 && (c3 = i6.call(this, c3, o2, h2)), this.type.isAssign) {
            var p2 = this.startNodeAt(o2, h2);
            return p2.operator = this.value, this.type === f.eq && (c3 = this.toAssignable(c3, false, t4)), s3 || (t4.parenthesizedAssign = t4.trailingComma = t4.doubleProto = -1), t4.shorthandAssign >= c3.start && (t4.shorthandAssign = -1), this.type === f.eq ? this.checkLValPattern(c3) : this.checkLValSimple(c3), p2.left = c3, this.next(), p2.right = this.parseMaybeAssign(e4), a4 > -1 && (t4.doubleProto = a4), this.finishNode(p2, "AssignmentExpression");
          }
          return s3 && this.checkExpressionErrors(t4, true), r4 > -1 && (t4.parenthesizedAssign = r4), n3 > -1 && (t4.trailingComma = n3), c3;
        }, $.parseMaybeConditional = function(e4, t4) {
          var i6 = this.start, s3 = this.startLoc, r4 = this.parseExprOps(e4, t4);
          if (this.checkExpressionErrors(t4)) return r4;
          if (this.eat(f.question)) {
            var n3 = this.startNodeAt(i6, s3);
            return n3.test = r4, n3.consequent = this.parseMaybeAssign(), this.expect(f.colon), n3.alternate = this.parseMaybeAssign(e4), this.finishNode(n3, "ConditionalExpression");
          }
          return r4;
        }, $.parseExprOps = function(e4, t4) {
          var i6 = this.start, s3 = this.startLoc, r4 = this.parseMaybeUnary(t4, false, false, e4);
          return this.checkExpressionErrors(t4) || r4.start === i6 && "ArrowFunctionExpression" === r4.type ? r4 : this.parseExprOp(r4, i6, s3, -1, e4);
        }, $.parseExprOp = function(e4, t4, i6, s3, r4) {
          var n3 = this.type.binop;
          if (null != n3 && (!r4 || this.type !== f._in) && n3 > s3) {
            var a4 = this.type === f.logicalOR || this.type === f.logicalAND, o2 = this.type === f.coalesce;
            o2 && (n3 = f.logicalAND.binop);
            var h2 = this.value;
            this.next();
            var c3 = this.start, p2 = this.startLoc, l2 = this.parseExprOp(this.parseMaybeUnary(null, false, false, r4), c3, p2, n3, r4), u2 = this.buildBinary(t4, i6, e4, l2, h2, a4 || o2);
            return (a4 && this.type === f.coalesce || o2 && (this.type === f.logicalOR || this.type === f.logicalAND)) && this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses"), this.parseExprOp(u2, t4, i6, s3, r4);
          }
          return e4;
        }, $.buildBinary = function(e4, t4, i6, s3, r4, n3) {
          "PrivateIdentifier" === s3.type && this.raise(s3.start, "Private identifier can only be left side of binary expression");
          var a4 = this.startNodeAt(e4, t4);
          return a4.left = i6, a4.operator = r4, a4.right = s3, this.finishNode(a4, n3 ? "LogicalExpression" : "BinaryExpression");
        }, $.parseMaybeUnary = function(e4, t4, i6, s3) {
          var r4, n3 = this.start, a4 = this.startLoc;
          if (this.isContextual("await") && this.canAwait) r4 = this.parseAwait(s3), t4 = true;
          else if (this.type.prefix) {
            var o2 = this.startNode(), h2 = this.type === f.incDec;
            o2.operator = this.value, o2.prefix = true, this.next(), o2.argument = this.parseMaybeUnary(null, true, h2, s3), this.checkExpressionErrors(e4, true), h2 ? this.checkLValSimple(o2.argument) : this.strict && "delete" === o2.operator && isLocalVariableAccess(o2.argument) ? this.raiseRecoverable(o2.start, "Deleting local variable in strict mode") : "delete" === o2.operator && isPrivateFieldAccess(o2.argument) ? this.raiseRecoverable(o2.start, "Private fields can not be deleted") : t4 = true, r4 = this.finishNode(o2, h2 ? "UpdateExpression" : "UnaryExpression");
          } else if (t4 || this.type !== f.privateId) {
            if (r4 = this.parseExprSubscripts(e4, s3), this.checkExpressionErrors(e4)) return r4;
            for (; this.type.postfix && !this.canInsertSemicolon(); ) {
              var c3 = this.startNodeAt(n3, a4);
              c3.operator = this.value, c3.prefix = false, c3.argument = r4, this.checkLValSimple(r4), this.next(), r4 = this.finishNode(c3, "UpdateExpression");
            }
          } else (s3 || 0 === this.privateNameStack.length) && this.options.checkPrivateFields && this.unexpected(), r4 = this.parsePrivateIdent(), this.type !== f._in && this.unexpected();
          return i6 || !this.eat(f.starstar) ? r4 : t4 ? void this.unexpected(this.lastTokStart) : this.buildBinary(n3, a4, r4, this.parseMaybeUnary(null, false, false, s3), "**", false);
        }, $.parseExprSubscripts = function(e4, t4) {
          var i6 = this.start, s3 = this.startLoc, r4 = this.parseExprAtom(e4, t4);
          if ("ArrowFunctionExpression" === r4.type && ")" !== this.input.slice(this.lastTokStart, this.lastTokEnd)) return r4;
          var n3 = this.parseSubscripts(r4, i6, s3, false, t4);
          return e4 && "MemberExpression" === n3.type && (e4.parenthesizedAssign >= n3.start && (e4.parenthesizedAssign = -1), e4.parenthesizedBind >= n3.start && (e4.parenthesizedBind = -1), e4.trailingComma >= n3.start && (e4.trailingComma = -1)), n3;
        }, $.parseSubscripts = function(e4, t4, i6, s3, r4) {
          for (var n3 = this.options.ecmaVersion >= 8 && "Identifier" === e4.type && "async" === e4.name && this.lastTokEnd === e4.end && !this.canInsertSemicolon() && e4.end - e4.start === 5 && this.potentialArrowAt === e4.start, a4 = false; ; ) {
            var o2 = this.parseSubscript(e4, t4, i6, s3, n3, a4, r4);
            if (o2.optional && (a4 = true), o2 === e4 || "ArrowFunctionExpression" === o2.type) {
              if (a4) {
                var h2 = this.startNodeAt(t4, i6);
                h2.expression = o2, o2 = this.finishNode(h2, "ChainExpression");
              }
              return o2;
            }
            e4 = o2;
          }
        }, $.shouldParseAsyncArrow = function() {
          return !this.canInsertSemicolon() && this.eat(f.arrow);
        }, $.parseSubscriptAsyncArrow = function(e4, t4, i6, s3) {
          return this.parseArrowExpression(this.startNodeAt(e4, t4), i6, true, s3);
        }, $.parseSubscript = function(e4, t4, i6, s3, r4, n3, a4) {
          var o2 = this.options.ecmaVersion >= 11, h2 = o2 && this.eat(f.questionDot);
          s3 && h2 && this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
          var c3 = this.eat(f.bracketL);
          if (c3 || h2 && this.type !== f.parenL && this.type !== f.backQuote || this.eat(f.dot)) {
            var p2 = this.startNodeAt(t4, i6);
            p2.object = e4, c3 ? (p2.property = this.parseExpression(), this.expect(f.bracketR)) : this.type === f.privateId && "Super" !== e4.type ? p2.property = this.parsePrivateIdent() : p2.property = this.parseIdent("never" !== this.options.allowReserved), p2.computed = !!c3, o2 && (p2.optional = h2), e4 = this.finishNode(p2, "MemberExpression");
          } else if (!s3 && this.eat(f.parenL)) {
            var l2 = new acorn_DestructuringErrors(), u2 = this.yieldPos, d2 = this.awaitPos, m2 = this.awaitIdentPos;
            this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
            var g2 = this.parseExprList(f.parenR, this.options.ecmaVersion >= 8, false, l2);
            if (r4 && !h2 && this.shouldParseAsyncArrow()) return this.checkPatternErrors(l2, false), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = u2, this.awaitPos = d2, this.awaitIdentPos = m2, this.parseSubscriptAsyncArrow(t4, i6, g2, a4);
            this.checkExpressionErrors(l2, true), this.yieldPos = u2 || this.yieldPos, this.awaitPos = d2 || this.awaitPos, this.awaitIdentPos = m2 || this.awaitIdentPos;
            var x2 = this.startNodeAt(t4, i6);
            x2.callee = e4, x2.arguments = g2, o2 && (x2.optional = h2), e4 = this.finishNode(x2, "CallExpression");
          } else if (this.type === f.backQuote) {
            (h2 || n3) && this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
            var v2 = this.startNodeAt(t4, i6);
            v2.tag = e4, v2.quasi = this.parseTemplate({ isTagged: true }), e4 = this.finishNode(v2, "TaggedTemplateExpression");
          }
          return e4;
        }, $.parseExprAtom = function(e4, t4, i6) {
          this.type === f.slash && this.readRegexp();
          var s3, r4 = this.potentialArrowAt === this.start;
          switch (this.type) {
            case f._super:
              return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), s3 = this.startNode(), this.next(), this.type !== f.parenL || this.allowDirectSuper || this.raise(s3.start, "super() call outside constructor of a subclass"), this.type !== f.dot && this.type !== f.bracketL && this.type !== f.parenL && this.unexpected(), this.finishNode(s3, "Super");
            case f._this:
              return s3 = this.startNode(), this.next(), this.finishNode(s3, "ThisExpression");
            case f.name:
              var n3 = this.start, a4 = this.startLoc, o2 = this.containsEsc, h2 = this.parseIdent(false);
              if (this.options.ecmaVersion >= 8 && !o2 && "async" === h2.name && !this.canInsertSemicolon() && this.eat(f._function)) return this.overrideContext(F.f_expr), this.parseFunction(this.startNodeAt(n3, a4), 0, false, true, t4);
              if (r4 && !this.canInsertSemicolon()) {
                if (this.eat(f.arrow)) return this.parseArrowExpression(this.startNodeAt(n3, a4), [h2], false, t4);
                if (this.options.ecmaVersion >= 8 && "async" === h2.name && this.type === f.name && !o2 && (!this.potentialArrowInForAwait || "of" !== this.value || this.containsEsc)) return h2 = this.parseIdent(false), !this.canInsertSemicolon() && this.eat(f.arrow) || this.unexpected(), this.parseArrowExpression(this.startNodeAt(n3, a4), [h2], true, t4);
              }
              return h2;
            case f.regexp:
              var c3 = this.value;
              return (s3 = this.parseLiteral(c3.value)).regex = { pattern: c3.pattern, flags: c3.flags }, s3;
            case f.num:
            case f.string:
              return this.parseLiteral(this.value);
            case f._null:
            case f._true:
            case f._false:
              return (s3 = this.startNode()).value = this.type === f._null ? null : this.type === f._true, s3.raw = this.type.keyword, this.next(), this.finishNode(s3, "Literal");
            case f.parenL:
              var p2 = this.start, l2 = this.parseParenAndDistinguishExpression(r4, t4);
              return e4 && (e4.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(l2) && (e4.parenthesizedAssign = p2), e4.parenthesizedBind < 0 && (e4.parenthesizedBind = p2)), l2;
            case f.bracketL:
              return s3 = this.startNode(), this.next(), s3.elements = this.parseExprList(f.bracketR, true, true, e4), this.finishNode(s3, "ArrayExpression");
            case f.braceL:
              return this.overrideContext(F.b_expr), this.parseObj(false, e4);
            case f._function:
              return s3 = this.startNode(), this.next(), this.parseFunction(s3, 0);
            case f._class:
              return this.parseClass(this.startNode(), false);
            case f._new:
              return this.parseNew();
            case f.backQuote:
              return this.parseTemplate();
            case f._import:
              return this.options.ecmaVersion >= 11 ? this.parseExprImport(i6) : this.unexpected();
            default:
              return this.parseExprAtomDefault();
          }
        }, $.parseExprAtomDefault = function() {
          this.unexpected();
        }, $.parseExprImport = function(e4) {
          var t4 = this.startNode();
          if (this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword import"), this.next(), this.type === f.parenL && !e4) return this.parseDynamicImport(t4);
          if (this.type === f.dot) {
            var i6 = this.startNodeAt(t4.start, t4.loc && t4.loc.start);
            return i6.name = "import", t4.meta = this.finishNode(i6, "Identifier"), this.parseImportMeta(t4);
          }
          this.unexpected();
        }, $.parseDynamicImport = function(e4) {
          if (this.next(), e4.source = this.parseMaybeAssign(), this.options.ecmaVersion >= 16) this.eat(f.parenR) ? e4.options = null : (this.expect(f.comma), this.afterTrailingComma(f.parenR) ? e4.options = null : (e4.options = this.parseMaybeAssign(), this.eat(f.parenR) || (this.expect(f.comma), this.afterTrailingComma(f.parenR) || this.unexpected())));
          else if (!this.eat(f.parenR)) {
            var t4 = this.start;
            this.eat(f.comma) && this.eat(f.parenR) ? this.raiseRecoverable(t4, "Trailing comma is not allowed in import()") : this.unexpected(t4);
          }
          return this.finishNode(e4, "ImportExpression");
        }, $.parseImportMeta = function(e4) {
          this.next();
          var t4 = this.containsEsc;
          return e4.property = this.parseIdent(true), "meta" !== e4.property.name && this.raiseRecoverable(e4.property.start, "The only valid meta property for import is 'import.meta'"), t4 && this.raiseRecoverable(e4.start, "'import.meta' must not contain escaped characters"), "module" === this.options.sourceType || this.options.allowImportExportEverywhere || this.raiseRecoverable(e4.start, "Cannot use 'import.meta' outside a module"), this.finishNode(e4, "MetaProperty");
        }, $.parseLiteral = function(e4) {
          var t4 = this.startNode();
          return t4.value = e4, t4.raw = this.input.slice(this.start, this.end), 110 === t4.raw.charCodeAt(t4.raw.length - 1) && (t4.bigint = null != t4.value ? t4.value.toString() : t4.raw.slice(0, -1).replace(/_/g, "")), this.next(), this.finishNode(t4, "Literal");
        }, $.parseParenExpression = function() {
          this.expect(f.parenL);
          var e4 = this.parseExpression();
          return this.expect(f.parenR), e4;
        }, $.shouldParseArrow = function(e4) {
          return !this.canInsertSemicolon();
        }, $.parseParenAndDistinguishExpression = function(e4, t4) {
          var i6, s3 = this.start, r4 = this.startLoc, n3 = this.options.ecmaVersion >= 8;
          if (this.options.ecmaVersion >= 6) {
            this.next();
            var a4, o2 = this.start, h2 = this.startLoc, c3 = [], p2 = true, l2 = false, u2 = new acorn_DestructuringErrors(), d2 = this.yieldPos, m2 = this.awaitPos;
            for (this.yieldPos = 0, this.awaitPos = 0; this.type !== f.parenR; ) {
              if (p2 ? p2 = false : this.expect(f.comma), n3 && this.afterTrailingComma(f.parenR, true)) {
                l2 = true;
                break;
              }
              if (this.type === f.ellipsis) {
                a4 = this.start, c3.push(this.parseParenItem(this.parseRestBinding())), this.type === f.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
                break;
              }
              c3.push(this.parseMaybeAssign(false, u2, this.parseParenItem));
            }
            var g2 = this.lastTokEnd, x2 = this.lastTokEndLoc;
            if (this.expect(f.parenR), e4 && this.shouldParseArrow(c3) && this.eat(f.arrow)) return this.checkPatternErrors(u2, false), this.checkYieldAwaitInDefaultParams(), this.yieldPos = d2, this.awaitPos = m2, this.parseParenArrowList(s3, r4, c3, t4);
            c3.length && !l2 || this.unexpected(this.lastTokStart), a4 && this.unexpected(a4), this.checkExpressionErrors(u2, true), this.yieldPos = d2 || this.yieldPos, this.awaitPos = m2 || this.awaitPos, c3.length > 1 ? ((i6 = this.startNodeAt(o2, h2)).expressions = c3, this.finishNodeAt(i6, "SequenceExpression", g2, x2)) : i6 = c3[0];
          } else i6 = this.parseParenExpression();
          if (this.options.preserveParens) {
            var v2 = this.startNodeAt(s3, r4);
            return v2.expression = i6, this.finishNode(v2, "ParenthesizedExpression");
          }
          return i6;
        }, $.parseParenItem = function(e4) {
          return e4;
        }, $.parseParenArrowList = function(e4, t4, i6, s3) {
          return this.parseArrowExpression(this.startNodeAt(e4, t4), i6, false, s3);
        };
        var q = [];
        $.parseNew = function() {
          this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
          var e4 = this.startNode();
          if (this.next(), this.options.ecmaVersion >= 6 && this.type === f.dot) {
            var t4 = this.startNodeAt(e4.start, e4.loc && e4.loc.start);
            t4.name = "new", e4.meta = this.finishNode(t4, "Identifier"), this.next();
            var i6 = this.containsEsc;
            return e4.property = this.parseIdent(true), "target" !== e4.property.name && this.raiseRecoverable(e4.property.start, "The only valid meta property for new is 'new.target'"), i6 && this.raiseRecoverable(e4.start, "'new.target' must not contain escaped characters"), this.allowNewDotTarget || this.raiseRecoverable(e4.start, "'new.target' can only be used in functions and class static block"), this.finishNode(e4, "MetaProperty");
          }
          var s3 = this.start, r4 = this.startLoc;
          return e4.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), s3, r4, true, false), this.eat(f.parenL) ? e4.arguments = this.parseExprList(f.parenR, this.options.ecmaVersion >= 8, false) : e4.arguments = q, this.finishNode(e4, "NewExpression");
        }, $.parseTemplateElement = function(e4) {
          var t4 = e4.isTagged, i6 = this.startNode();
          return this.type === f.invalidTemplate ? (t4 || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), i6.value = { raw: this.value.replace(/\r\n?/g, "\n"), cooked: null }) : i6.value = { raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"), cooked: this.value }, this.next(), i6.tail = this.type === f.backQuote, this.finishNode(i6, "TemplateElement");
        }, $.parseTemplate = function(e4) {
          void 0 === e4 && (e4 = {});
          var t4 = e4.isTagged;
          void 0 === t4 && (t4 = false);
          var i6 = this.startNode();
          this.next(), i6.expressions = [];
          var s3 = this.parseTemplateElement({ isTagged: t4 });
          for (i6.quasis = [s3]; !s3.tail; ) this.type === f.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(f.dollarBraceL), i6.expressions.push(this.parseExpression()), this.expect(f.braceR), i6.quasis.push(s3 = this.parseTemplateElement({ isTagged: t4 }));
          return this.next(), this.finishNode(i6, "TemplateLiteral");
        }, $.isAsyncProp = function(e4) {
          return !e4.computed && "Identifier" === e4.key.type && "async" === e4.key.name && (this.type === f.name || this.type === f.num || this.type === f.string || this.type === f.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === f.star) && !m.test(this.input.slice(this.lastTokEnd, this.start));
        }, $.parseObj = function(e4, t4) {
          var i6 = this.startNode(), s3 = true, r4 = {};
          for (i6.properties = [], this.next(); !this.eat(f.braceR); ) {
            if (s3) s3 = false;
            else if (this.expect(f.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(f.braceR)) break;
            var n3 = this.parseProperty(e4, t4);
            e4 || this.checkPropClash(n3, r4, t4), i6.properties.push(n3);
          }
          return this.finishNode(i6, e4 ? "ObjectPattern" : "ObjectExpression");
        }, $.parseProperty = function(e4, t4) {
          var i6, s3, r4, n3, a4 = this.startNode();
          if (this.options.ecmaVersion >= 9 && this.eat(f.ellipsis)) return e4 ? (a4.argument = this.parseIdent(false), this.type === f.comma && this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"), this.finishNode(a4, "RestElement")) : (a4.argument = this.parseMaybeAssign(false, t4), this.type === f.comma && t4 && t4.trailingComma < 0 && (t4.trailingComma = this.start), this.finishNode(a4, "SpreadElement"));
          this.options.ecmaVersion >= 6 && (a4.method = false, a4.shorthand = false, (e4 || t4) && (r4 = this.start, n3 = this.startLoc), e4 || (i6 = this.eat(f.star)));
          var o2 = this.containsEsc;
          return this.parsePropertyName(a4), !e4 && !o2 && this.options.ecmaVersion >= 8 && !i6 && this.isAsyncProp(a4) ? (s3 = true, i6 = this.options.ecmaVersion >= 9 && this.eat(f.star), this.parsePropertyName(a4)) : s3 = false, this.parsePropertyValue(a4, e4, i6, s3, r4, n3, t4, o2), this.finishNode(a4, "Property");
        }, $.parseGetterSetter = function(e4) {
          var t4 = e4.key.name;
          this.parsePropertyName(e4), e4.value = this.parseMethod(false), e4.kind = t4;
          var i6 = "get" === e4.kind ? 0 : 1;
          if (e4.value.params.length !== i6) {
            var s3 = e4.value.start;
            "get" === e4.kind ? this.raiseRecoverable(s3, "getter should have no params") : this.raiseRecoverable(s3, "setter should have exactly one param");
          } else "set" === e4.kind && "RestElement" === e4.value.params[0].type && this.raiseRecoverable(e4.value.params[0].start, "Setter cannot use rest params");
        }, $.parsePropertyValue = function(e4, t4, i6, s3, r4, n3, a4, o2) {
          (i6 || s3) && this.type === f.colon && this.unexpected(), this.eat(f.colon) ? (e4.value = t4 ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, a4), e4.kind = "init") : this.options.ecmaVersion >= 6 && this.type === f.parenL ? (t4 && this.unexpected(), e4.method = true, e4.value = this.parseMethod(i6, s3), e4.kind = "init") : t4 || o2 || !(this.options.ecmaVersion >= 5) || e4.computed || "Identifier" !== e4.key.type || "get" !== e4.key.name && "set" !== e4.key.name || this.type === f.comma || this.type === f.braceR || this.type === f.eq ? this.options.ecmaVersion >= 6 && !e4.computed && "Identifier" === e4.key.type ? ((i6 || s3) && this.unexpected(), this.checkUnreserved(e4.key), "await" !== e4.key.name || this.awaitIdentPos || (this.awaitIdentPos = r4), t4 ? e4.value = this.parseMaybeDefault(r4, n3, this.copyNode(e4.key)) : this.type === f.eq && a4 ? (a4.shorthandAssign < 0 && (a4.shorthandAssign = this.start), e4.value = this.parseMaybeDefault(r4, n3, this.copyNode(e4.key))) : e4.value = this.copyNode(e4.key), e4.kind = "init", e4.shorthand = true) : this.unexpected() : ((i6 || s3) && this.unexpected(), this.parseGetterSetter(e4));
        }, $.parsePropertyName = function(e4) {
          if (this.options.ecmaVersion >= 6) {
            if (this.eat(f.bracketL)) return e4.computed = true, e4.key = this.parseMaybeAssign(), this.expect(f.bracketR), e4.key;
            e4.computed = false;
          }
          return e4.key = this.type === f.num || this.type === f.string ? this.parseExprAtom() : this.parseIdent("never" !== this.options.allowReserved);
        }, $.initFunction = function(e4) {
          e4.id = null, this.options.ecmaVersion >= 6 && (e4.generator = e4.expression = false), this.options.ecmaVersion >= 8 && (e4.async = false);
        }, $.parseMethod = function(e4, t4, i6) {
          var s3 = this.startNode(), r4 = this.yieldPos, n3 = this.awaitPos, a4 = this.awaitIdentPos;
          return this.initFunction(s3), this.options.ecmaVersion >= 6 && (s3.generator = e4), this.options.ecmaVersion >= 8 && (s3.async = !!t4), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(64 | functionFlags(t4, s3.generator) | (i6 ? 128 : 0)), this.expect(f.parenL), s3.params = this.parseBindingList(f.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(s3, false, true, false), this.yieldPos = r4, this.awaitPos = n3, this.awaitIdentPos = a4, this.finishNode(s3, "FunctionExpression");
        }, $.parseArrowExpression = function(e4, t4, i6, s3) {
          var r4 = this.yieldPos, n3 = this.awaitPos, a4 = this.awaitIdentPos;
          return this.enterScope(16 | functionFlags(i6, false)), this.initFunction(e4), this.options.ecmaVersion >= 8 && (e4.async = !!i6), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e4.params = this.toAssignableList(t4, true), this.parseFunctionBody(e4, true, false, s3), this.yieldPos = r4, this.awaitPos = n3, this.awaitIdentPos = a4, this.finishNode(e4, "ArrowFunctionExpression");
        }, $.parseFunctionBody = function(e4, t4, i6, s3) {
          var r4 = t4 && this.type !== f.braceL, n3 = this.strict, a4 = false;
          if (r4) e4.body = this.parseMaybeAssign(s3), e4.expression = true, this.checkParams(e4, false);
          else {
            var o2 = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e4.params);
            n3 && !o2 || (a4 = this.strictDirective(this.end)) && o2 && this.raiseRecoverable(e4.start, "Illegal 'use strict' directive in function with non-simple parameter list");
            var h2 = this.labels;
            this.labels = [], a4 && (this.strict = true), this.checkParams(e4, !n3 && !a4 && !t4 && !i6 && this.isSimpleParamList(e4.params)), this.strict && e4.id && this.checkLValSimple(e4.id, 5), e4.body = this.parseBlock(false, void 0, a4 && !n3), e4.expression = false, this.adaptDirectivePrologue(e4.body.body), this.labels = h2;
          }
          this.exitScope();
        }, $.isSimpleParamList = function(e4) {
          for (var t4 = 0, i6 = e4; t4 < i6.length; t4 += 1) {
            if ("Identifier" !== i6[t4].type) return false;
          }
          return true;
        }, $.checkParams = function(e4, t4) {
          for (var i6 = /* @__PURE__ */ Object.create(null), s3 = 0, r4 = e4.params; s3 < r4.length; s3 += 1) {
            var n3 = r4[s3];
            this.checkLValInnerPattern(n3, 1, t4 ? null : i6);
          }
        }, $.parseExprList = function(e4, t4, i6, s3) {
          for (var r4 = [], n3 = true; !this.eat(e4); ) {
            if (n3) n3 = false;
            else if (this.expect(f.comma), t4 && this.afterTrailingComma(e4)) break;
            var a4 = void 0;
            i6 && this.type === f.comma ? a4 = null : this.type === f.ellipsis ? (a4 = this.parseSpread(s3), s3 && this.type === f.comma && s3.trailingComma < 0 && (s3.trailingComma = this.start)) : a4 = this.parseMaybeAssign(false, s3), r4.push(a4);
          }
          return r4;
        }, $.checkUnreserved = function(e4) {
          var t4 = e4.start, i6 = e4.end, s3 = e4.name;
          (this.inGenerator && "yield" === s3 && this.raiseRecoverable(t4, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && "await" === s3 && this.raiseRecoverable(t4, "Cannot use 'await' as identifier inside an async function"), this.currentThisScope().flags & P || "arguments" !== s3 || this.raiseRecoverable(t4, "Cannot use 'arguments' in class field initializer"), !this.inClassStaticBlock || "arguments" !== s3 && "await" !== s3 || this.raise(t4, "Cannot use " + s3 + " in class static initialization block"), this.keywords.test(s3) && this.raise(t4, "Unexpected keyword '" + s3 + "'"), this.options.ecmaVersion < 6 && -1 !== this.input.slice(t4, i6).indexOf("\\")) || (this.strict ? this.reservedWordsStrict : this.reservedWords).test(s3) && (this.inAsync || "await" !== s3 || this.raiseRecoverable(t4, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(t4, "The keyword '" + s3 + "' is reserved"));
        }, $.parseIdent = function(e4) {
          var t4 = this.parseIdentNode();
          return this.next(!!e4), this.finishNode(t4, "Identifier"), e4 || (this.checkUnreserved(t4), "await" !== t4.name || this.awaitIdentPos || (this.awaitIdentPos = t4.start)), t4;
        }, $.parseIdentNode = function() {
          var e4 = this.startNode();
          return this.type === f.name ? e4.name = this.value : this.type.keyword ? (e4.name = this.type.keyword, "class" !== e4.name && "function" !== e4.name || this.lastTokEnd === this.lastTokStart + 1 && 46 === this.input.charCodeAt(this.lastTokStart) || this.context.pop(), this.type = f.name) : this.unexpected(), e4;
        }, $.parsePrivateIdent = function() {
          var e4 = this.startNode();
          return this.type === f.privateId ? e4.name = this.value : this.unexpected(), this.next(), this.finishNode(e4, "PrivateIdentifier"), this.options.checkPrivateFields && (0 === this.privateNameStack.length ? this.raise(e4.start, "Private field '#" + e4.name + "' must be declared in an enclosing class") : this.privateNameStack[this.privateNameStack.length - 1].used.push(e4)), e4;
        }, $.parseYield = function(e4) {
          this.yieldPos || (this.yieldPos = this.start);
          var t4 = this.startNode();
          return this.next(), this.type === f.semi || this.canInsertSemicolon() || this.type !== f.star && !this.type.startsExpr ? (t4.delegate = false, t4.argument = null) : (t4.delegate = this.eat(f.star), t4.argument = this.parseMaybeAssign(e4)), this.finishNode(t4, "YieldExpression");
        }, $.parseAwait = function(e4) {
          this.awaitPos || (this.awaitPos = this.start);
          var t4 = this.startNode();
          return this.next(), t4.argument = this.parseMaybeUnary(null, true, false, e4), this.finishNode(t4, "AwaitExpression");
        };
        var W = acorn_Parser.prototype;
        W.raise = function(e4, t4) {
          var i6 = getLineInfo(this.input, e4);
          t4 += " (" + i6.line + ":" + i6.column + ")", this.sourceFile && (t4 += " in " + this.sourceFile);
          var s3 = new SyntaxError(t4);
          throw s3.pos = e4, s3.loc = i6, s3.raisedAt = this.pos, s3;
        }, W.raiseRecoverable = W.raise, W.curPosition = function() {
          if (this.options.locations) return new acorn_Position(this.curLine, this.pos - this.lineStart);
        };
        var G = acorn_Parser.prototype, acorn_Scope = /* @__PURE__ */ __name(function(e4) {
          this.flags = e4, this.var = [], this.lexical = [], this.functions = [];
        }, "acorn_Scope");
        G.enterScope = function(e4) {
          this.scopeStack.push(new acorn_Scope(e4));
        }, G.exitScope = function() {
          this.scopeStack.pop();
        }, G.treatFunctionsAsVarInScope = function(e4) {
          return 2 & e4.flags || !this.inModule && 1 & e4.flags;
        }, G.declareName = function(e4, t4, i6) {
          var s3 = false;
          if (2 === t4) {
            var r4 = this.currentScope();
            s3 = r4.lexical.indexOf(e4) > -1 || r4.functions.indexOf(e4) > -1 || r4.var.indexOf(e4) > -1, r4.lexical.push(e4), this.inModule && 1 & r4.flags && delete this.undefinedExports[e4];
          } else if (4 === t4) {
            this.currentScope().lexical.push(e4);
          } else if (3 === t4) {
            var n3 = this.currentScope();
            s3 = this.treatFunctionsAsVar ? n3.lexical.indexOf(e4) > -1 : n3.lexical.indexOf(e4) > -1 || n3.var.indexOf(e4) > -1, n3.functions.push(e4);
          } else for (var a4 = this.scopeStack.length - 1; a4 >= 0; --a4) {
            var o2 = this.scopeStack[a4];
            if (o2.lexical.indexOf(e4) > -1 && !(32 & o2.flags && o2.lexical[0] === e4) || !this.treatFunctionsAsVarInScope(o2) && o2.functions.indexOf(e4) > -1) {
              s3 = true;
              break;
            }
            if (o2.var.push(e4), this.inModule && 1 & o2.flags && delete this.undefinedExports[e4], o2.flags & P) break;
          }
          s3 && this.raiseRecoverable(i6, "Identifier '" + e4 + "' has already been declared");
        }, G.checkLocalExport = function(e4) {
          -1 === this.scopeStack[0].lexical.indexOf(e4.name) && -1 === this.scopeStack[0].var.indexOf(e4.name) && (this.undefinedExports[e4.name] = e4);
        }, G.currentScope = function() {
          return this.scopeStack[this.scopeStack.length - 1];
        }, G.currentVarScope = function() {
          for (var e4 = this.scopeStack.length - 1; ; e4--) {
            var t4 = this.scopeStack[e4];
            if (771 & t4.flags) return t4;
          }
        }, G.currentThisScope = function() {
          for (var e4 = this.scopeStack.length - 1; ; e4--) {
            var t4 = this.scopeStack[e4];
            if (771 & t4.flags && !(16 & t4.flags)) return t4;
          }
        };
        var acorn_Node = /* @__PURE__ */ __name(function(e4, t4, i6) {
          this.type = "", this.start = t4, this.end = 0, e4.options.locations && (this.loc = new acorn_SourceLocation(e4, i6)), e4.options.directSourceFile && (this.sourceFile = e4.options.directSourceFile), e4.options.ranges && (this.range = [t4, 0]);
        }, "acorn_Node"), H = acorn_Parser.prototype;
        function finishNodeAt(e4, t4, i6, s3) {
          return e4.type = t4, e4.end = i6, this.options.locations && (e4.loc.end = s3), this.options.ranges && (e4.range[1] = i6), e4;
        }
        __name(finishNodeAt, "finishNodeAt");
        H.startNode = function() {
          return new acorn_Node(this, this.start, this.startLoc);
        }, H.startNodeAt = function(e4, t4) {
          return new acorn_Node(this, e4, t4);
        }, H.finishNode = function(e4, t4) {
          return finishNodeAt.call(this, e4, t4, this.lastTokEnd, this.lastTokEndLoc);
        }, H.finishNodeAt = function(e4, t4, i6, s3) {
          return finishNodeAt.call(this, e4, t4, i6, s3);
        }, H.copyNode = function(e4) {
          var t4 = new acorn_Node(this, e4.start, this.startLoc);
          for (var i6 in e4) t4[i6] = e4[i6];
          return t4;
        };
        var K = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", z = K + " Extended_Pictographic", J = z + " EBase EComp EMod EPres ExtPict", Y = { 9: K, 10: z, 11: z, 12: J, 13: J, 14: J }, Q = { 9: "", 10: "", 11: "", 12: "", 13: "", 14: "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji" }, Z = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", X = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", ee = X + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", te = ee + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", ie = te + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi", se = ie + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith", re = { 9: X, 10: ee, 11: te, 12: ie, 13: se, 14: se + " Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz" }, ne = {};
        function buildUnicodeData(e4) {
          var t4 = ne[e4] = { binary: wordsRegexp(Y[e4] + " " + Z), binaryOfStrings: wordsRegexp(Q[e4]), nonBinary: { General_Category: wordsRegexp(Z), Script: wordsRegexp(re[e4]) } };
          t4.nonBinary.Script_Extensions = t4.nonBinary.Script, t4.nonBinary.gc = t4.nonBinary.General_Category, t4.nonBinary.sc = t4.nonBinary.Script, t4.nonBinary.scx = t4.nonBinary.Script_Extensions;
        }
        __name(buildUnicodeData, "buildUnicodeData");
        for (var ae = 0, oe = [9, 10, 11, 12, 13, 14]; ae < oe.length; ae += 1) {
          buildUnicodeData(oe[ae]);
        }
        var he = acorn_Parser.prototype, acorn_BranchID = /* @__PURE__ */ __name(function(e4, t4) {
          this.parent = e4, this.base = t4 || this;
        }, "acorn_BranchID");
        acorn_BranchID.prototype.separatedFrom = function(e4) {
          for (var t4 = this; t4; t4 = t4.parent) for (var i6 = e4; i6; i6 = i6.parent) if (t4.base === i6.base && t4 !== i6) return true;
          return false;
        }, acorn_BranchID.prototype.sibling = function() {
          return new acorn_BranchID(this.parent, this.base);
        };
        var acorn_RegExpValidationState = /* @__PURE__ */ __name(function(e4) {
          this.parser = e4, this.validFlags = "gim" + (e4.options.ecmaVersion >= 6 ? "uy" : "") + (e4.options.ecmaVersion >= 9 ? "s" : "") + (e4.options.ecmaVersion >= 13 ? "d" : "") + (e4.options.ecmaVersion >= 15 ? "v" : ""), this.unicodeProperties = ne[e4.options.ecmaVersion >= 14 ? 14 : e4.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = false, this.switchV = false, this.switchN = false, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = false, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = /* @__PURE__ */ Object.create(null), this.backReferenceNames = [], this.branchID = null;
        }, "acorn_RegExpValidationState");
        function isRegularExpressionModifier(e4) {
          return 105 === e4 || 109 === e4 || 115 === e4;
        }
        __name(isRegularExpressionModifier, "isRegularExpressionModifier");
        function isSyntaxCharacter(e4) {
          return 36 === e4 || e4 >= 40 && e4 <= 43 || 46 === e4 || 63 === e4 || e4 >= 91 && e4 <= 94 || e4 >= 123 && e4 <= 125;
        }
        __name(isSyntaxCharacter, "isSyntaxCharacter");
        function isControlLetter(e4) {
          return e4 >= 65 && e4 <= 90 || e4 >= 97 && e4 <= 122;
        }
        __name(isControlLetter, "isControlLetter");
        acorn_RegExpValidationState.prototype.reset = function(e4, t4, i6) {
          var s3 = -1 !== i6.indexOf("v"), r4 = -1 !== i6.indexOf("u");
          this.start = 0 | e4, this.source = t4 + "", this.flags = i6, s3 && this.parser.options.ecmaVersion >= 15 ? (this.switchU = true, this.switchV = true, this.switchN = true) : (this.switchU = r4 && this.parser.options.ecmaVersion >= 6, this.switchV = false, this.switchN = r4 && this.parser.options.ecmaVersion >= 9);
        }, acorn_RegExpValidationState.prototype.raise = function(e4) {
          this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + e4);
        }, acorn_RegExpValidationState.prototype.at = function(e4, t4) {
          void 0 === t4 && (t4 = false);
          var i6 = this.source, s3 = i6.length;
          if (e4 >= s3) return -1;
          var r4 = i6.charCodeAt(e4);
          if (!t4 && !this.switchU || r4 <= 55295 || r4 >= 57344 || e4 + 1 >= s3) return r4;
          var n3 = i6.charCodeAt(e4 + 1);
          return n3 >= 56320 && n3 <= 57343 ? (r4 << 10) + n3 - 56613888 : r4;
        }, acorn_RegExpValidationState.prototype.nextIndex = function(e4, t4) {
          void 0 === t4 && (t4 = false);
          var i6 = this.source, s3 = i6.length;
          if (e4 >= s3) return s3;
          var r4, n3 = i6.charCodeAt(e4);
          return !t4 && !this.switchU || n3 <= 55295 || n3 >= 57344 || e4 + 1 >= s3 || (r4 = i6.charCodeAt(e4 + 1)) < 56320 || r4 > 57343 ? e4 + 1 : e4 + 2;
        }, acorn_RegExpValidationState.prototype.current = function(e4) {
          return void 0 === e4 && (e4 = false), this.at(this.pos, e4);
        }, acorn_RegExpValidationState.prototype.lookahead = function(e4) {
          return void 0 === e4 && (e4 = false), this.at(this.nextIndex(this.pos, e4), e4);
        }, acorn_RegExpValidationState.prototype.advance = function(e4) {
          void 0 === e4 && (e4 = false), this.pos = this.nextIndex(this.pos, e4);
        }, acorn_RegExpValidationState.prototype.eat = function(e4, t4) {
          return void 0 === t4 && (t4 = false), this.current(t4) === e4 && (this.advance(t4), true);
        }, acorn_RegExpValidationState.prototype.eatChars = function(e4, t4) {
          void 0 === t4 && (t4 = false);
          for (var i6 = this.pos, s3 = 0, r4 = e4; s3 < r4.length; s3 += 1) {
            var n3 = r4[s3], a4 = this.at(i6, t4);
            if (-1 === a4 || a4 !== n3) return false;
            i6 = this.nextIndex(i6, t4);
          }
          return this.pos = i6, true;
        }, he.validateRegExpFlags = function(e4) {
          for (var t4 = e4.validFlags, i6 = e4.flags, s3 = false, r4 = false, n3 = 0; n3 < i6.length; n3++) {
            var a4 = i6.charAt(n3);
            -1 === t4.indexOf(a4) && this.raise(e4.start, "Invalid regular expression flag"), i6.indexOf(a4, n3 + 1) > -1 && this.raise(e4.start, "Duplicate regular expression flag"), "u" === a4 && (s3 = true), "v" === a4 && (r4 = true);
          }
          this.options.ecmaVersion >= 15 && s3 && r4 && this.raise(e4.start, "Invalid regular expression flag");
        }, he.validateRegExpPattern = function(e4) {
          this.regexp_pattern(e4), !e4.switchN && this.options.ecmaVersion >= 9 && function(e5) {
            for (var t4 in e5) return true;
            return false;
          }(e4.groupNames) && (e4.switchN = true, this.regexp_pattern(e4));
        }, he.regexp_pattern = function(e4) {
          e4.pos = 0, e4.lastIntValue = 0, e4.lastStringValue = "", e4.lastAssertionIsQuantifiable = false, e4.numCapturingParens = 0, e4.maxBackReference = 0, e4.groupNames = /* @__PURE__ */ Object.create(null), e4.backReferenceNames.length = 0, e4.branchID = null, this.regexp_disjunction(e4), e4.pos !== e4.source.length && (e4.eat(41) && e4.raise("Unmatched ')'"), (e4.eat(93) || e4.eat(125)) && e4.raise("Lone quantifier brackets")), e4.maxBackReference > e4.numCapturingParens && e4.raise("Invalid escape");
          for (var t4 = 0, i6 = e4.backReferenceNames; t4 < i6.length; t4 += 1) {
            var s3 = i6[t4];
            e4.groupNames[s3] || e4.raise("Invalid named capture referenced");
          }
        }, he.regexp_disjunction = function(e4) {
          var t4 = this.options.ecmaVersion >= 16;
          for (t4 && (e4.branchID = new acorn_BranchID(e4.branchID, null)), this.regexp_alternative(e4); e4.eat(124); ) t4 && (e4.branchID = e4.branchID.sibling()), this.regexp_alternative(e4);
          t4 && (e4.branchID = e4.branchID.parent), this.regexp_eatQuantifier(e4, true) && e4.raise("Nothing to repeat"), e4.eat(123) && e4.raise("Lone quantifier brackets");
        }, he.regexp_alternative = function(e4) {
          for (; e4.pos < e4.source.length && this.regexp_eatTerm(e4); ) ;
        }, he.regexp_eatTerm = function(e4) {
          return this.regexp_eatAssertion(e4) ? (e4.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e4) && e4.switchU && e4.raise("Invalid quantifier"), true) : !!(e4.switchU ? this.regexp_eatAtom(e4) : this.regexp_eatExtendedAtom(e4)) && (this.regexp_eatQuantifier(e4), true);
        }, he.regexp_eatAssertion = function(e4) {
          var t4 = e4.pos;
          if (e4.lastAssertionIsQuantifiable = false, e4.eat(94) || e4.eat(36)) return true;
          if (e4.eat(92)) {
            if (e4.eat(66) || e4.eat(98)) return true;
            e4.pos = t4;
          }
          if (e4.eat(40) && e4.eat(63)) {
            var i6 = false;
            if (this.options.ecmaVersion >= 9 && (i6 = e4.eat(60)), e4.eat(61) || e4.eat(33)) return this.regexp_disjunction(e4), e4.eat(41) || e4.raise("Unterminated group"), e4.lastAssertionIsQuantifiable = !i6, true;
          }
          return e4.pos = t4, false;
        }, he.regexp_eatQuantifier = function(e4, t4) {
          return void 0 === t4 && (t4 = false), !!this.regexp_eatQuantifierPrefix(e4, t4) && (e4.eat(63), true);
        }, he.regexp_eatQuantifierPrefix = function(e4, t4) {
          return e4.eat(42) || e4.eat(43) || e4.eat(63) || this.regexp_eatBracedQuantifier(e4, t4);
        }, he.regexp_eatBracedQuantifier = function(e4, t4) {
          var i6 = e4.pos;
          if (e4.eat(123)) {
            var s3 = 0, r4 = -1;
            if (this.regexp_eatDecimalDigits(e4) && (s3 = e4.lastIntValue, e4.eat(44) && this.regexp_eatDecimalDigits(e4) && (r4 = e4.lastIntValue), e4.eat(125))) return -1 !== r4 && r4 < s3 && !t4 && e4.raise("numbers out of order in {} quantifier"), true;
            e4.switchU && !t4 && e4.raise("Incomplete quantifier"), e4.pos = i6;
          }
          return false;
        }, he.regexp_eatAtom = function(e4) {
          return this.regexp_eatPatternCharacters(e4) || e4.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e4) || this.regexp_eatCharacterClass(e4) || this.regexp_eatUncapturingGroup(e4) || this.regexp_eatCapturingGroup(e4);
        }, he.regexp_eatReverseSolidusAtomEscape = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(92)) {
            if (this.regexp_eatAtomEscape(e4)) return true;
            e4.pos = t4;
          }
          return false;
        }, he.regexp_eatUncapturingGroup = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(40)) {
            if (e4.eat(63)) {
              if (this.options.ecmaVersion >= 16) {
                var i6 = this.regexp_eatModifiers(e4), s3 = e4.eat(45);
                if (i6 || s3) {
                  for (var r4 = 0; r4 < i6.length; r4++) {
                    var n3 = i6.charAt(r4);
                    i6.indexOf(n3, r4 + 1) > -1 && e4.raise("Duplicate regular expression modifiers");
                  }
                  if (s3) {
                    var a4 = this.regexp_eatModifiers(e4);
                    i6 || a4 || 58 !== e4.current() || e4.raise("Invalid regular expression modifiers");
                    for (var o2 = 0; o2 < a4.length; o2++) {
                      var h2 = a4.charAt(o2);
                      (a4.indexOf(h2, o2 + 1) > -1 || i6.indexOf(h2) > -1) && e4.raise("Duplicate regular expression modifiers");
                    }
                  }
                }
              }
              if (e4.eat(58)) {
                if (this.regexp_disjunction(e4), e4.eat(41)) return true;
                e4.raise("Unterminated group");
              }
            }
            e4.pos = t4;
          }
          return false;
        }, he.regexp_eatCapturingGroup = function(e4) {
          if (e4.eat(40)) {
            if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e4) : 63 === e4.current() && e4.raise("Invalid group"), this.regexp_disjunction(e4), e4.eat(41)) return e4.numCapturingParens += 1, true;
            e4.raise("Unterminated group");
          }
          return false;
        }, he.regexp_eatModifiers = function(e4) {
          for (var t4 = "", i6 = 0; -1 !== (i6 = e4.current()) && isRegularExpressionModifier(i6); ) t4 += codePointToString(i6), e4.advance();
          return t4;
        }, he.regexp_eatExtendedAtom = function(e4) {
          return e4.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e4) || this.regexp_eatCharacterClass(e4) || this.regexp_eatUncapturingGroup(e4) || this.regexp_eatCapturingGroup(e4) || this.regexp_eatInvalidBracedQuantifier(e4) || this.regexp_eatExtendedPatternCharacter(e4);
        }, he.regexp_eatInvalidBracedQuantifier = function(e4) {
          return this.regexp_eatBracedQuantifier(e4, true) && e4.raise("Nothing to repeat"), false;
        }, he.regexp_eatSyntaxCharacter = function(e4) {
          var t4 = e4.current();
          return !!isSyntaxCharacter(t4) && (e4.lastIntValue = t4, e4.advance(), true);
        }, he.regexp_eatPatternCharacters = function(e4) {
          for (var t4 = e4.pos, i6 = 0; -1 !== (i6 = e4.current()) && !isSyntaxCharacter(i6); ) e4.advance();
          return e4.pos !== t4;
        }, he.regexp_eatExtendedPatternCharacter = function(e4) {
          var t4 = e4.current();
          return !(-1 === t4 || 36 === t4 || t4 >= 40 && t4 <= 43 || 46 === t4 || 63 === t4 || 91 === t4 || 94 === t4 || 124 === t4) && (e4.advance(), true);
        }, he.regexp_groupSpecifier = function(e4) {
          if (e4.eat(63)) {
            this.regexp_eatGroupName(e4) || e4.raise("Invalid group");
            var t4 = this.options.ecmaVersion >= 16, i6 = e4.groupNames[e4.lastStringValue];
            if (i6) if (t4) for (var s3 = 0, r4 = i6; s3 < r4.length; s3 += 1) {
              r4[s3].separatedFrom(e4.branchID) || e4.raise("Duplicate capture group name");
            }
            else e4.raise("Duplicate capture group name");
            t4 ? (i6 || (e4.groupNames[e4.lastStringValue] = [])).push(e4.branchID) : e4.groupNames[e4.lastStringValue] = true;
          }
        }, he.regexp_eatGroupName = function(e4) {
          if (e4.lastStringValue = "", e4.eat(60)) {
            if (this.regexp_eatRegExpIdentifierName(e4) && e4.eat(62)) return true;
            e4.raise("Invalid capture group name");
          }
          return false;
        }, he.regexp_eatRegExpIdentifierName = function(e4) {
          if (e4.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e4)) {
            for (e4.lastStringValue += codePointToString(e4.lastIntValue); this.regexp_eatRegExpIdentifierPart(e4); ) e4.lastStringValue += codePointToString(e4.lastIntValue);
            return true;
          }
          return false;
        }, he.regexp_eatRegExpIdentifierStart = function(e4) {
          var t4 = e4.pos, i6 = this.options.ecmaVersion >= 11, s3 = e4.current(i6);
          return e4.advance(i6), 92 === s3 && this.regexp_eatRegExpUnicodeEscapeSequence(e4, i6) && (s3 = e4.lastIntValue), function(e5) {
            return isIdentifierStart(e5, true) || 36 === e5 || 95 === e5;
          }(s3) ? (e4.lastIntValue = s3, true) : (e4.pos = t4, false);
        }, he.regexp_eatRegExpIdentifierPart = function(e4) {
          var t4 = e4.pos, i6 = this.options.ecmaVersion >= 11, s3 = e4.current(i6);
          return e4.advance(i6), 92 === s3 && this.regexp_eatRegExpUnicodeEscapeSequence(e4, i6) && (s3 = e4.lastIntValue), function(e5) {
            return isIdentifierChar(e5, true) || 36 === e5 || 95 === e5 || 8204 === e5 || 8205 === e5;
          }(s3) ? (e4.lastIntValue = s3, true) : (e4.pos = t4, false);
        }, he.regexp_eatAtomEscape = function(e4) {
          return !!(this.regexp_eatBackReference(e4) || this.regexp_eatCharacterClassEscape(e4) || this.regexp_eatCharacterEscape(e4) || e4.switchN && this.regexp_eatKGroupName(e4)) || (e4.switchU && (99 === e4.current() && e4.raise("Invalid unicode escape"), e4.raise("Invalid escape")), false);
        }, he.regexp_eatBackReference = function(e4) {
          var t4 = e4.pos;
          if (this.regexp_eatDecimalEscape(e4)) {
            var i6 = e4.lastIntValue;
            if (e4.switchU) return i6 > e4.maxBackReference && (e4.maxBackReference = i6), true;
            if (i6 <= e4.numCapturingParens) return true;
            e4.pos = t4;
          }
          return false;
        }, he.regexp_eatKGroupName = function(e4) {
          if (e4.eat(107)) {
            if (this.regexp_eatGroupName(e4)) return e4.backReferenceNames.push(e4.lastStringValue), true;
            e4.raise("Invalid named reference");
          }
          return false;
        }, he.regexp_eatCharacterEscape = function(e4) {
          return this.regexp_eatControlEscape(e4) || this.regexp_eatCControlLetter(e4) || this.regexp_eatZero(e4) || this.regexp_eatHexEscapeSequence(e4) || this.regexp_eatRegExpUnicodeEscapeSequence(e4, false) || !e4.switchU && this.regexp_eatLegacyOctalEscapeSequence(e4) || this.regexp_eatIdentityEscape(e4);
        }, he.regexp_eatCControlLetter = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(99)) {
            if (this.regexp_eatControlLetter(e4)) return true;
            e4.pos = t4;
          }
          return false;
        }, he.regexp_eatZero = function(e4) {
          return 48 === e4.current() && !isDecimalDigit(e4.lookahead()) && (e4.lastIntValue = 0, e4.advance(), true);
        }, he.regexp_eatControlEscape = function(e4) {
          var t4 = e4.current();
          return 116 === t4 ? (e4.lastIntValue = 9, e4.advance(), true) : 110 === t4 ? (e4.lastIntValue = 10, e4.advance(), true) : 118 === t4 ? (e4.lastIntValue = 11, e4.advance(), true) : 102 === t4 ? (e4.lastIntValue = 12, e4.advance(), true) : 114 === t4 && (e4.lastIntValue = 13, e4.advance(), true);
        }, he.regexp_eatControlLetter = function(e4) {
          var t4 = e4.current();
          return !!isControlLetter(t4) && (e4.lastIntValue = t4 % 32, e4.advance(), true);
        }, he.regexp_eatRegExpUnicodeEscapeSequence = function(e4, t4) {
          void 0 === t4 && (t4 = false);
          var i6, s3 = e4.pos, r4 = t4 || e4.switchU;
          if (e4.eat(117)) {
            if (this.regexp_eatFixedHexDigits(e4, 4)) {
              var n3 = e4.lastIntValue;
              if (r4 && n3 >= 55296 && n3 <= 56319) {
                var a4 = e4.pos;
                if (e4.eat(92) && e4.eat(117) && this.regexp_eatFixedHexDigits(e4, 4)) {
                  var o2 = e4.lastIntValue;
                  if (o2 >= 56320 && o2 <= 57343) return e4.lastIntValue = 1024 * (n3 - 55296) + (o2 - 56320) + 65536, true;
                }
                e4.pos = a4, e4.lastIntValue = n3;
              }
              return true;
            }
            if (r4 && e4.eat(123) && this.regexp_eatHexDigits(e4) && e4.eat(125) && ((i6 = e4.lastIntValue) >= 0 && i6 <= 1114111)) return true;
            r4 && e4.raise("Invalid unicode escape"), e4.pos = s3;
          }
          return false;
        }, he.regexp_eatIdentityEscape = function(e4) {
          if (e4.switchU) return !!this.regexp_eatSyntaxCharacter(e4) || !!e4.eat(47) && (e4.lastIntValue = 47, true);
          var t4 = e4.current();
          return !(99 === t4 || e4.switchN && 107 === t4) && (e4.lastIntValue = t4, e4.advance(), true);
        }, he.regexp_eatDecimalEscape = function(e4) {
          e4.lastIntValue = 0;
          var t4 = e4.current();
          if (t4 >= 49 && t4 <= 57) {
            do {
              e4.lastIntValue = 10 * e4.lastIntValue + (t4 - 48), e4.advance();
            } while ((t4 = e4.current()) >= 48 && t4 <= 57);
            return true;
          }
          return false;
        };
        function isUnicodePropertyNameCharacter(e4) {
          return isControlLetter(e4) || 95 === e4;
        }
        __name(isUnicodePropertyNameCharacter, "isUnicodePropertyNameCharacter");
        function isUnicodePropertyValueCharacter(e4) {
          return isUnicodePropertyNameCharacter(e4) || isDecimalDigit(e4);
        }
        __name(isUnicodePropertyValueCharacter, "isUnicodePropertyValueCharacter");
        function isDecimalDigit(e4) {
          return e4 >= 48 && e4 <= 57;
        }
        __name(isDecimalDigit, "isDecimalDigit");
        function isHexDigit(e4) {
          return e4 >= 48 && e4 <= 57 || e4 >= 65 && e4 <= 70 || e4 >= 97 && e4 <= 102;
        }
        __name(isHexDigit, "isHexDigit");
        function hexToInt(e4) {
          return e4 >= 65 && e4 <= 70 ? e4 - 65 + 10 : e4 >= 97 && e4 <= 102 ? e4 - 97 + 10 : e4 - 48;
        }
        __name(hexToInt, "hexToInt");
        function isOctalDigit(e4) {
          return e4 >= 48 && e4 <= 55;
        }
        __name(isOctalDigit, "isOctalDigit");
        he.regexp_eatCharacterClassEscape = function(e4) {
          var t4 = e4.current();
          if (/* @__PURE__ */ function(e5) {
            return 100 === e5 || 68 === e5 || 115 === e5 || 83 === e5 || 119 === e5 || 87 === e5;
          }(t4)) return e4.lastIntValue = -1, e4.advance(), 1;
          var i6 = false;
          if (e4.switchU && this.options.ecmaVersion >= 9 && ((i6 = 80 === t4) || 112 === t4)) {
            var s3;
            if (e4.lastIntValue = -1, e4.advance(), e4.eat(123) && (s3 = this.regexp_eatUnicodePropertyValueExpression(e4)) && e4.eat(125)) return i6 && 2 === s3 && e4.raise("Invalid property name"), s3;
            e4.raise("Invalid property name");
          }
          return 0;
        }, he.regexp_eatUnicodePropertyValueExpression = function(e4) {
          var t4 = e4.pos;
          if (this.regexp_eatUnicodePropertyName(e4) && e4.eat(61)) {
            var i6 = e4.lastStringValue;
            if (this.regexp_eatUnicodePropertyValue(e4)) {
              var s3 = e4.lastStringValue;
              return this.regexp_validateUnicodePropertyNameAndValue(e4, i6, s3), 1;
            }
          }
          if (e4.pos = t4, this.regexp_eatLoneUnicodePropertyNameOrValue(e4)) {
            var r4 = e4.lastStringValue;
            return this.regexp_validateUnicodePropertyNameOrValue(e4, r4);
          }
          return 0;
        }, he.regexp_validateUnicodePropertyNameAndValue = function(e4, t4, i6) {
          b(e4.unicodeProperties.nonBinary, t4) || e4.raise("Invalid property name"), e4.unicodeProperties.nonBinary[t4].test(i6) || e4.raise("Invalid property value");
        }, he.regexp_validateUnicodePropertyNameOrValue = function(e4, t4) {
          return e4.unicodeProperties.binary.test(t4) ? 1 : e4.switchV && e4.unicodeProperties.binaryOfStrings.test(t4) ? 2 : void e4.raise("Invalid property name");
        }, he.regexp_eatUnicodePropertyName = function(e4) {
          var t4 = 0;
          for (e4.lastStringValue = ""; isUnicodePropertyNameCharacter(t4 = e4.current()); ) e4.lastStringValue += codePointToString(t4), e4.advance();
          return "" !== e4.lastStringValue;
        }, he.regexp_eatUnicodePropertyValue = function(e4) {
          var t4 = 0;
          for (e4.lastStringValue = ""; isUnicodePropertyValueCharacter(t4 = e4.current()); ) e4.lastStringValue += codePointToString(t4), e4.advance();
          return "" !== e4.lastStringValue;
        }, he.regexp_eatLoneUnicodePropertyNameOrValue = function(e4) {
          return this.regexp_eatUnicodePropertyValue(e4);
        }, he.regexp_eatCharacterClass = function(e4) {
          if (e4.eat(91)) {
            var t4 = e4.eat(94), i6 = this.regexp_classContents(e4);
            return e4.eat(93) || e4.raise("Unterminated character class"), t4 && 2 === i6 && e4.raise("Negated character class may contain strings"), true;
          }
          return false;
        }, he.regexp_classContents = function(e4) {
          return 93 === e4.current() ? 1 : e4.switchV ? this.regexp_classSetExpression(e4) : (this.regexp_nonEmptyClassRanges(e4), 1);
        }, he.regexp_nonEmptyClassRanges = function(e4) {
          for (; this.regexp_eatClassAtom(e4); ) {
            var t4 = e4.lastIntValue;
            if (e4.eat(45) && this.regexp_eatClassAtom(e4)) {
              var i6 = e4.lastIntValue;
              !e4.switchU || -1 !== t4 && -1 !== i6 || e4.raise("Invalid character class"), -1 !== t4 && -1 !== i6 && t4 > i6 && e4.raise("Range out of order in character class");
            }
          }
        }, he.regexp_eatClassAtom = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(92)) {
            if (this.regexp_eatClassEscape(e4)) return true;
            if (e4.switchU) {
              var i6 = e4.current();
              (99 === i6 || isOctalDigit(i6)) && e4.raise("Invalid class escape"), e4.raise("Invalid escape");
            }
            e4.pos = t4;
          }
          var s3 = e4.current();
          return 93 !== s3 && (e4.lastIntValue = s3, e4.advance(), true);
        }, he.regexp_eatClassEscape = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(98)) return e4.lastIntValue = 8, true;
          if (e4.switchU && e4.eat(45)) return e4.lastIntValue = 45, true;
          if (!e4.switchU && e4.eat(99)) {
            if (this.regexp_eatClassControlLetter(e4)) return true;
            e4.pos = t4;
          }
          return this.regexp_eatCharacterClassEscape(e4) || this.regexp_eatCharacterEscape(e4);
        }, he.regexp_classSetExpression = function(e4) {
          var t4, i6 = 1;
          if (this.regexp_eatClassSetRange(e4)) ;
          else if (t4 = this.regexp_eatClassSetOperand(e4)) {
            2 === t4 && (i6 = 2);
            for (var s3 = e4.pos; e4.eatChars([38, 38]); ) 38 !== e4.current() && (t4 = this.regexp_eatClassSetOperand(e4)) ? 2 !== t4 && (i6 = 1) : e4.raise("Invalid character in character class");
            if (s3 !== e4.pos) return i6;
            for (; e4.eatChars([45, 45]); ) this.regexp_eatClassSetOperand(e4) || e4.raise("Invalid character in character class");
            if (s3 !== e4.pos) return i6;
          } else e4.raise("Invalid character in character class");
          for (; ; ) if (!this.regexp_eatClassSetRange(e4)) {
            if (!(t4 = this.regexp_eatClassSetOperand(e4))) return i6;
            2 === t4 && (i6 = 2);
          }
        }, he.regexp_eatClassSetRange = function(e4) {
          var t4 = e4.pos;
          if (this.regexp_eatClassSetCharacter(e4)) {
            var i6 = e4.lastIntValue;
            if (e4.eat(45) && this.regexp_eatClassSetCharacter(e4)) {
              var s3 = e4.lastIntValue;
              return -1 !== i6 && -1 !== s3 && i6 > s3 && e4.raise("Range out of order in character class"), true;
            }
            e4.pos = t4;
          }
          return false;
        }, he.regexp_eatClassSetOperand = function(e4) {
          return this.regexp_eatClassSetCharacter(e4) ? 1 : this.regexp_eatClassStringDisjunction(e4) || this.regexp_eatNestedClass(e4);
        }, he.regexp_eatNestedClass = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(91)) {
            var i6 = e4.eat(94), s3 = this.regexp_classContents(e4);
            if (e4.eat(93)) return i6 && 2 === s3 && e4.raise("Negated character class may contain strings"), s3;
            e4.pos = t4;
          }
          if (e4.eat(92)) {
            var r4 = this.regexp_eatCharacterClassEscape(e4);
            if (r4) return r4;
            e4.pos = t4;
          }
          return null;
        }, he.regexp_eatClassStringDisjunction = function(e4) {
          var t4 = e4.pos;
          if (e4.eatChars([92, 113])) {
            if (e4.eat(123)) {
              var i6 = this.regexp_classStringDisjunctionContents(e4);
              if (e4.eat(125)) return i6;
            } else e4.raise("Invalid escape");
            e4.pos = t4;
          }
          return null;
        }, he.regexp_classStringDisjunctionContents = function(e4) {
          for (var t4 = this.regexp_classString(e4); e4.eat(124); ) 2 === this.regexp_classString(e4) && (t4 = 2);
          return t4;
        }, he.regexp_classString = function(e4) {
          for (var t4 = 0; this.regexp_eatClassSetCharacter(e4); ) t4++;
          return 1 === t4 ? 1 : 2;
        }, he.regexp_eatClassSetCharacter = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(92)) return !(!this.regexp_eatCharacterEscape(e4) && !this.regexp_eatClassSetReservedPunctuator(e4)) || (e4.eat(98) ? (e4.lastIntValue = 8, true) : (e4.pos = t4, false));
          var i6 = e4.current();
          return !(i6 < 0 || i6 === e4.lookahead() && function(e5) {
            return 33 === e5 || e5 >= 35 && e5 <= 38 || e5 >= 42 && e5 <= 44 || 46 === e5 || e5 >= 58 && e5 <= 64 || 94 === e5 || 96 === e5 || 126 === e5;
          }(i6)) && (!function(e5) {
            return 40 === e5 || 41 === e5 || 45 === e5 || 47 === e5 || e5 >= 91 && e5 <= 93 || e5 >= 123 && e5 <= 125;
          }(i6) && (e4.advance(), e4.lastIntValue = i6, true));
        }, he.regexp_eatClassSetReservedPunctuator = function(e4) {
          var t4 = e4.current();
          return !!function(e5) {
            return 33 === e5 || 35 === e5 || 37 === e5 || 38 === e5 || 44 === e5 || 45 === e5 || e5 >= 58 && e5 <= 62 || 64 === e5 || 96 === e5 || 126 === e5;
          }(t4) && (e4.lastIntValue = t4, e4.advance(), true);
        }, he.regexp_eatClassControlLetter = function(e4) {
          var t4 = e4.current();
          return !(!isDecimalDigit(t4) && 95 !== t4) && (e4.lastIntValue = t4 % 32, e4.advance(), true);
        }, he.regexp_eatHexEscapeSequence = function(e4) {
          var t4 = e4.pos;
          if (e4.eat(120)) {
            if (this.regexp_eatFixedHexDigits(e4, 2)) return true;
            e4.switchU && e4.raise("Invalid escape"), e4.pos = t4;
          }
          return false;
        }, he.regexp_eatDecimalDigits = function(e4) {
          var t4 = e4.pos, i6 = 0;
          for (e4.lastIntValue = 0; isDecimalDigit(i6 = e4.current()); ) e4.lastIntValue = 10 * e4.lastIntValue + (i6 - 48), e4.advance();
          return e4.pos !== t4;
        }, he.regexp_eatHexDigits = function(e4) {
          var t4 = e4.pos, i6 = 0;
          for (e4.lastIntValue = 0; isHexDigit(i6 = e4.current()); ) e4.lastIntValue = 16 * e4.lastIntValue + hexToInt(i6), e4.advance();
          return e4.pos !== t4;
        }, he.regexp_eatLegacyOctalEscapeSequence = function(e4) {
          if (this.regexp_eatOctalDigit(e4)) {
            var t4 = e4.lastIntValue;
            if (this.regexp_eatOctalDigit(e4)) {
              var i6 = e4.lastIntValue;
              t4 <= 3 && this.regexp_eatOctalDigit(e4) ? e4.lastIntValue = 64 * t4 + 8 * i6 + e4.lastIntValue : e4.lastIntValue = 8 * t4 + i6;
            } else e4.lastIntValue = t4;
            return true;
          }
          return false;
        }, he.regexp_eatOctalDigit = function(e4) {
          var t4 = e4.current();
          return isOctalDigit(t4) ? (e4.lastIntValue = t4 - 48, e4.advance(), true) : (e4.lastIntValue = 0, false);
        }, he.regexp_eatFixedHexDigits = function(e4, t4) {
          var i6 = e4.pos;
          e4.lastIntValue = 0;
          for (var s3 = 0; s3 < t4; ++s3) {
            var r4 = e4.current();
            if (!isHexDigit(r4)) return e4.pos = i6, false;
            e4.lastIntValue = 16 * e4.lastIntValue + hexToInt(r4), e4.advance();
          }
          return true;
        };
        var acorn_Token = /* @__PURE__ */ __name(function(e4) {
          this.type = e4.type, this.value = e4.value, this.start = e4.start, this.end = e4.end, e4.options.locations && (this.loc = new acorn_SourceLocation(e4, e4.startLoc, e4.endLoc)), e4.options.ranges && (this.range = [e4.start, e4.end]);
        }, "acorn_Token"), ce = acorn_Parser.prototype;
        function stringToBigInt(e4) {
          return "function" != typeof BigInt ? null : BigInt(e4.replace(/_/g, ""));
        }
        __name(stringToBigInt, "stringToBigInt");
        ce.next = function(e4) {
          !e4 && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new acorn_Token(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
        }, ce.getToken = function() {
          return this.next(), new acorn_Token(this);
        }, "undefined" != typeof Symbol && (ce[Symbol.iterator] = function() {
          var e4 = this;
          return { next: /* @__PURE__ */ __name(function() {
            var t4 = e4.getToken();
            return { done: t4.type === f.eof, value: t4 };
          }, "next") };
        }), ce.nextToken = function() {
          var e4 = this.curContext();
          return e4 && e4.preserveSpace || this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length ? this.finishToken(f.eof) : e4.override ? e4.override(this) : void this.readToken(this.fullCharCodeAtPos());
        }, ce.readToken = function(e4) {
          return isIdentifierStart(e4, this.options.ecmaVersion >= 6) || 92 === e4 ? this.readWord() : this.getTokenFromCode(e4);
        }, ce.fullCharCodeAtPos = function() {
          var e4 = this.input.charCodeAt(this.pos);
          if (e4 <= 55295 || e4 >= 56320) return e4;
          var t4 = this.input.charCodeAt(this.pos + 1);
          return t4 <= 56319 || t4 >= 57344 ? e4 : (e4 << 10) + t4 - 56613888;
        }, ce.skipBlockComment = function() {
          var e4 = this.options.onComment && this.curPosition(), t4 = this.pos, i6 = this.input.indexOf("*/", this.pos += 2);
          if (-1 === i6 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = i6 + 2, this.options.locations) for (var s3 = void 0, r4 = t4; (s3 = nextLineBreak(this.input, r4, this.pos)) > -1; ) ++this.curLine, r4 = this.lineStart = s3;
          this.options.onComment && this.options.onComment(true, this.input.slice(t4 + 2, i6), t4, this.pos, e4, this.curPosition());
        }, ce.skipLineComment = function(e4) {
          for (var t4 = this.pos, i6 = this.options.onComment && this.curPosition(), s3 = this.input.charCodeAt(this.pos += e4); this.pos < this.input.length && !isNewLine(s3); ) s3 = this.input.charCodeAt(++this.pos);
          this.options.onComment && this.options.onComment(false, this.input.slice(t4 + e4, this.pos), t4, this.pos, i6, this.curPosition());
        }, ce.skipSpace = function() {
          e: for (; this.pos < this.input.length; ) {
            var e4 = this.input.charCodeAt(this.pos);
            switch (e4) {
              case 32:
              case 160:
                ++this.pos;
                break;
              case 13:
                10 === this.input.charCodeAt(this.pos + 1) && ++this.pos;
              case 10:
              case 8232:
              case 8233:
                ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
                break;
              case 47:
                switch (this.input.charCodeAt(this.pos + 1)) {
                  case 42:
                    this.skipBlockComment();
                    break;
                  case 47:
                    this.skipLineComment(2);
                    break;
                  default:
                    break e;
                }
                break;
              default:
                if (!(e4 > 8 && e4 < 14 || e4 >= 5760 && x.test(String.fromCharCode(e4)))) break e;
                ++this.pos;
            }
          }
        }, ce.finishToken = function(e4, t4) {
          this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
          var i6 = this.type;
          this.type = e4, this.value = t4, this.updateContext(i6);
        }, ce.readToken_dot = function() {
          var e4 = this.input.charCodeAt(this.pos + 1);
          if (e4 >= 48 && e4 <= 57) return this.readNumber(true);
          var t4 = this.input.charCodeAt(this.pos + 2);
          return this.options.ecmaVersion >= 6 && 46 === e4 && 46 === t4 ? (this.pos += 3, this.finishToken(f.ellipsis)) : (++this.pos, this.finishToken(f.dot));
        }, ce.readToken_slash = function() {
          var e4 = this.input.charCodeAt(this.pos + 1);
          return this.exprAllowed ? (++this.pos, this.readRegexp()) : 61 === e4 ? this.finishOp(f.assign, 2) : this.finishOp(f.slash, 1);
        }, ce.readToken_mult_modulo_exp = function(e4) {
          var t4 = this.input.charCodeAt(this.pos + 1), i6 = 1, s3 = 42 === e4 ? f.star : f.modulo;
          return this.options.ecmaVersion >= 7 && 42 === e4 && 42 === t4 && (++i6, s3 = f.starstar, t4 = this.input.charCodeAt(this.pos + 2)), 61 === t4 ? this.finishOp(f.assign, i6 + 1) : this.finishOp(s3, i6);
        }, ce.readToken_pipe_amp = function(e4) {
          var t4 = this.input.charCodeAt(this.pos + 1);
          if (t4 === e4) {
            if (this.options.ecmaVersion >= 12) {
              if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(f.assign, 3);
            }
            return this.finishOp(124 === e4 ? f.logicalOR : f.logicalAND, 2);
          }
          return 61 === t4 ? this.finishOp(f.assign, 2) : this.finishOp(124 === e4 ? f.bitwiseOR : f.bitwiseAND, 1);
        }, ce.readToken_caret = function() {
          return 61 === this.input.charCodeAt(this.pos + 1) ? this.finishOp(f.assign, 2) : this.finishOp(f.bitwiseXOR, 1);
        }, ce.readToken_plus_min = function(e4) {
          var t4 = this.input.charCodeAt(this.pos + 1);
          return t4 === e4 ? 45 !== t4 || this.inModule || 62 !== this.input.charCodeAt(this.pos + 2) || 0 !== this.lastTokEnd && !m.test(this.input.slice(this.lastTokEnd, this.pos)) ? this.finishOp(f.incDec, 2) : (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : 61 === t4 ? this.finishOp(f.assign, 2) : this.finishOp(f.plusMin, 1);
        }, ce.readToken_lt_gt = function(e4) {
          var t4 = this.input.charCodeAt(this.pos + 1), i6 = 1;
          return t4 === e4 ? (i6 = 62 === e4 && 62 === this.input.charCodeAt(this.pos + 2) ? 3 : 2, 61 === this.input.charCodeAt(this.pos + i6) ? this.finishOp(f.assign, i6 + 1) : this.finishOp(f.bitShift, i6)) : 33 !== t4 || 60 !== e4 || this.inModule || 45 !== this.input.charCodeAt(this.pos + 2) || 45 !== this.input.charCodeAt(this.pos + 3) ? (61 === t4 && (i6 = 2), this.finishOp(f.relational, i6)) : (this.skipLineComment(4), this.skipSpace(), this.nextToken());
        }, ce.readToken_eq_excl = function(e4) {
          var t4 = this.input.charCodeAt(this.pos + 1);
          return 61 === t4 ? this.finishOp(f.equality, 61 === this.input.charCodeAt(this.pos + 2) ? 3 : 2) : 61 === e4 && 62 === t4 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(f.arrow)) : this.finishOp(61 === e4 ? f.eq : f.prefix, 1);
        }, ce.readToken_question = function() {
          var e4 = this.options.ecmaVersion;
          if (e4 >= 11) {
            var t4 = this.input.charCodeAt(this.pos + 1);
            if (46 === t4) {
              var i6 = this.input.charCodeAt(this.pos + 2);
              if (i6 < 48 || i6 > 57) return this.finishOp(f.questionDot, 2);
            }
            if (63 === t4) {
              if (e4 >= 12) {
                if (61 === this.input.charCodeAt(this.pos + 2)) return this.finishOp(f.assign, 3);
              }
              return this.finishOp(f.coalesce, 2);
            }
          }
          return this.finishOp(f.question, 1);
        }, ce.readToken_numberSign = function() {
          var e4 = 35;
          if (this.options.ecmaVersion >= 13 && (++this.pos, isIdentifierStart(e4 = this.fullCharCodeAtPos(), true) || 92 === e4)) return this.finishToken(f.privateId, this.readWord1());
          this.raise(this.pos, "Unexpected character '" + codePointToString(e4) + "'");
        }, ce.getTokenFromCode = function(e4) {
          switch (e4) {
            case 46:
              return this.readToken_dot();
            case 40:
              return ++this.pos, this.finishToken(f.parenL);
            case 41:
              return ++this.pos, this.finishToken(f.parenR);
            case 59:
              return ++this.pos, this.finishToken(f.semi);
            case 44:
              return ++this.pos, this.finishToken(f.comma);
            case 91:
              return ++this.pos, this.finishToken(f.bracketL);
            case 93:
              return ++this.pos, this.finishToken(f.bracketR);
            case 123:
              return ++this.pos, this.finishToken(f.braceL);
            case 125:
              return ++this.pos, this.finishToken(f.braceR);
            case 58:
              return ++this.pos, this.finishToken(f.colon);
            case 96:
              if (this.options.ecmaVersion < 6) break;
              return ++this.pos, this.finishToken(f.backQuote);
            case 48:
              var t4 = this.input.charCodeAt(this.pos + 1);
              if (120 === t4 || 88 === t4) return this.readRadixNumber(16);
              if (this.options.ecmaVersion >= 6) {
                if (111 === t4 || 79 === t4) return this.readRadixNumber(8);
                if (98 === t4 || 66 === t4) return this.readRadixNumber(2);
              }
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return this.readNumber(false);
            case 34:
            case 39:
              return this.readString(e4);
            case 47:
              return this.readToken_slash();
            case 37:
            case 42:
              return this.readToken_mult_modulo_exp(e4);
            case 124:
            case 38:
              return this.readToken_pipe_amp(e4);
            case 94:
              return this.readToken_caret();
            case 43:
            case 45:
              return this.readToken_plus_min(e4);
            case 60:
            case 62:
              return this.readToken_lt_gt(e4);
            case 61:
            case 33:
              return this.readToken_eq_excl(e4);
            case 63:
              return this.readToken_question();
            case 126:
              return this.finishOp(f.prefix, 1);
            case 35:
              return this.readToken_numberSign();
          }
          this.raise(this.pos, "Unexpected character '" + codePointToString(e4) + "'");
        }, ce.finishOp = function(e4, t4) {
          var i6 = this.input.slice(this.pos, this.pos + t4);
          return this.pos += t4, this.finishToken(e4, i6);
        }, ce.readRegexp = function() {
          for (var e4, t4, i6 = this.pos; ; ) {
            this.pos >= this.input.length && this.raise(i6, "Unterminated regular expression");
            var s3 = this.input.charAt(this.pos);
            if (m.test(s3) && this.raise(i6, "Unterminated regular expression"), e4) e4 = false;
            else {
              if ("[" === s3) t4 = true;
              else if ("]" === s3 && t4) t4 = false;
              else if ("/" === s3 && !t4) break;
              e4 = "\\" === s3;
            }
            ++this.pos;
          }
          var r4 = this.input.slice(i6, this.pos);
          ++this.pos;
          var n3 = this.pos, a4 = this.readWord1();
          this.containsEsc && this.unexpected(n3);
          var o2 = this.regexpState || (this.regexpState = new acorn_RegExpValidationState(this));
          o2.reset(i6, r4, a4), this.validateRegExpFlags(o2), this.validateRegExpPattern(o2);
          var h2 = null;
          try {
            h2 = new RegExp(r4, a4);
          } catch (e5) {
          }
          return this.finishToken(f.regexp, { pattern: r4, flags: a4, value: h2 });
        }, ce.readInt = function(e4, t4, i6) {
          for (var s3 = this.options.ecmaVersion >= 12 && void 0 === t4, r4 = i6 && 48 === this.input.charCodeAt(this.pos), n3 = this.pos, a4 = 0, o2 = 0, h2 = 0, c3 = null == t4 ? 1 / 0 : t4; h2 < c3; ++h2, ++this.pos) {
            var p2 = this.input.charCodeAt(this.pos), l2 = void 0;
            if (s3 && 95 === p2) r4 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"), 95 === o2 && this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"), 0 === h2 && this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"), o2 = p2;
            else {
              if ((l2 = p2 >= 97 ? p2 - 97 + 10 : p2 >= 65 ? p2 - 65 + 10 : p2 >= 48 && p2 <= 57 ? p2 - 48 : 1 / 0) >= e4) break;
              o2 = p2, a4 = a4 * e4 + l2;
            }
          }
          return s3 && 95 === o2 && this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"), this.pos === n3 || null != t4 && this.pos - n3 !== t4 ? null : a4;
        }, ce.readRadixNumber = function(e4) {
          var t4 = this.pos;
          this.pos += 2;
          var i6 = this.readInt(e4);
          return null == i6 && this.raise(this.start + 2, "Expected number in radix " + e4), this.options.ecmaVersion >= 11 && 110 === this.input.charCodeAt(this.pos) ? (i6 = stringToBigInt(this.input.slice(t4, this.pos)), ++this.pos) : isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(f.num, i6);
        }, ce.readNumber = function(e4) {
          var t4 = this.pos;
          e4 || null !== this.readInt(10, void 0, true) || this.raise(t4, "Invalid number");
          var i6 = this.pos - t4 >= 2 && 48 === this.input.charCodeAt(t4);
          i6 && this.strict && this.raise(t4, "Invalid number");
          var s3 = this.input.charCodeAt(this.pos);
          if (!i6 && !e4 && this.options.ecmaVersion >= 11 && 110 === s3) {
            var r4 = stringToBigInt(this.input.slice(t4, this.pos));
            return ++this.pos, isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(f.num, r4);
          }
          i6 && /[89]/.test(this.input.slice(t4, this.pos)) && (i6 = false), 46 !== s3 || i6 || (++this.pos, this.readInt(10), s3 = this.input.charCodeAt(this.pos)), 69 !== s3 && 101 !== s3 || i6 || (43 !== (s3 = this.input.charCodeAt(++this.pos)) && 45 !== s3 || ++this.pos, null === this.readInt(10) && this.raise(t4, "Invalid number")), isIdentifierStart(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
          var n3, a4 = (n3 = this.input.slice(t4, this.pos), i6 ? parseInt(n3, 8) : parseFloat(n3.replace(/_/g, "")));
          return this.finishToken(f.num, a4);
        }, ce.readCodePoint = function() {
          var e4;
          if (123 === this.input.charCodeAt(this.pos)) {
            this.options.ecmaVersion < 6 && this.unexpected();
            var t4 = ++this.pos;
            e4 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, e4 > 1114111 && this.invalidStringToken(t4, "Code point out of bounds");
          } else e4 = this.readHexChar(4);
          return e4;
        }, ce.readString = function(e4) {
          for (var t4 = "", i6 = ++this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
            var s3 = this.input.charCodeAt(this.pos);
            if (s3 === e4) break;
            92 === s3 ? (t4 += this.input.slice(i6, this.pos), t4 += this.readEscapedChar(false), i6 = this.pos) : 8232 === s3 || 8233 === s3 ? (this.options.ecmaVersion < 10 && this.raise(this.start, "Unterminated string constant"), ++this.pos, this.options.locations && (this.curLine++, this.lineStart = this.pos)) : (isNewLine(s3) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
          }
          return t4 += this.input.slice(i6, this.pos++), this.finishToken(f.string, t4);
        };
        var pe = {};
        ce.tryReadTemplateToken = function() {
          this.inTemplateElement = true;
          try {
            this.readTmplToken();
          } catch (e4) {
            if (e4 !== pe) throw e4;
            this.readInvalidTemplateToken();
          }
          this.inTemplateElement = false;
        }, ce.invalidStringToken = function(e4, t4) {
          if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw pe;
          this.raise(e4, t4);
        }, ce.readTmplToken = function() {
          for (var e4 = "", t4 = this.pos; ; ) {
            this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
            var i6 = this.input.charCodeAt(this.pos);
            if (96 === i6 || 36 === i6 && 123 === this.input.charCodeAt(this.pos + 1)) return this.pos !== this.start || this.type !== f.template && this.type !== f.invalidTemplate ? (e4 += this.input.slice(t4, this.pos), this.finishToken(f.template, e4)) : 36 === i6 ? (this.pos += 2, this.finishToken(f.dollarBraceL)) : (++this.pos, this.finishToken(f.backQuote));
            if (92 === i6) e4 += this.input.slice(t4, this.pos), e4 += this.readEscapedChar(true), t4 = this.pos;
            else if (isNewLine(i6)) {
              switch (e4 += this.input.slice(t4, this.pos), ++this.pos, i6) {
                case 13:
                  10 === this.input.charCodeAt(this.pos) && ++this.pos;
                case 10:
                  e4 += "\n";
                  break;
                default:
                  e4 += String.fromCharCode(i6);
              }
              this.options.locations && (++this.curLine, this.lineStart = this.pos), t4 = this.pos;
            } else ++this.pos;
          }
        }, ce.readInvalidTemplateToken = function() {
          for (; this.pos < this.input.length; this.pos++) switch (this.input[this.pos]) {
            case "\\":
              ++this.pos;
              break;
            case "$":
              if ("{" !== this.input[this.pos + 1]) break;
            case "`":
              return this.finishToken(f.invalidTemplate, this.input.slice(this.start, this.pos));
            case "\r":
              "\n" === this.input[this.pos + 1] && ++this.pos;
            case "\n":
            case "\u2028":
            case "\u2029":
              ++this.curLine, this.lineStart = this.pos + 1;
          }
          this.raise(this.start, "Unterminated template");
        }, ce.readEscapedChar = function(e4) {
          var t4 = this.input.charCodeAt(++this.pos);
          switch (++this.pos, t4) {
            case 110:
              return "\n";
            case 114:
              return "\r";
            case 120:
              return String.fromCharCode(this.readHexChar(2));
            case 117:
              return codePointToString(this.readCodePoint());
            case 116:
              return "	";
            case 98:
              return "\b";
            case 118:
              return "\v";
            case 102:
              return "\f";
            case 13:
              10 === this.input.charCodeAt(this.pos) && ++this.pos;
            case 10:
              return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
            case 56:
            case 57:
              if (this.strict && this.invalidStringToken(this.pos - 1, "Invalid escape sequence"), e4) {
                var i6 = this.pos - 1;
                this.invalidStringToken(i6, "Invalid escape sequence in template string");
              }
            default:
              if (t4 >= 48 && t4 <= 55) {
                var s3 = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], r4 = parseInt(s3, 8);
                return r4 > 255 && (s3 = s3.slice(0, -1), r4 = parseInt(s3, 8)), this.pos += s3.length - 1, t4 = this.input.charCodeAt(this.pos), "0" === s3 && 56 !== t4 && 57 !== t4 || !this.strict && !e4 || this.invalidStringToken(this.pos - 1 - s3.length, e4 ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(r4);
              }
              return isNewLine(t4) ? (this.options.locations && (this.lineStart = this.pos, ++this.curLine), "") : String.fromCharCode(t4);
          }
        }, ce.readHexChar = function(e4) {
          var t4 = this.pos, i6 = this.readInt(16, e4);
          return null === i6 && this.invalidStringToken(t4, "Bad character escape sequence"), i6;
        }, ce.readWord1 = function() {
          this.containsEsc = false;
          for (var e4 = "", t4 = true, i6 = this.pos, s3 = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
            var r4 = this.fullCharCodeAtPos();
            if (isIdentifierChar(r4, s3)) this.pos += r4 <= 65535 ? 1 : 2;
            else {
              if (92 !== r4) break;
              this.containsEsc = true, e4 += this.input.slice(i6, this.pos);
              var n3 = this.pos;
              117 !== this.input.charCodeAt(++this.pos) && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
              var a4 = this.readCodePoint();
              (t4 ? isIdentifierStart : isIdentifierChar)(a4, s3) || this.invalidStringToken(n3, "Invalid Unicode escape"), e4 += codePointToString(a4), i6 = this.pos;
            }
            t4 = false;
          }
          return e4 + this.input.slice(i6, this.pos);
        }, ce.readWord = function() {
          var e4 = this.readWord1(), t4 = f.name;
          return this.keywords.test(e4) && (t4 = d[e4]), this.finishToken(t4, e4);
        };
        acorn_Parser.acorn = { Parser: acorn_Parser, version: "8.15.0", defaultOptions: I, Position: acorn_Position, SourceLocation: acorn_SourceLocation, getLineInfo, Node: acorn_Node, TokenType: acorn_TokenType, tokTypes: f, keywordTypes: d, TokContext: acorn_TokContext, tokContexts: F, isIdentifierChar, isIdentifierStart, Token: acorn_Token, isNewLine, lineBreak: m, lineBreakG: g, nonASCIIwhitespace: x };
        const le = __require("node:module"), ue = __require("node:fs");
        String.fromCharCode;
        const de = /\/$|\/\?|\/#/, fe = /^\.?\//;
        function hasTrailingSlash(e4 = "", t4) {
          return t4 ? de.test(e4) : e4.endsWith("/");
        }
        __name(hasTrailingSlash, "hasTrailingSlash");
        function withTrailingSlash(e4 = "", t4) {
          if (!t4) return e4.endsWith("/") ? e4 : e4 + "/";
          if (hasTrailingSlash(e4, true)) return e4 || "/";
          let i6 = e4, s3 = "";
          const r4 = e4.indexOf("#");
          if (-1 !== r4 && (i6 = e4.slice(0, r4), s3 = e4.slice(r4), !i6)) return s3;
          const [n3, ...a4] = i6.split("?");
          return n3 + "/" + (a4.length > 0 ? `?${a4.join("?")}` : "") + s3;
        }
        __name(withTrailingSlash, "withTrailingSlash");
        function isNonEmptyURL(e4) {
          return e4 && "/" !== e4;
        }
        __name(isNonEmptyURL, "isNonEmptyURL");
        function dist_joinURL(e4, ...t4) {
          let i6 = e4 || "";
          for (const e5 of t4.filter((e6) => isNonEmptyURL(e6))) if (i6) {
            const t5 = e5.replace(fe, "");
            i6 = withTrailingSlash(i6) + t5;
          } else i6 = e5;
          return i6;
        }
        __name(dist_joinURL, "dist_joinURL");
        Symbol.for("ufo:protocolRelative");
        const me = /^[A-Za-z]:\//;
        function pathe_M_eThtNZ_normalizeWindowsPath(e4 = "") {
          return e4 ? e4.replace(/\\/g, "/").replace(me, (e5) => e5.toUpperCase()) : e4;
        }
        __name(pathe_M_eThtNZ_normalizeWindowsPath, "pathe_M_eThtNZ_normalizeWindowsPath");
        const ge = /^[/\\]{2}/, xe = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/, ve = /^[A-Za-z]:$/, ye = /.(\.[^./]+|\.)$/, pathe_M_eThtNZ_normalize = /* @__PURE__ */ __name(function(e4) {
          if (0 === e4.length) return ".";
          const t4 = (e4 = pathe_M_eThtNZ_normalizeWindowsPath(e4)).match(ge), i6 = isAbsolute3(e4), s3 = "/" === e4[e4.length - 1];
          return 0 === (e4 = normalizeString(e4, !i6)).length ? i6 ? "/" : s3 ? "./" : "." : (s3 && (e4 += "/"), ve.test(e4) && (e4 += "/"), t4 ? i6 ? `//${e4}` : `//./${e4}` : i6 && !isAbsolute3(e4) ? `/${e4}` : e4);
        }, "pathe_M_eThtNZ_normalize"), pathe_M_eThtNZ_join = /* @__PURE__ */ __name(function(...e4) {
          let t4 = "";
          for (const i6 of e4) if (i6) if (t4.length > 0) {
            const e5 = "/" === t4[t4.length - 1], s3 = "/" === i6[0];
            t4 += e5 && s3 ? i6.slice(1) : e5 || s3 ? i6 : `/${i6}`;
          } else t4 += i6;
          return pathe_M_eThtNZ_normalize(t4);
        }, "pathe_M_eThtNZ_join");
        function pathe_M_eThtNZ_cwd() {
          return "undefined" != typeof process && "function" == typeof process.cwd ? process.cwd().replace(/\\/g, "/") : "/";
        }
        __name(pathe_M_eThtNZ_cwd, "pathe_M_eThtNZ_cwd");
        const pathe_M_eThtNZ_resolve = /* @__PURE__ */ __name(function(...e4) {
          let t4 = "", i6 = false;
          for (let s3 = (e4 = e4.map((e5) => pathe_M_eThtNZ_normalizeWindowsPath(e5))).length - 1; s3 >= -1 && !i6; s3--) {
            const r4 = s3 >= 0 ? e4[s3] : pathe_M_eThtNZ_cwd();
            r4 && 0 !== r4.length && (t4 = `${r4}/${t4}`, i6 = isAbsolute3(r4));
          }
          return t4 = normalizeString(t4, !i6), i6 && !isAbsolute3(t4) ? `/${t4}` : t4.length > 0 ? t4 : ".";
        }, "pathe_M_eThtNZ_resolve");
        function normalizeString(e4, t4) {
          let i6 = "", s3 = 0, r4 = -1, n3 = 0, a4 = null;
          for (let o2 = 0; o2 <= e4.length; ++o2) {
            if (o2 < e4.length) a4 = e4[o2];
            else {
              if ("/" === a4) break;
              a4 = "/";
            }
            if ("/" === a4) {
              if (r4 === o2 - 1 || 1 === n3) ;
              else if (2 === n3) {
                if (i6.length < 2 || 2 !== s3 || "." !== i6[i6.length - 1] || "." !== i6[i6.length - 2]) {
                  if (i6.length > 2) {
                    const e5 = i6.lastIndexOf("/");
                    -1 === e5 ? (i6 = "", s3 = 0) : (i6 = i6.slice(0, e5), s3 = i6.length - 1 - i6.lastIndexOf("/")), r4 = o2, n3 = 0;
                    continue;
                  }
                  if (i6.length > 0) {
                    i6 = "", s3 = 0, r4 = o2, n3 = 0;
                    continue;
                  }
                }
                t4 && (i6 += i6.length > 0 ? "/.." : "..", s3 = 2);
              } else i6.length > 0 ? i6 += `/${e4.slice(r4 + 1, o2)}` : i6 = e4.slice(r4 + 1, o2), s3 = o2 - r4 - 1;
              r4 = o2, n3 = 0;
            } else "." === a4 && -1 !== n3 ? ++n3 : n3 = -1;
          }
          return i6;
        }
        __name(normalizeString, "normalizeString");
        const isAbsolute3 = /* @__PURE__ */ __name(function(e4) {
          return xe.test(e4);
        }, "isAbsolute"), extname3 = /* @__PURE__ */ __name(function(e4) {
          if (".." === e4) return "";
          const t4 = ye.exec(pathe_M_eThtNZ_normalizeWindowsPath(e4));
          return t4 && t4[1] || "";
        }, "extname"), pathe_M_eThtNZ_dirname = /* @__PURE__ */ __name(function(e4) {
          const t4 = pathe_M_eThtNZ_normalizeWindowsPath(e4).replace(/\/$/, "").split("/").slice(0, -1);
          return 1 === t4.length && ve.test(t4[0]) && (t4[0] += "/"), t4.join("/") || (isAbsolute3(e4) ? "/" : ".");
        }, "pathe_M_eThtNZ_dirname"), basename2 = /* @__PURE__ */ __name(function(e4, t4) {
          const i6 = pathe_M_eThtNZ_normalizeWindowsPath(e4).split("/");
          let s3 = "";
          for (let e5 = i6.length - 1; e5 >= 0; e5--) {
            const t5 = i6[e5];
            if (t5) {
              s3 = t5;
              break;
            }
          }
          return t4 && s3.endsWith(t4) ? s3.slice(0, -t4.length) : s3;
        }, "basename"), _e = __require("node:url"), Ee = __require("node:assert"), be = __require("node:process"), Se = __require("node:path"), ke = __require("node:v8"), we = __require("node:util"), Ie = new Set(le.builtinModules);
        function normalizeSlash(e4) {
          return e4.replace(/\\/g, "/");
        }
        __name(normalizeSlash, "normalizeSlash");
        const Ce = {}.hasOwnProperty, Re = /^([A-Z][a-z\d]*)+$/, Pe = /* @__PURE__ */ new Set(["string", "function", "number", "object", "Function", "Object", "boolean", "bigint", "symbol"]), Te = {};
        function formatList2(e4, t4 = "and") {
          return e4.length < 3 ? e4.join(` ${t4} `) : `${e4.slice(0, -1).join(", ")}, ${t4} ${e4[e4.length - 1]}`;
        }
        __name(formatList2, "formatList");
        const Ae = /* @__PURE__ */ new Map();
        let Ne;
        function createError2(e4, t4, i6) {
          return Ae.set(e4, t4), /* @__PURE__ */ function(e5, t5) {
            return NodeError;
            function NodeError(...i7) {
              const s3 = Error.stackTraceLimit;
              isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = 0);
              const r4 = new e5();
              isErrorStackTraceLimitWritable() && (Error.stackTraceLimit = s3);
              const n3 = function(e6, t6, i8) {
                const s4 = Ae.get(e6);
                if (Ee(void 0 !== s4, "expected `message` to be found"), "function" == typeof s4) return Ee(s4.length <= t6.length, `Code: ${e6}; The provided arguments length (${t6.length}) does not match the required ones (${s4.length}).`), Reflect.apply(s4, i8, t6);
                const r5 = /%[dfijoOs]/g;
                let n4 = 0;
                for (; null !== r5.exec(s4); ) n4++;
                return Ee(n4 === t6.length, `Code: ${e6}; The provided arguments length (${t6.length}) does not match the required ones (${n4}).`), 0 === t6.length ? s4 : (t6.unshift(s4), Reflect.apply(we.format, null, t6));
              }(t5, i7, r4);
              return Object.defineProperties(r4, { message: { value: n3, enumerable: false, writable: true, configurable: true }, toString: { value() {
                return `${this.name} [${t5}]: ${this.message}`;
              }, enumerable: false, writable: true, configurable: true } }), Le(r4), r4.code = t5, r4;
            }
            __name(NodeError, "NodeError");
          }(i6, e4);
        }
        __name(createError2, "createError");
        function isErrorStackTraceLimitWritable() {
          try {
            if (ke.startupSnapshot.isBuildingSnapshot()) return false;
          } catch {
          }
          const e4 = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
          return void 0 === e4 ? Object.isExtensible(Error) : Ce.call(e4, "writable") && void 0 !== e4.writable ? e4.writable : void 0 !== e4.set;
        }
        __name(isErrorStackTraceLimitWritable, "isErrorStackTraceLimitWritable");
        Te.ERR_INVALID_ARG_TYPE = createError2("ERR_INVALID_ARG_TYPE", (e4, t4, i6) => {
          Ee("string" == typeof e4, "'name' must be a string"), Array.isArray(t4) || (t4 = [t4]);
          let s3 = "The ";
          if (e4.endsWith(" argument")) s3 += `${e4} `;
          else {
            const t5 = e4.includes(".") ? "property" : "argument";
            s3 += `"${e4}" ${t5} `;
          }
          s3 += "must be ";
          const r4 = [], n3 = [], a4 = [];
          for (const e5 of t4) Ee("string" == typeof e5, "All expected entries have to be of type string"), Pe.has(e5) ? r4.push(e5.toLowerCase()) : null === Re.exec(e5) ? (Ee("object" !== e5, 'The value "object" should be written as "Object"'), a4.push(e5)) : n3.push(e5);
          if (n3.length > 0) {
            const e5 = r4.indexOf("object");
            -1 !== e5 && (r4.slice(e5, 1), n3.push("Object"));
          }
          return r4.length > 0 && (s3 += `${r4.length > 1 ? "one of type" : "of type"} ${formatList2(r4, "or")}`, (n3.length > 0 || a4.length > 0) && (s3 += " or ")), n3.length > 0 && (s3 += `an instance of ${formatList2(n3, "or")}`, a4.length > 0 && (s3 += " or ")), a4.length > 0 && (a4.length > 1 ? s3 += `one of ${formatList2(a4, "or")}` : (a4[0].toLowerCase() !== a4[0] && (s3 += "an "), s3 += `${a4[0]}`)), s3 += `. Received ${function(e5) {
            if (null == e5) return String(e5);
            if ("function" == typeof e5 && e5.name) return `function ${e5.name}`;
            if ("object" == typeof e5) return e5.constructor && e5.constructor.name ? `an instance of ${e5.constructor.name}` : `${(0, we.inspect)(e5, { depth: -1 })}`;
            let t5 = (0, we.inspect)(e5, { colors: false });
            t5.length > 28 && (t5 = `${t5.slice(0, 25)}...`);
            return `type ${typeof e5} (${t5})`;
          }(i6)}`, s3;
        }, TypeError), Te.ERR_INVALID_MODULE_SPECIFIER = createError2("ERR_INVALID_MODULE_SPECIFIER", (e4, t4, i6 = void 0) => `Invalid module "${e4}" ${t4}${i6 ? ` imported from ${i6}` : ""}`, TypeError), Te.ERR_INVALID_PACKAGE_CONFIG = createError2("ERR_INVALID_PACKAGE_CONFIG", (e4, t4, i6) => `Invalid package config ${e4}${t4 ? ` while importing ${t4}` : ""}${i6 ? `. ${i6}` : ""}`, Error), Te.ERR_INVALID_PACKAGE_TARGET = createError2("ERR_INVALID_PACKAGE_TARGET", (e4, t4, i6, s3 = false, r4 = void 0) => {
          const n3 = "string" == typeof i6 && !s3 && i6.length > 0 && !i6.startsWith("./");
          return "." === t4 ? (Ee(false === s3), `Invalid "exports" main target ${JSON.stringify(i6)} defined in the package config ${e4}package.json${r4 ? ` imported from ${r4}` : ""}${n3 ? '; targets must start with "./"' : ""}`) : `Invalid "${s3 ? "imports" : "exports"}" target ${JSON.stringify(i6)} defined for '${t4}' in the package config ${e4}package.json${r4 ? ` imported from ${r4}` : ""}${n3 ? '; targets must start with "./"' : ""}`;
        }, Error), Te.ERR_MODULE_NOT_FOUND = createError2("ERR_MODULE_NOT_FOUND", (e4, t4, i6 = false) => `Cannot find ${i6 ? "module" : "package"} '${e4}' imported from ${t4}`, Error), Te.ERR_NETWORK_IMPORT_DISALLOWED = createError2("ERR_NETWORK_IMPORT_DISALLOWED", "import of '%s' by %s is not supported: %s", Error), Te.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError2("ERR_PACKAGE_IMPORT_NOT_DEFINED", (e4, t4, i6) => `Package import specifier "${e4}" is not defined${t4 ? ` in package ${t4}package.json` : ""} imported from ${i6}`, TypeError), Te.ERR_PACKAGE_PATH_NOT_EXPORTED = createError2("ERR_PACKAGE_PATH_NOT_EXPORTED", (e4, t4, i6 = void 0) => "." === t4 ? `No "exports" main defined in ${e4}package.json${i6 ? ` imported from ${i6}` : ""}` : `Package subpath '${t4}' is not defined by "exports" in ${e4}package.json${i6 ? ` imported from ${i6}` : ""}`, Error), Te.ERR_UNSUPPORTED_DIR_IMPORT = createError2("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error), Te.ERR_UNSUPPORTED_RESOLVE_REQUEST = createError2("ERR_UNSUPPORTED_RESOLVE_REQUEST", 'Failed to resolve module specifier "%s" from "%s": Invalid relative URL or base scheme is not hierarchical.', TypeError), Te.ERR_UNKNOWN_FILE_EXTENSION = createError2("ERR_UNKNOWN_FILE_EXTENSION", (e4, t4) => `Unknown file extension "${e4}" for ${t4}`, TypeError), Te.ERR_INVALID_ARG_VALUE = createError2("ERR_INVALID_ARG_VALUE", (e4, t4, i6 = "is invalid") => {
          let s3 = (0, we.inspect)(t4);
          s3.length > 128 && (s3 = `${s3.slice(0, 128)}...`);
          return `The ${e4.includes(".") ? "property" : "argument"} '${e4}' ${i6}. Received ${s3}`;
        }, TypeError);
        const Le = function(e4) {
          const t4 = "__node_internal_" + e4.name;
          return Object.defineProperty(e4, "name", { value: t4 }), e4;
        }(function(e4) {
          const t4 = isErrorStackTraceLimitWritable();
          return t4 && (Ne = Error.stackTraceLimit, Error.stackTraceLimit = Number.POSITIVE_INFINITY), Error.captureStackTrace(e4), t4 && (Error.stackTraceLimit = Ne), e4;
        });
        const Oe = {}.hasOwnProperty, { ERR_INVALID_PACKAGE_CONFIG: De } = Te, Ve = /* @__PURE__ */ new Map();
        function read3(e4, { base: t4, specifier: i6 }) {
          const s3 = Ve.get(e4);
          if (s3) return s3;
          let r4;
          try {
            r4 = ue.readFileSync(Se.toNamespacedPath(e4), "utf8");
          } catch (e5) {
            const t5 = e5;
            if ("ENOENT" !== t5.code) throw t5;
          }
          const n3 = { exists: false, pjsonPath: e4, main: void 0, name: void 0, type: "none", exports: void 0, imports: void 0 };
          if (void 0 !== r4) {
            let s4;
            try {
              s4 = JSON.parse(r4);
            } catch (s5) {
              const r5 = s5, n4 = new De(e4, (t4 ? `"${i6}" from ` : "") + (0, _e.fileURLToPath)(t4 || i6), r5.message);
              throw n4.cause = r5, n4;
            }
            n3.exists = true, Oe.call(s4, "name") && "string" == typeof s4.name && (n3.name = s4.name), Oe.call(s4, "main") && "string" == typeof s4.main && (n3.main = s4.main), Oe.call(s4, "exports") && (n3.exports = s4.exports), Oe.call(s4, "imports") && (n3.imports = s4.imports), !Oe.call(s4, "type") || "commonjs" !== s4.type && "module" !== s4.type || (n3.type = s4.type);
          }
          return Ve.set(e4, n3), n3;
        }
        __name(read3, "read");
        function getPackageScopeConfig2(e4) {
          let t4 = new URL("package.json", e4);
          for (; ; ) {
            if (t4.pathname.endsWith("node_modules/package.json")) break;
            const i6 = read3((0, _e.fileURLToPath)(t4), { specifier: e4 });
            if (i6.exists) return i6;
            const s3 = t4;
            if (t4 = new URL("../package.json", t4), t4.pathname === s3.pathname) break;
          }
          return { pjsonPath: (0, _e.fileURLToPath)(t4), exists: false, type: "none" };
        }
        __name(getPackageScopeConfig2, "getPackageScopeConfig");
        function getPackageType(e4) {
          return getPackageScopeConfig2(e4).type;
        }
        __name(getPackageType, "getPackageType");
        const { ERR_UNKNOWN_FILE_EXTENSION: Ue } = Te, Me = {}.hasOwnProperty, je = { __proto__: null, ".cjs": "commonjs", ".js": "module", ".json": "json", ".mjs": "module" };
        const Fe = { __proto__: null, "data:": /* @__PURE__ */ __name(function(e4) {
          const { 1: t4 } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(e4.pathname) || [null, null, null];
          return function(e5) {
            return e5 && /\s*(text|application)\/javascript\s*(;\s*charset=utf-?8\s*)?/i.test(e5) ? "module" : "application/json" === e5 ? "json" : null;
          }(t4);
        }, "data:"), "file:": /* @__PURE__ */ __name(function(e4, t4, i6) {
          const s3 = function(e5) {
            const t5 = e5.pathname;
            let i7 = t5.length;
            for (; i7--; ) {
              const e6 = t5.codePointAt(i7);
              if (47 === e6) return "";
              if (46 === e6) return 47 === t5.codePointAt(i7 - 1) ? "" : t5.slice(i7);
            }
            return "";
          }(e4);
          if (".js" === s3) {
            const t5 = getPackageType(e4);
            return "none" !== t5 ? t5 : "commonjs";
          }
          if ("" === s3) {
            const t5 = getPackageType(e4);
            return "none" === t5 || "commonjs" === t5 ? "commonjs" : "module";
          }
          const r4 = je[s3];
          if (r4) return r4;
          if (i6) return;
          const n3 = (0, _e.fileURLToPath)(e4);
          throw new Ue(s3, n3);
        }, "file:"), "http:": getHttpProtocolModuleFormat, "https:": getHttpProtocolModuleFormat, "node:": /* @__PURE__ */ __name(() => "builtin", "node:") };
        function getHttpProtocolModuleFormat() {
        }
        __name(getHttpProtocolModuleFormat, "getHttpProtocolModuleFormat");
        const Be = RegExp.prototype[Symbol.replace], { ERR_INVALID_MODULE_SPECIFIER: $e, ERR_INVALID_PACKAGE_CONFIG: qe, ERR_INVALID_PACKAGE_TARGET: We, ERR_MODULE_NOT_FOUND: Ge, ERR_PACKAGE_IMPORT_NOT_DEFINED: He, ERR_PACKAGE_PATH_NOT_EXPORTED: Ke, ERR_UNSUPPORTED_DIR_IMPORT: ze, ERR_UNSUPPORTED_RESOLVE_REQUEST: Je } = Te, Ye = {}.hasOwnProperty, Qe = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i, Ze = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i, Xe = /^\.|%|\\/, et = /\*/g, tt = /%2f|%5c/i, it = /* @__PURE__ */ new Set(), st = /[/\\]{2}/;
        function emitInvalidSegmentDeprecation2(e4, t4, i6, s3, r4, n3, a4) {
          if (be.noDeprecation) return;
          const o2 = (0, _e.fileURLToPath)(s3), h2 = null !== st.exec(a4 ? e4 : t4);
          be.emitWarning(`Use of deprecated ${h2 ? "double slash" : "leading or trailing slash matching"} resolving "${e4}" for module request "${t4}" ${t4 === i6 ? "" : `matched to "${i6}" `}in the "${r4 ? "imports" : "exports"}" field module resolution of the package at ${o2}${n3 ? ` imported from ${(0, _e.fileURLToPath)(n3)}` : ""}.`, "DeprecationWarning", "DEP0166");
        }
        __name(emitInvalidSegmentDeprecation2, "emitInvalidSegmentDeprecation");
        function emitLegacyIndexDeprecation2(e4, t4, i6, s3) {
          if (be.noDeprecation) return;
          const r4 = function(e5, t5) {
            const i7 = e5.protocol;
            return Me.call(Fe, i7) && Fe[i7](e5, t5, true) || null;
          }(e4, { parentURL: i6.href });
          if ("module" !== r4) return;
          const n3 = (0, _e.fileURLToPath)(e4.href), a4 = (0, _e.fileURLToPath)(new _e.URL(".", t4)), o2 = (0, _e.fileURLToPath)(i6);
          s3 ? Se.resolve(a4, s3) !== n3 && be.emitWarning(`Package ${a4} has a "main" field set to "${s3}", excluding the full filename and extension to the resolved file at "${n3.slice(a4.length)}", imported from ${o2}.
 Automatic extension resolution of the "main" field is deprecated for ES modules.`, "DeprecationWarning", "DEP0151") : be.emitWarning(`No "main" or "exports" field defined in the package.json for ${a4} resolving the main entry point "${n3.slice(a4.length)}", imported from ${o2}.
Default "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
        }
        __name(emitLegacyIndexDeprecation2, "emitLegacyIndexDeprecation");
        function tryStatSync2(e4) {
          try {
            return (0, ue.statSync)(e4);
          } catch {
          }
        }
        __name(tryStatSync2, "tryStatSync");
        function fileExists2(e4) {
          const t4 = (0, ue.statSync)(e4, { throwIfNoEntry: false }), i6 = t4 ? t4.isFile() : void 0;
          return null != i6 && i6;
        }
        __name(fileExists2, "fileExists");
        function legacyMainResolve2(e4, t4, i6) {
          let s3;
          if (void 0 !== t4.main) {
            if (s3 = new _e.URL(t4.main, e4), fileExists2(s3)) return s3;
            const r5 = [`./${t4.main}.js`, `./${t4.main}.json`, `./${t4.main}.node`, `./${t4.main}/index.js`, `./${t4.main}/index.json`, `./${t4.main}/index.node`];
            let n4 = -1;
            for (; ++n4 < r5.length && (s3 = new _e.URL(r5[n4], e4), !fileExists2(s3)); ) s3 = void 0;
            if (s3) return emitLegacyIndexDeprecation2(s3, e4, i6, t4.main), s3;
          }
          const r4 = ["./index.js", "./index.json", "./index.node"];
          let n3 = -1;
          for (; ++n3 < r4.length && (s3 = new _e.URL(r4[n3], e4), !fileExists2(s3)); ) s3 = void 0;
          if (s3) return emitLegacyIndexDeprecation2(s3, e4, i6, t4.main), s3;
          throw new Ge((0, _e.fileURLToPath)(new _e.URL(".", e4)), (0, _e.fileURLToPath)(i6));
        }
        __name(legacyMainResolve2, "legacyMainResolve");
        function exportsNotFound2(e4, t4, i6) {
          return new Ke((0, _e.fileURLToPath)(new _e.URL(".", t4)), e4, i6 && (0, _e.fileURLToPath)(i6));
        }
        __name(exportsNotFound2, "exportsNotFound");
        function invalidPackageTarget2(e4, t4, i6, s3, r4) {
          return t4 = "object" == typeof t4 && null !== t4 ? JSON.stringify(t4, null, "") : `${t4}`, new We((0, _e.fileURLToPath)(new _e.URL(".", i6)), e4, t4, s3, r4 && (0, _e.fileURLToPath)(r4));
        }
        __name(invalidPackageTarget2, "invalidPackageTarget");
        function resolvePackageTargetString2(e4, t4, i6, s3, r4, n3, a4, o2, h2) {
          if ("" !== t4 && !n3 && "/" !== e4[e4.length - 1]) throw invalidPackageTarget2(i6, e4, s3, a4, r4);
          if (!e4.startsWith("./")) {
            if (a4 && !e4.startsWith("../") && !e4.startsWith("/")) {
              let i7 = false;
              try {
                new _e.URL(e4), i7 = true;
              } catch {
              }
              if (!i7) {
                return packageResolve2(n3 ? Be.call(et, e4, () => t4) : e4 + t4, s3, h2);
              }
            }
            throw invalidPackageTarget2(i6, e4, s3, a4, r4);
          }
          if (null !== Qe.exec(e4.slice(2))) {
            if (null !== Ze.exec(e4.slice(2))) throw invalidPackageTarget2(i6, e4, s3, a4, r4);
            if (!o2) {
              const o3 = n3 ? i6.replace("*", () => t4) : i6 + t4;
              emitInvalidSegmentDeprecation2(n3 ? Be.call(et, e4, () => t4) : e4, o3, i6, s3, a4, r4, true);
            }
          }
          const c3 = new _e.URL(e4, s3), p2 = c3.pathname, l2 = new _e.URL(".", s3).pathname;
          if (!p2.startsWith(l2)) throw invalidPackageTarget2(i6, e4, s3, a4, r4);
          if ("" === t4) return c3;
          if (null !== Qe.exec(t4)) {
            const h3 = n3 ? i6.replace("*", () => t4) : i6 + t4;
            if (null === Ze.exec(t4)) {
              if (!o2) {
                emitInvalidSegmentDeprecation2(n3 ? Be.call(et, e4, () => t4) : e4, h3, i6, s3, a4, r4, false);
              }
            } else !function(e5, t5, i7, s4, r5) {
              const n4 = `request is not a valid match in pattern "${t5}" for the "${s4 ? "imports" : "exports"}" resolution of ${(0, _e.fileURLToPath)(i7)}`;
              throw new $e(e5, n4, r5 && (0, _e.fileURLToPath)(r5));
            }(h3, i6, s3, a4, r4);
          }
          return n3 ? new _e.URL(Be.call(et, c3.href, () => t4)) : new _e.URL(t4, c3);
        }
        __name(resolvePackageTargetString2, "resolvePackageTargetString");
        function isArrayIndex2(e4) {
          const t4 = Number(e4);
          return `${t4}` === e4 && (t4 >= 0 && t4 < 4294967295);
        }
        __name(isArrayIndex2, "isArrayIndex");
        function resolvePackageTarget2(e4, t4, i6, s3, r4, n3, a4, o2, h2) {
          if ("string" == typeof t4) return resolvePackageTargetString2(t4, i6, s3, e4, r4, n3, a4, o2, h2);
          if (Array.isArray(t4)) {
            const c3 = t4;
            if (0 === c3.length) return null;
            let p2, l2 = -1;
            for (; ++l2 < c3.length; ) {
              const t5 = c3[l2];
              let u2;
              try {
                u2 = resolvePackageTarget2(e4, t5, i6, s3, r4, n3, a4, o2, h2);
              } catch (e5) {
                if (p2 = e5, "ERR_INVALID_PACKAGE_TARGET" === e5.code) continue;
                throw e5;
              }
              if (void 0 !== u2) {
                if (null !== u2) return u2;
                p2 = null;
              }
            }
            if (null == p2) return null;
            throw p2;
          }
          if ("object" == typeof t4 && null !== t4) {
            const c3 = Object.getOwnPropertyNames(t4);
            let p2 = -1;
            for (; ++p2 < c3.length; ) {
              if (isArrayIndex2(c3[p2])) throw new qe((0, _e.fileURLToPath)(e4), r4, '"exports" cannot contain numeric property keys.');
            }
            for (p2 = -1; ++p2 < c3.length; ) {
              const l2 = c3[p2];
              if ("default" === l2 || h2 && h2.has(l2)) {
                const c4 = resolvePackageTarget2(e4, t4[l2], i6, s3, r4, n3, a4, o2, h2);
                if (void 0 === c4) continue;
                return c4;
              }
            }
            return null;
          }
          if (null === t4) return null;
          throw invalidPackageTarget2(s3, t4, e4, a4, r4);
        }
        __name(resolvePackageTarget2, "resolvePackageTarget");
        function emitTrailingSlashPatternDeprecation2(e4, t4, i6) {
          if (be.noDeprecation) return;
          const s3 = (0, _e.fileURLToPath)(t4);
          it.has(s3 + "|" + e4) || (it.add(s3 + "|" + e4), be.emitWarning(`Use of deprecated trailing slash pattern mapping "${e4}" in the "exports" field module resolution of the package at ${s3}${i6 ? ` imported from ${(0, _e.fileURLToPath)(i6)}` : ""}. Mapping specifiers ending in "/" is no longer supported.`, "DeprecationWarning", "DEP0155"));
        }
        __name(emitTrailingSlashPatternDeprecation2, "emitTrailingSlashPatternDeprecation");
        function packageExportsResolve2(e4, t4, i6, s3, r4) {
          let n3 = i6.exports;
          if (function(e5, t5, i7) {
            if ("string" == typeof e5 || Array.isArray(e5)) return true;
            if ("object" != typeof e5 || null === e5) return false;
            const s4 = Object.getOwnPropertyNames(e5);
            let r5 = false, n4 = 0, a5 = -1;
            for (; ++a5 < s4.length; ) {
              const e6 = s4[a5], o3 = "" === e6 || "." !== e6[0];
              if (0 === n4++) r5 = o3;
              else if (r5 !== o3) throw new qe((0, _e.fileURLToPath)(t5), i7, `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`);
            }
            return r5;
          }(n3, e4, s3) && (n3 = { ".": n3 }), Ye.call(n3, t4) && !t4.includes("*") && !t4.endsWith("/")) {
            const i7 = resolvePackageTarget2(e4, n3[t4], "", t4, s3, false, false, false, r4);
            if (null == i7) throw exportsNotFound2(t4, e4, s3);
            return i7;
          }
          let a4 = "", o2 = "";
          const h2 = Object.getOwnPropertyNames(n3);
          let c3 = -1;
          for (; ++c3 < h2.length; ) {
            const i7 = h2[c3], r5 = i7.indexOf("*");
            if (-1 !== r5 && t4.startsWith(i7.slice(0, r5))) {
              t4.endsWith("/") && emitTrailingSlashPatternDeprecation2(t4, e4, s3);
              const n4 = i7.slice(r5 + 1);
              t4.length >= i7.length && t4.endsWith(n4) && 1 === patternKeyCompare2(a4, i7) && i7.lastIndexOf("*") === r5 && (a4 = i7, o2 = t4.slice(r5, t4.length - n4.length));
            }
          }
          if (a4) {
            const i7 = resolvePackageTarget2(e4, n3[a4], o2, a4, s3, true, false, t4.endsWith("/"), r4);
            if (null == i7) throw exportsNotFound2(t4, e4, s3);
            return i7;
          }
          throw exportsNotFound2(t4, e4, s3);
        }
        __name(packageExportsResolve2, "packageExportsResolve");
        function patternKeyCompare2(e4, t4) {
          const i6 = e4.indexOf("*"), s3 = t4.indexOf("*"), r4 = -1 === i6 ? e4.length : i6 + 1, n3 = -1 === s3 ? t4.length : s3 + 1;
          return r4 > n3 ? -1 : n3 > r4 || -1 === i6 ? 1 : -1 === s3 || e4.length > t4.length ? -1 : t4.length > e4.length ? 1 : 0;
        }
        __name(patternKeyCompare2, "patternKeyCompare");
        function packageImportsResolve2(e4, t4, i6) {
          if ("#" === e4 || e4.startsWith("#/") || e4.endsWith("/")) {
            throw new $e(e4, "is not a valid internal imports specifier name", (0, _e.fileURLToPath)(t4));
          }
          let s3;
          const r4 = getPackageScopeConfig2(t4);
          if (r4.exists) {
            s3 = (0, _e.pathToFileURL)(r4.pjsonPath);
            const n3 = r4.imports;
            if (n3) if (Ye.call(n3, e4) && !e4.includes("*")) {
              const r5 = resolvePackageTarget2(s3, n3[e4], "", e4, t4, false, true, false, i6);
              if (null != r5) return r5;
            } else {
              let r5 = "", a4 = "";
              const o2 = Object.getOwnPropertyNames(n3);
              let h2 = -1;
              for (; ++h2 < o2.length; ) {
                const t5 = o2[h2], i7 = t5.indexOf("*");
                if (-1 !== i7 && e4.startsWith(t5.slice(0, -1))) {
                  const s4 = t5.slice(i7 + 1);
                  e4.length >= t5.length && e4.endsWith(s4) && 1 === patternKeyCompare2(r5, t5) && t5.lastIndexOf("*") === i7 && (r5 = t5, a4 = e4.slice(i7, e4.length - s4.length));
                }
              }
              if (r5) {
                const e5 = resolvePackageTarget2(s3, n3[r5], a4, r5, t4, true, true, false, i6);
                if (null != e5) return e5;
              }
            }
          }
          throw function(e5, t5, i7) {
            return new He(e5, t5 && (0, _e.fileURLToPath)(new _e.URL(".", t5)), (0, _e.fileURLToPath)(i7));
          }(e4, s3, t4);
        }
        __name(packageImportsResolve2, "packageImportsResolve");
        function packageResolve2(e4, t4, i6) {
          if (le.builtinModules.includes(e4)) return new _e.URL("node:" + e4);
          const { packageName: s3, packageSubpath: r4, isScoped: n3 } = function(e5, t5) {
            let i7 = e5.indexOf("/"), s4 = true, r5 = false;
            "@" === e5[0] && (r5 = true, -1 === i7 || 0 === e5.length ? s4 = false : i7 = e5.indexOf("/", i7 + 1));
            const n4 = -1 === i7 ? e5 : e5.slice(0, i7);
            if (null !== Xe.exec(n4) && (s4 = false), !s4) throw new $e(e5, "is not a valid package name", (0, _e.fileURLToPath)(t5));
            return { packageName: n4, packageSubpath: "." + (-1 === i7 ? "" : e5.slice(i7)), isScoped: r5 };
          }(e4, t4), a4 = getPackageScopeConfig2(t4);
          if (a4.exists) {
            const e5 = (0, _e.pathToFileURL)(a4.pjsonPath);
            if (a4.name === s3 && void 0 !== a4.exports && null !== a4.exports) return packageExportsResolve2(e5, r4, a4, t4, i6);
          }
          let o2, h2 = new _e.URL("./node_modules/" + s3 + "/package.json", t4), c3 = (0, _e.fileURLToPath)(h2);
          do {
            const a5 = tryStatSync2(c3.slice(0, -13));
            if (!a5 || !a5.isDirectory()) {
              o2 = c3, h2 = new _e.URL((n3 ? "../../../../node_modules/" : "../../../node_modules/") + s3 + "/package.json", h2), c3 = (0, _e.fileURLToPath)(h2);
              continue;
            }
            const p2 = read3(c3, { base: t4, specifier: e4 });
            return void 0 !== p2.exports && null !== p2.exports ? packageExportsResolve2(h2, r4, p2, t4, i6) : "." === r4 ? legacyMainResolve2(h2, p2, t4) : new _e.URL(r4, h2);
          } while (c3.length !== o2.length);
          throw new Ge(s3, (0, _e.fileURLToPath)(t4), false);
        }
        __name(packageResolve2, "packageResolve");
        function moduleResolve2(e4, t4, i6, s3) {
          const r4 = t4.protocol, n3 = "data:" === r4 || "http:" === r4 || "https:" === r4;
          let a4;
          if (function(e5) {
            return "" !== e5 && ("/" === e5[0] || function(e6) {
              if ("." === e6[0]) {
                if (1 === e6.length || "/" === e6[1]) return true;
                if ("." === e6[1] && (2 === e6.length || "/" === e6[2])) return true;
              }
              return false;
            }(e5));
          }(e4)) try {
            a4 = new _e.URL(e4, t4);
          } catch (i7) {
            const s4 = new Je(e4, t4);
            throw s4.cause = i7, s4;
          }
          else if ("file:" === r4 && "#" === e4[0]) a4 = packageImportsResolve2(e4, t4, i6);
          else try {
            a4 = new _e.URL(e4);
          } catch (s4) {
            if (n3 && !le.builtinModules.includes(e4)) {
              const i7 = new Je(e4, t4);
              throw i7.cause = s4, i7;
            }
            a4 = packageResolve2(e4, t4, i6);
          }
          return Ee(void 0 !== a4, "expected to be defined"), "file:" !== a4.protocol ? a4 : function(e5, t5) {
            if (null !== tt.exec(e5.pathname)) throw new $e(e5.pathname, 'must not include encoded "/" or "\\" characters', (0, _e.fileURLToPath)(t5));
            let i7;
            try {
              i7 = (0, _e.fileURLToPath)(e5);
            } catch (i8) {
              const s5 = i8;
              throw Object.defineProperty(s5, "input", { value: String(e5) }), Object.defineProperty(s5, "module", { value: String(t5) }), s5;
            }
            const s4 = tryStatSync2(i7.endsWith("/") ? i7.slice(-1) : i7);
            if (s4 && s4.isDirectory()) {
              const s5 = new ze(i7, (0, _e.fileURLToPath)(t5));
              throw s5.url = String(e5), s5;
            }
            if (!s4 || !s4.isFile()) {
              const s5 = new Ge(i7 || e5.pathname, t5 && (0, _e.fileURLToPath)(t5), true);
              throw s5.url = String(e5), s5;
            }
            {
              const t6 = (0, ue.realpathSync)(i7), { search: s5, hash: r5 } = e5;
              (e5 = (0, _e.pathToFileURL)(t6 + (i7.endsWith(Se.sep) ? "/" : ""))).search = s5, e5.hash = r5;
            }
            return e5;
          }(a4, t4);
        }
        __name(moduleResolve2, "moduleResolve");
        function fileURLToPath3(e4) {
          return "string" != typeof e4 || e4.startsWith("file://") ? normalizeSlash((0, _e.fileURLToPath)(e4)) : normalizeSlash(e4);
        }
        __name(fileURLToPath3, "fileURLToPath");
        function pathToFileURL3(e4) {
          return (0, _e.pathToFileURL)(fileURLToPath3(e4)).toString();
        }
        __name(pathToFileURL3, "pathToFileURL");
        const rt = /* @__PURE__ */ new Set(["node", "import"]), nt = [".mjs", ".cjs", ".js", ".json"], at = /* @__PURE__ */ new Set(["ERR_MODULE_NOT_FOUND", "ERR_UNSUPPORTED_DIR_IMPORT", "MODULE_NOT_FOUND", "ERR_PACKAGE_PATH_NOT_EXPORTED"]);
        function _tryModuleResolve2(e4, t4, i6) {
          try {
            return moduleResolve2(e4, t4, i6);
          } catch (e5) {
            if (!at.has(e5?.code)) throw e5;
          }
        }
        __name(_tryModuleResolve2, "_tryModuleResolve");
        function _resolve(e4, t4 = {}) {
          if ("string" != typeof e4) {
            if (!(e4 instanceof URL)) throw new TypeError("input must be a `string` or `URL`");
            e4 = fileURLToPath3(e4);
          }
          if (/(?:node|data|http|https):/.test(e4)) return e4;
          if (Ie.has(e4)) return "node:" + e4;
          if (e4.startsWith("file://") && (e4 = fileURLToPath3(e4)), isAbsolute3(e4)) try {
            if ((0, ue.statSync)(e4).isFile()) return pathToFileURL3(e4);
          } catch (e5) {
            if ("ENOENT" !== e5?.code) throw e5;
          }
          const i6 = t4.conditions ? new Set(t4.conditions) : rt, s3 = (Array.isArray(t4.url) ? t4.url : [t4.url]).filter(Boolean).map((e5) => new URL(function(e6) {
            return "string" != typeof e6 && (e6 = e6.toString()), /(?:node|data|http|https|file):/.test(e6) ? e6 : Ie.has(e6) ? "node:" + e6 : "file://" + encodeURI(normalizeSlash(e6));
          }(e5.toString())));
          0 === s3.length && s3.push(new URL(pathToFileURL3(process.cwd())));
          const r4 = [...s3];
          for (const e5 of s3) "file:" === e5.protocol && r4.push(new URL("./", e5), new URL(dist_joinURL(e5.pathname, "_index.js"), e5), new URL("node_modules", e5));
          let n3;
          for (const s4 of r4) {
            if (n3 = _tryModuleResolve2(e4, s4, i6), n3) break;
            for (const r5 of ["", "/index"]) {
              for (const a4 of t4.extensions || nt) if (n3 = _tryModuleResolve2(dist_joinURL(e4, r5) + a4, s4, i6), n3) break;
              if (n3) break;
            }
            if (n3) break;
          }
          if (!n3) {
            const t5 = new Error(`Cannot find module ${e4} imported from ${r4.join(", ")}`);
            throw t5.code = "ERR_MODULE_NOT_FOUND", t5;
          }
          return pathToFileURL3(n3);
        }
        __name(_resolve, "_resolve");
        function resolveSync(e4, t4) {
          return _resolve(e4, t4);
        }
        __name(resolveSync, "resolveSync");
        function resolvePathSync(e4, t4) {
          return fileURLToPath3(resolveSync(e4, t4));
        }
        __name(resolvePathSync, "resolvePathSync");
        const ot = /(?:[\s;]|^)(?:import[\s\w*,{}]*from|import\s*["'*{]|export\b\s*(?:[*{]|default|class|type|function|const|var|let|async function)|import\.meta\b)/m, ht = /\/\*.+?\*\/|\/\/.*(?=[nr])/g;
        function hasESMSyntax(e4, t4 = {}) {
          return t4.stripComments && (e4 = e4.replace(ht, "")), ot.test(e4);
        }
        __name(hasESMSyntax, "hasESMSyntax");
        function escapeStringRegexp(e4) {
          if ("string" != typeof e4) throw new TypeError("Expected a string");
          return e4.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
        }
        __name(escapeStringRegexp, "escapeStringRegexp");
        const ct = /* @__PURE__ */ new Set(["/", "\\", void 0]), pt = Symbol.for("pathe:normalizedAlias"), lt = /[/\\]/;
        function normalizeAliases(e4) {
          if (e4[pt]) return e4;
          const t4 = Object.fromEntries(Object.entries(e4).sort(([e5], [t5]) => function(e6, t6) {
            return t6.split("/").length - e6.split("/").length;
          }(e5, t5)));
          for (const e5 in t4) for (const i6 in t4) i6 === e5 || e5.startsWith(i6) || t4[e5]?.startsWith(i6) && ct.has(t4[e5][i6.length]) && (t4[e5] = t4[i6] + t4[e5].slice(i6.length));
          return Object.defineProperty(t4, pt, { value: true, enumerable: false }), t4;
        }
        __name(normalizeAliases, "normalizeAliases");
        function utils_hasTrailingSlash(e4 = "/") {
          const t4 = e4[e4.length - 1];
          return "/" === t4 || "\\" === t4;
        }
        __name(utils_hasTrailingSlash, "utils_hasTrailingSlash");
        var ut = { rE: "2.6.1" };
        const dt = __require("node:crypto");
        var ft = __webpack_require__.n(dt);
        const mt = /* @__PURE__ */ Object.create(null), dist_i = /* @__PURE__ */ __name((e4) => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e4 ? mt : globalThis), "dist_i"), gt = new Proxy(mt, { get: /* @__PURE__ */ __name((e4, t4) => dist_i()[t4] ?? mt[t4], "get"), has: /* @__PURE__ */ __name((e4, t4) => t4 in dist_i() || t4 in mt, "has"), set: /* @__PURE__ */ __name((e4, t4, i6) => (dist_i(true)[t4] = i6, true), "set"), deleteProperty(e4, t4) {
          if (!t4) return false;
          return delete dist_i(true)[t4], true;
        }, ownKeys() {
          const e4 = dist_i(true);
          return Object.keys(e4);
        } }), xt = typeof process < "u" && process.env && process.env.NODE_ENV || "", vt = [["APPVEYOR"], ["AWS_AMPLIFY", "AWS_APP_ID", { ci: true }], ["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"], ["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"], ["APPCIRCLE", "AC_APPCIRCLE"], ["BAMBOO", "bamboo_planKey"], ["BITBUCKET", "BITBUCKET_COMMIT"], ["BITRISE", "BITRISE_IO"], ["BUDDY", "BUDDY_WORKSPACE_ID"], ["BUILDKITE"], ["CIRCLE", "CIRCLECI"], ["CIRRUS", "CIRRUS_CI"], ["CLOUDFLARE_PAGES", "CF_PAGES", { ci: true }], ["CLOUDFLARE_WORKERS", "WORKERS_CI", { ci: true }], ["CODEBUILD", "CODEBUILD_BUILD_ARN"], ["CODEFRESH", "CF_BUILD_ID"], ["DRONE"], ["DRONE", "DRONE_BUILD_EVENT"], ["DSARI"], ["GITHUB_ACTIONS"], ["GITLAB", "GITLAB_CI"], ["GITLAB", "CI_MERGE_REQUEST_ID"], ["GOCD", "GO_PIPELINE_LABEL"], ["LAYERCI"], ["HUDSON", "HUDSON_URL"], ["JENKINS", "JENKINS_URL"], ["MAGNUM"], ["NETLIFY"], ["NETLIFY", "NETLIFY_LOCAL", { ci: false }], ["NEVERCODE"], ["RENDER"], ["SAIL", "SAILCI"], ["SEMAPHORE"], ["SCREWDRIVER"], ["SHIPPABLE"], ["SOLANO", "TDDIUM"], ["STRIDER"], ["TEAMCITY", "TEAMCITY_VERSION"], ["TRAVIS"], ["VERCEL", "NOW_BUILDER"], ["VERCEL", "VERCEL", { ci: false }], ["VERCEL", "VERCEL_ENV", { ci: false }], ["APPCENTER", "APPCENTER_BUILD_ID"], ["CODESANDBOX", "CODESANDBOX_SSE", { ci: false }], ["CODESANDBOX", "CODESANDBOX_HOST", { ci: false }], ["STACKBLITZ"], ["STORMKIT"], ["CLEAVR"], ["ZEABUR"], ["CODESPHERE", "CODESPHERE_APP_ID", { ci: true }], ["RAILWAY", "RAILWAY_PROJECT_ID"], ["RAILWAY", "RAILWAY_SERVICE_ID"], ["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"], ["FIREBASE_APP_HOSTING", "FIREBASE_APP_HOSTING", { ci: true }]];
        const yt = function() {
          if (globalThis.process?.env) for (const e4 of vt) {
            const t4 = e4[1] || e4[0];
            if (globalThis.process?.env[t4]) return { name: e4[0].toLowerCase(), ...e4[2] };
          }
          return "/bin/jsh" === globalThis.process?.env?.SHELL && globalThis.process?.versions?.webcontainer ? { name: "stackblitz", ci: false } : { name: "", ci: false };
        }();
        yt.name;
        function std_env_dist_n(e4) {
          return !!e4 && "false" !== e4;
        }
        __name(std_env_dist_n, "std_env_dist_n");
        const _t = globalThis.process?.platform || "", Et = std_env_dist_n(gt.CI) || false !== yt.ci, bt = std_env_dist_n(globalThis.process?.stdout && globalThis.process?.stdout.isTTY), St = (std_env_dist_n(gt.DEBUG), "test" === xt || std_env_dist_n(gt.TEST)), kt = (std_env_dist_n(gt.MINIMAL), /^win/i.test(_t)), wt = (/^linux/i.test(_t), /^darwin/i.test(_t), !std_env_dist_n(gt.NO_COLOR) && (std_env_dist_n(gt.FORCE_COLOR) || (bt || kt) && gt.TERM), (globalThis.process?.versions?.node || "").replace(/^v/, "") || null), It = (Number(wt?.split(".")[0]), globalThis.process || /* @__PURE__ */ Object.create(null)), Ct = { versions: {} }, Rt = (new Proxy(It, { get: /* @__PURE__ */ __name((e4, t4) => "env" === t4 ? gt : t4 in e4 ? e4[t4] : t4 in Ct ? Ct[t4] : void 0, "get") }), "node" === globalThis.process?.release?.name), Pt = !!globalThis.Bun || !!globalThis.process?.versions?.bun, Tt = !!globalThis.Deno, At = !!globalThis.fastly, Nt = [[!!globalThis.Netlify, "netlify"], [!!globalThis.EdgeRuntime, "edge-light"], ["Cloudflare-Workers" === globalThis.navigator?.userAgent, "workerd"], [At, "fastly"], [Tt, "deno"], [Pt, "bun"], [Rt, "node"]];
        !function() {
          const e4 = Nt.find((e5) => e5[0]);
          if (e4) e4[1];
        }();
        const Lt = __require("node:tty"), Ot = Lt?.WriteStream?.prototype?.hasColors?.() ?? false, base_format = /* @__PURE__ */ __name((e4, t4) => {
          if (!Ot) return (e5) => e5;
          const i6 = `\x1B[${e4}m`, s3 = `\x1B[${t4}m`;
          return (e5) => {
            const r4 = e5 + "";
            let n3 = r4.indexOf(s3);
            if (-1 === n3) return i6 + r4 + s3;
            let a4 = i6, o2 = 0;
            const h2 = (22 === t4 ? s3 : "") + i6;
            for (; -1 !== n3; ) a4 += r4.slice(o2, n3) + h2, o2 = n3 + s3.length, n3 = r4.indexOf(s3, o2);
            return a4 += r4.slice(o2) + s3, a4;
          };
        }, "base_format"), Dt = (base_format(0, 0), base_format(1, 22), base_format(2, 22), base_format(3, 23), base_format(4, 24), base_format(53, 55), base_format(7, 27), base_format(8, 28), base_format(9, 29), base_format(30, 39), base_format(31, 39)), Vt = base_format(32, 39), Ut = base_format(33, 39), Mt = base_format(34, 39), jt = (base_format(35, 39), base_format(36, 39)), Ft = (base_format(37, 39), base_format(90, 39));
        base_format(40, 49), base_format(41, 49), base_format(42, 49), base_format(43, 49), base_format(44, 49), base_format(45, 49), base_format(46, 49), base_format(47, 49), base_format(100, 49), base_format(91, 39), base_format(92, 39), base_format(93, 39), base_format(94, 39), base_format(95, 39), base_format(96, 39), base_format(97, 39), base_format(101, 49), base_format(102, 49), base_format(103, 49), base_format(104, 49), base_format(105, 49), base_format(106, 49), base_format(107, 49);
        function isDir(e4) {
          if ("string" != typeof e4 || e4.startsWith("file://")) return false;
          try {
            return (0, ue.lstatSync)(e4).isDirectory();
          } catch {
            return false;
          }
        }
        __name(isDir, "isDir");
        function utils_hash(e4, t4 = 8) {
          return (function() {
            if (void 0 !== $t) return $t;
            try {
              return $t = !!ft().getFips?.(), $t;
            } catch {
              return $t = false, $t;
            }
          }() ? ft().createHash("sha256") : ft().createHash("md5")).update(e4).digest("hex").slice(0, t4);
        }
        __name(utils_hash, "utils_hash");
        const Bt = { true: Vt("true"), false: Ut("false"), "[rebuild]": Ut("[rebuild]"), "[esm]": Mt("[esm]"), "[cjs]": Vt("[cjs]"), "[import]": Mt("[import]"), "[require]": Vt("[require]"), "[native]": jt("[native]"), "[transpile]": Ut("[transpile]"), "[fallback]": Dt("[fallback]"), "[unknown]": Dt("[unknown]"), "[hit]": Vt("[hit]"), "[miss]": Ut("[miss]"), "[json]": Vt("[json]"), "[data]": Vt("[data]") };
        function debug(e4, ...t4) {
          if (!e4.opts.debug) return;
          const i6 = process.cwd();
          console.log(Ft(["[jiti]", ...t4.map((e5) => e5 in Bt ? Bt[e5] : "string" != typeof e5 ? JSON.stringify(e5) : e5.replace(i6, "."))].join(" ")));
        }
        __name(debug, "debug");
        function jitiInteropDefault(e4, t4) {
          return e4.opts.interopDefault ? function(e5) {
            const t5 = typeof e5;
            if (null === e5 || "object" !== t5 && "function" !== t5) return e5;
            const i6 = e5.default, s3 = typeof i6, r4 = null == i6, n3 = "object" === s3 || "function" === s3;
            if (r4 && e5 instanceof Promise) return e5;
            return new Proxy(e5, { get(t6, s4, a4) {
              if ("__esModule" === s4) return true;
              if ("default" === s4) return r4 ? e5 : "function" == typeof i6?.default && e5.__esModule ? i6.default : i6;
              if (Reflect.has(t6, s4)) return Reflect.get(t6, s4, a4);
              if (n3 && !(i6 instanceof Promise)) {
                let e6 = Reflect.get(i6, s4, a4);
                return "function" == typeof e6 && (e6 = e6.bind(i6)), e6;
              }
            }, apply: /* @__PURE__ */ __name((e6, t6, r5) => "function" == typeof e6 ? Reflect.apply(e6, t6, r5) : "function" === s3 ? Reflect.apply(i6, t6, r5) : void 0, "apply") });
          }(t4) : t4;
        }
        __name(jitiInteropDefault, "jitiInteropDefault");
        let $t;
        function _booleanEnv(e4, t4) {
          const i6 = _jsonEnv(e4, t4);
          return Boolean(i6);
        }
        __name(_booleanEnv, "_booleanEnv");
        function _jsonEnv(e4, t4) {
          const i6 = process.env[e4];
          if (!(e4 in process.env)) return t4;
          try {
            return JSON.parse(i6);
          } catch {
            return t4;
          }
        }
        __name(_jsonEnv, "_jsonEnv");
        const qt = /\.(c|m)?j(sx?)$/, Wt = /\.(c|m)?t(sx?)$/;
        function jitiResolve(e4, t4, i6) {
          let s3, r4;
          if (e4.isNativeRe.test(t4)) return t4;
          e4.alias && (t4 = function(e5, t5) {
            const i7 = pathe_M_eThtNZ_normalizeWindowsPath(e5);
            t5 = normalizeAliases(t5);
            for (const [e6, s4] of Object.entries(t5)) {
              if (!i7.startsWith(e6)) continue;
              const t6 = utils_hasTrailingSlash(e6) ? e6.slice(0, -1) : e6;
              if (utils_hasTrailingSlash(i7[t6.length])) return pathe_M_eThtNZ_join(s4, i7.slice(e6.length));
            }
            return i7;
          }(t4, e4.alias));
          let n3 = i6?.parentURL || e4.url;
          isDir(n3) && (n3 = pathe_M_eThtNZ_join(n3, "_index.js"));
          const a4 = (i6?.async ? [i6?.conditions, ["node", "import"], ["node", "require"]] : [i6?.conditions, ["node", "require"], ["node", "import"]]).filter(Boolean);
          for (const i7 of a4) {
            try {
              s3 = resolvePathSync(t4, { url: n3, conditions: i7, extensions: e4.opts.extensions });
            } catch (e5) {
              r4 = e5;
            }
            if (s3) return s3;
          }
          try {
            return e4.nativeRequire.resolve(t4, { paths: i6.paths });
          } catch (e5) {
            r4 = e5;
          }
          for (const r5 of e4.additionalExts) {
            if (s3 = tryNativeRequireResolve(e4, t4 + r5, n3, i6) || tryNativeRequireResolve(e4, t4 + "/index" + r5, n3, i6), s3) return s3;
            if ((Wt.test(e4.filename) || Wt.test(e4.parentModule?.filename || "") || qt.test(t4)) && (s3 = tryNativeRequireResolve(e4, t4.replace(qt, ".$1t$2"), n3, i6), s3)) return s3;
          }
          if (!i6?.try) throw r4;
        }
        __name(jitiResolve, "jitiResolve");
        function tryNativeRequireResolve(e4, t4, i6, s3) {
          try {
            return e4.nativeRequire.resolve(t4, { ...s3, paths: [pathe_M_eThtNZ_dirname(fileURLToPath3(i6)), ...s3?.paths || []] });
          } catch {
          }
        }
        __name(tryNativeRequireResolve, "tryNativeRequireResolve");
        const Gt = __require("node:perf_hooks"), Ht = __require("node:vm");
        var Kt = __webpack_require__.n(Ht);
        function jitiRequire(e4, t4, i6) {
          const s3 = e4.parentCache || {};
          if (t4.startsWith("node:")) return nativeImportOrRequire(e4, t4, i6.async);
          if (t4.startsWith("file:")) t4 = (0, _e.fileURLToPath)(t4);
          else if (t4.startsWith("data:")) {
            if (!i6.async) throw new Error("`data:` URLs are only supported in ESM context. Use `import` or `jiti.import` instead.");
            return debug(e4, "[native]", "[data]", "[import]", t4), nativeImportOrRequire(e4, t4, true);
          }
          if (le.builtinModules.includes(t4) || ".pnp.js" === t4) return nativeImportOrRequire(e4, t4, i6.async);
          if (e4.opts.tryNative && !e4.opts.transformOptions) try {
            if (!(t4 = jitiResolve(e4, t4, i6)) && i6.try) return;
            if (debug(e4, "[try-native]", i6.async && e4.nativeImport ? "[import]" : "[require]", t4), i6.async && e4.nativeImport) return e4.nativeImport(t4).then((i7) => (false === e4.opts.moduleCache && delete e4.nativeRequire.cache[t4], jitiInteropDefault(e4, i7)));
            {
              const i7 = e4.nativeRequire(t4);
              return false === e4.opts.moduleCache && delete e4.nativeRequire.cache[t4], jitiInteropDefault(e4, i7);
            }
          } catch (i7) {
            debug(e4, `[try-native] Using fallback for ${t4} because of an error:`, i7);
          }
          const r4 = jitiResolve(e4, t4, i6);
          if (!r4 && i6.try) return;
          const n3 = extname3(r4);
          if (".json" === n3) {
            debug(e4, "[json]", r4);
            const t5 = e4.nativeRequire(r4);
            return t5 && !("default" in t5) && Object.defineProperty(t5, "default", { value: t5, enumerable: false }), t5;
          }
          if (n3 && !e4.opts.extensions.includes(n3)) return debug(e4, "[native]", "[unknown]", i6.async ? "[import]" : "[require]", r4), nativeImportOrRequire(e4, r4, i6.async);
          if (e4.isNativeRe.test(r4)) return debug(e4, "[native]", i6.async ? "[import]" : "[require]", r4), nativeImportOrRequire(e4, r4, i6.async);
          if (s3[r4]) return jitiInteropDefault(e4, s3[r4]?.exports);
          if (e4.opts.moduleCache) {
            const t5 = e4.nativeRequire.cache[r4];
            if (t5?.loaded) return jitiInteropDefault(e4, t5.exports);
          }
          const a4 = (0, ue.readFileSync)(r4, "utf8");
          return eval_evalModule(e4, a4, { id: t4, filename: r4, ext: n3, cache: s3, async: i6.async });
        }
        __name(jitiRequire, "jitiRequire");
        function nativeImportOrRequire(e4, t4, i6) {
          return i6 && e4.nativeImport ? e4.nativeImport(function(e5) {
            return kt && isAbsolute3(e5) ? pathToFileURL3(e5) : e5;
          }(t4)).then((t5) => jitiInteropDefault(e4, t5)) : jitiInteropDefault(e4, e4.nativeRequire(t4));
        }
        __name(nativeImportOrRequire, "nativeImportOrRequire");
        const zt = "9";
        function getCache(e4, t4, i6) {
          if (!e4.opts.fsCache || !t4.filename) return i6();
          const s3 = ` /* v${zt}-${utils_hash(t4.source, 16)} */
`;
          let r4 = `${basename2(pathe_M_eThtNZ_dirname(t4.filename))}-${function(e5) {
            const t5 = e5.split(lt).pop();
            if (!t5) return;
            const i7 = t5.lastIndexOf(".");
            return i7 <= 0 ? t5 : t5.slice(0, i7);
          }(t4.filename)}` + (e4.opts.sourceMaps ? "+map" : "") + (t4.interopDefault ? ".i" : "") + `.${utils_hash(t4.filename)}` + (t4.async ? ".mjs" : ".cjs");
          t4.jsx && t4.filename.endsWith("x") && (r4 += "x");
          const n3 = e4.opts.fsCache, a4 = pathe_M_eThtNZ_join(n3, r4);
          if (!e4.opts.rebuildFsCache && (0, ue.existsSync)(a4)) {
            const i7 = (0, ue.readFileSync)(a4, "utf8");
            if (i7.endsWith(s3)) return debug(e4, "[cache]", "[hit]", t4.filename, "~>", a4), i7;
          }
          debug(e4, "[cache]", "[miss]", t4.filename);
          const o2 = i6();
          return o2.includes("__JITI_ERROR__") || ((0, ue.writeFileSync)(a4, o2 + s3, "utf8"), debug(e4, "[cache]", "[store]", t4.filename, "~>", a4)), o2;
        }
        __name(getCache, "getCache");
        function prepareCacheDir(t4) {
          if (true === t4.opts.fsCache && (t4.opts.fsCache = function(t5) {
            const i6 = t5.filename && pathe_M_eThtNZ_resolve(t5.filename, "../node_modules");
            if (i6 && (0, ue.existsSync)(i6)) return pathe_M_eThtNZ_join(i6, ".cache/jiti");
            let s3 = (0, e3.tmpdir)();
            if (process.env.TMPDIR && s3 === process.cwd() && !process.env.JITI_RESPECT_TMPDIR_ENV) {
              const t6 = process.env.TMPDIR;
              delete process.env.TMPDIR, s3 = (0, e3.tmpdir)(), process.env.TMPDIR = t6;
            }
            return pathe_M_eThtNZ_join(s3, "jiti");
          }(t4)), t4.opts.fsCache) try {
            if ((0, ue.mkdirSync)(t4.opts.fsCache, { recursive: true }), !function(e4) {
              try {
                return (0, ue.accessSync)(e4, ue.constants.W_OK), true;
              } catch {
                return false;
              }
            }(t4.opts.fsCache)) throw new Error("directory is not writable!");
          } catch (e4) {
            debug(t4, "Error creating cache directory at ", t4.opts.fsCache, e4), t4.opts.fsCache = false;
          }
        }
        __name(prepareCacheDir, "prepareCacheDir");
        function transform(e4, t4) {
          let i6 = getCache(e4, t4, () => {
            const i7 = e4.opts.transform({ ...e4.opts.transformOptions, babel: { ...e4.opts.sourceMaps ? { sourceFileName: t4.filename, sourceMaps: "inline" } : {}, ...e4.opts.transformOptions?.babel }, interopDefault: e4.opts.interopDefault, ...t4 });
            return i7.error && e4.opts.debug && debug(e4, i7.error), i7.code;
          });
          return i6.startsWith("#!") && (i6 = "// " + i6), i6;
        }
        __name(transform, "transform");
        function eval_evalModule(e4, t4, i6 = {}) {
          const s3 = i6.id || (i6.filename ? basename2(i6.filename) : `_jitiEval.${i6.ext || (i6.async ? "mjs" : "js")}`), r4 = i6.filename || jitiResolve(e4, s3, { async: i6.async }), n3 = i6.ext || extname3(r4), a4 = i6.cache || e4.parentCache || {}, o2 = /\.[cm]?tsx?$/.test(n3), h2 = ".mjs" === n3 || ".js" === n3 && "module" === function(e5) {
            for (; e5 && "." !== e5 && "/" !== e5; ) {
              e5 = pathe_M_eThtNZ_join(e5, "..");
              try {
                const t5 = (0, ue.readFileSync)(pathe_M_eThtNZ_join(e5, "package.json"), "utf8");
                try {
                  return JSON.parse(t5);
                } catch {
                }
                break;
              } catch {
              }
            }
          }(r4)?.type, c3 = ".cjs" === n3, p2 = i6.forceTranspile ?? (!c3 && !(h2 && i6.async) && (o2 || h2 || e4.isTransformRe.test(r4) || hasESMSyntax(t4))), l2 = Gt.performance.now();
          if (p2) {
            t4 = transform(e4, { filename: r4, source: t4, ts: o2, async: i6.async ?? false, jsx: e4.opts.jsx });
            const s4 = Math.round(1e3 * (Gt.performance.now() - l2)) / 1e3;
            debug(e4, "[transpile]", i6.async ? "[esm]" : "[cjs]", r4, `(${s4}ms)`);
          } else {
            if (debug(e4, "[native]", i6.async ? "[import]" : "[require]", r4), i6.async) return Promise.resolve(nativeImportOrRequire(e4, r4, i6.async)).catch((s4) => (debug(e4, "Native import error:", s4), debug(e4, "[fallback]", r4), eval_evalModule(e4, t4, { ...i6, forceTranspile: true })));
            try {
              return nativeImportOrRequire(e4, r4, i6.async);
            } catch (s4) {
              debug(e4, "Native require error:", s4), debug(e4, "[fallback]", r4), t4 = transform(e4, { filename: r4, source: t4, ts: o2, async: i6.async ?? false, jsx: e4.opts.jsx });
            }
          }
          const u2 = new le.Module(r4);
          u2.filename = r4, e4.parentModule && (u2.parent = e4.parentModule, Array.isArray(e4.parentModule.children) && !e4.parentModule.children.includes(u2) && e4.parentModule.children.push(u2));
          const d2 = createJiti2(r4, e4.opts, { parentModule: u2, parentCache: a4, nativeImport: e4.nativeImport, onError: e4.onError, createRequire: e4.createRequire }, true);
          let f2;
          u2.require = d2, u2.path = pathe_M_eThtNZ_dirname(r4), u2.paths = le.Module._nodeModulePaths(u2.path), a4[r4] = u2, e4.opts.moduleCache && (e4.nativeRequire.cache[r4] = u2);
          const m2 = function(e5, t5) {
            return `(${t5?.async ? "async " : ""}function (exports, require, module, __filename, __dirname, jitiImport, jitiESMResolve) { ${e5}
});`;
          }(t4, { async: i6.async });
          try {
            f2 = Kt().runInThisContext(m2, { filename: r4, lineOffset: 0, displayErrors: false });
          } catch (t5) {
            "SyntaxError" === t5.name && i6.async && e4.nativeImport ? (debug(e4, "[esm]", "[import]", "[fallback]", r4), f2 = function(e5, t6) {
              const i7 = `data:text/javascript;base64,${Buffer.from(`export default ${e5}`).toString("base64")}`;
              return (...e6) => t6(i7).then((t7) => t7.default(...e6));
            }(m2, e4.nativeImport)) : (e4.opts.moduleCache && delete e4.nativeRequire.cache[r4], e4.onError(t5));
          }
          let g2;
          try {
            g2 = f2(u2.exports, u2.require, u2, u2.filename, pathe_M_eThtNZ_dirname(u2.filename), d2.import, d2.esmResolve);
          } catch (t5) {
            e4.opts.moduleCache && delete e4.nativeRequire.cache[r4], e4.onError(t5);
          }
          function next() {
            if (u2.exports && u2.exports.__JITI_ERROR__) {
              const { filename: t5, line: i7, column: s4, code: r5, message: n4 } = u2.exports.__JITI_ERROR__, a5 = new Error(`${r5}: ${n4} 
 ${`${t5}:${i7}:${s4}`}`);
              Error.captureStackTrace(a5, jitiRequire), e4.onError(a5);
            }
            u2.loaded = true;
            return jitiInteropDefault(e4, u2.exports);
          }
          __name(next, "next");
          return i6.async ? Promise.resolve(g2).then(next) : next();
        }
        __name(eval_evalModule, "eval_evalModule");
        const Jt = "win32" === (0, e3.platform)();
        function createJiti2(e4, t4 = {}, i6, s3 = false) {
          const r4 = s3 ? t4 : function(e5) {
            const t5 = { fsCache: _booleanEnv("JITI_FS_CACHE", _booleanEnv("JITI_CACHE", true)), rebuildFsCache: _booleanEnv("JITI_REBUILD_FS_CACHE", false), moduleCache: _booleanEnv("JITI_MODULE_CACHE", _booleanEnv("JITI_REQUIRE_CACHE", true)), debug: _booleanEnv("JITI_DEBUG", false), sourceMaps: _booleanEnv("JITI_SOURCE_MAPS", false), interopDefault: _booleanEnv("JITI_INTEROP_DEFAULT", true), extensions: _jsonEnv("JITI_EXTENSIONS", [".js", ".mjs", ".cjs", ".ts", ".tsx", ".mts", ".cts", ".mtsx", ".ctsx"]), alias: _jsonEnv("JITI_ALIAS", {}), nativeModules: _jsonEnv("JITI_NATIVE_MODULES", []), transformModules: _jsonEnv("JITI_TRANSFORM_MODULES", []), tryNative: _jsonEnv("JITI_TRY_NATIVE", "Bun" in globalThis), jsx: _booleanEnv("JITI_JSX", false) };
            t5.jsx && t5.extensions.push(".jsx", ".tsx");
            const i7 = {};
            return void 0 !== e5.cache && (i7.fsCache = e5.cache), void 0 !== e5.requireCache && (i7.moduleCache = e5.requireCache), { ...t5, ...i7, ...e5 };
          }(t4), n3 = r4.alias && Object.keys(r4.alias).length > 0 ? normalizeAliases(r4.alias || {}) : void 0, a4 = ["typescript", "jiti", ...r4.nativeModules || []], o2 = new RegExp(`node_modules/(${a4.map((e5) => escapeStringRegexp(e5)).join("|")})/`), h2 = [...r4.transformModules || []], c3 = new RegExp(`node_modules/(${h2.map((e5) => escapeStringRegexp(e5)).join("|")})/`);
          e4 || (e4 = process.cwd()), !s3 && isDir(e4) && (e4 = pathe_M_eThtNZ_join(e4, "_index.js"));
          const p2 = pathToFileURL3(e4), l2 = [...r4.extensions].filter((e5) => ".js" !== e5), u2 = i6.createRequire(Jt ? e4.replace(/\//g, "\\") : e4), d2 = { filename: e4, url: p2, opts: r4, alias: n3, nativeModules: a4, transformModules: h2, isNativeRe: o2, isTransformRe: c3, additionalExts: l2, nativeRequire: u2, onError: i6.onError, parentModule: i6.parentModule, parentCache: i6.parentCache, nativeImport: i6.nativeImport, createRequire: i6.createRequire };
          s3 || debug(d2, "[init]", ...[["version:", ut.rE], ["module-cache:", r4.moduleCache], ["fs-cache:", r4.fsCache], ["rebuild-fs-cache:", r4.rebuildFsCache], ["interop-defaults:", r4.interopDefault]].flat()), s3 || prepareCacheDir(d2);
          const f2 = Object.assign(function(e5) {
            return jitiRequire(d2, e5, { async: false });
          }, { cache: r4.moduleCache ? u2.cache : /* @__PURE__ */ Object.create(null), extensions: u2.extensions, main: u2.main, options: r4, resolve: Object.assign(function(e5) {
            return jitiResolve(d2, e5, { async: false });
          }, { paths: u2.resolve.paths }), transform: /* @__PURE__ */ __name((e5) => transform(d2, e5), "transform"), evalModule: /* @__PURE__ */ __name((e5, t5) => eval_evalModule(d2, e5, t5), "evalModule"), async import(e5, t5) {
            const i7 = await jitiRequire(d2, e5, { ...t5, async: true });
            return t5?.default ? i7?.default ?? i7 : i7;
          }, esmResolve(e5, t5) {
            "string" == typeof t5 && (t5 = { parentURL: t5 });
            const i7 = jitiResolve(d2, e5, { parentURL: p2, ...t5, async: true });
            return !i7 || "string" != typeof i7 || i7.startsWith("file://") ? i7 : pathToFileURL3(i7);
          } });
          return f2;
        }
        __name(createJiti2, "createJiti");
      })(), module.exports = i5.default;
    })();
  }
});

// node_modules/jiti/lib/jiti.mjs
import { createRequire } from "node:module";
function onError(err) {
  throw err;
}
function lazyTransform(...args) {
  if (!_transform) {
    _transform = createRequire(import.meta.url)("../dist/babel.cjs");
  }
  return _transform(...args);
}
function createJiti(id, opts = {}) {
  if (!opts.transform) {
    opts = { ...opts, transform: lazyTransform };
  }
  return (0, import_jiti.default)(id, opts, {
    onError,
    nativeImport,
    createRequire
  });
}
var import_jiti, nativeImport, _transform;
var init_jiti = __esm({
  "node_modules/jiti/lib/jiti.mjs"() {
    init_esm();
    import_jiti = __toESM(require_jiti(), 1);
    __name(onError, "onError");
    nativeImport = /* @__PURE__ */ __name((id) => import(id), "nativeImport");
    __name(lazyTransform, "lazyTransform");
    __name(createJiti, "createJiti");
  }
});

// node_modules/destr/dist/index.mjs
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
var suspectProtoRx, suspectConstructorRx, JsonSigRx;
var init_dist3 = __esm({
  "node_modules/destr/dist/index.mjs"() {
    init_esm();
    suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    __name(jsonParseTransform, "jsonParseTransform");
    __name(warnKeyDropped, "warnKeyDropped");
    __name(destr, "destr");
  }
});

// node_modules/@trigger.dev/build/node_modules/rc9/dist/index.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve as resolve3 } from "node:path";
import { homedir } from "node:os";
function isBuffer(obj) {
  return obj && obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function keyIdentity(key) {
  return key;
}
function flatten(target, opts) {
  opts = opts || {};
  const delimiter = opts.delimiter || ".";
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};
  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function(key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = type === "[object Object]" || type === "[object Array]";
      const newKey = prev ? prev + delimiter + transformKey(key) : transformKey(key);
      if (!isarray && !isbuffer && isobject && Object.keys(value).length && (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1);
      }
      output[newKey] = value;
    });
  }
  __name(step, "step");
  step(target);
  return output;
}
function unflatten(target, opts) {
  opts = opts || {};
  const delimiter = opts.delimiter || ".";
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result = {};
  const isbuffer = isBuffer(target);
  if (isbuffer || Object.prototype.toString.call(target) !== "[object Object]") {
    return target;
  }
  function getkey(key) {
    const parsedKey = Number(key);
    return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts.object ? key : parsedKey;
  }
  __name(getkey, "getkey");
  function addKeys(keyPrefix, recipient, target2) {
    return Object.keys(target2).reduce(function(result2, key) {
      result2[keyPrefix + delimiter + key] = target2[key];
      return result2;
    }, recipient);
  }
  __name(addKeys, "addKeys");
  function isEmpty(val) {
    const type = Object.prototype.toString.call(val);
    const isArray = type === "[object Array]";
    const isObject = type === "[object Object]";
    if (!val) {
      return true;
    } else if (isArray) {
      return !val.length;
    } else if (isObject) {
      return !Object.keys(val).length;
    }
  }
  __name(isEmpty, "isEmpty");
  target = Object.keys(target).reduce(function(result2, key) {
    const type = Object.prototype.toString.call(target[key]);
    const isObject = type === "[object Object]" || type === "[object Array]";
    if (!isObject || isEmpty(target[key])) {
      result2[key] = target[key];
      return result2;
    } else {
      return addKeys(
        key,
        result2,
        flatten(target[key], opts)
      );
    }
  }, {});
  Object.keys(target).forEach(function(key) {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;
    while (key2 !== void 0) {
      if (key1 === "__proto__") {
        return;
      }
      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject = type === "[object Object]" || type === "[object Array]";
      if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") {
        return;
      }
      if (overwrite && !isobject || !overwrite && recipient[key1] == null) {
        recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
      }
      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }
    recipient[key1] = unflatten(target[key], opts);
  });
  return result;
}
function withDefaults(options) {
  if (typeof options === "string") {
    options = { name: options };
  }
  return { ...defaults, ...options };
}
function parse(contents, options = {}) {
  const config = {};
  const lines = contents.split(RE_LINES);
  for (const line of lines) {
    const match = line.match(RE_KEY_VAL);
    if (!match) {
      continue;
    }
    const key = match[1];
    if (!key || key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = destr(
      (match[2] || "").trim()
      /* val */
    );
    if (key.endsWith("[]")) {
      const nkey = key.slice(0, Math.max(0, key.length - 2));
      config[nkey] = (config[nkey] || []).concat(value);
      continue;
    }
    config[key] = value;
  }
  return options.flat ? config : unflatten(config, { overwrite: true });
}
function parseFile(path2, options) {
  if (!existsSync(path2)) {
    return {};
  }
  return parse(readFileSync(path2, "utf8"), options);
}
function read2(options) {
  options = withDefaults(options);
  return parseFile(resolve3(options.dir, options.name), options);
}
function readUser(options) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return read2(options);
}
var RE_KEY_VAL, RE_LINES, defaults;
var init_dist4 = __esm({
  "node_modules/@trigger.dev/build/node_modules/rc9/dist/index.mjs"() {
    init_esm();
    init_dist3();
    init_defu();
    __name(isBuffer, "isBuffer");
    __name(keyIdentity, "keyIdentity");
    __name(flatten, "flatten");
    __name(unflatten, "unflatten");
    RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
    RE_LINES = /\n|\r|\r\n/;
    defaults = {
      name: ".conf",
      dir: process.cwd(),
      flat: false
    };
    __name(withDefaults, "withDefaults");
    __name(parse, "parse");
    __name(parseFile, "parseFile");
    __name(read2, "read");
    __name(readUser, "readUser");
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/_chunks/libs/strip-json-comments.mjs
function a(a3, { whitespace: o = true, trailingCommas: s2 = false } = {}) {
  if (typeof a3 != `string`) throw TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof a3}\``);
  let c2 = o ? r : n, l = false, u = false, d = 0, f = ``, p = ``, m = -1;
  for (let n2 = 0; n2 < a3.length; n2++) {
    let r3 = a3[n2], o2 = a3[n2 + 1];
    if (u || r3 !== `"` || i2(a3, n2) || (l = !l), !l) {
      if (!u && r3 + o2 === `//`) f += a3.slice(d, n2), d = n2, u = e, n2++;
      else if (u === e && r3 + o2 === `\r
`) {
        n2++, u = false, f += c2(a3, d, n2), d = n2;
        continue;
      } else if (u === e && r3 === `
`) u = false, f += c2(a3, d, n2), d = n2;
      else if (!u && r3 + o2 === `/*`) {
        f += a3.slice(d, n2), d = n2, u = t, n2++;
        continue;
      } else if (u === t && r3 + o2 === `*/`) {
        n2++, u = false, f += c2(a3, d, n2 + 1), d = n2 + 1;
        continue;
      } else s2 && !u && (m === -1 ? r3 === `,` && (p += f + a3.slice(d, n2), f = ``, d = n2, m = n2) : r3 === `}` || r3 === `]` ? (f += a3.slice(d, n2), p += c2(f, 0, 1) + f.slice(1), f = ``, d = n2, m = -1) : r3 !== ` ` && r3 !== `	` && r3 !== `\r` && r3 !== `
` && (f += a3.slice(d, n2), d = n2, m = -1));
    }
  }
  let h = u === e ? c2(a3, d) : a3.slice(d);
  return p + f + h;
}
var e, t, n, r, i2;
var init_strip_json_comments = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/_chunks/libs/strip-json-comments.mjs"() {
    init_esm();
    e = Symbol(`singleComment`);
    t = Symbol(`multiComment`);
    n = /* @__PURE__ */ __name(() => ``, "n");
    r = /* @__PURE__ */ __name((e2, t2, n2) => e2.slice(t2, n2).replace(/[^ \t\r\n]/g, ` `), "r");
    i2 = /* @__PURE__ */ __name((e2, t2) => {
      let n2 = t2 - 1, r3 = 0;
      for (; e2[n2] === `\\`; ) --n2, r3 += 1;
      return !!(r3 % 2);
    }, "i");
    __name(a, "a");
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/json.mjs
function r2(e2, r3) {
  let i5 = JSON.parse(i(e2), r3?.reviver);
  return s(e2, i5, r3), i5;
}
var init_json = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/json.mjs"() {
    init_esm();
    init_format();
    __name(r2, "r");
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/jsonc.mjs
function i3(r3, i5) {
  let a3 = JSON.parse(a(i(r3), { trailingCommas: i5?.allowTrailingComma }));
  return s(r3, a3, i5), a3;
}
var init_jsonc = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/node_modules/confbox/dist/jsonc.mjs"() {
    init_esm();
    init_format();
    init_strip_json_comments();
    __name(i3, "i");
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/dist/index.mjs
import { promises, statSync as statSync2 } from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";
async function findFile(filename, _options = {}) {
  const filenames = Array.isArray(filename) ? filename : [filename];
  const options = {
    ...defaultFindOptions,
    ..._options
  };
  const basePath = resolve(options.startingFrom);
  const leadingSlash = basePath[0] === "/";
  const segments = basePath.split("/").filter(Boolean);
  if (filenames.includes(segments.at(-1)) && await options.test(basePath)) return basePath;
  if (leadingSlash) segments[0] = "/" + segments[0];
  let root = segments.findIndex((r3) => r3.match(options.rootPattern));
  if (root === -1) root = 0;
  if (options.reverse) for (let index = root + 1; index <= segments.length; index++) for (const filename2 of filenames) {
    const filePath = join(...segments.slice(0, index), filename2);
    if (await options.test(filePath)) return filePath;
  }
  else for (let index = segments.length; index > root; index--) for (const filename2 of filenames) {
    const filePath = join(...segments.slice(0, index), filename2);
    if (await options.test(filePath)) return filePath;
  }
  throw new Error(`Cannot find matching ${filename} in ${options.startingFrom} or parent directories`);
}
function findNearestFile(filename, options = {}) {
  return findFile(filename, options);
}
function _resolvePath(id, opts = {}) {
  if (id instanceof URL || id.startsWith("file://")) return normalize(fileURLToPath2(id));
  if (isAbsolute(id)) return normalize(id);
  return resolveModulePath(id, {
    ...opts,
    from: opts.from || opts.parent || opts.url
  });
}
async function readPackageJSON(id, options = {}) {
  const resolvedPath = await resolvePackageJSON(id, options);
  const cache2 = options.cache && typeof options.cache !== "boolean" ? options.cache : FileCache;
  if (options.cache && cache2.has(resolvedPath)) return cache2.get(resolvedPath);
  const blob = await promises.readFile(resolvedPath, "utf8");
  let parsed;
  try {
    parsed = r2(blob);
  } catch {
    parsed = i3(blob);
  }
  cache2.set(resolvedPath, parsed);
  return parsed;
}
async function resolvePackageJSON(id = process.cwd(), options = {}) {
  return findNearestFile("package.json", {
    ...options,
    startingFrom: _resolvePath(id, options)
  });
}
async function findWorkspaceDir(id = process.cwd(), options = {}) {
  const startingFrom = _resolvePath(id, options);
  const tests = options.tests || [
    "workspaceFile",
    "gitConfig",
    "lockFile",
    "packageJson"
  ];
  for (const testName of tests) {
    const test = workspaceTests[testName];
    if (options[testName] === false || !test) continue;
    const direction = options[testName] || (testName === "gitConfig" ? "closest" : "furthest");
    const detected = await test({
      ...options,
      startingFrom,
      reverse: direction === "furthest"
    }).catch(() => {
    });
    if (detected) return detected;
  }
  throw new Error(`Cannot detect workspace root from ${id}`);
}
var defaultFindOptions, lockFiles, packageFiles, workspaceFiles, FileCache, workspaceTests;
var init_dist5 = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/node_modules/pkg-types/dist/index.mjs"() {
    init_esm();
    init_dist();
    init_jsonc();
    init_dist2();
    init_json();
    defaultFindOptions = {
      startingFrom: ".",
      rootPattern: /^node_modules$/,
      reverse: false,
      test: /* @__PURE__ */ __name((filePath) => {
        try {
          if (statSync2(filePath).isFile()) return true;
        } catch {
        }
      }, "test")
    };
    __name(findFile, "findFile");
    __name(findNearestFile, "findNearestFile");
    __name(_resolvePath, "_resolvePath");
    lockFiles = [
      "yarn.lock",
      "package-lock.json",
      "pnpm-lock.yaml",
      "npm-shrinkwrap.json",
      "bun.lockb",
      "bun.lock",
      "deno.lock",
      "upm.lock"
    ];
    packageFiles = [
      "package.json",
      "package.json5",
      "package.yaml"
    ];
    workspaceFiles = [
      "pnpm-workspace.yaml",
      "lerna.json",
      "turbo.json",
      "rush.json",
      "deno.json",
      "deno.jsonc"
    ];
    FileCache = /* @__PURE__ */ new Map();
    __name(readPackageJSON, "readPackageJSON");
    __name(resolvePackageJSON, "resolvePackageJSON");
    workspaceTests = {
      workspaceFile: /* @__PURE__ */ __name((opts) => findFile(workspaceFiles, opts).then((r3) => dirname(r3)), "workspaceFile"),
      gitConfig: /* @__PURE__ */ __name((opts) => findFile(".git/config", opts).then((r3) => resolve(r3, "../..")), "gitConfig"),
      lockFile: /* @__PURE__ */ __name((opts) => findFile(lockFiles, opts).then((r3) => dirname(r3)), "lockFile"),
      packageJson: /* @__PURE__ */ __name((opts) => findFile(packageFiles, opts).then((r3) => dirname(r3)), "packageJson")
    };
    __name(findWorkspaceDir, "findWorkspaceDir");
  }
});

// node_modules/@trigger.dev/build/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/@trigger.dev/build/node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/@trigger.dev/build/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/@trigger.dev/build/node_modules/dotenv/lib/main.js"(exports, module) {
    init_esm();
    var fs2 = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse3(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    __name(parse3, "parse");
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i5 = 0; i5 < length; i5++) {
        try {
          const key = keys[i5].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i5 + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    __name(_parseVault, "_parseVault");
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    __name(_warn, "_warn");
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    __name(_debug, "_debug");
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    __name(_log, "_log");
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    __name(_dotenvKey, "_dotenvKey");
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    __name(_instructions, "_instructions");
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    __name(_vaultPath, "_vaultPath");
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    __name(_resolveHome, "_resolveHome");
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    __name(_configVault, "_configVault");
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e2) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e2.message}`);
          }
          lastError = e2;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e2) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e2.message}`);
            }
            lastError = e2;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    __name(configDotenv, "configDotenv");
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    __name(config, "config");
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    __name(decrypt, "decrypt");
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    __name(populate, "populate");
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse: parse3,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/dist/shared/c12.BXpNC6YI.mjs
import { statSync as statSync3, promises as promises2, existsSync as existsSync2 } from "node:fs";
import { rm, readFile } from "node:fs/promises";
import { pathToFileURL as pathToFileURL2 } from "node:url";
import { homedir as homedir2 } from "node:os";
async function setupDotenv(options) {
  const targetEnvironment = options.env ?? process.env;
  const environment = await loadDotenv({
    cwd: options.cwd,
    fileName: options.fileName ?? ".env",
    env: targetEnvironment,
    interpolate: options.interpolate ?? true
  });
  const dotenvVars = getDotEnvVars(targetEnvironment);
  for (const key in environment) {
    if (key.startsWith("_")) {
      continue;
    }
    if (targetEnvironment[key] === void 0 || dotenvVars.has(key)) {
      targetEnvironment[key] = environment[key];
    }
  }
  return environment;
}
async function loadDotenv(options) {
  const environment = /* @__PURE__ */ Object.create(null);
  const dotenvFile = resolve(options.cwd, options.fileName);
  const dotenvVars = getDotEnvVars(options.env || {});
  Object.assign(environment, options.env);
  if (statSync3(dotenvFile, { throwIfNoEntry: false })?.isFile()) {
    const parsed = dotenv.parse(await promises2.readFile(dotenvFile, "utf8"));
    for (const key in parsed) {
      if (key in environment && !dotenvVars.has(key)) {
        continue;
      }
      environment[key] = parsed[key];
      dotenvVars.add(key);
    }
  }
  if (options.interpolate) {
    interpolate(environment);
  }
  return environment;
}
function interpolate(target, source = {}, parse3 = (v) => v) {
  function getValue(key) {
    return source[key] === void 0 ? target[key] : source[key];
  }
  __name(getValue, "getValue");
  function interpolate2(value, parents = []) {
    if (typeof value !== "string") {
      return value;
    }
    const matches = value.match(/(.?\${?(?:[\w:]+)?}?)/g) || [];
    return parse3(
      // eslint-disable-next-line unicorn/no-array-reduce
      matches.reduce((newValue, match) => {
        const parts = /(.?)\${?([\w:]+)?}?/g.exec(match) || [];
        const prefix = parts[1];
        let value2, replacePart;
        if (prefix === "\\") {
          replacePart = parts[0] || "";
          value2 = replacePart.replace(String.raw`\$`, "$");
        } else {
          const key = parts[2];
          replacePart = (parts[0] || "").slice(prefix.length);
          if (parents.includes(key)) {
            console.warn(
              `Please avoid recursive environment variables ( loop: ${parents.join(
                " > "
              )} > ${key} )`
            );
            return "";
          }
          value2 = getValue(key);
          value2 = interpolate2(value2, [...parents, key]);
        }
        return value2 === void 0 ? newValue : newValue.replace(replacePart, value2);
      }, value)
    );
  }
  __name(interpolate2, "interpolate2");
  for (const key in target) {
    target[key] = interpolate2(getValue(key));
  }
}
function getDotEnvVars(targetEnvironment) {
  const globalRegistry = globalThis.__c12_dotenv_vars__ ||= /* @__PURE__ */ new Map();
  if (!globalRegistry.has(targetEnvironment)) {
    globalRegistry.set(targetEnvironment, /* @__PURE__ */ new Set());
  }
  return globalRegistry.get(targetEnvironment);
}
async function loadConfig(options) {
  options.cwd = resolve(process.cwd(), options.cwd || ".");
  options.name = options.name || "config";
  options.envName = options.envName ?? process.env.NODE_ENV;
  options.configFile = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
  options.rcFile = options.rcFile ?? `.${options.name}rc`;
  if (options.extend !== false) {
    options.extend = {
      extendKey: "extends",
      ...options.extend
    };
  }
  const _merger = options.merger || defu;
  options.jiti = options.jiti || createJiti(join(options.cwd, options.configFile), {
    interopDefault: true,
    moduleCache: false,
    extensions: [...SUPPORTED_EXTENSIONS],
    ...options.jitiOptions
  });
  const r3 = {
    config: {},
    cwd: options.cwd,
    configFile: resolve(options.cwd, options.configFile),
    layers: []
  };
  const rawConfigs = {
    overrides: options.overrides,
    main: void 0,
    rc: void 0,
    packageJson: void 0,
    defaultConfig: options.defaultConfig
  };
  if (options.dotenv) {
    await setupDotenv({
      cwd: options.cwd,
      ...options.dotenv === true ? {} : options.dotenv
    });
  }
  const _mainConfig = await resolveConfig(".", options);
  if (_mainConfig.configFile) {
    rawConfigs.main = _mainConfig.config;
    r3.configFile = _mainConfig.configFile;
  }
  if (_mainConfig.meta) {
    r3.meta = _mainConfig.meta;
  }
  if (options.rcFile) {
    const rcSources = [];
    rcSources.push(read2({ name: options.rcFile, dir: options.cwd }));
    if (options.globalRc) {
      const workspaceDir = await findWorkspaceDir(options.cwd).catch(() => {
      });
      if (workspaceDir) {
        rcSources.push(read2({ name: options.rcFile, dir: workspaceDir }));
      }
      rcSources.push(readUser({ name: options.rcFile, dir: options.cwd }));
    }
    rawConfigs.rc = _merger({}, ...rcSources);
  }
  if (options.packageJson) {
    const keys = (Array.isArray(options.packageJson) ? options.packageJson : [
      typeof options.packageJson === "string" ? options.packageJson : options.name
    ]).filter((t2) => t2 && typeof t2 === "string");
    const pkgJsonFile = await readPackageJSON(options.cwd).catch(() => {
    });
    const values = keys.map((key) => pkgJsonFile?.[key]);
    rawConfigs.packageJson = _merger({}, ...values);
  }
  const configs = {};
  for (const key in rawConfigs) {
    const value = rawConfigs[key];
    configs[key] = await (typeof value === "function" ? value({ configs, rawConfigs }) : value);
  }
  r3.config = _merger(
    configs.overrides,
    configs.main,
    configs.rc,
    configs.packageJson,
    configs.defaultConfig
  );
  if (options.extend) {
    await extendConfig(r3.config, options);
    r3.layers = r3.config._layers;
    delete r3.config._layers;
    r3.config = _merger(r3.config, ...r3.layers.map((e2) => e2.config));
  }
  const baseLayers = [
    configs.overrides && {
      config: configs.overrides,
      configFile: void 0,
      cwd: void 0
    },
    { config: configs.main, configFile: options.configFile, cwd: options.cwd },
    configs.rc && { config: configs.rc, configFile: options.rcFile },
    configs.packageJson && {
      config: configs.packageJson,
      configFile: "package.json"
    }
  ].filter((l) => l && l.config);
  r3.layers = [...baseLayers, ...r3.layers];
  if (options.defaults) {
    r3.config = _merger(r3.config, options.defaults);
  }
  if (options.omit$Keys) {
    for (const key in r3.config) {
      if (key.startsWith("$")) {
        delete r3.config[key];
      }
    }
  }
  return r3;
}
async function extendConfig(config, options) {
  config._layers = config._layers || [];
  if (!options.extend) {
    return;
  }
  let keys = options.extend.extendKey;
  if (typeof keys === "string") {
    keys = [keys];
  }
  const extendSources = [];
  for (const key of keys) {
    extendSources.push(
      ...(Array.isArray(config[key]) ? config[key] : [config[key]]).filter(
        Boolean
      )
    );
    delete config[key];
  }
  for (let extendSource of extendSources) {
    const originalExtendSource = extendSource;
    let sourceOptions = {};
    if (extendSource.source) {
      sourceOptions = extendSource.options || {};
      extendSource = extendSource.source;
    }
    if (Array.isArray(extendSource)) {
      sourceOptions = extendSource[1] || {};
      extendSource = extendSource[0];
    }
    if (typeof extendSource !== "string") {
      console.warn(
        `Cannot extend config from \`${JSON.stringify(
          originalExtendSource
        )}\` in ${options.cwd}`
      );
      continue;
    }
    const _config = await resolveConfig(extendSource, options, sourceOptions);
    if (!_config.config) {
      console.warn(
        `Cannot extend config from \`${extendSource}\` in ${options.cwd}`
      );
      continue;
    }
    await extendConfig(_config.config, { ...options, cwd: _config.cwd });
    config._layers.push(_config);
    if (_config.config._layers) {
      config._layers.push(..._config.config._layers);
      delete _config.config._layers;
    }
  }
}
async function resolveConfig(source, options, sourceOptions = {}) {
  if (options.resolve) {
    const res2 = await options.resolve(source, options);
    if (res2) {
      return res2;
    }
  }
  const _merger = options.merger || defu;
  const customProviderKeys = Object.keys(
    sourceOptions.giget?.providers || {}
  ).map((key) => `${key}:`);
  const gigetPrefixes = customProviderKeys.length > 0 ? [.../* @__PURE__ */ new Set([...customProviderKeys, ...GIGET_PREFIXES])] : GIGET_PREFIXES;
  if (options.giget !== false && gigetPrefixes.some((prefix) => source.startsWith(prefix))) {
    const { downloadTemplate } = await import("./dist-4V5M4THO.mjs");
    const { digest } = await import("./dist-PWFWJDBM.mjs");
    const cloneName = source.replace(/\W+/g, "_").split("_").splice(0, 3).join("_") + "_" + digest(source).slice(0, 10).replace(/[-_]/g, "");
    let cloneDir;
    const localNodeModules = resolve(options.cwd, "node_modules");
    const parentDir = dirname(options.cwd);
    if (basename(parentDir) === ".c12") {
      cloneDir = join(parentDir, cloneName);
    } else if (existsSync2(localNodeModules)) {
      cloneDir = join(localNodeModules, ".c12", cloneName);
    } else {
      cloneDir = process.env.XDG_CACHE_HOME ? resolve(process.env.XDG_CACHE_HOME, "c12", cloneName) : resolve(homedir2(), ".cache/c12", cloneName);
    }
    if (existsSync2(cloneDir) && !sourceOptions.install) {
      await rm(cloneDir, { recursive: true });
    }
    const cloned = await downloadTemplate(source, {
      dir: cloneDir,
      install: sourceOptions.install,
      force: sourceOptions.install,
      auth: sourceOptions.auth,
      ...options.giget,
      ...sourceOptions.giget
    });
    source = cloned.dir;
  }
  if (NPM_PACKAGE_RE.test(source)) {
    source = tryResolve(source, options) || source;
  }
  const ext = extname(source);
  const isDir = !ext || ext === basename(source);
  const cwd = resolve(options.cwd, isDir ? source : dirname(source));
  if (isDir) {
    source = options.configFile;
  }
  const res = {
    config: void 0,
    configFile: void 0,
    cwd,
    source,
    sourceOptions
  };
  res.configFile = tryResolve(resolve(cwd, source), options) || tryResolve(
    resolve(cwd, ".config", source.replace(/\.config$/, "")),
    options
  ) || tryResolve(resolve(cwd, ".config", source), options) || source;
  if (!existsSync2(res.configFile)) {
    return res;
  }
  const configFileExt = extname(res.configFile) || "";
  if (configFileExt in ASYNC_LOADERS) {
    const asyncLoader = await ASYNC_LOADERS[configFileExt]();
    const contents = await readFile(res.configFile, "utf8");
    res.config = asyncLoader(contents);
  } else {
    res.config = await options.jiti.import(res.configFile, {
      default: true
    });
  }
  if (typeof res.config === "function") {
    res.config = await res.config();
  }
  if (options.envName) {
    const envConfig = {
      ...res.config["$" + options.envName],
      ...res.config.$env?.[options.envName]
    };
    if (Object.keys(envConfig).length > 0) {
      res.config = _merger(envConfig, res.config);
    }
  }
  res.meta = defu(res.sourceOptions.meta, res.config.$meta);
  delete res.config.$meta;
  if (res.sourceOptions.overrides) {
    res.config = _merger(res.sourceOptions.overrides, res.config);
  }
  res.configFile = _normalize(res.configFile);
  res.source = _normalize(res.source);
  return res;
}
function tryResolve(id, options) {
  const res = resolveModulePath(id, {
    try: true,
    from: pathToFileURL2(join(options.cwd || ".", options.configFile || "/")),
    suffixes: ["", "/index"],
    extensions: SUPPORTED_EXTENSIONS,
    cache: false
  });
  return res ? normalize(res) : void 0;
}
var dotenv, _normalize, ASYNC_LOADERS, SUPPORTED_EXTENSIONS, GIGET_PREFIXES, NPM_PACKAGE_RE;
var init_c12_BXpNC6YI = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/dist/shared/c12.BXpNC6YI.mjs"() {
    init_esm();
    init_dist();
    init_dist2();
    init_jiti();
    init_dist4();
    init_defu();
    init_dist5();
    dotenv = __toESM(require_main(), 1);
    __name(setupDotenv, "setupDotenv");
    __name(loadDotenv, "loadDotenv");
    __name(interpolate, "interpolate");
    __name(getDotEnvVars, "getDotEnvVars");
    _normalize = /* @__PURE__ */ __name((p) => p?.replace(/\\/g, "/"), "_normalize");
    ASYNC_LOADERS = {
      ".yaml": /* @__PURE__ */ __name(() => import("./yaml-34SH5RZE.mjs").then((r3) => r3.parseYAML), ".yaml"),
      ".yml": /* @__PURE__ */ __name(() => import("./yaml-34SH5RZE.mjs").then((r3) => r3.parseYAML), ".yml"),
      ".jsonc": /* @__PURE__ */ __name(() => import("./jsonc-EP22RVAB.mjs").then((r3) => r3.parseJSONC), ".jsonc"),
      ".json5": /* @__PURE__ */ __name(() => import("./json5-YQ5AB5JM.mjs").then((r3) => r3.parseJSON5), ".json5"),
      ".toml": /* @__PURE__ */ __name(() => import("./toml-PU6R72XG.mjs").then((r3) => r3.parseTOML), ".toml")
    };
    SUPPORTED_EXTENSIONS = Object.freeze([
      // with jiti
      ".js",
      ".ts",
      ".mjs",
      ".cjs",
      ".mts",
      ".cts",
      ".json",
      // with confbox
      ".jsonc",
      ".json5",
      ".yaml",
      ".yml",
      ".toml"
    ]);
    __name(loadConfig, "loadConfig");
    __name(extendConfig, "extendConfig");
    GIGET_PREFIXES = [
      "gh:",
      "github:",
      "gitlab:",
      "bitbucket:",
      "https://",
      "http://"
    ];
    NPM_PACKAGE_RE = /^(@[\da-z~-][\d._a-z~-]*\/)?[\da-z~-][\d._a-z~-]*($|\/.*)/;
    __name(resolveConfig, "resolveConfig");
    __name(tryResolve, "tryResolve");
  }
});

// node_modules/@trigger.dev/build/node_modules/perfect-debounce/dist/index.mjs
function debounce(fn, wait = 25, options = {}) {
  options = { ...DEBOUNCE_DEFAULTS, ...options };
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  let currentPromise;
  let trailingArgs;
  const applyFn = /* @__PURE__ */ __name((_this, args) => {
    currentPromise = _applyPromised(fn, _this, args);
    currentPromise.finally(() => {
      currentPromise = null;
      if (options.trailing && trailingArgs && !timeout) {
        const promise = applyFn(_this, trailingArgs);
        trailingArgs = null;
        return promise;
      }
    });
    return currentPromise;
  }, "applyFn");
  return function(...args) {
    if (currentPromise) {
      if (options.trailing) {
        trailingArgs = args;
      }
      return currentPromise;
    }
    return new Promise((resolve4) => {
      const shouldCallNow = !timeout && options.leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const promise = options.leading ? leadingValue : applyFn(this, args);
        for (const _resolve of resolveList) {
          _resolve(promise);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = applyFn(this, args);
        resolve4(leadingValue);
      } else {
        resolveList.push(resolve4);
      }
    });
  };
}
async function _applyPromised(fn, _this, args) {
  return await fn.apply(_this, args);
}
var DEBOUNCE_DEFAULTS;
var init_dist6 = __esm({
  "node_modules/@trigger.dev/build/node_modules/perfect-debounce/dist/index.mjs"() {
    init_esm();
    DEBOUNCE_DEFAULTS = {
      trailing: true
    };
    __name(debounce, "debounce");
    __name(_applyPromised, "_applyPromised");
  }
});

// node_modules/@trigger.dev/build/node_modules/c12/dist/index.mjs
function createDefineConfig() {
  return (input) => input;
}
async function watchConfig(options) {
  let config = await loadConfig(options);
  const configName = options.name || "config";
  const configFileName = options.configFile ?? (options.name === "config" ? "config" : `${options.name}.config`);
  const watchingFiles = [
    ...new Set(
      (config.layers || []).filter((l) => l.cwd).flatMap((l) => [
        ...SUPPORTED_EXTENSIONS.flatMap((ext) => [
          resolve(l.cwd, configFileName + ext),
          resolve(l.cwd, ".config", configFileName + ext),
          resolve(
            l.cwd,
            ".config",
            configFileName.replace(/\.config$/, "") + ext
          )
        ]),
        l.source && resolve(l.cwd, l.source),
        // TODO: Support watching rc from home and workspace
        options.rcFile && resolve(
          l.cwd,
          typeof options.rcFile === "string" ? options.rcFile : `.${configName}rc`
        ),
        options.packageJson && resolve(l.cwd, "package.json")
      ]).filter(Boolean)
    )
  ];
  const watch = await import("./esm-3BRLZ6OK.mjs").then((r3) => r3.watch || r3.default || r3);
  const { diff } = await import("./utils-PDP6CAPN.mjs");
  const _fswatcher = watch(watchingFiles, {
    ignoreInitial: true,
    ...options.chokidarOptions
  });
  const onChange = /* @__PURE__ */ __name(async (event, path2) => {
    const type = eventMap[event];
    if (!type) {
      return;
    }
    if (options.onWatch) {
      await options.onWatch({
        type,
        path: path2
      });
    }
    const oldConfig = config;
    try {
      config = await loadConfig(options);
    } catch (error) {
      console.warn(`Failed to load config ${path2}
${error}`);
      return;
    }
    const changeCtx = {
      newConfig: config,
      oldConfig,
      getDiff: /* @__PURE__ */ __name(() => diff(oldConfig.config, config.config), "getDiff")
    };
    if (options.acceptHMR) {
      const changeHandled = await options.acceptHMR(changeCtx);
      if (changeHandled) {
        return;
      }
    }
    if (options.onUpdate) {
      await options.onUpdate(changeCtx);
    }
  }, "onChange");
  if (options.debounce === false) {
    _fswatcher.on("all", onChange);
  } else {
    _fswatcher.on("all", debounce(onChange, options.debounce ?? 100));
  }
  const utils = {
    watchingFiles,
    unwatch: /* @__PURE__ */ __name(async () => {
      await _fswatcher.close();
    }, "unwatch")
  };
  return new Proxy(utils, {
    get(_, prop) {
      if (prop in utils) {
        return utils[prop];
      }
      return config[prop];
    }
  });
}
var import_dotenv, eventMap;
var init_dist7 = __esm({
  "node_modules/@trigger.dev/build/node_modules/c12/dist/index.mjs"() {
    init_esm();
    init_c12_BXpNC6YI();
    init_c12_BXpNC6YI();
    init_dist6();
    init_dist();
    init_jiti();
    init_defu();
    import_dotenv = __toESM(require_main(), 1);
    __name(createDefineConfig, "createDefineConfig");
    eventMap = {
      add: "created",
      change: "updated",
      unlink: "removed"
    };
    __name(watchConfig, "watchConfig");
  }
});
init_dist7();
export {
  SUPPORTED_EXTENSIONS,
  createDefineConfig,
  loadConfig,
  loadDotenv,
  setupDotenv,
  watchConfig
};
//# sourceMappingURL=dist-IYBQI67O.mjs.map
