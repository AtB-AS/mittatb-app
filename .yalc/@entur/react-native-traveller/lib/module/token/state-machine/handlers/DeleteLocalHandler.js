import { stateHandlerFactory } from '../HandlerFactory';
import { deleteToken } from '../../../native';
import { logger } from '../../../logger';
export default function deleteLocalHandler() {
  return stateHandlerFactory(['DeleteLocal'], async s => {
    const {
      accountId,
      state
    } = s;
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      state
    });
    deleteToken(accountId);
    return {
      accountId: accountId,
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map