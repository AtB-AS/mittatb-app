import { stateHandlerFactory } from '../HandlerFactory';
export default function notSupportedHandler() {
  return stateHandlerFactory(['NotSupported'], async s => {
    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map