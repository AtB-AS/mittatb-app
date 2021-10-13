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
  let lastSeenStatus;

  const setStatusWrapper = status => {
    lastSeenStatus = status;
    setStatus(status);
  };

  const startStateMachine = () => {
    (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, lastSeenStatus).catch(err => {
      var _lastSeenStatus;

      console.warn('Unexpected error', err);
      setStatusWrapper({
        state: ((_lastSeenStatus = lastSeenStatus) === null || _lastSeenStatus === void 0 ? void 0 : _lastSeenStatus.state) || 'Loading',
        error: {
          type: 'Unknown',
          message: 'Unexpected error',
          err
        }
      });
    });
  };

  startStateMachine();
  return {
    restart: () => {
      startStateMachine();
    },
    generateQrCode: () => (0, _native.getSecureToken)([_types.PayloadAction.ticketInspection])
  };
}
//# sourceMappingURL=index.js.map