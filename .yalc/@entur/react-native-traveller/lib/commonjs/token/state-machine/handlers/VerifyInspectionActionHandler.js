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
    tokenId
  }) => {
    _logger.logger.info('verify_inspection_action', undefined, {
      accountId,
      tokenId
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