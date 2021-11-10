import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import type { ClientState } from '../../..';

export default function getTokenCertificateHandler(
  abtTokensService: AbtTokensService,
  getClientState: () => Required<ClientState>
): StateHandler {
  return stateHandlerFactory(['GettingTokenCertificate'], async (_) => {
    const { accountId } = getClientState();
    const signedToken = await getSecureToken(accountId, [
      PayloadAction.addRemoveToken,
    ]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(
      signedToken
    );
    return { state: 'AddToken', activatedData: tokenCertificateResponse };
  });
}
