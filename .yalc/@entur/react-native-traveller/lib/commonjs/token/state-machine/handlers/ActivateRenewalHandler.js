"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = activateRenewalHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _utils = require("../utils");

var _HandlerFactory = require("../HandlerFactory");

var _logger = require("../../../logger");

function activateRenewalHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['ActivateRenewal'], async s => {
    const {
      accountId,
      oldTokenId,
      tokenId
    } = s;

    _logger.logger.info('activate_renewal', undefined, {
      accountId,
      oldTokenId,
      tokenId
    });

    const signedToken = await (0, _native.getSecureToken)(accountId, oldTokenId, true, [_types.PayloadAction.addRemoveToken]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(tokenId, s.attestationData, signedToken);
      (0, _utils.verifyCorrectTokenId)(tokenId, activateTokenResponse.tokenId);
      return {
        accountId: accountId,
        state: 'AddToken',
        tokenId: s.tokenId,
        activatedData: activateTokenResponse
      };
    } catch (err) {
      var _err$response;

      if ((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          accountId: accountId,
          tokenId: tokenId,
          state: 'GettingTokenCertificate'
        };
      }

      throw err;
    }
  });
}
//# sourceMappingURL=ActivateRenewalHandler.js.map