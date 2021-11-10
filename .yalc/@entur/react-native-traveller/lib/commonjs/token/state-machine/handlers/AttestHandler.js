"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = attestHandler;

var _attest = require("../../attest");

var _HandlerFactory = require("../HandlerFactory");

function attestHandler(getClientState) {
  return (0, _HandlerFactory.stateHandlerFactory)(['AttestNew', 'AttestRenewal'], async s => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = s.initiatedData;
    const {
      accountId
    } = getClientState();
    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(accountId, tokenId, nonce, attestationEncryptionPublicKey);
    return {
      state: s.state === 'AttestNew' ? 'ActivateNew' : 'ActivateRenewal',
      tokenId: tokenId,
      attestationData: activateTokenRequestBody
    };
  });
}
//# sourceMappingURL=AttestHandler.js.map