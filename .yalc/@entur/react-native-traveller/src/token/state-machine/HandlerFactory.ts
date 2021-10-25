import type { StoredState, TokenState } from '../types';

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
          type: 'Severe',
          message: `Applying handler for ${forStates} when the actual state is ${storedState.state}`,
        },
      };
    }

    return handlerFunction(storedState as StoredState & { state: S }).catch(
      (err) => {
        return {
          ...storedState,
          error: {
            type: 'Unknown',
            message: `Error during handling of state ${storedState.state}`,
            err,
          },
        };
      }
    );
  };
}
