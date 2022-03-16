import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { verifyCorrectTokenId } from '../utils';
import { stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';
export default function activateRenewalHandler(abtTokensService) {
  return stateHandlerFactory(['ActivateRenewal'], async s => {
    const {
      accountId,
      oldTokenId,
      tokenId
    } = s;
    logger.info('activate_renewal', undefined, {
      accountId,
      oldTokenId,
      tokenId
    });
    const signedToken = await getSecureToken(accountId, oldTokenId, true, [PayloadAction.addRemoveToken]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(tokenId, s.attestationData, signedToken);
      verifyCorrectTokenId(tokenId, activateTokenResponse.tokenId);
      return {
        accountId: accountId,
        state: 'AddToken',
        tokenId: s.tokenId,
        activatedData: activateTokenResponse
      };
    } catch (err) {
      var _err$response;

      if ((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          accountId: accountId,
          tokenId: tokenId,
          state: 'GettingTokenCertificate'
        };
      }

      throw err;
    }
  });
}
//# sourceMappingURL=ActivateRenewalHandler.js.map