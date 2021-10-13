import type { AbtTokensService } from '../abt-tokens-service';
import type { TokenStatus } from '../types';
export default function validatingHandler(abtTokensService: AbtTokensService): Promise<TokenStatus>;
