"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = notSupportedHandler;

var _logger = require("../../../logger");

var _HandlerFactory = require("../HandlerFactory");

function notSupportedHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['NotSupported'], async s => {
    const {
      accountId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      state
    });

    return s;
  });
}
//# sourceMappingURL=NotSupportedHandler.js.map