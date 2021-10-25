"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = attestHandler;

var _attest = require("../../attest");

var _HandlerFactory = require("../HandlerFactory");

function attestHandler(_) {
  return (0, _HandlerFactory.stateHandlerFactory)(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(tokenId, nonce, attestationEncryptionPublicKey);
    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map