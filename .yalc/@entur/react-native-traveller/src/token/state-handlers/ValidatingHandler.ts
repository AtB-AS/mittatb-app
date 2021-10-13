import { getToken } from '../../native';
import type { AbtTokensService } from '../abt-tokens-service';
import type { ListTokensResponse, TokenStatus } from '../types';

export default async function validatingHandler(
  abtTokensService: AbtTokensService
): Promise<TokenStatus> {
  try {
    const token = await getToken();
    if (!token) {
      return { state: 'Initiating' };
    }

    const tokens: ListTokensResponse = await abtTokensService.listTokens();
    const tokenFound = tokens.some((t) => t.id === token.tokenId);
    return { state: tokenFound ? 'Valid' : 'Initiating' };
  } catch (err) {
    return {
      state: 'Validating',
      error: {
        type: 'Unknown',
        message: 'Error validating token backend status',
        err,
      },
    };
  }
}
