import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
export default function deleteLocalHandler(getClientState) {
  return stateHandlerFactory(['DeleteLocal'], async _ => {
    const {
      accountId
    } = getClientState();
    deleteToken(accountId);
    return {
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map