import type { AbtTokensService } from './abt-tokens-service';
import type { StoredState } from './types';
import type { ClientStateRetriever } from '..';
export declare const startTokenStateMachine: (abtTokensService: AbtTokensService, setStatus: (s: StoredState) => void, getClientState: ClientStateRetriever, forceRestart?: boolean) => Promise<void>;
