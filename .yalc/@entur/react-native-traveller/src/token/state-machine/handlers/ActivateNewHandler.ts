import type { AbtTokensService } from '../../abt-tokens-service';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';
import { logger } from '../../../logger';

export default function activateNewHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['ActivateNew'], async (s) => {
    const { tokenId, accountId } = s;
    logger.info('activate_new', undefined, { tokenId, accountId });

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
