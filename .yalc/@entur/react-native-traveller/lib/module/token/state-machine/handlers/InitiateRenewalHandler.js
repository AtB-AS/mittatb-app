import { getSecureToken } from '../../../native';
import { PayloadAction } from '../../../native/types';
import { stateHandlerFactory } from '../HandlerFactory';
export default function initiateRenewalHandler(abtTokensService) {
  return stateHandlerFactory(['InitiateRenewal'], async () => {
    const signedToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map