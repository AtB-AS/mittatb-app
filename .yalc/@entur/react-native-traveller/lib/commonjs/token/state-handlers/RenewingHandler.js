"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renewingHandler;

var _attest = require("../attest");

var _native = require("../../native");

var _types = require("../../native/types");

var _utils = require("./utils");

async function renewingHandler(abtTokensService) {
  try {
    const existingToken = await (0, _native.getSecureToken)([_types.PayloadAction.addRemoveToken]);
    const {
      tokenId: initialTokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await abtTokensService.renewToken({
      existingToken
    });
    const activateTokenRequestBody = await (0, _attest.getActivateTokenRequestBody)(initialTokenId, nonce, attestationEncryptionPublicKey);
    const {
      certificate,
      tokenId,
      tokenValidityEnd,
      tokenValidityStart
    } = await abtTokensService.activateToken(initialTokenId, { ...activateTokenRequestBody,
      existingToken
    });
    (0, _utils.verifyCorrectTokenId)(initialTokenId, tokenId);
    await (0, _native.addToken)(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
    return {
      state: 'Valid'
    };
  } catch (err) {
    return {
      state: 'Renewing',
      error: {
        type: 'Unknown',
        message: 'Error renewing token',
        err
      }
    };
  }
}
//# sourceMappingURL=RenewingHandler.js.map