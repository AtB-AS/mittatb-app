"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initiateRenewalHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _HandlerFactory = require("../HandlerFactory");

function initiateRenewalHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['InitiateRenewal'], async s => {
    const signedToken = await (0, _native.getSecureToken)(s.accountId, s.tokenId, true, [_types.PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      accountId: s.accountId,
      oldTokenId: s.tokenId,
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map