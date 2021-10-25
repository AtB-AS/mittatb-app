"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClient;
Object.defineProperty(exports, "RequestError", {
  enumerable: true,
  get: function () {
    return _fetcher.RequestError;
  }
});

var _config = require("./config");

var _token = require("./token");

var _fetcher = require("./fetcher");

var _abtTokensService = require("./token/abt-tokens-service");

var _native = require("./native");

var _types = require("./native/types");

function createClient(setStatus, initialConfig) {
  const config = (0, _config.getConfigFromInitialConfig)(initialConfig);
  const fetcher = (0, _fetcher.createFetcher)(config);
  const abtTokensService = (0, _abtTokensService.createAbtTokensService)(fetcher, config.hosts);

  const setStatusWrapper = storedState => {
    setStatus({
      state: storedState.state,
      error: storedState.error
    });
  };

  (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper);
  return {
    restart: () => {
      (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper); // Todo: Not start if already running
    },
    generateQrCode: () => (0, _native.getSecureToken)([_types.PayloadAction.ticketInspection])
  };
}
//# sourceMappingURL=index.js.map