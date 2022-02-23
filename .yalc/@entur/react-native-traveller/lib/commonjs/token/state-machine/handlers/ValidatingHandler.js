"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

var _types = require("../../../native/types");

var _utils = require("../utils");

function validatingHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Validating'], async s => {
    const signedToken = await (0, _native.getSecureToken)(s.accountId, s.token.tokenId, true, [_types.PayloadAction.getFarecontracts]);
    const validationResponse = await abtTokensService.validateToken(s.token.tokenId, signedToken);

    switch (validationResponse.state) {
      case 'Valid':
        const tokens = await abtTokensService.listTokens();
        return {
          accountId: s.accountId,
          state: 'Valid',
          isInspectable: (0, _utils.isTokenInspectable)(tokens, s.token.tokenId)
        };

      case 'NotFound':
        return {
          accountId: s.accountId,
          state: 'DeleteLocal'
        };

      case 'NeedsRenewal':
        return {
          accountId: s.accountId,
          tokenId: s.token.tokenId,
          state: 'InitiateRenewal'
        };
    }
  });
}
//# sourceMappingURL=ValidatingHandler.js.map