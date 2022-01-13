import { verifyCorrectTokenId } from '../utils';
import { stateHandlerFactory } from '../HandlerFactory';
export default function activateNewHandler(abtTokensService) {
  return stateHandlerFactory(['ActivateNew'], async s => {
    const activateTokenResponse = await abtTokensService.activateToken(s.tokenId, s.attestationData);
    verifyCorrectTokenId(s.tokenId, activateTokenResponse.tokenId);
    return {
      accountId: s.accountId,
      state: 'AddToken',
      activatedData: activateTokenResponse
    };
  });
}
//# sourceMappingURL=ActivateNewHandler.js.map