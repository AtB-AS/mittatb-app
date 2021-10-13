import type { AbtTokensService } from '../abt-tokens-service';
import type { TokenStatus } from '../types';
export default function initiatingHandler(abtTokensService: AbtTokensService): Promise<TokenStatus>;
