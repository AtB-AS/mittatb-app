import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
export default function deleteLocalHandler() {
  return stateHandlerFactory(['DeleteLocal'], async s => {
    deleteToken(s.accountId);
    return {
      accountId: s.accountId,
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map