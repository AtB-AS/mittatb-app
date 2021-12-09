"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = attestHandler;

var _attest = require("../../attest");

var _HandlerFactory = require("../HandlerFactory");

function attestHandler() {
  return (0, _HandlerFactory.stateHandlerFactory)(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(s.accountId, tokenId, nonce, attestationEncryptionPublicKey);

    if (s.state !== 'AttestNew') {
      return {
        accountId: s.accountId,
        state: 'ActivateRenewal',
        oldTokenId: s.oldTokenId,
        tokenId: tokenId,
        attestationData: activateTokenRequestBody
      };
    }

    return {
      accountId: s.accountId,
      state: 'ActivateNew',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map