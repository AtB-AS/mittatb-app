"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startingHandler;

var _HandlerFactory = require("../HandlerFactory");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _utils = require("../utils");

var _native = require("../../../native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startingHandler(safetyNetApiKey, forceRestart) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Starting'], async s => {
    const {
      result
    } = await (0, _native.getAttestationSupport)();

    if (result !== 'SUPPORTED') {
      return {
        accountId: s.accountId,
        state: 'NotSupported'
      };
    }

    const storeKey = (0, _utils.getStoreKey)(s.accountId);
    await (0, _native.start)(safetyNetApiKey);

    if (forceRestart) {
      return {
        accountId: s.accountId,
        state: 'Loading'
      };
    }

    const savedStateString = await _asyncStorage.default.getItem(storeKey);

    if (!savedStateString) {
      return {
        accountId: s.accountId,
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);
    return { ...savedState,
      error: undefined
    };
  });
}
//# sourceMappingURL=StartingHandler.js.map