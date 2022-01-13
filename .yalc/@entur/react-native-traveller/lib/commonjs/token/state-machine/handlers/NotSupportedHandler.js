"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notSupportedHandler;

var _HandlerFactory = require("../HandlerFactory");

function notSupportedHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['NotSupported'], async s => {
    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map