import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';
export default function getTokenCertificateHandler(abtTokensService) {
  return stateHandlerFactory(['GettingTokenCertificate'], async s => {
    const {
      accountId,
      tokenId,
      state
    } = s;
    logger.info('mobiletoken_status_change', undefined, {
      state,
      accountId,
      tokenId
    });
    const signedToken = await getSecureToken(accountId, tokenId, false, [PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map