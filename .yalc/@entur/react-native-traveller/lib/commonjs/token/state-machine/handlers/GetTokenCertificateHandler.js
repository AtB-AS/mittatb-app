"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTokenCertificateHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _HandlerFactory = require("../HandlerFactory");

function getTokenCertificateHandler(abtTokensService, accountId) {
  return (0, _HandlerFactory.stateHandlerFactory)(['GettingTokenCertificate'], async _ => {
    const signedToken = await (0, _native.getSecureToken)(accountId, [_types.PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      state: 'AddToken',
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map