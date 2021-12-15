import type { StateHandler } from '../HandlerFactory';
import { stateHandlerFactory } from '../HandlerFactory';

export default function notSupportedHandler(): StateHandler {
  return stateHandlerFactory(['NotSupported'], async (s) => {
    return s;
  });
}
