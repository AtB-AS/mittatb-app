import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';
import type { ClientStateRetriever } from '../../..';

export default function activateRenewalHandler(
  abtTokensService: AbtTokensService,
  getClientState: ClientStateRetriever
): StateHandler {
  return stateHandlerFactory(['ActivateRenewal'], async (s) => {
    const { accountId } = getClientState();
    const signedToken = await getSecureToken(accountId, [
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
        state: 'AddToken',
        activatedData: activateTokenResponse,
      };
    } catch (err: any) {
      if (err?.response?.status === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return { state: 'GettingTokenCertificate' };
      }
      throw err;
    }
  });
}
