"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = activateNewHandler;

var _utils = require("../utils");

var _HandlerFactory = require("../HandlerFactory");

var _logger = require("../../../logger");

function activateNewHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['ActivateNew'], async s => {
    const {
      tokenId,
      accountId
    } = s;

    _logger.logger.info('activate_new', undefined, {
      tokenId,
      accountId
    });

    const activateTokenResponse = await abtTokensService.activateToken(tokenId, s.attestationData);
    (0, _utils.verifyCorrectTokenId)(tokenId, activateTokenResponse.tokenId);
    return {
      accountId: accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: activateTokenResponse
    };
  });
}
//# sourceMappingURL=ActivateNewHandler.js.map