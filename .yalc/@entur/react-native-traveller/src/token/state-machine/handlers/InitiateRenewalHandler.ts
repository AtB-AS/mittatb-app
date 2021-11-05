import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import type { ClientStateRetriever } from '../../..';

export default function initiateRenewalHandler(
  abtTokensService: AbtTokensService,
  getClientState: ClientStateRetriever
): StateHandler {
  return stateHandlerFactory(['InitiateRenewal'], async () => {
    const { accountId } = getClientState();
    const signedToken = await getSecureToken(accountId, [
      PayloadAction.addRemoveToken,
    ]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return { state: 'AttestRenewal', initiatedData: renewTokenResponse };
  });
}
