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
Object.defineProperty(exports, "PayloadAction", {
  enumerable: true,
  get: function () {
    return _types.PayloadAction;
  }
});

var _config = require("./config");

var _token = require("./token");

var _fetcher = require("./fetcher");

var _abtTokensService = require("./token/abt-tokens-service");

var _native = require("./native");

var _types = require("./native/types");

const INITIAL_RETRY_INTERVAL = 5000;
const MAXIMUM_RETRY_INTERVAL = 1000 * 60 * 60; // 1 hour

function createClient(setStatus, initialConfig) {
  const {
    safetyNetApiKey
  } = initialConfig;
  const config = (0, _config.getConfigFromInitialConfig)(initialConfig);
  const fetcher = (0, _fetcher.createFetcher)(config);
  const abtTokensService = (0, _abtTokensService.createAbtTokensService)(fetcher, config.hosts);
  let currentStatus;
  let currentAccountId;

  const toVisualState = storedState => {
    var _storedState$error;

    if ((_storedState$error = storedState.error) !== null && _storedState$error !== void 0 && _storedState$error.missingNetConnection) {
      return 'MissingNetConnection';
    } else if (storedState.error) {
      return 'Error';
    } else if (storedState.state === 'Validating') {
      return 'Token';
    } else if (storedState.state === 'Valid') {
      return storedState.isInspectable ? 'Token' : 'NotInspectable';
    } else {
      return 'Loading';
    }
  };

  let currentRetryInterval = INITIAL_RETRY_INTERVAL;
  let scheduledRetry;

  const scheduleRetry = () => {
    scheduledRetry = setTimeout(() => (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, safetyNetApiKey, false, currentAccountId), currentRetryInterval); // Exponential backoff for timeout interval capped to maximum of one hour

    currentRetryInterval = Math.min(currentRetryInterval * 2, MAXIMUM_RETRY_INTERVAL);
  };

  const unscheduleRetry = () => {
    if (scheduledRetry) {
      clearTimeout(scheduledRetry);
    }

    currentRetryInterval = INITIAL_RETRY_INTERVAL;
  };

  const setStatusWrapper = storedState => {
    // Do not give status callbacks for other accounts ids than the one
    // currently set
    if (storedState !== null && storedState !== void 0 && storedState.accountId && storedState.accountId !== currentAccountId) {
      return;
    }

    const status = storedState && {
      state: storedState.state,
      error: sanitizeError(storedState.error),
      visualState: toVisualState(storedState)
    };
    currentStatus = status;
    setStatus(status);

    if (status !== null && status !== void 0 && status.error) {
      scheduleRetry();
    } else if ((storedState === null || storedState === void 0 ? void 0 : storedState.state) === 'Valid') {
      unscheduleRetry();
    }
  };

  return {
    setAccount(accountId) {
      if (currentAccountId !== accountId) {
        currentAccountId = accountId;
        unscheduleRetry();
        (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, safetyNetApiKey, false, accountId);
      }
    },

    retry: forceRestart => {
      var _currentStatus;

      if (!currentAccountId) {
        return;
      }

      if (!forceRestart && ((_currentStatus = currentStatus) === null || _currentStatus === void 0 ? void 0 : _currentStatus.visualState) === 'Loading') {
        return;
      }

      unscheduleRetry();
      (0, _token.startTokenStateMachine)(abtTokensService, setStatusWrapper, safetyNetApiKey, forceRestart, currentAccountId);
    },

    /**
     * Get a secure token for the current active token on the current account.
     *
     * If no account set, or if the current token visual state is not 'Token',
     * undefined will be returned.
     *
     * You must specify the actions the secure token should be used for. For
     * example creating a qr code for inspection needs the 'ticketInspection'
     * action, and to retrieve fare contracts the 'getFarecontracts' is
     * necessary.
     *
     * @param action the action the created token may be used for
     * @return {Promise} a Promise for getting the secure token for the given
     * action
     */
    getSecureToken: async (actions) => {
      var _currentStatus2;

      if (!currentAccountId || ((_currentStatus2 = currentStatus) === null || _currentStatus2 === void 0 ? void 0 : _currentStatus2.visualState) !== 'Token') {
        return Promise.resolve(undefined);
      }

      const token = await (0, _native.getToken)(currentAccountId);

      if (!token) {
        return Promise.reject(new Error('Token not found'));
      }

      return (0, _native.getSecureToken)(currentAccountId, token.tokenId, true, actions);
    }
  };
}

const sanitizeError = error => {
  var _error$err, _error$err2, _error$err3;

  if (!error) return undefined;
  const newErr = new Error(typeof error.err === 'string' ? error.err : (_error$err = error.err) === null || _error$err === void 0 ? void 0 : _error$err.message);
  newErr.name = (_error$err2 = error.err) === null || _error$err2 === void 0 ? void 0 : _error$err2.name;
  newErr.stack = (_error$err3 = error.err) === null || _error$err3 === void 0 ? void 0 : _error$err3.stack;
  return { ...error,
    err: newErr
  };
};
//# sourceMappingURL=index.js.map