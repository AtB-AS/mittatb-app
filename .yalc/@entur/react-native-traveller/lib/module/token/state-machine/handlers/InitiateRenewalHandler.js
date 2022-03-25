import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';
export default function initiateRenewalHandler(abtTokensService) {
  return stateHandlerFactory(['InitiateRenewal'], async s => {
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
    const signedToken = await getSecureToken(accountId, tokenId, true, [PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      accountId,
      oldTokenId: tokenId,
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map