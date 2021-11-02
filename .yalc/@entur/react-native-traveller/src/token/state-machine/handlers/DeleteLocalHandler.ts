import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';

export default function deleteLocalHandler(): StateHandler {
  return stateHandlerFactory(['DeleteLocal'], async (_) => {
    deleteToken();
    return { state: 'InitiateNew' };
  });
}
