import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function getTokenCertificateHandler(abtTokensService) {
  return stateHandlerFactory(['GettingTokenCertificate'], async s => {
    const signedToken = await getSecureToken(s.accountId, s.tokenId, false, [PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      accountId: s.accountId,
      state: 'AddToken',
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map