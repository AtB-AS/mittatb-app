import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function activateRenewalHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['ActivateRenewal'], async (s) => {
    const signedToken = await getSecureToken(s.accountId, s.oldTokenId, true, [
      PayloadAction.addRemoveToken,
    ]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(
        s.tokenId,
        s.attestationData,
        signedToken
      );
      verifyCorrectTokenId(s.tokenId, activateTokenResponse.tokenId);

      return {
        accountId: s.accountId,
        state: 'AddToken',
        tokenId: s.tokenId,
        activatedData: activateTokenResponse,
      };
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          accountId: s.accountId,
          tokenId: s.tokenId,
          state: 'GettingTokenCertificate',
        };
      }
      throw err;
    }
  });
}
