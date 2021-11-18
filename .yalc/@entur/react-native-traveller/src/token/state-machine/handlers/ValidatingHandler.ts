import type { AbtTokensService } from '../../abt-tokens-service';
import type { ListTokensResponse } from '../../types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function validatingHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['Validating'], async (s) => {
    const tokens: ListTokensResponse = await abtTokensService.listTokens();
    const tokenFound = tokens.some((t) => t.id === s.token.tokenId);
    return {
      accountId: s.accountId,
      state: tokenFound ? 'Valid' : 'DeleteLocal',
    };
  });
}
