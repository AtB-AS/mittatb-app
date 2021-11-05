import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function initiateRenewalHandler(abtTokensService, getClientState) {
  return stateHandlerFactory(['InitiateRenewal'], async () => {
    const {
      accountId
    } = getClientState();
    const signedToken = await getSecureToken(accountId, [PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map