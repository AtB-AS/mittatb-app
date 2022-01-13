"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getConfigFromInitialConfig: true
};
exports.getConfigFromInitialConfig = getConfigFromInitialConfig;

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

var _internalFetcher = _interopRequireDefault(require("../api/internal-fetcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_CONFIG = {
  hosts: {
    pto: ''
  },
  fetch: _internalFetcher.default,
  extraHeaders: {}
};

function getConfigFromInitialConfig(initialConfig) {
  if (!initialConfig) return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG,
    ...initialConfig,
    hosts: { ...DEFAULT_CONFIG.hosts,
      ...initialConfig.hosts
    },
    extraHeaders: { ...DEFAULT_CONFIG.extraHeaders,
      ...initialConfig.extraHeaders
    }
  };
}
//# sourceMappingURL=index.js.map