"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyInspectionActionHandler;

var _HandlerFactory = require("../HandlerFactory");

var _utils = require("../utils");

function verifyInspectionActionHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['VerifyInspectionAction'], async ({
    accountId,
    tokenId
  }) => {
    const {
      tokens
    } = await abtTokensService.toggleToken(tokenId, {
      overrideExisting: false
    });
    return {
      accountId,
      state: 'Valid',
      isInspectable: (0, _utils.isTokenInspectable)(tokens, tokenId)
    };
  });
}
//# sourceMappingURL=VerifyInspectionActionHandler.js.map