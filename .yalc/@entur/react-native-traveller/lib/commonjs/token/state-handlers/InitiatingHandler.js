"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initiatingHandler;

var _attest = require("../attest");

var _native = require("../../native");

var _utils = require("./utils");

var _reactNative = require("react-native");

const requireAttestation = _reactNative.Platform.select({
  default: true,
  ios: false
});

async function initiatingHandler(abtTokensService) {
  try {
    const {
      tokenId: initialTokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await abtTokensService.initToken({
      requireAttestation
    });
    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(initialTokenId, nonce, attestationEncryptionPublicKey);
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = await abtTokensService.activateToken(initialTokenId, activateTokenRequestBody);
    (0, _utils.verifyCorrectTokenId)(initialTokenId, tokenId);
    await (0, _native.addToken)(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  } catch (err) {
    return {
      state: 'Initiating',
      error: {
        type: 'Unknown',
        message: 'Error initiating new token',
        err
      }
    };
  }
}
//# sourceMappingURL=InitiatingHandler.js.map