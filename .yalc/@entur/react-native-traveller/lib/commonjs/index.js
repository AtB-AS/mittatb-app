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

function createClient(setStatus, initialState, initialConfig) {
  const config = (0, _config.getConfigFromInitialConfig)(initialConfig);
  const fetcher = (0, _fetcher.createFetcher)(config);
  const abtTokensService = (0, _abtTokensService.createAbtTokensService)(fetcher, config.hosts);

  const toVisualState = storedState => {
    if (storedState.error) {
      return 'Error';
    } else if (['Valid', 'Validating'].includes(storedState.state)) {
      return 'Token';
    } else {
      return 'Loading';
    }
  };

  const setStatusWrapper = storedState => {
    setStatus({
      state: storedState.state,
      error: storedState.error,
      visualState: toVisualState(storedState)
    });
  };

  let clientState = { ...initialState
  };

  function clientStateRetriever() {
    return clientState;
  }

  (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, clientStateRetriever);
  return {
    switch(accountId) {
      clientState = { ...clientState,
        accountId
      };
      (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, clientStateRetriever, false);
    },

    retry: forceRestart => {
      (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, clientStateRetriever, forceRestart); // Todo: Not start if already running
    },
    generateQrCode: () => {
      const {
        accountId
      } = clientState;
      return (0, _native.getSecureToken)(accountId, [_types.PayloadAction.ticketInspection]);
    }
  };
}
//# sourceMappingURL=index.js.map