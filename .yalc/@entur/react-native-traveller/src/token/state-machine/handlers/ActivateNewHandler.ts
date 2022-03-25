import type { AbtTokensService } from '../../abt-tokens-service';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';

export default function activateNewHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['ActivateNew'], async (s) => {
    const { tokenId, accountId, state } = s;
    logger.info('mobiletoken_status_change', undefined, { tokenId, accountId, state });

    const activateTokenResponse = await abtTokensService.activateToken(
      tokenId,
      s.attestationData
    );

    verifyCorrectTokenId(tokenId, activateTokenResponse.tokenId);

    return {
      accountId: accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: activateTokenResponse,
    };
  });
}
