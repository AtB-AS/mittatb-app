"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addTokenHandler;

var _logger = require("../../../logger");

var _native = require("../../../native");

var _HandlerFactory = require("../HandlerFactory");

function addTokenHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['AddToken'], async s => {
    const {
      activatedData: {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart
      },
      accountId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
    });

    await (0, _native.addToken)(accountId, tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      accountId,
      state: 'VerifyInspectionAction',
      tokenId
    };
  });
}
//# sourceMappingURL=AddTokenHandler.js.map