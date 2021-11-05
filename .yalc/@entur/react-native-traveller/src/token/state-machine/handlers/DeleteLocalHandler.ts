import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
import type { ClientStateRetriever } from '../../..';

export default function deleteLocalHandler(
  getClientState: ClientStateRetriever
): StateHandler {
  return stateHandlerFactory(['DeleteLocal'], async (_) => {
    const { accountId } = getClientState();
    deleteToken(accountId);
    return { state: 'InitiateNew' };
  });
}
