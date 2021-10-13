import type { AbtTokensService } from './abt-tokens-service';
import type { TokenStatus } from './types';
export declare const startTokenStateMachine: (abtTokensService: AbtTokensService, setStatus: (s: TokenStatus) => void, lastStatus?: TokenStatus | undefined) => Promise<void>;
