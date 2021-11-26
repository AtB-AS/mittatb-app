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

    try {
      return await handlerFunction(storedState);
    } catch (err) {
      let missingNet = false;

      try {
        missingNet = await (0, _utils.missingNetConnection)();
      } catch {}

      return { ...storedState,
        error: {
          missingNetConnection: missingNet,
          message: `Error during handling of state ${storedState.state}`,
          err
        }
      };
    }
  };
}
//# sourceMappingURL=HandlerFactory.js.map