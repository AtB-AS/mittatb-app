import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { verifyCorrectTokenId } from '../utils';
import { stateHandlerFactory } from '../HandlerFactory';
export default function activateRenewalHandler(abtTokensService, getClientState) {
  return stateHandlerFactory(['ActivateRenewal'], async s => {
    const {
      accountId
    } = getClientState();
    const signedToken = await getSecureToken(accountId, [PayloadAction.addRemoveToken]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(s.tokenId, s.attestationData, signedToken);
      verifyCorrectTokenId(s.tokenId, activateTokenResponse.tokenId);
      return {
        state: 'AddToken',
        activatedData: activateTokenResponse
      };
    } catch (err) {
      var _err$response;

      if ((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          state: 'GettingTokenCertificate'
        };
      }

      throw err;
    }
  });
}
//# sourceMappingURL=ActivateRenewalHandler.js.map