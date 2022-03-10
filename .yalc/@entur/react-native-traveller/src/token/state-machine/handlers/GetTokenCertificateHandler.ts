import { getSecureToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { PayloadAction } from '../../../native/types';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';

export default function getTokenCertificateHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['GettingTokenCertificate'], async (s) => {
    const { accountId, tokenId } = s;
    logger.info('get_token_cert', undefined, { accountId, tokenId });

    const signedToken = await getSecureToken(accountId, tokenId, false, [
      PayloadAction.addRemoveToken,
    ]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(
      signedToken
    );
    return {
      accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: tokenCertificateResponse,
    };
  });
}
