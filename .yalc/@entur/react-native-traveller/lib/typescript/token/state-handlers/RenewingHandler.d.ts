import type { AbtTokensService } from '../abt-tokens-service';
import type { TokenStatus } from '../types';
export default function renewingHandler(abtTokensService: AbtTokensService): Promise<TokenStatus>;
