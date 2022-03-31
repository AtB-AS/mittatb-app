"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startingHandler;

var _HandlerFactory = require("../HandlerFactory");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _utils = require("../utils");

var _native = require("../../../native");

var _logger = require("../../../logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startingHandler(safetyNetApiKey, forceRestart) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Starting'], async s => {
    const {
      accountId,
      state
    } = s;
    const {
      result
    } = await (0, _native.getAttestationSupport)();

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      attestationSupport: result,
      state
    });

    if (result !== 'SUPPORTED') {
      return {
        accountId,
        state: 'NotSupported'
      };
    }

    const storeKey = (0, _utils.getStoreKey)(accountId);
    await (0, _native.start)(safetyNetApiKey);

    if (forceRestart) {
      _logger.logger.info('mobiletoken_forced_restart', undefined, {
        accountId
      });

      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedStateString = await _asyncStorage.default.getItem(storeKey);

    if (!savedStateString) {
      _logger.logger.info('mobiletoken_no_existing_state', undefined, {
        accountId
      });

      return {
        accountId,
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);

    _logger.logger.info('mobiletoken_loaded_state', undefined, {
      state: savedState.state,
      accountId: savedState.accountId
    });

    if (savedState.state === 'Valid') {
      return {
        accountId,
        state: 'Loading'
      };
    }

    return { ...savedState,
      error: undefined
    };
  });
}
//# sourceMappingURL=StartingHandler.js.map