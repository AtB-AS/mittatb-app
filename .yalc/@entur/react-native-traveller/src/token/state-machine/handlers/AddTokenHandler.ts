import type { ClientState } from '../../..';
import { addToken } from '../../../native';
import { StateHandler, stateHandlerFactory } from '../HandlerFactory';

export default function addTokenHandler(
  getClientState: () => Required<ClientState>
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
