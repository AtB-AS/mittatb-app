import type { StoredState, TokenState } from '../types';
export declare type StateHandler = (storedState: StoredState) => Promise<StoredState>;
export declare function stateHandlerFactory<S extends TokenState>(forStates: S[], handlerFunction: (storedState: StoredState & {
    state: S;
}) => Promise<StoredState>): StateHandler;
