"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validatingHandler;

var _HandlerFactory = require("../HandlerFactory");

var _native = require("../../../native");

var _types = require("../../../native/types");

var _logger = require("../../../logger");

function validatingHandler(abtTokensService) {
  return (0, _HandlerFactory.stateHandlerFactory)(['Validating'], async s => {
    const {
      accountId,
      tokenId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
    });

    const signedToken = await (0, _native.getSecureToken)(accountId, tokenId, true, [_types.PayloadAction.getFarecontracts]);
    const {
      state: validationState
    } = await abtTokensService.validateToken(tokenId, signedToken);

    _logger.logger.info('mobiletoken_validation_state', undefined, {
      validationState
    });

    switch (validationState) {
      case 'Valid':
        return {
          accountId,
          state: 'Valid',
          tokenId
        };

      case 'NotFound':
      case 'NeedsReplacement':
        return {
          accountId,
          state: 'DeleteLocal'
        };

      case 'NeedsRenewal':
        return {
          accountId,
          tokenId,
          state: 'InitiateRenewal'
        };
    }
  });
}
//# sourceMappingURL=ValidatingHandler.js.map