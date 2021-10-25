import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function getTokenCertificateHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['GettingTokenCertificate'], async (_) => {
    const signedToken = await getSecureToken([PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(
      signedToken
    );
    return { state: 'AddToken', activatedData: tokenCertificateResponse };
  });
}
