"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = activateNewHandler;

var _utils = require("../utils");

var _HandlerFactory = require("../HandlerFactory");

function activateNewHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['ActivateNew'], async s => {
    const activateTokenResponse = await abtTokensService.activateToken(s.tokenId, s.attestationData);
    (0, _utils.verifyCorrectTokenId)(s.tokenId, activateTokenResponse.tokenId);
    return {
      state: 'AddToken',
      activatedData: activateTokenResponse
    };
  });
}
//# sourceMappingURL=ActivateNewHandler.js.map