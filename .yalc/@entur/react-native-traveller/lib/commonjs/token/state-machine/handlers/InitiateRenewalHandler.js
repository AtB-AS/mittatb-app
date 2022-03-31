"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initiateRenewalHandler;

var _native = require("../../../native");

var _types = require("../../../native/types");

var _HandlerFactory = require("../HandlerFactory");

var _logger = require("../../../logger");

function initiateRenewalHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['InitiateRenewal'], async s => {
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

    const signedToken = await (0, _native.getSecureToken)(accountId, tokenId, true, [_types.PayloadAction.addRemoveToken]);
    const renewTokenResponse = await abtTokensService.renewToken(signedToken);
    return {
      accountId,
      oldTokenId: tokenId,
      state: 'AttestRenewal',
      initiatedData: renewTokenResponse
    };
  });
}
//# sourceMappingURL=InitiateRenewalHandler.js.map