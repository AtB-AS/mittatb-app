"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = attestHandler;

var _logger = require("../../../logger");

var _attest = require("../../attest");

var _HandlerFactory = require("../HandlerFactory");

function attestHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['AttestNew', 'AttestRenewal'], async s => {
    const {
      initiatedData: {
        tokenId,
        nonce,
        attestationEncryptionPublicKey
      },
      accountId,
      state
    } = s;

    _logger.logger.info('mobiletoken_status_change', undefined, {
      accountId,
      tokenId,
      state
    });

    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(accountId, tokenId, nonce, attestationEncryptionPublicKey);

    if (s.state !== 'AttestNew') {
      return {
        accountId: accountId,
        state: 'ActivateRenewal',
        oldTokenId: s.oldTokenId,
        tokenId: tokenId,
        attestationData: activateTokenRequestBody
      };
    }

    return {
      accountId: accountId,
      state: 'ActivateNew',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map