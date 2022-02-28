"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyInspectionActionHandler;

var _HandlerFactory = require("../HandlerFactory");

function verifyInspectionActionHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['VerifyInspectionAction'], async ({
    accountId,
    tokenId
  }) => {
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