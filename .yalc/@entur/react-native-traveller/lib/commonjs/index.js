"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClient;
Object.defineProperty(exports, "isTokenValid", {
  enumerable: true,
  get: function () {
    return _token.isTokenValid;
  }
});
Object.defineProperty(exports, "RequestError", {
  enumerable: true,
  get: function () {
    return _fetcher.RequestError;
  }
});

var _config = require("./config");

var _native = require("./native");

var _token = require("./token");

var _fetcher = require("./fetcher");

async function onStartup(fetcher, hosts) {
  const token = await (0, _native.getToken)();

  if (token && !(0, _token.isTokenValid)(token)) {
    (0, _token.createRenewToken)(fetcher, hosts)(token);
  }
}

function createClient(initialConfig) {
  const config = (0, _config.getConfigFromInitialConfig)(initialConfig);
  const fetcher = (0, _fetcher.createFetcher)(config);
  onStartup(fetcher, config.hosts);
  return {
    initToken: (0, _token.createInitToken)(fetcher, config.hosts),
    getToken: _native.getToken,
    deleteToken: _native.deleteToken,
    generateQrCode: _native.generateQrCode
  };
}
//# sourceMappingURL=index.js.map