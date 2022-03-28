import { logger } from '../../../logger';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function notSupportedHandler(): StateHandler {
  return stateHandlerFactory(['NotSupported'], async (s) => {
    const { accountId, state } = s;
    logger.info('mobiletoken_status_change', undefined, {
      accountId,
      state,
    });
    return s;
  });
}
