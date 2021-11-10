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

function startingHandler(getClientState, safetyNetApiKey, forceRestart) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Starting'], async _ => {
    const {
      accountId
    } = getClientState();
    const storeKey = (0, _utils.getStoreKey)(accountId);
    await (0, _native.start)(safetyNetApiKey);

    if (forceRestart) {
      return {
        state: 'Loading'
      };
    }

    const savedStateString = await _asyncStorage.default.getItem(storeKey);

    if (!savedStateString) {
      return {
        state: 'Loading'
      };
    }

    const savedState = JSON.parse(savedStateString);

    if (savedState.state === 'Valid') {
      return {
        state: 'Loading'
      };
    }

    return savedState;
  });
}
//# sourceMappingURL=StartingHandler.js.map