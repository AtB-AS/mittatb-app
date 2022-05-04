"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTokenCertificateHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _HandlerFactory = require("../HandlerFactory");

var _logger = require("../../../logger");

function getTokenCertificateHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['GettingTokenCertificate'], async s => {
    const {
      accountId,
      tokenId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      state,
      accountId,
      tokenId
    });

    const signedToken = await (0, _native.getSecureToken)(accountId, tokenId, false, [_types.PayloadAction.addRemoveToken]);
    const tokenCertificateResponse = await abtTokensService.getTokenCertificate(signedToken);
    return {
      accountId,
      state: 'AddToken',
      tokenId: s.tokenId,
      activatedData: tokenCertificateResponse
    };
  });
}
//# sourceMappingURL=GetTokenCertificateHandler.js.map