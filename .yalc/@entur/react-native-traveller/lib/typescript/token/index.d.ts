import type { AbtTokensService } from './abt-tokens-service';
import type { StoredState } from './types';
export declare const startTokenStateMachine: (abtTokensService: AbtTokensService, setStatus: (s: StoredState) => void) => Promise<void>;
