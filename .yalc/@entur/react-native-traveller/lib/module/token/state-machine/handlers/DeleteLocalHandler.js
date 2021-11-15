import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
export default function deleteLocalHandler(accountId) {
  return stateHandlerFactory(['DeleteLocal'], async _ => {
    deleteToken(accountId);
    return {
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map