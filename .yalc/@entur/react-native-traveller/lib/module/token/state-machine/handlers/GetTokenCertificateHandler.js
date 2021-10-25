import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function getTokenCertificateHandler(abtTokensService) {
  return stateHandlerFactory(['GettingTokenCertificate'], async _ => {
    const signedToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      state: 'AddToken',
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map