import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function initiateRenewalHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['InitiateRenewal'], async () => {
    const signedToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return { state: 'AttestRenewal', initiatedData: renewTokenResponse };
  });
}
