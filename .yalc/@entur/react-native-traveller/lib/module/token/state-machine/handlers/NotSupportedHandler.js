import { logger } from '../../../logger';
import { stateHandlerFactory } from '../HandlerFactory';
export default function notSupportedHandler() {
  return stateHandlerFactory(['NotSupported'], async s => {
    logger.info('not_supported', undefined, {
      accountId: s.accountId
    });
    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map