import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';

export default function activateRenewalHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['ActivateRenewal'], async (s) => {
    const { accountId, oldTokenId, tokenId, state } = s;

    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      oldTokenId,
      tokenId,
      state,
    });

    const signedToken = await getSecureToken(accountId, oldTokenId, true, [
      PayloadAction.addRemoveToken,
    ]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(
        tokenId,
        s.attestationData,
        signedToken
      );
      verifyCorrectTokenId(tokenId, activateTokenResponse.tokenId);

      return {
        accountId: accountId,
        state: 'AddToken',
        tokenId: s.tokenId,
        activatedData: activateTokenResponse,
      };
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          accountId: accountId,
          tokenId: tokenId,
          state: 'GettingTokenCertificate',
        };
      }
      throw err;
    }
  });
}
