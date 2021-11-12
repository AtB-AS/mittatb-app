"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateHandlerFactory = stateHandlerFactory;

var _utils = require("./utils");

function stateHandlerFactory(forStates, handlerFunction) {
  return async storedState => {
    if (!forStates.includes(storedState.state)) {
      return { ...storedState,
        error: {
          missingNetConnection: false,
          message: `Applying handler for ${forStates} when the actual state is ${storedState.state}`
        }
      };
    }

    return handlerFunction(storedState).catch(async err => {
      return { ...storedState,
        error: {
          missingNetConnection: await (0, _utils.missingNetConnection)(),
          message: `Error during handling of state ${storedState.state}`,
          err
        }
      };
    });
  };
}
//# sourceMappingURL=HandlerFactory.js.map