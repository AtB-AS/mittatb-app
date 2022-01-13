import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function initiateRenewalHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['InitiateRenewal'], async (s) => {
    const signedToken = await getSecureToken(s.accountId, s.tokenId, true, [
      PayloadAction.addRemoveToken,
    ]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      accountId: s.accountId,
      oldTokenId: s.tokenId,
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse,
    };
  });
}
