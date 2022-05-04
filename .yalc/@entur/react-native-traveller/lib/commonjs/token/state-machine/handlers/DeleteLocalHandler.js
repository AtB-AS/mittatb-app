"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteLocalHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

var _logger = require("../../../logger");

function deleteLocalHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['DeleteLocal'], async s => {
    const {
      accountId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      state
    });

    (0, _native.deleteToken)(accountId);
    return {
      accountId: accountId,
      state: 'InitiateNew'
    };
  });
}
//# sourceMappingURL=DeleteLocalHandler.js.map