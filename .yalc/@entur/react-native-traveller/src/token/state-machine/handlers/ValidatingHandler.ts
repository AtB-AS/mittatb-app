import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import type { ListTokensResponse } from '../../types';
import { isTokenInspectable } from '../utils';

export default function validatingHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['Validating'], async (s) => {
    const signedToken = await getSecureToken(
      s.accountId,
      s.token.tokenId,
      true,
      [PayloadAction.getFarecontracts]
    );
    const validationResponse = await abtTokensService.validateToken(
      s.token.tokenId,
      signedToken
    );

    switch (validationResponse.state) {
      case 'Valid':
        const tokens: ListTokensResponse = await abtTokensService.listTokens();
        return {
          accountId: s.accountId,
          state: 'Valid',
          isInspectable: isTokenInspectable(tokens, s.token.tokenId),
        };
      case 'NotFound':
      case 'NeedsReplacement':
        return {
          accountId: s.accountId,
          state: 'DeleteLocal',
        };
      case 'NeedsRenewal':
        return {
          accountId: s.accountId,
          tokenId: s.token.tokenId,
          state: 'InitiateRenewal',
        };
    }
  });
}
