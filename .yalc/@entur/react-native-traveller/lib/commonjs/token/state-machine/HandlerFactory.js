"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateHandlerFactory = stateHandlerFactory;

function stateHandlerFactory(forStates, handlerFunction) {
  return async storedState => {
    if (!forStates.includes(storedState.state)) {
      return { ...storedState,
        error: {
          type: 'Severe',
          message: `Applying handler for ${forStates} when the actual state is ${storedState.state}`
        }
      };
    }

    return handlerFunction(storedState).catch(err => {
      return { ...storedState,
        error: {
          type: 'Unknown',
          message: `Error during handling of state ${storedState.state}`,
          err
        }
      };
    });
  };
}
//# sourceMappingURL=HandlerFactory.js.map