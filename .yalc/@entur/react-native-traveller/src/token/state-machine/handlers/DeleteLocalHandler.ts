import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';

export default function deleteLocalHandler(): StateHandler {
  return stateHandlerFactory(['DeleteLocal'], async (s) => {
    deleteToken(s.accountId);
    return {
      accountId: s.accountId,
      state: 'InitiateNew',
    };
  });
}
