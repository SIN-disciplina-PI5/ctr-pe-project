import {
  __commonJS,
  __name,
  __require,
  init_esm
} from "./chunk-5A2LE32G.mjs";

// node_modules/@vercel/cli-exec/dist/errors.js
var require_errors = __commonJS({
  "node_modules/@vercel/cli-exec/dist/errors.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var errors_exports = {};
    __export(errors_exports, {
      VercelCliError: /* @__PURE__ */ __name(() => VercelCliError2, "VercelCliError"),
      assertValidCwd: /* @__PURE__ */ __name(() => assertValidCwd, "assertValidCwd"),
      getCliNotFoundMessage: /* @__PURE__ */ __name(() => getCliNotFoundMessage, "getCliNotFoundMessage"),
      toVercelCliError: /* @__PURE__ */ __name(() => toVercelCliError, "toVercelCliError")
    });
    module.exports = __toCommonJS(errors_exports);
    var import_promises = __require("node:fs/promises");
    var VercelCliError2 = class extends Error {
      static {
        __name(this, "VercelCliError");
      }
      constructor(options) {
        super(options.message);
        this.name = "VercelCliError";
        this.code = options.code;
        this.invocation = options.invocation;
        this.stdout = options.stdout;
        this.stderr = options.stderr;
        this.exitCode = options.exitCode;
        if (options.cause !== void 0) {
          this.cause = options.cause;
        }
      }
    };
    function getCliNotFoundMessage(diagnostics) {
      const details = [];
      const { localBinSearch } = diagnostics;
      if (localBinSearch.stopReason === "project-root-marker") {
        details.push(
          `Local bin lookup stopped at ${JSON.stringify(localBinSearch.stoppedAt)} (${JSON.stringify(localBinSearch.markerPath)}).`
        );
      } else if (localBinSearch.stopReason === "filesystem-root") {
        details.push(
          `No project root marker was found from ${JSON.stringify(localBinSearch.searchRoot)}; local bin lookup reached the filesystem root.`
        );
      }
      for (const skippedNodeModules of localBinSearch.skippedNodeModules) {
        details.push(
          `Skipped ${JSON.stringify(skippedNodeModules.directory)}: ${skippedNodeModules.reason}.`
        );
      }
      for (const skippedLocalBin of diagnostics.skippedLocalBins) {
        details.push(
          `Skipped ${JSON.stringify(skippedLocalBin.candidate)}: ${skippedLocalBin.reason}.`
        );
      }
      if (details.length === 0) {
        return "Unable to find a usable Vercel CLI installation.";
      }
      return ["Unable to find a usable Vercel CLI installation.", ...details].join(
        "\n"
      );
    }
    __name(getCliNotFoundMessage, "getCliNotFoundMessage");
    async function assertValidCwd(cwd) {
      try {
        if (!(await (0, import_promises.stat)(cwd)).isDirectory()) {
          throw new Error("not a directory");
        }
      } catch {
        throw new VercelCliError2({
          code: "VERCEL_CLI_INVALID_CWD",
          message: `Working directory ${JSON.stringify(cwd)} does not exist or is not a directory.`
        });
      }
    }
    __name(assertValidCwd, "assertValidCwd");
    function toVercelCliError(invocation, error) {
      if (typeof error === "object" && error !== null) {
        const execaError = error;
        if (execaError.code === "ENOENT") {
          return new VercelCliError2({
            code: "VERCEL_CLI_NOT_FOUND",
            message: `Unable to find Vercel CLI command ${JSON.stringify(invocation.command)}.`,
            invocation,
            cause: error
          });
        }
        if (execaError.code === "EACCES" || execaError.code === "EPERM") {
          return new VercelCliError2({
            code: "VERCEL_CLI_PERMISSION_DENIED",
            message: `Permission denied while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
            invocation,
            cause: error
          });
        }
        if (execaError.timedOut) {
          return new VercelCliError2({
            code: "VERCEL_CLI_TIMED_OUT",
            message: `Timed out while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
            invocation,
            stdout: execaError.stdout,
            stderr: execaError.stderr,
            cause: error
          });
        }
        if (execaError.isCanceled) {
          return new VercelCliError2({
            code: "VERCEL_CLI_CANCELED",
            message: `Canceled while executing Vercel CLI command ${JSON.stringify(invocation.command)}.`,
            invocation,
            stdout: execaError.stdout,
            stderr: execaError.stderr,
            cause: error
          });
        }
        if (execaError.signal) {
          return new VercelCliError2({
            code: "VERCEL_CLI_SIGNALED",
            message: `Vercel CLI command ${JSON.stringify(invocation.command)} exited due to signal ${execaError.signal}.`,
            invocation,
            stdout: execaError.stdout,
            stderr: execaError.stderr,
            cause: error
          });
        }
        if (typeof execaError.exitCode === "number") {
          return new VercelCliError2({
            code: "VERCEL_CLI_ERRORED",
            message: execaError.shortMessage ?? execaError.message ?? `Vercel CLI command ${JSON.stringify(invocation.command)} exited with code ${execaError.exitCode}.`,
            invocation,
            stdout: execaError.stdout,
            stderr: execaError.stderr,
            exitCode: execaError.exitCode,
            cause: error
          });
        }
      }
      return new VercelCliError2({
        code: "VERCEL_CLI_EXEC_FAILED",
        message: `Could not execute Vercel CLI command ${JSON.stringify(invocation.command)}.`,
        invocation,
        cause: error
      });
    }
    __name(toVercelCliError, "toVercelCliError");
  }
});

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports, module) {
    init_esm();
    module.exports = isexe;
    isexe.sync = sync;
    var fs = __require("fs");
    function checkPathExt(path, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    __name(checkPathExt, "checkPathExt");
    function checkStat(stat, path, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path, options);
    }
    __name(checkStat, "checkStat");
    function isexe(path, options, cb) {
      fs.stat(path, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path, options));
      });
    }
    __name(isexe, "isexe");
    function sync(path, options) {
      return checkStat(fs.statSync(path), path, options);
    }
    __name(sync, "sync");
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports, module) {
    init_esm();
    module.exports = isexe;
    isexe.sync = sync;
    var fs = __require("fs");
    function isexe(path, options, cb) {
      fs.stat(path, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    __name(isexe, "isexe");
    function sync(path, options) {
      return checkStat(fs.statSync(path), options);
    }
    __name(sync, "sync");
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    __name(checkStat, "checkStat");
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
    __name(checkMode, "checkMode");
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports, module) {
    init_esm();
    var fs = __require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module.exports = isexe;
    isexe.sync = sync;
    function isexe(path, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    __name(isexe, "isexe");
    function sync(path, options) {
      try {
        return core.sync(path, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
    __name(sync, "sync");
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports, module) {
    init_esm();
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path = __require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = /* @__PURE__ */ __name((cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" }), "getNotFoundError");
    var getPathInfo = /* @__PURE__ */ __name((cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        // windows always checks the cwd first
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
        "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    }, "getPathInfo");
    var which = /* @__PURE__ */ __name((cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = /* @__PURE__ */ __name((i) => new Promise((resolve, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i, 0));
      }), "step");
      const subStep = /* @__PURE__ */ __name((p, i, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i, ii + 1));
        });
      }), "subStep");
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    }, "which");
    var whichSync = /* @__PURE__ */ __name((cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    }, "whichSync");
    module.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports, module) {
    "use strict";
    init_esm();
    var pathKey = /* @__PURE__ */ __name((options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    }, "pathKey");
    module.exports = pathKey;
    module.exports.default = pathKey;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module) {
    "use strict";
    init_esm();
    var path = __require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env[getPathKey({ env })],
          pathExt: withoutPathExt ? path.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    __name(resolveCommandAttempt, "resolveCommandAttempt");
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    __name(resolveCommand, "resolveCommand");
    module.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports, module) {
    "use strict";
    init_esm();
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    __name(escapeCommand, "escapeCommand");
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
      arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    __name(escapeArgument, "escapeArgument");
    module.exports.command = escapeCommand;
    module.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports, module) {
    "use strict";
    init_esm();
    module.exports = /^#!(.*)/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports, module) {
    "use strict";
    init_esm();
    var shebangRegex = require_shebang_regex();
    module.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports, module) {
    "use strict";
    init_esm();
    var fs = __require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs.openSync(command, "r");
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    __name(readShebang, "readShebang");
    module.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports, module) {
    "use strict";
    init_esm();
    var path = __require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    __name(detectShebang, "detectShebang");
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    __name(parseNonShell, "parseNonShell");
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    __name(parse, "parse");
    module.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports, module) {
    "use strict";
    init_esm();
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    __name(notFoundError, "notFoundError");
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    __name(hookChildProcess, "hookChildProcess");
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    __name(verifyENOENT, "verifyENOENT");
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    __name(verifyENOENTSync, "verifyENOENTSync");
    module.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports, module) {
    "use strict";
    init_esm();
    var cp = __require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    __name(spawn, "spawn");
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    __name(spawnSync, "spawnSync");
    module.exports = spawn;
    module.exports.spawn = spawn;
    module.exports.sync = spawnSync;
    module.exports._parse = parse;
    module.exports._enoent = enoent;
  }
});

// node_modules/strip-final-newline/index.js
var require_strip_final_newline = __commonJS({
  "node_modules/strip-final-newline/index.js"(exports, module) {
    "use strict";
    init_esm();
    module.exports = (input) => {
      const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
      const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
      if (input[input.length - 1] === LF) {
        input = input.slice(0, input.length - 1);
      }
      if (input[input.length - 1] === CR) {
        input = input.slice(0, input.length - 1);
      }
      return input;
    };
  }
});

// node_modules/npm-run-path/index.js
var require_npm_run_path = __commonJS({
  "node_modules/npm-run-path/index.js"(exports, module) {
    "use strict";
    init_esm();
    var path = __require("path");
    var pathKey = require_path_key();
    var npmRunPath = /* @__PURE__ */ __name((options) => {
      options = {
        cwd: process.cwd(),
        path: process.env[pathKey()],
        execPath: process.execPath,
        ...options
      };
      let previous;
      let cwdPath = path.resolve(options.cwd);
      const result = [];
      while (previous !== cwdPath) {
        result.push(path.join(cwdPath, "node_modules/.bin"));
        previous = cwdPath;
        cwdPath = path.resolve(cwdPath, "..");
      }
      const execPathDir = path.resolve(options.cwd, options.execPath, "..");
      result.push(execPathDir);
      return result.concat(options.path).join(path.delimiter);
    }, "npmRunPath");
    module.exports = npmRunPath;
    module.exports.default = npmRunPath;
    module.exports.env = (options) => {
      options = {
        env: process.env,
        ...options
      };
      const env = { ...options.env };
      const path2 = pathKey({ env });
      options.path = env[path2];
      env[path2] = module.exports(options);
      return env;
    };
  }
});

// node_modules/mimic-fn/index.js
var require_mimic_fn = __commonJS({
  "node_modules/mimic-fn/index.js"(exports, module) {
    "use strict";
    init_esm();
    var mimicFn = /* @__PURE__ */ __name((to, from) => {
      for (const prop of Reflect.ownKeys(from)) {
        Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
      }
      return to;
    }, "mimicFn");
    module.exports = mimicFn;
    module.exports.default = mimicFn;
  }
});

// node_modules/onetime/index.js
var require_onetime = __commonJS({
  "node_modules/onetime/index.js"(exports, module) {
    "use strict";
    init_esm();
    var mimicFn = require_mimic_fn();
    var calledFunctions = /* @__PURE__ */ new WeakMap();
    var onetime = /* @__PURE__ */ __name((function_, options = {}) => {
      if (typeof function_ !== "function") {
        throw new TypeError("Expected a function");
      }
      let returnValue;
      let callCount = 0;
      const functionName = function_.displayName || function_.name || "<anonymous>";
      const onetime2 = /* @__PURE__ */ __name(function(...arguments_) {
        calledFunctions.set(onetime2, ++callCount);
        if (callCount === 1) {
          returnValue = function_.apply(this, arguments_);
          function_ = null;
        } else if (options.throw === true) {
          throw new Error(`Function \`${functionName}\` can only be called once`);
        }
        return returnValue;
      }, "onetime");
      mimicFn(onetime2, function_);
      calledFunctions.set(onetime2, callCount);
      return onetime2;
    }, "onetime");
    module.exports = onetime;
    module.exports.default = onetime;
    module.exports.callCount = (function_) => {
      if (!calledFunctions.has(function_)) {
        throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
      }
      return calledFunctions.get(function_);
    };
  }
});

// node_modules/human-signals/build/src/core.js
var require_core = __commonJS({
  "node_modules/human-signals/build/src/core.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SIGNALS = void 0;
    var SIGNALS = [
      {
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
      },
      {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
      },
      {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
      },
      {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
      },
      {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
      },
      {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
      },
      {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
      },
      {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
      },
      {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
      },
      {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
      },
      {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
      },
      {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
      },
      {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
      },
      {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
      },
      {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
      },
      {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
      },
      {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
      },
      {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
      },
      {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
      },
      {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
      },
      {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
      },
      {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
      },
      {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
      },
      {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
      },
      {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
      },
      {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
      },
      {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
      },
      {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
      },
      {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
      },
      {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
      },
      {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
      }
    ];
    exports.SIGNALS = SIGNALS;
  }
});

// node_modules/human-signals/build/src/realtime.js
var require_realtime = __commonJS({
  "node_modules/human-signals/build/src/realtime.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SIGRTMAX = exports.getRealtimeSignals = void 0;
    var getRealtimeSignals = /* @__PURE__ */ __name(function() {
      const length = SIGRTMAX - SIGRTMIN + 1;
      return Array.from({ length }, getRealtimeSignal);
    }, "getRealtimeSignals");
    exports.getRealtimeSignals = getRealtimeSignals;
    var getRealtimeSignal = /* @__PURE__ */ __name(function(value, index) {
      return {
        name: `SIGRT${index + 1}`,
        number: SIGRTMIN + index,
        action: "terminate",
        description: "Application-specific signal (realtime)",
        standard: "posix"
      };
    }, "getRealtimeSignal");
    var SIGRTMIN = 34;
    var SIGRTMAX = 64;
    exports.SIGRTMAX = SIGRTMAX;
  }
});

// node_modules/human-signals/build/src/signals.js
var require_signals = __commonJS({
  "node_modules/human-signals/build/src/signals.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSignals = void 0;
    var _os = __require("os");
    var _core = require_core();
    var _realtime = require_realtime();
    var getSignals = /* @__PURE__ */ __name(function() {
      const realtimeSignals = (0, _realtime.getRealtimeSignals)();
      const signals = [..._core.SIGNALS, ...realtimeSignals].map(normalizeSignal);
      return signals;
    }, "getSignals");
    exports.getSignals = getSignals;
    var normalizeSignal = /* @__PURE__ */ __name(function({
      name,
      number: defaultNumber,
      description,
      action,
      forced = false,
      standard
    }) {
      const {
        signals: { [name]: constantSignal }
      } = _os.constants;
      const supported = constantSignal !== void 0;
      const number = supported ? constantSignal : defaultNumber;
      return { name, number, description, supported, action, forced, standard };
    }, "normalizeSignal");
  }
});

// node_modules/human-signals/build/src/main.js
var require_main = __commonJS({
  "node_modules/human-signals/build/src/main.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.signalsByNumber = exports.signalsByName = void 0;
    var _os = __require("os");
    var _signals = require_signals();
    var _realtime = require_realtime();
    var getSignalsByName = /* @__PURE__ */ __name(function() {
      const signals = (0, _signals.getSignals)();
      return signals.reduce(getSignalByName, {});
    }, "getSignalsByName");
    var getSignalByName = /* @__PURE__ */ __name(function(signalByNameMemo, { name, number, description, supported, action, forced, standard }) {
      return {
        ...signalByNameMemo,
        [name]: { name, number, description, supported, action, forced, standard }
      };
    }, "getSignalByName");
    var signalsByName = getSignalsByName();
    exports.signalsByName = signalsByName;
    var getSignalsByNumber = /* @__PURE__ */ __name(function() {
      const signals = (0, _signals.getSignals)();
      const length = _realtime.SIGRTMAX + 1;
      const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
      return Object.assign({}, ...signalsA);
    }, "getSignalsByNumber");
    var getSignalByNumber = /* @__PURE__ */ __name(function(number, signals) {
      const signal = findSignalByNumber(number, signals);
      if (signal === void 0) {
        return {};
      }
      const { name, description, supported, action, forced, standard } = signal;
      return {
        [number]: {
          name,
          number,
          description,
          supported,
          action,
          forced,
          standard
        }
      };
    }, "getSignalByNumber");
    var findSignalByNumber = /* @__PURE__ */ __name(function(number, signals) {
      const signal = signals.find(({ name }) => _os.constants.signals[name] === number);
      if (signal !== void 0) {
        return signal;
      }
      return signals.find((signalA) => signalA.number === number);
    }, "findSignalByNumber");
    var signalsByNumber = getSignalsByNumber();
    exports.signalsByNumber = signalsByNumber;
  }
});

// node_modules/execa/lib/error.js
var require_error = __commonJS({
  "node_modules/execa/lib/error.js"(exports, module) {
    "use strict";
    init_esm();
    var { signalsByName } = require_main();
    var getErrorPrefix = /* @__PURE__ */ __name(({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
      if (timedOut) {
        return `timed out after ${timeout} milliseconds`;
      }
      if (isCanceled) {
        return "was canceled";
      }
      if (errorCode !== void 0) {
        return `failed with ${errorCode}`;
      }
      if (signal !== void 0) {
        return `was killed with ${signal} (${signalDescription})`;
      }
      if (exitCode !== void 0) {
        return `failed with exit code ${exitCode}`;
      }
      return "failed";
    }, "getErrorPrefix");
    var makeError = /* @__PURE__ */ __name(({
      stdout,
      stderr,
      all,
      error,
      signal,
      exitCode,
      command,
      escapedCommand,
      timedOut,
      isCanceled,
      killed,
      parsed: { options: { timeout } }
    }) => {
      exitCode = exitCode === null ? void 0 : exitCode;
      signal = signal === null ? void 0 : signal;
      const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
      const errorCode = error && error.code;
      const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
      const execaMessage = `Command ${prefix}: ${command}`;
      const isError = Object.prototype.toString.call(error) === "[object Error]";
      const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
      const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
      if (isError) {
        error.originalMessage = error.message;
        error.message = message;
      } else {
        error = new Error(message);
      }
      error.shortMessage = shortMessage;
      error.command = command;
      error.escapedCommand = escapedCommand;
      error.exitCode = exitCode;
      error.signal = signal;
      error.signalDescription = signalDescription;
      error.stdout = stdout;
      error.stderr = stderr;
      if (all !== void 0) {
        error.all = all;
      }
      if ("bufferedData" in error) {
        delete error.bufferedData;
      }
      error.failed = true;
      error.timedOut = Boolean(timedOut);
      error.isCanceled = isCanceled;
      error.killed = killed && !timedOut;
      return error;
    }, "makeError");
    module.exports = makeError;
  }
});

// node_modules/execa/lib/stdio.js
var require_stdio = __commonJS({
  "node_modules/execa/lib/stdio.js"(exports, module) {
    "use strict";
    init_esm();
    var aliases = ["stdin", "stdout", "stderr"];
    var hasAlias = /* @__PURE__ */ __name((options) => aliases.some((alias) => options[alias] !== void 0), "hasAlias");
    var normalizeStdio = /* @__PURE__ */ __name((options) => {
      if (!options) {
        return;
      }
      const { stdio } = options;
      if (stdio === void 0) {
        return aliases.map((alias) => options[alias]);
      }
      if (hasAlias(options)) {
        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
      }
      if (typeof stdio === "string") {
        return stdio;
      }
      if (!Array.isArray(stdio)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
      }
      const length = Math.max(stdio.length, aliases.length);
      return Array.from({ length }, (value, index) => stdio[index]);
    }, "normalizeStdio");
    module.exports = normalizeStdio;
    module.exports.node = (options) => {
      const stdio = normalizeStdio(options);
      if (stdio === "ipc") {
        return "ipc";
      }
      if (stdio === void 0 || typeof stdio === "string") {
        return [stdio, stdio, stdio, "ipc"];
      }
      if (stdio.includes("ipc")) {
        return stdio;
      }
      return [...stdio, "ipc"];
    };
  }
});

// node_modules/execa/node_modules/signal-exit/signals.js
var require_signals2 = __commonJS({
  "node_modules/execa/node_modules/signal-exit/signals.js"(exports, module) {
    init_esm();
    module.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// node_modules/execa/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "node_modules/execa/node_modules/signal-exit/index.js"(exports, module) {
    init_esm();
    var process2 = global.process;
    var processOk = /* @__PURE__ */ __name(function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    }, "processOk");
    if (!processOk(process2)) {
      module.exports = function() {
        return function() {
        };
      };
    } else {
      assert = __require("assert");
      signals = require_signals2();
      isWin = /^win/i.test(process2.platform);
      EE = __require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove = /* @__PURE__ */ __name(function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        }, "remove");
        emitter.on(ev, cb);
        return remove;
      };
      unload = /* @__PURE__ */ __name(function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      }, "unload");
      module.exports.unload = unload;
      emit = /* @__PURE__ */ __name(function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      }, "emit");
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = /* @__PURE__ */ __name(function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        }, "listener");
      });
      module.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load = /* @__PURE__ */ __name(function load2() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      }, "load");
      module.exports.load = load;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = /* @__PURE__ */ __name(function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code || /* istanbul ignore next */
        0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      }, "processReallyExit");
      originalProcessEmit = process2.emit;
      processEmit = /* @__PURE__ */ __name(function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      }, "processEmit");
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// node_modules/execa/lib/kill.js
var require_kill = __commonJS({
  "node_modules/execa/lib/kill.js"(exports, module) {
    "use strict";
    init_esm();
    var os = __require("os");
    var onExit = require_signal_exit();
    var DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
    var spawnedKill = /* @__PURE__ */ __name((kill, signal = "SIGTERM", options = {}) => {
      const killResult = kill(signal);
      setKillTimeout(kill, signal, options, killResult);
      return killResult;
    }, "spawnedKill");
    var setKillTimeout = /* @__PURE__ */ __name((kill, signal, options, killResult) => {
      if (!shouldForceKill(signal, options, killResult)) {
        return;
      }
      const timeout = getForceKillAfterTimeout(options);
      const t = setTimeout(() => {
        kill("SIGKILL");
      }, timeout);
      if (t.unref) {
        t.unref();
      }
    }, "setKillTimeout");
    var shouldForceKill = /* @__PURE__ */ __name((signal, { forceKillAfterTimeout }, killResult) => {
      return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
    }, "shouldForceKill");
    var isSigterm = /* @__PURE__ */ __name((signal) => {
      return signal === os.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
    }, "isSigterm");
    var getForceKillAfterTimeout = /* @__PURE__ */ __name(({ forceKillAfterTimeout = true }) => {
      if (forceKillAfterTimeout === true) {
        return DEFAULT_FORCE_KILL_TIMEOUT;
      }
      if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
        throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
      }
      return forceKillAfterTimeout;
    }, "getForceKillAfterTimeout");
    var spawnedCancel = /* @__PURE__ */ __name((spawned, context) => {
      const killResult = spawned.kill();
      if (killResult) {
        context.isCanceled = true;
      }
    }, "spawnedCancel");
    var timeoutKill = /* @__PURE__ */ __name((spawned, signal, reject) => {
      spawned.kill(signal);
      reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
    }, "timeoutKill");
    var setupTimeout = /* @__PURE__ */ __name((spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
      if (timeout === 0 || timeout === void 0) {
        return spawnedPromise;
      }
      let timeoutId;
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          timeoutKill(spawned, killSignal, reject);
        }, timeout);
      });
      const safeSpawnedPromise = spawnedPromise.finally(() => {
        clearTimeout(timeoutId);
      });
      return Promise.race([timeoutPromise, safeSpawnedPromise]);
    }, "setupTimeout");
    var validateTimeout = /* @__PURE__ */ __name(({ timeout }) => {
      if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
        throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
      }
    }, "validateTimeout");
    var setExitHandler = /* @__PURE__ */ __name(async (spawned, { cleanup, detached }, timedPromise) => {
      if (!cleanup || detached) {
        return timedPromise;
      }
      const removeExitHandler = onExit(() => {
        spawned.kill();
      });
      return timedPromise.finally(() => {
        removeExitHandler();
      });
    }, "setExitHandler");
    module.exports = {
      spawnedKill,
      spawnedCancel,
      setupTimeout,
      validateTimeout,
      setExitHandler
    };
  }
});

// node_modules/is-stream/index.js
var require_is_stream = __commonJS({
  "node_modules/is-stream/index.js"(exports, module) {
    "use strict";
    init_esm();
    var isStream = /* @__PURE__ */ __name((stream) => stream !== null && typeof stream === "object" && typeof stream.pipe === "function", "isStream");
    isStream.writable = (stream) => isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
    isStream.readable = (stream) => isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
    isStream.duplex = (stream) => isStream.writable(stream) && isStream.readable(stream);
    isStream.transform = (stream) => isStream.duplex(stream) && typeof stream._transform === "function";
    module.exports = isStream;
  }
});

// node_modules/get-stream/buffer-stream.js
var require_buffer_stream = __commonJS({
  "node_modules/get-stream/buffer-stream.js"(exports, module) {
    "use strict";
    init_esm();
    var { PassThrough: PassThroughStream } = __require("stream");
    module.exports = (options) => {
      options = { ...options };
      const { array } = options;
      let { encoding } = options;
      const isBuffer = encoding === "buffer";
      let objectMode = false;
      if (array) {
        objectMode = !(encoding || isBuffer);
      } else {
        encoding = encoding || "utf8";
      }
      if (isBuffer) {
        encoding = null;
      }
      const stream = new PassThroughStream({ objectMode });
      if (encoding) {
        stream.setEncoding(encoding);
      }
      let length = 0;
      const chunks = [];
      stream.on("data", (chunk) => {
        chunks.push(chunk);
        if (objectMode) {
          length = chunks.length;
        } else {
          length += chunk.length;
        }
      });
      stream.getBufferedValue = () => {
        if (array) {
          return chunks;
        }
        return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
      };
      stream.getBufferedLength = () => length;
      return stream;
    };
  }
});

// node_modules/get-stream/index.js
var require_get_stream = __commonJS({
  "node_modules/get-stream/index.js"(exports, module) {
    "use strict";
    init_esm();
    var { constants: BufferConstants } = __require("buffer");
    var stream = __require("stream");
    var { promisify } = __require("util");
    var bufferStream = require_buffer_stream();
    var streamPipelinePromisified = promisify(stream.pipeline);
    var MaxBufferError = class extends Error {
      static {
        __name(this, "MaxBufferError");
      }
      constructor() {
        super("maxBuffer exceeded");
        this.name = "MaxBufferError";
      }
    };
    async function getStream(inputStream, options) {
      if (!inputStream) {
        throw new Error("Expected a stream");
      }
      options = {
        maxBuffer: Infinity,
        ...options
      };
      const { maxBuffer } = options;
      const stream2 = bufferStream(options);
      await new Promise((resolve, reject) => {
        const rejectPromise = /* @__PURE__ */ __name((error) => {
          if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
            error.bufferedData = stream2.getBufferedValue();
          }
          reject(error);
        }, "rejectPromise");
        (async () => {
          try {
            await streamPipelinePromisified(inputStream, stream2);
            resolve();
          } catch (error) {
            rejectPromise(error);
          }
        })();
        stream2.on("data", () => {
          if (stream2.getBufferedLength() > maxBuffer) {
            rejectPromise(new MaxBufferError());
          }
        });
      });
      return stream2.getBufferedValue();
    }
    __name(getStream, "getStream");
    module.exports = getStream;
    module.exports.buffer = (stream2, options) => getStream(stream2, { ...options, encoding: "buffer" });
    module.exports.array = (stream2, options) => getStream(stream2, { ...options, array: true });
    module.exports.MaxBufferError = MaxBufferError;
  }
});

// node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "node_modules/merge-stream/index.js"(exports, module) {
    "use strict";
    init_esm();
    var { PassThrough } = __require("stream");
    module.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      __name(add, "add");
      function isEmpty() {
        return sources.length == 0;
      }
      __name(isEmpty, "isEmpty");
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
      __name(remove, "remove");
    };
  }
});

// node_modules/execa/lib/stream.js
var require_stream = __commonJS({
  "node_modules/execa/lib/stream.js"(exports, module) {
    "use strict";
    init_esm();
    var isStream = require_is_stream();
    var getStream = require_get_stream();
    var mergeStream = require_merge_stream();
    var handleInput = /* @__PURE__ */ __name((spawned, input) => {
      if (input === void 0 || spawned.stdin === void 0) {
        return;
      }
      if (isStream(input)) {
        input.pipe(spawned.stdin);
      } else {
        spawned.stdin.end(input);
      }
    }, "handleInput");
    var makeAllStream = /* @__PURE__ */ __name((spawned, { all }) => {
      if (!all || !spawned.stdout && !spawned.stderr) {
        return;
      }
      const mixed = mergeStream();
      if (spawned.stdout) {
        mixed.add(spawned.stdout);
      }
      if (spawned.stderr) {
        mixed.add(spawned.stderr);
      }
      return mixed;
    }, "makeAllStream");
    var getBufferedData = /* @__PURE__ */ __name(async (stream, streamPromise) => {
      if (!stream) {
        return;
      }
      stream.destroy();
      try {
        return await streamPromise;
      } catch (error) {
        return error.bufferedData;
      }
    }, "getBufferedData");
    var getStreamPromise = /* @__PURE__ */ __name((stream, { encoding, buffer, maxBuffer }) => {
      if (!stream || !buffer) {
        return;
      }
      if (encoding) {
        return getStream(stream, { encoding, maxBuffer });
      }
      return getStream.buffer(stream, { maxBuffer });
    }, "getStreamPromise");
    var getSpawnedResult = /* @__PURE__ */ __name(async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
      const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
      const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
      const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
      try {
        return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
      } catch (error) {
        return Promise.all([
          { error, signal: error.signal, timedOut: error.timedOut },
          getBufferedData(stdout, stdoutPromise),
          getBufferedData(stderr, stderrPromise),
          getBufferedData(all, allPromise)
        ]);
      }
    }, "getSpawnedResult");
    var validateInputSync = /* @__PURE__ */ __name(({ input }) => {
      if (isStream(input)) {
        throw new TypeError("The `input` option cannot be a stream in sync mode");
      }
    }, "validateInputSync");
    module.exports = {
      handleInput,
      makeAllStream,
      getSpawnedResult,
      validateInputSync
    };
  }
});

// node_modules/execa/lib/promise.js
var require_promise = __commonJS({
  "node_modules/execa/lib/promise.js"(exports, module) {
    "use strict";
    init_esm();
    var nativePromisePrototype = (async () => {
    })().constructor.prototype;
    var descriptors = ["then", "catch", "finally"].map((property) => [
      property,
      Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
    ]);
    var mergePromise = /* @__PURE__ */ __name((spawned, promise) => {
      for (const [property, descriptor] of descriptors) {
        const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
        Reflect.defineProperty(spawned, property, { ...descriptor, value });
      }
      return spawned;
    }, "mergePromise");
    var getSpawnedPromise = /* @__PURE__ */ __name((spawned) => {
      return new Promise((resolve, reject) => {
        spawned.on("exit", (exitCode, signal) => {
          resolve({ exitCode, signal });
        });
        spawned.on("error", (error) => {
          reject(error);
        });
        if (spawned.stdin) {
          spawned.stdin.on("error", (error) => {
            reject(error);
          });
        }
      });
    }, "getSpawnedPromise");
    module.exports = {
      mergePromise,
      getSpawnedPromise
    };
  }
});

// node_modules/execa/lib/command.js
var require_command = __commonJS({
  "node_modules/execa/lib/command.js"(exports, module) {
    "use strict";
    init_esm();
    var normalizeArgs = /* @__PURE__ */ __name((file, args = []) => {
      if (!Array.isArray(args)) {
        return [file];
      }
      return [file, ...args];
    }, "normalizeArgs");
    var NO_ESCAPE_REGEXP = /^[\w.-]+$/;
    var DOUBLE_QUOTES_REGEXP = /"/g;
    var escapeArg = /* @__PURE__ */ __name((arg) => {
      if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
        return arg;
      }
      return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
    }, "escapeArg");
    var joinCommand = /* @__PURE__ */ __name((file, args) => {
      return normalizeArgs(file, args).join(" ");
    }, "joinCommand");
    var getEscapedCommand = /* @__PURE__ */ __name((file, args) => {
      return normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
    }, "getEscapedCommand");
    var SPACES_REGEXP = / +/g;
    var parseCommand = /* @__PURE__ */ __name((command) => {
      const tokens = [];
      for (const token of command.trim().split(SPACES_REGEXP)) {
        const previousToken = tokens[tokens.length - 1];
        if (previousToken && previousToken.endsWith("\\")) {
          tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
        } else {
          tokens.push(token);
        }
      }
      return tokens;
    }, "parseCommand");
    module.exports = {
      joinCommand,
      getEscapedCommand,
      parseCommand
    };
  }
});

// node_modules/execa/index.js
var require_execa = __commonJS({
  "node_modules/execa/index.js"(exports, module) {
    "use strict";
    init_esm();
    var path = __require("path");
    var childProcess = __require("child_process");
    var crossSpawn = require_cross_spawn();
    var stripFinalNewline = require_strip_final_newline();
    var npmRunPath = require_npm_run_path();
    var onetime = require_onetime();
    var makeError = require_error();
    var normalizeStdio = require_stdio();
    var { spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler } = require_kill();
    var { handleInput, getSpawnedResult, makeAllStream, validateInputSync } = require_stream();
    var { mergePromise, getSpawnedPromise } = require_promise();
    var { joinCommand, parseCommand, getEscapedCommand } = require_command();
    var DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
    var getEnv = /* @__PURE__ */ __name(({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
      const env = extendEnv ? { ...process.env, ...envOption } : envOption;
      if (preferLocal) {
        return npmRunPath.env({ env, cwd: localDir, execPath });
      }
      return env;
    }, "getEnv");
    var handleArguments = /* @__PURE__ */ __name((file, args, options = {}) => {
      const parsed = crossSpawn._parse(file, args, options);
      file = parsed.command;
      args = parsed.args;
      options = parsed.options;
      options = {
        maxBuffer: DEFAULT_MAX_BUFFER,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: options.cwd || process.cwd(),
        execPath: process.execPath,
        encoding: "utf8",
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true,
        ...options
      };
      options.env = getEnv(options);
      options.stdio = normalizeStdio(options);
      if (process.platform === "win32" && path.basename(file, ".exe") === "cmd") {
        args.unshift("/q");
      }
      return { file, args, options, parsed };
    }, "handleArguments");
    var handleOutput = /* @__PURE__ */ __name((options, value, error) => {
      if (typeof value !== "string" && !Buffer.isBuffer(value)) {
        return error === void 0 ? void 0 : "";
      }
      if (options.stripFinalNewline) {
        return stripFinalNewline(value);
      }
      return value;
    }, "handleOutput");
    var execa = /* @__PURE__ */ __name((file, args, options) => {
      const parsed = handleArguments(file, args, options);
      const command = joinCommand(file, args);
      const escapedCommand = getEscapedCommand(file, args);
      validateTimeout(parsed.options);
      let spawned;
      try {
        spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
      } catch (error) {
        const dummySpawned = new childProcess.ChildProcess();
        const errorPromise = Promise.reject(makeError({
          error,
          stdout: "",
          stderr: "",
          all: "",
          command,
          escapedCommand,
          parsed,
          timedOut: false,
          isCanceled: false,
          killed: false
        }));
        return mergePromise(dummySpawned, errorPromise);
      }
      const spawnedPromise = getSpawnedPromise(spawned);
      const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
      const processDone = setExitHandler(spawned, parsed.options, timedPromise);
      const context = { isCanceled: false };
      spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
      spawned.cancel = spawnedCancel.bind(null, spawned, context);
      const handlePromise = /* @__PURE__ */ __name(async () => {
        const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
        const stdout = handleOutput(parsed.options, stdoutResult);
        const stderr = handleOutput(parsed.options, stderrResult);
        const all = handleOutput(parsed.options, allResult);
        if (error || exitCode !== 0 || signal !== null) {
          const returnedError = makeError({
            error,
            exitCode,
            signal,
            stdout,
            stderr,
            all,
            command,
            escapedCommand,
            parsed,
            timedOut,
            isCanceled: context.isCanceled,
            killed: spawned.killed
          });
          if (!parsed.options.reject) {
            return returnedError;
          }
          throw returnedError;
        }
        return {
          command,
          escapedCommand,
          exitCode: 0,
          stdout,
          stderr,
          all,
          failed: false,
          timedOut: false,
          isCanceled: false,
          killed: false
        };
      }, "handlePromise");
      const handlePromiseOnce = onetime(handlePromise);
      handleInput(spawned, parsed.options.input);
      spawned.all = makeAllStream(spawned, parsed.options);
      return mergePromise(spawned, handlePromiseOnce);
    }, "execa");
    module.exports = execa;
    module.exports.sync = (file, args, options) => {
      const parsed = handleArguments(file, args, options);
      const command = joinCommand(file, args);
      const escapedCommand = getEscapedCommand(file, args);
      validateInputSync(parsed.options);
      let result;
      try {
        result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
      } catch (error) {
        throw makeError({
          error,
          stdout: "",
          stderr: "",
          all: "",
          command,
          escapedCommand,
          parsed,
          timedOut: false,
          isCanceled: false,
          killed: false
        });
      }
      const stdout = handleOutput(parsed.options, result.stdout, result.error);
      const stderr = handleOutput(parsed.options, result.stderr, result.error);
      if (result.error || result.status !== 0 || result.signal !== null) {
        const error = makeError({
          stdout,
          stderr,
          error: result.error,
          signal: result.signal,
          exitCode: result.status,
          command,
          escapedCommand,
          parsed,
          timedOut: result.error && result.error.code === "ETIMEDOUT",
          isCanceled: false,
          killed: result.signal !== null
        });
        if (!parsed.options.reject) {
          return error;
        }
        throw error;
      }
      return {
        command,
        escapedCommand,
        exitCode: 0,
        stdout,
        stderr,
        failed: false,
        timedOut: false,
        isCanceled: false,
        killed: false
      };
    };
    module.exports.command = (command, options) => {
      const [file, ...args] = parseCommand(command);
      return execa(file, args, options);
    };
    module.exports.commandSync = (command, options) => {
      const [file, ...args] = parseCommand(command);
      return execa.sync(file, args, options);
    };
    module.exports.node = (scriptPath, args, options = {}) => {
      if (args && !Array.isArray(args) && typeof args === "object") {
        options = args;
        args = [];
      }
      const stdio = normalizeStdio.node(options);
      const defaultExecArgv = process.execArgv.filter((arg) => !arg.startsWith("--inspect"));
      const {
        nodePath = process.execPath,
        nodeOptions = defaultExecArgv
      } = options;
      return execa(
        nodePath,
        [
          ...nodeOptions,
          scriptPath,
          ...Array.isArray(args) ? args : []
        ],
        {
          ...options,
          stdin: void 0,
          stdout: void 0,
          stderr: void 0,
          stdio,
          shell: false
        }
      );
    };
  }
});

// node_modules/@vercel/cli-exec/dist/envpath.js
var require_envpath = __commonJS({
  "node_modules/@vercel/cli-exec/dist/envpath.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var envpath_exports = {};
    __export(envpath_exports, {
      getEnvPath: /* @__PURE__ */ __name(() => getEnvPath, "getEnvPath"),
      prependPathEntries: /* @__PURE__ */ __name(() => prependPathEntries, "prependPathEntries"),
      setEnvPath: /* @__PURE__ */ __name(() => setEnvPath, "setEnvPath"),
      splitPath: /* @__PURE__ */ __name(() => splitPath, "splitPath")
    });
    module.exports = __toCommonJS(envpath_exports);
    var import_node_path = __toESM(__require("node:path"));
    function prependPathEntries(pathValue, directories) {
      const pathParts = pathValue.split(import_node_path.default.delimiter).filter(Boolean);
      const prepended = [];
      for (const directory of directories) {
        if (!pathParts.includes(directory) && !prepended.includes(directory)) {
          prepended.push(directory);
        }
      }
      if (prepended.length === 0) {
        return pathValue;
      }
      return pathValue === "" || pathValue === import_node_path.default.delimiter ? `${prepended.join(import_node_path.default.delimiter)}${pathValue}` : [...prepended, pathValue].join(import_node_path.default.delimiter);
    }
    __name(prependPathEntries, "prependPathEntries");
    function splitPath(pathValue) {
      return pathValue.split(import_node_path.default.delimiter).filter(Boolean);
    }
    __name(splitPath, "splitPath");
    function getEnvPath(env = process.env) {
      if (process.platform !== "win32") {
        return env.PATH ?? "";
      }
      const pathKeys = Object.keys(env).filter((key) => key.toLowerCase() === "path");
      for (let index = pathKeys.length - 1; index >= 0; index--) {
        const value = env[pathKeys[index]];
        if (value !== void 0) {
          return value;
        }
      }
      return "";
    }
    __name(getEnvPath, "getEnvPath");
    function setEnvPath(env = process.env, pathValue) {
      if (process.platform !== "win32") {
        return {
          ...env,
          PATH: pathValue
        };
      }
      const normalizedEnv = { ...env };
      for (const key of Object.keys(normalizedEnv)) {
        if (key !== "PATH" && key.toLowerCase() === "path") {
          delete normalizedEnv[key];
        }
      }
      normalizedEnv.PATH = pathValue;
      return normalizedEnv;
    }
    __name(setEnvPath, "setEnvPath");
  }
});

// node_modules/@vercel/cli-exec/dist/errutils.js
var require_errutils = __commonJS({
  "node_modules/@vercel/cli-exec/dist/errutils.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var errutils_exports = {};
    __export(errutils_exports, {
      getErrorMessage: /* @__PURE__ */ __name(() => getErrorMessage, "getErrorMessage"),
      isMissingPathError: /* @__PURE__ */ __name(() => isMissingPathError, "isMissingPathError")
    });
    module.exports = __toCommonJS(errutils_exports);
    function getErrorMessage(error) {
      if (error instanceof Error) {
        return error.message;
      }
      return String(error);
    }
    __name(getErrorMessage, "getErrorMessage");
    function isMissingPathError(error) {
      return typeof error === "object" && error !== null && "code" in error && (error.code === "ENOENT" || error.code === "ENOTDIR");
    }
    __name(isMissingPathError, "isMissingPathError");
  }
});

// node_modules/@vercel/cli-exec/dist/fsutils.js
var require_fsutils = __commonJS({
  "node_modules/@vercel/cli-exec/dist/fsutils.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var fsutils_exports = {};
    __export(fsutils_exports, {
      getCanonicalPath: /* @__PURE__ */ __name(() => getCanonicalPath, "getCanonicalPath"),
      getCommandBase: /* @__PURE__ */ __name(() => getCommandBase, "getCommandBase"),
      getDirectoriesBetween: /* @__PURE__ */ __name(() => getDirectoriesBetween, "getDirectoriesBetween"),
      isNodeScript: /* @__PURE__ */ __name(() => isNodeScript, "isNodeScript"),
      isSubpath: /* @__PURE__ */ __name(() => isSubpath, "isSubpath"),
      statIfExists: /* @__PURE__ */ __name(() => statIfExists, "statIfExists")
    });
    module.exports = __toCommonJS(fsutils_exports);
    var import_promises = __require("node:fs/promises");
    var import_node_path = __toESM(__require("node:path"));
    var import_errutils = require_errutils();
    async function getCanonicalPath(filePath) {
      try {
        return await (0, import_promises.realpath)(filePath);
      } catch {
        return filePath;
      }
    }
    __name(getCanonicalPath, "getCanonicalPath");
    function getDirectoriesBetween(parent, child) {
      const directories = [];
      let current = import_node_path.default.resolve(child);
      const resolvedParent = import_node_path.default.resolve(parent);
      while (true) {
        directories.push(current);
        if (current === resolvedParent) {
          return directories.reverse();
        }
        const next = import_node_path.default.dirname(current);
        if (next === current) {
          return [];
        }
        current = next;
      }
    }
    __name(getDirectoriesBetween, "getDirectoriesBetween");
    async function statIfExists(filePath) {
      try {
        return { stats: await (0, import_promises.stat)(filePath) };
      } catch (error) {
        if ((0, import_errutils.isMissingPathError)(error)) {
          return { missing: true };
        }
        return { reason: `could not inspect: ${(0, import_errutils.getErrorMessage)(error)}` };
      }
    }
    __name(statIfExists, "statIfExists");
    function isNodeScript(filePath) {
      return [".js", ".cjs", ".mjs"].includes(import_node_path.default.extname(filePath));
    }
    __name(isNodeScript, "isNodeScript");
    function isSubpath(parent, child) {
      const relativePath = import_node_path.default.relative(parent, child);
      return relativePath === "" || relativePath !== "" && !relativePath.startsWith("..") && !import_node_path.default.isAbsolute(relativePath);
    }
    __name(isSubpath, "isSubpath");
    function getCommandBase(command) {
      const extension = import_node_path.default.extname(command).toLowerCase();
      if (process.platform === "win32" && [".cmd", ".exe"].includes(extension)) {
        return import_node_path.default.basename(command, extension);
      }
      return import_node_path.default.basename(command);
    }
    __name(getCommandBase, "getCommandBase");
  }
});

// node_modules/@vercel/cli-exec/dist/safety.js
var require_safety = __commonJS({
  "node_modules/@vercel/cli-exec/dist/safety.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var safety_exports = {};
    __export(safety_exports, {
      getSkippedNodeModulesReason: /* @__PURE__ */ __name(() => getSkippedNodeModulesReason, "getSkippedNodeModulesReason"),
      getUnsafeDirectoryReason: /* @__PURE__ */ __name(() => getUnsafeDirectoryReason, "getUnsafeDirectoryReason"),
      getUnsafePackageBinReason: /* @__PURE__ */ __name(() => getUnsafePackageBinReason, "getUnsafePackageBinReason"),
      getUnsafePackageDirectoryReason: /* @__PURE__ */ __name(() => getUnsafePackageDirectoryReason, "getUnsafePackageDirectoryReason"),
      getUnsafePackageFileReason: /* @__PURE__ */ __name(() => getUnsafePackageFileReason, "getUnsafePackageFileReason"),
      getUnsafeStatsReason: /* @__PURE__ */ __name(() => getUnsafeStatsReason, "getUnsafeStatsReason")
    });
    module.exports = __toCommonJS(safety_exports);
    var import_promises = __require("node:fs/promises");
    var import_node_path = __toESM(__require("node:path"));
    var import_errutils = require_errutils();
    var import_fsutils = require_fsutils();
    async function getSkippedNodeModulesReason(nodeModulesDirectory, parentDirectories) {
      const parentDirectory = import_node_path.default.dirname(nodeModulesDirectory);
      parentDirectories ??= [parentDirectory];
      for (const directory of parentDirectories) {
        let unsafeParentReason;
        try {
          unsafeParentReason = await getUnsafeDirectoryReason(directory);
        } catch (error) {
          unsafeParentReason = `could not inspect: ${(0, import_errutils.getErrorMessage)(error)}`;
        }
        if (unsafeParentReason) {
          return `${directory} is ${unsafeParentReason}`;
        }
      }
      const result = await (0, import_fsutils.statIfExists)(nodeModulesDirectory);
      if ("missing" in result) {
        return null;
      }
      if ("reason" in result) {
        return result.reason;
      }
      if (!result.stats.isDirectory()) {
        return "not a directory";
      }
      const unsafeNodeModulesReason = getUnsafeStatsReason(result.stats);
      if (unsafeNodeModulesReason) {
        return unsafeNodeModulesReason;
      }
      return await getSkippedLocalBinDirectoryReason(
        import_node_path.default.join(nodeModulesDirectory, ".bin")
      );
    }
    __name(getSkippedNodeModulesReason, "getSkippedNodeModulesReason");
    async function getSkippedLocalBinDirectoryReason(localBinDirectory) {
      const result = await (0, import_fsutils.statIfExists)(localBinDirectory);
      if ("missing" in result) {
        return null;
      }
      if ("reason" in result) {
        return `${localBinDirectory} ${result.reason}`;
      }
      if (!result.stats.isDirectory()) {
        return `${localBinDirectory} is not a directory`;
      }
      const unsafeLocalBinReason = getUnsafeStatsReason(result.stats);
      return unsafeLocalBinReason ? `${localBinDirectory} is ${unsafeLocalBinReason}` : null;
    }
    __name(getSkippedLocalBinDirectoryReason, "getSkippedLocalBinDirectoryReason");
    async function getUnsafePackageBinReason(nodeModulesDirectory, packageDirectory, binPath) {
      const unsafePackageDirectoryReason = await getUnsafePackageDirectoryReason(
        nodeModulesDirectory,
        packageDirectory
      );
      if (unsafePackageDirectoryReason) {
        return unsafePackageDirectoryReason;
      }
      return await getUnsafePackageFileReason(packageDirectory, binPath);
    }
    __name(getUnsafePackageBinReason, "getUnsafePackageBinReason");
    async function getUnsafePackageDirectoryReason(nodeModulesDirectory, packageDirectory) {
      const directoriesToCheck = (0, import_fsutils.getDirectoriesBetween)(
        nodeModulesDirectory,
        packageDirectory
      );
      if (directoriesToCheck.length === 0) {
        return `${packageDirectory} resolves outside local node_modules`;
      }
      for (const directory of directoriesToCheck) {
        const reason = await getUnsafeDirectoryReason(directory);
        if (reason) {
          return `${directory} is ${reason}`;
        }
      }
      return null;
    }
    __name(getUnsafePackageDirectoryReason, "getUnsafePackageDirectoryReason");
    async function getUnsafePackageFileReason(packageDirectory, filePath) {
      const directoriesToCheck = (0, import_fsutils.getDirectoriesBetween)(
        packageDirectory,
        import_node_path.default.dirname(filePath)
      );
      if (directoriesToCheck.length === 0) {
        return `${filePath} resolves outside package`;
      }
      for (const directory of directoriesToCheck) {
        const reason2 = await getUnsafeDirectoryReason(directory);
        if (reason2) {
          return `${directory} is ${reason2}`;
        }
      }
      const reason = await getUnsafeFileReason(filePath);
      return reason ? `${filePath} is ${reason}` : null;
    }
    __name(getUnsafePackageFileReason, "getUnsafePackageFileReason");
    async function getUnsafeDirectoryReason(directory) {
      const stats = await (0, import_promises.stat)(directory);
      if (!stats.isDirectory()) {
        return "not a directory";
      }
      return getUnsafeStatsReason(stats);
    }
    __name(getUnsafeDirectoryReason, "getUnsafeDirectoryReason");
    async function getUnsafeFileReason(filePath) {
      const stats = await (0, import_promises.stat)(filePath);
      if (!stats.isFile()) {
        return "not a file";
      }
      return getUnsafeStatsReason(stats);
    }
    __name(getUnsafeFileReason, "getUnsafeFileReason");
    function getUnsafeStatsReason(stats) {
      const getuid = process.geteuid ?? process.getuid;
      if (typeof getuid !== "function") {
        return null;
      }
      const uid = getuid();
      if ((stats.mode & 18) !== 0) {
        if ((stats.mode & 2) !== 0) {
          return "world-writable";
        }
        return "group-writable";
      }
      if (stats.uid !== uid) {
        return `owned by uid ${stats.uid}, current uid is ${uid}`;
      }
      return null;
    }
    __name(getUnsafeStatsReason, "getUnsafeStatsReason");
  }
});

// node_modules/@vercel/cli-exec/dist/lookup.js
var require_lookup = __commonJS({
  "node_modules/@vercel/cli-exec/dist/lookup.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var lookup_exports = {};
    __export(lookup_exports, {
      clearCachedCliInvocation: /* @__PURE__ */ __name(() => clearCachedCliInvocation, "clearCachedCliInvocation"),
      clearVercelCliLookupCache: /* @__PURE__ */ __name(() => clearVercelCliLookupCache2, "clearVercelCliLookupCache"),
      findVercelCli: /* @__PURE__ */ __name(() => findVercelCli2, "findVercelCli"),
      getLocalBinSearch: /* @__PURE__ */ __name(() => getLocalBinSearch, "getLocalBinSearch"),
      resolveCachedCliInvocation: /* @__PURE__ */ __name(() => resolveCachedCliInvocation, "resolveCachedCliInvocation"),
      toVercelCliInvocation: /* @__PURE__ */ __name(() => toVercelCliInvocation, "toVercelCliInvocation")
    });
    module.exports = __toCommonJS(lookup_exports);
    var import_promises = __require("node:fs/promises");
    var import_node_path = __toESM(__require("node:path"));
    var import_envpath = require_envpath();
    var import_errutils = require_errutils();
    var import_fsutils = require_fsutils();
    var import_safety = require_safety();
    var cliInvocationCache = /* @__PURE__ */ new Map();
    async function findVercelCli2(options = {}) {
      const cwd = import_node_path.default.resolve(options.cwd ?? process.cwd());
      const pathValue = options.path ?? (0, import_envpath.getEnvPath)(process.env);
      const resolution = await resolveCachedCliInvocation(cwd, pathValue);
      return resolution.found ? toVercelCliInvocation(resolution) : null;
    }
    __name(findVercelCli2, "findVercelCli");
    function resolveCachedCliInvocation(cwd, pathValue) {
      const cacheKey = getCliInvocationCacheKey(cwd, pathValue);
      if (cliInvocationCache.has(cacheKey)) {
        return cliInvocationCache.get(cacheKey);
      }
      const resolution = resolveCliInvocation(cwd, pathValue).catch((error) => {
        cliInvocationCache.delete(cacheKey);
        throw error;
      });
      cliInvocationCache.set(cacheKey, resolution);
      return resolution;
    }
    __name(resolveCachedCliInvocation, "resolveCachedCliInvocation");
    function toVercelCliInvocation(resolution) {
      return {
        command: resolution.command,
        commandArgs: resolution.commandArgs,
        source: resolution.source
      };
    }
    __name(toVercelCliInvocation, "toVercelCliInvocation");
    function clearVercelCliLookupCache2() {
      cliInvocationCache.clear();
    }
    __name(clearVercelCliLookupCache2, "clearVercelCliLookupCache");
    function clearCachedCliInvocation(cwd, pathValue) {
      cliInvocationCache.delete(getCliInvocationCacheKey(cwd, pathValue));
    }
    __name(clearCachedCliInvocation, "clearCachedCliInvocation");
    async function resolveCliInvocation(cwd, pathValue) {
      const localBinSearch = await getLocalBinSearch(cwd);
      const diagnostics = {
        localBinSearch: localBinSearch.diagnostics,
        skippedLocalBins: []
      };
      const resolvedPath = (0, import_envpath.prependPathEntries)(
        pathValue,
        localBinSearch.directories
      );
      for (const command of getVercelCommandNames()) {
        const resolvedCommand = await findCommandInPath(
          command,
          resolvedPath,
          cwd,
          localBinSearch,
          diagnostics
        );
        if (!resolvedCommand) {
          continue;
        }
        if ((0, import_fsutils.isNodeScript)(resolvedCommand.realPath)) {
          return {
            found: true,
            command: process.execPath,
            commandArgs: [resolvedCommand.realPath],
            source: resolvedCommand.source,
            diagnostics
          };
        }
        return {
          found: true,
          command: resolvedCommand.realPath,
          commandArgs: [],
          source: resolvedCommand.source,
          diagnostics
        };
      }
      return { found: false, diagnostics };
    }
    __name(resolveCliInvocation, "resolveCliInvocation");
    async function findCommandInPath(command, pathValue, cwd, localBinSearch, diagnostics) {
      for (const directory of (0, import_envpath.splitPath)(pathValue)) {
        const candidate = getPathCommandCandidate(directory, command, cwd);
        try {
          const canAccess = await canAccessCommandCandidate(
            candidate,
            localBinSearch,
            diagnostics
          );
          if (canAccess) {
            const resolvedCommand = await resolveCommandCandidate(
              command,
              candidate,
              localBinSearch,
              diagnostics
            );
            if (resolvedCommand) {
              return resolvedCommand;
            }
          }
        } catch {
        }
      }
      return null;
    }
    __name(findCommandInPath, "findCommandInPath");
    function getPathCommandCandidate(directory, command, cwd) {
      const candidateDirectory = import_node_path.default.isAbsolute(directory) ? directory : import_node_path.default.resolve(cwd, directory);
      return import_node_path.default.join(candidateDirectory, command);
    }
    __name(getPathCommandCandidate, "getPathCommandCandidate");
    async function canAccessCommandCandidate(candidate, localBinSearch, diagnostics) {
      try {
        await (0, import_promises.access)(
          candidate,
          process.platform === "win32" ? import_promises.constants.F_OK : import_promises.constants.F_OK | import_promises.constants.X_OK
        );
        return true;
      } catch (error) {
        if (!(0, import_errutils.isMissingPathError)(error)) {
          await recordInaccessibleLocalBinCandidate(
            candidate,
            error,
            localBinSearch,
            diagnostics
          );
        }
        return false;
      }
    }
    __name(canAccessCommandCandidate, "canAccessCommandCandidate");
    async function recordInaccessibleLocalBinCandidate(candidate, error, localBinSearch, diagnostics) {
      const localBinCandidate = await classifyPathLocalBinCandidate(
        candidate,
        localBinSearch.directories
      );
      if (!localBinCandidate) {
        return;
      }
      recordSkippedLocalBin(
        diagnostics,
        candidate,
        "reason" in localBinCandidate ? localBinCandidate.reason : `local bin is not accessible: ${(0, import_errutils.getErrorMessage)(error)}`
      );
    }
    __name(recordInaccessibleLocalBinCandidate, "recordInaccessibleLocalBinCandidate");
    async function resolveCommandCandidate(command, candidate, localBinSearch, diagnostics) {
      if (!(await (0, import_promises.stat)(candidate)).isFile()) {
        return null;
      }
      const realPath = await (0, import_promises.realpath)(candidate);
      const localBinCandidate = await classifyPathLocalBinCandidate(
        candidate,
        localBinSearch.directories
      );
      if (!localBinCandidate) {
        return { realPath, source: "path" };
      }
      if ("reason" in localBinCandidate) {
        recordSkippedLocalBin(diagnostics, candidate, localBinCandidate.reason);
        return null;
      }
      const localPackageBinResult = await getLocalVercelPackageBin(
        command,
        localBinCandidate.directory
      );
      if ("reason" in localPackageBinResult) {
        recordSkippedLocalBin(diagnostics, candidate, localPackageBinResult.reason);
        return null;
      }
      return { realPath: localPackageBinResult.binPath, source: "local-bin" };
    }
    __name(resolveCommandCandidate, "resolveCommandCandidate");
    function recordSkippedLocalBin(diagnostics, candidate, reason) {
      diagnostics.skippedLocalBins.push({ candidate, reason });
    }
    __name(recordSkippedLocalBin, "recordSkippedLocalBin");
    function getVercelCommandNames() {
      const commandBases = ["vercel"];
      if (process.platform !== "win32") {
        return commandBases;
      }
      const extensions = [".cmd", ".exe", ""];
      return commandBases.flatMap(
        (command) => extensions.map((extension) => `${command}${extension}`)
      );
    }
    __name(getVercelCommandNames, "getVercelCommandNames");
    async function getLocalBinSearch(cwd) {
      const searchRoot = await (0, import_fsutils.getCanonicalPath)(import_node_path.default.resolve(cwd));
      const ancestorSearch = await getAncestorDirectorySearch(searchRoot);
      const skippedNodeModules = [];
      const directories = [];
      for (const directory of ancestorSearch.directories) {
        const nodeModulesDirectory = import_node_path.default.join(directory, "node_modules");
        const parentDirectories = ancestorSearch.stopReason === "project-root-marker" ? (0, import_fsutils.getDirectoriesBetween)(ancestorSearch.stoppedAt, directory) : (0, import_fsutils.getDirectoriesBetween)(directory, searchRoot);
        const skippedReason = await (0, import_safety.getSkippedNodeModulesReason)(
          nodeModulesDirectory,
          parentDirectories
        );
        if (skippedReason) {
          skippedNodeModules.push({
            directory: nodeModulesDirectory,
            reason: skippedReason
          });
          continue;
        }
        directories.push(import_node_path.default.join(nodeModulesDirectory, ".bin"));
      }
      return {
        directories,
        diagnostics: {
          searchRoot,
          stoppedAt: ancestorSearch.stoppedAt,
          stopReason: ancestorSearch.stopReason,
          markerPath: ancestorSearch.markerPath,
          skippedNodeModules
        }
      };
    }
    __name(getLocalBinSearch, "getLocalBinSearch");
    async function getAncestorDirectorySearch(cwd) {
      const directories = [];
      let current = import_node_path.default.resolve(cwd);
      while (true) {
        directories.push(current);
        const marker = await getProjectRootMarker(current);
        if (marker) {
          return {
            directories,
            stoppedAt: current,
            stopReason: "project-root-marker",
            markerPath: marker.path
          };
        }
        const parent = import_node_path.default.dirname(current);
        if (parent === current) {
          return {
            directories,
            stoppedAt: current,
            stopReason: "filesystem-root"
          };
        }
        current = parent;
      }
    }
    __name(getAncestorDirectorySearch, "getAncestorDirectorySearch");
    async function getProjectRootMarker(directory) {
      const gitPath = import_node_path.default.join(directory, ".git");
      try {
        await (0, import_promises.stat)(gitPath);
        return { path: gitPath };
      } catch {
      }
      return null;
    }
    __name(getProjectRootMarker, "getProjectRootMarker");
    async function getLocalBinDirectory(filePath, localBinDirectories) {
      const resolvedFilePath = import_node_path.default.resolve(filePath);
      let canonicalFilePath = resolvedFilePath;
      try {
        canonicalFilePath = import_node_path.default.join(
          await (0, import_promises.realpath)(import_node_path.default.dirname(resolvedFilePath)),
          import_node_path.default.basename(resolvedFilePath)
        );
      } catch {
      }
      for (let localBinDirectory of localBinDirectories) {
        try {
          localBinDirectory = await (0, import_promises.realpath)(localBinDirectory);
        } catch {
        }
        if (canonicalFilePath.startsWith(`${localBinDirectory}${import_node_path.default.sep}`)) {
          return localBinDirectory;
        }
      }
      return null;
    }
    __name(getLocalBinDirectory, "getLocalBinDirectory");
    async function getNodeModulesBinDirectory(filePath) {
      const candidateDirectory = import_node_path.default.resolve(import_node_path.default.dirname(filePath));
      const directories = [candidateDirectory];
      try {
        const canonicalDirectory = await (0, import_promises.realpath)(candidateDirectory);
        if (!directories.includes(canonicalDirectory)) {
          directories.push(canonicalDirectory);
        }
      } catch {
      }
      for (const directory of directories) {
        if (import_node_path.default.basename(directory) === ".bin" && import_node_path.default.basename(import_node_path.default.dirname(directory)) === "node_modules") {
          return directory;
        }
      }
      return null;
    }
    __name(getNodeModulesBinDirectory, "getNodeModulesBinDirectory");
    async function classifyPathLocalBinCandidate(filePath, localBinDirectories) {
      const localBinDirectory = await getLocalBinDirectory(
        filePath,
        localBinDirectories
      );
      if (localBinDirectory) {
        return { directory: localBinDirectory };
      }
      const nodeModulesBinDirectory = await getNodeModulesBinDirectory(filePath);
      if (!nodeModulesBinDirectory) {
        return null;
      }
      const nodeModulesDirectory = import_node_path.default.dirname(nodeModulesBinDirectory);
      const skippedReason = await (0, import_safety.getSkippedNodeModulesReason)(nodeModulesDirectory);
      if (skippedReason) {
        return { reason: `local node_modules is ${skippedReason}` };
      }
      return { reason: "local bin is outside project lookup boundary" };
    }
    __name(classifyPathLocalBinCandidate, "classifyPathLocalBinCandidate");
    async function getLocalVercelPackageBin(command, localBinDirectory) {
      const commandBase = (0, import_fsutils.getCommandBase)(command);
      const nodeModulesDirectory = import_node_path.default.dirname(localBinDirectory);
      if (commandBase !== "vercel" || import_node_path.default.basename(nodeModulesDirectory) !== "node_modules") {
        return { reason: "not a local vercel bin" };
      }
      try {
        const localPackage = await getLocalVercelPackage(nodeModulesDirectory);
        if ("reason" in localPackage) {
          return localPackage;
        }
        const packageJsonResult = await readLocalVercelPackageJson(
          localPackage.realPackageDirectory
        );
        if ("reason" in packageJsonResult) {
          return packageJsonResult;
        }
        localPackage.packageJson = packageJsonResult.packageJson;
        return await getDeclaredLocalVercelPackageBin(localPackage, commandBase);
      } catch (error) {
        return {
          reason: `could not validate local vercel package: ${(0, import_errutils.getErrorMessage)(error)}`
        };
      }
    }
    __name(getLocalVercelPackageBin, "getLocalVercelPackageBin");
    async function getLocalVercelPackage(nodeModulesDirectory) {
      const packageDirectory = import_node_path.default.join(nodeModulesDirectory, "vercel");
      const realNodeModulesDirectory = await (0, import_promises.realpath)(nodeModulesDirectory);
      const realPackageDirectory = await (0, import_promises.realpath)(packageDirectory);
      if (!(0, import_fsutils.isSubpath)(realNodeModulesDirectory, realPackageDirectory)) {
        return {
          reason: "local vercel package resolves outside local node_modules"
        };
      }
      const unsafePackageDirectoryReason = await (0, import_safety.getUnsafePackageDirectoryReason)(
        realNodeModulesDirectory,
        realPackageDirectory
      );
      if (unsafePackageDirectoryReason) {
        return {
          reason: `local vercel package is unsafe: ${unsafePackageDirectoryReason}`
        };
      }
      return {
        realNodeModulesDirectory,
        realPackageDirectory,
        packageJson: {}
      };
    }
    __name(getLocalVercelPackage, "getLocalVercelPackage");
    async function readLocalVercelPackageJson(realPackageDirectory) {
      const packageJsonPath = import_node_path.default.join(realPackageDirectory, "package.json");
      const realPackageJsonPath = await (0, import_promises.realpath)(packageJsonPath);
      if (!(0, import_fsutils.isSubpath)(realPackageDirectory, realPackageJsonPath)) {
        return { reason: "local vercel package.json resolves outside package" };
      }
      const unsafePackageJsonReason = await (0, import_safety.getUnsafePackageFileReason)(
        realPackageDirectory,
        realPackageJsonPath
      );
      if (unsafePackageJsonReason) {
        return {
          reason: `local vercel package.json is unsafe: ${unsafePackageJsonReason}`
        };
      }
      const packageJson = JSON.parse(
        await (0, import_promises.readFile)(realPackageJsonPath, "utf8")
      );
      if (packageJson.name !== "vercel") {
        return {
          reason: 'local vercel package.json does not have name "vercel"'
        };
      }
      return { packageJson };
    }
    __name(readLocalVercelPackageJson, "readLocalVercelPackageJson");
    async function getDeclaredLocalVercelPackageBin(localPackage, commandBase) {
      const { packageJson, realNodeModulesDirectory, realPackageDirectory } = localPackage;
      const binTarget = getPackageBinTarget(packageJson, commandBase);
      if (!binTarget) {
        return { reason: "local vercel package does not declare bin.vercel" };
      }
      const declaredBinPath = import_node_path.default.resolve(realPackageDirectory, binTarget);
      const realDeclaredBinPath = await (0, import_promises.realpath)(declaredBinPath);
      if (!(0, import_fsutils.isSubpath)(realPackageDirectory, realDeclaredBinPath)) {
        return { reason: "local vercel package bin resolves outside package" };
      }
      const unsafePackageBinReason = await (0, import_safety.getUnsafePackageBinReason)(
        realNodeModulesDirectory,
        realPackageDirectory,
        realDeclaredBinPath
      );
      if (unsafePackageBinReason) {
        return {
          reason: `local vercel package bin is unsafe: ${unsafePackageBinReason}`
        };
      }
      if (process.platform !== "win32" && !(0, import_fsutils.isNodeScript)(realDeclaredBinPath)) {
        try {
          await (0, import_promises.access)(realDeclaredBinPath, import_promises.constants.F_OK | import_promises.constants.X_OK);
        } catch (error) {
          return {
            reason: `local vercel package bin is not executable: ${(0, import_errutils.getErrorMessage)(error)}`
          };
        }
      }
      return { binPath: realDeclaredBinPath };
    }
    __name(getDeclaredLocalVercelPackageBin, "getDeclaredLocalVercelPackageBin");
    function getPackageBinTarget(packageJson, command) {
      const bin = packageJson.bin;
      if (typeof bin === "string") {
        return command === "vercel" ? bin : null;
      }
      if (bin && typeof bin === "object") {
        const target = bin[command];
        if (typeof target === "string") {
          return target;
        }
      }
      return null;
    }
    __name(getPackageBinTarget, "getPackageBinTarget");
    function getCliInvocationCacheKey(cwd, pathValue) {
      return `${cwd}\0${pathValue}`;
    }
    __name(getCliInvocationCacheKey, "getCliInvocationCacheKey");
  }
});

// node_modules/@vercel/cli-exec/dist/exec.js
var require_exec = __commonJS({
  "node_modules/@vercel/cli-exec/dist/exec.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var exec_exports = {};
    __export(exec_exports, {
      execVercelCli: /* @__PURE__ */ __name(() => execVercelCli2, "execVercelCli")
    });
    module.exports = __toCommonJS(exec_exports);
    var import_node_path = __toESM(__require("node:path"));
    var import_execa = __toESM(require_execa());
    var import_envpath = require_envpath();
    var import_errors = require_errors();
    var import_lookup = require_lookup();
    async function execVercelCli2(args, options = {}) {
      const cwd = import_node_path.default.resolve(options.cwd ?? process.cwd());
      await (0, import_errors.assertValidCwd)(cwd);
      const env = mergeExecEnv(options.env);
      const pathValue = (0, import_envpath.getEnvPath)(env);
      try {
        return await execResolvedVercelCli(args, options, cwd, env, pathValue);
      } catch (error) {
        if (error instanceof import_errors.VercelCliError && error.code === "VERCEL_CLI_NOT_FOUND") {
          (0, import_lookup.clearCachedCliInvocation)(cwd, pathValue);
          return await execResolvedVercelCli(args, options, cwd, env, pathValue);
        }
        throw error;
      }
    }
    __name(execVercelCli2, "execVercelCli");
    async function execResolvedVercelCli(args, options, cwd, env, pathValue) {
      const invocation = await resolveInvocationOrThrow(cwd, pathValue);
      try {
        const execaOptions = {
          input: options.input,
          stdio: options.stdio,
          stdin: options.stdin,
          stdout: options.stdout,
          stderr: options.stderr,
          timeout: options.timeout,
          cwd,
          env: await prependLocalBinsToEnvPath(cwd, env),
          windowsHide: true
        };
        if (options.signal) {
          execaOptions.signal = options.signal;
        }
        const { stdout, stderr } = await (0, import_execa.default)(
          invocation.command,
          [...invocation.commandArgs, ...args],
          execaOptions
        );
        return { stdout, stderr, invocation };
      } catch (error) {
        throw (0, import_errors.toVercelCliError)(invocation, error);
      }
    }
    __name(execResolvedVercelCli, "execResolvedVercelCli");
    async function resolveInvocationOrThrow(cwd, pathValue) {
      const resolution = await (0, import_lookup.resolveCachedCliInvocation)(cwd, pathValue);
      if (!resolution.found) {
        throw new import_errors.VercelCliError({
          code: "VERCEL_CLI_NOT_FOUND",
          message: (0, import_errors.getCliNotFoundMessage)(resolution.diagnostics)
        });
      }
      return (0, import_lookup.toVercelCliInvocation)(resolution);
    }
    __name(resolveInvocationOrThrow, "resolveInvocationOrThrow");
    function mergeExecEnv(env) {
      if (!env) {
        return process.env;
      }
      return { ...process.env, ...env };
    }
    __name(mergeExecEnv, "mergeExecEnv");
    async function prependLocalBinsToEnvPath(cwd, env = process.env) {
      const localPath = await prependLocalBinsToPath(cwd, (0, import_envpath.getEnvPath)(env));
      return (0, import_envpath.setEnvPath)(
        env,
        (0, import_envpath.prependPathEntries)(localPath, [import_node_path.default.dirname(process.execPath)])
      );
    }
    __name(prependLocalBinsToEnvPath, "prependLocalBinsToEnvPath");
    async function prependLocalBinsToPath(cwd, pathValue = "") {
      return (0, import_envpath.prependPathEntries)(
        pathValue,
        (await (0, import_lookup.getLocalBinSearch)(cwd)).directories
      );
    }
    __name(prependLocalBinsToPath, "prependLocalBinsToPath");
  }
});

// node_modules/@vercel/cli-exec/dist/index.js
var require_dist = __commonJS({
  "node_modules/@vercel/cli-exec/dist/index.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var src_exports = {};
    __export(src_exports, {
      VercelCliError: /* @__PURE__ */ __name(() => import_errors.VercelCliError, "VercelCliError"),
      clearVercelCliLookupCache: /* @__PURE__ */ __name(() => import_lookup.clearVercelCliLookupCache, "clearVercelCliLookupCache"),
      execVercelCli: /* @__PURE__ */ __name(() => import_exec.execVercelCli, "execVercelCli"),
      findVercelCli: /* @__PURE__ */ __name(() => import_lookup.findVercelCli, "findVercelCli")
    });
    module.exports = __toCommonJS(src_exports);
    var import_errors = require_errors();
    var import_exec = require_exec();
    var import_lookup = require_lookup();
  }
});

// node_modules/@vercel/cli-config/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@vercel/cli-config/dist/index.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __commonJS2 = /* @__PURE__ */ __name((cb, mod) => function() {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    }, "__commonJS");
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from == "object" || typeof from == "function") for (let key of __getOwnPropNames(from)) !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod)), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var require_lib = __commonJS2({ "../../node_modules/.pnpm/os-paths@4.4.0/node_modules/os-paths/src/lib/index.js"(exports2, module2) {
      "use strict";
      var os = __require("os"), paths = __require("path"), isWinOS = /^win/i.test(process.platform);
      function normalize_path(path3) {
        return paths.normalize(paths.join(path3, "."));
      }
      __name(normalize_path, "normalize_path");
      var base = /* @__PURE__ */ __name(() => {
        let { env } = process, object2 = {};
        return object2.home = () => normalize_path(os.homedir ? os.homedir() : env.HOME), object2.temp = () => normalize_path(os.tmpdir ? os.tmpdir() : env.TMPDIR || env.TEMP || env.TMP), object2;
      }, "base"), windows = /* @__PURE__ */ __name(() => {
        let { env } = process, object2 = {};
        return object2.home = () => normalize_path(os.homedir ? os.homedir() : env.USERPROFILE || paths.join(env.HOMEDRIVE, env.HOMEPATH) || env.HOME), object2.temp = () => normalize_path(os.tmpdir ? os.tmpdir() : env.TEMP || env.TMP || paths.join(env.LOCALAPPDATA || env.SystemRoot || env.windir, "Temp")), object2;
      }, "windows"), _OSPaths = class __OSPaths {
        static {
          __name(this, "__OSPaths");
        }
        constructor() {
          let OSPaths = /* @__PURE__ */ __name(function() {
            return new __OSPaths();
          }, "OSPaths");
          this._fn = OSPaths;
          let extension = isWinOS ? windows() : base();
          return Object.keys(extension).forEach((key) => {
            this._fn[key] = extension[key];
          }), this._fn;
        }
      };
      module2.exports = new _OSPaths();
    } });
    var require_lib2 = __commonJS2({ "../../node_modules/.pnpm/xdg-portable@7.3.0/node_modules/xdg-portable/src/lib/index.js"(exports2, module2) {
      "use strict";
      var path3 = __require("path"), osPaths = require_lib(), linux = /* @__PURE__ */ __name(() => {
        let object2 = {};
        return object2.cache = () => process.env.XDG_CACHE_HOME || path3.join(osPaths.home() || osPaths.temp(), ".cache"), object2.config = () => process.env.XDG_CONFIG_HOME || path3.join(osPaths.home() || osPaths.temp(), ".config"), object2.data = () => process.env.XDG_DATA_HOME || path3.join(osPaths.home() || osPaths.temp(), ".local", "share"), object2.runtime = () => process.env.XDG_RUNTIME_DIR || void 0, object2.state = () => process.env.XDG_STATE_HOME || path3.join(osPaths.home() || osPaths.temp(), ".local", "state"), object2;
      }, "linux"), macos = /* @__PURE__ */ __name(() => {
        let object2 = {};
        return object2.cache = () => process.env.XDG_CACHE_HOME || path3.join(path3.join(osPaths.home() || osPaths.temp(), "Library"), "Caches"), object2.config = () => process.env.XDG_CONFIG_HOME || path3.join(path3.join(osPaths.home() || osPaths.temp(), "Library"), "Preferences"), object2.data = () => process.env.XDG_DATA_HOME || path3.join(path3.join(osPaths.home() || osPaths.temp(), "Library"), "Application Support"), object2.runtime = () => process.env.XDG_RUNTIME_DIR || void 0, object2.state = () => process.env.XDG_STATE_HOME || path3.join(path3.join(osPaths.home() || osPaths.temp(), "Library"), "State"), object2;
      }, "macos"), windows = /* @__PURE__ */ __name(() => {
        let object2 = {};
        return object2.cache = () => {
          let localAppData = process.env.LOCALAPPDATA || path3.join(osPaths.home() || osPaths.temp(), "AppData", "Local");
          return process.env.XDG_CACHE_HOME || path3.join(localAppData, "xdg.cache");
        }, object2.config = () => {
          let appData = process.env.APPDATA || path3.join(osPaths.home() || osPaths.temp(), "AppData", "Roaming");
          return process.env.XDG_CONFIG_HOME || path3.join(appData, "xdg.config");
        }, object2.data = () => {
          let appData = process.env.APPDATA || path3.join(osPaths.home() || osPaths.temp(), "AppData", "Roaming");
          return process.env.XDG_DATA_HOME || path3.join(appData, "xdg.data");
        }, object2.runtime = () => process.env.XDG_RUNTIME_DIR || void 0, object2.state = () => {
          let localAppData = process.env.LOCALAPPDATA || path3.join(osPaths.home() || osPaths.temp(), "AppData", "Local");
          return process.env.XDG_STATE_HOME || path3.join(localAppData, "xdg.state");
        }, object2;
      }, "windows"), _XDGPortable = /* @__PURE__ */ __name(() => {
        let XDGPortable = /* @__PURE__ */ __name(function() {
          return _XDGPortable();
        }, "XDGPortable"), extension = {};
        return /^darwin$/i.test(process.platform) ? extension = macos() : /^win/i.test(process.platform) ? extension = windows() : extension = linux(), extension.configDirs = () => {
          let dirs = [];
          return dirs.push(extension.config()), process.env.XDG_CONFIG_DIRS && dirs.push(...process.env.XDG_CONFIG_DIRS.split(path3.delimiter)), dirs;
        }, extension.dataDirs = () => {
          let dirs = [];
          return dirs.push(extension.data()), process.env.XDG_DATA_DIRS && dirs.push(...process.env.XDG_DATA_DIRS.split(path3.delimiter)), dirs;
        }, Object.keys(extension).forEach((key) => {
          XDGPortable[key] = extension[key];
        }), XDGPortable;
      }, "_XDGPortable");
      module2.exports = _XDGPortable();
    } });
    var require_xdg_app_paths = __commonJS2({ "../../node_modules/.pnpm/xdg-app-paths@5.1.0/node_modules/xdg-app-paths/index.js"(exports2, module2) {
      "use strict";
      var path3 = __require("path"), os = __require("os"), xdg = require_lib2(), isWinOS = /^win/i.test(process.platform);
      function _normalizeOptions(options, isolated) {
        if (options = options || {}, typeof options != "object" && (options = { isolated: options }), options.isolated = options.isolated === void 0 || options.isolated === null ? isolated : options.isolated, typeof options.isolated != "boolean") throw new TypeError(`Expected boolean for "isolated" argument, got ${typeof options.isolated}`);
        return options;
      }
      __name(_normalizeOptions, "_normalizeOptions");
      var base = /* @__PURE__ */ __name((name, isolated) => {
        let object2 = {};
        return object2.cache = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), path3.join(xdg.cache(), options.isolated ? name : "")), object2.config = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), path3.join(xdg.config(), options.isolated ? name : "")), object2.data = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), path3.join(xdg.data(), options.isolated ? name : "")), object2.runtime = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), xdg.runtime() ? path3.join(xdg.runtime(), options.isolated ? name : "") : void 0), object2.state = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), path3.join(xdg.state(), options.isolated ? name : "")), object2.configDirs = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), xdg.configDirs().map((s) => path3.join(s, options.isolated ? name : ""))), object2.dataDirs = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), xdg.dataDirs().map((s) => path3.join(s, options.isolated ? name : ""))), object2;
      }, "base"), windows = /* @__PURE__ */ __name((name, isolated) => {
        let { env } = process, homedir2 = os.homedir(), tmpdir = os.tmpdir(), appData = env.APPDATA || path3.join(homedir2 || tmpdir, "AppData", "Roaming"), localAppData = env.LOCALAPPDATA || path3.join(homedir2 || tmpdir, "AppData", "Local"), object2 = {};
        return object2.cache = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), !options.isolated || env.XDG_CACHE_HOME ? path3.join(xdg.cache(), options.isolated ? name : "") : path3.join(localAppData, options.isolated ? name : "", "Cache")), object2.config = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), !options.isolated || env.XDG_CONFIG_HOME ? path3.join(xdg.config(), options.isolated ? name : "") : path3.join(appData, options.isolated ? name : "", "Config")), object2.data = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), !options.isolated || env.XDG_DATA_HOME ? path3.join(xdg.data(), options.isolated ? name : "") : path3.join(appData, options.isolated ? name : "", "Data")), object2.runtime = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), xdg.runtime() ? path3.join(xdg.runtime(), options.isolated ? name : "") : void 0), object2.state = (options = { isolated: null }) => (options = _normalizeOptions(options, isolated), !options.isolated || env.XDG_STATE_HOME ? path3.join(xdg.state(), options.isolated ? name : "") : path3.join(localAppData, options.isolated ? name : "", "State")), object2.configDirs = (options = { isolated: null }) => {
          options = _normalizeOptions(options, isolated);
          let dirs = [object2.config(options)];
          return env.XDG_CONFIG_DIRS && dirs.push(...env.XDG_CONFIG_DIRS.split(path3.delimiter).map((s) => path3.join(s, options.isolated ? name : ""))), dirs;
        }, object2.dataDirs = (options = { isolated: null }) => {
          options = _normalizeOptions(options, isolated);
          let dirs = [object2.data(options)];
          return env.XDG_DATA_DIRS && dirs.push(...env.XDG_DATA_DIRS.split(path3.delimiter).map((s) => path3.join(s, options.isolated ? name : ""))), dirs;
        }, object2;
      }, "windows"), _XDGAppPaths = class __XDGAppPaths {
        static {
          __name(this, "__XDGAppPaths");
        }
        constructor(options = { name: null, suffix: null, isolated: true }) {
          let XDGAppPaths = /* @__PURE__ */ __name(function(options2 = { name: null, suffix: null, isolated: true }) {
            return new __XDGAppPaths(options2);
          }, "XDGAppPaths");
          this._fn = XDGAppPaths, options = options || {}, typeof options != "object" && (options = { name: options });
          let name = options.name || "";
          if (typeof name != "string") throw new TypeError(`Expected string for "name" argument, got ${typeof name}`);
          let suffix = options.suffix || "";
          if (typeof suffix != "string") throw new TypeError(`Expected string for "suffix" argument, got ${typeof suffix}`);
          let isolated = options.isolated === void 0 || options.isolated === null ? true : options.isolated;
          if (typeof isolated != "boolean") throw new TypeError(`Expected boolean for "isolated" argument, got ${typeof isolated}`);
          name || (name = path3.parse(process.pkg ? process.execPath : __require.main ? __require.main.filename : process.argv[0]).name), suffix && (name += suffix), this._fn.$name = () => name, this._fn.$isolated = () => isolated;
          let extension = isWinOS ? windows(name, isolated) : base(name, isolated);
          return Object.keys(extension).forEach((key) => {
            this._fn[key] = extension[key];
          }), this._fn;
        }
      };
      module2.exports = new _XDGAppPaths();
    } });
    var src_exports = {};
    __export(src_exports, { CRED_STORAGE_CONFIG_VALUES: /* @__PURE__ */ __name(() => CRED_STORAGE_CONFIG_VALUES, "CRED_STORAGE_CONFIG_VALUES"), CRED_STORAGE_VALUES: /* @__PURE__ */ __name(() => CRED_STORAGE_VALUES, "CRED_STORAGE_VALUES"), DEFAULT_CRED_STORAGE: /* @__PURE__ */ __name(() => DEFAULT_CRED_STORAGE, "DEFAULT_CRED_STORAGE"), authConfigHasUsableTokenData: /* @__PURE__ */ __name(() => authConfigHasUsableTokenData, "authConfigHasUsableTokenData"), authConfigSchema: /* @__PURE__ */ __name(() => authConfigSchema2, "authConfigSchema"), credStorageSchema: /* @__PURE__ */ __name(() => credStorageSchema2, "credStorageSchema"), defaultAuthConfig: /* @__PURE__ */ __name(() => defaultAuthConfig, "defaultAuthConfig"), defaultGlobalConfig: /* @__PURE__ */ __name(() => defaultGlobalConfig, "defaultGlobalConfig"), deleteAuthConfig: /* @__PURE__ */ __name(() => deleteAuthConfig, "deleteAuthConfig"), deleteAuthConfigFile: /* @__PURE__ */ __name(() => deleteAuthConfigFile, "deleteAuthConfigFile"), getAuthConfigFilePath: /* @__PURE__ */ __name(() => getAuthConfigFilePath, "getAuthConfigFilePath"), getCachePath: /* @__PURE__ */ __name(() => getCachePath, "getCachePath"), getConfigFilePath: /* @__PURE__ */ __name(() => getConfigFilePath, "getConfigFilePath"), getDataPath: /* @__PURE__ */ __name(() => getDataPath, "getDataPath"), getDefaultAuthConfig: /* @__PURE__ */ __name(() => getDefaultAuthConfig, "getDefaultAuthConfig"), getGlobalPathConfig: /* @__PURE__ */ __name(() => getGlobalPathConfig, "getGlobalPathConfig"), getLikelyEffectiveCredStorage: /* @__PURE__ */ __name(() => getLikelyEffectiveCredStorage, "getLikelyEffectiveCredStorage"), globalConfigSchema: /* @__PURE__ */ __name(() => globalConfigSchema2, "globalConfigSchema"), guidanceConfigSchema: /* @__PURE__ */ __name(() => guidanceConfigSchema2, "guidanceConfigSchema"), parseAuthConfig: /* @__PURE__ */ __name(() => parseAuthConfig, "parseAuthConfig"), parseAuthFileConfig: /* @__PURE__ */ __name(() => parseAuthFileConfig, "parseAuthFileConfig"), parseGlobalConfig: /* @__PURE__ */ __name(() => parseGlobalConfig, "parseGlobalConfig"), readAuthConfig: /* @__PURE__ */ __name(() => readAuthConfig, "readAuthConfig"), readAuthConfigFile: /* @__PURE__ */ __name(() => readAuthConfigFile, "readAuthConfigFile"), readAuthFileConfig: /* @__PURE__ */ __name(() => readAuthFileConfig, "readAuthFileConfig"), readConfigFile: /* @__PURE__ */ __name(() => readConfigFile, "readConfigFile"), readGlobalConfigFile: /* @__PURE__ */ __name(() => readGlobalConfigFile, "readGlobalConfigFile"), telemetryConfigSchema: /* @__PURE__ */ __name(() => telemetryConfigSchema2, "telemetryConfigSchema"), tryReadAuthConfig: /* @__PURE__ */ __name(() => tryReadAuthConfig, "tryReadAuthConfig"), updatesConfigSchema: /* @__PURE__ */ __name(() => updatesConfigSchema2, "updatesConfigSchema"), writeAuthConfig: /* @__PURE__ */ __name(() => writeAuthConfig, "writeAuthConfig"), writeAuthConfigFile: /* @__PURE__ */ __name(() => writeAuthConfigFile, "writeAuthConfigFile"), writeConfigFile: /* @__PURE__ */ __name(() => writeConfigFile, "writeConfigFile"), writeGlobalConfigFile: /* @__PURE__ */ __name(() => writeGlobalConfigFile, "writeGlobalConfigFile") });
    module.exports = __toCommonJS(src_exports);
    var CRED_STORAGE_CONFIG_VALUES = ["auto", "file", "keyring"];
    var CRED_STORAGE_VALUES = CRED_STORAGE_CONFIG_VALUES.filter((storage) => storage !== "auto");
    var DEFAULT_CRED_STORAGE = "file";
    var NEVER = Object.freeze({ status: "aborted" });
    function $constructor(name, initializer3, params) {
      function init(inst, def) {
        var _a;
        Object.defineProperty(inst, "_zod", { value: inst._zod ?? {}, enumerable: false }), (_a = inst._zod).traits ?? (_a.traits = /* @__PURE__ */ new Set()), inst._zod.traits.add(name), initializer3(inst, def);
        for (let k in _.prototype) k in inst || Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
        inst._zod.constr = _, inst._zod.def = def;
      }
      __name(init, "init");
      let Parent = params?.Parent ?? Object;
      class Definition extends Parent {
        static {
          __name(this, "Definition");
        }
      }
      Object.defineProperty(Definition, "name", { value: name });
      function _(def) {
        var _a;
        let inst = params?.Parent ? new Definition() : this;
        init(inst, def), (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (let fn of inst._zod.deferred) fn();
        return inst;
      }
      __name(_, "_");
      return Object.defineProperty(_, "init", { value: init }), Object.defineProperty(_, Symbol.hasInstance, { value: /* @__PURE__ */ __name((inst) => params?.Parent && inst instanceof params.Parent ? true : inst?._zod?.traits?.has(name), "value") }), Object.defineProperty(_, "name", { value: name }), _;
    }
    __name($constructor, "$constructor");
    var $brand = Symbol("zod_brand");
    var $ZodAsyncError = class extends Error {
      static {
        __name(this, "$ZodAsyncError");
      }
      constructor() {
        super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
      }
    };
    var $ZodEncodeError = class extends Error {
      static {
        __name(this, "$ZodEncodeError");
      }
      constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`), this.name = "ZodEncodeError";
      }
    };
    var globalConfig = {};
    function config(newConfig) {
      return newConfig && Object.assign(globalConfig, newConfig), globalConfig;
    }
    __name(config, "config");
    var util_exports = {};
    __export(util_exports, { BIGINT_FORMAT_RANGES: /* @__PURE__ */ __name(() => BIGINT_FORMAT_RANGES, "BIGINT_FORMAT_RANGES"), Class: /* @__PURE__ */ __name(() => Class, "Class"), NUMBER_FORMAT_RANGES: /* @__PURE__ */ __name(() => NUMBER_FORMAT_RANGES, "NUMBER_FORMAT_RANGES"), aborted: /* @__PURE__ */ __name(() => aborted, "aborted"), allowsEval: /* @__PURE__ */ __name(() => allowsEval, "allowsEval"), assert: /* @__PURE__ */ __name(() => assert, "assert"), assertEqual: /* @__PURE__ */ __name(() => assertEqual, "assertEqual"), assertIs: /* @__PURE__ */ __name(() => assertIs, "assertIs"), assertNever: /* @__PURE__ */ __name(() => assertNever, "assertNever"), assertNotEqual: /* @__PURE__ */ __name(() => assertNotEqual, "assertNotEqual"), assignProp: /* @__PURE__ */ __name(() => assignProp, "assignProp"), base64ToUint8Array: /* @__PURE__ */ __name(() => base64ToUint8Array, "base64ToUint8Array"), base64urlToUint8Array: /* @__PURE__ */ __name(() => base64urlToUint8Array, "base64urlToUint8Array"), cached: /* @__PURE__ */ __name(() => cached, "cached"), captureStackTrace: /* @__PURE__ */ __name(() => captureStackTrace, "captureStackTrace"), cleanEnum: /* @__PURE__ */ __name(() => cleanEnum, "cleanEnum"), cleanRegex: /* @__PURE__ */ __name(() => cleanRegex, "cleanRegex"), clone: /* @__PURE__ */ __name(() => clone, "clone"), cloneDef: /* @__PURE__ */ __name(() => cloneDef, "cloneDef"), createTransparentProxy: /* @__PURE__ */ __name(() => createTransparentProxy, "createTransparentProxy"), defineLazy: /* @__PURE__ */ __name(() => defineLazy, "defineLazy"), esc: /* @__PURE__ */ __name(() => esc, "esc"), escapeRegex: /* @__PURE__ */ __name(() => escapeRegex, "escapeRegex"), extend: /* @__PURE__ */ __name(() => extend, "extend"), finalizeIssue: /* @__PURE__ */ __name(() => finalizeIssue, "finalizeIssue"), floatSafeRemainder: /* @__PURE__ */ __name(() => floatSafeRemainder, "floatSafeRemainder"), getElementAtPath: /* @__PURE__ */ __name(() => getElementAtPath, "getElementAtPath"), getEnumValues: /* @__PURE__ */ __name(() => getEnumValues, "getEnumValues"), getLengthableOrigin: /* @__PURE__ */ __name(() => getLengthableOrigin, "getLengthableOrigin"), getParsedType: /* @__PURE__ */ __name(() => getParsedType, "getParsedType"), getSizableOrigin: /* @__PURE__ */ __name(() => getSizableOrigin, "getSizableOrigin"), hexToUint8Array: /* @__PURE__ */ __name(() => hexToUint8Array, "hexToUint8Array"), isObject: /* @__PURE__ */ __name(() => isObject, "isObject"), isPlainObject: /* @__PURE__ */ __name(() => isPlainObject, "isPlainObject"), issue: /* @__PURE__ */ __name(() => issue, "issue"), joinValues: /* @__PURE__ */ __name(() => joinValues, "joinValues"), jsonStringifyReplacer: /* @__PURE__ */ __name(() => jsonStringifyReplacer, "jsonStringifyReplacer"), merge: /* @__PURE__ */ __name(() => merge, "merge"), mergeDefs: /* @__PURE__ */ __name(() => mergeDefs, "mergeDefs"), normalizeParams: /* @__PURE__ */ __name(() => normalizeParams, "normalizeParams"), nullish: /* @__PURE__ */ __name(() => nullish, "nullish"), numKeys: /* @__PURE__ */ __name(() => numKeys, "numKeys"), objectClone: /* @__PURE__ */ __name(() => objectClone, "objectClone"), omit: /* @__PURE__ */ __name(() => omit, "omit"), optionalKeys: /* @__PURE__ */ __name(() => optionalKeys, "optionalKeys"), partial: /* @__PURE__ */ __name(() => partial, "partial"), pick: /* @__PURE__ */ __name(() => pick, "pick"), prefixIssues: /* @__PURE__ */ __name(() => prefixIssues, "prefixIssues"), primitiveTypes: /* @__PURE__ */ __name(() => primitiveTypes, "primitiveTypes"), promiseAllObject: /* @__PURE__ */ __name(() => promiseAllObject, "promiseAllObject"), propertyKeyTypes: /* @__PURE__ */ __name(() => propertyKeyTypes, "propertyKeyTypes"), randomString: /* @__PURE__ */ __name(() => randomString, "randomString"), required: /* @__PURE__ */ __name(() => required, "required"), safeExtend: /* @__PURE__ */ __name(() => safeExtend, "safeExtend"), shallowClone: /* @__PURE__ */ __name(() => shallowClone, "shallowClone"), stringifyPrimitive: /* @__PURE__ */ __name(() => stringifyPrimitive, "stringifyPrimitive"), uint8ArrayToBase64: /* @__PURE__ */ __name(() => uint8ArrayToBase64, "uint8ArrayToBase64"), uint8ArrayToBase64url: /* @__PURE__ */ __name(() => uint8ArrayToBase64url, "uint8ArrayToBase64url"), uint8ArrayToHex: /* @__PURE__ */ __name(() => uint8ArrayToHex, "uint8ArrayToHex"), unwrapMessage: /* @__PURE__ */ __name(() => unwrapMessage, "unwrapMessage") });
    function assertEqual(val) {
      return val;
    }
    __name(assertEqual, "assertEqual");
    function assertNotEqual(val) {
      return val;
    }
    __name(assertNotEqual, "assertNotEqual");
    function assertIs(_arg) {
    }
    __name(assertIs, "assertIs");
    function assertNever(_x) {
      throw new Error();
    }
    __name(assertNever, "assertNever");
    function assert(_) {
    }
    __name(assert, "assert");
    function getEnumValues(entries) {
      let numericValues = Object.values(entries).filter((v) => typeof v == "number");
      return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
    }
    __name(getEnumValues, "getEnumValues");
    function joinValues(array2, separator = "|") {
      return array2.map((val) => stringifyPrimitive(val)).join(separator);
    }
    __name(joinValues, "joinValues");
    function jsonStringifyReplacer(_, value) {
      return typeof value == "bigint" ? value.toString() : value;
    }
    __name(jsonStringifyReplacer, "jsonStringifyReplacer");
    function cached(getter) {
      return { get value() {
        {
          let value = getter();
          return Object.defineProperty(this, "value", { value }), value;
        }
        throw new Error("cached value already set");
      } };
    }
    __name(cached, "cached");
    function nullish(input) {
      return input == null;
    }
    __name(nullish, "nullish");
    function cleanRegex(source) {
      let start = source.startsWith("^") ? 1 : 0, end = source.endsWith("$") ? source.length - 1 : source.length;
      return source.slice(start, end);
    }
    __name(cleanRegex, "cleanRegex");
    function floatSafeRemainder(val, step) {
      let valDecCount = (val.toString().split(".")[1] || "").length, stepString = step.toString(), stepDecCount = (stepString.split(".")[1] || "").length;
      if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
        let match = stepString.match(/\d?e-(\d?)/);
        match?.[1] && (stepDecCount = Number.parseInt(match[1]));
      }
      let decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount, valInt = Number.parseInt(val.toFixed(decCount).replace(".", "")), stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
      return valInt % stepInt / 10 ** decCount;
    }
    __name(floatSafeRemainder, "floatSafeRemainder");
    var EVALUATING = Symbol("evaluating");
    function defineLazy(object2, key, getter) {
      let value;
      Object.defineProperty(object2, key, { get() {
        if (value !== EVALUATING) return value === void 0 && (value = EVALUATING, value = getter()), value;
      }, set(v) {
        Object.defineProperty(object2, key, { value: v });
      }, configurable: true });
    }
    __name(defineLazy, "defineLazy");
    function objectClone(obj) {
      return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    }
    __name(objectClone, "objectClone");
    function assignProp(target, prop, value) {
      Object.defineProperty(target, prop, { value, writable: true, enumerable: true, configurable: true });
    }
    __name(assignProp, "assignProp");
    function mergeDefs(...defs) {
      let mergedDescriptors = {};
      for (let def of defs) {
        let descriptors = Object.getOwnPropertyDescriptors(def);
        Object.assign(mergedDescriptors, descriptors);
      }
      return Object.defineProperties({}, mergedDescriptors);
    }
    __name(mergeDefs, "mergeDefs");
    function cloneDef(schema) {
      return mergeDefs(schema._zod.def);
    }
    __name(cloneDef, "cloneDef");
    function getElementAtPath(obj, path3) {
      return path3 ? path3.reduce((acc, key) => acc?.[key], obj) : obj;
    }
    __name(getElementAtPath, "getElementAtPath");
    function promiseAllObject(promisesObj) {
      let keys = Object.keys(promisesObj), promises = keys.map((key) => promisesObj[key]);
      return Promise.all(promises).then((results) => {
        let resolvedObj = {};
        for (let i = 0; i < keys.length; i++) resolvedObj[keys[i]] = results[i];
        return resolvedObj;
      });
    }
    __name(promiseAllObject, "promiseAllObject");
    function randomString(length = 10) {
      let chars = "abcdefghijklmnopqrstuvwxyz", str = "";
      for (let i = 0; i < length; i++) str += chars[Math.floor(Math.random() * chars.length)];
      return str;
    }
    __name(randomString, "randomString");
    function esc(str) {
      return JSON.stringify(str);
    }
    __name(esc, "esc");
    var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
    };
    function isObject(data) {
      return typeof data == "object" && data !== null && !Array.isArray(data);
    }
    __name(isObject, "isObject");
    var allowsEval = cached(() => {
      if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return false;
      try {
        let F = Function;
        return new F(""), true;
      } catch {
        return false;
      }
    });
    function isPlainObject(o) {
      if (isObject(o) === false) return false;
      let ctor = o.constructor;
      if (ctor === void 0) return true;
      let prot = ctor.prototype;
      return !(isObject(prot) === false || Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false);
    }
    __name(isPlainObject, "isPlainObject");
    function shallowClone(o) {
      return isPlainObject(o) ? { ...o } : Array.isArray(o) ? [...o] : o;
    }
    __name(shallowClone, "shallowClone");
    function numKeys(data) {
      let keyCount = 0;
      for (let key in data) Object.prototype.hasOwnProperty.call(data, key) && keyCount++;
      return keyCount;
    }
    __name(numKeys, "numKeys");
    var getParsedType = /* @__PURE__ */ __name((data) => {
      let t = typeof data;
      switch (t) {
        case "undefined":
          return "undefined";
        case "string":
          return "string";
        case "number":
          return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
          return "boolean";
        case "function":
          return "function";
        case "bigint":
          return "bigint";
        case "symbol":
          return "symbol";
        case "object":
          return Array.isArray(data) ? "array" : data === null ? "null" : data.then && typeof data.then == "function" && data.catch && typeof data.catch == "function" ? "promise" : typeof Map < "u" && data instanceof Map ? "map" : typeof Set < "u" && data instanceof Set ? "set" : typeof Date < "u" && data instanceof Date ? "date" : typeof File < "u" && data instanceof File ? "file" : "object";
        default:
          throw new Error(`Unknown data type: ${t}`);
      }
    }, "getParsedType");
    var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
    var primitiveTypes = /* @__PURE__ */ new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    __name(escapeRegex, "escapeRegex");
    function clone(inst, def, params) {
      let cl = new inst._zod.constr(def ?? inst._zod.def);
      return (!def || params?.parent) && (cl._zod.parent = inst), cl;
    }
    __name(clone, "clone");
    function normalizeParams(_params) {
      let params = _params;
      if (!params) return {};
      if (typeof params == "string") return { error: /* @__PURE__ */ __name(() => params, "error") };
      if (params?.message !== void 0) {
        if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
      }
      return delete params.message, typeof params.error == "string" ? { ...params, error: /* @__PURE__ */ __name(() => params.error, "error") } : params;
    }
    __name(normalizeParams, "normalizeParams");
    function createTransparentProxy(getter) {
      let target;
      return new Proxy({}, { get(_, prop, receiver) {
        return target ?? (target = getter()), Reflect.get(target, prop, receiver);
      }, set(_, prop, value, receiver) {
        return target ?? (target = getter()), Reflect.set(target, prop, value, receiver);
      }, has(_, prop) {
        return target ?? (target = getter()), Reflect.has(target, prop);
      }, deleteProperty(_, prop) {
        return target ?? (target = getter()), Reflect.deleteProperty(target, prop);
      }, ownKeys(_) {
        return target ?? (target = getter()), Reflect.ownKeys(target);
      }, getOwnPropertyDescriptor(_, prop) {
        return target ?? (target = getter()), Reflect.getOwnPropertyDescriptor(target, prop);
      }, defineProperty(_, prop, descriptor) {
        return target ?? (target = getter()), Reflect.defineProperty(target, prop, descriptor);
      } });
    }
    __name(createTransparentProxy, "createTransparentProxy");
    function stringifyPrimitive(value) {
      return typeof value == "bigint" ? value.toString() + "n" : typeof value == "string" ? `"${value}"` : `${value}`;
    }
    __name(stringifyPrimitive, "stringifyPrimitive");
    function optionalKeys(shape) {
      return Object.keys(shape).filter((k) => shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional");
    }
    __name(optionalKeys, "optionalKeys");
    var NUMBER_FORMAT_RANGES = { safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], int32: [-2147483648, 2147483647], uint32: [0, 4294967295], float32: [-34028234663852886e22, 34028234663852886e22], float64: [-Number.MAX_VALUE, Number.MAX_VALUE] };
    var BIGINT_FORMAT_RANGES = { int64: [BigInt("-9223372036854775808"), BigInt("9223372036854775807")], uint64: [BigInt(0), BigInt("18446744073709551615")] };
    function pick(schema, mask) {
      let currDef = schema._zod.def, def = mergeDefs(schema._zod.def, { get shape() {
        let newShape = {};
        for (let key in mask) {
          if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
          mask[key] && (newShape[key] = currDef.shape[key]);
        }
        return assignProp(this, "shape", newShape), newShape;
      }, checks: [] });
      return clone(schema, def);
    }
    __name(pick, "pick");
    function omit(schema, mask) {
      let currDef = schema._zod.def, def = mergeDefs(schema._zod.def, { get shape() {
        let newShape = { ...schema._zod.def.shape };
        for (let key in mask) {
          if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
          mask[key] && delete newShape[key];
        }
        return assignProp(this, "shape", newShape), newShape;
      }, checks: [] });
      return clone(schema, def);
    }
    __name(omit, "omit");
    function extend(schema, shape) {
      if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
      let checks = schema._zod.def.checks;
      if (checks && checks.length > 0) throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
      let def = mergeDefs(schema._zod.def, { get shape() {
        let _shape = { ...schema._zod.def.shape, ...shape };
        return assignProp(this, "shape", _shape), _shape;
      }, checks: [] });
      return clone(schema, def);
    }
    __name(extend, "extend");
    function safeExtend(schema, shape) {
      if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
      let def = { ...schema._zod.def, get shape() {
        let _shape = { ...schema._zod.def.shape, ...shape };
        return assignProp(this, "shape", _shape), _shape;
      }, checks: schema._zod.def.checks };
      return clone(schema, def);
    }
    __name(safeExtend, "safeExtend");
    function merge(a, b) {
      let def = mergeDefs(a._zod.def, { get shape() {
        let _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
        return assignProp(this, "shape", _shape), _shape;
      }, get catchall() {
        return b._zod.def.catchall;
      }, checks: [] });
      return clone(a, def);
    }
    __name(merge, "merge");
    function partial(Class2, schema, mask) {
      let def = mergeDefs(schema._zod.def, { get shape() {
        let oldShape = schema._zod.def.shape, shape = { ...oldShape };
        if (mask) for (let key in mask) {
          if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
          mask[key] && (shape[key] = Class2 ? new Class2({ type: "optional", innerType: oldShape[key] }) : oldShape[key]);
        }
        else for (let key in oldShape) shape[key] = Class2 ? new Class2({ type: "optional", innerType: oldShape[key] }) : oldShape[key];
        return assignProp(this, "shape", shape), shape;
      }, checks: [] });
      return clone(schema, def);
    }
    __name(partial, "partial");
    function required(Class2, schema, mask) {
      let def = mergeDefs(schema._zod.def, { get shape() {
        let oldShape = schema._zod.def.shape, shape = { ...oldShape };
        if (mask) for (let key in mask) {
          if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
          mask[key] && (shape[key] = new Class2({ type: "nonoptional", innerType: oldShape[key] }));
        }
        else for (let key in oldShape) shape[key] = new Class2({ type: "nonoptional", innerType: oldShape[key] });
        return assignProp(this, "shape", shape), shape;
      }, checks: [] });
      return clone(schema, def);
    }
    __name(required, "required");
    function aborted(x, startIndex = 0) {
      if (x.aborted === true) return true;
      for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
      return false;
    }
    __name(aborted, "aborted");
    function prefixIssues(path3, issues) {
      return issues.map((iss) => {
        var _a;
        return (_a = iss).path ?? (_a.path = []), iss.path.unshift(path3), iss;
      });
    }
    __name(prefixIssues, "prefixIssues");
    function unwrapMessage(message) {
      return typeof message == "string" ? message : message?.message;
    }
    __name(unwrapMessage, "unwrapMessage");
    function finalizeIssue(iss, ctx, config2) {
      let full = { ...iss, path: iss.path ?? [] };
      if (!iss.message) {
        let message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
        full.message = message;
      }
      return delete full.inst, delete full.continue, ctx?.reportInput || delete full.input, full;
    }
    __name(finalizeIssue, "finalizeIssue");
    function getSizableOrigin(input) {
      return input instanceof Set ? "set" : input instanceof Map ? "map" : input instanceof File ? "file" : "unknown";
    }
    __name(getSizableOrigin, "getSizableOrigin");
    function getLengthableOrigin(input) {
      return Array.isArray(input) ? "array" : typeof input == "string" ? "string" : "unknown";
    }
    __name(getLengthableOrigin, "getLengthableOrigin");
    function issue(...args) {
      let [iss, input, inst] = args;
      return typeof iss == "string" ? { message: iss, code: "custom", input, inst } : { ...iss };
    }
    __name(issue, "issue");
    function cleanEnum(obj) {
      return Object.entries(obj).filter(([k, _]) => Number.isNaN(Number.parseInt(k, 10))).map((el) => el[1]);
    }
    __name(cleanEnum, "cleanEnum");
    function base64ToUint8Array(base642) {
      let binaryString = atob(base642), bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
    }
    __name(base64ToUint8Array, "base64ToUint8Array");
    function uint8ArrayToBase64(bytes) {
      let binaryString = "";
      for (let i = 0; i < bytes.length; i++) binaryString += String.fromCharCode(bytes[i]);
      return btoa(binaryString);
    }
    __name(uint8ArrayToBase64, "uint8ArrayToBase64");
    function base64urlToUint8Array(base64url2) {
      let base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/"), padding = "=".repeat((4 - base642.length % 4) % 4);
      return base64ToUint8Array(base642 + padding);
    }
    __name(base64urlToUint8Array, "base64urlToUint8Array");
    function uint8ArrayToBase64url(bytes) {
      return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }
    __name(uint8ArrayToBase64url, "uint8ArrayToBase64url");
    function hexToUint8Array(hex) {
      let cleanHex = hex.replace(/^0x/, "");
      if (cleanHex.length % 2 !== 0) throw new Error("Invalid hex string length");
      let bytes = new Uint8Array(cleanHex.length / 2);
      for (let i = 0; i < cleanHex.length; i += 2) bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
      return bytes;
    }
    __name(hexToUint8Array, "hexToUint8Array");
    function uint8ArrayToHex(bytes) {
      return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    __name(uint8ArrayToHex, "uint8ArrayToHex");
    var Class = class {
      static {
        __name(this, "Class");
      }
      constructor(..._args) {
      }
    };
    var initializer = /* @__PURE__ */ __name((inst, def) => {
      inst.name = "$ZodError", Object.defineProperty(inst, "_zod", { value: inst._zod, enumerable: false }), Object.defineProperty(inst, "issues", { value: def, enumerable: false }), inst.message = JSON.stringify(def, jsonStringifyReplacer, 2), Object.defineProperty(inst, "toString", { value: /* @__PURE__ */ __name(() => inst.message, "value"), enumerable: false });
    }, "initializer");
    var $ZodError = $constructor("$ZodError", initializer);
    var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
    function flattenError(error, mapper = (issue2) => issue2.message) {
      let fieldErrors = {}, formErrors = [];
      for (let sub of error.issues) sub.path.length > 0 ? (fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [], fieldErrors[sub.path[0]].push(mapper(sub))) : formErrors.push(mapper(sub));
      return { formErrors, fieldErrors };
    }
    __name(flattenError, "flattenError");
    function formatError(error, _mapper) {
      let mapper = _mapper || function(issue2) {
        return issue2.message;
      }, fieldErrors = { _errors: [] }, processError = /* @__PURE__ */ __name((error2) => {
        for (let issue2 of error2.issues) if (issue2.code === "invalid_union" && issue2.errors.length) issue2.errors.map((issues) => processError({ issues }));
        else if (issue2.code === "invalid_key") processError({ issues: issue2.issues });
        else if (issue2.code === "invalid_element") processError({ issues: issue2.issues });
        else if (issue2.path.length === 0) fieldErrors._errors.push(mapper(issue2));
        else {
          let curr = fieldErrors, i = 0;
          for (; i < issue2.path.length; ) {
            let el = issue2.path[i];
            i === issue2.path.length - 1 ? (curr[el] = curr[el] || { _errors: [] }, curr[el]._errors.push(mapper(issue2))) : curr[el] = curr[el] || { _errors: [] }, curr = curr[el], i++;
          }
        }
      }, "processError");
      return processError(error), fieldErrors;
    }
    __name(formatError, "formatError");
    var _parse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx, _params) => {
      let ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false }, result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) throw new $ZodAsyncError();
      if (result.issues.length) {
        let e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        throw captureStackTrace(e, _params?.callee), e;
      }
      return result.value;
    }, "_parse");
    var _parseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx, params) => {
      let ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true }, result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise && (result = await result), result.issues.length) {
        let e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        throw captureStackTrace(e, params?.callee), e;
      }
      return result.value;
    }, "_parseAsync");
    var _safeParse = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
      let ctx = _ctx ? { ..._ctx, async: false } : { async: false }, result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) throw new $ZodAsyncError();
      return result.issues.length ? { success: false, error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))) } : { success: true, data: result.value };
    }, "_safeParse");
    var safeParse = _safeParse($ZodRealError);
    var _safeParseAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
      let ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true }, result = schema._zod.run({ value, issues: [] }, ctx);
      return result instanceof Promise && (result = await result), result.issues.length ? { success: false, error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))) } : { success: true, data: result.value };
    }, "_safeParseAsync");
    var safeParseAsync = _safeParseAsync($ZodRealError);
    var _encode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
      let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return _parse(_Err)(schema, value, ctx);
    }, "_encode");
    var _decode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => _parse(_Err)(schema, value, _ctx), "_decode");
    var _encodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
      let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return _parseAsync(_Err)(schema, value, ctx);
    }, "_encodeAsync");
    var _decodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => _parseAsync(_Err)(schema, value, _ctx), "_decodeAsync");
    var _safeEncode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => {
      let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return _safeParse(_Err)(schema, value, ctx);
    }, "_safeEncode");
    var _safeDecode = /* @__PURE__ */ __name((_Err) => (schema, value, _ctx) => _safeParse(_Err)(schema, value, _ctx), "_safeDecode");
    var _safeEncodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => {
      let ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
      return _safeParseAsync(_Err)(schema, value, ctx);
    }, "_safeEncodeAsync");
    var _safeDecodeAsync = /* @__PURE__ */ __name((_Err) => async (schema, value, _ctx) => _safeParseAsync(_Err)(schema, value, _ctx), "_safeDecodeAsync");
    var cuid = /^[cC][^\s-]{8,}$/;
    var cuid2 = /^[0-9a-z]+$/;
    var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
    var xid = /^[0-9a-vA-V]{20}$/;
    var ksuid = /^[A-Za-z0-9]{27}$/;
    var nanoid = /^[a-zA-Z0-9_-]{21}$/;
    var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
    var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
    var uuid = /* @__PURE__ */ __name((version2) => version2 ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, "uuid");
    var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
    var _emoji = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
    function emoji() {
      return new RegExp(_emoji, "u");
    }
    __name(emoji, "emoji");
    var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
    var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
    var base64url = /^[A-Za-z0-9_-]*$/;
    var hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
    var e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
    var dateSource = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
    var date = new RegExp(`^${dateSource}$`);
    function timeSource(args) {
      let hhmm = "(?:[01]\\d|2[0-3]):[0-5]\\d";
      return typeof args.precision == "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    }
    __name(timeSource, "timeSource");
    function time(args) {
      return new RegExp(`^${timeSource(args)}$`);
    }
    __name(time, "time");
    function datetime(args) {
      let time3 = timeSource({ precision: args.precision }), opts = ["Z"];
      args.local && opts.push(""), args.offset && opts.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
      let timeRegex = `${time3}(?:${opts.join("|")})`;
      return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
    }
    __name(datetime, "datetime");
    var string = /* @__PURE__ */ __name((params) => {
      let regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : "[\\s\\S]*";
      return new RegExp(`^${regex}$`);
    }, "string");
    var integer = /^-?\d+$/;
    var number = /^-?\d+(?:\.\d+)?/;
    var boolean = /^(?:true|false)$/i;
    var lowercase = /^[^A-Z]*$/;
    var uppercase = /^[^a-z]*$/;
    var $ZodCheck = $constructor("$ZodCheck", (inst, def) => {
      var _a;
      inst._zod ?? (inst._zod = {}), inst._zod.def = def, (_a = inst._zod).onattach ?? (_a.onattach = []);
    });
    var numericOriginMap = { number: "number", bigint: "bigint", object: "date" };
    var $ZodCheckLessThan = $constructor("$ZodCheckLessThan", (inst, def) => {
      $ZodCheck.init(inst, def);
      let origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag, curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        def.value < curr && (def.inclusive ? bag.maximum = def.value : bag.exclusiveMaximum = def.value);
      }), inst._zod.check = (payload) => {
        (def.inclusive ? payload.value <= def.value : payload.value < def.value) || payload.issues.push({ origin, code: "too_big", maximum: def.value, input: payload.value, inclusive: def.inclusive, inst, continue: !def.abort });
      };
    });
    var $ZodCheckGreaterThan = $constructor("$ZodCheckGreaterThan", (inst, def) => {
      $ZodCheck.init(inst, def);
      let origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag, curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        def.value > curr && (def.inclusive ? bag.minimum = def.value : bag.exclusiveMinimum = def.value);
      }), inst._zod.check = (payload) => {
        (def.inclusive ? payload.value >= def.value : payload.value > def.value) || payload.issues.push({ origin, code: "too_small", minimum: def.value, input: payload.value, inclusive: def.inclusive, inst, continue: !def.abort });
      };
    });
    var $ZodCheckMultipleOf = $constructor("$ZodCheckMultipleOf", (inst, def) => {
      $ZodCheck.init(inst, def), inst._zod.onattach.push((inst2) => {
        var _a;
        (_a = inst2._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
      }), inst._zod.check = (payload) => {
        if (typeof payload.value != typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
        (typeof payload.value == "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) || payload.issues.push({ origin: typeof payload.value, code: "not_multiple_of", divisor: def.value, input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodCheckNumberFormat = $constructor("$ZodCheckNumberFormat", (inst, def) => {
      $ZodCheck.init(inst, def), def.format = def.format || "float64";
      let isInt = def.format?.includes("int"), origin = isInt ? "int" : "number", [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.format = def.format, bag.minimum = minimum, bag.maximum = maximum, isInt && (bag.pattern = integer);
      }), inst._zod.check = (payload) => {
        let input = payload.value;
        if (isInt) {
          if (!Number.isInteger(input)) {
            payload.issues.push({ expected: origin, format: def.format, code: "invalid_type", continue: false, input, inst });
            return;
          }
          if (!Number.isSafeInteger(input)) {
            input > 0 ? payload.issues.push({ input, code: "too_big", maximum: Number.MAX_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst, origin, continue: !def.abort }) : payload.issues.push({ input, code: "too_small", minimum: Number.MIN_SAFE_INTEGER, note: "Integers must be within the safe integer range.", inst, origin, continue: !def.abort });
            return;
          }
        }
        input < minimum && payload.issues.push({ origin: "number", input, code: "too_small", minimum, inclusive: true, inst, continue: !def.abort }), input > maximum && payload.issues.push({ origin: "number", input, code: "too_big", maximum, inst });
      };
    });
    var $ZodCheckMaxLength = $constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        let val = payload.value;
        return !nullish(val) && val.length !== void 0;
      }), inst._zod.onattach.push((inst2) => {
        let curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        def.maximum < curr && (inst2._zod.bag.maximum = def.maximum);
      }), inst._zod.check = (payload) => {
        let input = payload.value;
        if (input.length <= def.maximum) return;
        let origin = getLengthableOrigin(input);
        payload.issues.push({ origin, code: "too_big", maximum: def.maximum, inclusive: true, input, inst, continue: !def.abort });
      };
    });
    var $ZodCheckMinLength = $constructor("$ZodCheckMinLength", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        let val = payload.value;
        return !nullish(val) && val.length !== void 0;
      }), inst._zod.onattach.push((inst2) => {
        let curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        def.minimum > curr && (inst2._zod.bag.minimum = def.minimum);
      }), inst._zod.check = (payload) => {
        let input = payload.value;
        if (input.length >= def.minimum) return;
        let origin = getLengthableOrigin(input);
        payload.issues.push({ origin, code: "too_small", minimum: def.minimum, inclusive: true, input, inst, continue: !def.abort });
      };
    });
    var $ZodCheckLengthEquals = $constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def), (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        let val = payload.value;
        return !nullish(val) && val.length !== void 0;
      }), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.minimum = def.length, bag.maximum = def.length, bag.length = def.length;
      }), inst._zod.check = (payload) => {
        let input = payload.value, length = input.length;
        if (length === def.length) return;
        let origin = getLengthableOrigin(input), tooBig = length > def.length;
        payload.issues.push({ origin, ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }, inclusive: true, exact: true, input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodCheckStringFormat = $constructor("$ZodCheckStringFormat", (inst, def) => {
      var _a, _b;
      $ZodCheck.init(inst, def), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.format = def.format, def.pattern && (bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set()), bag.patterns.add(def.pattern));
      }), def.pattern ? (_a = inst._zod).check ?? (_a.check = (payload) => {
        def.pattern.lastIndex = 0, !def.pattern.test(payload.value) && payload.issues.push({ origin: "string", code: "invalid_format", format: def.format, input: payload.value, ...def.pattern ? { pattern: def.pattern.toString() } : {}, inst, continue: !def.abort });
      }) : (_b = inst._zod).check ?? (_b.check = () => {
      });
    });
    var $ZodCheckRegex = $constructor("$ZodCheckRegex", (inst, def) => {
      $ZodCheckStringFormat.init(inst, def), inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0, !def.pattern.test(payload.value) && payload.issues.push({ origin: "string", code: "invalid_format", format: "regex", input: payload.value, pattern: def.pattern.toString(), inst, continue: !def.abort });
      };
    });
    var $ZodCheckLowerCase = $constructor("$ZodCheckLowerCase", (inst, def) => {
      def.pattern ?? (def.pattern = lowercase), $ZodCheckStringFormat.init(inst, def);
    });
    var $ZodCheckUpperCase = $constructor("$ZodCheckUpperCase", (inst, def) => {
      def.pattern ?? (def.pattern = uppercase), $ZodCheckStringFormat.init(inst, def);
    });
    var $ZodCheckIncludes = $constructor("$ZodCheckIncludes", (inst, def) => {
      $ZodCheck.init(inst, def);
      let escapedRegex = escapeRegex(def.includes), pattern = new RegExp(typeof def.position == "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
      def.pattern = pattern, inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set()), bag.patterns.add(pattern);
      }), inst._zod.check = (payload) => {
        payload.value.includes(def.includes, def.position) || payload.issues.push({ origin: "string", code: "invalid_format", format: "includes", includes: def.includes, input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodCheckStartsWith = $constructor("$ZodCheckStartsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      let pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
      def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set()), bag.patterns.add(pattern);
      }), inst._zod.check = (payload) => {
        payload.value.startsWith(def.prefix) || payload.issues.push({ origin: "string", code: "invalid_format", format: "starts_with", prefix: def.prefix, input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodCheckEndsWith = $constructor("$ZodCheckEndsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      let pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
      def.pattern ?? (def.pattern = pattern), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set()), bag.patterns.add(pattern);
      }), inst._zod.check = (payload) => {
        payload.value.endsWith(def.suffix) || payload.issues.push({ origin: "string", code: "invalid_format", format: "ends_with", suffix: def.suffix, input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodCheckOverwrite = $constructor("$ZodCheckOverwrite", (inst, def) => {
      $ZodCheck.init(inst, def), inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
      };
    });
    var Doc = class {
      static {
        __name(this, "Doc");
      }
      constructor(args = []) {
        this.content = [], this.indent = 0, this && (this.args = args);
      }
      indented(fn) {
        this.indent += 1, fn(this), this.indent -= 1;
      }
      write(arg) {
        if (typeof arg == "function") {
          arg(this, { execution: "sync" }), arg(this, { execution: "async" });
          return;
        }
        let lines = arg.split(`
`).filter((x) => x), minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length)), dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (let line of dedented) this.content.push(line);
      }
      compile() {
        let F = Function, args = this?.args, lines = [...(this?.content ?? [""]).map((x) => `  ${x}`)];
        return new F(...args, lines.join(`
`));
      }
    };
    var version = { major: 4, minor: 1, patch: 11 };
    var $ZodType = $constructor("$ZodType", (inst, def) => {
      var _a;
      inst ?? (inst = {}), inst._zod.def = def, inst._zod.bag = inst._zod.bag || {}, inst._zod.version = version;
      let checks = [...inst._zod.def.checks ?? []];
      inst._zod.traits.has("$ZodCheck") && checks.unshift(inst);
      for (let ch of checks) for (let fn of ch._zod.onattach) fn(inst);
      if (checks.length === 0) (_a = inst._zod).deferred ?? (_a.deferred = []), inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
      else {
        let runChecks = /* @__PURE__ */ __name((payload, checks2, ctx) => {
          let isAborted = aborted(payload), asyncResult;
          for (let ch of checks2) {
            if (ch._zod.def.when) {
              if (!ch._zod.def.when(payload)) continue;
            } else if (isAborted) continue;
            let currLen = payload.issues.length, _ = ch._zod.check(payload);
            if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
            if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _, payload.issues.length !== currLen && (isAborted || (isAborted = aborted(payload, currLen)));
            });
            else {
              if (payload.issues.length === currLen) continue;
              isAborted || (isAborted = aborted(payload, currLen));
            }
          }
          return asyncResult ? asyncResult.then(() => payload) : payload;
        }, "runChecks"), handleCanaryResult = /* @__PURE__ */ __name((canary, payload, ctx) => {
          if (aborted(canary)) return canary.aborted = true, canary;
          let checkResult = runChecks(payload, checks, ctx);
          if (checkResult instanceof Promise) {
            if (ctx.async === false) throw new $ZodAsyncError();
            return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
          }
          return inst._zod.parse(checkResult, ctx);
        }, "handleCanaryResult");
        inst._zod.run = (payload, ctx) => {
          if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
          if (ctx.direction === "backward") {
            let canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
            return canary instanceof Promise ? canary.then((canary2) => handleCanaryResult(canary2, payload, ctx)) : handleCanaryResult(canary, payload, ctx);
          }
          let result = inst._zod.parse(payload, ctx);
          if (result instanceof Promise) {
            if (ctx.async === false) throw new $ZodAsyncError();
            return result.then((result2) => runChecks(result2, checks, ctx));
          }
          return runChecks(result, checks, ctx);
        };
      }
      inst["~standard"] = { validate: /* @__PURE__ */ __name((value) => {
        try {
          let r = safeParse(inst, value);
          return r.success ? { value: r.data } : { issues: r.error?.issues };
        } catch {
          return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
        }
      }, "validate"), vendor: "zod", version: 1 };
    });
    var $ZodString = $constructor("$ZodString", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag), inst._zod.parse = (payload, _) => {
        if (def.coerce) try {
          payload.value = String(payload.value);
        } catch {
        }
        return typeof payload.value == "string" || payload.issues.push({ expected: "string", code: "invalid_type", input: payload.value, inst }), payload;
      };
    });
    var $ZodStringFormat = $constructor("$ZodStringFormat", (inst, def) => {
      $ZodCheckStringFormat.init(inst, def), $ZodString.init(inst, def);
    });
    var $ZodGUID = $constructor("$ZodGUID", (inst, def) => {
      def.pattern ?? (def.pattern = guid), $ZodStringFormat.init(inst, def);
    });
    var $ZodUUID = $constructor("$ZodUUID", (inst, def) => {
      if (def.version) {
        let v = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[def.version];
        if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid(v));
      } else def.pattern ?? (def.pattern = uuid());
      $ZodStringFormat.init(inst, def);
    });
    var $ZodEmail = $constructor("$ZodEmail", (inst, def) => {
      def.pattern ?? (def.pattern = email), $ZodStringFormat.init(inst, def);
    });
    var $ZodURL = $constructor("$ZodURL", (inst, def) => {
      $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
        try {
          let trimmed = payload.value.trim(), url = new URL(trimmed);
          def.hostname && (def.hostname.lastIndex = 0, def.hostname.test(url.hostname) || payload.issues.push({ code: "invalid_format", format: "url", note: "Invalid hostname", pattern: hostname.source, input: payload.value, inst, continue: !def.abort })), def.protocol && (def.protocol.lastIndex = 0, def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol) || payload.issues.push({ code: "invalid_format", format: "url", note: "Invalid protocol", pattern: def.protocol.source, input: payload.value, inst, continue: !def.abort })), def.normalize ? payload.value = url.href : payload.value = trimmed;
          return;
        } catch {
          payload.issues.push({ code: "invalid_format", format: "url", input: payload.value, inst, continue: !def.abort });
        }
      };
    });
    var $ZodEmoji = $constructor("$ZodEmoji", (inst, def) => {
      def.pattern ?? (def.pattern = emoji()), $ZodStringFormat.init(inst, def);
    });
    var $ZodNanoID = $constructor("$ZodNanoID", (inst, def) => {
      def.pattern ?? (def.pattern = nanoid), $ZodStringFormat.init(inst, def);
    });
    var $ZodCUID = $constructor("$ZodCUID", (inst, def) => {
      def.pattern ?? (def.pattern = cuid), $ZodStringFormat.init(inst, def);
    });
    var $ZodCUID2 = $constructor("$ZodCUID2", (inst, def) => {
      def.pattern ?? (def.pattern = cuid2), $ZodStringFormat.init(inst, def);
    });
    var $ZodULID = $constructor("$ZodULID", (inst, def) => {
      def.pattern ?? (def.pattern = ulid), $ZodStringFormat.init(inst, def);
    });
    var $ZodXID = $constructor("$ZodXID", (inst, def) => {
      def.pattern ?? (def.pattern = xid), $ZodStringFormat.init(inst, def);
    });
    var $ZodKSUID = $constructor("$ZodKSUID", (inst, def) => {
      def.pattern ?? (def.pattern = ksuid), $ZodStringFormat.init(inst, def);
    });
    var $ZodISODateTime = $constructor("$ZodISODateTime", (inst, def) => {
      def.pattern ?? (def.pattern = datetime(def)), $ZodStringFormat.init(inst, def);
    });
    var $ZodISODate = $constructor("$ZodISODate", (inst, def) => {
      def.pattern ?? (def.pattern = date), $ZodStringFormat.init(inst, def);
    });
    var $ZodISOTime = $constructor("$ZodISOTime", (inst, def) => {
      def.pattern ?? (def.pattern = time(def)), $ZodStringFormat.init(inst, def);
    });
    var $ZodISODuration = $constructor("$ZodISODuration", (inst, def) => {
      def.pattern ?? (def.pattern = duration), $ZodStringFormat.init(inst, def);
    });
    var $ZodIPv4 = $constructor("$ZodIPv4", (inst, def) => {
      def.pattern ?? (def.pattern = ipv4), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.format = "ipv4";
      });
    });
    var $ZodIPv6 = $constructor("$ZodIPv6", (inst, def) => {
      def.pattern ?? (def.pattern = ipv6), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
        let bag = inst2._zod.bag;
        bag.format = "ipv6";
      }), inst._zod.check = (payload) => {
        try {
          new URL(`http://[${payload.value}]`);
        } catch {
          payload.issues.push({ code: "invalid_format", format: "ipv6", input: payload.value, inst, continue: !def.abort });
        }
      };
    });
    var $ZodCIDRv4 = $constructor("$ZodCIDRv4", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv4), $ZodStringFormat.init(inst, def);
    });
    var $ZodCIDRv6 = $constructor("$ZodCIDRv6", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv6), $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
        let parts = payload.value.split("/");
        try {
          if (parts.length !== 2) throw new Error();
          let [address, prefix] = parts;
          if (!prefix) throw new Error();
          let prefixNum = Number(prefix);
          if (`${prefixNum}` !== prefix) throw new Error();
          if (prefixNum < 0 || prefixNum > 128) throw new Error();
          new URL(`http://[${address}]`);
        } catch {
          payload.issues.push({ code: "invalid_format", format: "cidrv6", input: payload.value, inst, continue: !def.abort });
        }
      };
    });
    function isValidBase64(data) {
      if (data === "") return true;
      if (data.length % 4 !== 0) return false;
      try {
        return atob(data), true;
      } catch {
        return false;
      }
    }
    __name(isValidBase64, "isValidBase64");
    var $ZodBase64 = $constructor("$ZodBase64", (inst, def) => {
      def.pattern ?? (def.pattern = base64), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.contentEncoding = "base64";
      }), inst._zod.check = (payload) => {
        isValidBase64(payload.value) || payload.issues.push({ code: "invalid_format", format: "base64", input: payload.value, inst, continue: !def.abort });
      };
    });
    function isValidBase64URL(data) {
      if (!base64url.test(data)) return false;
      let base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
      return isValidBase64(padded);
    }
    __name(isValidBase64URL, "isValidBase64URL");
    var $ZodBase64URL = $constructor("$ZodBase64URL", (inst, def) => {
      def.pattern ?? (def.pattern = base64url), $ZodStringFormat.init(inst, def), inst._zod.onattach.push((inst2) => {
        inst2._zod.bag.contentEncoding = "base64url";
      }), inst._zod.check = (payload) => {
        isValidBase64URL(payload.value) || payload.issues.push({ code: "invalid_format", format: "base64url", input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodE164 = $constructor("$ZodE164", (inst, def) => {
      def.pattern ?? (def.pattern = e164), $ZodStringFormat.init(inst, def);
    });
    function isValidJWT(token, algorithm = null) {
      try {
        let tokensParts = token.split(".");
        if (tokensParts.length !== 3) return false;
        let [header] = tokensParts;
        if (!header) return false;
        let parsedHeader = JSON.parse(atob(header));
        return !("typ" in parsedHeader && parsedHeader?.typ !== "JWT" || !parsedHeader.alg || algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm));
      } catch {
        return false;
      }
    }
    __name(isValidJWT, "isValidJWT");
    var $ZodJWT = $constructor("$ZodJWT", (inst, def) => {
      $ZodStringFormat.init(inst, def), inst._zod.check = (payload) => {
        isValidJWT(payload.value, def.alg) || payload.issues.push({ code: "invalid_format", format: "jwt", input: payload.value, inst, continue: !def.abort });
      };
    });
    var $ZodNumber = $constructor("$ZodNumber", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.pattern = inst._zod.bag.pattern ?? number, inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) try {
          payload.value = Number(payload.value);
        } catch {
        }
        let input = payload.value;
        if (typeof input == "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
        let received = typeof input == "number" ? Number.isNaN(input) ? "NaN" : Number.isFinite(input) ? void 0 : "Infinity" : void 0;
        return payload.issues.push({ expected: "number", code: "invalid_type", input, inst, ...received ? { received } : {} }), payload;
      };
    });
    var $ZodNumberFormat = $constructor("$ZodNumber", (inst, def) => {
      $ZodCheckNumberFormat.init(inst, def), $ZodNumber.init(inst, def);
    });
    var $ZodBoolean = $constructor("$ZodBoolean", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.pattern = boolean, inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) try {
          payload.value = !!payload.value;
        } catch {
        }
        let input = payload.value;
        return typeof input == "boolean" || payload.issues.push({ expected: "boolean", code: "invalid_type", input, inst }), payload;
      };
    });
    var $ZodUnknown = $constructor("$ZodUnknown", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.parse = (payload) => payload;
    });
    var $ZodNever = $constructor("$ZodNever", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => (payload.issues.push({ expected: "never", code: "invalid_type", input: payload.value, inst }), payload);
    });
    function handleArrayResult(result, final, index) {
      result.issues.length && final.issues.push(...prefixIssues(index, result.issues)), final.value[index] = result.value;
    }
    __name(handleArrayResult, "handleArrayResult");
    var $ZodArray = $constructor("$ZodArray", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
        let input = payload.value;
        if (!Array.isArray(input)) return payload.issues.push({ expected: "array", code: "invalid_type", input, inst }), payload;
        payload.value = Array(input.length);
        let proms = [];
        for (let i = 0; i < input.length; i++) {
          let item = input[i], result = def.element._zod.run({ value: item, issues: [] }, ctx);
          result instanceof Promise ? proms.push(result.then((result2) => handleArrayResult(result2, payload, i))) : handleArrayResult(result, payload, i);
        }
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      };
    });
    function handlePropertyResult(result, final, key, input) {
      result.issues.length && final.issues.push(...prefixIssues(key, result.issues)), result.value === void 0 ? key in input && (final.value[key] = void 0) : final.value[key] = result.value;
    }
    __name(handlePropertyResult, "handlePropertyResult");
    function normalizeDef(def) {
      let keys = Object.keys(def.shape);
      for (let k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
      let okeys = optionalKeys(def.shape);
      return { ...def, keys, keySet: new Set(keys), numKeys: keys.length, optionalKeys: new Set(okeys) };
    }
    __name(normalizeDef, "normalizeDef");
    function handleCatchall(proms, input, payload, ctx, def, inst) {
      let unrecognized = [], keySet = def.keySet, _catchall = def.catchall._zod, t = _catchall.def.type;
      for (let key of Object.keys(input)) {
        if (keySet.has(key)) continue;
        if (t === "never") {
          unrecognized.push(key);
          continue;
        }
        let r = _catchall.run({ value: input[key], issues: [] }, ctx);
        r instanceof Promise ? proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input))) : handlePropertyResult(r, payload, key, input);
      }
      return unrecognized.length && payload.issues.push({ code: "unrecognized_keys", keys: unrecognized, input, inst }), proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    __name(handleCatchall, "handleCatchall");
    var $ZodObject = $constructor("$ZodObject", (inst, def) => {
      if ($ZodType.init(inst, def), !Object.getOwnPropertyDescriptor(def, "shape")?.get) {
        let sh = def.shape;
        Object.defineProperty(def, "shape", { get: /* @__PURE__ */ __name(() => {
          let newSh = { ...sh };
          return Object.defineProperty(def, "shape", { value: newSh }), newSh;
        }, "get") });
      }
      let _normalized = cached(() => normalizeDef(def));
      defineLazy(inst._zod, "propValues", () => {
        let shape = def.shape, propValues = {};
        for (let key in shape) {
          let field = shape[key]._zod;
          if (field.values) {
            propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
            for (let v of field.values) propValues[key].add(v);
          }
        }
        return propValues;
      });
      let isObject2 = isObject, catchall = def.catchall, value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        let input = payload.value;
        if (!isObject2(input)) return payload.issues.push({ expected: "object", code: "invalid_type", input, inst }), payload;
        payload.value = {};
        let proms = [], shape = value.shape;
        for (let key of value.keys) {
          let r = shape[key]._zod.run({ value: input[key], issues: [] }, ctx);
          r instanceof Promise ? proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input))) : handlePropertyResult(r, payload, key, input);
        }
        return catchall ? handleCatchall(proms, input, payload, ctx, _normalized.value, inst) : proms.length ? Promise.all(proms).then(() => payload) : payload;
      };
    });
    var $ZodObjectJIT = $constructor("$ZodObjectJIT", (inst, def) => {
      $ZodObject.init(inst, def);
      let superParse = inst._zod.parse, _normalized = cached(() => normalizeDef(def)), generateFastpass = /* @__PURE__ */ __name((shape) => {
        let doc = new Doc(["shape", "payload", "ctx"]), normalized = _normalized.value, parseStr = /* @__PURE__ */ __name((key) => {
          let k = esc(key);
          return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        }, "parseStr");
        doc.write("const input = payload.value;");
        let ids = /* @__PURE__ */ Object.create(null), counter = 0;
        for (let key of normalized.keys) ids[key] = `key_${counter++}`;
        doc.write("const newResult = {};");
        for (let key of normalized.keys) {
          let id = ids[key], k = esc(key);
          doc.write(`const ${id} = ${parseStr(key)};`), doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
        }
        doc.write("payload.value = newResult;"), doc.write("return payload;");
        let fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
      }, "generateFastpass"), fastpass, isObject2 = isObject, jit = !globalConfig.jitless, fastEnabled = jit && allowsEval.value, catchall = def.catchall, value;
      inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        let input = payload.value;
        return isObject2(input) ? jit && fastEnabled && ctx?.async === false && ctx.jitless !== true ? (fastpass || (fastpass = generateFastpass(def.shape)), payload = fastpass(payload, ctx), catchall ? handleCatchall([], input, payload, ctx, value, inst) : payload) : superParse(payload, ctx) : (payload.issues.push({ expected: "object", code: "invalid_type", input, inst }), payload);
      };
    });
    function handleUnionResults(results, final, inst, ctx) {
      for (let result of results) if (result.issues.length === 0) return final.value = result.value, final;
      let nonaborted = results.filter((r) => !aborted(r));
      return nonaborted.length === 1 ? (final.value = nonaborted[0].value, nonaborted[0]) : (final.issues.push({ code: "invalid_union", input: final.value, inst, errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))) }), final);
    }
    __name(handleUnionResults, "handleUnionResults");
    var $ZodUnion = $constructor("$ZodUnion", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0), defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0), defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
      }), defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
          let patterns = def.options.map((o) => o._zod.pattern);
          return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
        }
      });
      let single = def.options.length === 1, first = def.options[0]._zod.run;
      inst._zod.parse = (payload, ctx) => {
        if (single) return first(payload, ctx);
        let async = false, results = [];
        for (let option of def.options) {
          let result = option._zod.run({ value: payload.value, issues: [] }, ctx);
          if (result instanceof Promise) results.push(result), async = true;
          else {
            if (result.issues.length === 0) return result;
            results.push(result);
          }
        }
        return async ? Promise.all(results).then((results2) => handleUnionResults(results2, payload, inst, ctx)) : handleUnionResults(results, payload, inst, ctx);
      };
    });
    var $ZodIntersection = $constructor("$ZodIntersection", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
        let input = payload.value, left = def.left._zod.run({ value: input, issues: [] }, ctx), right = def.right._zod.run({ value: input, issues: [] }, ctx);
        return left instanceof Promise || right instanceof Promise ? Promise.all([left, right]).then(([left2, right2]) => handleIntersectionResults(payload, left2, right2)) : handleIntersectionResults(payload, left, right);
      };
    });
    function mergeValues(a, b) {
      if (a === b) return { valid: true, data: a };
      if (a instanceof Date && b instanceof Date && +a == +b) return { valid: true, data: a };
      if (isPlainObject(a) && isPlainObject(b)) {
        let bKeys = Object.keys(b), sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1), newObj = { ...a, ...b };
        for (let key of sharedKeys) {
          let sharedValue = mergeValues(a[key], b[key]);
          if (!sharedValue.valid) return { valid: false, mergeErrorPath: [key, ...sharedValue.mergeErrorPath] };
          newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
      }
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return { valid: false, mergeErrorPath: [] };
        let newArray = [];
        for (let index = 0; index < a.length; index++) {
          let itemA = a[index], itemB = b[index], sharedValue = mergeValues(itemA, itemB);
          if (!sharedValue.valid) return { valid: false, mergeErrorPath: [index, ...sharedValue.mergeErrorPath] };
          newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
      }
      return { valid: false, mergeErrorPath: [] };
    }
    __name(mergeValues, "mergeValues");
    function handleIntersectionResults(result, left, right) {
      if (left.issues.length && result.issues.push(...left.issues), right.issues.length && result.issues.push(...right.issues), aborted(result)) return result;
      let merged = mergeValues(left.value, right.value);
      if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
      return result.value = merged.data, result;
    }
    __name(handleIntersectionResults, "handleIntersectionResults");
    var $ZodEnum = $constructor("$ZodEnum", (inst, def) => {
      $ZodType.init(inst, def);
      let values = getEnumValues(def.entries), valuesSet = new Set(values);
      inst._zod.values = valuesSet, inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o == "string" ? escapeRegex(o) : o.toString()).join("|")})$`), inst._zod.parse = (payload, _ctx) => {
        let input = payload.value;
        return valuesSet.has(input) || payload.issues.push({ code: "invalid_value", values, input, inst }), payload;
      };
    });
    var $ZodLiteral = $constructor("$ZodLiteral", (inst, def) => {
      if ($ZodType.init(inst, def), def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
      inst._zod.values = new Set(def.values), inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o == "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`), inst._zod.parse = (payload, _ctx) => {
        let input = payload.value;
        return inst._zod.values.has(input) || payload.issues.push({ code: "invalid_value", values: def.values, input, inst }), payload;
      };
    });
    var $ZodTransform = $constructor("$ZodTransform", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
        let _out = def.transform(payload.value, payload);
        if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output2) => (payload.value = output2, payload));
        if (_out instanceof Promise) throw new $ZodAsyncError();
        return payload.value = _out, payload;
      };
    });
    function handleOptionalResult(result, input) {
      return result.issues.length && input === void 0 ? { issues: [], value: void 0 } : result;
    }
    __name(handleOptionalResult, "handleOptionalResult");
    var $ZodOptional = $constructor("$ZodOptional", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.optin = "optional", inst._zod.optout = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0), defineLazy(inst._zod, "pattern", () => {
        let pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
      }), inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
          let result = def.innerType._zod.run(payload, ctx);
          return result instanceof Promise ? result.then((r) => handleOptionalResult(r, payload.value)) : handleOptionalResult(result, payload.value);
        }
        return payload.value === void 0 ? payload : def.innerType._zod.run(payload, ctx);
      };
    });
    var $ZodNullable = $constructor("$ZodNullable", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "pattern", () => {
        let pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
      }), defineLazy(inst._zod, "values", () => def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0), inst._zod.parse = (payload, ctx) => payload.value === null ? payload : def.innerType._zod.run(payload, ctx);
    });
    var $ZodDefault = $constructor("$ZodDefault", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        if (payload.value === void 0) return payload.value = def.defaultValue, payload;
        let result = def.innerType._zod.run(payload, ctx);
        return result instanceof Promise ? result.then((result2) => handleDefaultResult(result2, def)) : handleDefaultResult(result, def);
      };
    });
    function handleDefaultResult(payload, def) {
      return payload.value === void 0 && (payload.value = def.defaultValue), payload;
    }
    __name(handleDefaultResult, "handleDefaultResult");
    var $ZodPrefault = $constructor("$ZodPrefault", (inst, def) => {
      $ZodType.init(inst, def), inst._zod.optin = "optional", defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => (ctx.direction === "backward" || payload.value === void 0 && (payload.value = def.defaultValue), def.innerType._zod.run(payload, ctx));
    });
    var $ZodNonOptional = $constructor("$ZodNonOptional", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => {
        let v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
      }), inst._zod.parse = (payload, ctx) => {
        let result = def.innerType._zod.run(payload, ctx);
        return result instanceof Promise ? result.then((result2) => handleNonOptionalResult(result2, inst)) : handleNonOptionalResult(result, inst);
      };
    });
    function handleNonOptionalResult(payload, inst) {
      return !payload.issues.length && payload.value === void 0 && payload.issues.push({ code: "invalid_type", expected: "nonoptional", input: payload.value, inst }), payload;
    }
    __name(handleNonOptionalResult, "handleNonOptionalResult");
    var $ZodCatch = $constructor("$ZodCatch", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), defineLazy(inst._zod, "values", () => def.innerType._zod.values), inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        let result = def.innerType._zod.run(payload, ctx);
        return result instanceof Promise ? result.then((result2) => (payload.value = result2.value, result2.issues.length && (payload.value = def.catchValue({ ...payload, error: { issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config())) }, input: payload.value }), payload.issues = []), payload)) : (payload.value = result.value, result.issues.length && (payload.value = def.catchValue({ ...payload, error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) }, input: payload.value }), payload.issues = []), payload);
      };
    });
    var $ZodPipe = $constructor("$ZodPipe", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "values", () => def.in._zod.values), defineLazy(inst._zod, "optin", () => def.in._zod.optin), defineLazy(inst._zod, "optout", () => def.out._zod.optout), defineLazy(inst._zod, "propValues", () => def.in._zod.propValues), inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          let right = def.out._zod.run(payload, ctx);
          return right instanceof Promise ? right.then((right2) => handlePipeResult(right2, def.in, ctx)) : handlePipeResult(right, def.in, ctx);
        }
        let left = def.in._zod.run(payload, ctx);
        return left instanceof Promise ? left.then((left2) => handlePipeResult(left2, def.out, ctx)) : handlePipeResult(left, def.out, ctx);
      };
    });
    function handlePipeResult(left, next, ctx) {
      return left.issues.length ? (left.aborted = true, left) : next._zod.run({ value: left.value, issues: left.issues }, ctx);
    }
    __name(handlePipeResult, "handlePipeResult");
    var $ZodReadonly = $constructor("$ZodReadonly", (inst, def) => {
      $ZodType.init(inst, def), defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues), defineLazy(inst._zod, "values", () => def.innerType._zod.values), defineLazy(inst._zod, "optin", () => def.innerType._zod.optin), defineLazy(inst._zod, "optout", () => def.innerType._zod.optout), inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
        let result = def.innerType._zod.run(payload, ctx);
        return result instanceof Promise ? result.then(handleReadonlyResult) : handleReadonlyResult(result);
      };
    });
    function handleReadonlyResult(payload) {
      return payload.value = Object.freeze(payload.value), payload;
    }
    __name(handleReadonlyResult, "handleReadonlyResult");
    var $ZodCustom = $constructor("$ZodCustom", (inst, def) => {
      $ZodCheck.init(inst, def), $ZodType.init(inst, def), inst._zod.parse = (payload, _) => payload, inst._zod.check = (payload) => {
        let input = payload.value, r = def.fn(input);
        if (r instanceof Promise) return r.then((r2) => handleRefineResult(r2, payload, input, inst));
        handleRefineResult(r, payload, input, inst);
      };
    });
    function handleRefineResult(result, payload, input, inst) {
      if (!result) {
        let _iss = { code: "custom", input, inst, path: [...inst._zod.def.path ?? []], continue: !inst._zod.def.abort };
        inst._zod.def.params && (_iss.params = inst._zod.def.params), payload.issues.push(issue(_iss));
      }
    }
    __name(handleRefineResult, "handleRefineResult");
    var $output = Symbol("ZodOutput");
    var $input = Symbol("ZodInput");
    var $ZodRegistry = class {
      static {
        __name(this, "$ZodRegistry");
      }
      constructor() {
        this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
      }
      add(schema, ..._meta) {
        let meta = _meta[0];
        if (this._map.set(schema, meta), meta && typeof meta == "object" && "id" in meta) {
          if (this._idmap.has(meta.id)) throw new Error(`ID ${meta.id} already exists in the registry`);
          this._idmap.set(meta.id, schema);
        }
        return this;
      }
      clear() {
        return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
      }
      remove(schema) {
        let meta = this._map.get(schema);
        return meta && typeof meta == "object" && "id" in meta && this._idmap.delete(meta.id), this._map.delete(schema), this;
      }
      get(schema) {
        let p = schema._zod.parent;
        if (p) {
          let pm = { ...this.get(p) ?? {} };
          delete pm.id;
          let f = { ...pm, ...this._map.get(schema) };
          return Object.keys(f).length ? f : void 0;
        }
        return this._map.get(schema);
      }
      has(schema) {
        return this._map.has(schema);
      }
    };
    function registry() {
      return new $ZodRegistry();
    }
    __name(registry, "registry");
    var globalRegistry = registry();
    function _string(Class2, params) {
      return new Class2({ type: "string", ...normalizeParams(params) });
    }
    __name(_string, "_string");
    function _email(Class2, params) {
      return new Class2({ type: "string", format: "email", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_email, "_email");
    function _guid(Class2, params) {
      return new Class2({ type: "string", format: "guid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_guid, "_guid");
    function _uuid(Class2, params) {
      return new Class2({ type: "string", format: "uuid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_uuid, "_uuid");
    function _uuidv4(Class2, params) {
      return new Class2({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v4", ...normalizeParams(params) });
    }
    __name(_uuidv4, "_uuidv4");
    function _uuidv6(Class2, params) {
      return new Class2({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v6", ...normalizeParams(params) });
    }
    __name(_uuidv6, "_uuidv6");
    function _uuidv7(Class2, params) {
      return new Class2({ type: "string", format: "uuid", check: "string_format", abort: false, version: "v7", ...normalizeParams(params) });
    }
    __name(_uuidv7, "_uuidv7");
    function _url(Class2, params) {
      return new Class2({ type: "string", format: "url", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_url, "_url");
    function _emoji2(Class2, params) {
      return new Class2({ type: "string", format: "emoji", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_emoji2, "_emoji2");
    function _nanoid(Class2, params) {
      return new Class2({ type: "string", format: "nanoid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_nanoid, "_nanoid");
    function _cuid(Class2, params) {
      return new Class2({ type: "string", format: "cuid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_cuid, "_cuid");
    function _cuid2(Class2, params) {
      return new Class2({ type: "string", format: "cuid2", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_cuid2, "_cuid2");
    function _ulid(Class2, params) {
      return new Class2({ type: "string", format: "ulid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_ulid, "_ulid");
    function _xid(Class2, params) {
      return new Class2({ type: "string", format: "xid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_xid, "_xid");
    function _ksuid(Class2, params) {
      return new Class2({ type: "string", format: "ksuid", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_ksuid, "_ksuid");
    function _ipv4(Class2, params) {
      return new Class2({ type: "string", format: "ipv4", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_ipv4, "_ipv4");
    function _ipv6(Class2, params) {
      return new Class2({ type: "string", format: "ipv6", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_ipv6, "_ipv6");
    function _cidrv4(Class2, params) {
      return new Class2({ type: "string", format: "cidrv4", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_cidrv4, "_cidrv4");
    function _cidrv6(Class2, params) {
      return new Class2({ type: "string", format: "cidrv6", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_cidrv6, "_cidrv6");
    function _base64(Class2, params) {
      return new Class2({ type: "string", format: "base64", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_base64, "_base64");
    function _base64url(Class2, params) {
      return new Class2({ type: "string", format: "base64url", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_base64url, "_base64url");
    function _e164(Class2, params) {
      return new Class2({ type: "string", format: "e164", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_e164, "_e164");
    function _jwt(Class2, params) {
      return new Class2({ type: "string", format: "jwt", check: "string_format", abort: false, ...normalizeParams(params) });
    }
    __name(_jwt, "_jwt");
    function _isoDateTime(Class2, params) {
      return new Class2({ type: "string", format: "datetime", check: "string_format", offset: false, local: false, precision: null, ...normalizeParams(params) });
    }
    __name(_isoDateTime, "_isoDateTime");
    function _isoDate(Class2, params) {
      return new Class2({ type: "string", format: "date", check: "string_format", ...normalizeParams(params) });
    }
    __name(_isoDate, "_isoDate");
    function _isoTime(Class2, params) {
      return new Class2({ type: "string", format: "time", check: "string_format", precision: null, ...normalizeParams(params) });
    }
    __name(_isoTime, "_isoTime");
    function _isoDuration(Class2, params) {
      return new Class2({ type: "string", format: "duration", check: "string_format", ...normalizeParams(params) });
    }
    __name(_isoDuration, "_isoDuration");
    function _number(Class2, params) {
      return new Class2({ type: "number", checks: [], ...normalizeParams(params) });
    }
    __name(_number, "_number");
    function _int(Class2, params) {
      return new Class2({ type: "number", check: "number_format", abort: false, format: "safeint", ...normalizeParams(params) });
    }
    __name(_int, "_int");
    function _boolean(Class2, params) {
      return new Class2({ type: "boolean", ...normalizeParams(params) });
    }
    __name(_boolean, "_boolean");
    function _unknown(Class2) {
      return new Class2({ type: "unknown" });
    }
    __name(_unknown, "_unknown");
    function _never(Class2, params) {
      return new Class2({ type: "never", ...normalizeParams(params) });
    }
    __name(_never, "_never");
    function _lt(value, params) {
      return new $ZodCheckLessThan({ check: "less_than", ...normalizeParams(params), value, inclusive: false });
    }
    __name(_lt, "_lt");
    function _lte(value, params) {
      return new $ZodCheckLessThan({ check: "less_than", ...normalizeParams(params), value, inclusive: true });
    }
    __name(_lte, "_lte");
    function _gt(value, params) {
      return new $ZodCheckGreaterThan({ check: "greater_than", ...normalizeParams(params), value, inclusive: false });
    }
    __name(_gt, "_gt");
    function _gte(value, params) {
      return new $ZodCheckGreaterThan({ check: "greater_than", ...normalizeParams(params), value, inclusive: true });
    }
    __name(_gte, "_gte");
    function _multipleOf(value, params) {
      return new $ZodCheckMultipleOf({ check: "multiple_of", ...normalizeParams(params), value });
    }
    __name(_multipleOf, "_multipleOf");
    function _maxLength(maximum, params) {
      return new $ZodCheckMaxLength({ check: "max_length", ...normalizeParams(params), maximum });
    }
    __name(_maxLength, "_maxLength");
    function _minLength(minimum, params) {
      return new $ZodCheckMinLength({ check: "min_length", ...normalizeParams(params), minimum });
    }
    __name(_minLength, "_minLength");
    function _length(length, params) {
      return new $ZodCheckLengthEquals({ check: "length_equals", ...normalizeParams(params), length });
    }
    __name(_length, "_length");
    function _regex(pattern, params) {
      return new $ZodCheckRegex({ check: "string_format", format: "regex", ...normalizeParams(params), pattern });
    }
    __name(_regex, "_regex");
    function _lowercase(params) {
      return new $ZodCheckLowerCase({ check: "string_format", format: "lowercase", ...normalizeParams(params) });
    }
    __name(_lowercase, "_lowercase");
    function _uppercase(params) {
      return new $ZodCheckUpperCase({ check: "string_format", format: "uppercase", ...normalizeParams(params) });
    }
    __name(_uppercase, "_uppercase");
    function _includes(includes, params) {
      return new $ZodCheckIncludes({ check: "string_format", format: "includes", ...normalizeParams(params), includes });
    }
    __name(_includes, "_includes");
    function _startsWith(prefix, params) {
      return new $ZodCheckStartsWith({ check: "string_format", format: "starts_with", ...normalizeParams(params), prefix });
    }
    __name(_startsWith, "_startsWith");
    function _endsWith(suffix, params) {
      return new $ZodCheckEndsWith({ check: "string_format", format: "ends_with", ...normalizeParams(params), suffix });
    }
    __name(_endsWith, "_endsWith");
    function _overwrite(tx) {
      return new $ZodCheckOverwrite({ check: "overwrite", tx });
    }
    __name(_overwrite, "_overwrite");
    function _normalize(form) {
      return _overwrite((input) => input.normalize(form));
    }
    __name(_normalize, "_normalize");
    function _trim() {
      return _overwrite((input) => input.trim());
    }
    __name(_trim, "_trim");
    function _toLowerCase() {
      return _overwrite((input) => input.toLowerCase());
    }
    __name(_toLowerCase, "_toLowerCase");
    function _toUpperCase() {
      return _overwrite((input) => input.toUpperCase());
    }
    __name(_toUpperCase, "_toUpperCase");
    function _array(Class2, element, params) {
      return new Class2({ type: "array", element, ...normalizeParams(params) });
    }
    __name(_array, "_array");
    function _refine(Class2, fn, _params) {
      return new Class2({ type: "custom", check: "custom", fn, ...normalizeParams(_params) });
    }
    __name(_refine, "_refine");
    function _superRefine(fn) {
      let ch = _check((payload) => (payload.addIssue = (issue2) => {
        if (typeof issue2 == "string") payload.issues.push(issue(issue2, payload.value, ch._zod.def));
        else {
          let _issue = issue2;
          _issue.fatal && (_issue.continue = false), _issue.code ?? (_issue.code = "custom"), _issue.input ?? (_issue.input = payload.value), _issue.inst ?? (_issue.inst = ch), _issue.continue ?? (_issue.continue = !ch._zod.def.abort), payload.issues.push(issue(_issue));
        }
      }, fn(payload.value, payload)));
      return ch;
    }
    __name(_superRefine, "_superRefine");
    function _check(fn, params) {
      let ch = new $ZodCheck({ check: "custom", ...normalizeParams(params) });
      return ch._zod.check = fn, ch;
    }
    __name(_check, "_check");
    var ZodISODateTime = $constructor("ZodISODateTime", (inst, def) => {
      $ZodISODateTime.init(inst, def), ZodStringFormat.init(inst, def);
    });
    function datetime2(params) {
      return _isoDateTime(ZodISODateTime, params);
    }
    __name(datetime2, "datetime2");
    var ZodISODate = $constructor("ZodISODate", (inst, def) => {
      $ZodISODate.init(inst, def), ZodStringFormat.init(inst, def);
    });
    function date2(params) {
      return _isoDate(ZodISODate, params);
    }
    __name(date2, "date2");
    var ZodISOTime = $constructor("ZodISOTime", (inst, def) => {
      $ZodISOTime.init(inst, def), ZodStringFormat.init(inst, def);
    });
    function time2(params) {
      return _isoTime(ZodISOTime, params);
    }
    __name(time2, "time2");
    var ZodISODuration = $constructor("ZodISODuration", (inst, def) => {
      $ZodISODuration.init(inst, def), ZodStringFormat.init(inst, def);
    });
    function duration2(params) {
      return _isoDuration(ZodISODuration, params);
    }
    __name(duration2, "duration2");
    var initializer2 = /* @__PURE__ */ __name((inst, issues) => {
      $ZodError.init(inst, issues), inst.name = "ZodError", Object.defineProperties(inst, { format: { value: /* @__PURE__ */ __name((mapper) => formatError(inst, mapper), "value") }, flatten: { value: /* @__PURE__ */ __name((mapper) => flattenError(inst, mapper), "value") }, addIssue: { value: /* @__PURE__ */ __name((issue2) => {
        inst.issues.push(issue2), inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value") }, addIssues: { value: /* @__PURE__ */ __name((issues2) => {
        inst.issues.push(...issues2), inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
      }, "value") }, isEmpty: { get() {
        return inst.issues.length === 0;
      } } });
    }, "initializer2");
    var ZodError = $constructor("ZodError", initializer2);
    var ZodRealError = $constructor("ZodError", initializer2, { Parent: Error });
    var parse2 = _parse(ZodRealError);
    var parseAsync2 = _parseAsync(ZodRealError);
    var safeParse2 = _safeParse(ZodRealError);
    var safeParseAsync2 = _safeParseAsync(ZodRealError);
    var encode = _encode(ZodRealError);
    var decode = _decode(ZodRealError);
    var encodeAsync = _encodeAsync(ZodRealError);
    var decodeAsync = _decodeAsync(ZodRealError);
    var safeEncode = _safeEncode(ZodRealError);
    var safeDecode = _safeDecode(ZodRealError);
    var safeEncodeAsync = _safeEncodeAsync(ZodRealError);
    var safeDecodeAsync = _safeDecodeAsync(ZodRealError);
    var ZodType = $constructor("ZodType", (inst, def) => ($ZodType.init(inst, def), inst.def = def, inst.type = def.type, Object.defineProperty(inst, "_def", { value: def }), inst.check = (...checks) => inst.clone(util_exports.mergeDefs(def, { checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch == "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)] })), inst.clone = (def2, params) => clone(inst, def2, params), inst.brand = () => inst, inst.register = (reg, meta) => (reg.add(inst, meta), inst), inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse }), inst.safeParse = (data, params) => safeParse2(inst, data, params), inst.parseAsync = async (data, params) => parseAsync2(inst, data, params, { callee: inst.parseAsync }), inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params), inst.spa = inst.safeParseAsync, inst.encode = (data, params) => encode(inst, data, params), inst.decode = (data, params) => decode(inst, data, params), inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params), inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params), inst.safeEncode = (data, params) => safeEncode(inst, data, params), inst.safeDecode = (data, params) => safeDecode(inst, data, params), inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params), inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params), inst.refine = (check, params) => inst.check(refine(check, params)), inst.superRefine = (refinement) => inst.check(superRefine(refinement)), inst.overwrite = (fn) => inst.check(_overwrite(fn)), inst.optional = () => optional(inst), inst.nullable = () => nullable(inst), inst.nullish = () => optional(nullable(inst)), inst.nonoptional = (params) => nonoptional(inst, params), inst.array = () => array(inst), inst.or = (arg) => union([inst, arg]), inst.and = (arg) => intersection(inst, arg), inst.transform = (tx) => pipe(inst, transform(tx)), inst.default = (def2) => _default(inst, def2), inst.prefault = (def2) => prefault(inst, def2), inst.catch = (params) => _catch(inst, params), inst.pipe = (target) => pipe(inst, target), inst.readonly = () => readonly(inst), inst.describe = (description) => {
      let cl = inst.clone();
      return globalRegistry.add(cl, { description }), cl;
    }, Object.defineProperty(inst, "description", { get() {
      return globalRegistry.get(inst)?.description;
    }, configurable: true }), inst.meta = (...args) => {
      if (args.length === 0) return globalRegistry.get(inst);
      let cl = inst.clone();
      return globalRegistry.add(cl, args[0]), cl;
    }, inst.isOptional = () => inst.safeParse(void 0).success, inst.isNullable = () => inst.safeParse(null).success, inst));
    var _ZodString = $constructor("_ZodString", (inst, def) => {
      $ZodString.init(inst, def), ZodType.init(inst, def);
      let bag = inst._zod.bag;
      inst.format = bag.format ?? null, inst.minLength = bag.minimum ?? null, inst.maxLength = bag.maximum ?? null, inst.regex = (...args) => inst.check(_regex(...args)), inst.includes = (...args) => inst.check(_includes(...args)), inst.startsWith = (...args) => inst.check(_startsWith(...args)), inst.endsWith = (...args) => inst.check(_endsWith(...args)), inst.min = (...args) => inst.check(_minLength(...args)), inst.max = (...args) => inst.check(_maxLength(...args)), inst.length = (...args) => inst.check(_length(...args)), inst.nonempty = (...args) => inst.check(_minLength(1, ...args)), inst.lowercase = (params) => inst.check(_lowercase(params)), inst.uppercase = (params) => inst.check(_uppercase(params)), inst.trim = () => inst.check(_trim()), inst.normalize = (...args) => inst.check(_normalize(...args)), inst.toLowerCase = () => inst.check(_toLowerCase()), inst.toUpperCase = () => inst.check(_toUpperCase());
    });
    var ZodString = $constructor("ZodString", (inst, def) => {
      $ZodString.init(inst, def), _ZodString.init(inst, def), inst.email = (params) => inst.check(_email(ZodEmail, params)), inst.url = (params) => inst.check(_url(ZodURL, params)), inst.jwt = (params) => inst.check(_jwt(ZodJWT, params)), inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params)), inst.guid = (params) => inst.check(_guid(ZodGUID, params)), inst.uuid = (params) => inst.check(_uuid(ZodUUID, params)), inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params)), inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params)), inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params)), inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params)), inst.guid = (params) => inst.check(_guid(ZodGUID, params)), inst.cuid = (params) => inst.check(_cuid(ZodCUID, params)), inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params)), inst.ulid = (params) => inst.check(_ulid(ZodULID, params)), inst.base64 = (params) => inst.check(_base64(ZodBase64, params)), inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params)), inst.xid = (params) => inst.check(_xid(ZodXID, params)), inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params)), inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params)), inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params)), inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params)), inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params)), inst.e164 = (params) => inst.check(_e164(ZodE164, params)), inst.datetime = (params) => inst.check(datetime2(params)), inst.date = (params) => inst.check(date2(params)), inst.time = (params) => inst.check(time2(params)), inst.duration = (params) => inst.check(duration2(params));
    });
    function string2(params) {
      return _string(ZodString, params);
    }
    __name(string2, "string2");
    var ZodStringFormat = $constructor("ZodStringFormat", (inst, def) => {
      $ZodStringFormat.init(inst, def), _ZodString.init(inst, def);
    });
    var ZodEmail = $constructor("ZodEmail", (inst, def) => {
      $ZodEmail.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodGUID = $constructor("ZodGUID", (inst, def) => {
      $ZodGUID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodUUID = $constructor("ZodUUID", (inst, def) => {
      $ZodUUID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodURL = $constructor("ZodURL", (inst, def) => {
      $ZodURL.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodEmoji = $constructor("ZodEmoji", (inst, def) => {
      $ZodEmoji.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodNanoID = $constructor("ZodNanoID", (inst, def) => {
      $ZodNanoID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodCUID = $constructor("ZodCUID", (inst, def) => {
      $ZodCUID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodCUID2 = $constructor("ZodCUID2", (inst, def) => {
      $ZodCUID2.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodULID = $constructor("ZodULID", (inst, def) => {
      $ZodULID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodXID = $constructor("ZodXID", (inst, def) => {
      $ZodXID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodKSUID = $constructor("ZodKSUID", (inst, def) => {
      $ZodKSUID.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodIPv4 = $constructor("ZodIPv4", (inst, def) => {
      $ZodIPv4.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodIPv6 = $constructor("ZodIPv6", (inst, def) => {
      $ZodIPv6.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodCIDRv4 = $constructor("ZodCIDRv4", (inst, def) => {
      $ZodCIDRv4.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodCIDRv6 = $constructor("ZodCIDRv6", (inst, def) => {
      $ZodCIDRv6.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodBase64 = $constructor("ZodBase64", (inst, def) => {
      $ZodBase64.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodBase64URL = $constructor("ZodBase64URL", (inst, def) => {
      $ZodBase64URL.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodE164 = $constructor("ZodE164", (inst, def) => {
      $ZodE164.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodJWT = $constructor("ZodJWT", (inst, def) => {
      $ZodJWT.init(inst, def), ZodStringFormat.init(inst, def);
    });
    var ZodNumber = $constructor("ZodNumber", (inst, def) => {
      $ZodNumber.init(inst, def), ZodType.init(inst, def), inst.gt = (value, params) => inst.check(_gt(value, params)), inst.gte = (value, params) => inst.check(_gte(value, params)), inst.min = (value, params) => inst.check(_gte(value, params)), inst.lt = (value, params) => inst.check(_lt(value, params)), inst.lte = (value, params) => inst.check(_lte(value, params)), inst.max = (value, params) => inst.check(_lte(value, params)), inst.int = (params) => inst.check(int(params)), inst.safe = (params) => inst.check(int(params)), inst.positive = (params) => inst.check(_gt(0, params)), inst.nonnegative = (params) => inst.check(_gte(0, params)), inst.negative = (params) => inst.check(_lt(0, params)), inst.nonpositive = (params) => inst.check(_lte(0, params)), inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params)), inst.step = (value, params) => inst.check(_multipleOf(value, params)), inst.finite = () => inst;
      let bag = inst._zod.bag;
      inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null, inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null, inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5), inst.isFinite = true, inst.format = bag.format ?? null;
    });
    function number2(params) {
      return _number(ZodNumber, params);
    }
    __name(number2, "number2");
    var ZodNumberFormat = $constructor("ZodNumberFormat", (inst, def) => {
      $ZodNumberFormat.init(inst, def), ZodNumber.init(inst, def);
    });
    function int(params) {
      return _int(ZodNumberFormat, params);
    }
    __name(int, "int");
    var ZodBoolean = $constructor("ZodBoolean", (inst, def) => {
      $ZodBoolean.init(inst, def), ZodType.init(inst, def);
    });
    function boolean2(params) {
      return _boolean(ZodBoolean, params);
    }
    __name(boolean2, "boolean2");
    var ZodUnknown = $constructor("ZodUnknown", (inst, def) => {
      $ZodUnknown.init(inst, def), ZodType.init(inst, def);
    });
    function unknown() {
      return _unknown(ZodUnknown);
    }
    __name(unknown, "unknown");
    var ZodNever = $constructor("ZodNever", (inst, def) => {
      $ZodNever.init(inst, def), ZodType.init(inst, def);
    });
    function never(params) {
      return _never(ZodNever, params);
    }
    __name(never, "never");
    var ZodArray = $constructor("ZodArray", (inst, def) => {
      $ZodArray.init(inst, def), ZodType.init(inst, def), inst.element = def.element, inst.min = (minLength, params) => inst.check(_minLength(minLength, params)), inst.nonempty = (params) => inst.check(_minLength(1, params)), inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params)), inst.length = (len, params) => inst.check(_length(len, params)), inst.unwrap = () => inst.element;
    });
    function array(element, params) {
      return _array(ZodArray, element, params);
    }
    __name(array, "array");
    var ZodObject = $constructor("ZodObject", (inst, def) => {
      $ZodObjectJIT.init(inst, def), ZodType.init(inst, def), util_exports.defineLazy(inst, "shape", () => def.shape), inst.keyof = () => _enum(Object.keys(inst._zod.def.shape)), inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall }), inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() }), inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() }), inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() }), inst.strip = () => inst.clone({ ...inst._zod.def, catchall: void 0 }), inst.extend = (incoming) => util_exports.extend(inst, incoming), inst.safeExtend = (incoming) => util_exports.safeExtend(inst, incoming), inst.merge = (other) => util_exports.merge(inst, other), inst.pick = (mask) => util_exports.pick(inst, mask), inst.omit = (mask) => util_exports.omit(inst, mask), inst.partial = (...args) => util_exports.partial(ZodOptional, inst, args[0]), inst.required = (...args) => util_exports.required(ZodNonOptional, inst, args[0]);
    });
    function object(shape, params) {
      let def = { type: "object", shape: shape ?? {}, ...util_exports.normalizeParams(params) };
      return new ZodObject(def);
    }
    __name(object, "object");
    var ZodUnion = $constructor("ZodUnion", (inst, def) => {
      $ZodUnion.init(inst, def), ZodType.init(inst, def), inst.options = def.options;
    });
    function union(options, params) {
      return new ZodUnion({ type: "union", options, ...util_exports.normalizeParams(params) });
    }
    __name(union, "union");
    var ZodIntersection = $constructor("ZodIntersection", (inst, def) => {
      $ZodIntersection.init(inst, def), ZodType.init(inst, def);
    });
    function intersection(left, right) {
      return new ZodIntersection({ type: "intersection", left, right });
    }
    __name(intersection, "intersection");
    var ZodEnum = $constructor("ZodEnum", (inst, def) => {
      $ZodEnum.init(inst, def), ZodType.init(inst, def), inst.enum = def.entries, inst.options = Object.values(def.entries);
      let keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
        let newEntries = {};
        for (let value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
        else throw new Error(`Key ${value} not found in enum`);
        return new ZodEnum({ ...def, checks: [], ...util_exports.normalizeParams(params), entries: newEntries });
      }, inst.exclude = (values, params) => {
        let newEntries = { ...def.entries };
        for (let value of values) if (keys.has(value)) delete newEntries[value];
        else throw new Error(`Key ${value} not found in enum`);
        return new ZodEnum({ ...def, checks: [], ...util_exports.normalizeParams(params), entries: newEntries });
      };
    });
    function _enum(values, params) {
      let entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
      return new ZodEnum({ type: "enum", entries, ...util_exports.normalizeParams(params) });
    }
    __name(_enum, "_enum");
    var ZodLiteral = $constructor("ZodLiteral", (inst, def) => {
      $ZodLiteral.init(inst, def), ZodType.init(inst, def), inst.values = new Set(def.values), Object.defineProperty(inst, "value", { get() {
        if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
        return def.values[0];
      } });
    });
    function literal(value, params) {
      return new ZodLiteral({ type: "literal", values: Array.isArray(value) ? value : [value], ...util_exports.normalizeParams(params) });
    }
    __name(literal, "literal");
    var ZodTransform = $constructor("ZodTransform", (inst, def) => {
      $ZodTransform.init(inst, def), ZodType.init(inst, def), inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
        payload.addIssue = (issue2) => {
          if (typeof issue2 == "string") payload.issues.push(util_exports.issue(issue2, payload.value, def));
          else {
            let _issue = issue2;
            _issue.fatal && (_issue.continue = false), _issue.code ?? (_issue.code = "custom"), _issue.input ?? (_issue.input = payload.value), _issue.inst ?? (_issue.inst = inst), payload.issues.push(util_exports.issue(_issue));
          }
        };
        let output = def.transform(payload.value, payload);
        return output instanceof Promise ? output.then((output2) => (payload.value = output2, payload)) : (payload.value = output, payload);
      };
    });
    function transform(fn) {
      return new ZodTransform({ type: "transform", transform: fn });
    }
    __name(transform, "transform");
    var ZodOptional = $constructor("ZodOptional", (inst, def) => {
      $ZodOptional.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType;
    });
    function optional(innerType) {
      return new ZodOptional({ type: "optional", innerType });
    }
    __name(optional, "optional");
    var ZodNullable = $constructor("ZodNullable", (inst, def) => {
      $ZodNullable.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType;
    });
    function nullable(innerType) {
      return new ZodNullable({ type: "nullable", innerType });
    }
    __name(nullable, "nullable");
    var ZodDefault = $constructor("ZodDefault", (inst, def) => {
      $ZodDefault.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType, inst.removeDefault = inst.unwrap;
    });
    function _default(innerType, defaultValue) {
      return new ZodDefault({ type: "default", innerType, get defaultValue() {
        return typeof defaultValue == "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
      } });
    }
    __name(_default, "_default");
    var ZodPrefault = $constructor("ZodPrefault", (inst, def) => {
      $ZodPrefault.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType;
    });
    function prefault(innerType, defaultValue) {
      return new ZodPrefault({ type: "prefault", innerType, get defaultValue() {
        return typeof defaultValue == "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
      } });
    }
    __name(prefault, "prefault");
    var ZodNonOptional = $constructor("ZodNonOptional", (inst, def) => {
      $ZodNonOptional.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType;
    });
    function nonoptional(innerType, params) {
      return new ZodNonOptional({ type: "nonoptional", innerType, ...util_exports.normalizeParams(params) });
    }
    __name(nonoptional, "nonoptional");
    var ZodCatch = $constructor("ZodCatch", (inst, def) => {
      $ZodCatch.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType, inst.removeCatch = inst.unwrap;
    });
    function _catch(innerType, catchValue) {
      return new ZodCatch({ type: "catch", innerType, catchValue: typeof catchValue == "function" ? catchValue : () => catchValue });
    }
    __name(_catch, "_catch");
    var ZodPipe = $constructor("ZodPipe", (inst, def) => {
      $ZodPipe.init(inst, def), ZodType.init(inst, def), inst.in = def.in, inst.out = def.out;
    });
    function pipe(in_, out) {
      return new ZodPipe({ type: "pipe", in: in_, out });
    }
    __name(pipe, "pipe");
    var ZodReadonly = $constructor("ZodReadonly", (inst, def) => {
      $ZodReadonly.init(inst, def), ZodType.init(inst, def), inst.unwrap = () => inst._zod.def.innerType;
    });
    function readonly(innerType) {
      return new ZodReadonly({ type: "readonly", innerType });
    }
    __name(readonly, "readonly");
    var ZodCustom = $constructor("ZodCustom", (inst, def) => {
      $ZodCustom.init(inst, def), ZodType.init(inst, def);
    });
    function refine(fn, _params = {}) {
      return _refine(ZodCustom, fn, _params);
    }
    __name(refine, "refine");
    function superRefine(fn) {
      return _superRefine(fn);
    }
    __name(superRefine, "superRefine");
    var telemetryConfigSchema = object({ enabled: boolean2().optional() });
    var guidanceConfigSchema = object({ enabled: boolean2().optional() });
    var updatesConfigSchema = object({ auto: boolean2().optional(), bypassMinReleaseAge: boolean2().optional() });
    var credStorageSchema = union([literal("auto"), literal("file"), literal("keyring")]);
    var authConfigSchema = object({ "// Note": string2().optional(), "// Docs": string2().optional(), skipWrite: boolean2().optional(), token: string2().optional(), userId: string2().optional(), refreshToken: string2().optional(), expiresAt: number2().optional(), tokenSource: union([literal("flag"), literal("env")]).optional() });
    var authFileConfigSchema = authConfigSchema.omit({ tokenSource: true });
    var globalConfigSchema = object({ "// Note": string2().optional(), "// Docs": string2().optional(), credStorage: credStorageSchema.optional(), currentTeam: string2().optional(), api: string2().optional(), telemetry: telemetryConfigSchema.optional(), guidance: guidanceConfigSchema.optional(), updates: updatesConfigSchema.optional(), useNativeBinary: boolean2().optional(), nativeBinaryAutoOptIn: boolean2().optional() });
    function formatCredStorageError(value) {
      return `Invalid value for \`credStorage\`: ${JSON.stringify(value)}. Expected one of: ${CRED_STORAGE_CONFIG_VALUES.map((storage) => JSON.stringify(storage)).join(", ")}.`;
    }
    __name(formatCredStorageError, "formatCredStorageError");
    var telemetryConfigSchema2 = telemetryConfigSchema.passthrough();
    var guidanceConfigSchema2 = guidanceConfigSchema.passthrough();
    var updatesConfigSchema2 = updatesConfigSchema.passthrough();
    var credStorageSchema2 = _enum(CRED_STORAGE_CONFIG_VALUES, { error: /* @__PURE__ */ __name((issue2) => formatCredStorageError(issue2.input), "error") }).optional();
    var globalConfigSchema2 = globalConfigSchema.extend({ credStorage: credStorageSchema2, telemetry: telemetryConfigSchema2.optional(), guidance: guidanceConfigSchema2.optional(), updates: updatesConfigSchema2.optional() }).passthrough();
    var authConfigSchema2 = authConfigSchema.passthrough();
    var import_node_fs2 = __toESM(__require("fs"));
    var import_node_path2 = __toESM(__require("path"));
    var import_node_fs = __toESM(__require("fs"));
    var import_node_path = __toESM(__require("path"));
    var import_node_os = __require("os");
    function isReadableDirectory(targetPath) {
      try {
        return import_node_fs.default.lstatSync(targetPath).isDirectory();
      } catch {
        return false;
      }
    }
    __name(isReadableDirectory, "isReadableDirectory");
    function getAppPaths(appName) {
      return require_xdg_app_paths()(appName);
    }
    __name(getAppPaths, "getAppPaths");
    function getDataDirectories(appName) {
      return getAppPaths(appName).dataDirs();
    }
    __name(getDataDirectories, "getDataDirectories");
    function getDataPath() {
      return getDataDirectories("com.vercel.cli")[0];
    }
    __name(getDataPath, "getDataPath");
    function getCachePath() {
      return getAppPaths("com.vercel.cli").cache();
    }
    __name(getCachePath, "getCachePath");
    function getGlobalPathConfig() {
      let vercelDirectories = getDataDirectories("com.vercel.cli");
      return [...vercelDirectories, import_node_path.default.join((0, import_node_os.homedir)(), ".now"), ...getDataDirectories("now")].find((configPath) => isReadableDirectory(configPath)) || vercelDirectories[0];
    }
    __name(getGlobalPathConfig, "getGlobalPathConfig");
    function getConfigFilePath(configDir) {
      return import_node_path.default.join(configDir, "config.json");
    }
    __name(getConfigFilePath, "getConfigFilePath");
    function getAuthConfigFilePath(configDir) {
      return import_node_path.default.join(configDir, "auth.json");
    }
    __name(getAuthConfigFilePath, "getAuthConfigFilePath");
    var DOCS_URL = "https://vercel.com/docs/projects/project-configuration/global-configuration";
    var defaultGlobalConfig = { "// Note": "This is your Vercel config file. For more information see the global configuration documentation.", "// Docs": `${DOCS_URL}#config.json` };
    function getDefaultAuthConfig() {
      return { "// Note": "This is your Vercel credentials file. DO NOT SHARE!", "// Docs": `${DOCS_URL}#auth.json` };
    }
    __name(getDefaultAuthConfig, "getDefaultAuthConfig");
    var defaultAuthConfig = getDefaultAuthConfig();
    function normalizeConfigError(error) {
      if (error instanceof ZodError) {
        let credStorageIssue = error.issues.find((issue2) => issue2.path[0] === "credStorage");
        if (credStorageIssue) throw new Error(credStorageIssue.message);
      }
      throw error;
    }
    __name(normalizeConfigError, "normalizeConfigError");
    function parseGlobalConfig(value) {
      try {
        return globalConfigSchema2.parse(value);
      } catch (error) {
        normalizeConfigError(error);
      }
    }
    __name(parseGlobalConfig, "parseGlobalConfig");
    function parseAuthConfig(value) {
      return authConfigSchema2.parse(value);
    }
    __name(parseAuthConfig, "parseAuthConfig");
    function parseAuthFileConfig(value) {
      let { tokenSource, ...authConfig } = parseAuthConfig(value);
      return authConfig;
    }
    __name(parseAuthFileConfig, "parseAuthFileConfig");
    function readJsonFileSync(filePath) {
      let content = import_node_fs2.default.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
      return JSON.parse(content);
    }
    __name(readJsonFileSync, "readJsonFileSync");
    function writeJsonFileSync(filePath, value, options = {}) {
      let directory = import_node_path2.default.dirname(filePath), tempFilePath = import_node_path2.default.join(directory, `.${import_node_path2.default.basename(filePath)}.${process.pid}.${Date.now()}.tmp`), content = `${JSON.stringify(value, null, options.indent ?? 2)}
`;
      import_node_fs2.default.mkdirSync(directory, { recursive: true });
      try {
        import_node_fs2.default.writeFileSync(tempFilePath, content, { encoding: "utf8", mode: options.mode }), import_node_fs2.default.renameSync(tempFilePath, filePath);
      } catch (error) {
        try {
          import_node_fs2.default.rmSync(tempFilePath, { force: true });
        } catch {
        }
        throw error;
      }
    }
    __name(writeJsonFileSync, "writeJsonFileSync");
    function readConfigFile(configPath, schema) {
      return schema.parse(readJsonFileSync(configPath));
    }
    __name(readConfigFile, "readConfigFile");
    function writeConfigFile(configPath, schema, config2, options) {
      let normalizedConfig = encode(schema, config2);
      writeJsonFileSync(configPath, normalizedConfig, { indent: 2, ...options });
    }
    __name(writeConfigFile, "writeConfigFile");
    function readGlobalConfigFile(configPath) {
      try {
        return readConfigFile(configPath, globalConfigSchema2);
      } catch (error) {
        normalizeConfigError(error);
      }
    }
    __name(readGlobalConfigFile, "readGlobalConfigFile");
    function writeGlobalConfigFile(configPath, config2) {
      writeConfigFile(configPath, globalConfigSchema2, config2);
    }
    __name(writeGlobalConfigFile, "writeGlobalConfigFile");
    function readAuthConfigFile(configPath) {
      return readConfigFile(configPath, authConfigSchema2);
    }
    __name(readAuthConfigFile, "readAuthConfigFile");
    function readAuthFileConfig(configPath) {
      return parseAuthFileConfig(readJsonFileSync(configPath));
    }
    __name(readAuthFileConfig, "readAuthFileConfig");
    function readAuthConfig(configDir) {
      return readAuthConfigFile(getAuthConfigFilePath(configDir));
    }
    __name(readAuthConfig, "readAuthConfig");
    function tryReadAuthConfig(configDir) {
      try {
        return readAuthConfig(configDir);
      } catch {
        return null;
      }
    }
    __name(tryReadAuthConfig, "tryReadAuthConfig");
    function writeAuthConfigFile(configPath, authConfig) {
      authConfig.skipWrite || writeConfigFile(configPath, authConfigSchema2, authConfig, { mode: 384 });
    }
    __name(writeAuthConfigFile, "writeAuthConfigFile");
    function writeAuthConfig(configDir, authConfig) {
      writeAuthConfigFile(getAuthConfigFilePath(configDir), authConfig);
    }
    __name(writeAuthConfig, "writeAuthConfig");
    function deleteAuthConfigFile(configPath) {
      import_node_fs2.default.rmSync(configPath, { force: true });
    }
    __name(deleteAuthConfigFile, "deleteAuthConfigFile");
    function deleteAuthConfig(configDir) {
      deleteAuthConfigFile(getAuthConfigFilePath(configDir));
    }
    __name(deleteAuthConfig, "deleteAuthConfig");
    var TOKEN_STORAGE_ENV = "VERCEL_TOKEN_STORAGE";
    function isErrnoException(error) {
      return typeof error == "object" && error !== null && "code" in error;
    }
    __name(isErrnoException, "isErrnoException");
    function isCredStorage(value) {
      return CRED_STORAGE_CONFIG_VALUES.includes(value);
    }
    __name(isCredStorage, "isCredStorage");
    function formatCredStorageError2(value, source) {
      return `Invalid value for \`${source}\`: ${JSON.stringify(value)}. Expected one of: ${CRED_STORAGE_CONFIG_VALUES.map((storage) => JSON.stringify(storage)).join(", ")}.`;
    }
    __name(formatCredStorageError2, "formatCredStorageError2");
    function parseCredStorage(value, source = "credStorage") {
      if (!(typeof value > "u")) {
        if (isCredStorage(value)) return value;
        throw new Error(formatCredStorageError2(value, source));
      }
    }
    __name(parseCredStorage, "parseCredStorage");
    function authConfigHasUsableTokenData(value) {
      if (!value || typeof value != "object") return false;
      let authConfig = value;
      return typeof authConfig.token == "string" && authConfig.token.length > 0 || typeof authConfig.refreshToken == "string" && authConfig.refreshToken.length > 0;
    }
    __name(authConfigHasUsableTokenData, "authConfigHasUsableTokenData");
    function getLikelyAutoCredStorage(configDir) {
      try {
        return authConfigHasUsableTokenData(readAuthConfigFile(getAuthConfigFilePath(configDir))) ? "file" : "keyring";
      } catch {
        return "keyring";
      }
    }
    __name(getLikelyAutoCredStorage, "getLikelyAutoCredStorage");
    function getLikelyConfiguredCredStorage(configDir, credStorage) {
      return credStorage === "keyring" ? "keyring" : credStorage !== "auto" ? DEFAULT_CRED_STORAGE : getLikelyAutoCredStorage(configDir);
    }
    __name(getLikelyConfiguredCredStorage, "getLikelyConfiguredCredStorage");
    function getLikelyEffectiveCredStorage(configDir) {
      let config2 = {}, credStorageOverride = process.env[TOKEN_STORAGE_ENV];
      if (typeof credStorageOverride < "u") return getLikelyConfiguredCredStorage(configDir, parseCredStorage(credStorageOverride, TOKEN_STORAGE_ENV));
      try {
        let parsed = readGlobalConfigFile(getConfigFilePath(configDir));
        config2 = { ...parsed, credStorage: parseCredStorage(parsed.credStorage) };
      } catch (error) {
        if (!(isErrnoException(error) && error.code === "ENOENT")) throw error;
      }
      return getLikelyConfiguredCredStorage(configDir, config2.credStorage);
    }
    __name(getLikelyEffectiveCredStorage, "getLikelyEffectiveCredStorage");
  }
});

// node_modules/@vercel/oidc/dist/token-error.js
var require_token_error = __commonJS({
  "node_modules/@vercel/oidc/dist/token-error.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var token_error_exports = {};
    __export(token_error_exports, {
      VercelOidcTokenError: /* @__PURE__ */ __name(() => VercelOidcTokenError, "VercelOidcTokenError")
    });
    module.exports = __toCommonJS(token_error_exports);
    var VercelOidcTokenError = class extends Error {
      static {
        __name(this, "VercelOidcTokenError");
      }
      constructor(message, cause) {
        super(message);
        this.name = "VercelOidcTokenError";
        this.cause = cause;
      }
      toString() {
        if (this.cause) {
          return `${this.name}: ${this.message}: ${this.cause}`;
        }
        return `${this.name}: ${this.message}`;
      }
    };
  }
});

// node_modules/@vercel/oidc/dist/token-io.js
var require_token_io = __commonJS({
  "node_modules/@vercel/oidc/dist/token-io.js"(exports, module) {
    "use strict";
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var token_io_exports = {};
    __export(token_io_exports, {
      findRootDir: /* @__PURE__ */ __name(() => findRootDir, "findRootDir"),
      getUserDataDir: /* @__PURE__ */ __name(() => getUserDataDir, "getUserDataDir")
    });
    module.exports = __toCommonJS(token_io_exports);
    var import_path = __toESM(__require("path"));
    var import_fs = __toESM(__require("fs"));
    var import_os = __toESM(__require("os"));
    var import_token_error = require_token_error();
    function findRootDir() {
      try {
        let dir = process.cwd();
        while (dir !== import_path.default.dirname(dir)) {
          const pkgPath = import_path.default.join(dir, ".vercel");
          if (import_fs.default.existsSync(pkgPath)) {
            return dir;
          }
          dir = import_path.default.dirname(dir);
        }
      } catch (_e) {
        throw new import_token_error.VercelOidcTokenError(
          "Token refresh only supported in node server environments"
        );
      }
      return null;
    }
    __name(findRootDir, "findRootDir");
    function getUserDataDir() {
      if (process.env.XDG_DATA_HOME) {
        return process.env.XDG_DATA_HOME;
      }
      switch (import_os.default.platform()) {
        case "darwin":
          return import_path.default.join(import_os.default.homedir(), "Library/Application Support");
        case "linux":
          return import_path.default.join(import_os.default.homedir(), ".local/share");
        case "win32":
          if (process.env.LOCALAPPDATA) {
            return process.env.LOCALAPPDATA;
          }
          return null;
        default:
          return null;
      }
    }
    __name(getUserDataDir, "getUserDataDir");
  }
});

// node_modules/@vercel/oidc/dist/oauth.js
var require_oauth = __commonJS({
  "node_modules/@vercel/oidc/dist/oauth.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var oauth_exports = {};
    __export(oauth_exports, {
      processTokenResponse: /* @__PURE__ */ __name(() => processTokenResponse, "processTokenResponse"),
      refreshTokenRequest: /* @__PURE__ */ __name(() => refreshTokenRequest, "refreshTokenRequest")
    });
    module.exports = __toCommonJS(oauth_exports);
    var import_os = __require("os");
    var VERCEL_ISSUER = "https://vercel.com";
    var VERCEL_CLI_CLIENT_ID = "cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp";
    var userAgent = `@vercel/oidc node-${process.version} ${(0, import_os.platform)()} (${(0, import_os.arch)()}) ${(0, import_os.hostname)()}`;
    var _tokenEndpoint = null;
    async function getTokenEndpoint() {
      if (_tokenEndpoint) {
        return _tokenEndpoint;
      }
      const discoveryUrl = `${VERCEL_ISSUER}/.well-known/openid-configuration`;
      const response = await fetch(discoveryUrl, {
        headers: { "user-agent": userAgent }
      });
      if (!response.ok) {
        throw new Error("Failed to discover OAuth endpoints");
      }
      const metadata = await response.json();
      if (!metadata || typeof metadata.token_endpoint !== "string") {
        throw new Error("Invalid OAuth discovery response");
      }
      const endpoint = metadata.token_endpoint;
      _tokenEndpoint = endpoint;
      return endpoint;
    }
    __name(getTokenEndpoint, "getTokenEndpoint");
    async function refreshTokenRequest(options) {
      const tokenEndpoint = await getTokenEndpoint();
      return await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "user-agent": userAgent
        },
        body: new URLSearchParams({
          client_id: VERCEL_CLI_CLIENT_ID,
          grant_type: "refresh_token",
          ...options
        })
      });
    }
    __name(refreshTokenRequest, "refreshTokenRequest");
    async function processTokenResponse(response) {
      const json = await response.json();
      if (!response.ok) {
        const errorMsg = typeof json === "object" && json && "error" in json ? String(json.error) : "Token refresh failed";
        return [new Error(errorMsg)];
      }
      if (typeof json !== "object" || json === null) {
        return [new Error("Invalid token response")];
      }
      if (typeof json.access_token !== "string") {
        return [new Error("Missing access_token in response")];
      }
      if (json.token_type !== "Bearer") {
        return [new Error("Invalid token_type in response")];
      }
      if (typeof json.expires_in !== "number") {
        return [new Error("Missing expires_in in response")];
      }
      return [null, json];
    }
    __name(processTokenResponse, "processTokenResponse");
  }
});

// node_modules/@vercel/oidc/dist/auth-errors.js
var require_auth_errors = __commonJS({
  "node_modules/@vercel/oidc/dist/auth-errors.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var auth_errors_exports = {};
    __export(auth_errors_exports, {
      AccessTokenMissingError: /* @__PURE__ */ __name(() => AccessTokenMissingError, "AccessTokenMissingError"),
      RefreshAccessTokenFailedError: /* @__PURE__ */ __name(() => RefreshAccessTokenFailedError, "RefreshAccessTokenFailedError")
    });
    module.exports = __toCommonJS(auth_errors_exports);
    var AccessTokenMissingError = class extends Error {
      static {
        __name(this, "AccessTokenMissingError");
      }
      constructor() {
        super(
          "No authentication found. Please log in with the Vercel CLI (vercel login)."
        );
        this.name = "AccessTokenMissingError";
      }
    };
    var RefreshAccessTokenFailedError = class extends Error {
      static {
        __name(this, "RefreshAccessTokenFailedError");
      }
      constructor(cause) {
        super("Failed to refresh authentication token.");
        this.name = "RefreshAccessTokenFailedError";
        if (cause !== void 0) {
          this.cause = cause;
        }
      }
    };
  }
});

// node_modules/@vercel/oidc/dist/token-util.js
var require_token_util = __commonJS({
  "node_modules/@vercel/oidc/dist/token-util.js"(exports, module) {
    init_esm();
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var token_util_exports = {};
    __export(token_util_exports, {
      assertVercelOidcTokenResponse: /* @__PURE__ */ __name(() => assertVercelOidcTokenResponse, "assertVercelOidcTokenResponse"),
      findProjectInfo: /* @__PURE__ */ __name(() => findProjectInfo, "findProjectInfo"),
      getTokenPayload: /* @__PURE__ */ __name(() => getTokenPayload, "getTokenPayload"),
      getVercelOidcToken: /* @__PURE__ */ __name(() => getVercelOidcToken, "getVercelOidcToken"),
      getVercelOidcTokenFromCli: /* @__PURE__ */ __name(() => getVercelOidcTokenFromCli, "getVercelOidcTokenFromCli"),
      getVercelToken: /* @__PURE__ */ __name(() => getVercelToken, "getVercelToken"),
      isExpired: /* @__PURE__ */ __name(() => isExpired, "isExpired"),
      loadToken: /* @__PURE__ */ __name(() => loadToken, "loadToken"),
      saveToken: /* @__PURE__ */ __name(() => saveToken, "saveToken")
    });
    module.exports = __toCommonJS(token_util_exports);
    var path = __toESM(__require("path"));
    var fs = __toESM(__require("fs"));
    var import_cli_exec = require_dist();
    var import_cli_config = require_dist2();
    var import_token_error = require_token_error();
    var import_token_io = require_token_io();
    var import_oauth = require_oauth();
    var import_auth_errors = require_auth_errors();
    async function getVercelToken(options) {
      const configDir = (0, import_cli_config.getGlobalPathConfig)();
      const authConfig = (0, import_cli_config.tryReadAuthConfig)(configDir);
      if (!authConfig || !authConfig.token && !authConfig.refreshToken) {
        throw new import_auth_errors.AccessTokenMissingError();
      }
      if (isValidAccessToken(authConfig, options?.expirationBufferMs)) {
        return authConfig.token;
      }
      if (!authConfig.refreshToken) {
        (0, import_cli_config.writeAuthConfig)(configDir, {});
        throw new import_auth_errors.RefreshAccessTokenFailedError("No refresh token available");
      }
      try {
        const tokenResponse = await (0, import_oauth.refreshTokenRequest)({
          refresh_token: authConfig.refreshToken
        });
        const [tokensError, tokens] = await (0, import_oauth.processTokenResponse)(tokenResponse);
        if (tokensError || !tokens) {
          (0, import_cli_config.writeAuthConfig)(configDir, {});
          throw new import_auth_errors.RefreshAccessTokenFailedError(tokensError);
        }
        const updatedConfig = {
          token: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1e3) + tokens.expires_in,
          refreshToken: tokens.refresh_token
        };
        (0, import_cli_config.writeAuthConfig)(configDir, updatedConfig);
        return updatedConfig.token;
      } catch (error) {
        (0, import_cli_config.writeAuthConfig)(configDir, {});
        if (error instanceof import_auth_errors.AccessTokenMissingError || error instanceof import_auth_errors.RefreshAccessTokenFailedError) {
          throw error;
        }
        throw new import_auth_errors.RefreshAccessTokenFailedError(error);
      }
    }
    __name(getVercelToken, "getVercelToken");
    function isValidAccessToken(authConfig, expirationBufferMs = 0) {
      if (!authConfig.token)
        return false;
      if (typeof authConfig.expiresAt !== "number")
        return true;
      const nowInSeconds = Math.floor(Date.now() / 1e3);
      const bufferInSeconds = expirationBufferMs / 1e3;
      return authConfig.expiresAt >= nowInSeconds + bufferInSeconds;
    }
    __name(isValidAccessToken, "isValidAccessToken");
    async function getVercelOidcTokenFromCli(projectId, teamId) {
      const args = ["project", "token", projectId, "--format=json"];
      if (teamId) {
        args.push("--scope", teamId);
      }
      try {
        const { stdout } = await (0, import_cli_exec.execVercelCli)(args);
        let parsedOutput;
        if (typeof stdout !== "string") {
          throw new import_token_error.VercelOidcTokenError(
            "Failed to refresh OIDC token: `vercel project token` did not return stdout"
          );
        }
        try {
          parsedOutput = JSON.parse(stdout);
        } catch {
          throw new import_token_error.VercelOidcTokenError(
            "Failed to refresh OIDC token: `vercel project token` returned invalid JSON: " + stdout
          );
        }
        assertVercelOidcTokenResponse(parsedOutput);
        return parsedOutput;
      } catch (error) {
        if (error instanceof import_token_error.VercelOidcTokenError) {
          throw error;
        }
        let message = error instanceof Error ? error.message : "";
        const stderr = error instanceof import_cli_exec.VercelCliError ? error.stderr?.trim() : void 0;
        if (stderr && !message.includes(stderr)) {
          message = `${message}
${stderr}`.trim();
        }
        throw new import_token_error.VercelOidcTokenError(
          message ? `Failed to refresh OIDC token with the Vercel CLI: ${message}` : "Failed to refresh OIDC token with the Vercel CLI"
        );
      }
    }
    __name(getVercelOidcTokenFromCli, "getVercelOidcTokenFromCli");
    async function getVercelOidcToken(authToken, projectId, teamId) {
      const url = `https://api.vercel.com/v1/projects/${projectId}/token?source=vercel-oidc-refresh${teamId ? `&teamId=${teamId}` : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new import_token_error.VercelOidcTokenError(
          `Failed to refresh OIDC token: ${res.statusText}`
        );
      }
      const tokenRes = await res.json();
      assertVercelOidcTokenResponse(tokenRes);
      return tokenRes;
    }
    __name(getVercelOidcToken, "getVercelOidcToken");
    function assertVercelOidcTokenResponse(res) {
      if (!res || typeof res !== "object") {
        throw new TypeError("Vercel OIDC token is malformed. Expected an object.");
      }
      if (!("token" in res) || typeof res.token !== "string") {
        throw new TypeError(
          "Vercel OIDC token is malformed. Expected a string-valued token property."
        );
      }
    }
    __name(assertVercelOidcTokenResponse, "assertVercelOidcTokenResponse");
    function findProjectInfo() {
      const dir = (0, import_token_io.findRootDir)();
      if (!dir) {
        throw new import_token_error.VercelOidcTokenError(
          "Unable to find project root directory. Have you linked your project with `vc link?`"
        );
      }
      const prjPath = path.join(dir, ".vercel", "project.json");
      if (!fs.existsSync(prjPath)) {
        throw new import_token_error.VercelOidcTokenError(
          "project.json not found, have you linked your project with `vc link?`"
        );
      }
      const prj = JSON.parse(fs.readFileSync(prjPath, "utf8"));
      if (typeof prj.projectId !== "string" && typeof prj.orgId !== "string") {
        throw new TypeError(
          "Expected a string-valued projectId property. Try running `vc link` to re-link your project."
        );
      }
      return { projectId: prj.projectId, teamId: prj.orgId };
    }
    __name(findProjectInfo, "findProjectInfo");
    function saveToken(token, projectId) {
      const dir = (0, import_token_io.getUserDataDir)();
      if (!dir) {
        throw new import_token_error.VercelOidcTokenError(
          "Unable to find user data directory. Please reach out to Vercel support."
        );
      }
      const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
      const tokenJson = JSON.stringify(token);
      fs.mkdirSync(path.dirname(tokenPath), { mode: 504, recursive: true });
      fs.writeFileSync(tokenPath, tokenJson);
      fs.chmodSync(tokenPath, 432);
      return;
    }
    __name(saveToken, "saveToken");
    function loadToken(projectId) {
      const dir = (0, import_token_io.getUserDataDir)();
      if (!dir) {
        throw new import_token_error.VercelOidcTokenError(
          "Unable to find user data directory. Please reach out to Vercel support."
        );
      }
      const tokenPath = path.join(dir, "com.vercel.token", `${projectId}.json`);
      if (!fs.existsSync(tokenPath)) {
        return null;
      }
      const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
      assertVercelOidcTokenResponse(token);
      return token;
    }
    __name(loadToken, "loadToken");
    function getTokenPayload(token) {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        throw new import_token_error.VercelOidcTokenError("Invalid token.");
      }
      const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + (4 - base64.length % 4) % 4,
        "="
      );
      return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    }
    __name(getTokenPayload, "getTokenPayload");
    function isExpired(token, bufferMs = 0) {
      return token.exp * 1e3 < Date.now() + bufferMs;
    }
    __name(isExpired, "isExpired");
  }
});

export {
  require_token_error,
  require_dist2 as require_dist,
  require_auth_errors,
  require_token_util
};
//# sourceMappingURL=chunk-XJYKV2TK.mjs.map
