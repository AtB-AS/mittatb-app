import { logger } from '../../logger';
import type { StoredState, TokenState } from '../types';
import { missingNetConnection } from './utils';

export type StateHandler = (storedState: StoredState) => Promise<StoredState>;

export function stateHandlerFactory<S extends TokenState>(
  forStates: S[],
  handlerFunction: (
    storedState: StoredState & { state: S }
  ) => Promise<StoredState>
): StateHandler {
  return async (storedState: StoredState): Promise<StoredState> => {
    if (!forStates.includes(storedState.state as S)) {
      return {
        ...storedState,
        error: {
          missingNetConnection: false,
          message: `Applying handler for ${forStates} when the actual state is ${storedState.state}`,
        },
      };
    }

    try {
      return await handlerFunction(storedState as StoredState & { state: S });
    } catch (err: any) {
      logger.error(undefined, err, undefined);

      let missingNet = false;
      try {
        missingNet = await missingNetConnection();
      } catch {}

      return {
        ...storedState,
        error: {
          missingNetConnection: missingNet,
          message: `Error during handling of state ${storedState.state}`,
          err,
        },
      };
    }
  };
}
