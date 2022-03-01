import type { AbtTokensService } from '../../abt-tokens-service';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';

export default function validatingHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['Validating'], async (s) => {
    const signedToken = await getSecureToken(s.accountId, s.tokenId, true, [
      PayloadAction.getFarecontracts,
    ]);
    const validationResponse = await abtTokensService.validateToken(
      s.tokenId,
      signedToken
    );

    switch (validationResponse.state) {
      case 'Valid':
        return {
          accountId: s.accountId,
          state: 'Valid',
          tokenId: s.tokenId,
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
          tokenId: s.tokenId,
          state: 'InitiateRenewal',
        };
    }
  });
}
