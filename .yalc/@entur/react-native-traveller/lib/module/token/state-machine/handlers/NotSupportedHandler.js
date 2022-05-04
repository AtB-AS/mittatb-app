import { logger } from '../../../logger';
import { stateHandlerFactory } from '../HandlerFactory';
export default function notSupportedHandler() {
  return stateHandlerFactory(['NotSupported'], async s => {
    const {
      accountId,
      state
    } = s;
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      state
    });
    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map