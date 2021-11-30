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
    return {
      accountId: s.accountId,
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map