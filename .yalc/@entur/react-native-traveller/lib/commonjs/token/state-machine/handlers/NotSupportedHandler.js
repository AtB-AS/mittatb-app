"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notSupportedHandler;

var _logger = require("../../../logger");

var _HandlerFactory = require("../HandlerFactory");

function notSupportedHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['NotSupported'], async s => {
    _logger.logger.info('not_supported', undefined, {
      accountId: s.accountId
    });

    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map