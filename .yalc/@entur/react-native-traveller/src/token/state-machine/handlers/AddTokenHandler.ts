import { addToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function addTokenHandler(_: AbtTokensService): StateHandler {
  return stateHandlerFactory(['AddToken'], async (s) => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart,
    } = s.activatedData;

    await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return { state: 'Valid' };
  });
}
