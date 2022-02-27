import type { AbtTokensService } from '../../abt-tokens-service';
import { verifyCorrectTokenId } from '../utils';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function activateNewHandler(
  abtTokensService: AbtTokensService
): StateHandler {
  return stateHandlerFactory(['ActivateNew'], async (s) => {
    const activateTokenResponse = await abtTokensService.activateToken(
      s.tokenId,
      s.attestationData
    );

    verifyCorrectTokenId(s.tokenId, activateTokenResponse.tokenId);
    return {
      accountId: s.accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: activateTokenResponse,
    };
  });
}
