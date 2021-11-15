import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';

export default function deleteLocalHandler(
  accountId: string
): StateHandler {
  return stateHandlerFactory(['DeleteLocal'], async (_) => {
    deleteToken(accountId);
    return { state: 'InitiateNew' };
  });
}
