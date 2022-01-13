import type { AbtTokensService } from '../../abt-tokens-service';
import type { ListTokensResponse } from '../../types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function validatingHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['Validating'], async (s) => {
    const tokens: ListTokensResponse = await abtTokensService.listTokens();
    const token = tokens.find((t) => t.id === s.token.tokenId);
    if (!token) {
      return {
        accountId: s.accountId,
        state: 'DeleteLocal',
      };
    }

    const isInspectable = token.allowedActions.some(
      (a) => a === 'TOKEN_ACTION_TICKET_INSPECTION'
    );

    return {
      accountId: s.accountId,
      state: 'Valid',
      isInspectable,
    };
  });
}
