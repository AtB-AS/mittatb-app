import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function initiateRenewalHandler(abtTokensService) {
  return stateHandlerFactory(['InitiateRenewal'], async s => {
    const signedToken = await getSecureToken(s.accountId, [PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      accountId: s.accountId,
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map