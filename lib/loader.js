"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _module2 = require("./module");

var _index = require("./index");

var _inversify = require("inversify");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function autoLoadModules(init, path, pattern) {
  console.log("[dog] [auto load] @ \"".concat(path, "\"..."));

  var ctx = function () {
    function req() {}

    req.keys = function () {
      return [];
    };

    req.resolve = function () {};

    return req;
  }();

  var files = ctx.keys().map(function (name) {
    return {
      name: name,
      module: new (ctx(name)["default"])()
    };
  });

  var _iterator = _createForOfIteratorHelper(files),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
          name = _step$value.name,
          module = _step$value.module;
      if (!(module instanceof _module2.DoguinhoModule)) throw new Error("Default export of ".concat(name, " must extend Module"));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var modules = files.map(function (value) {
    return value.module;
  });

  var _iterator2 = _createForOfIteratorHelper(modules),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _module = _step2.value;
      loadModule(init, _module);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

function loadModule(ctx, constructor) {
  var cname = constructor.name;
  console.log("[dog] [module] loading", cname);
  var name = (0, _index.fixModuleName)(cname);
  if (ctx.cache[name]) throw new Error("Module ".concat(name, " already loaded"));
  if (!Reflect.hasOwnMetadata(_module2.ModuleMetadataKey, constructor)) throw new Error("".concat(cname, " is not a Module (no @Module decorator found)"));
  var module = new constructor();
  defineProperty(module, "name", name);
  defineProperty(module, "qualifiedName", cname);
  var moduleCtx = Object.assign({
    module: module
  }, ctx.injector);
  var options = Reflect.getMetadata(_module2.ModuleMetadataKey, constructor);
  if (options && options.beforeInit) options.beforeInit(moduleCtx);
  defineProperty(module, "options", options || {});
  initModule(ctx, moduleCtx, options, module);
}

function initModule(initContext, moduleContext, moduleOptions, module) {
  if (moduleOptions && moduleOptions.providers) {
    var _iterator3 = _createForOfIteratorHelper(moduleOptions.providers),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var service = _step3.value;
        initContext.injector.inject(service);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  initContext.cache[module.name] = moduleContext;
  console.log("[dog] [module] ready", module.qualifiedName);
}

function defineProperty(target, prop, value) {
  Object.defineProperty(target, prop, {
    value: value,
    writable: false,
    enumerable: true,
    configurable: true
  });
}

function providerName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function providerId(name, key) {
  return key || Symbol(name);
}

function providerMetadata(name, key) {
  if (typeof name === "undefined") {
    if (typeof key === "undefined") throw new Error("Cannot create provider metadata (name and key is null)");

    var _name;

    if (_typeof(key) == "symbol") _name = key.description;
    return {
      name: _name || key.toString(),
      key: key
    };
  }

  name = providerName(name);
  return {
    name: name,
    key: providerId(name, key)
  };
}

function retrieveMetadata(cache, value) {
  return cache[providerName(value.name)];
}

function buildInjector(cache, container) {
  return {
    get: function get(value) {
      return container.get(retrieveMetadata(cache, value));
    },
    inject: function inject(value, scope, key) {
      this.injectScoped(value, _index.DefaultInjectionScope, key);
    },
    injectScoped: function injectScoped(value, scope, key0) {
      var _providerMetadata = providerMetadata(value.name, key0),
          name = _providerMetadata.name,
          key = _providerMetadata.key;

      (0, _index.decorate)((0, _index.Injectable)(), value);
      cache[name] = key;

      if (scope) {
        (0, _index.assignFn)(scope, {
          "Transient": container.bind(key).to(value).inTransientScope(),
          "Request": container.bind(key).to(value).inRequestScope(),
          "default": container.bind(key).to(value).inSingletonScope()
        });
      }
    },
    injectConstant: function injectConstant(value, key) {
      var metadata = providerMetadata(undefined, key);
      cache[metadata.name] = metadata.key;
      container.bind(key).toConstantValue(value);
    },
    injectAll: function injectAll() {
      for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      for (var _i = 0, _values = values; _i < _values.length; _i++) {
        var value = _values[_i];
        this.inject(value);
      }
    },
    injectAllScoped: function injectAllScoped(scope) {
      for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        values[_key2 - 1] = arguments[_key2];
      }

      for (var _i2 = 0, _values2 = values; _i2 < _values2.length; _i2++) {
        var value = _values2[_i2];
        this.inject(value, scope);
      }
    }
  };
}

var _default = function _default(options) {
  console.log("[dog] starting...");
  var containerOptions = {
    autoBindInjectable: false,
    skipBaseClassChecks: true,
    defaultScope: _index.DefaultInjectionScope
  };
  if (options && options.containerOptions) containerOptions = Object.assign(containerOptions, options.containerOptions);
  var container = new _inversify.Container(containerOptions);
  var cache = {};
  var injector = buildInjector({}, container);
  var init = {
    cache: cache,
    injector: injector
  };

  if (options) {
    if (options.autoRegister) {
      var autoRegister = options.autoRegister;
      autoLoadModules(init, autoRegister.path || ".", autoRegister.pattern || /^.*\.module.(ts|js)$/m);
    }

    if (options.modules) {
      console.log("[dog] loading defined modules...");

      var _iterator4 = _createForOfIteratorHelper(options.modules),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var module = _step4.value;
          loadModule(init, module);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }

  for (var name in cache) {
    var _ctx$module$options$i, _ctx$module$options;

    if (!cache.hasOwnProperty(name)) continue;
    var ctx = cache[name];
    (_ctx$module$options$i = (_ctx$module$options = ctx.module.options).init) === null || _ctx$module$options$i === void 0 ? void 0 : _ctx$module$options$i.call(_ctx$module$options, ctx);
  }

  var registry = {
    get: function get(name) {
      var _cache$name;

      return (_cache$name = cache[name]) === null || _cache$name === void 0 ? void 0 : _cache$name.module;
    },
    has: function has(name) {
      return typeof cache[name] !== "undefined";
    }
  };
  console.log("[dog] started");
  return {
    container: container,
    injector: injector,
    registry: registry
  };
};

exports["default"] = _default;