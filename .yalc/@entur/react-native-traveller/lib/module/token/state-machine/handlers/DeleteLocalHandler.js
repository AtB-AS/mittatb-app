import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
export default function deleteLocalHandler() {
  return stateHandlerFactory(['DeleteLocal'], async _ => {
    deleteToken();
    return {
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map