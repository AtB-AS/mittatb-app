"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = activateRenewalHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _utils = require("../utils");

var _HandlerFactory = require("../HandlerFactory");

function activateRenewalHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['ActivateRenewal'], async s => {
    const signedToken = await (0, _native.getSecureToken)(s.accountId, s.oldTokenId, true, [_types.PayloadAction.addRemoveToken]);

    try {
      const activateTokenResponse = await abtTokensService.activateToken(s.tokenId, s.attestationData, signedToken);
      (0, _utils.verifyCorrectTokenId)(s.tokenId, activateTokenResponse.tokenId);
      return {
        accountId: s.accountId,
        state: 'AddToken',
        activatedData: activateTokenResponse
      };
    } catch (err) {
      var _err$response;

      if ((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 409) {
        // The token has already been renewed. May happen if retrying after timeout.
        return {
          accountId: s.accountId,
          tokenId: s.tokenId,
          state: 'GettingTokenCertificate'
        };
      }

      throw err;
    }
  });
}
//# sourceMappingURL=ActivateRenewalHandler.js.map