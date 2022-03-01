"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

var _types = require("../../../native/types");

function validatingHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Validating'], async s => {
    const signedToken = await (0, _native.getSecureToken)(s.accountId, s.tokenId, true, [_types.PayloadAction.getFarecontracts]);
    const validationResponse = await abtTokensService.validateToken(s.tokenId, signedToken);

    switch (validationResponse.state) {
      case 'Valid':
        return {
          accountId: s.accountId,
          state: 'Valid',
          tokenId: s.tokenId
        };

      case 'NotFound':
      case 'NeedsReplacement':
        return {
          accountId: s.accountId,
          state: 'DeleteLocal'
        };

      case 'NeedsRenewal':
        return {
          accountId: s.accountId,
          tokenId: s.tokenId,
          state: 'InitiateRenewal'
        };
    }
  });
}
//# sourceMappingURL=ValidatingHandler.js.map