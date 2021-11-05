import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function getTokenCertificateHandler(abtTokensService, getClientState) {
  return stateHandlerFactory(['GettingTokenCertificate'], async _ => {
    const {
      accountId
    } = getClientState();
    const signedToken = await getSecureToken(accountId, [PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      state: 'AddToken',
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map