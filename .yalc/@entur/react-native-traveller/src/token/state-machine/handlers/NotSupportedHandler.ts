import { logger } from '../../../logger';
import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function notSupportedHandler(): StateHandler {
  return stateHandlerFactory(['NotSupported'], async (s) => {
    logger.info('not_supported', undefined, { accountId: s.accountId });
    return s;
  });
}
