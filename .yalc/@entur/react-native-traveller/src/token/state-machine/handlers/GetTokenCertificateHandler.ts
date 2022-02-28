import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function getTokenCertificateHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['GettingTokenCertificate'], async (s) => {
    const signedToken = await getSecureToken(s.accountId, s.tokenId, false, [
      PayloadAction.addRemoveToken,
    ]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(
      signedToken
    );
    return {
      accountId: s.accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: tokenCertificateResponse,
    };
  });
}
