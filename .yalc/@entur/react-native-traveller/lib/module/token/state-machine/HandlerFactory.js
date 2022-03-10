import { logger } from '../../logger';
import { missingNetConnection } from './utils';
export function stateHandlerFactory(forStates, handlerFunction) {
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
      logger.error(undefined, err, undefined);
      let missingNet = false;

      try {
        missingNet = await missingNetConnection();
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