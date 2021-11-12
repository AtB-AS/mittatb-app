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
  const {
    safetyNetApiKey
  } = initialConfig;
  const config = (0, _config.getConfigFromInitialConfig)(initialConfig);
  const fetcher = (0, _fetcher.createFetcher)(config);
  const abtTokensService = (0, _abtTokensService.createAbtTokensService)(fetcher, config.hosts);
  let currentStatus;

  const toVisualState = storedState => {
    var _storedState$error;

    if ((_storedState$error = storedState.error) !== null && _storedState$error !== void 0 && _storedState$error.missingNetConnection) {
      return 'MissingNetConnection';
    } else if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = storedState => {
    const status = storedState && {
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState)
    };
    currentStatus = status;
    setStatus(status);
  };

  let clientState = {};

  function clientStateRetriever() {
    return clientState;
  }

  return {
    setAccount(accountId) {
      clientState = { ...clientState,
        accountId
      };

      if (clientState.accountId) {
        (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, clientStateRetriever, safetyNetApiKey, false);
      }
    },

    retry: forceRestart => {
      var _currentStatus;

      const {
        accountId
      } = clientState;

      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (((_currentStatus = currentStatus) === null || _currentStatus === void 0 ? void 0 : _currentStatus.visualState) === 'Loading') {
        throw new Error('Can not retry while the sdk is already running');
      }

      (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, clientStateRetriever, safetyNetApiKey, forceRestart); // Todo: Not start if already running
    },
    generateQrCode: () => {
      var _currentStatus2;

      const {
        accountId
      } = clientState;

      if (!accountId) {
        throw new Error('Account id must be set');
      }

      if (((_currentStatus2 = currentStatus) === null || _currentStatus2 === void 0 ? void 0 : _currentStatus2.visualState) !== 'Token') {
        throw new Error('The current state does not allow retrieval of qr code');
      }

      return (0, _native.getSecureToken)(accountId, [_types.PayloadAction.ticketInspection]);
    }
  };
}
//# sourceMappingURL=index.js.map