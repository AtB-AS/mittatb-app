"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyInspectionActionHandler;

var _logger = require("../../../logger");

var _HandlerFactory = require("../HandlerFactory");

function verifyInspectionActionHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['VerifyInspectionAction'], async ({
    accountId,
    tokenId,
    state
  }) => {
    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
    });

    await abtTokensService.toggleToken(tokenId, {
      overrideExisting: false
    });
    return {
      accountId,
      state: 'Valid',
      tokenId
    };
  });
}
//# sourceMappingURL=VerifyInspectionActionHandler.js.map