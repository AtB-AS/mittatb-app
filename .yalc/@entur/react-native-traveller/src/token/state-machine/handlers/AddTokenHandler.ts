import type { ClientStateRetriever } from '../../..';
import { addToken } from '../../../native';
import type { AbtTokensService } from '../../abt-tokens-service';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function addTokenHandler(
  _: AbtTokensService,
  getClientState: ClientStateRetriever
): StateHandler {
  return stateHandlerFactory(['AddToken'], async (s) => {
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart,
    } = s.activatedData;

    const { accountId } = getClientState();
    await addToken(
      accountId,
      tokenId,
      certificate,
      tokenValidityStart,
      tokenValidityEnd
    );
    return { state: 'Valid' };
  });
}
